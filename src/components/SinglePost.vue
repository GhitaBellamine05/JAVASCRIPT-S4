<template>
  <div class="post">
    <h2>{{ post.title }}</h2>
    <p>{{ snippet }}</p>
    <p><strong>Tags:</strong> {{ post.tags.join(', ') }}</p>
    <router-link :to="`/post/${post.id}`">Read more</router-link>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    snippet() {
      return this.post.body.substring(0, 50) + '...';
    },
  },
};
</script>

<style scoped>
.post {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
}
</style>