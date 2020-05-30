<template>
  <div class="hire">
    <div class="hire-title">
      <PageTitle
        icon="fas fa-user-plus"
        title=" Cadastro de Funcionário"
        sub="Adicione um novo perfil de usuário"
      />
    </div>
    <div class="hire-content">
      <b-form>
        <b-row>
          <b-col md="4" sm="12">
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
          <b-col md="4" sm="12">
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
          <b-col md="4" sm="12">
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
          <b-col md="4" sm="12">
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
          <b-col md="4" sm="12">
            <b-form-group label="Telefone: " label-for="tel" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-mobile p-1"></i>
                  </b-input-group-text>
                </template>
                <input type="tel" id="tel" v-model="user.tel" placeholder="Infome o Telefone" v-mask="'(##)#####-####'"/>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4" sm="12">
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
          <b-col md="4" sm="12">
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
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-lg mt-3" v-b-modal.confirm-action>Cadastrar</button>
      </div>
    </div>
    <b-modal
      id="confirm-action"
      @ok="saveUser"
      cancel-title="Cancelar"
      ok-title="Salvar Informações"
    >
      <template v-slot:modal-title>Confirma criação</template>
      <div class="d-block text-center password-modal">
        <h2>Confirma criação do usuário?</h2>
      </div>
    </b-modal>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import { mask } from "vue-the-mask";
export default {
  directives: { mask },
  components: { PageTitle },
  name: "Hire",
  data: function() {
    return {
      user: {},
      su: this.$store.state.user.su
    };
  },
  methods: {
    async saveUser() {
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/users`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.user = {}
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    }
  }
};
</script>

<style>
.hire-content {
  margin: 15px 15px 10px 60px;
  padding: 5px;
}

label {
  font-size: 1.5rem;
}

.hire input:focus {
  outline: none;
}
.password-modal input:focus {
  outline: none;
}
</style>