<template>
  <div>
    <h1>Here's a list of homes to visit</h1>
    <div class="page" v-for="site in sites.features" :key="site.geometry">
      <h3>{{ site.properties.sitename }}</h3>
      <p>{{ site.properties.refShort }}</p>
      <p>{{ site.properties.clue }}</p>
      <p>{{ site.properties.time }}</p>
    </div>
  </div>
</template>
<script>
import sites from "@/assets/sites.json";
export default {
  data() {
    return {
      sites: sites,
    };
  },
};
</script>

<style scoped>
.page {
  background-color: white;
  margin: 10px;
  padding: 10px;
}
p {
  color: black;
}
</style>