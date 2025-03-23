<template>
  <div class="edit-job">
    <h2>Edit Job</h2>
    <form v-if="job" @submit.prevent="updateJob">
      <label>Title:</label>
      <input type="text" v-model="job.titre" required />

      <label>Description:</label>
      <textarea v-model="job.description" required></textarea>

      <label>Salary:</label>
      <input type="number" v-model="job.salaire" required />

      <label>Date:</label>
      <input type="date" v-model="job.date" required />

      <button type="submit">Update Job</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      job: null,
      job_list: []
    };
  },
  methods: {
    updateJob() {
      let index = this.job_list.findIndex(j => j.id === this.job.id);
      if (index !== -1) {
        this.job_list[index] = this.job;
        localStorage.setItem("jobs", JSON.stringify(this.job_list));
        this.$router.push("/");
      }
    }
  },
  created() {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      this.job_list = JSON.parse(savedJobs);
    }
    const jobId = parseInt(this.$route.params.id);
    this.job = this.job_list.find(j => j.id === jobId) || null;
  }
};
</script>
<style scoped>
.edit-job {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button {
  background: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease-in-out;
}

button:hover {
  background: #0056b3;
}



</style>
