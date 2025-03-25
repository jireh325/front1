<template>
  <v-container fluid class="assiMain m-0 p-0">

    <div v-for="(group, title) in Todos" :key="title" class="group">

      <div class="title-group-wrapper">
        <span class="title-group">{{ title }}</span>
        <div class="title-line"></div>
      </div>

      <v-list v-if="group.length" class="list-assi">
        <v-list-item v-for="(todo, index) in group" :key="index" class="p-0 mb-3 todo-item">
          <v-card
            prepend-icon="mdi-checkbox-marked-outline"
            class="mx-auto custom-card"
            :subtitle="todo.project"
            :title="todo.name"
            density="compact"
            
          >
            <template v-slot:prepend>
              <div class="todo-status-icon">
                <v-icon size="24" :color="todo.completed ? '#4caf50' : '#5d6b8d'" class="todo-icon">
                  {{ todo.completed ? 'mdi-checkbox-marked-circle-outline' : 'mdi-clock-outline' }}
                </v-icon>
              </div>
            </template>
            
            <template v-slot:append>
              <div class="todo-meta">
                <div class="todo-status">
                  <v-chip 
                    size="small" 
                    :color="todo.completed ? 'success' : 'warning'" 
                    variant="outlined" 
                    class="status-chip"
                  >
                    {{ todo.completed ? 'Terminé' : 'En cours' }}
                  </v-chip>
                </div>
                <v-avatar
                  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Un4Ml6Yfoe0Koqtdd1va3u9QazLw0bwZIQ&s"
                  class="assignee-avatar"
                  size="32"
                ></v-avatar>
              </div>
            </template>
          </v-card>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface TodoItem {
  name: string;
  project: string;
  completed: boolean;
}

interface TodoGroups {
  [key: string]: TodoItem[];
}

export default defineComponent({
  name: "AssigneMainComponent",

  data() {
    return {
      Todos: {
        "Aujourd'hui": [
          {
            name: "Tache-1",
            project: "Project-tache-on . Projet-1",
            completed: false,
          },
          {
            name: "Tache-2",
            project: "Project-tache-on . Projet-1",
            completed: true,
          },
          {
            name: "Tache-3",
            project: "Project-tache-on . Projet-1",
            completed: true,
          },
          {
            name: "Tache-4",
            project: "Project-tache-on . Projet-1",
            completed: true,
          },
        ],
        "Il y a trois mois": [
          {
            name: "Tache-3",
            project: "Project-tache-on . Projet-4",
            completed: false,
          },
          {
            name: "Tache-4",
            project: "Project-tache-on . Projet-4",
            completed: false,
          },
          {
            name: "Tache-5",
            project: "Project-tache-on . Projet-4",
            completed: false,
          },
        ],
      } as TodoGroups,
    };
  },
});
</script>

<style scoped>
.assiMain {
  width: 100%;
  height: 88vh;
  overflow: auto;
  background: #f8fafc;
}

.assiMain::-webkit-scrollbar {
  width: 4px;
}

.title-group-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.title-group {
  color: #5d6b8d;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding-right: 12px;
}

.title-line {
  flex-grow: 1;
  height: 1px;
  background: rgb(239, 239, 239);
}

.group {
  margin-bottom: 30px;
  padding: 0 10px 10px;
}

.list-assi {
  padding-top: 3px;
  background: transparent;
}

.todo-item {
  transition: all 0.2s ease;
  margin-bottom: 8px !important;
}

.todo-item:hover {
  transform: translateY(-2px);
}

.custom-card {
  border-radius: 8px;
  width: 100%;
  margin-bottom: 6px;
  box-shadow: 0 2px 6px rgba(93, 107, 141, 0.06) !important;
  transition: all 0.2s ease;
  overflow: hidden;
  padding: 8px 12px;
  border: 1px solid #e0e2e7;
  background-color: white;
}

.custom-card:hover {
  box-shadow: 0 4px 10px rgba(93, 107, 141, 0.08) !important;
}

.completed-todo {
  border-left: 3px solid #4caf50;
}

.custom-card::v-deep .v-card-title{
  font-size: 14px ;
  font-weight: 600;
  color: #3c4257;
  padding: 0;
}

.todo-title {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #3c4257;
  margin-bottom: 1px;
  padding: 0;
}

.todo-project {
  font-size: 11px !important;
  color: #6b7c93;
  opacity: 0.9;
  padding: 0;
}

.todo-status-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  margin-right: 10px;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.todo-status {
  margin-right: 6px;
}

.status-chip {
  font-size: 10px !important;
  font-weight: 500;
  height: 22px !important;
}

.assignee-avatar {
  border: 1px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 28px !important;
  height: 28px !important;
}

.todo-icon {
  font-size: 18px !important;
}
</style>