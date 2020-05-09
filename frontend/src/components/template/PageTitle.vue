<template>
  <div class="page-title container">
    <div class="row col-12"><h1><i :class="icon"></i>{{ title }}</h1></div>
    <div class="mt-3 h4 text-muted row col-12" >{{sub}}</div>
    <hr class="mb-4" />
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: ["icon", "title","sub"]
};
</script>

<style>
.title-content{
  margin: 0px;
  color: #000;
  background: #AAA;
}




</style>