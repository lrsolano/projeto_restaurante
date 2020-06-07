import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import Auth from '@/components/auth/Auth'
import User from '@/components/user/User'
import Hire from '@/components/employees/Hire'
import ListOfEmployees from '@/components/employees/ListOfEmployees'
import Products from '@/components/products/Products'
import Plates from '@/components/products/Plates'
import Category from '@/components/products/Category'
import History from '@/components/stocks/History'
import AddStock from '@/components/stocks/AddStock'
import Orders from '@/components/orders/Orders'
import Cashier from '@/components/orders/Cashier'
import Paid from '@/components/orders/Paid'

import { userKey } from "@/global";


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
    component: Hire,
    meta: { requiresManager: true }
}, {
    name: 'listOfEmployees',
    path: '/listOfEmployees',
    component: ListOfEmployees,
    meta: { requiresManager: true }
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
}, {
    name: 'plates',
    path: '/plates',
    component: Plates
}, {
    name: 'orders',
    path: '/orders',
    component: Orders
}, {
    name: 'cashier',
    path: '/cashier',
    component: Cashier

}, {
    name: 'orderspaid',
    path: '/orderspaid',
    component: Paid
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if (to.matched.some(record => record.meta.requiresManager)) {
        const user = JSON.parse(json)
        user && (user.manager || user.su) ? next() : next({ path: '/' })
    } else {
        next()
    }
})

export default router