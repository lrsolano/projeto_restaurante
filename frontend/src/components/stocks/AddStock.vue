<template>
  <div class="add-stock">
    <PageTitle
      icon="fas fa-truck-loading"
      title=" Cadastrar Nota Fiscal"
      sub="Cadastre nota fiscais de produtos"
    />
    <b-container fluid class="m-0">
      <b-form class="m-3">
        <b-row class="d-flex justify-content-center">
          <b-col md="3" sm="12">
            <b-form-group label="Produto:" label-for="idproduct">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="idproduct" :options="products" v-model="stock.idproduct"/>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="3" sm="12">
            <b-form-group label="N° Nota Fiscal:" label-for="NF">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-clipboard p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-input
                  type="text"
                  id="NF"
                  v-model="stock.NF"
                  placeholder="Informe o Número da Nota Fiscal"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="d-flex justify-content-center">
          <b-col md="3" sm="12">
            <b-form-group label="Preço: " label-for="price" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-dollar-sign p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-input
                  type="number"
                  step="0.01"
                  id="price"
                  v-model="stock.price"
                  placeholder="Infome o Preço da Nota Fiscal"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="3" sm="12">
            <b-form-group label="Quantidade de Produtos: " label-for="amount" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-box p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-input
                  type="number"
                  step="1"
                  id="amount"
                  v-model="stock.amount"
                  placeholder="Infome a Quantidade de Produtos"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-lg mt-3" @click.prevent="saveStock">Salvar</button>
      </div>
    </b-container>
  </div>
</template>

<script>
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
export default {
  components: { PageTitle },
  name: "AddStock",
  data: function() {
    return {
      stock: {},
      products: []
    };
  },
  methods: {
    loadProducts() {
      const url = `${baseApiUrl}/products`;
      axios
        .get(url)
        .then(res => {
          this.products = res.data.map(product => {
            return { value: product.idproduct, text: product.product };
          });
        })
        .catch(showError);
    },
    async saveStock() {
      let r = confirm("Deseja salvar a Nota Fiscal?");
      if (!r) return;
      try {
        this.stock.price = parseFloat(this.stock.price);
        this.stock.amount = Math.floor(parseFloat(this.stock.amount));
      } catch {
        showError("Valores não numericos");
        return;
      }
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/stocks`, this.stock)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.resetStock()
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    resetStock(){
      this.stock = {}
    }
  },
  mounted() {
    this.loadProducts();
  }
};
</script>

<style>
</style>