import { defineStore } from 'pinia';
import axios from 'axios';

interface UserRight {
  id?: string;
  idUser: string;
  idProject: string;
  admin: boolean;
}

export const useUserRightStore = defineStore('userRight', {

  state: () => ({
    userRights: [] as UserRight[],
    selectedUserRight: null as UserRight | null,
  }),

  actions: {
    async fetchUserRights() {
      const query = `{ getAllUserRights { id idUser idProject admin } }`;
      const response = await axios.post('/graphql', { query });
      this.userRights = response.data.data.getAllUserRights;
    },

    async fetchUserRight(id: string) {
      const query = `{ getOneUserRight(id: "${id}") { id idUser idProject admin } }`;
      const response = await axios.post('/graphql', { query });
      this.selectedUserRight = response.data.data.getOneUserRight;
    },

    async fetchUserRightsByUser(idUser: string) {
      const query = `{ getUserRightsByUser(idUser: "${idUser}") { id idUser idProject admin } }`;
      const response = await axios.post('/graphql', { query });
      this.userRights = response.data.data.getUserRightsByUser;
    },

    async fetchUserRightsByProject(idProject: string) {
      const query = `{ getUserRightsByProject(idProject: "${idProject}") { id idUser idProject admin } }`;
      const response = await axios.post('/graphql', { query });
      this.userRights = response.data.data.getUserRightsByProject;
    },

    async fetchUserRightByUserAndProject(idUser: string, idProject: string) {
      const query = `{ getUserRightByUserAndProject(idUser: "${idUser}", idProject: "${idProject}") { id idUser idProject admin } }`;
      const response = await axios.post('/graphql', { query });
      this.selectedUserRight = response.data.data.getUserRightByUserAndProject;
    },

    async createUserRight(userRight: UserRight) {
      const mutation = `
        mutation {
          createUserRight(userRightInput: { idUser: "${userRight.idUser}", idProject: "${userRight.idProject}", admin: ${userRight.admin} }) {
            id idUser idProject admin
          }
        }
      `;
      const response = await axios.post('/graphql', { query: mutation });
      this.userRights.push(response.data.data.createUserRight);
    },

    async updateUserRight(userRight: UserRight) {
      const mutation = `
        mutation {
          updateUserRight(id: "${userRight.id}", userRightInput: { idUser: "${userRight.idUser}", idProject: "${userRight.idProject}", admin: ${userRight.admin} }) {
            id idUser idProject admin
          }
        }
      `;
      const response = await axios.post('/graphql', { query: mutation });
      const index = this.userRights.findIndex(u => u.id === userRight.id);
      if (index !== -1) {
        this.userRights[index] = response.data.data.updateUserRight;
      }
    },

    async deleteUserRight(id: string) {
      const mutation = `
        mutation {
          deleteUserRight(id: "${id}")
        }
      `;
      await axios.post('/graphql', { query: mutation });
      this.userRights = this.userRights.filter(u => u.id !== id);
    },
  },

  getters: {
    allUserRights: (state) => state.userRights,
    selectedUserRight: (state) => state.selectedUserRight,
  },
});
