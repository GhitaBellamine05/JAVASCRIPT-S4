<template>
  <div class="timeline-dashboard" :class="{ 'dark-mode': darkMode }">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <h2 class="logo-container"><img src="/logoDev.jpg" alt="logo"></h2>
      <h1>My Progress Dashboard</h1>
      <p>Visualize your progress across different dimensions</p>
       <router-link to="/dash" class="return-to-dash">
      ← Return to Main Dashboard
    </router-link>

    </div>

    <!-- Main Tabs -->
    <div class="main-tabs">
      <button 
        v-for="tab in mainTabs" 
        :key="tab.id"
        @click="activeMainTab = tab.id"
        :class="{ active: activeMainTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Projects Section -->
    <div v-if="activeMainTab === 'projects'" class="section-container">
      <div class="chart-selector">
        <h2>Projects Visualization</h2>
        <select v-model="projectsChartType" class="chart-type-selector">
          <option v-for="option in projectsChartOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Completion Percentage Chart -->
      <div v-if="projectsChartType === 'completion'" class="chart-container">
        <h3>Projects Completion Status</h3>
        <div class="chart-wrapper">
          <canvas ref="completionChart"></canvas>
        </div>
      </div>

      <!-- Technologies Usage Chart -->
      <div v-if="projectsChartType === 'technologies'" class="chart-container">
        <h3>Technologies Usage</h3>
        <div class="chart-wrapper">
          <canvas ref="technologiesChart"></canvas>
        </div>
      </div>

      <!-- Timeline Chart -->
      <div v-if="projectsChartType === 'timeline'" class="chart-container">
        <h3>Projects Timeline</h3>
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>
          <div 
            v-for="project in sortedProjects" 
            :key="project.id"
            class="timeline-item"
            :class="project.status"
            :style="{ left: `${getTimelinePosition(project.startDate)}%` }"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-date">{{ formatDate(project.startDate) }}</div>
              <div class="timeline-title">{{ project.name }}</div>
              <div class="timeline-progress">
                <div class="progress-bar" :style="{ width: `${getProjectProgress(project)}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Bars Chart -->
      <div v-if="projectsChartType === 'progress'" class="chart-container">
        <h3>Projects Progress</h3>
        <div class="progress-bars">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="progress-bar-item"
          >
            <div class="project-info">
              <span class="project-name">{{ project.name }}</span>
              <span class="project-status" :class="project.status">{{ formatStatus(project.status) }}</span>
            </div>
            <div class="progress-container">
              <div 
                class="progress-bar"
                :style="{ width: `${getProjectProgress(project)}%` }"
                :class="project.status"
              ></div>
              <span class="progress-percent">{{ getProjectProgress(project) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Section -->
    <div v-if="activeMainTab === 'skills'" class="section-container">
      <div class="chart-selector">
        <h2>Skills Visualization</h2>
        <select v-model="skillsChartType" class="chart-type-selector">
          <option v-for="option in skillsChartOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Radar Chart -->
      <div v-if="skillsChartType === 'radar'" class="chart-container">
        <h3>Skills Radar Chart</h3>
        <div class="chart-wrapper">
          <canvas ref="skillsRadarChart"></canvas>
        </div>
      </div>

      <!-- Progress Bars -->
      <div v-if="skillsChartType === 'progress'" class="chart-container">
        <h3>Skills Progress</h3>
        <div class="progress-bars">
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.id"
            class="progress-bar-item"
          >
            <div class="skill-info">
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-category">{{ skill.category }}</span>
            </div>
            <div class="progress-container">
              <div 
                class="progress-bar"
                :style="{ width: `${skill.level * 10}%` }"
              ></div>
              <span class="progress-percent">Level {{ skill.level }}/10</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Doughnut Chart -->
      <div v-if="skillsChartType === 'doughnut'" class="chart-container">
        <h3>Skills by Category</h3>
        <div class="chart-wrapper">
          <canvas ref="skillsDoughnutChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Objectives Section -->
    <div v-if="activeMainTab === 'objectives'" class="section-container">
      <div class="chart-selector">
        <h2>Objectives Visualization</h2>
        <select v-model="objectivesChartType" class="chart-type-selector">
          <option v-for="option in objectivesChartOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Completion Chart -->
      <div v-if="objectivesChartType === 'completion'" class="chart-container">
        <h3>Objectives Completion</h3>
        <div class="chart-wrapper">
          <canvas ref="objectivesCompletionChart"></canvas>
        </div>
      </div>

      <!-- Progress Bars -->
      <div v-if="objectivesChartType === 'progress'" class="chart-container">
        <h3>Objectives Progress</h3>
        <div class="progress-bars">
          <div 
            v-for="objective in filteredObjectives" 
            :key="objective.id"
            class="progress-bar-item"
          >
            <div class="objective-info">
              <span class="objective-name">{{ objective.title }}</span>
              <span class="objective-status">{{ getObjectiveStatus(objective) }}</span>
            </div>
            <div class="progress-container">
              <div 
                class="progress-bar"
                :style="{ width: `${objective.progress || 0}%` }"
                :class="getObjectiveStatus(objective, false)"
              ></div>
              <span class="progress-percent">{{ objective.progress || 0 }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Chart -->
      <div v-if="objectivesChartType === 'timeline'" class="chart-container">
        <h3>Objectives Timeline</h3>
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>
          <div 
            v-for="objective in sortedObjectives" 
            :key="objective.id"
            class="timeline-item"
            :class="getObjectiveStatus(objective, false)"
            :style="{ left: `${getTimelinePosition(objective.startDate)}%` }"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-date">{{ formatDate(objective.startDate) }}</div>
              <div class="timeline-title">{{ objective.title }}</div>
              <div class="timeline-progress">
                <div class="progress-bar" :style="{ width: `${objective.progress || 0}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activities Section -->
    <div v-if="activeMainTab === 'activities'" class="section-container">
      <div class="chart-selector">
        <h2>Activities Visualization</h2>
        <select v-model="activitiesChartType" class="chart-type-selector">
          <option v-for="option in activitiesChartOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Bar Chart -->
      <div v-if="activitiesChartType === 'bar'" class="chart-container">
        <h3>Activities by Type</h3>
        <div class="chart-wrapper">
          <canvas ref="activitiesBarChart"></canvas>
        </div>
      </div>

      <!-- Pie Chart -->
      <div v-if="activitiesChartType === 'pie'" class="chart-container">
        <h3>Activities Distribution</h3>
        <div class="chart-wrapper">
          <canvas ref="activitiesPieChart"></canvas>
        </div>
      </div>

      <!-- Calendar Heatmap -->
      <div v-if="activitiesChartType === 'calendar'" class="chart-container">
        <h3>Activity Calendar</h3>
        <div class="calendar-heatmap">
          <!-- This would be implemented with a heatmap library in a real app -->
          <div class="heatmap-placeholder">
            <p>Activity heatmap would be displayed here</p>
            <p>Showing frequency of activities over time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Time Range Selector -->
    <div class="time-range-selector">
      <label>Time Range:</label>
      <select v-model="timeRange" @change="updateCharts">
        <option value="all">All Time</option>
        <option value="year">Last Year</option>
        <option value="month">Last Month</option>
        <option value="week">Last Week</option>
      </select>
    </div>
    
    <!-- Theme Toggle Button -->
    <div class="theme-toggle-container">
      <button class="theme-toggle" @click="toggleTheme">
        <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        <span>{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Chart, registerables } from 'chart.js';

export default {
  name: 'ProgressDashboard',
  data() {
    return {
      activeMainTab: 'projects',
      darkMode: false, // Added darkMode variable
      sidebarCollapsed: false, // Added for compatibility with logo
      mainTabs: [
        { id: 'projects', label: 'Projects' },
        { id: 'skills', label: 'Skills' },
        { id: 'objectives', label: 'Objectives' },
        { id: 'activities', label: 'Activities' }
      ],
      projectsChartType: 'completion',
      projectsChartOptions: [
        { value: 'completion', label: 'Completion Status' },
        { value: 'technologies', label: 'Technologies Used' },
        { value: 'timeline', label: 'Timeline View' },
        { value: 'progress', label: 'Progress Bars' }
      ],
      skillsChartType: 'radar',
      skillsChartOptions: [
        { value: 'radar', label: 'Radar Chart' },
        { value: 'progress', label: 'Progress Bars' },
        { value: 'doughnut', label: 'Categories Doughnut' }
      ],
      objectivesChartType: 'completion',
      objectivesChartOptions: [
        { value: 'completion', label: 'Completion Status' },
        { value: 'progress', label: 'Progress Bars' },
        { value: 'timeline', label: 'Timeline View' }
      ],
      activitiesChartType: 'bar',
      activitiesChartOptions: [
        { value: 'bar', label: 'Activities by Type' },
        { value: 'pie', label: 'Activities Distribution' },
        { value: 'calendar', label: 'Calendar Heatmap' }
      ],
      timeRange: 'all',
      projects: [],
      skills: [],
      objectives: [],
      activities: [],
      charts: {}
    };
  },
  computed: {
    filteredProjects() {
      return this.filterByDateRange(this.projects, 'startDate');
    },
    filteredSkills() {
      return this.skills; // Skills don't typically have dates
    },
    filteredObjectives() {
      return this.filterByDateRange(this.objectives, 'startDate');
    },
    filteredActivities() {
      return this.filterByDateRange(this.activities, 'date');
    },
    sortedProjects() {
      return [...this.filteredProjects].sort((a, b) => 
        new Date(a.startDate) - new Date(b.startDate)
      );
    },
    sortedObjectives() {
      return [...this.filteredObjectives].sort((a, b) => 
        new Date(a.startDate) - new Date(b.startDate)
      );
    },
    technologyUsage() {
      const techMap = {};
      this.filteredProjects.forEach(project => {
        (project.technologies || []).forEach(tech => {
          techMap[tech] = (techMap[tech] || 0) + 1;
        });
      });
      return techMap;
    },
    topTechnologies() {
      return Object.entries(this.technologyUsage)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    },
    skillCategories() {
      const categories = {};
      this.filteredSkills.forEach(skill => {
        if (!categories[skill.category]) {
          categories[skill.category] = 0;
        }
        categories[skill.category]++;
      });
      return categories;
    },
    activityTypes() {
      const types = {};
      this.filteredActivities.forEach(activity => {
        if (!types[activity.type]) {
          types[activity.type] = 0;
        }
        types[activity.type]++;
      });
      return types;
    }
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
    },
    async loadData() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      
      try {
        // Load projects
        const projectsQuery = query(collection(db, 'users', user.uid, 'projects'));
        const projectsSnapshot = await getDocs(projectsQuery);
        this.projects = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Load skills
        const skillsQuery = query(collection(db, 'users', user.uid, 'skills'));
        const skillsSnapshot = await getDocs(skillsQuery);
        this.skills = skillsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Load objectives
        const objectivesQuery = query(collection(db, 'users', user.uid, 'objectives'));
        const objectivesSnapshot = await getDocs(objectivesQuery);
        this.objectives = objectivesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Load activities
        const activitiesQuery = query(collection(db, 'users', user.uid, 'activities'));
        const activitiesSnapshot = await getDocs(activitiesQuery);
        this.activities = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Initialize charts after data is loaded
        this.$nextTick(() => {
          this.initCharts();
        });

      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    filterByDateRange(items, dateField) {
      if (this.timeRange === 'all') return items;
      
      const now = new Date();
      let cutoffDate = new Date();
      
      switch(this.timeRange) {
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
      }
      
      return items.filter(item => {
        const itemDate = new Date(item[dateField] || 0);
        return itemDate >= cutoffDate;
      });
    },
    getProjectProgress(project) {
      if (project.status === 'completed') return 100;
      if (project.status === 'in-progress' && project.progress) return project.progress;
      if (project.status === 'planning') return 0;
      if (project.status === 'on-hold') return 50;
      return 0;
    },
    getObjectiveStatus(objective, formatted = false) {
      if (objective.progress >= 100) return formatted ? 'Completed' : 'completed';
      if (objective.progress > 0) return formatted ? 'In Progress' : 'in-progress';
      return formatted ? 'Not Started' : 'not-started';
    },
    getTimelinePosition(dateString) {
      if (!dateString) return 0;
      
      const items = this.activeMainTab === 'projects' ? this.projects : 
                   this.activeMainTab === 'objectives' ? this.objectives : 
                   this.activities;
      
      const dates = items
        .map(item => item.startDate || item.date ? new Date(item.startDate || item.date) : null)
        .filter(d => d);
      
      if (dates.length === 0) return 50;
      
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      
      if (minDate.getTime() === maxDate.getTime()) return 50;
      
      const currentDate = new Date(dateString);
      const totalRange = maxDate - minDate;
      const positionFromStart = currentDate - minDate;
      
      return (positionFromStart / totalRange) * 100;
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    formatStatus(status) {
      const statusMap = {
        'planning': 'Planning',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'on-hold': 'On Hold',
        'not-started': 'Not Started'
      };
      return statusMap[status] || status;
    },
    initCharts() {
      Chart.register(...registerables);
      
      // Destroy existing charts
      Object.values(this.charts).forEach(chart => {
        if (chart) chart.destroy();
      });
      this.charts = {};

      // Initialize charts based on active tab and chart type
      if (this.activeMainTab === 'projects') {
        if (this.projectsChartType === 'completion') {
          this.initCompletionChart();
        } else if (this.projectsChartType === 'technologies') {
          this.initTechnologiesChart();
        }
      } else if (this.activeMainTab === 'skills') {
        if (this.skillsChartType === 'radar') {
          this.initSkillsRadarChart();
        } else if (this.skillsChartType === 'doughnut') {
          this.initSkillsDoughnutChart();
        }
      } else if (this.activeMainTab === 'objectives') {
        if (this.objectivesChartType === 'completion') {
          this.initObjectivesCompletionChart();
        }
      } else if (this.activeMainTab === 'activities') {
        if (this.activitiesChartType === 'bar') {
          this.initActivitiesBarChart();
        } else if (this.activitiesChartType === 'pie') {
          this.initActivitiesPieChart();
        }
      }
    },
    initCompletionChart() {
      if (!this.$refs.completionChart) return;
      
      const ctx = this.$refs.completionChart.getContext('2d');
      
      const statusCounts = {
        planning: 0,
        'in-progress': 0,
        completed: 0,
        'on-hold': 0
      };
      
      this.filteredProjects.forEach(project => {
        statusCounts[project.status]++;
      });
      
      this.charts.completion = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Planning', 'In Progress', 'Completed', 'On Hold'],
          datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: [
              '#f39c12',
              '#3498db',
              '#2ecc71',
              '#95a5a6'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: this.darkMode ? '#fff' : '#1e293b'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.raw} projects`;
                }
              }
            }
          }
        }
      });
    },
    initTechnologiesChart() {
      if (!this.$refs.technologiesChart) return;
      
      const ctx = this.$refs.technologiesChart.getContext('2d');
      const topTechs = this.topTechnologies.slice(0, 10);
      
      this.charts.technologies = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topTechs.map(tech => tech.name),
          datasets: [{
            label: 'Projects using this technology',
            data: topTechs.map(tech => tech.count),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: this.darkMode ? '#fff' : '#1e293b'
              },
              grid: {
                color: this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              ticks: {
                color: this.darkMode ? '#fff' : '#1e293b'
              },
              grid: {
                color: this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    },
    initSkillsRadarChart() {
      if (!this.$refs.skillsRadarChart) return;
      
      const ctx = this.$refs.skillsRadarChart.getContext('2d');
      const categories = Object.keys(this.skillCategories);
      const categoryAverages = categories.map(category => {
        const categorySkills = this.skills.filter(skill => skill.category === category);
        const average = categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length;
        return Math.round(average * 10) / 10;
      });
      
      this.charts.skillsRadar = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Average Skill Level',
            data: categoryAverages,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
          }]
        },
        options: {
          scales: {
            r: {
              angleLines: {
                display: true,
                color: this.darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
              },
              suggestedMin: 0,
              suggestedMax: 10,
              ticks: {
                stepSize: 2,
                color: this.darkMode ? '#fff' : '#1e293b'
              },
              grid: {
                color: this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              pointLabels: {
                color: this.darkMode ? '#fff' : '#1e293b'
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Average: ${context.raw}/10`;
                }
              }
            },
            legend: {
              labels: {
                color: this.darkMode ? '#fff' : '#1e293b'
              }
            }
          }
        }
      });
    },
    initSkillsDoughnutChart() {
      if (!this.$refs.skillsDoughnutChart) return;
      
      const ctx = this.$refs.skillsDoughnutChart.getContext('2d');
      const categories = Object.entries(this.skillCategories);
      
      // Generate distinct colors for each category
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC24A', '#FF5A5F', '#7B68EE', '#20B2AA'
      ];
      
      this.charts.skillsDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories.map(([name]) => name),
          datasets: [{
            data: categories.map(([, count]) => count),
            backgroundColor: categories.map((_, i) => colors[i % colors.length]),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: this.darkMode ? '#fff' : '#1e293b'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.raw} skills`;
                }
              }
            }
          }
        }
      });
    },
    initObjectivesCompletionChart() {
      if (!this.$refs.objectivesCompletionChart) return;
      
      const ctx = this.$refs.objectivesCompletionChart.getContext('2d');
      
      const statusCounts = {
        'not-started': 0,
        'in-progress': 0,
        'completed': 0
      };
      
      this.filteredObjectives.forEach(obj => {
        statusCounts[this.getObjectiveStatus(obj, false)]++;
      });
      
      this.charts.objectivesCompletion = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Not Started', 'In Progress', 'Completed'],
          datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: [
              '#e0e0e0',
              '#3498db',
              '#2ecc71'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: this.darkMode ? '#fff' : '#1e293b'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.raw} objectives`;
                }
              }
            }
          }
        }
      });
    },
    initActivitiesBarChart() {
      if (!this.$refs.activitiesBarChart) return;
      
      const ctx = this.$refs.activitiesBarChart.getContext('2d');
      const activityTypes = Object.entries(this.activityTypes);
      
      this.charts.activitiesBar = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: activityTypes.map(([name]) => name),
          datasets: [{
            label: 'Number of Activities',
            data: activityTypes.map(([, count]) => count),
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
     options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  color: this.darkMode ? '#fff' : '#1e293b'
                },
                grid: {
                  color: this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: this.darkMode ? '#fff' : '#1e293b'
                },
                grid: {
                  color: this.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      },
      initActivitiesPieChart() {
        if (!this.$refs.activitiesPieChart) return;
        
        const ctx = this.$refs.activitiesPieChart.getContext('2d');
        const activityTypes = Object.entries(this.activityTypes);
        
        // Generate distinct colors for each activity type
        const colors = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#8AC24A', '#FF5A5F', '#7B68EE', '#20B2AA'
        ];
        
        this.charts.activitiesPie = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: activityTypes.map(([name]) => name),
            datasets: [{
              data: activityTypes.map(([, count]) => count),
              backgroundColor: activityTypes.map((_, i) => colors[i % colors.length]),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  color: this.darkMode ? '#fff' : '#1e293b'
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.raw} activities`;
                  }
                }
              }
            }
          }
        });
      },
      updateCharts() {
        this.$nextTick(() => {
          this.initCharts();
        });
      },
      // Helper method to detect when chart type changes
      watchChartTypeChange() {
        this.$watch('projectsChartType', this.updateCharts);
        this.$watch('skillsChartType', this.updateCharts);
        this.$watch('objectivesChartType', this.updateCharts);
        this.$watch('activitiesChartType', this.updateCharts);
        this.$watch('activeMainTab', this.updateCharts);
      }
    },
    mounted() {
      // Register chart.js
      Chart.register(...registerables);
      
      // Load user data
      this.loadData();
      
      // Watch for chart type changes
      this.watchChartTypeChange();
      
      // Check for saved theme preference
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        this.darkMode = savedDarkMode === 'true';
      } else {
        // Default to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.darkMode = prefersDark;
      }
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('darkMode') === null) {
          this.darkMode = e.matches;
        }
      });
    }
  }
</script>

<style scoped>
body{
  padding:2px;
}
.return-to-dash {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}
.timeline-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.timeline-dashboard.dark-mode {
  background-color: #1e293b;
  color: #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.dashboard-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo-container {
  margin: 0;
  padding: 0;
  height: 300px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logo-container img {
  height: 300px;
  width:300px;
  object-fit: contain;
}

.dashboard-header h1 {
  margin: .5rem 0;
  color: #2563eb;
  font-size: 1.8rem;
}

.dark-mode .dashboard-header h1 {
  color: #60a5fa;
}

.dashboard-header p {
  color: #64748b;
  margin-top: 0;
}

.dark-mode .dashboard-header p {
  color: #94a3b8;
}

.main-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.main-tabs button {
  padding: 10px 20px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 5px;
  color: #1e293b;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dark-mode .main-tabs button {
  background-color: #334155;
  color: #e5e7eb;
}

.main-tabs button.active {
  background-color: #2563eb;
  color: white;
}

.dark-mode .main-tabs button.active {
  background-color: #3b82f6;
}

.section-container {
  margin-bottom: 20px;
}

.chart-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.chart-selector h2 {
  margin: 0;
  color: #334155;
  font-size: 1.5rem;
}

.dark-mode .chart-selector h2 {
  color: #cbd5e1;
}

.chart-type-selector {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #1e293b;
  cursor: pointer;
  font-size: 0.9rem;
}

.dark-mode .chart-type-selector {
  background-color: #334155;
  border-color: #475569;
  color: #e5e7eb;
}

.chart-container {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dark-mode .chart-container {
  background-color: #334155;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.chart-container h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #334155;
  font-size: 1.2rem;
}

.dark-mode .chart-container h3 {
  color: #e5e7eb;
}

.chart-wrapper {
  position: relative;
  max-height: 1100px;
  margin: 0 auto;

}

.progress-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-bar-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.project-info, .skill-info, .objective-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name, .skill-name, .objective-name {
  font-weight: 500;
}

.project-status, .skill-category, .objective-status {
  font-size: 0.9rem;
  color: #64748b;
}

.dark-mode .project-status, 
.dark-mode .skill-category, 
.dark-mode .objective-status {
  color: #94a3b8;
}

.progress-container {
  height: 10px;
  background-color: #e5e7eb;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.dark-mode .progress-container {
  background-color: #475569;
}

.progress-bar {
  height: 100%;
  background-color: #2563eb;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-bar.planning {
  background-color: #f39c12;
}

.progress-bar.in-progress {
  background-color: #3498db;
}

.progress-bar.completed {
  background-color: #2ecc71;
}

.progress-bar.on-hold {
  background-color: #95a5a6;
}

.progress-bar.not-started {
  background-color: #e0e0e0;
}

.progress-percent {
  position: absolute;
  right: 5px;
  top: -15px;
  font-size: 0.8rem;
  color: #64748b;
}

.dark-mode .progress-percent {
  color: #94a3b8;
}

.timeline-wrapper {
  position: relative;
  height: 200px;
  margin: 30px 0;
  padding-top: 20px;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e5e7eb;
  z-index: 1;
}

.dark-mode .timeline-line {
  background-color: #475569;
}

.timeline-item {
  position: absolute;
  transform: translateX(-50%);
  z-index: 2;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #2563eb;
  margin: 0 auto;
}

.timeline-item.planning .timeline-dot {
  background-color: #f39c12;
}

.timeline-item.in-progress .timeline-dot {
  background-color: #3498db;
}

.timeline-item.completed .timeline-dot {
  background-color: #2ecc71;
}

.timeline-item.on-hold .timeline-dot {
  background-color: #95a5a6;
}

.timeline-item.not-started .timeline-dot {
  background-color: #e0e0e0;
}

.timeline-content {
  background-color: white;
  border-radius: 5px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 150px;
  margin-top: 10px;
}

.dark-mode .timeline-content {
  background-color: #334155;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.timeline-date {
  font-size: 0.8rem;
  color: #64748b;
}

.dark-mode .timeline-date {
  color: #94a3b8;
}

.timeline-title {
  font-weight: 500;
  margin: 3px 0;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timeline-progress {
  height: 5px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.dark-mode .timeline-progress {
  background-color: #475569;
}

.time-range-selector {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  gap: 10px;
}

.time-range-selector label {
  font-size: 0.9rem;
  font-weight: 500;
}

.time-range-selector select {
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #1e293b;
  cursor: pointer;
  font-size: 0.9rem;
}

.dark-mode .time-range-selector select {
  background-color: #334155;
  border-color: #475569;
  color: #e5e7eb;
}

.theme-toggle-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 5px;
  color: #1e293b;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dark-mode .theme-toggle {
  background-color: #334155;
  color: #e5e7eb;
}

.theme-toggle:hover {
  background-color: #d1d5db;
}

.dark-mode .theme-toggle:hover {
  background-color: #475569;
}

.calendar-heatmap {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 5px;
}

.dark-mode .calendar-heatmap {
  background-color: #1e293b;
}

.heatmap-placeholder {
  text-align: center;
  color: #64748b;
}

.dark-mode .heatmap-placeholder {
  color: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chart-selector {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .time-range-selector {
    justify-content: flex-start;
  }
  
  .chart-wrapper {
    max-height: 300px;
  }
}

@media (max-width: 480px) {
  .main-tabs {
    flex-direction: column;
    gap: 5px;
  }
  
  .main-tabs button {
    width: 100%;
    padding: 8px;
  }
  
  .chart-container {
    padding: 10px;
  }
  
  .timeline-wrapper {
    height: 250px;
  }
}
</style>