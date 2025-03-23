<template>
  <div id="app">
    <h1>Job Management App</h1>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}
h1 {
  text-align : center; 
  text-decoration : underline;
}
</style>
