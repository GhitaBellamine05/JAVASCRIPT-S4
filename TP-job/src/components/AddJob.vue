<template>
  <form @submit.prevent="saveJob" class="add-job-form">
    <input v-model="newJob.titre" placeholder="Job Title" required />
    <textarea v-model="newJob.description" placeholder="Job Description" required></textarea>
    <input v-model="newJob.salaire" type="number" placeholder="Salary (MAD)" required />
    <input v-model="newJob.date" type="date" required />
    <button type="submit">Save Job</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      newJob: {
        titre: '',
        description: '',
        salaire: '',
        date: ''
      }
    };
  },
  methods: {
    saveJob() {
      this.$emit('save-job', this.newJob); // Emit event with the job data
      this.newJob =  {
        titre: '',
        description: '',
        salaire: '',
        date: ''
      }
    }
  }
};
</script>

<style scoped>
.add-job-form {
  width: 100%;
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
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

.add-job-link {
  display: block;
  text-align: center;
  background: #08315d;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-decoration: none;
  margin-bottom: 15px;
}

.add-job-link:hover {
  background: #0056b3;
}
</style>
