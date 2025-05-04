<template>
  <div class="timeline-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <h1>My Progress Timeline</h1>
      <p>Visualize your growth and achievements across different areas</p>
    </div>

    <!-- Visualization Selector -->
    <div class="visualization-selector">
      <div class="selector-tabs">
        <button 
          v-for="tab in visualizationTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="time-range-selector">
        <label>Time Range:</label>
        <select v-model="timeRange">
          <option value="all">All Time</option>
          <option value="year">Last Year</option>
          <option value="month">Last Month</option>
          <option value="week">Last Week</option>
        </select>
      </div>
    </div>

    <!-- Projects Progress Section -->
    <div v-if="activeTab === 'projects'" class="visualization-section">
      <h2>Projects Progress</h2>
      <div class="chart-container">
        <div class="chart-options">
          <button 
            v-for="option in projectChartOptions" 
            :key="option.id"
            @click="activeProjectChart = option.id"
            :class="{ active: activeProjectChart === option.id }"
          >
            {{ option.label }}
          </button>
        </div>

        <!-- Projects Completion Chart -->
        <div v-if="activeProjectChart === 'completion'" class="chart-wrapper">
          <div class="chart-legend">
            <div v-for="status in projectStatuses" :key="status.id" class="legend-item">
              <span class="legend-color" :class="status.id"></span>
              <span>{{ status.label }} ({{ statusCounts[status.id] || 0 }})</span>
            </div>
          </div>
          <div class="completion-chart">
            <div 
              v-for="project in filteredProjects" 
              :key="project.id"
              class="project-bar"
              :class="project.status"
              :style="{ width: `${getProjectProgress(project)}%` }"
              :title="`${project.name} - ${getProjectProgress(project)}%`"
            >
              <span class="project-name">{{ project.name }}</span>
              <span class="project-percent">{{ getProjectProgress(project) }}%</span>
            </div>
          </div>
        </div>

        <!-- Timeline Chart -->
        <div v-if="activeProjectChart === 'timeline'" class="timeline-chart">
          <div class="timeline-axis">
            <div 
              v-for="(label, index) in timelineLabels" 
              :key="index"
              class="timeline-label"
              :style="{ left: `${index * (100 / (timelineLabels.length - 1))}%` }"
            >
              {{ label }}
            </div>
          </div>
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
              <div class="timeline-status">{{ formatStatus(project.status) }}</div>
              <div class="timeline-progress">
                <div class="progress-bar" :style="{ width: `${getProjectProgress(project)}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technology Usage Chart -->
        <div v-if="activeProjectChart === 'technologies'" class="tech-chart">
          <h3>Technology Usage</h3>
          <div class="tech-bars">
            <div 
              v-for="tech in topTechnologies" 
              :key="tech.name"
              class="tech-bar"
              :style="{ width: `${(tech.count / maxTechCount) * 100}%` }"
            >
              <span class="tech-name">{{ tech.name }}</span>
              <span class="tech-count">{{ tech.count }} projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Objectives Progress Section -->
    <div v-if="activeTab === 'objectives'" class="visualization-section">
      <h2>Objectives Progress</h2>
      <div class="chart-container">
        <div class="chart-options">
          <button 
            v-for="option in objectiveChartOptions" 
            :key="option.id"
            @click="activeObjectiveChart = option.id"
            :class="{ active: activeObjectiveChart === option.id }"
          >
            {{ option.label }}
          </button>
        </div>

        <!-- Objectives Completion Chart -->
        <div v-if="activeObjectiveChart === 'completion'" class="objectives-chart">
          <div 
            v-for="objective in filteredObjectives" 
            :key="objective.id"
            class="objective-item"
          >
            <div class="objective-info">
              <h3>{{ objective.title }}</h3>
              <p>{{ objective.description }}</p>
              <div class="objective-dates">
                <span>Start: {{ formatDate(objective.startDate) }}</span>
                <span v-if="objective.endDate">End: {{ formatDate(objective.endDate) }}</span>
              </div>
            </div>
            <div class="objective-progress">
              <div class="progress-container">
                <div 
                  class="progress-bar"
                  :style="{ width: `${objective.progress || 0}%` }"
                ></div>
              </div>
              <span class="progress-percent">{{ objective.progress || 0 }}%</span>
            </div>
          </div>
        </div>

        <!-- Objectives Timeline -->
        <div v-if="activeObjectiveChart === 'timeline'" class="objectives-timeline">
          <div class="timeline-line"></div>
          <div 
            v-for="objective in sortedObjectives" 
            :key="objective.id"
            class="timeline-item"
            :class="getObjectiveStatus(objective)"
            :style="{ left: `${getTimelinePosition(objective.startDate)}%` }"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-date">{{ formatDate(objective.startDate) }}</div>
              <div class="timeline-title">{{ objective.title }}</div>
              <div class="timeline-status">{{ getObjectiveStatus(objective, true) }}</div>
              <div class="timeline-progress">
                <div class="progress-bar" :style="{ width: `${objective.progress || 0}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Progress Section -->
    <div v-if="activeTab === 'skills'" class="visualization-section">
      <h2>Skills Development</h2>
      <div class="chart-container">
        <div class="chart-options">
          <button 
            v-for="option in skillChartOptions" 
            :key="option.id"
            @click="activeSkillChart = option.id"
            :class="{ active: activeSkillChart === option.id }"
          >
            {{ option.label }}
          </button>
        </div>

        <!-- Skills Radar Chart -->
        <div v-if="activeSkillChart === 'radar'" class="radar-chart-container">
          <canvas ref="radarChart"></canvas>
        </div>

        <!-- Skills Progress Bars -->
        <div v-if="activeSkillChart === 'progress'" class="skills-progress-chart">
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.id"
            class="skill-item"
          >
            <div class="skill-info">
              <h3>{{ skill.name }}</h3>
              <p>{{ skill.category }}</p>
            </div>
            <div class="skill-progress">
              <div class="progress-container">
                <div 
                  class="progress-bar"
                  :style="{ width: `${skill.level * 10}%` }"
                ></div>
              </div>
              <span class="skill-level">Level {{ skill.level }}/10</span>
            </div>
          </div>
        </div>

        <!-- Skills Timeline -->
        <div v-if="activeSkillChart === 'timeline'" class="skills-timeline">
          <div class="timeline-line"></div>
          <div 
            v-for="milestone in skillMilestones" 
            :key="milestone.id"
            class="timeline-item"
            :style="{ left: `${getTimelinePosition(milestone.date)}%` }"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-date">{{ formatDate(milestone.date) }}</div>
              <div class="timeline-title">{{ milestone.skill }} Level {{ milestone.level }}</div>
              <div class="timeline-description">{{ milestone.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Chart, registerables } from 'chart.js';

export default {
  name: 'TimelineDashboard',
  data() {
    return {
      activeTab: 'projects',
      visualizationTabs: [
        { id: 'projects', label: 'Projects' },
        { id: 'objectives', label: 'Objectives' },
        { id: 'skills', label: 'Skills' }
      ],
      timeRange: 'all',
      activeProjectChart: 'completion',
      projectChartOptions: [
        { id: 'completion', label: 'Completion' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'technologies', label: 'Technologies' }
      ],
      activeObjectiveChart: 'completion',
      objectiveChartOptions: [
        { id: 'completion', label: 'Completion' },
        { id: 'timeline', label: 'Timeline' }
      ],
      activeSkillChart: 'radar',
      skillChartOptions: [
        { id: 'radar', label: 'Radar Chart' },
        { id: 'progress', label: 'Progress Bars' },
        { id: 'timeline', label: 'Milestones' }
      ],
      projects: [],
      objectives: [],
      skills: [],
      skillMilestones: [],
      projectStatuses: [
        { id: 'planning', label: 'Planning' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'completed', label: 'Completed' },
        { id: 'on-hold', label: 'On Hold' }
      ],
      radarChart: null,
      timelineLabels: ['Jan', 'Apr', 'Jul', 'Oct', 'Dec']
    };
  },
  computed: {
    filteredProjects() {
      return this.filterByDateRange(this.projects, 'startDate');
    },
    filteredObjectives() {
      return this.filterByDateRange(this.objectives, 'startDate');
    },
    filteredSkills() {
      return this.skills; // Skills don't have dates by default
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
    statusCounts() {
      const counts = {};
      this.projectStatuses.forEach(status => {
        counts[status.id] = this.filteredProjects.filter(
          p => p.status === status.id
        ).length;
      });
      return counts;
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
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    },
    maxTechCount() {
      return this.topTechnologies.length > 0 
        ? Math.max(...this.topTechnologies.map(t => t.count))
        : 1;
    }
  },
  methods: {
    async loadData() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      
      try {
        // Load projects
        const projectsQuery = query(
          collection(db, 'users', user.uid, 'projects')
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        this.projects = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Load objectives
        const objectivesQuery = query(
          collection(db, 'users', user.uid, 'objectives')
        );
        const objectivesSnapshot = await getDocs(objectivesQuery);
        this.objectives = objectivesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Load skills
        const skillsQuery = query(
          collection(db, 'users', user.uid, 'skills')
        );
        const skillsSnapshot = await getDocs(skillsQuery);
        this.skills = skillsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Load skill milestones
        const milestonesQuery = query(
          collection(db, 'users', user.uid, 'skillMilestones')
        );
        const milestonesSnapshot = await getDocs(milestonesQuery);
        this.skillMilestones = milestonesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Initialize charts after data is loaded
        this.$nextTick(() => {
          this.initRadarChart();
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
      
      const items = this.activeTab === 'projects' ? this.projects : 
                   this.activeTab === 'objectives' ? this.objectives : 
                   this.skillMilestones;
      
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
    initRadarChart() {
      if (!this.$refs.radarChart) return;
      
      Chart.register(...registerables);
      
      if (this.radarChart) {
        this.radarChart.destroy();
      }
      
      const ctx = this.$refs.radarChart.getContext('2d');
      
      // Group skills by category for the radar chart
      const categories = [...new Set(this.skills.map(skill => skill.category))];
      const categoryAverages = categories.map(category => {
        const categorySkills = this.skills.filter(skill => skill.category === category);
        const average = categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length;
        return Math.round(average * 10) / 10; // Round to 1 decimal place
      });
      
      this.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Skill Level',
            data: categoryAverages,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointRadius: 4
          }]
        },
        options: {
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0,
              suggestedMax: 10,
              ticks: {
                stepSize: 2
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Average: ${context.raw}/10`;
                }
              }
            }
          }
        }
      });
    }
  },
  mounted() {
    this.loadData();
  },
  beforeUnmount() {
    if (this.radarChart) {
      this.radarChart.destroy();
    }
  },
  watch: {
    activeTab() {
      this.$nextTick(() => {
        if (this.activeTab === 'skills' && this.activeSkillChart === 'radar') {
          this.initRadarChart();
        }
      });
    },
    activeSkillChart(newVal) {
      if (newVal === 'radar') {
        this.$nextTick(() => {
          this.initRadarChart();
        });
      }
    },
    timeRange() {
      this.$nextTick(() => {
        if (this.activeTab === 'skills' && this.activeSkillChart === 'radar') {
          this.initRadarChart();
        }
      });
    }
  }
};
</script>

<style scoped>
.timeline-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.visualization-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.selector-tabs {
  display: flex;
  gap: 0.5rem;
}

.selector-tabs button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #f8f9fa;
  color: #495057;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.selector-tabs button.active {
  background: #3a7bd5;
  color: white;
}

.time-range-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-range-selector label {
  font-weight: 500;
  color: #495057;
}

.time-range-selector select {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
}

.visualization-section {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.visualization-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

.chart-container {
  margin-top: 1.5rem;
}

.chart-options {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.chart-options button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #f8f9fa;
  color: #495057;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-options button.active {
  background: #3a7bd5;
  color: white;
}

/* Projects Completion Chart */
.completion-chart {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-bar {
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  color: white;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  transition: width 0.5s ease;
}

.project-bar.planning {
  background-color: #f39c12;
}

.project-bar.in-progress {
  background-color: #3498db;
}

.project-bar.completed {
  background-color: #2ecc71;
}

.project-bar.on-hold {
  background-color: #95a5a6;
}

.project-name {
  z-index: 1;
}

.project-percent {
  z-index: 1;
  font-weight: bold;
}

/* Timeline Charts */
.timeline-chart, .objectives-timeline, .skills-timeline {
  position: relative;
  height: 400px;
  margin-top: 2rem;
}

.timeline-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background-color: #e0e0e0;
  transform: translateY(-50%);
}

.timeline-item {
  position: absolute;
  width: 220px;
  margin-left: -110px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timeline-item:hover {
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.timeline-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  top: -8px;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timeline-date {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.timeline-title {
  font-weight: 600;
  color: #2c3e50;
}

.timeline-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  display: inline-block;
  width: fit-content;
}

.timeline-item.planning .timeline-status {
  background-color: rgba(243, 156, 18, 0.15);
  color: #d35400;
}

.timeline-item.in-progress .timeline-status {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.timeline-item.completed .timeline-status {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.timeline-item.on-hold .timeline-status {
  background-color: rgba(149, 165, 166, 0.15);
  color: #7f8c8d;
}

.timeline-item.not-started .timeline-status {
  background-color: rgba(224, 224, 224, 0.15);
  color: #495057;
}

.timeline-progress {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.timeline-progress .progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  border-radius: 3px;
}

.timeline-axis {
  position: relative;
  height: 30px;
  margin-bottom: 1rem;
}

.timeline-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #7f8c8d;
}

/* Technology Chart */
.tech-chart {
  margin-top: 1rem;
}

.tech-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tech-bar {
  height: 40px;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  color: white;
  font-weight: 500;
  transition: width 0.5s ease;
}

.tech-name {
  font-weight: 600;
}

.tech-count {
  font-weight: bold;
}

/* Objectives Chart */
.objectives-chart {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.objective-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.objective-info {
  flex: 1;
}

.objective-info h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.objective-info p {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.objective-dates {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #95a5a6;
}

.objective-progress {
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.progress-container {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  border-radius: 4px;
}

.progress-percent {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3a7bd5;
  text-align: right;
}

/* Skills Charts */
.radar-chart-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.skills-progress-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-items: center;
}

.skill-info {
  flex: 1;
}

.skill-info h3 {
  margin-top: 0;
  margin-bottom: 0.25rem;
  color: #2c3e50;
}

.skill-info p {
  margin-top: 0;
  margin-bottom: 0;
  color: #7f8c8d;
  font-size: 0.8rem;
}

.skill-progress {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.skill-level {
  font-size: 0.8rem;
  color: #3a7bd5;
  font-weight: 500;
  text-align: right;
}

/* Legend */
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-color.planning {
  background-color: #f39c12;
}

.legend-color.in-progress {
  background-color: #3498db;
}

.legend-color.completed {
  background-color: #2ecc71;
}

.legend-color.on-hold {
  background-color: #95a5a6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .visualization-selector {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .chart-options {
    flex-wrap: wrap;
  }
  
  .objective-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .objective-progress {
    width: 100%;
  }
  
  .timeline-item {
    width: 180px;
    margin-left: -90px;
  }
  
  .skill-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .skill-progress {
    width: 100%;
  }
}
</style>