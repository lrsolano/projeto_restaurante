<template>
  <div class="products">
    <PageTitle
      icon="fas fa-receipt"
      title=" Listagem de Categorias"
      sub="Atualize e Edite as Categorias"
    />
    <b-container fluid class="m-0">
      <h2 class="m-1">Cadastrar:</h2>
      <b-form class="m-3 d-flex justify-content-center">
        <b-row class="d-flex justify-content-center">
          <b-col sm="12">
            <b-form-group label="Categoria: " label-for="category" class="input-label text-center">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="text"
                  id="category"
                  v-model="category.name"
                  placeholder="Informe o Nome da Categoria"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-lg mt-3" @click.prevent="saveCategory">Salvar</button>
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
        :items="categories"
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
          <b-button size="sm" @click="remove(row.item.idcategory)" class="mr-1 btn btn-danger">
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
      :title="`Informações de ${category.name}`"
      ok-only
      size="lg"
      centered
      @ok="categoryUpdate"
      @hide="resetCategory"
    >
      <b-form>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Categoria: " label-for="category" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <input
                  type="text"
                  id="category"
                  v-model="category.name"
                  placeholder="Informe o Nome da Categoria"
                />
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
      category: {},
      categories: [],
      fields: [
        { key: "idcategory", label: "Código Categoria", sortable: true },
        { key: "name", label: "Categoria", sortable: true },
        { key: "actions", label: "Ações" }
      ],
      su: false,
      filter: null,
      totalRows: 1,
      currentPage: 1,
      perPage: 10
    };
  },
  methods: {
    loadCategories() {
      const url = `${baseApiUrl}/categories`;
      axios
        .get(url)
        .then(res => {
          this.categories = res.data;
          this.totalRows = this.categories.length;
        })
        .catch(showError);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    resetCategory() {
      this.category = {};
    },
    info(item, index, button) {
      this.category = item;
      this.$root.$emit("bv::show::modal", "info-product", button);
    },
    async remove(idcategory) {
      let r = confirm("Confirma remoção?");
      if (!r) return;
      this.$store.commit("setLoading", true);
      await axios
        .delete(`${baseApiUrl}/categories/${idcategory}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadCategories();
          this.resetCategory();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    async categoryUpdate() {
    
        if (!this.category.name) return showError("Informe o nome da categoria.")
      this.$store.commit("setLoading", true);

      await axios
        .put(`${baseApiUrl}/categories/${this.category.idcategory}`, this.category)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadCategories();
          this.resetCategory();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    async saveCategory() {
      let r = confirm("Deseja salvar o produto?");
      if (!r) return;
    
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/categories`, this.category)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadCategories();
          this.resetCategory();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    }
  },
  mounted() {
    this.loadCategories();
  }
};
</script>

<style>
</style>