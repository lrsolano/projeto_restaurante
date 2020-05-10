import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import Auth from '@/components/auth/Auth'
import User from '@/components/user/User'
import Hire from '@/components/employees/Hire'
import ListOfEmployees from '@/components/employees/ListOfEmployees'
import Products from '@/components/products/Products'

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
}, {
    name: 'hire',
    path: '/hire',
    component: Hire
}, {
    name: 'listOfEmployees',
    path: '/listOfEmployees',
    component: ListOfEmployees
}, {
    name: 'products',
    path: '/products',
    component: Products
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router