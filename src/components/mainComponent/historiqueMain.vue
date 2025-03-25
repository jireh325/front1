<script lang="ts">

import { defineComponent, ref, onMounted } from "vue";
import { useHistoriqueStore } from "@/stores/historiqueStore";
import { useAuthStore } from '../../stores/authStore';
import { useTodoStore } from '../../stores/todoStore';
import dayjs from "dayjs";


export default defineComponent({
  name: "HistoriqueMainComponent",

  setup() {
    const authStore = useAuthStore();
    const todoStore = useTodoStore();
    const historiqueStore = useHistoriqueStore();
    const historiques = ref<Record<string, any[]>>({});

    onMounted(async() => {
      const userId = authStore.userConnected?.id ?? null;
      await historiqueStore.fetchHistoriquesByUser(userId);
      
      const groups: Record<string, any[]> = {};
      
      // Définir les états que vous souhaitez conserver
      const statusToKeep = ['created', 'noStartedToProgress', 'ProgressToFinished'];
      
      // Process historiques sequentially with await
      for (const historique of historiqueStore.allHistoriques) {
        // Filtrer par état
        if (!statusToKeep.includes(historique.status)) {
          continue; // Ignorer cet historique si son statut n'est pas dans la liste
        }
        
        const date = dayjs(historique.createdAt).format("DD MMMM YYYY");
        if (!groups[date]) {
          groups[date] = [];
        }
        
        // Wait for todo fetch to complete
        await todoStore.fetchTodo(historique.idTodo);
        // Make a copy of the current selected todo
        const todoInfo = {...todoStore.getSelectedTodo};
        const todo = { ...historique, todoInfo };
        
        groups[date].push(todo);
      }
      
      historiques.value = groups;
    });

    const getStatusLabel = (status: string) => {
      const statusLabels: Record<string, string> = {
        created: "Créée",
        deleted: "Supprimée",
        noStartedToProgress: "Todo - InProgress",
        ProgressToFinished: "InProgress - Done",
      };
      return statusLabels[status] || status;
    };

    const getCardStatusClass = (status: string) => {
      if (status === 'created') return 'created-todo';
      if (status === 'deleted') return 'deleted-todo';
      if (status === 'noStartedToProgress') return 'progress-todo';
      if (status === 'ProgressToFinished') return 'finished-todo';
      return '';
    };

    const getIconStatusClass = (status: string) => {
      if (status === 'created') return 'created-icon';
      if (status === 'deleted') return 'deleted-icon';
      if (status === 'noStartedToProgress') return 'progress-icon';
      if (status === 'ProgressToFinished') return 'finished-icon';
      return '';
    };

    const getIconColor = (status: string) => {
      if (status === 'created') return '#4caf50';
      if (status === 'deleted') return '#f44336';
      if (status === 'noStartedToProgress') return '#ff9800';
      if (status === 'ProgressToFinished') return '#9e9e9e';
      return '#5d6b8d';
    };

    const getChipColor = (status: string) => {
      if (status === 'created') return 'success';
      if (status === 'deleted') return 'error';
      if (status === 'noStartedToProgress') return 'warning';
      if (status === 'ProgressToFinished') return 'grey';
      return 'primary';
    };

    const getStatusIcon = (status: string) => {
      if (status === 'created') return 'mdi-plus-circle-outline';
      if (status === 'deleted') return 'mdi-trash-can-outline';
      if (status === 'noStartedToProgress') return 'mdi-progress-clock';
      if (status === 'ProgressToFinished') return 'mdi-check-circle-outline';
      return 'mdi-clock-outline';
    };

    

    return {
      historiques,
      getStatusLabel,
      getCardStatusClass,
      getIconStatusClass,
      getIconColor,
      getChipColor,
      getStatusIcon,
    };
  }
});
</script>

<template>
  <v-container fluid class="histMain m-0 p-0">
    <div v-for="(group, date) in historiques" :key="date" class="group">
      <div class="title-group-wrapper">
        <span class="title-group">{{ date }}</span>
        <div class="title-line"></div>
      </div>

      <v-list v-if="group.length" class="list-hist">
        <v-list-item v-for="(item, itemIndex) in group" :key="itemIndex" density="compact">
          <v-card
            prepend-icon="mdi-checkbox-marked-outline"
            class="mx-auto custom-card"
            :class="getCardStatusClass(item.status)"
            :subtitle="item.todoInfo.description"
            :title="item.todoInfo.title +' - '+ item.todoInfo.idProject"
            density="compact"
          >
            <template v-slot:prepend>
              <div class="todo-status-icon" :class="getIconStatusClass(item.status)">
                <v-icon size="24" :color="getIconColor(item.status)" class="todo-icon">
                  {{ getStatusIcon(item.status) }}
                </v-icon>
              </div>
            </template>
            
            <template v-slot:append>
              <div class="todo-meta">
                <div class="todo-status">
                  <v-chip 
                    size="small" 
                    :color="getChipColor(item.status)" 
                    variant="outlined" 
                    class="status-chip"
                  >
                    {{ getStatusLabel(item.status) }}
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

<style scoped>
.histMain {
  width: 100%;
  height: 88vh;
  overflow: auto;
  background: #f8fafc;
  padding: 15px !important;
}

.histMain::-webkit-scrollbar {
  width: 6px;
  border-radius: 3px;
}

.histMain::-webkit-scrollbar-thumb {
  background-color: rgba(93, 107, 141, 0.2);
  border-radius: 3px;
}

.histMain::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
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

.list-hist {
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
  border-radius: 12px;
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 0 3px 8px rgba(93, 107, 141, 0.08) !important;
  transition: all 0.25s ease;
  overflow: hidden;
  padding: 12px 16px;
  border: 1px solid #e0e2e7;
  background-color: white;
  position: relative;
}

.custom-card:hover {
  box-shadow: 0 6px 12px rgba(93, 107, 141, 0.12) !important;
  transform: translateY(-3px);
}

/* Status-based card styling */
.created-todo {
  border-left: 4px solid #4caf50;
}

.deleted-todo {
  border-left: 4px solid #f44336;
}

.progress-todo {
  border-left: 4px solid #ff9800;
}

.finished-todo {
  border-left: 4px solid #9e9e9e;
  background-color: #fafafa;
}

/* Icon styling */
.todo-status-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(93, 107, 141, 0.1);
}

.created-icon {
  background-color: rgba(76, 175, 80, 0.15);
}

.deleted-icon {
  background-color: rgba(244, 67, 54, 0.15);
}

.progress-icon {
  background-color: rgba(255, 152, 0, 0.15);
}

.finished-icon {
  background-color: rgba(158, 158, 158, 0.15);
}

/* Note: ::v-deep should be :deep() in Vue 3 */
:deep(.v-card-title) {
  font-size: 12px;
  font-weight: 600;
  color: #3c4257;
  padding: 0;
  margin-bottom: 4px;
}

:deep(.v-card-subtitle) {
  font-size: 10px;
  color: #6b7c93;
  padding: 0;
  line-height: 1.4;
}

:deep(.v-chip) {
  font-size: 12px;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.todo-status {
  margin-right: 6px;
}

.status-chip {
  font-size: 11px !important;
  font-weight: 500;
  height: 24px !important;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.assignee-avatar {
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  width: 32px !important;
  height: 32px !important;
}

.todo-icon {
  font-size: 20px !important;
}
</style>