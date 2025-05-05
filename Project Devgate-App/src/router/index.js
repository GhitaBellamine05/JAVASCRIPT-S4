import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'
import { auth } from '@/services/firebase' // Import your Firebase auth instance

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,

  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('../views/skills2.vue'),
    
  },
  {
    path: '/Activities',
    name: 'Activities',
    component: () => import('../views/act.vue'),
    
  },
  {
    path: '/timeline',
    name: 'Timelines',
    component: () => import('../views/time.vue'),
    
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/p.vue'),
    
  },
  {
    path: '/objectives',  
    name: 'objectives',
    component: () => import('../views/objectives.vue'),
   
  },
  {
    path: '/dash',
    name: 'dash',
    component: () => import('../views/interactive.vue'),
    
  },
  {
    path: '/community/projects',
    name: 'CommunityProjects',
    component: ()=> import('../views/communityProjects.vue')
  },
  {
    path: '/community/projects/:id',
    name: 'ProjectDetails',
    component: () => import('../views/ProjectsDetails.vue'),
    props: true // This allows passing route params as props
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('../views/community.vue'),

  }, 
  { 
    path: '/profile',
    name: 'profile',
    component: () => import('../views/profile.vue'),
   
  }, 
  { 
    path: '/forgot',
    name: 'Forgot',
    component: () => import('../views/forgetPage.vue'),
   
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = auth.currentUser // Get current user from Firebase
  
  if (requiresAuth && !currentUser) {
    // Redirect to login if route requires auth and user is not logged in
    next('/')
  } else if (to.meta.requiredRole) {
    // Additional role check (example implementation)
    const user = await getCurrentUserData() // You need to implement this
    if (user.role !== to.meta.requiredRole) {
      next('/') // or to a 'not authorized' page
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router