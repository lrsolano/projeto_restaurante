<template>
  <div class="header">
    <div class="title">
      <router-link to="/">Restaurante Ficticio</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style>
.header {
  grid-area: header;
  background: linear-gradient(to right, #376929, #74a567);

  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  color: #fff;
  font-weight: bold;
  font-size: 1.5rem;
}
.title a, .title a:hover{
    text-decoration: none;
    color: #FFF;
}
</style>