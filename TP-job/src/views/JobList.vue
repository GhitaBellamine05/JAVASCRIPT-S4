<template>
  <div class="container">
    <!-- Left: Job List -->
    <div class="jobDetail">
      <FilterNav @search="handleSearch" />
      <ul>
        <li v-for="(job, index) in job_list" :key="index">
          <strong>{{ job.titre }}</strong><br>
          {{ job.description }}<br>
          Salary: {{ job.salaire }} MAD/an<br>
          Date: {{ job.date }}<br>
          <router-link :to="'/jobs/' + job.id">Edit Job</router-link>
          <button @click="deleteJob(job.id)">Delete</button>
        </li>
      </ul>
    </div>

    <!-- Right: Add Job Form -->
    <div class="addJobContainer">
      <AddJob @save-job="addJob" />
    </div>
  </div>
</template>

<script>
import FilterNav from '../views/FilterNav.vue';
import AddJob from '../components/AddJob.vue';

export default {
  components: { FilterNav, AddJob },
  data() {
    return {
      job_list: [],
      searchTerm: ''
    };
  },
  computed: {
    filteredJobs() {
      return this.job_list.filter(job => 
        job.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  methods: {
    handleSearch(searchTerm) {
      this.searchTerm = searchTerm;
    },
    addJob(newJob) {
      // Assign a unique ID
      newJob.id = Date.now(); 

      // Push to job list
      this.job_list.push(newJob);

      // Save to localStorage
      localStorage.setItem('jobs', JSON.stringify(this.job_list));
    },
    deleteJob(id) {
      this.job_list = this.job_list.filter(job => job.id !== id);
      localStorage.setItem('jobs', JSON.stringify(this.job_list)); // Save to localStorage
    }
  },
  created() {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      this.job_list = JSON.parse(savedJobs);
    } else {
      fetch('/data.json')
        .then(response => response.json())
        .then(data => {
          this.job_list = data;
          localStorage.setItem('jobs', JSON.stringify(data));
        })
        .catch(err => console.error('Error fetching data:', err));
    }
  }
};
</script>


<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px; 
  max-width: 1000px;
  margin: auto;
}


.jobDetail {
  flex: 1; 
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.addJobContainer {
  flex-basis: 35%; 
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Styling for List */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #fff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

li:hover {
  transform: scale(1.02);
}

/* Buttons and Links */
strong {
  font-size: 18px;
  color: #333;
}

button {
  margin-left: 2em;
  color: #007bff;
  background-color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.router-link {
  border: 1px solid black;
  display: inline-block;
  text-decoration: none;
  background: #08315d;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  margin-top: 10px;
  transition: background 0.3s ease-in-out;
}

.router-link:hover {
  background: #0056b3;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }

  .jobDetail, .addJobContainer {
    width: 100%;
  }
}
</style>
