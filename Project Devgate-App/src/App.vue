<template>
<div id="app">
  
  <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #1e293b;
  margin-top: 60px;
}

.router-link {
  margin: 0 10px;
  color: #2c3e50;
  text-decoration: none;
}

</style>
