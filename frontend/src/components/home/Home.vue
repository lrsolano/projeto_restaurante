<template>
  <div class="home">
    <PageTitle icon="fas fa-house-user" title=" Página Principal" sub="Resumo das Informações" />
    <b-container class="m-0">
      <h1>Home</h1>
    </b-container>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { mapState } from "vuex";
export default {
  components: { PageTitle },
  name: "Home",
  computed: mapState(["user"])
};
</script>

<style>
</style>