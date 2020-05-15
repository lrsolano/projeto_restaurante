<template>
  <div class="history">
    <PageTitle
      icon="fas fa-clipboard-list"
      title=" Listagem de Notas Fiscais"
      sub="Lista de notas fiscais"
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
        :items="stocks"
        show-empty
        responsive="true"
        table-variant="dark"
        :filter="filter"
        @filtered="onFiltered"
        class="mb-0"
      >
        <template v-slot:cell(actions)="row">
          <b-button size="sm" @click="remove(row.item.idstock)" class="mr-1 btn btn-danger">
            <i class="fa fa-user-times"></i>
          </b-button>
        </template>
      </b-table>
      <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
      <b-row>
        <b-col md="4" sm="12">
          <b-form-group label="Data Inicial" label-for="rangeStart" class="input-label">
            <b-form-datepicker id="rangeStart" v-model="start" class="mb-2"></b-form-datepicker>
          </b-form-group>
        </b-col>
        <b-col md="4" sm="12">
          <b-form-group label="Data Final" label-for="rangeEnd" class="input-label">
            <b-form-datepicker id="rangeEnd" v-model="end" class="mb-2"></b-form-datepicker>
          </b-form-group>
        </b-col>
      </b-row>

      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-lg mt-3" @click.prevent="loadStocksRange">Buscar</button>
      </div>
      <b-row class="d-flex justify-content-center mt-5 ml-3">
          <Apexchart
            type="donut"
            height="200"
            :options="chartOptionsDonut"
            :series="seriesDonut"
            v-if="seriesDonut.length"
          ></Apexchart>
      </b-row>
      <b-row class="d-flex justify-content-center mt-4">
        <Apexchart
          height="300"
          :options="chartOptionsBar"
          :series="seriesBar"
          v-if="seriesBar.length"
        ></Apexchart>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl, showError } from "@/global";
import VueApexCharts from "vue-apexcharts";
import axios from "axios";
export default {
  components: { PageTitle, Apexchart: VueApexCharts },
  name: "History",
  data: function() {
    return {
      stock: {},
      stocks: [],
      stocksRange: [],
      start: null,
      end: null,
      filter: null,
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: "idstock", label: "Código", sortable: true },
        { key: "product", label: "Produto", sortable: true },
        { key: "logname", label: "Usuário", sortable: true },
        { key: "price", label: "Preço", sortable: true },
        { key: "amount", label: "Valor da Nota Fiscal", sortable: true },
        { key: "NF", label: "N° Nota Fiscal", sortable: true },
        {
          key: "date",
          label: "Data",
          sortable: true,
          formatter: value => new Date(value).toLocaleDateString()
        },

        { key: "actions", label: "Ações" }
      ],
      chartOptionsDonut: {
        labels: [],
        chart: {
          type: "donut",
          width: 200,
          background: '#ddd',
          toolbar: {
            show: true,
            tools: {
              download: true
            }
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      },
      seriesDonut: [],
      seriesBar: [],
      chartOptionsBar: {
        chart: {
          type: "bar",
          stacked: true,
          height: 250,
          background: '#ddd',
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        animations: {
          initialAnimation: {
            enabled: false
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        legend: {
          position: "right",
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      }
    };
  },
  methods: {
    loadStocks() {
      const url = `${baseApiUrl}/stocks?page=${this.page}`;
      axios
        .get(url)
        .then(res => {
          this.stocks = res.data.data;
          this.count = res.data.count;
          this.limit = res.data.limit;
        })
        .catch(showError);
    },
    async loadStocksRange() {
      if (!this.start || !this.end) {
        return showError("Informe as datas");
      } else {
        const url = `${baseApiUrl}/stocks?start=${this.start}&end=${this.end}`;
        await axios
          .get(url)
          .then(res => {
            this.stocksRange = res.data.data.map(stock => {
              return {
                product: stock.product,
                amount: stock.amount,
                date: new Date(stock.date).toLocaleDateString()
              };
            });
          })
          .catch(showError);
        this.setSeriesDonut();
        this.setSeriesBar();
      }
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    setSeriesDonut() {
      this.seriesDonut = [];
      this.chartOptionsDonut.labels = [];
      let products = {};
      this.stocksRange.forEach(function(item) {
        if (Object.prototype.hasOwnProperty.call(products, item.product)) {
          products[item.product] = products[item.product] + item.amount;
        } else {
          products[item.product] = item.amount;
        }
      });

      for (let prop in products) {
        this.seriesDonut.push(products[prop]);
        this.chartOptionsDonut.labels.push(prop);
      }
    },
    setSeriesBar() {
      let products = {};
      this.seriesBar = [];
      this.stocksRange.forEach(function(item) {
        if (Object.prototype.hasOwnProperty.call(products, item.product)) {
          if (
            Object.prototype.hasOwnProperty.call(
              products[item.product],
              item.date
            )
          ) {
            products[item.product][item.date] =
              products[item.product][item.date] + item.amount;
          } else {
            products[item.product][item.date] = item.amount;
          }
        } else {
          products[item.product] = {};
          products[item.product][item.date] = item.amount;
        }
      });
      for (let prop in products) {
        let data = [];
        Object.keys(products[prop]).forEach(day => {
          data.push({ x: day, y: products[prop][day] });
        });
        this.seriesBar.push({ name: prop, data });
      }
    },
    async remove(idstock) {
      let r = confirm("Confirma remoção?");
      if (!r) return;
      this.$store.commit("setLoading", true);
      await axios
        .delete(`${baseApiUrl}/stocks/${idstock}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadStocks();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    }
  },
  mounted() {
    this.loadStocks();
  },
  watch: {
    page() {
      this.loadStocks();
    }
  }
};
</script>

<style>
.graph-donut {
  margin: 50px 0px 30px 0px;
}
</style>