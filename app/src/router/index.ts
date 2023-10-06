// Composables
import { useAuthStore } from '@/store/auth';
import { createRouter, createWebHistory } from 'vue-router'

const checkAuth = async () => {
  return (await useAuthStore().checkAuth())
}

const checkSetup = async () => {
  return (await useAuthStore().isSetup())
}

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
        meta: {
          auth: true
        }
      },
      {
        path: 'landing',
        name: 'Landing',
        component: () => import('@/views/Landing.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
      },
      {
        path: '/game/waiting/:invitationId',
        name: 'GameWaiting',
        component: () => import('@/views/GameWaiting.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/game/select',
        name: 'GameSelection',
        component: () => import('@/views/GameSelection.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/game/',
        name: 'Game',
        component: () => import('@/views/GameContainer.vue'),
        meta: {
        auth: true
      }
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: '/otp/virify',
        name: 'OtpVirify',
        component: () => import('@/views/OtpVirify.vue'),
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/AccountSettings.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/invitation/:id',
        name: 'Invitation',
        component: () => import('@/views/Invitation.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/users/:username',
        name: 'UserProfile',
        component: () => import('@/views/UserProfile.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/friends',
        name: 'FriendsList',
        component: () => import('@/views/FriendsList.vue'),
        meta: {
          auth: true
        }
      },
      // error pages
      {
        path: '/forbidden',
        name: 'Forbidden',
        component: () => import('@/pages/Forbidden.vue')
      }
    ],
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/layouts/chat/Home.vue'),
    meta: {
      auth: true,
    },
    children: [
      {
        path: '/chat/dm/:id',
        name: 'Dm',
        component: () => import('@/layouts/chat/Default.vue'),
        meta: {
          auth: true,
        }
      },
      {
        path: '/chat/room/:id',
        name: 'Room',
        component: () => import('@/layouts/chat/Default.vue'),
        meta: {
          auth: true,
        }
      },
      {
        path: '/chat/invitation/:id',
        name: 'roomInvitation',
        component: () => import('@/layouts/chat/parcials/Invitation.vue'),
        meta: {
          auth: true,
        }
      }
    ]
  },
  // default path for page not found if no route matched
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
]



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

const withoutSetup = [
  'Settings'
]

router.beforeEach(async (to, from) => {
  if (to.meta.auth) {
    try {
      await useAuthStore().checkAuth();
      const setup = await checkSetup();
        if (!setup && to.name !== 'Settings')
          return ({ name: 'Settings' });
      if (!useAuthStore().getToken()) return ({ name: 'Landing' })
    } catch (error: any) {
      if (error.satus === 401)
        return ({ name: 'Landing' });
    }
  }
  if (to.name === 'Login' && useAuthStore().getToken()) return ({ name: 'Home' })
})

export default router
