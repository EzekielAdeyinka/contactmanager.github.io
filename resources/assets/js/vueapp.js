import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import App from './components/App'
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';

const beforeLeave = ((to, from, next) => {
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if (answer) {
        next()
    } else {
        next(false)
    }
});



const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: '/',
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem("userData") !== null) {
                    next('/contact');
                }
                if (localStorage.getItem("userData") == null || localStorage.getItem("userData") === "ERROR") {
                    next('/login');
                }
            },
            name: 'index',
            component: Login,
            meta: {
                description: 'Login for User',
                //requiresAuth: false,
                title: 'Login'
            },
            //beforeEnter: ifNotAuth,
        }, {
            path: '/login',
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem("userData") !== null) {
                    next('/contact');
                }
                if (localStorage.getItem("userData") == null || localStorage.getItem("userData") === "ERROR") {
                    next();
                }
            },
            name: 'login',
            component: Login,
            meta: {
                description: 'Login for User',
                //requiresAuth: false,
                title: 'Login'
            },
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: {
                description: 'Create a User',
                //requiresAuth: false,
                title: 'Register'
            },
        },{
            path: '/contact',
            beforeEnter: (to, from, next) => {
                if (localStorage.getItem("userData") !== null) {
                    next();
                }
                if (localStorage.getItem("userData") == null) {
                    next('/');
                }
            },
            name: 'contact',
            component: Contact,
            meta: {
                description: 'Create contacts',
                //requiresAuth: false,
                title: 'Contact'
            },
        }
    ],
});
import jquery from 'jquery';
Vue.prototype.$ = jquery;
import VModal from 'vue-js-modal'
import iziToast from 'izitoast'

Vue.use(VModal, { dialog: true });
Vue.use(iziToast);

const app = new Vue({
    el: '#app',
    render: h => h(App),
    router,
});
