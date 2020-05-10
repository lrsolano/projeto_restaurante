<template>
  <div class="home">
    <h1>Home</h1>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Home",
  computed: mapState(["user"])
};
</script>

<style>
</style>