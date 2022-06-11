
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'loginDefault', component: () => import('pages/LoginPage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'email-confirmation', name: 'email-confirmation', component: () => import('pages/EmailConfirmationPage.vue') },
      { path: 'forgot-password', name: 'forgot-password', component: () => import('pages/ForgotPasswordPage.vue') },
      { path: 'reset-password', name: 'reset-password', component: () => import('pages/ResetPasswordPage.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'me', name: 'me', component: () => import('pages/MePage.vue') },
      { path: 'categories', name: 'categories', component: () => import('pages/category/ListPage.vue') },
      { path: 'form-category', name: 'categories-create', component: () => import('pages/category/FormPage.vue') }
    ],
    meta: { requiresAuth: true }
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
