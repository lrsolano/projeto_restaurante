// import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        columnMenu: false,
        user: null,
    },
    mutations: {
        isMenuColumn(state, onOff) {
            if (onOff === undefined) {
                state.columnMenu = !state.columnMenu
            } else {
                state.columnMenu = onOff
            }

        },
        setUser(state, user) {
            state.user = user
            if (user) {
                axios.defaults.headers.common['x-access-token'] = user.token
            } else {
                delete axios.defaults.headers.common['x-access-token']
            }
        }
    }
})