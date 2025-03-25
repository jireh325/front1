<template>
  <v-container fluid class="projects px-6 py-4">
     <!-- En-tête avec titre et actions -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 class="page-title mb-1">Projets</h1>
      </div>

      <div class="d-flex">
        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          variant="elevated"
          class="mr-2"
          @click="dialog1 = true"
        >
          Nouveau projet
        </v-btn>

        <v-btn color="medium-emphasis">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </div>
    </div>
    
    <v-divider></v-divider>

    <!-- Liste des projets -->
    <div class="projects-container pb-4">
      
      <template v-if="projects.length === 0">
        <div class="empty-state d-flex flex-column align-center justify-center pa-8">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-clipboard-text-outline</v-icon>
          <h3 class="text-h6 mb-2">Aucun projet</h3>
          <p class="text-body-2 text-medium-emphasis text-center mb-4">
            Commencez par créer votre premier projet pour organiser vos tâches
          </p>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog1 = true">
            Créer un projet
          </v-btn>
        </div>
      </template>

      <v-card
        v-for="(project, index) in projects"
        :key="project.id || index"
        class="project-card mb-8"
        variant="outlined"
      >
        <!-- En-tête du projet -->
        <div class="project-header px-6 py-4 d-flex align-center">
          <div>
            <h2 class="project-title">{{ project.name }}
              <v-btn
              icon="mdi-folder-edit-outline"
              variant="text"
              density="comfortable"
              size="small"
              class="ml-2 bg-grey-lighten-4"
              @click="openEditDialog(project)"
              ></v-btn>

              <v-btn
              :icon="expandedProjects[project.id || index] ? 'mdi-menu-up-outline' : 'mdi-menu-down-outline'"
              variant="text"
              density="comfortable"
              size="small"
              class="ml-2 bg-grey-lighten-4"
              @click="toggleProject(project.id || index)"
              ></v-btn>
            </h2>
            <p class="project-description text-body-2 text-medium-emphasis mt-1">
              {{ project.description || "Aucune description" }}
            </p>
          </div>
          
          <!-- Avatars des membres -->
          <div class="avatar-stack d-flex align-center ml-auto mr-4">
            <v-tooltip v-for="(avatar, index) in avatars" :key="index" location="top" text="Membre du projet">
              <template v-slot:activator="{ props }">
                <v-avatar
                  v-bind="props"
                  :image="avatar"
                  class="avatar-overlap"
                  size="36"
                  :style="{ marginLeft: index === 0 ? '0px' : '-10px', zIndex: avatars.length - index }"
                ></v-avatar>
              </template>
            </v-tooltip>
            <v-btn
              icon="mdi-plus"
              variant="text"
              density="comfortable"
              size="small"
              class="ml-2 bg-grey-lighten-4"
            ></v-btn>
          </div>
          
          <!-- Actions du projet -->
          <div class="project-actions">
            <v-tooltip location="top" text="Ajouter aux favoris">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon variant="text" density="comfortable" size="small">
                  <v-icon color="grey-darken-1">mdi-star-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip location="top" text="Archiver">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon variant="text" density="comfortable" size="small">
                  <v-icon color="grey-darken-1">mdi-archive-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip location="top" text="Supprimer">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props" 
                  icon 
                  variant="text" 
                  density="comfortable" 
                  size="small"
                  @click="project.id ? deleteProject(project.id) : console.log('ID non défini')"
                >
                  <v-icon color="error">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </div>

        <v-divider></v-divider>

        <!-- Tableaux Kanban - using v-show to hide/show content -->
        <div v-show="expandedProjects[project.id || index]" class="kanban-container pa-4">
          <div class="kanban-board">
            <!-- Kanban columns remain the same -->
            <KanbanColumn
              title="À faire"
              icon="mdi-clipboard-outline"
              status="isNostarted"
              :project-id="project.id || ''"
              :todos="todos.filter(todo => todo.idProject === project.id)"
              :show-add-button="true"
              @add-todo="project.id ? openTodoDialog(project.id) : console.log('ID non défini')"
              @update-todo-status="updateTodoStatus"
              @edit-todo="openEditTodoDialog"
              class="kanban-column"
            />
            
            <KanbanColumn
              title="En cours"
              icon="mdi-clock-outline"
              status="isProgress"
              :project-id="project.id || ''"
              :todos="todos.filter(todo => todo.idProject === project.id)"
              :show-add-button="false"
              @update-todo-status="updateTodoStatus"
              @edit-todo="openEditTodoDialog"
              class="kanban-column"
            />
            
            <KanbanColumn
              title="Terminé"
              icon="mdi-check-circle-outline"
              status="isFinished"
              :project-id="project.id || ''"
              :todos="todos.filter(todo => todo.idProject === project.id)"
              :show-add-button="false"
              @update-todo-status="updateTodoStatus"
              @edit-todo="openEditTodoDialog"
              class="kanban-column"
            />
          </div>
        </div>
      </v-card>
    </div>
  </v-container>

  <!-- Formulaires -->
  <FormCreateProjectComponent
    v-model="dialog1"
    @create-project="createProject"
  />
  
  <FormEditProjectComponent
    v-model="dialogEdit"
    :project="selectedProject"
    @update-project="updateProject"
  />
  
  <FormCreateTodoComponent
    v-model="dialog2"
    :project-id="selectedProjectId"
    @create-todo="createTodo"
  />

  <FormEditTodoComponent
    v-model="dialogEditTodo"
    :todo="selectedTodo"
    :project-id="selectedProjectId || ''"
    @update-todo="updateTodo"
  />

