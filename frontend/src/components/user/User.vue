<template>
  <div class="user">
    <div class="user-title">
      <PageTitle
        icon="fas fa-user-cog"
        title="Menu de Usuário"
        sub="Atualize e Edite suas informações"
      />
    </div>
    <div class="user-content">
      <b-form>
        <b-row>
          <b-col md="4" sm="12">
            <b-form-group label="User: " label-for="logname" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text><i class="fa fa-user p-1"></i></b-input-group-text>
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
          <b-col md="4" sm="12">
            <b-form-group label="Nome: " label-for="name" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text><i class="fa fa-signature p-1"></i></b-input-group-text>
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
          <b-col md="4" sm="12">
            <b-form-group label="Sobrenome: " label-for="sobrenome" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text><i class="fa fa-signature p-1"></i></b-input-group-text>
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
          <b-col md="4" sm="12">
            <b-form-group label="Email: " label-for="email" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text><i class="fa fa-at p-1"></i></b-input-group-text>
                </template>
                <input type="email" id="email" v-model="user.email" placeholder="Informe o Email" />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="4" sm="12">
            <b-form-group label="Telefone: " label-for="tel" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text><i class="fa fa-mobile p-1"></i></b-input-group-text>
                </template>
                <input type="text" id="tel" v-model="user.tel" placeholder="Infome o Telefone" v-mask="'(##)#####-####'"/>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4" sm="12">
            <b-form-group label="Nova Senha: " label-for="newPassword" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text><i class="fa fa-user-lock p-1"></i></b-input-group-text>
                </template>
                <input
                  type="password"
                  id="newPassword"
                  v-model="user.newPassword"
                  placeholder="Informe a Nova Senha"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="4" sm="12">
            <b-form-group
              label="Confirme a Nova Senha: "
              label-for="confirmNewPassword"
              class="input-label"
            >
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text><i class="fa fa-user-lock p-1"></i></b-input-group-text>
                </template>
                <input
                  type="password"
                  id="confirmNewPassword"
                  v-model="user.confirmNewPassword"
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
        <b-row v-if="su" class="mb-3">
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
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-lg mt-3" v-b-modal.confirm-password>Atualizar</button>
      </div>
    </div>
    <b-modal
      id="confirm-password"
      @ok="pushUpdate"
      cancel-title="Cancelar"
      ok-title="Salvar Informações"
    >
      <template v-slot:modal-title>Informe a Senha Antiga</template>
      <div class="password-modal">
        <b-input-group class="d-flex justify-content-center"> 
          <template v-slot:prepend>
            <b-input-group-text><i class="fa fa-user-lock p-1"></i></b-input-group-text>
          </template>
          <input
            type="password"
            id="oldPassword"
            v-model="user.oldPassword"
            placeholder="Informe a Senha Antiga"
          />
        </b-input-group>
      </div>
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
  name: "User",
  data: function() {
    return {
      user: { ...this.$store.state.user },
      su: this.$store.state.user.su
    };
  },
  mounted() {
    this.user.su = this.user.su ? true : false;
    this.user.manager = this.user.manager ? true : false;
    this.user.cashier = this.user.cashier ? true : false;
    this.user.application = this.user.application ? true : false;
    this.user.waiter = this.user.waiter ? true : false;
  },
  methods: {
    async pushUpdate() {
      if (this.user.token) delete this.user.token;
      this.$store.commit("setLoading", true);
      await axios
        .put(`${baseApiUrl}/users/update`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    }
  }
};
</script>

<style>
.user-content {
  margin: 15px 15px 10px 60px;
  padding: 5px;
}

label {
  font-size: 1.5rem;
}

.user input:focus{
  outline: none;
}
.password-modal input:focus{
  outline: none;
}

</style>