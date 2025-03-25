import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface LoginDto {
  email: string;
  pass: string;
}

interface UserDto {
  id?: string;
  email: string;
  pass: string;
  firstName: string;
  lastName: string;
}

interface LoginResponse {
  token: string;
  expirationTime: number;
  user: UserDto;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    
    userConnected: (() => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          return JSON.parse(user) as UserDto;
        } catch (error) {
          console.error('Erreur lors du parsing de l\'utilisateur:', error);
          localStorage.removeItem('user'); // Supprimez la valeur corrompue
          return null;
        }
      }
      return null;
    })(),
    isAuthenticated: !!localStorage.getItem('token'),
    error: null as string | null,
  }),

  actions: {
    
    async signup(userDto: UserDto): Promise<boolean> {
      this.error = null;
      try {
        const response = await axios.post<UserDto>('http://back1-production-237e.up.railway.app/auth/signup', userDto);
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Erreur lors de l’inscription";
        return false;
      }
    },

    async login(loginDto: LoginDto): Promise<boolean> {
      this.error = null;
      try {
        const response = await axios.post<LoginResponse>('http://back1-production-237e.up.railway.app/auth/login', loginDto);
        if (!response.data.token || !response.data.user) {
          throw new Error('Réponse de connexion invalide');
        }

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Assurez-vous de bien stringify l'objet

        this.token = response.data.token;
        this.userConnected = response.data.user;
        this.isAuthenticated = true;

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Erreur de connexion';
        return false;
      }
    },

    logout() {
      this.token = null;
      this.userConnected = null;
      this.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    },

    checkAuth() {
      const token = localStorage.getItem('token');
      if (token && typeof token === 'string') {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          if (decodedToken.exp * 1000 > Date.now()) {
            this.token = token;
            this.isAuthenticated = true;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.defaults.headers.common['Content-Type'] = 'application/json';

          } else {
            this.logout();
          }
        } catch (error) {
          this.logout();
        }
      }
    },
  },
});