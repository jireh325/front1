import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

interface Todo {
  id?: string;
  idProject: string;
  idCreateur: string;
  title: string;
  description: string;
  status: string;
  dateExp: string;
}

enum Status {
  isNostarted,
  isProgress,
  isFinished,
  created,
  deleted
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
    selectedTodo: null as Todo | null,
  }),

  actions: {

    // In useTodoStore (todoStore.js)
    async fetchTodos(idProject: string) {
      const authStore = useAuthStore();
      const query = `
        query GetTodoByIdProject($idProject: ID!) {
          getTodoByIdProject(idProject: $idProject) {
            id
            idProject
            idCreateur
            title
            description
            status
            dateExp
          }
        }
      `;
      try {
        const response = await axios.post('http://localhost:8080/graphql', {
          query,
          variables: { idProject },
        });
        
        // Add new todos to the existing array instead of replacing it
        const newTodos = response.data.data.getTodoByIdProject;
        
        // Only add todos that don't already exist in the array
        newTodos.forEach((newTodo: Todo) => {
          const exists = this.todos.some(todo => todo.id === newTodo.id);
          if (!exists) {
            this.todos.push(newTodo);
          }
        });
        
        console.log('Todos after fetch:', this.todos);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
      }
    },

    async fetchTodo(id: string) {
      const query = `
        query GetOneTodo($id: ID!) {
          getOneTodo(id: $id) {
            id
            idProject
            idCreateur
            title
            description
            status
            dateExp
          }
        }
      `;
      try {
        const response = await axios.post('http://localhost:8080/graphql', {
          query,
          variables: { id },
        });
        this.selectedTodo = response.data.data.getOneTodo;
      } catch (error) {
        console.error('Erreur lors de la récupération de la tâche:', error);
      }
    },

    async createTodo(todo: Omit<Todo, 'id'>) {
      const authStore = useAuthStore();
      console.log(todo)

      const mutation = `
        mutation CreateTodo($idProject: ID!, $idCreateur: ID!, $title: String!, $description: String!, $status: Status!, $dateExp: String!) {
          createTodo(todoInput: { idProject: $idProject, idCreateur: $idCreateur, title: $title, description: $description, status: $status, dateExp: $dateExp }) {
            id
            idProject
            idCreateur
            title
            description
            status
            dateExp
          }
        }
      `;
      try {
        const response = await axios.post('http://localhost:8080/graphql', {
          query: mutation,
          variables: {
            title: todo.title,
            description: todo.description,
            status: todo.status,
            idProject: todo.idProject,
            idCreateur: authStore.userConnected?.id,
            dateExp: todo.dateExp,
          },
        });
        if (response.data.data && response.data.data.createTodo) {
          this.todos.push(response.data.data.createTodo);
        }
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la création de la tâche:', error);
      }
    },

    async updateTodo(todo: Todo) {
      const mutation = `
        mutation UpdateTodo($id: ID!, $todoInput: TodoInput!) {
          updateTodo(id: $id, todoInput: $todoInput) {
            id
            idProject
            idCreateur
            title
            description
            status
            dateExp
          }
        }
      `;
      
      try {
        const response = await axios.post('http://localhost:8080/graphql', {
          query: mutation,
          variables: {
            id: todo.id,
            todoInput: {
              title: todo.title,
              description: todo.description,
              status: todo.status,
              idProject: todo.idProject,
              idCreateur: todo.idCreateur,
              dateExp: todo.dateExp,
            },
          },
        });
        
        if (response.data.data && response.data.data.updateTodo) {
          const index = this.todos.findIndex(t => t.id === todo.id);
          if (index !== -1) {
            this.todos[index] = response.data.data.updateTodo;
          }
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
        throw error; // Re-throw to allow handling in the component
      }
    },

    async deleteTodo(id: string) {
      const mutation = `
        mutation DeleteTodo($id: ID!) {
          deleteTodo(id: $id)
        }
      `;
      try {
        await axios.post('http://localhost:8080/graphql', {
          query: mutation,
          variables: { id },
        });
        this.todos = this.todos.filter(todo => todo.id !== id);
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
      }
    },

    clearProjectTodos(projectId: string) {
      this.todos = this.todos.filter(todo => todo.idProject !== projectId);
    }
  },

  getters: {
    allTodos: (state) => state.todos,
    getSelectedTodo: (state) => state.selectedTodo,
  },
  
});
