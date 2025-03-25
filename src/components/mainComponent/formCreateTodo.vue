<script lang="ts">
import { defineComponent, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useAuthStore } from '../../stores/authStore';


enum Status {
  isNostarted,
  isProgress,
  isFinished,
  created,
  deleted
}

export default defineComponent({
  name: "FormCreateTodoComponent",
  props: ["modelValue", "projectId"],
  emits: ["update:modelValue", "create-todo"],
  components: {
    VDateInput,
  },

  setup(props, { emit }) {

    const state = ref({
      title: "",
      desc: "",
      dateEcheance: null as Date | null, // Changez le type selon vos besoins
      status: Status[Status.isNostarted],
    });

    const rules = {
      title: { required, maxLength: maxLength(10) },
      desc: { required },
      dateEcheance: { required },
    };
    
    const v$ = useVuelidate(rules, state);

    const closeDialog = () => {
      emit("update:modelValue", false);
    };

    const submitForm = async () => {
      const authStore = useAuthStore(); // Importez et utilisez authStore
      const isFormValid = await v$.value.$validate(); // Valider le formulaire
      if (isFormValid) {
        emit("create-todo", {
          title: state.value.title,
          description: state.value.desc,
          dateExp: state.value.dateEcheance?.toISOString(), // Convertir la date en chaîne ISO
          status: state.value.status, // Ajouter un statut par défaut
          idProject: props.projectId, // Utiliser l'ID du projet passé en prop
          idCreateur: authStore.userConnected?.id, // Utiliser l'ID de l'utilisateur connecté
        });
        closeDialog(); // Fermer le dialogue
        state.value.title = ""; // Réinitialiser le formulaire
        state.value.desc = "";
        state.value.dateEcheance = null;
        v$.value.$reset(); // Réinitialiser la validation
      }
    };

    return { state, v$, closeDialog, submitForm };
  },
});
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="(value: any) => $emit('update:modelValue', value)"
  >
    <v-sheet class="mx-auto" width="800">
      <v-card>
        <v-card-title class="headline">Création de tache</v-card-title>
        <v-card-text>
          <v-form fast-fail @submit.prevent="submitForm">
            <v-text-field
              v-model="state.title"
              :counter="10"
              :error-messages="v$.title.$errors.map((e: any) => e.$message)"
              label="Titre"
              required
              @blur="v$.title.$touch"
              @input="v$.title.$touch"
            ></v-text-field>

            <v-date-input
              label="Select a date"
              prepend-icon=""
              prepend-inner-icon="$calendar"
              v-model="state.dateEcheance"
              :error-messages="v$.dateEcheance.$errors.map((e: any) => e.$message)"
              required
              @blur="v$.dateEcheance.$touch"
              @input="v$.dateEcheance.$touch"
            ></v-date-input>

            <v-textarea
              required
              v-model="state.desc"
              :error-messages="v$.desc.$errors.map((e: any) => e.$message)"
              clearable
              label="Description"
              @blur="v$.desc.$touch"
              @input="v$.desc.$touch"
            ></v-textarea>

            <v-btn class="mt-2" type="submit" block @click="v$.$validate"
              >Submit</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<style scoped>
form {
  z-index: 3;
  background: white;
}
</style>