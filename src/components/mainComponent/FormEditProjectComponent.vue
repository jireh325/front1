<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";

interface Project {
  id?: string;
  name: string;
  description: string;
  idCreateur: string;
}

export default defineComponent({
  name: "FormEditProjectComponent",
  props: {
    modelValue: Boolean,
    project: {
      type: Object,
      default: () => ({ id: "", name: "", description: "" })
    }
  },
  emits: ["update:modelValue", "update-project"],

  setup(props, { emit }) {
    
    const state = ref({
      id: "",
      name: "",
      description: ""
    });

    // Mise à jour du state lorsque le projet change
    watch(() => props.project, (newProject) => {
      if (newProject) {
        state.value.id = newProject.id || "";
        state.value.name = newProject.name || "";
        state.value.description = newProject.description || "";
      }
    }, { immediate: true });

    const rules = {
      name: { required, maxLength: maxLength(10) },
      description: { required }
    };

    const v$ = useVuelidate(rules, state);

    const closeDialog = () => {
      emit("update:modelValue", false);
    };

    const submitForm = async () => {
      const isFormValid = await v$.value.$validate();
      if (isFormValid) {
        emit("update-project", { 
          id: state.value.id,
          name: state.value.name, 
          description: state.value.description 
        });
        closeDialog();
        v$.value.$reset();
      }
    };

    return { state, v$, closeDialog, submitForm };
  },
});
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  >
    <v-sheet class="mx-auto" width="800">
      <v-card>
        <v-card-title class="headline">Modifier le projet</v-card-title>
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
              v-model="state.description"
              :error-messages="v$.description.$errors.map((e: any) => e.$message)"
              clearable
              label="Description"
              @blur="v$.description.$touch"
              @input="v$.description.$touch"
            ></v-textarea>

            <!-- Bouton de soumission -->
            <v-btn class="mt-2" type="submit" block color="primary">Enregistrer les modifications</v-btn>
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