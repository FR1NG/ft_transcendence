// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: '/test',
        name: 'Test',
        component: () => import('@/components/TestComponent.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
          auth: true
        }
      }
    ],
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/layouts/chat/Default.vue'),
  }
]



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

const hasToken = () => {
  if(sessionStorage.getItem('access_token'))
    return true
  return false;
}

router.beforeEach((to, from, next) => {
  if (to.meta.auth && to.name !== 'Login' && !hasToken()) next({ name: 'Login' })
  else if (hasToken() && to.name === 'Login') next({name: 'Home'})
  else next()
})

export default router
