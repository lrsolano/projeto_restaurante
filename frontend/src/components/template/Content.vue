<template>
  <b-overlay :show="loading" rounded="sm" variant="transparent" class="content">
      <router-view></router-view>
  </b-overlay>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "Content",
  computed: mapState(['loading'])
};
</script>

<style>
.content {
  margin: 0;
  grid-area: content;
  background: linear-gradient(to top, #ddd, #aaa);
  color: #000;
}
</style>