import Vue from 'vue'
import App from './App.vue'

import './config/bootstrap'
import store from './config/store'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import router from './config/router'
import './config/msg'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')