import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'LoginView',
    meta: { requiresAuth: false, showHeader: false, showSidebar: false },
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/signup',
    name: 'SignupView',
    meta: { requiresAuth: false, showHeader: false, showSidebar: false },
    component: () => import('../views/SignupView.vue'),
  },
  {
    path: '/project',
    name: 'ProjectView',
    meta: { requiresAuth: true, showHeader: true, showSidebar: true },
    component: () => import('../views/ProjectView.vue'),
  },
  {
    path: '/home',
    name: 'HomeView',
    meta: { requiresAuth: true, showHeader: true, showSidebar: true },
    component: () => import('../views/HomeView.vue'),
  },
  // Add a catch-all route for 404 errors (optional)
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home', // or a dedicated 404 page
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  console.log("Token envoyé:", authStore.token, authStore.userConnected?.id);
  authStore.checkAuth(); 

  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    
    next('/home');
  } else {
    
    next();
  }
});

export default router;