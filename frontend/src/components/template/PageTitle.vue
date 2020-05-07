<template>
  <div class="page-title">
    <h1>
      <i :class="icon">{{ title }}</i>
    </h1>
    <hr />
  </div>
</template>

<script>
export default {
  name: "PageTitle",
   props: ['icon','title']
};
</script>

<style>
.page-title h1 {
  margin: 0px;
  color: #000;
}
</style>