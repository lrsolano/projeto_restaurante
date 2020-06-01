<template>
  <div class="products">
    <PageTitle
      icon="fas fa-cart-arrow-down"
      title=" Listagem de Pratos"
      sub="Atualize e Edite as informações dos pratos"
    />
    <b-container fluid class="m-0">
      <h2 class="m-1">Cadastrar:</h2>
      <b-form class="m-3">
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Nome do Prato: " label-for="name" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <input type="text" id="name" v-model="plate.name" placeholder="Informe o Nome" />
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
                  v-model="plate.price"
                  placeholder="Infome o Preço"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Descrição: " label-for="desc" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-hand-holding-usd p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-textarea
                  type="textarea"
                  rows="1"
                  max-rows="2"
                  id="desc"
                  v-model="plate.desc"
                  placeholder="Infome a Descrição"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="2" sm="12">
            <b-form-group label="Categoria:" label-for="idcategory">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="idcategory" :options="categories" v-model="plate.idcategory" />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <div class="d-flex justify-content-center">
        <button class="btn btn-primary btn-lg mt-3" @click.prevent="savePlate">Salvar</button>
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
        :items="plates"
        show-empty
        responsive="true"
        table-variant="dark"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        @filtered="onFiltered"
        class="mb-0"
      >
        <template v-slot:cell(value)="row">R${{((row.item.profit+1) * row.item.price).toFixed(2)}}</template>
        <template v-slot:cell(price)="row">R${{row.item.price}}</template>
        <template v-slot:cell(actions)="row">
          <b-button
            @click="info(row.item, row.index, $event.target)"
            class="mr-1 btn btn-warning"
          >
            <i class="fa fa-edit"></i>
          </b-button>
          <b-button @click="remove(row.item.idplate)" class="mr-1 btn btn-danger">
            <i class="fa fa-times"></i>
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
      :title="`Informações de ${plate.name}`"
      ok-only
      size="lg"
      centered
      @ok="plateUpdate"
      @hide="resetPlate"
    >
      <b-form>
        <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Prato: " label-for="plate" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <input type="text" id="plate" v-model="plate.name" placeholder="Informe o Prato" />
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
                  v-model="plate.price"
                  placeholder="Infome o Preço"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Descrição: " label-for="desc" class="input-label">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-hand-holding-usd p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-textarea
                  type="textarea"
                  rows="1"
                  max-rows="2"
                  id="desc"
                  v-model="plate.desc"
                  placeholder="Infome a Descrição"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Categoria:" label-for="idcategory">
              <b-input-group>
                <template v-slot:prepend>
                  <b-input-group-text>
                    <i class="fa fa-tag p-1"></i>
                  </b-input-group-text>
                </template>
                <b-form-select id="idcategory" :options="categories" v-model="plate.idcategory" />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
    {{plate}}
  </div>
</template>

<script>
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
export default {
  components: { PageTitle },
  name: "Plates",
  data: function() {
    return {
      plate: {},
      plates: [],
      fields: [
        { key: "name", label: "Prato", sortable: true, class:'text-center' },
        { key: "price", label: "Preço", sortable: true, class:'text-center' },
        { key: "desc", label: "Descrição", sortable: true, class:'text-center' },
        { key: "actions", label: "Ações", class:'text-center' }
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
    loadPlates() {
      const url = `${baseApiUrl}/plates`;
      axios
        .get(url)
        .then(res => {
          this.plates = res.data;
          this.totalRows = this.plates.length;
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
    resetPlate() {
      this.plate = {};
    },
    info(item, index, button) {
      this.plate = item;
      this.$root.$emit("bv::show::modal", "info-product", button);
    },
    async remove(idplate) {
      let r = confirm("Confirma remoção?");
      if (!r) return;
      this.$store.commit("setLoading", true);
      await axios
        .delete(`${baseApiUrl}/plates/${idplate}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadPlates();
          this.resetPlate();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    async plateUpdate() {
      try {
        this.plate.price = parseFloat(this.plate.price);
      } catch {
        showError("Valor não numericos");
        return;
      }
      this.$store.commit("setLoading", true);

      await axios
        .put(`${baseApiUrl}/plates/${this.plate.idplate}`, this.plate)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadPlates();
          this.resetPlate();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    },
    async savePlate() {
      let r = confirm("Deseja salvar o produto?");
      if (!r) return;
      try {
        this.plate.price = parseFloat(this.plate.price);
      } catch {
        showError("Valor não numerico");
        return;
      }
      this.$store.commit("setLoading", true);
      await axios
        .post(`${baseApiUrl}/plates`, this.plate)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.loadPlates();
          this.resetPlate();
        })
        .catch(showError);
      this.$store.commit("setLoading", false);
    }
  },
  mounted() {
    this.loadPlates();
    this.loadCategories();
  }
};
</script>

<style>
</style>