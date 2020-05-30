<template>
  <div class="products">
    <PageTitle
      icon="fas fa-cart-arrow-down"
      title=" Listagem de Produtos"
      sub="Atualize e Edite as informações dos produtos"
    />
    <b-container fluid class="m-0">
      <h2 class="m-1">Cadastrar:</h2>
      <b-form class="m-3">
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Produto: " label-for="product" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="text"
                  id="product"
                  v-model="product.product"
                  placeholder="Informe o Produto"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Preço: " label-for="price" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-dollar-sign p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  v-model="product.price"
                  placeholder="Infome o Preço"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Lucro: " label-for="profit" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-hand-holding-usd p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="number"
                  step="0.01"
                  id="profit"
                  v-model="product.profit"
                  placeholder="Infome o Luro Desejado"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col  md="2" sm="12">
            <b-form-group label="Categoria:" label-for="idcategory">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="idcategory" :options="categories" v-model="product.idcategory"/>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-lg mt-3" @click.prevent="saveProduct">Salvar</button>
      </div>
    </b-container>
    <hr />
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
        :items="products"
        show-empty
        responsive="true"
        table-variant="dark"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        @filtered="onFiltered"
        class="mb-0"
      >
        <template v-slot:cell(value)="row">
            R${{((row.item.profit+1) * row.item.price).toFixed(2)}}
        </template>
        <template v-slot:cell(profit)="row">
            {{row.item.profit * 100}}%
        </template>
        <template v-slot:cell(price)="row">
            R${{row.item.price}}
        </template>
        <template v-slot:cell(actions)="row">
          <b-button
            size="sm"
            @click="info(row.item, row.index, $event.target)"
            class="mr-1 btn btn-warning"
          >
            <i class="fa fa-user-edit"></i>
          </b-button>
          <b-button size="sm" @click="remove(row.item.idproduct)" class="mr-1 btn btn-danger">
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
      id="info-product"
      :title="`Informações de ${product.product}`"
      ok-only
      size="lg"
      centered
      @ok="productUpdate"
      @hide="resetProduct"
    >
      <b-form>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Produto: " label-for="product" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="text"
                  id="product"
                  v-model="product.product"
                  placeholder="Informe o Produto"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Preço: " label-for="price" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-dollar-sign p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  v-model="product.price"
                  placeholder="Infome o Preço"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Lucro: " label-for="profit" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-hand-holding-usd p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="number"
                  step="0.01"
                  id="profit"
                  v-model="product.profit"
                  placeholder="Infome o Luro Desejado"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col  md="6" sm="12">
            <b-form-group label="Categoria:" label-for="idcategory">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="idcategory" :options="categories" v-model="product.idcategory"/>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
export default {
  components: { PageTitle },
  name: "Products",
  data: function() {
    return {
      product: {},
      products: [],
      fields: [
        { key: "idproduct", label: "Código Produto", sortable: true },
        { key: "product", label: "Produto", sortable: true },
        { key: "price", label: "Preço", sortable: true },
        { key: "profit", label: "% Lucro", sortable: true },
        {key: "value", label:"Valor comercializado", sortable: true},
        { key: "qcurrent", label: "Quantidade em Estoque", sortable: true },
        { key: "actions", label: "Ações" }
      ],
      su: false,
      filter: null,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      categories: []
    };
  },
  methods: {
    loadProducts() {
      const url = `${baseApiUrl}/products`;
      axios
        .get(url)
        .then(res => {
          this.products = res.data;
          this.totalRows = this.products.length;
        })
        .catch(showError);
    },
    loadCategories() {
      const url = `${baseApiUrl}/categories`;
      axios
        .get(url)
        .then(res => {
          this.categories = res.data.map(cateogry => {
            return { value: cateogry.idcategory, text: cateogry.name };
          });
        })
        .catch(showError);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    resetProduct() {
      this.product = {};
    },
    info(item, index, button) {
      this.product = item;
      this.$root.$emit("bv::show::modal", "info-product", button);
    },
    async remove(idproduct) {
      let r = confirm("Confirma remoção?");
      if (!r) return;
      this.$store.commit("setLoading", true);
      await axios
        .delete(`${baseApiUrl}/products/${idproduct}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadProducts();
          this.resetProduct();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    async productUpdate() {
        try {
          this.product.price = parseFloat(this.product.price);
          this.product.profit = parseFloat(this.product.profit);
        } catch {
          showError("Valores não numericos");
          return;
        }
      this.$store.commit("setLoading", true);

      await axios
        .put(`${baseApiUrl}/products/${this.product.idproduct}`, this.product)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadProducts();
          this.resetProduct();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    async saveProduct() {
      let r = confirm("Deseja salvar o produto?");
      if (!r) return;
      try {
        this.product.price = parseFloat(this.product.price);
        this.product.profit = parseFloat(this.product.profit);
      } catch {
        showError("Valores não numericos");
        return;
      }
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/products`, this.product)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadProducts();
          this.resetProduct();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    }
  },
  mounted() {
    this.loadProducts();
     this.loadCategories();
  }
};
</script>

<style>
</style>