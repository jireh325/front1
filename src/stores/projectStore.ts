import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

interface Project {
  id?: string;
  name: string;
  description: string;
  idCreateur: string;
}

export const useProjectStore = defineStore('project', {

  state: () => ({
    projects: [] as Project[],
    selectedProject: null as Project | null,
  }),

  actions: {

    async fetchProjects() {
      const authStore = useAuthStore();
      const query = `
        query GetProjectByIdCreateur($idCreateur: ID!) {
          getProjectByIdCreateur(idCreateur: $idCreateur) {
            id 
            name 
            description 
            idCreateur
          }
        }
      `;
      try {
        const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { 
          query,
          variables: { idCreateur: authStore.userConnected?.id }
        });
        if (response.data.data) {
          this.projects = response.data.data.getProjectByIdCreateur;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    },

    async fetchProject(id: string) {
      const query = `
        query GetOneProject($id: ID!) {
          getOneProject(id: $id) {
            id
            name
            description
            idCreateur
          }
        }
      `;
      try {
        const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', {
          query,
          variables: { id },
        });
        this.selectedProject = response.data.data.getOneProject;
      } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error);
      }
    },

    async createProject(project: Project) {
      const authStore = useAuthStore();
      const mutation = `
        mutation CreateProject($name: String!, $description: String!, $idCreateur: ID!) {
          createProject(projectInput: { name: $name, description: $description, idCreateur: $idCreateur }) {
            id
            name
            description
            idCreateur
          }
        }
      `;
      try {
        const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', {
          query: mutation,
          variables: {
            name: project.name,
            description: project.description,
            idCreateur: authStore.userConnected?.id,
          },
        });
        this.projects.push(response.data.data.createProject);
      } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
      }
    },

    async updateProject(project: Project) {
      const authStore = useAuthStore();
      const mutation = `
        mutation UpdateProject($id: ID!, $name: String!, $description: String!, $idCreateur: ID!) {
          updateProject(id: $id, projectInput: { name: $name, description: $description, idCreateur: $idCreateur }) {
            id
            name
            description
            idCreateur
          }
        }
      `;
      try {
        const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', {
          query: mutation,
          variables: {
            id: project.id,
            name: project.name,
            description: project.description,
            idCreateur: authStore.userConnected?.id || null,
          },
        });
        const index = this.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
          this.projects[index] = response.data.data.updateProject;
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du projet:', error);
      }
    },

    async deleteProject(id: string) {
      const mutation = `
        mutation DeleteProject($id: ID!) {
          deleteProject(id: $id)
        }
      `;
      try {
        await axios.post('http://back1-production-237e.up.railway.app/graphql', {
          query: mutation,
          variables: { id },
        });
        this.projects = this.projects.filter(project => project.id !== id);
      } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
      }
    },
  },

  getters: {
    allProjects: (state) => state.projects,
    getSelectedProject: (state) => state.selectedProject,
  },
});