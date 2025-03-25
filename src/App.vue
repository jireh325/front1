<template>
  <v-app>
    <!-- Header conditionnel -->
    <v-app-bar v-if="showHeader" app class="header">
      <HeaderComponent />
    </v-app-bar>

    <!-- Contenu principal -->
    <v-container fluid>
      <v-row>
        <!-- Sidebar conditionnelle -->
        <v-navigation-drawer v-if="showSidebar" app density="compact">
          <SidebarComponent />
        </v-navigation-drawer>

        <!-- Contenu dynamique -->
        <v-main class="cont-main">
          <router-view />
        </v-main>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComponent from './components/headerComponent/header.vue';
import SidebarComponent from './components/sidebarComponent/sidebar.vue';

export default defineComponent({
  name: 'App',
  components: {
    HeaderComponent,
    SidebarComponent,
  },
  setup() {
    const route = useRoute();

    // Propriétés calculées pour showHeader et showSidebar
    const showHeader = computed(() => route.meta.showHeader || false);
    const showSidebar = computed(() => route.meta.showSidebar || false);

    return {
      showHeader,
      showSidebar,
    };
  },
});
</script>

<style scoped>
.cont-main {
  width: 100%;
  height: 98.6vh;
  overflow: hidden;
}

.header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}
</style>