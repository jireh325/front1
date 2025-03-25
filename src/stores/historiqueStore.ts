import { defineStore } from 'pinia';
import axios from 'axios';

interface Historique {
  id?: string;
  idUser: string;
  idTodo: string;
  status: string;
  createdAt: Date;
}

export const useHistoriqueStore = defineStore('historique', {

  state: () => ({
    historiques: [] as Historique[],
    selectedHistorique: null as Historique | null,
  }),

  actions: {

    async fetchHistoriques() {
      const query = `{ getAllHistoriques { id idUser idTodo status createdAt } }`;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.historiques = response.data.data.getAllHistoriques;
    },

    async fetchHistorique(id: string) {
      const query = `{ getOneHistorique(id: "${id}") { id idUser idTodo status createdAt } }`;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.selectedHistorique = response.data.data.getOneHistorique;
    },

    async fetchHistoriquesByUser(idUser: string | null) {
      const query = `{ getHistoriqueByIdUser(idUser: "${idUser}") { id idUser idTodo status createdAt } }`;
      
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.historiques = response.data.data.getHistoriqueByIdUser;
    },

    async fetchHistoriquesByTodo(idTodo: string) {
      const query = `{ getHistoriqueByIdTodo(id: "${idTodo}") { id idUser idTodo status createdAt } }`;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query });
      this.historiques = response.data.data.getHistoriqueByIdTodo;
    },

    async createHistorique(historique: Historique) {
      const mutation = `
        mutation {
          createHistorique(historiqueInput: { idUser: "${historique.idUser}", idTodo: "${historique.idTodo}", status: "${historique.status}" }) {
            id idUser idTodo status
          }
        }
      `;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query: mutation });
      this.historiques.push(response.data.data.createHistorique);
    },

    async updateHistorique(id: string, historique: Historique) {
      const mutation = `
        mutation {
          updateHistorique(id: "${id}", historiqueInput: { idUser: "${historique.idUser}", idTodo: "${historique.idTodo}", status: "${historique.status}" }) {
            id idUser idTodo status
          }
        }
      `;
      const response = await axios.post('http://back1-production-237e.up.railway.app/graphql', { query: mutation });
      const index = this.historiques.findIndex(h => h.id === id);
      if (index !== -1) {
        this.historiques[index] = response.data.data.updateHistorique;
      }
    },

    async deleteHistorique(id: string) {
      const mutation = `
        mutation {
          deleteHistorique(id: "${id}")
        }
      `;
      await axios.post('http://back1-production-237e.up.railway.app/graphql', { query: mutation });
      this.historiques = this.historiques.filter(historique => historique.id !== id);
    },
  },

  getters: {
    allHistoriques: (state) => state.historiques,
    selectedHistorique: (state) => state.selectedHistorique,
  },
});