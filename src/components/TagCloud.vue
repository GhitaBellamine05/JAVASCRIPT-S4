<template>
  <div class="tag-cloud">
    <h3>Tags</h3>
    <router-link v-for="tag in tags" :key="tag" :to="`/tags/${tag}`" class="tag">
      {{ tag }}
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.tag-cloud {
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 5px;
}
.tag {
  display: inline-block;
  margin: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #42b983;
  color: white;
  border-radius: 3px;
  text-decoration: none;
}
</style>