<script lang="ts">
import { defineComponent, ref } from 'vue';
import HistoriqueMainComponent from '../components/mainComponent/historiqueMain.vue';
import EcheanceMainComponent from '../components/mainComponent/echeanceMain.vue';
import AssigneMainComponent from '../components/mainComponent/assigneMain.vue';
import { useAuthStore } from '../stores/authStore';

export default defineComponent({
  name: 'HomeView',
  components: {
    HistoriqueMainComponent,
    EcheanceMainComponent,
    AssigneMainComponent
  },

  setup() {
    const tab = ref<'historique' | 'echeance' | 'assignes'>('historique');
    const authStore = useAuthStore();
    return { tab, authStore };
  }
});
</script>



<template>
  <v-container fluid class="hist px-6 py-4">
    <!-- Section des onglets -->
    <v-tabs v-model="tab" class="d-flex align-center justify-space-between">
      <div>
        <h1 class="page-title">Votre travail</h1>
      </div>
      <v-spacer></v-spacer>
      <v-tab value="historique" class="text-tab" stacked ripple >Historique</v-tab>
      <v-tab value="echeance" class="text-tab" stacked ripple >En échéance</v-tab>
      <v-tab value="assignes" class="text-tab" stacked ripple >Qui me sont assignées</v-tab>
    </v-tabs>

    <!-- Séparateur -->
    <v-divider></v-divider>

    <!-- Contenu des onglets -->
    <v-list class="content-card">
      <v-list-item class="cards">
        <v-window v-model="tab" class="slide-list pb-3">
          <!-- Onglet Historique -->
          <v-window-item value="historique">
            <HistoriqueMainComponent />
          </v-window-item>

          <!-- Onglet En échéance -->
          <v-window-item value="echeance">
            <EcheanceMainComponent />
          </v-window-item>

          <!-- Onglet Assignées -->
          <v-window-item value="assignes">
            <AssigneMainComponent />
          </v-window-item>
        </v-window>
      </v-list-item>

    </v-list>
  </v-container>
</template>

<style scoped>
/* Style pour le conteneur principal */
.hist {
  background-color: #f8fafc;
  overflow: hidden;
  height: 88.6vh;
  width: 100%;
}

/* Style pour les onglets */
.v-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cards::-webkit-scrollbar {
  display: none;
}

.cards::-webkit-scrollbar-thumb {
  display: none;
}

/* Style pour le titre "Votre travail" */
.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #2A3F75;
  letter-spacing: -0.5px;
}

/* Style pour les onglets */
.text-tab {
  color: #5D6B8D;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: none;
  transition: all 0.3s ease;
}

/* Style pour l'onglet sélectionné */
:deep(.v-tab--selected) {
  color: #3772FF !important;
  background-color: rgba(55, 114, 255, 0.08);
}


/* Style pour le contenu des onglets */
.content-card {
  height: 100%;
  overflow: hidden;
  padding-top: 0;
  background: #f8fafc;
}

.cards{
  padding-top: 0;
}

</style>