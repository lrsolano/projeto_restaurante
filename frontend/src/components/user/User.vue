<template>
  <div class="user">
    <PageTitle icon="fas fa-user-cog" title="Menu de Usuário" />
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
export default {
  components: { PageTitle },
  name: "User"
};
</script>

<style>
.user {
  margin-top: 15px;
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>