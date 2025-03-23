<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/add-post">Add Post</router-link> |
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
};
</script>

<style scoped>
nav {
  padding: 1rem;
  background-color: #f4f4f4;
  margin-bottom: 1rem;
}
nav a {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #333;
}
nav a.router-link-exact-active {
  color: #42b983;
}
</style>