<template>
  <div>
    <NavBar />
    <h1>Create Post</h1>
    <form @submit.prevent="submitPost">
      <label for="title">Title:</label>
      <input type="text" id="title" v-model="title" required />
      <label for="body">Body:</label>
      <textarea id="body" v-model="body" required></textarea>
      <label for="tags">Tags:</label>
      <input type="text" id="tags" v-model="tags" placeholder="Comma-separated tags" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
  components: { NavBar },
  data() {
    return {
      title: '',
      body: '',
      tags: '',
    };
  },
  methods: {
    async submitPost() {
      const newPost = {
        title: this.title,
        body: this.body,
        tags: this.tags.split(',').map((tag) => tag.trim()),
      };
      try {
        const response = await fetch('http://localhost:3005/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        });
        if (!response.ok) throw new Error('Failed to create post');
        this.$router.push('/');
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
}
input, textarea, button {
  margin-bottom: 1rem;
}
</style>