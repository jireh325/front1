import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  pass: string;
  email: string;
}

export const useUserStore = defineStore('user', {

  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
  }),

  actions: {

    async fetchUsers() {
      const query = `{ getAllUsers { id firstName lastName pass email } }`;
      const response = await axios.post('/graphql', { query });
      this.users = response.data.data.getAllUsers;
    },

    async fetchUser(id: string) {
      const query = `{ getOneUser(id: "${id}") { id firstName lastName pass email } }`;
      const response = await axios.post('/graphql', { query });
      this.selectedUser = response.data.data.getOneUser;
    },

    async createUser(user: User) {
      const mutation = `
        mutation {
          createUser(userInput: { firstName: "${user.firstName}", lastName: "${user.lastName}", pass: "${user.pass}", email: "${user.email}" }) {
            id firstName lastName pass email
          }
        }
      `;
      const response = await axios.post('/graphql', { query: mutation });
      this.users.push(response.data.data.createUser);
    },

    async updateUser(user: User) {
      const mutation = `
        mutation {
          updateUser(id: "${user.id}", userInput: { firstName: "${user.firstName}", lastName: "${user.lastName}", pass: "${user.pass}", email: "${user.email}" }) {
            id firstName lastName pass email
          }
        }
      `;
      const response = await axios.post('/graphql', { query: mutation });
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index] = response.data.data.updateUser;
      }
    },

    async deleteUser(id: string) {
      const mutation = `
        mutation {
          deleteUser(id: "${id}")
        }
      `;
      await axios.post('/graphql', { query: mutation });
      this.users = this.users.filter(user => user.id !== id);
    },

  },
  getters: {
    allUsers: (state) => state.users,
    selectedUser: (state) => state.selectedUser,
  },
});
