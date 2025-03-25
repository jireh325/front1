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
  name: "HistoriqueMainComponent",

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

<template>
  <v-container fluid class="histMain m-0 p-0">
    <div v-for="(group, title) in Todos" :key="title" class="group">
      <v-title class="title-group">{{ title }}</v-title>

      <v-list v-if="group.length" class="list-hist">
        <v-list-item v-for="(todo, index) in group" :key="index" class="p-0 mb-2">
          <v-card
            prepend-icon="mdi-checkbox-marked-outline"
            class="mx-auto custom-card"
            :subtitle="todo.project"
            :title="todo.name"
            density="compact"
            
          >
            <template v-slot:append>
              <v-card-text class="text-caption">Créé</v-card-text>
              <v-avatar
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Un4Ml6Yfoe0Koqtdd1va3u9QazLw0bwZIQ&s"
                class="border border-primary border-thick"
                density="compact"
              ></v-avatar>
            </template>
          </v-card>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
</template>

<style scoped>

.histMain {
  padding-top: 28px;
  width: 100%;
  height: 88vh;
  overflow: auto;
}

.histMain::-webkit-scrollbar {
  width: 0; /* Masquer la barre de défilement verticale */
  height: 0; /* Masquer la barre de défilement horizontale */
}

.histMain::-webkit-scrollbar-thumb {
  background: transparent; /* Masquer le "thumb" (la partie déplaçable) */
}

.histMain::-webkit-scrollbar-track {
  background: transparent; /* Masquer la piste de défilement */
}

.title-group {
  color: #5d6b8d;
  font-size: 15px;
  font-weight: 500;
}

.group {
  margin-bottom: 30px;
  padding-bottom: 10px;
}

.list-hist {
  padding-top: 40px;
}

.custom-card {
  border: 1px solid #e0e2e7; /* Bordure personnalisée */
  border-radius: 10px; /* Coins arrondis */
  width: 100%; /* Prend toute la largeur disponible */
  margin-bottom: 10px; /* Espacement entre les cartes */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important; /* Ombre très légère */
}


.v-list-item {
  padding: 0; /* Supprime le padding par défaut */
}
</style>