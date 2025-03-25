<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from '../../stores/authStore';

export default defineComponent({
  name: "SidebarComponent",
  data() {
    const authStore = useAuthStore();
    return {
      mainItems: [
        { icon: "mdi-view-dashboard-outline", text: "Votre travail", link: "home" },
        { icon: "mdi-folder-outline", text: "Projets", link: "project" },
        { icon: "mdi-star-outline", text: "Favoris", link: "favorites" },
        { icon: "mdi-account-group-outline", text: "Équipe", link: "team" },
      ],
      secondaryItems: [
        { icon: "mdi-message-outline", text: "Messages", link: "messages" },
        { icon: "mdi-logout", text: "Déconnexion", action: "logout" },
      ],
      authStore,
      logoutDialog: false
    };
  },
  methods: {
    handleItemClick(item: { action?: string; link?: string }) {
      if (item.action === "logout") {
        this.logoutDialog = true;
      } else if (item.link) {
        // Naviguer vers la route si c'est un lien
        this.$router.push(item.link);
      }
    },
    confirmLogout() {
      this.authStore.logout();
      this.logoutDialog = false;
      this.$router.push("/login");
    },
    cancelLogout() {
      this.logoutDialog = false;
    }
  }
});
</script>

<template>
  <v-list class="pa-3">
    <v-list-item
      v-for="(item, index) in mainItems"
      :key="index"
      link
      class="p-2 mb-2 menu-item"
      rounded="lg"
      :to="item.link"
      exact
    >
      <v-list-item-icon class="mr-3">
        <v-icon color="#5d6b8d">{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content class="text-list">
        {{ item.text }}
      </v-list-item-content>
    </v-list-item>

    <v-divider class="my-5" color="#E8ECF5"></v-divider>

    <v-divider class="mt-3 mb-5"></v-divider>
    <v-list-item
      v-for="(item, index) in secondaryItems"
      :key="index"
      link
      class="p-2 mb-2 menu-item"
      rounded="lg"
      @click="handleItemClick(item)"
      exact
    >
      <v-list-item-icon class="mr-3">
        <v-icon color="#5d6b8d">{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content class="text-list">
        {{ item.text }}
      </v-list-item-content>
    </v-list-item>
  </v-list>

  <!-- Dialogue de confirmation de déconnexion -->
  <v-dialog v-model="logoutDialog" max-width="400" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="pb-2 pt-4 px-4">
        <span class="text-h6 font-weight-bold">Confirmation de déconnexion</span>
      </v-card-title>
      <v-card-text class="px-4 py-3">
        <p class="mb-0">Êtes-vous sûr de vouloir quitter l'application ?</p>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey lighten-1"
          text
          class="px-4"
          @click="cancelLogout"
        >
          Annuler
        </v-btn>
        <v-btn
          color="error"
          class="px-4"
          @click="confirmLogout"
          elevation="0"
        >
          Déconnexion
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.sidebar-container {
  background-color: #f8f9fd;
  width: 280px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #E8ECF5;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 16px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #2A3F75;
}

.menu-title {
  font-size: 12px;
  font-weight: 600;
  color: #9AA4BD;
  letter-spacing: 1px;
}

.menu-item {
  color: #5d6b8d;
  font-weight: 500;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(79, 107, 255, 0.08);
  color: #4F6BFF;
}

.v-list-item--active {
  background-color: rgba(79, 107, 255, 0.1) !important;
  color: #4F6BFF !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(79, 107, 255, 0.15);
}

.v-list-item--active .v-icon {
  color: #4F6BFF !important;
}

.text-list {
  position: relative;
  top: 1px;
}

.user-profile {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.user-name {
  color: #2A3F75;
  line-height: 1.2;
}

.user-role {
  color: #9AA4BD;
}
</style>