<template>
  <div class="orders">
    <PageTitle icon="fas fa-money-bill-wave" title=" Listagem de Comandas Pagas" sub="Comandas" />
    <hr class="mt-3 mb-2" />
    <div class="h2 d-flex justify-content-center">Comandas Pagas</div>
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
        :items="orders"
        show-empty
        responsive="true"
        table-variant="dark"
        class="mb-0 mt-3"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        @filtered="onFiltered"
      >
        <template v-slot:cell(actions)="row">
          <b-button @click="openOrder(row.item.idorder)" class="mr-1 btn btn-warning">
            <i class="fa fa-undo"></i>
          </b-button>
          <b-button
            @click="takeForTable(row.item, row.index, $event.target)"
            class="mr-1 btn btn-info"
          >
            <i class="fa fa-list-alt"></i>
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
  name: "Paid",
  data: function() {
    return {
      order: {},
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      orders: [],
      take: {},
      table: 0,
      total: 0,
      filter: null,
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
        }
      ]
    };
  },
  methods: {
    loadOrders() {
      const url = `${baseApiUrl}/orders?state=1&pay=1`;
      axios
        .get(url)
        .then(res => {
          this.orders = res.data;
          this.totalRows = this.orders.length;
        })
        .catch(showError);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async loadTakesForTable() {
      const url = `${baseApiUrl}/takes/order/${this.take.idorder}`;
      await axios
        .get(url)
        .then(res => {
          this.takesForTable = res.data;
        })
        .catch(showError);
    },
    resetOrder() {
      this.order = {};
    },
    async takeForTable(item, index, button) {
      this.take.idorder = item.idorder;
      this.table = item.table;
      await this.loadTakesForTable();
      const sumTotal = (accumulator, currentValue) =>
        accumulator + currentValue.price;
      this.total = this.takesForTable.reduce(sumTotal, 0);
      this.takesForTable.push({
        logname: "Subtotal",
        price: this.total.toFixed(2)
      });
      this.takesForTable.push({
        logname: "Comissão",
        price: (this.total * 0.1).toFixed(2)
      });
      this.takesForTable.push({
        logname: "Total",
        price: (this.total * 1.1).toFixed(2)
      });

      this.$root.$emit("bv::show::modal", "info-table", button);
    },
    resetTake() {
      this.take = {};
      this.table = 0;
      this.takesForTable = [];
    },
    async openOrder(idorder) {
      let r = confirm("Deseja abrir a Comanda para pagamento novamente?");
      if (!r) return;
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/payorder?pay=0`, { idorder })
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
    this.loadOrders();
  }
};
</script>

<style>
</style>