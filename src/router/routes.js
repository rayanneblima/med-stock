
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
      { path: 'reset-password', name: 'reset-password', component: () => import('pages/ResetPasswordPage.vue') },
      { path: 'products-public/:userId', name: 'products-public', component: () => import('pages/product/PublicListPage.vue') }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', name: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'categories', name: 'categories', component: () => import('pages/category/ListPage.vue') },
      { path: 'form-category/:id?', name: 'form-category', component: () => import('pages/category/FormPage.vue') },
      { path: 'laboratories', name: 'laboratories', component: () => import('pages/laboratory/ListPage.vue') },
      { path: 'form-laboratory/:id?', name: 'form-laboratory', component: () => import('pages/laboratory/FormPage.vue') },
      { path: 'presentations', name: 'presentations', component: () => import('pages/presentation/ListPage.vue') },
      { path: 'form-presentation/:id?', name: 'form-presentation', component: () => import('pages/presentation/FormPage.vue') },
      { path: 'products', name: 'products', component: () => import('pages/product/ListPage.vue') },
      { path: 'form-product/:id?', name: 'form-product', component: () => import('pages/product/FormPage.vue') },
      { path: 'configurations', name: 'configurations', component: () => import('pages/StoreConfigPage.vue') }
    ],
    meta: { requiresAuth: true }
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
