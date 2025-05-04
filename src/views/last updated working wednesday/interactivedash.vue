<template>
    <div class="dashboard-container">
      <h1>My Development Dashboard</h1>
      
      <div class="dashboard-grid">
        <!-- Overview Cards -->
        <div class="overview-cards">
          <div class="card skills-card">
            <h3>Skills</h3>
            <div class="card-content">
              <div class="stat">
                <span class="stat-value">{{ skillStats.total }}</span>
                <span class="stat-label">Total Skills</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ skillStats.advanced }}</span>
                <span class="stat-label">Advanced</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ skillStats.learning }}</span>
                <span class="stat-label">Learning</span>
              </div>
            </div>
            <router-link to="/skills" class="card-link">View All Skills</router-link>
          </div>
          
          <div class="card projects-card">
            <h3>Projects</h3>
            <div class="card-content">
              <div class="stat">
                <span class="stat-value">{{ projectStats.total }}</span>
                <span class="stat-label">Total Projects</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ projectStats.completed }}</span>
                <span class="stat-label">Completed</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ projectStats.inProgress }}</span>
                <span class="stat-label">In Progress</span>
              </div>
            </div>
            <router-link to="/projects" class="card-link">View All Projects</router-link>
          </div>
          
          <div class="card objectives-card">
            <h3>Objectives</h3>
            <div class="card-content">
              <div class="stat">
                <span class="stat-value">{{ objectiveStats.total }}</span>
                <span class="stat-label">Total Objectives</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ objectiveStats.completed }}</span>
                <span class="stat-label">Completed</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ objectiveStats.inProgress }}</span>
                <span class="stat-label">In Progress</span>
              </div>
            </div>
            <router-link to="/objectives" class="card-link">View All Objectives</router-link>
          </div>
          
          <div class="card timeline-card">
            <h3>Timeline</h3>
            <div class="card-content">
              <div class="stat">
                <span class="stat-value">{{ timelineStats.total }}</span>
                <span class="stat-label">Total Events</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ timelineStats.education }}</span>
                <span class="stat-label">Education</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ timelineStats.work }}</span>
                <span class="stat-label">Work</span>
              </div>
            </div>
            <router-link to="/timeline" class="card-link">View Timeline</router-link>
          </div>
        </div>
        
        <div> <chart/></div>
        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-container">
            <h3>Skills by Level</h3>
            <div class="chart-wrapper">
              <canvas ref="skillsChart"></canvas>
            </div>
          </div>
          
          <div class="chart-container">
            <h3>Projects by Status</h3>
            <div class="chart-wrapper">
              <canvas ref="projectsChart"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="recent-activity">
          <h3>Recent Activity</h3>
          <div v-if="loadingActivities" class="loading">Loading activities...</div>
          <ul v-else class="activity-list">
            <li v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <span class="activity-date">{{ formatDate(activity.date) }}</span>
              </div>
            </li>
          </ul>
          <router-link to="/activities" class="view-all">View All Activities</router-link>
        </div>
        
        <!-- Upcoming Deadlines -->
        <div class="upcoming-deadlines">
          <h3>Upcoming Deadlines</h3>
          <div v-if="loadingDeadlines" class="loading">Loading deadlines...</div>
          <ul v-else class="deadlines-list">
            <li v-for="deadline in upcomingDeadlines" :key="deadline.id" class="deadline-item">
              <div class="deadline-date">
                <span class="day">{{ formatDay(deadline.date) }}</span>
                <span class="month">{{ formatMonth(deadline.date) }}</span>
              </div>
              <div class="deadline-content">
                <h4>{{ deadline.title }}</h4>
                <p>{{ deadline.description }}</p>
                <span class="deadline-type">{{ deadline.type }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import { Chart, registerables } from 'chart.js';
  import chart  from './last updated working wednesday/SkillsChart.vue'; // Assuming SkillsChart.vue is in the same directory
  export default {
    name: 'InteractiveDashboard',
    components: {
      chart
    },
    data() {
      return {
        skillStats: {
          total: 0,
          advanced: 0,
          learning: 0
        },
        projectStats: {
          total: 0,
          completed: 0,
          inProgress: 0
        },
        objectiveStats: {
          total: 0,
          completed: 0,
          inProgress: 0
        },
        timelineStats: {
          total: 0,
          education: 0,
          work: 0
        },
        recentActivities: [],
        upcomingDeadlines: [],
        loadingActivities: true,
        loadingDeadlines: true,
        userId: null,
        skillsChart: null,
        projectsChart: null
      };
    },
    async mounted() {
      Chart.register(...registerables);
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        this.userId = user.uid;
        await this.loadStats();
        await this.loadRecentActivities();
        await this.loadUpcomingDeadlines();
        this.initCharts();
      }
    },
    beforeUnmount() {
      if (this.skillsChart) this.skillsChart.destroy();
      if (this.projectsChart) this.projectsChart.destroy();
    },
    methods: {
      async loadStats() {
        const db = getFirestore();
        
        try {
          // Load skills stats
          const skillsCol = collection(db, 'users', this.userId, 'skills');
          const skillsSnapshot = await getDocs(skillsCol);
          const skills = skillsSnapshot.docs.map(doc => doc.data());
          
          this.skillStats.total = skills.length;
          this.skillStats.advanced = skills.filter(s => s.level === 'Avancé').length;
          this.skillStats.learning = skills.filter(s => s.level === 'Débutant' || s.level === 'Intermédiaire').length;
          
          // Load projects stats
          const projectsCol = collection(db, 'users', this.userId, 'projects');
          const projectsSnapshot = await getDocs(projectsCol);
          const projects = projectsSnapshot.docs.map(doc => doc.data());
          
          this.projectStats.total = projects.length;
          this.projectStats.completed = projects.filter(p => p.status === 'completed').length;
          this.projectStats.inProgress = projects.filter(p => p.status === 'in-progress').length;
          
          // Load objectives stats
          const objectivesCol = collection(db, 'users', this.userId, 'objectives');
          const objectivesSnapshot = await getDocs(objectivesCol);
          const objectives = objectivesSnapshot.docs.map(doc => doc.data());
          
          this.objectiveStats.total = objectives.length;
          this.objectiveStats.completed = objectives.filter(o => o.status === 'completed').length;
          this.objectiveStats.inProgress = objectives.filter(o => o.status === 'in-progress').length;
          
          // Load timeline stats
          const timelineCol = collection(db, 'users', this.userId, 'timeline');
          const timelineSnapshot = await getDocs(timelineCol);
          const timelineEvents = timelineSnapshot.docs.map(doc => doc.data());
          
          this.timelineStats.total = timelineEvents.length;
          this.timelineStats.education = timelineEvents.filter(e => e.type === 'education').length;
          this.timelineStats.work = timelineEvents.filter(e => e.type === 'work').length;
          
        } catch (error) {
          console.error("Error loading dashboard stats:", error);
        }
      },
      async loadRecentActivities() {
        const db = getFirestore();
        
        try {
          const activitiesCol = collection(db, 'users', this.userId, 'activities');
          const q = query(
            activitiesCol,
            orderBy('startedAt', 'desc'),
            limit(5)
          );
          
          const snapshot = await getDocs(q);
          this.recentActivities = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              text: this.getActivityText(data),
              type: this.getActivityType(data),
              date: data.createdAt?.toDate() || new Date()
            };
          });
          
        } catch (error) {
          console.error("Error loading recent activities:", error);
        } finally {
          this.loadingActivities = false;
        }
      },
      async loadUpcomingDeadlines() {
  const db = getFirestore();
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  try {
    // Upcoming project deadlines
    const projectsCol = collection(db, 'users', this.userId, 'projects');
    const projectsQuery = query(
      projectsCol,
      where('endDate', '>=', Timestamp.fromDate(today)),
      where('endDate', '<=', Timestamp.fromDate(nextMonth)),
      orderBy('endDate', 'asc'),
      limit(5)
    );
    const projectsSnapshot = await getDocs(projectsQuery);
    const projectDeadlines = projectsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.name,
        description: data.description,
        date: data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(data.endDate),
        type: 'Project'
      };
    });

    // Upcoming objective deadlines
    const objectivesCol = collection(db, 'users', this.userId, 'objectives');
    const objectivesQuery = query(
      objectivesCol,
      where('targetDate', '>=', Timestamp.fromDate(today)),
      where('targetDate', '<=', Timestamp.fromDate(nextMonth)),
      orderBy('targetDate', 'asc'),
      limit(5)
    );
    const objectivesSnapshot = await getDocs(objectivesQuery);
    const objectiveDeadlines = objectivesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.targetDate instanceof Timestamp ? data.targetDate.toDate() : new Date(data.targetDate),
        type: 'Learning Objective'
      };
    });

    // Upcoming timeline events
    const timelinesCol = collection(db, 'users', this.userId, 'events');
    const timelinesQuery = query(
      timelinesCol,
      where('endDate', '>=', Timestamp.fromDate(today)),
      where('endDate', '<=', Timestamp.fromDate(nextMonth)),
      orderBy('endDate', 'asc'),
      limit(5)
    );
    const timelinesSnapshot = await getDocs(timelinesQuery);
    const timelineDeadlines = timelinesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        date: data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(data.endDate),
        type: 'Timeline Event'
      };
    });

    // Combine all and sort
    this.upcomingDeadlines = [
      ...projectDeadlines,
      ...objectiveDeadlines,
      ...timelineDeadlines
    ].sort((a, b) => a.date - b.date).slice(0, 5);

  } catch (error) {
    console.error("Error loading upcoming deadlines:", error);
  } finally {
    this.loadingDeadlines = false;
  }
},
      initCharts() {
        // Skills Chart
        const skillsCtx = this.$refs.skillsChart.getContext('2d');
        this.skillsChart = new Chart(skillsCtx, {
          type: 'doughnut',
          data: {
            labels: ['Beginner', 'Intermediate', 'Advanced'],
            datasets: [{
              data: [
                this.skillStats.learning - this.skillStats.intermediate,
                this.skillStats.intermediate,
                this.skillStats.advanced
              ],
              backgroundColor: [
                '#3498db',
                '#2ecc71',
                '#9b59b6'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
        
        // Projects Chart
        const projectsCtx = this.$refs.projectsChart.getContext('2d');
        this.projectsChart = new Chart(projectsCtx, {
          type: 'bar',
          data: {
            labels: ['Planning', 'In Progress', 'Completed', 'On Hold'],
            datasets: [{
              label: 'Projects',
              data: [
                this.projectStats.planning || 0,
                this.projectStats.inProgress,
                this.projectStats.completed,
                this.projectStats.onHold || 0
              ],
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
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      },
      getActivityText(activity) {
        if (activity.objective) {
          return `Worked on "${activity.objective}" - ${activity.progress}% complete`;
        }
        return "Completed an activity";
      },
      getActivityType(activity) {
        if (activity.progress === 100) return 'completed';
        if (activity.progress > 50) return 'in-progress';
        return 'started';
      },
      getActivityIcon(type) {
        switch (type) {
          case 'completed': return 'fas fa-check-circle';
          case 'in-progress': return 'fas fa-spinner';
          default: return 'fas fa-play-circle';
        }
      },
      formatDate(date) {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      formatDay(date) {
        if (!date) return '';
        return date.getDate();
      },
      formatMonth(date) {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      }
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .dashboard-container h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #2c3e50;
  }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .overview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .card h3 {
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.2em;
  }
  
  .card-content {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font-size: 1.8em;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .stat-label {
    font-size: 0.8em;
    color: #7f8c8d;
  }
  
  .card-link {
    margin-top: auto;
    text-align: right;
    color: #3498db;
    text-decoration: none;
    font-size: 0.9em;
  }
  
  .card-link:hover {
    text-decoration: underline;
  }
  
  .skills-card {
    border-top: 4px solid #9b59b6;
  }
  
  .projects-card {
    border-top: 4px solid #2ecc71;
  }
  
  .objectives-card {
    border-top: 4px solid #3498db;
  }
  
  .timeline-card {
    border-top: 4px solid #f39c12;
  }
  
  .charts-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .chart-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .chart-container h3 {
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.2em;
  }
  
  .chart-wrapper {
    position: relative;
    height: 250px;
    width: 100%;
  }
  
  .recent-activity, .upcoming-deadlines {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .recent-activity h3, .upcoming-deadlines h3 {
    margin-top: 0;
    color: #2c3e50;
    font-size: 1.2em;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    color: #7f8c8d;
  }
  
  .activity-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .activity-item {
    display: flex;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .activity-icon.completed {
    background-color: #2ecc71;
  }
  
  .activity-icon.in-progress {
    background-color: #3498db;
  }
  
  .activity-icon.started {
    background-color: #f39c12;
  }
  
  .activity-content {
    flex: 1;
  }
  
  .activity-text {
    margin: 0 0 5px 0;
    color: #2c3e50;
  }
  
  .activity-date {
    font-size: 0.8em;
    color: #7f8c8d;
  }
  
  .view-all {
    display: block;
    text-align: right;
    margin-top: 15px;
    color: #3498db;
    text-decoration: none;
    font-size: 0.9em;
  }
  
  .view-all:hover {
    text-decoration: underline;
  }
  
  .deadlines-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .deadline-item {
    display: flex;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  }
  
  .deadline-item:last-child {
    border-bottom: none;
  }
  
  .deadline-date {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: #f8f9fa;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .deadline-date .day {
    font-size: 1.2em;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .deadline-date .month {
    font-size: 0.7em;
    color: #7f8c8d;
    text-transform: uppercase;
  }
  
  .deadline-content {
    flex: 1;
  }
  
  .deadline-content h4 {
    margin: 0 0 5px 0;
    color: #2c3e50;
  }
  
  .deadline-content p {
    margin: 0 0 5px 0;
    color: #555;
    font-size: 0.9em;
  }
  
  .deadline-type {
    display: inline-block;
    background: #f1f1f1;
    color: #555;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7em;
  }
  
  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
    
    .charts-section {
      grid-template-columns: 1fr;
    }
    
    .chart-wrapper {
      height: 200px;
    }
  }
  </style>