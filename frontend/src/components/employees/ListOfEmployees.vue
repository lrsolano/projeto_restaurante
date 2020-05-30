<template>
  <div class="list-of-employees">
    <PageTitle
      icon="fas fa-users"
      title=" Listagem de usúarios"
      sub="Atualize e Edite as informações dos usuários"
    />
    <b-container fluid class="m-0">
      <b-row class="d-flex justify-content-center">
        <b-form-group
          label="Buscar: "
          label-cols-sm="3"
          label-align-sm="center"
          label-size="sm"
          label-for="filterInput"
          class="ml-5 mb-1"
        >
          <b-input-group size="sm">
            <template v-slot:prepend>
              <b-input-group-text>
                <i class="fa fa-search p-1"></i>
              </b-input-group-text>
            </template>
            <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Busque..."></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-row>
      <b-table
        hover
        striped
        stacked="md"
        :fields="fields"
        :items="users"
        show-empty
        responsive="true"
        table-variant="dark"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        @filtered="onFiltered"
        class="mb-0"
      >
        <template v-slot:cell(actions)="row">
          <b-button
            size="sm"
            @click="info(row.item, row.index, $event.target)"
            class="mr-1 btn btn-warning"
          >
            <i class="fa fa-user-edit"></i>
          </b-button>
          <b-button size="sm" @click="remove(row.item.iduser)" class="mr-1 btn btn-danger">
            <i class="fa fa-user-times"></i>
          </b-button>
        </template>
      </b-table>
      <b-row class="d-flex d-flex justify-content-center mt-0">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="center"
          pills
          class="my-0"
        ></b-pagination>
      </b-row>
    </b-container>
    <b-modal
      id="info-user"
      :title="`Informações de ${user.logname}`"
      ok-only
      size="lg"
      centered
      @ok="userUpdate"
      @hide="resetUser"
    >
      <b-form>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="User: " label-for="logname" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-user p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="text"
                  id="logname"
                  v-model="user.logname"
                  placeholder="Informe o Usuário"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Nome: " label-for="name" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-signature p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="text"
                  id="name"
                  v-model="user.name"
                  placeholder="Infome o Primeiro Nome"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Sobrenome: " label-for="sobrenome" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-signature p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="text"
                  id="lastname"
                  v-model="user.lastname"
                  placeholder="Infome o Sobrenome"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Email: " label-for="email" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-at p-1"></i>
                  </b-input-group-text>
                </template>
                <input type="email" id="email" v-model="user.email" placeholder="Informe o Email" />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Telefone: " label-for="tel" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-mobile p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="text"
                  id="tel"
                  v-model="user.tel"
                  placeholder="Infome o Telefone"
                  v-mask="'(##)#####-####'"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Senha: " label-for="password" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-user-lock p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="password"
                  id="password"
                  v-model="user.password"
                  placeholder="Informe a Senha"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group
              label="Confirme a Senha: "
              label-for="confirmPassword"
              class="input-label"
            >
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-user-lock p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="user.confirmPassword"
                  placeholder="Confirme a Senha"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="su" class="mt-3 mb-3">
          <b-col sm="12">
            <b-form-checkbox v-model="user.su" name="check-suUser" switch>Super Usuario</b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col md="3" sm="4">
            <b-form-checkbox v-model="user.manager" name="check-manager" switch>Gerente</b-form-checkbox>
          </b-col>
          <b-col md="3" sm="4">
            <b-form-checkbox v-model="user.cashier" name="check-cashier" switch>Caixa</b-form-checkbox>
          </b-col>
          <b-col md="3" sm="4">
            <b-form-checkbox v-model="user.waiter" name="check-waiter" switch>Garçom</b-form-checkbox>
          </b-col>
          <b-col md="3" sm="4">
            <b-form-checkbox v-model="user.application" name="check-application" switch>Estoque</b-form-checkbox>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl, showError } from "@/global";
import { mask } from "vue-the-mask";
import axios from "axios";
export default {
  directives: { mask },
  components: { PageTitle },
  name: "ListOfEmployees",
  data: function() {
    return {
      user: {},
      users: [],
      fields: [
        { key: "iduser", label: "Código Usuário", sortable: true },
        { key: "logname", label: "Usuario", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "tel", label: "Telefone", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "actions", label: "Ações" }
      ],
      su: false,
      filter: null,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      iduser: 0
    };
  },
  methods: {
    loadUsers() {
      const url = `${baseApiUrl}/users`;
      axios
        .get(url)
        .then(res => {

          this.users = res.data.filter(this.removeUserFromList);
          this.totalRows = this.users.length;
        })
        .catch(showError);
    },
    removeUserFromList(u){
      return u.iduser !== this.iduser && !u.su 
    },
    info(item, index, button) {
      this.user = item;
      this.user.su = this.user.su ? true : false;
      this.user.manager = this.user.manager ? true : false;
      this.user.cashier = this.user.cashier ? true : false;
      this.user.application = this.user.application ? true : false;
      this.user.waiter = this.user.waiter ? true : false;
      this.$root.$emit("bv::show::modal", "info-user", button);
    },
    resetUser() {
      this.user = {};
    },
    async userUpdate() {
      this.$store.commit("setLoading", true);
      await axios
        .put(`${baseApiUrl}/users/${this.user.iduser}`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadUsers();
          this.resetUser();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async remove(iduser) {
      let r = confirm("Confirma remoção?");
      if (!r) return;
      this.$store.commit("setLoading", true);
      await axios
        .delete(`${baseApiUrl}/users/${iduser}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadUsers();
          this.resetUser();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    }
  },
  mounted() {
    this.su = this.$store.state.user.su;
    this.iduser = this.$store.state.user.iduser;
    this.loadUsers();
  }
};
</script>

<style>
label {
  font-size: 1.3rem !important;
}
</style>