<template>
  <div class="home">
    <div class="container">
      <JobList :jobs="filteredJobs" />
    </div>
  </div>
</template>

<script>
import JobList from '@/views/JobList.vue';

export default {
  components: {
   
    JobList
  }
};
</script>