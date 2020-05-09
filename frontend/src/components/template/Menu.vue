<template>
  <div class="menu">
    <b-navbar v-if="user">
      <b-navbar-nav>
        <b-nav-item-dropdown text="Inicio" center>
          <b-dropdown-item :to="'/user'"><i class="fa fa-user-cog"></i> Atualuzar</b-dropdown-item>
          <b-dropdown-item  @click="logout"><i class="fa fa-sign-out-alt"></i> Sair</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Colaboradores" center>
          <b-dropdown-item href="#">Listagem</b-dropdown-item>
          <b-dropdown-item href="#" v-if="user.manager">Cadastrar</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item href="#">Produtos</b-nav-item>
        <b-nav-item-dropdown text="Estoque" center>
          <b-dropdown-item href="#">Pedir</b-dropdown-item>
          <b-dropdown-item href="#">Historico</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import {userKey} from '@/global'
import { mapState } from "vuex";
export default {
  name: "Menu",
  computed: mapState(["user"]),
  props: {
    signin: Boolean
  },
  methods: {
      logout() {
            localStorage.removeItem(userKey)
            this.$store.commit('setUser',null)
            this.$router.push({name:'auth'})
        }
  }
};
</script>

<style>
.menu {
  padding: 0;
  margin: 0;
  grid-area: menu;
  background: rgba(98, 118, 46, 0.2);
  color: #000;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 1);
  border: 1px solid rgba(0, 0, 0, 0.15);
}
.dropdown-menu.show {
  font-weight: 500;
  background: rgba(98, 118, 46, 0.8);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 1);
  border-radius: 15px;
}
.dropdown-item:hover{
    background-color:rgba( 16, 54,  5,0.5) !important;
    border-radius: 5px;
}
a.dropdown-item{
    color: #FFF !important;
}
li a, li a:hover{
    text-decoration: none;
    color: #FFF
}
.menu i{
    margin-right: 5px;
}

</style>