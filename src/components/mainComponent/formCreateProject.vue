<script lang="ts">
import { defineComponent, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

export default defineComponent({
  name: "FormCreateProjectComponent",
  props: ["modelValue"],
  emits: ["update:modelValue", "create-project"], // Événements émis

  setup(props, { emit }) {
    
    const state = ref({
      name: "",
      desc: "",
    });

    const rules = {
      name: { required, maxLength: maxLength(10) }, // Validation : nom requis et max 10 caractères
      desc: { required }, // Validation : description requise
    };

    const v$ = useVuelidate(rules, state);

    // Fermer le dialogue
    const closeDialog = () => {
      emit("update:modelValue", false);
    };

    // Soumettre le formulaire
    const submitForm = async () => {
      const isFormValid = await v$.value.$validate(); // Valider le formulaire
      if (isFormValid) {
        emit("create-project", { name: state.value.name, description: state.value.desc }); // Émettre les données du projet
        closeDialog(); // Fermer le dialogue
        state.value.name = ""; // Réinitialiser le formulaire
        state.value.desc = "";
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
        <v-card-title class="headline">Création de projet</v-card-title>
        <v-card-text>
          <v-form fast-fail @submit.prevent="submitForm">
            <!-- Champ pour le nom du projet -->
            <v-text-field
              v-model="state.name"
              :counter="10"
              :error-messages="v$.name.$errors.map((e: any) => e.$message)"
              label="Nom du projet"
              required
              @blur="v$.name.$touch"
              @input="v$.name.$touch"
            ></v-text-field>

            <!-- Champ pour la description du projet -->
            <v-textarea
              required
              v-model="state.desc"
              :error-messages="v$.desc.$errors.map((e: any) => e.$message)"
              clearable
              label="Description"
              @blur="v$.desc.$touch"
              @input="v$.desc.$touch"
            ></v-textarea>

            <!-- Bouton de soumission -->
            <v-btn class="mt-2" type="submit" block>Créer</v-btn>
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