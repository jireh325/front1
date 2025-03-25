<script lang="ts">
import { defineComponent, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router'; 

export default defineComponent({
  name: 'LoginView',

  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const state = ref({
      email: "",
      pass: "",
    });

    const visible = ref(false); 
    const loading = ref(false); 
    const errorMessage = ref(""); 

    const rules = {
      email: { required, email },
      pass: { required, minLength: minLength(10) },
    };

    const v$ = useVuelidate(rules, state);

    const handleLogin = async () => {
      v$.value.$touch(); 
      if (v$.value.$invalid) {
        console.log("Le formulaire contient des erreurs.");
        return;
      }

      loading.value = true; 
      errorMessage.value = ""; 

      try {
        const success = await authStore.login({ email: state.value.email, pass: state.value.pass });
        if (success) {
          router.push('/home');
        } else {
          errorMessage.value = "Email ou mot de passe incorrect.";
        }
      } catch (error) {
        errorMessage.value = "Une erreur s'est produite lors de la connexion.";
        console.error("Erreur de connexion :", error);
      } finally {
        loading.value = false; 
      }
    };

    return { state, v$, loading, visible, errorMessage, handleLogin };
  },
});
</script>

<template>
  <v-container class="login" fluid>
    <v-card class="log">
      <v-card-title class="login-title">Connexion</v-card-title>
      <v-card-text class="pa-6">
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="state.email"
            :error-messages="v$.email.$errors.map(e => e.$message).join(', ')"
            label="Email"
            required
            clearable
            type="email"
            variant="outlined"
            density="compact"
          ></v-text-field>

          <v-text-field
            v-model="state.pass"
            :error-messages="v$.pass.$errors.map(e => e.$message).join(', ')"
            label="Mot de passe"
            :type="visible ? 'text' : 'password'"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="visible = !visible"
            required
            clearable
            variant="outlined"
            density="compact"
          ></v-text-field>

          <v-alert v-if="errorMessage" type="error" class="mb-4">
            {{ errorMessage }}
          </v-alert>

          <div class="text-right mb-3">
            <router-link class="text-caption text-decoration-none text-blue" to="/forgot-password">
              Mot de passe oublié ?
            </router-link>
          </div>

          <v-btn :disabled="v$.$invalid" :loading="loading" class="sub-btn" size="large" type="submit" block>
            Se connecter
          </v-btn>
        </v-form>

        <v-card-text class="text-center">
          <router-link class="sign-link" to="/signup">
            Pas encore de compte ? Créez-en
          </router-link>
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.log {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.sub-btn {
  background-color: #5d6b8d;
  color: white;
}

.sub-btn:hover {
  background-color: #3e4a68;
}


.sub-btn:hover {
  background-color: #4a587a;
}

.sign-link {
  color: #5d6b8d;
  text-decoration: none;
}

.sign-link:hover {
  text-decoration: underline;
}
</style>
