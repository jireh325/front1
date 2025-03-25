import { defineStore } from 'pinia';
import axios from 'axios';

interface UserAssignation {
  id?: string;
  idTodo: string;
  idUser: string;
}

export const useUserAssignationStore = defineStore('userAssignation', {

  state: () => ({
    userAssignations: [] as UserAssignation[],
    selectedUserAssignation: null as UserAssignation | null,
  }),

  actions: {
    async fetchUserAssignations() {
      const query = `{ getAllUserAssignations { id idTodo idUser } }`;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.userAssignations = response.data.data.getAllUserAssignations;
    },

    async fetchUserAssignation(id: string) {
      const query = `{ getOneUserAssignation(id: "${id}") { id idTodo idUser } }`;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.selectedUserAssignation = response.data.data.getOneUserAssignation;
    },

    async fetchUserAssignationsByTodo(idTodo: string) {
      const query = `{ getUserAssignationsByTodo(idTodo: "${idTodo}") { id idTodo idUser } }`;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.userAssignations = response.data.data.getUserAssignationsByTodo;
    },

    async fetchUserAssignationsByUser(idUser: string) {
      const query = `{ getUserAssignationsByUser(idUser: "${idUser}") { id idTodo idUser } }`;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.userAssignations = response.data.data.getUserAssignationsByUser;
    },

    async fetchUserAssignationByTodoAndUser(idTodo: string, idUser: string) {
      const query = `{ getUserAssignationByTodoAndUser(idTodo: "${idTodo}", idUser: "${idUser}") { id idTodo idUser } }`;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.selectedUserAssignation = response.data.data.getUserAssignationByTodoAndUser;
    },

    async createUserAssignation(userAssignation: UserAssignation) {
      const mutation = `
        mutation {
          createUserAssignation(userAssignationInput: { idTodo: "${userAssignation.idTodo}", idUser: "${userAssignation.idUser}" }) {
            id idTodo idUser
          }
        }
      `;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query: mutation });
      this.userAssignations.push(response.data.data.createUserAssignation);
    },

    async updateUserAssignation(userAssignation: UserAssignation) {
      const mutation = `
        mutation {
          updateUserAssignation(id: "${userAssignation.id}", userAssignationInput: { idTodo: "${userAssignation.idTodo}", idUser: "${userAssignation.idUser}" }) {
            id idTodo idUser
          }
        }
      `;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query: mutation });
      const index = this.userAssignations.findIndex(u => u.id === userAssignation.id);
      if (index !== -1) {
        this.userAssignations[index] = response.data.data.updateUserAssignation;
      }
    },

    async deleteUserAssignation(id: string) {
      const mutation = `
        mutation {
          deleteUserAssignation(id: "${id}")
        }
      `;
      await axios.post('http://back1-production-237e.up.railway.app/graphql', { query: mutation });
      this.userAssignations = this.userAssignations.filter(u => u.id !== id);
    },
  },

  getters: {
    allUserAssignations: (state) => state.userAssignations,
    selectedUserAssignation: (state) => state.selectedUserAssignation,
  },
});
