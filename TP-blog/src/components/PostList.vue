<template>
  <div>
    <h1>Posts</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <SinglePost v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
import { getPosts } from '../composables/getPosts';
import SinglePost from './SinglePost.vue';

export default {
  components: { SinglePost },
  data() {
    return {
      posts: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    try {
      this.posts = await getPosts();
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>