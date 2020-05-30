<template>
  <div class="menu">
    <b-container fluid class="m-0">
      <b-navbar v-if="user">
        <b-navbar-nav>
          <b-nav-item-dropdown text="Meu Perfil" center>
            <b-dropdown-item :to="'/user'">
              <i class="fa fa-user-cog"></i> Atualuzar
            </b-dropdown-item>
            <b-dropdown-item @click="logout">
              <i class="fa fa-sign-out-alt"></i> Sair
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown  v-if="user.su || user.manager" text="Colaboradores" center>
            <b-dropdown-item :to="'/listOfEmployees'" v-if="user.manager || user.su">Listagem</b-dropdown-item>
            <b-dropdown-item :to="'/hire'" v-if="user.manager || user.su">Cadastrar</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown  v-if="user.su || user.application" text="Pratos/Produtos" center>
            <b-dropdown-item :to="'/products'" v-if="user.application || user.su">Produtos</b-dropdown-item>
            <b-dropdown-item :to="'/category'" v-if="user.application || user.su">Categorias</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="Estoque" center>
            <b-dropdown-item :to="'/addStock'">Pedir</b-dropdown-item>
            <b-dropdown-item :to="'/stockHistory'">Historico</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </b-container>
  </div>
</template>

<script>
import { userKey } from "@/global";
import { mapState } from "vuex";
export default {
  name: "Menu",
  computed: mapState(["user"]),
  props: {
    signin: Boolean
  },
  methods: {
    logout() {
      localStorage.removeItem(userKey);
      this.$store.commit("setUser", null);
      this.$router.push({ name: "auth" });
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
.dropdown-item:hover {
  background-color: rgba(16, 54, 5, 0.5) !important;
  border-radius: 5px;
}
a.dropdown-item {
  color: #fff !important;
}
li a,
li a:hover {
  text-decoration: none;
  color: #fff;
}
.menu i {
  margin-right: 5px;
}
</style>