import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '../views/HomePage'
import LoginPage from '../views/LoginPage'
import RegisterPage from "../views/RegisterPage";

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },

    // otherwise redirect to views
    { path: '*', redirect: '/' },
    { path: '/auth/callback', component: {template: '<div class="auth-component"></div>'}}
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register', '/auth/callback'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next({ 
      path: '/login', 
      query: { returnUrl: to.path } 
    });
  }

  next();
});
