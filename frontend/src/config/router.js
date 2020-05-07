import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import Auth from '@/components/auth/Auth'
import User from '@/components/user/User'


Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/',
    component: Home
}, {
    name: 'auth',
    path: '/auth',
    component: Auth
}, {
    name: 'user',
    path: '/user',
    component: User
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router