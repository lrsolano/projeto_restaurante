import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import Auth from '@/components/auth/Auth'
import User from '@/components/user/User'
import Hire from '@/components/employees/Hire'
import ListOfEmployees from '@/components/employees/ListOfEmployees'
import Products from '@/components/products/Products'
import Category from '@/components/products/Category'
import History from '@/components/stocks/History'
import AddStock from '@/components/stocks/AddStock'

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
}, {
    name: 'stockHistory',
    path: '/stockHistory',
    component: History
}, {
    name: 'addStock',
    path: '/addStock',
    component: AddStock
}, {
    name: 'category',
    path: '/category',
    component: Category
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router