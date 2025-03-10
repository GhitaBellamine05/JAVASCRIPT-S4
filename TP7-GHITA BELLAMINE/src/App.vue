<template>
  <div>
    <header>
      <img src="@/assets/logo.jpg" alt="LOGO">
      <h1>Les Bonnes Pièces</h1>
    </header>
    <HomeView />
  </div>
</template>

<script>
import HomeView from './components/HomeView.vue';

export default {
  components: {
    HomeView
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

body {
  max-width: 1200px;
  margin: auto;
  padding: 16px;
  font-family: 'Montserrat', sans-serif;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px;
  background-color: #7451eb;
  text-align: center;
  color: white;
}
header img {
  height: 60px;
  margin-left: 1rem;
  mix-blend-mode: multiply;
  filter : brightness(1)
}
header h1 {
  flex-grow: 1;
}
</style>
