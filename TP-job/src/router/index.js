import { createRouter, createWebHashHistory } from '../../../TP-blog/node_modules/vue-router/dist/vue-router'
import Home from '../components/Home.vue'
import AddJob from '@/components/AddJob.vue'
import EditJob from '@/components/EditJob.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  { path: '/add', name: 'add-job', component: AddJob },
  { path: '/Jobs/:id', name: 'edit-job', component: EditJob,props :true }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
