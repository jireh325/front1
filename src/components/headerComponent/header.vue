<script lang='ts'>
import { defineComponent } from 'vue'
import { useAuthStore } from '../../stores/authStore';

export default defineComponent({
  name: 'HeaderComponent',
  data () {
    const authStore = useAuthStore();
    return {
      authStore
    }
  },
})
</script>


<template>
  <v-col cols="2">
    <v-toolbar-title class="logo d-flex align-center">
      <v-img src="@/assets/icon.png" max-height="50" contain class="logo-image"></v-img>
    </v-toolbar-title>
  </v-col>

  <v-col cols="6" class="search-col">
    <v-text-field 
      class="search-bar" 
      label="Rechercher" 
      prepend-inner-icon="mdi-magnify" 
      variant="outlined" 
      hide-details 
      density="compact"
      bg-color="rgba(93, 107, 141, 0.04)"
      placeholder="Rechercher des projets, tâches..."
    >
    </v-text-field>
  </v-col>

  <v-col cols="3">
    <div class="btns">
      <v-tooltip location="bottom" text="Notifications">
        <template v-slot:activator="{ props }">
          <v-badge color="error" dot location="top right" offset-x="3">
            <v-btn icon variant="text" v-bind="props" class="action-btn">
              <v-icon color="#5D6B8D">mdi-bell-outline</v-icon>
            </v-btn>
          </v-badge>
        </template>
      </v-tooltip>
      
      <v-tooltip location="bottom" text="Aide">
        <template v-slot:activator="{ props }">
          <v-btn icon variant="text" v-bind="props" class="action-btn">
            <v-icon color="#5D6B8D">mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
      
      <v-tooltip location="bottom" text="Paramètres">
        <template v-slot:activator="{ props }">
          <v-btn icon variant="text" v-bind="props" class="action-btn">
            <v-icon color="#5D6B8D">mdi-cog-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
  </v-col>
  
  <v-col cols="1">
    <v-menu min-width="240px" location="bottom end" transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-badge color="success" dot location="bottom right" offset-x="6" offset-y="6">
          <v-btn icon v-bind="props" variant="text" class="profile-btn">
            <v-avatar
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Un4Ml6Yfoe0Koqtdd1va3u9QazLw0bwZIQ&s"
              size="40"
              border
            ></v-avatar>
          </v-btn>
        </v-badge>
      </template>

      <v-card elevation="3" rounded="lg" class="profile-menu">
        <v-card-text class="pa-4">
          <div class="mx-auto text-center">
            <v-avatar
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Un4Ml6Yfoe0Koqtdd1va3u9QazLw0bwZIQ&s"
              size="70"
              class="mb-3 border-primary"
            ></v-avatar>

            <h3 class="text-h6 font-weight-bold mb-1">
              {{ authStore.userConnected?.firstName }} {{ authStore.userConnected?.lastName }}
            </h3>
            
            <p class="text-caption text-medium-emphasis mb-3">
              {{ authStore.userConnected?.email }}
            </p>

            <v-divider class="my-3"></v-divider>

            <v-btn variant="outlined" rounded="pill" color="primary" prepend-icon="mdi-account-edit" block class="mb-3">
              Éditer le profil
            </v-btn>

            <v-btn variant="outlined" rounded="pill" color="error" prepend-icon="mdi-logout" block>
              Se déconnecter
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-col>
</template>

<style scoped>

.logo-image {
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #5D6B8D;
  letter-spacing: 0.5px;
}

.search-col {
  width: 100%;
}

.search-bar {
  color: #5D6B8D;
  width: 90%;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-bar:hover {
  box-shadow: 0 2px 8px rgba(93, 107, 141, 0.15);
}

.btns {
  width: 80%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
}

.action-btn {
  transition: all 0.3s ease;
  background-color: rgba(93, 107, 141, 0.05);
  border-radius: 8px;
  height: 40px;
  width: 40px;
}

.action-btn:hover {
  background-color: rgba(93, 107, 141, 0.1);
  transform: translateY(-2px);
}

.profile-btn {
  transition: all 0.3s ease;
  border-radius: 50%;
  height: 45px;
  width: 45px;
}

.profile-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 10px rgba(93, 107, 141, 0.2);
}

.border-primary {
  border: 3px solid #3772FF !important;
}

.profile-menu {
  box-shadow: 0 4px 15px rgba(93, 107, 141, 0.15) !important;
}
</style>