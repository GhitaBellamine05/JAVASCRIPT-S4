<template>
  <div>
    <NavBar />
    <div class="container">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <h1>{{ post.title }}</h1>
        <p>{{ post.body }}</p>
        <p><strong>Tags:</strong> {{ post.tags.join(', ') }}</p>
      </div>
      <TagCloud :tags="tags" />
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import TagCloud from '../components/TagCloud.vue';
import { getPost } from '../composables/getPost';

export default {
  components: { NavBar, TagCloud },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      post: null,
      loading: true,
      error: null,
      tags: [],
    };
  },
  async created() {
    try {
      this.post = await getPost(this.id);

      // Récupérer les tags depuis tous les articles
      const postsResponse = await fetch('http://localhost:3005/posts');
      if (!postsResponse.ok) throw new Error('Failed to fetch tags');
      const posts = await postsResponse.json();
      this.tags = [...new Set(posts.flatMap((post) => post.tags))];
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
}
</style>