</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import FormCreateProjectComponent from "../components/mainComponent/formCreateProject.vue";
import FormCreateTodoComponent from "../components/mainComponent/formCreateTodo.vue";
import FormEditProjectComponent from "../components/mainComponent/FormEditProjectComponent.vue";
import FormEditTodoComponent from "../components/mainComponent/formEditTodoComponent.vue";
import KanbanColumn from "../components/mainComponent/KanbanColumn.vue";

import { useProjectStore } from '../stores/projectStore';
import { useTodoStore } from '../stores/todoStore';

interface ProjectItem {
  id?: string;
  name: string;
  description: string;
  idCreateur: string;
}

interface TodoItem {
  id: string;
  idProject: string;
  idCreateur: string;
  title: string;
  description: string;
  status: string;
  dateExp: string;
}

export default defineComponent({
  name: "ProjectView",
  components: { 
    FormCreateProjectComponent, 
    FormCreateTodoComponent,
    FormEditProjectComponent,
    KanbanColumn,
    FormEditTodoComponent
  },

  setup() {
    const dialog1 = ref(false);
    const dialog2 = ref(false);
    const dialogEdit = ref(false);
    const projectStore = useProjectStore();
    const todoStore = useTodoStore();
    const projects = ref<ProjectItem[]>([]);
    const todos = ref<any[]>([]);
    const selectedProjectId = ref<string | null>(null);
    const selectedProject = ref<ProjectItem | any>(null);
    const isLoading = ref(true);
    const dialogEditTodo = ref(false);
    const selectedTodo = ref<any | null>(null);

    // État pour suivre quels projets sont dépliés
    const expandedProjects = ref<Record<string | number, boolean>>({});

    const avatars = [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Un4Ml6Yfoe0Koqtdd1va3u9QazLw0bwZIQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwvDXpja-16kjYLoXt-8Q0cbZke5bzgpOPtw&s",
      "https://pbs.twimg.com/profile_images/1806060391316738048/yKQoqLXI_400x400.jpg",
      "https://actufinance.fr/wp-content/uploads/2024/11/Gcih1YDWEAAddAA.jpg",
    ];

    onMounted(async () => {
      try {
        isLoading.value = true;
        await projectStore.fetchProjects();
        projects.value = projectStore.projects;

        // Clear todos before fetching for all projects
        todoStore.$reset();
        
        // Fetch todos for all projects
        await Promise.all(projects.value.map(async (project) => {
          if (project.id) {
            await todoStore.fetchTodos(project.id);
            // Par défaut, tous les projets sont dépliés
            expandedProjects.value[project.id] = true;
          }
        }));
        
        // After all fetches are complete, get the combined todos
        todos.value = todoStore.allTodos;
      } catch (error) {
        console.error("Erreur lors du chargement des projets ou des todos:", error);
      } finally {
        isLoading.value = false;
      }
    });

    // Fonction pour basculer l'état plié/déplié d'un projet
    const toggleProject = (projectId: string | number) => {
      expandedProjects.value[projectId] = !expandedProjects.value[projectId];
    };

    // Ouvrir le dialogue de modification
    const openEditDialog = (project: ProjectItem) => {
      selectedProject.value = project;
      dialogEdit.value = true;
    };

    // Mettre à jour un projet
    const updateProject = async (updatedProject: ProjectItem) => {
      try {
        isLoading.value = true;
        if (updatedProject.id) {
          await projectStore.updateProject(updatedProject);
          
          // Mettre à jour le projet dans la liste locale
          const index = projects.value.findIndex(p => p.id === updatedProject.id);
          if (index !== -1) {
            projects.value[index] = updatedProject;
            projects.value = [...projects.value];
          }
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du projet:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Autres fonctions restent les mêmes...
    const createProject = async (project: ProjectItem) => {
      try {
        isLoading.value = true;
        await projectStore.createProject(project);
        projects.value = projectStore.projects;
        // Déplier automatiquement le nouveau projet
        if (project.id) {
          expandedProjects.value[project.id] = true;
        }
        dialog1.value = false;
      } catch (error) {
        console.error("Erreur lors de la création du projet:", error);
      } finally {
        isLoading.value = false;
      }
    };

    // Autres fonctions inchangées...
    const fetchTodos = async (idProject: string) => {
      try {
        await todoStore.fetchTodos(idProject);
        todos.value = todoStore.allTodos;
      } catch (error) {
        console.error("Erreur lors du chargement des todos:", error);
      }
    };

    const openEditTodoDialog = (todo: TodoItem) => {
      selectedTodo.value = todo;
      dialogEditTodo.value = true;
    };

    const updateTodo = async (updatedTodo: TodoItem) => {
      try {
        await todoStore.updateTodo(updatedTodo);
        // Update the todos array
        const index = todos.value.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          todos.value[index] = updatedTodo;
          todos.value = [...todos.value];
        }
        dialogEditTodo.value = false;
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche:", error);
      }
    };

    const createTodo = async (todo: TodoItem) => {
      try {
        isLoading.value = true;
        await todoStore.createTodo(todo);
        todos.value = todoStore.allTodos;
        dialog2.value = false;
      } catch (error) {
        console.error("Erreur lors de la création de la tâche:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const deleteProject = async (id: string) => {
      try {
        isLoading.value = true;
        await projectStore.deleteProject(id);
        projects.value = projectStore.projects;
      } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const openTodoDialog = (projectId: string) => {
      selectedProjectId.value = projectId;
      dialog2.value = true;
    };
    
    const updateTodoStatus = async (todoId: string, newStatus: string) => {
      const todoToUpdate = todos.value.find(todo => todo.id === todoId);
      
      if (todoToUpdate) {
        if (todoToUpdate.status !== newStatus) {
          const updatedTodo = { ...todoToUpdate, status: newStatus };
          
          try {
            await todoStore.updateTodo(updatedTodo);
            
            const index = todos.value.findIndex(todo => todo.id === todoId);
            if (index !== -1) {
              todos.value[index] = updatedTodo;
              todos.value = [...todos.value];
            }
          } catch (error) {
            console.error("Erreur lors de la mise à jour de la tâche:", error);
          }
        }
      }
    };

    return {
      dialog1,
      dialog2,
      dialogEdit,
      projects,
      todos,
      selectedProject,
      createProject,
      updateProject,
      createTodo,
      deleteProject,
      openTodoDialog,
      openEditDialog,
      selectedProjectId,
      updateTodoStatus,
      avatars,
      isLoading,
      expandedProjects,
      toggleProject,
      openEditTodoDialog,
      updateTodo,
      dialogEditTodo,
      selectedTodo
    };
  },
});
</script>

<style scoped>
.projects {
  background-color: #f8fafc;
  overflow: hidden;
  height: 88.6vh;
  width: 100%;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #2A3F75;
  letter-spacing: -0.5px;
}

.projects-container {
  padding: 10px;
  margin-bottom: 40px;
  height: 100%;
  overflow-y: auto;
}

.projects-container::-webkit-scrollbar {
  display: none;
}

.projects-container::-webkit-scrollbar-thumb {
  background: rgba(93, 107, 141, 0.2);
  border-radius: 10px;
  display: none;
}

.empty-state {
  background-color: white;
  border-radius: 10px;
  border: 1px dashed #dde1ee;
  min-height: 300px;
}

.project-card {
  width: 100%;
  border-radius: 12px;
  transition: all 0.2s ease;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  background: #c9cace;
}

.project-header {
  background-color: white;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #2A3F75;
  letter-spacing: -0.2px;
  margin: 0;
}

.project-description {
  margin: 0;
  max-width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar-overlap {
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.avatar-overlap:hover {
  transform: translateY(-3px);
}

.kanban-container {
  width: 100%;
  overflow: hidden;
  background-color: #f8fafc;
  padding: 16px;
}

.kanban-board {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 10px;
  align-items: start;
  padding: 8px;
}

.kanban-column {
  flex: 1;
  min-width: 200px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Permettre le défilement vertical indépendant */
  max-height: 500px; /* Hauteur maximale fixe pour chaque colonne */
  min-height: 200px;
  background-color: #eef0f1; /* Couleur de fond pour différencier les colonnes */
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Amélioration des scrollbars pour garder le design minimaliste */
.kanban-board::-webkit-scrollbar {
  height: 6px;
}

.kanban-board::-webkit-scrollbar-thumb {
  background: rgba(93, 107, 141, 0.2);
  border-radius: 10px;
}

.kanban-board::-webkit-scrollbar-track {
  background: transparent;
}

/* Animation des transitions */
.project-card,
.avatar-overlap,
.v-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>