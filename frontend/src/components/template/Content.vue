<template>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Content"
};
</script>

<style>
.content {
    margin: 0;
    grid-area: content;
    background: linear-gradient(to top, #DDD, #AAA );
    color: #000
}
</style>