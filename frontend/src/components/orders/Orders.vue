<template>
  <div class="orders">
    <PageTitle icon="fas fa-file-invoice" title=" Listagem de Comandas" sub="Comandas" />
    <div class="d-flex justify-content-center">
      <button class="btn btn-primary btn-lg mt-3" v-b-modal.new-order>Abrir Nova Comanda</button>
    </div>
    <hr class="mt-3 mb-2" />
    <div class="h2 d-flex justify-content-center">Comandas Abertas</div>
    <b-table
      hover
      striped
      stacked="md"
      :fields="fields"
      :items="orders"
      show-empty
      responsive="true"
      table-variant="dark"
      class="mb-0 mt-3"
    >
      <template v-slot:cell(actions)="row">
        <b-button @click="addTake(row.item, row.index, $event.target)" class="mr-1 btn btn-warning">
          <i class="fa fa-plus"></i>
        </b-button>
        <b-button
          @click="takeForTable(row.item, row.index, $event.target)"
          class="mr-1 btn btn-info"
        >
          <i class="fa fa-list-alt"></i>
        </b-button>
        <b-button @click="closeOrder(row.item.idorder)" class="mr-1 btn btn-success">
          <i class="fa fa-check"></i>
        </b-button>
      </template>
    </b-table>
    <b-modal
      id="new-order"
      cancel-title="Cancelar"
      ok-title="Abrir Comanda"
      size="lg"
      centered
      ok-only
      @ok="saveOrder"
      @hide="resetOrder"
    >
      <template v-slot:modal-title>Informações da Mesa</template>
      <b-form>
        <b-row>
          <b-col md="6" sm="12" class="d-flex justify-content-center">
            <b-form-group label="Numero da mesa:" label-for="user">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-cog p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="number"
                  step="1"
                  id="table"
                  v-model="order.table"
                  placeholder="Informe a Mesa"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12" class="d-flex justify-content-center">
            <b-form-group label="Quantidade de Pessoas:" label-for="user">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-users p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="number"
                  step="1"
                  id="people"
                  v-model="order.people"
                  placeholder="Informe a quantidade de pessoas"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12" sm="12" class="d-flex justify-content-center">
            <b-form-group label="Usuario:" label-for="user">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-user-circle p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="user" :options="users" v-model="order.iduser" size="lg" />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>

    <b-modal
      id="add-take"
      :title="`Adicionar pedido a mesa ${table}`"
      ok-only
      size="lg"
      centered
      @ok="postOrder"
      @hide="resetTake"
    >
      <b-form>
        <b-row>
          <b-col md="12" sm="12">
            <b-form-group label="Usuario:" label-for="iduser">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="iduser" :options="users" v-model="take.iduser" />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Produto:" label-for="idproduct">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="idproduct" :options="products" v-model="take.idproduct" />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12" v-if="take.idproduct">
            <b-form-group label="Quantidade: " label-for="amount" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-hand-holding-usd p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="number"
                  step="1"
                  id="amount"
                  v-model="take.amount"
                  placeholder="Infome a quantidade"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Prato:" label-for="idplate">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="idplate" :options="plates" v-model="take.idplate" />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
    <b-modal
      id="info-table"
      :title="`Pedidos da mesa ${table}`"
      hide-footer
      size="lg"
      @hide="resetTake"
      centered
    >
      <b-table
        hover
        striped
        stacked="md"
        :fields="fieldsForTable"
        :items="takesForTable"
        show-empty
        responsive="true"
        table-variant="secondary"
        class="mb-0 mt-3"
      >
        <template v-slot:cell(price)="row">R${{row.item.price}}</template>
        <template v-slot:cell(actions)="row">
          <b-button @click="removeTake(row.item.idtake)" class="mr-1 btn btn-danger">
            <i class="fa fa-times"></i>
          </b-button>
        </template>
      </b-table>
    </b-modal>
    <br />
    <br />
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
export default {
  components: { PageTitle },
  name: "Oders",
  data: function() {
    return {
      order: {},
      users: [],
      orders: [],
      plates: [],
      products: [],
      take: {},
      table: 0,
      fields: [
        {
          key: "idorder",
          label: "Nº Comanda",
          sortable: true,
          class: "text-center"
        },
        { key: "table", label: "Mesa", sortable: true, class: "text-center" },
        {
          key: "people",
          label: "Pessoas",
          sortable: true,
          class: "text-center"
        },
        {
          key: "user",
          label: "Usuario Responsavel",
          sortable: true,
          class: "text-center"
        },
        { key: "actions", label: "Ações", class: "text-center" }
      ],
      takesForTable: [],
      fieldsForTable: [
        {
          key: "logname",
          label: "Usuario",
          sortable: true,
          class: "text-center"
        },
        {
          key: "product",
          label: "Produto",
          sortable: true,
          class: "text-center"
        },
        {
          key: "amount",
          label: "Quantidade",
          sortable: true,
          class: "text-center"
        },
        {
          key: "name",
          label: "Prato",
          sortable: true,
          class: "text-center"
        },
        {
          key: "price",
          label: "Preço",
          sortable: true,
          class: "text-center"
        },
        { key: "actions", label: "Remover", class: "text-center" }
      ]
    };
  },
  methods: {
    loadWaiters() {
      const url = `${baseApiUrl}/users/job/5`;
      axios
        .get(url)
        .then(res => {
          this.users = res.data.map(user => {
            return { value: user.iduser, text: user.name };
          });
        })
        .catch(showError);
    },
    async saveOrder() {
      let r = confirm("Deseja salvar a Comanda?");
      if (!r) return;
      try {
        this.order.table = parseInt(this.order.table);
        this.order.people = parseInt(this.order.people);
      } catch {
        showError("Valores não inteiros");
        return;
      }
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/orders`, this.order)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadOrders();
          this.resetOrder();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    loadOrders() {
      const url = `${baseApiUrl}/orders?state=0`;
      axios
        .get(url)
        .then(res => {
          this.orders = res.data;
        })
        .catch(showError);
    },
    loadTakesForTable() {
      const url = `${baseApiUrl}/takes/order/${this.take.idorder}`;
      axios
        .get(url)
        .then(res => {
          this.takesForTable = res.data;
        })
        .catch(showError);
    },
    loadPlates() {
      const url = `${baseApiUrl}/plates`;
      axios
        .get(url)
        .then(res => {
          this.plates = res.data.map(plate => {
            return { value: plate.idplate, text: plate.name };
          });
        })
        .catch(showError);
    },
    loadProducts() {
      const url = `${baseApiUrl}/products`;
      axios
        .get(url)
        .then(res => {
          this.products = res.data.map(product => {
            return { value: product.idproduct, text: product.product };
          });
          this.products.push({ value: null, text: " " });
        })
        .catch(showError);
    },
    resetOrder() {
      this.order = {};
    },
    addTake(item, index, button) {
      this.take.idorder = item.idorder;
      this.table = item.table;
      this.$root.$emit("bv::show::modal", "add-take", button);
    },
    takeForTable(item, index, button) {
      this.take.idorder = item.idorder;
      this.table = item.table;
      this.loadTakesForTable();
      this.$root.$emit("bv::show::modal", "info-table", button);
    },
    resetTake() {
      this.take = {};
      this.table = 0;
      this.takesForTable = [];
    },
    async postOrder() {
      let r = confirm("Deseja salvar o pedido?");
      if (!r) return;
      if (this.take.amount) {
        try {
          this.take.amount = parseInt(this.take.amount);
        } catch {
          showError("Valores não inteiros");
          return;
        }
      }
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/takes`, this.take)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.resetTake();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    async removeTake(idtake) {
      let r = confirm("Confirma remoção?");
      if (!r) return;
      this.$store.commit("setLoading", true);
      await axios
        .delete(`${baseApiUrl}/takes/${idtake}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadTakesForTable();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    async closeOrder(idorder) {
      let r = confirm("Deseja fechar a Comanda?");
      if (!r) return;
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/stateorder?state=1`, { idorder })
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadOrders();
          this.resetTake();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    }
  },
  mounted() {
    this.loadWaiters();
    this.loadOrders();
    this.loadPlates();
    this.loadProducts();
  }
};
</script>

<style>
</style>