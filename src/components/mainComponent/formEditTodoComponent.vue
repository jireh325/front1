<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength } from "@vuelidate/validators";
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useAuthStore } from '../../stores/authStore';

enum Status {
  isNostarted = "isNostarted",
  isProgress = "isProgress",
  isFinished = "isFinished"
}

interface TodoItem {
  id?: string;
  idProject: string;
  idCreateur: string;
  title: string;
  description: string;
  status: Status;
  dateExp: string;
}

export default defineComponent({
  name: "FormEditTodoComponent",
  props: {
    modelValue: Boolean,
    todo: {
      type: Object as () => TodoItem,
      required: true
    },
    projectId: {
      type: String,
      required: true
    }
  },
  emits: ["update:modelValue", "update-todo"],
  components: {
    VDateInput,
  },

  setup(props, { emit }) {
    const state = ref({
      id: "",
      title: "",
      desc: "",
      dateEcheance: null as Date | null,
      status: Status.isNostarted
    });

    // Watch for changes in the todo prop and update the state
    watch(() => props.todo, (newTodo) => {
      if (newTodo) {
        state.value.id = newTodo.id || "";
        state.value.title = newTodo.title || "";
        state.value.desc = newTodo.description || "";
        state.value.dateEcheance = newTodo.dateExp ? new Date(newTodo.dateExp) : null;
        state.value.status = newTodo.status || Status.isNostarted;
      }
    }, { immediate: true });

    const rules = {
      title: { required, maxLength: maxLength(10) },
      desc: { required },
      dateEcheance: { required },
      status: { required }
    };
    
    const v$ = useVuelidate(rules, state);

    const closeDialog = () => {
      emit("update:modelValue", false);
    };

    const submitForm = async () => {
      const authStore = useAuthStore();
      const isFormValid = await v$.value.$validate();
      
      if (isFormValid) {
        emit("update-todo", {
          id: state.value.id,
          title: state.value.title,
          description: state.value.desc,
          dateExp: state.value.dateEcheance?.toISOString(),
          status: state.value.status,
          idProject: props.projectId,
          idCreateur: props.todo.idCreateur // Keep original creator
        });
        
        closeDialog();
        v$.value.$reset();
      }
    };

    // Add status options for dropdown
    const statusOptions = [
      { value: Status.isNostarted, text: 'Not Started' },
      { value: Status.isProgress, text: 'In Progress' },
      { value: Status.isFinished, text: 'Finished' }
    ];

    return { 
      state, 
      v$, 
      closeDialog, 
      submitForm, 
      statusOptions 
    };
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
        <v-card-title class="headline">Modifier la tâche</v-card-title>
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
              label="Date d'échéance"
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

            <v-select
              v-model="state.status"
              :items="statusOptions"
              item-title="text"
              item-value="value"
              label="Statut"
              required
            ></v-select>

            <v-btn 
              class="mt-2" 
              type="submit" 
              block 
              color="primary"
              @click="v$.$validate"
            >
              Enregistrer les modifications
            </v-btn>
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