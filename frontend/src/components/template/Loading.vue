<template>
  <div class="loading">
      <b-spinner style="width: 6rem; height: 6rem;" label="Large Spinner"></b-spinner>
  </div>
</template>

<script>
export default {
    name: 'Loading' 
}
</script>

<style>
.loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  grid-area: content;
  background: linear-gradient(to top, #ddd, #aaa);
  color: #000;
}
</style>