import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
    iconPack: 'fontawesome',
    theme: "bubble",
    duration: 3000
})

Vue.toasted.register(
    'defaultSuccess',
    payload => !payload.msg ? 'Operação realizada com sucesso!' : payload.msg, { type: 'success', icon: 'exclamation-circle' }
)

Vue.toasted.register(
    'defaultError',
    payload => !payload.msg ? 'Oops... Erro inesperado' : payload.msg, { type: 'error', icon: 'exclamation-circle' }
)