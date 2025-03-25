<script lang="ts">
import { defineComponent, PropType } from "vue";

interface TodoItem {
  id?: string;
  idProject: string;
  idCreateur: string;
  title: string;
  description: string;
  status: string;
  dateExp: string;
}

export default defineComponent({
  name: "KanbanColumn",
  
  props: {
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    projectId: {
      type: String,
      required: true
    },
    todos: {
      type: Array as PropType<TodoItem[]>,
      required: true
    },
    showAddButton: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ["add-todo", "update-todo-status", "edit-todo"],
  
  setup(props, { emit }) {
    // Filtrer les todos par statut et projet
    const filteredTodos = () => {
      return props.todos.filter(
        t => t.idProject === props.projectId && t.status === props.status
      );
    };
    
    const addTodo = () => {
      emit("add-todo");
    };
    
    // Gestion du drag & drop
    const onDragStart = (event: DragEvent, todo: TodoItem) => {
      if (event.dataTransfer && todo.id) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.setData('todoId', todo.id);
      }
    };
    
    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    };
    
    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      
      if (event.dataTransfer) {
        const todoId = event.dataTransfer.getData('todoId');
        if (todoId) {
          emit("update-todo-status", todoId, props.status);
        }
      }
    };
    
    return {
      filteredTodos,
      addTodo,
      onDragStart,
      onDragOver,
      onDrop
    };
  },
});
</script>

<template>
  <v-card 
    class="title-tab3" 
    @dragover="onDragOver" 
    @drop="onDrop"
  >
    <v-card-title class="todos-title">
      {{ title }} - {{ filteredTodos().length }}
    </v-card-title>
    
    <v-card-text>
      <v-btn v-if="showAddButton" class="w-100" @click="addTodo">
        <v-icon color="#5d6b8d">mdi-plus</v-icon>
      </v-btn>
      
      <v-card 
        v-for="todo in filteredTodos()" 
        :key="todo.id" 
        class="todo"
        draggable="true"
        @dragstart="onDragStart($event, todo)"
        :class="{ 'draggable': true }"
        @click="$emit('edit-todo', todo)"
      >
        <template v-slot:prepend>
          <v-card-title class="todos-title">
            {{ todo.title }}
          </v-card-title>
        </template>

        <template v-slot:append density="compact">
          <v-avatar
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Un4Ml6Yfoe0Koqtdd1va3u9QazLw0bwZIQ&s"
            class="border border-primary mr-2"
            size="40"
            density="compact"
            border="md"
          ></v-avatar>
        </template>
        
        <v-card-text class="mt-n5">
          <v-card-subtitle>
            {{ todo ? todo.description : null }}
          </v-card-subtitle>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.title-tab3 {
  color: #5d6b8d;
  background: #f8f8f8;
  font-size: 12px;
  font-weight: bold;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 200px;
  overflow-y: auto;
}

.title-tab3 .v-card-text {
  overflow-y: auto;
  flex: 1;
}

.todo {
  width: 100%;
  margin-top: 10px;
  cursor: grab;
}

.todo:active {
  cursor: grabbing;
}

.draggable {
  transition: transform 0.2s, box-shadow 0.2s;
}

.draggable:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.todos-title {
  color: #5d6b8d;
  font-size: 12px;
  font-weight: bold;
  padding: 20px;
}

.border {
  border: 2px solid;
}

.border-primary {
  border-color: #1976d2;
}

.drag-over {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>