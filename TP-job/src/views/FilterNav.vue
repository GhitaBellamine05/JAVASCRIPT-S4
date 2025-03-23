<template>
    <div class="filter-nav">
      <input type="text" v-model="search" @input="onSearch" placeholder="Search Job">
    </div>
  </template>
  
  <script>
  export default {
    name: 'FilterNav',
    data() {
      return {
        search: '',
      }
    },
    methods: {
      onSearch() {
        this.$emit('search', this.search);  // this will save the "this.search" value to the parent component
      }
    }
  }
  </script>
  <style>
  input{display:flex;margin: 0 auto;width : 50%; height : 1.5em;}
</style>