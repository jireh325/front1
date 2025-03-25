<script lang="ts">
import { defineComponent, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
  name: 'SignupView',

  setup() {
    const authStore = useAuthStore();

    const state = ref({
      firstName: "",
      lastName: "",
      email: "",
      pass: "",
    });

    const visible = ref(false);
    const loading = ref(false);
    const errorMessage = ref("");

    const rules = {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      pass: { required, minLength: minLength(10) },
    };

    const v$ = useVuelidate(rules, state);

    const handleSignup = async () => {
      v$.value.$touch();
      if (v$.value.$invalid) {
        console.log("Le formulaire contient des erreurs.");
        return;
      }

      loading.value = true;
      errorMessage.value = "";

      try {
        const success = await authStore.signup({
          firstName: state.value.firstName,
          lastName: state.value.lastName,
          email: state.value.email,
          pass: state.value.pass,
        });

        if (!success) {
          errorMessage.value = "Entrée incorrecte";
        }
      } catch (error: any) {
        errorMessage.value = error.response?.data?.message || "Une erreur s'est produite lors de la connexion.";
        console.error("Erreur de connexion :", error);
      } finally {
        loading.value = false;
      }
    };

    return { state, v$, loading, visible, errorMessage, handleSignup };
  },
});
</script>

<template>
  <v-container class="signup" fluid>
    <v-card class="auth-card">
      <v-card-title class="auth-title">Signup</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSignup">
          <v-text-field
            v-model="state.firstName"
            :error-messages="v$.firstName.$errors.map(e => e.$message).join(', ')"
            label="First Name"
            required
            clearable
            variant="outlined"
            density="compact"
          ></v-text-field>

          <v-text-field
            v-model="state.lastName"
            :error-messages="v$.lastName.$errors.map(e => e.$message).join(', ')"
            label="Last Name"
            required
            clearable
            variant="outlined"
            density="compact"
          ></v-text-field>

          <v-text-field
            v-model="state.email"
            :error-messages="v$.email.$errors.map(e => e.$message).join(', ')"
            label="Email"
            type="email"
            required
            clearable
            variant="outlined"
            density="compact"
          ></v-text-field>

          <v-text-field
            v-model="state.pass"
            :error-messages="v$.pass.$errors.map(e => e.$message).join(', ')"
            label="Password"
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

          <v-btn
            :disabled="v$.$invalid || loading"
            :loading="loading"
            class="auth-btn"
            size="large"
            type="submit"
            block
          >
            Sign Up
          </v-btn>
        </v-form>

        <v-card-text class="text-center">
          <router-link class="auth-link" to="/login">
            Vous avez déjà un compte? Connectez-vous
          </router-link>
        </v-card-text>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.signup {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.auth-card {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.auth-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.auth-btn {
  background-color: #5d6b8d;
  color: white;
}

.auth-btn:hover {
  background-color: #4a587a;
}

.auth-link {
  color: #5d6b8d;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
