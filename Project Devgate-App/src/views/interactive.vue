<template>
  <div class="app-container" :class="{ 'dark-theme': darkMode }">
    <!-- Enhanced Sidebar -->
    <div class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header" >
        <h2 v-if="!sidebarCollapsed" class="logo-container"><img src="/logoDev.jpg" alt="logo"></h2>
        <i v-else class="fas fa-code logo-icon"></i>
        <button class="collapse-btn" @click="toggleSidebar">
          <i :class="sidebarCollapsed ? 'fas fa-angle-double-right' : 'fas fa-angle-double-left'"></i>
        </button>
      </div>
      
      <div class="user-status">
        <div class="status-indicator" :class="userStatus"></div>
        <img :src="user.profileImageUrl || user.photoURL || 'https://via.placeholder.com/40'" alt="Profile" class="profile-img">
        <div v-if="!sidebarCollapsed" class="user-info">
          <span class="username">{{ user.displayName || 'User' }}</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path" 
          class="nav-item" 
          :class="{ 'active': $route.path.includes(item.path) }"
          @mouseenter="hoverItem = item.path"
          @mouseleave="hoverItem = null"
        >
          <i :class="item.icon"></i>
          <transition name="fade">
            <span v-if="!sidebarCollapsed" class="nav-text">{{ item.text }}</span>
          </transition>
          <div v-if="sidebarCollapsed && hoverItem === item.path" class="nav-tooltip">
            {{ item.text }}
          </div>
        </router-link>
        <a href="#" class="nav-item" @click.prevent="logout">
          <i class="fas fa-sign-out-alt"></i>
          <transition name="fade">
            <span v-if="!sidebarCollapsed" class="nav-text">Logout</span>
          </transition>
          <div v-if="sidebarCollapsed && hoverItem === 'logout'" class="nav-tooltip">
            Logout
          </div>
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          <span v-if="!sidebarCollapsed">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Top Navigation -->
      <nav class="top-nav">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search...">
        </div>
        <div class="nav-actions">
          <button class="nav-btn">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </button>
          <button class="nav-btn">
            <i class="fas fa-envelope"></i>
            <span class="badge">5</span>
          </button>
          <button class="nav-btn profile-btn">
            <img :src="user.profileImageUrl || user.photoURL || 'https://via.placeholder.com/30'" alt="Profile">
          </button>
        </div>
      </nav>

      <!-- Dashboard Content -->
      <div class="dashboard-container">
        <h1>My Development Dashboard</h1>
        
        <div class="dashboard-grid">
          <!-- Overview Cards -->
          <div class="overview-cards">
            <div class="card skills-card">
              <div class="card-header">
                <i class="fas fa-code"></i>
                <h3>Skills</h3>
              </div>
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
              <router-link to="/skills" class="card-link">View All Skills <i class="fas fa-arrow-right"></i></router-link>
            </div>
            
            <div class="card projects-card">
              <div class="card-header">
                <i class="fas fa-project-diagram"></i>
                <h3>Projects</h3>
              </div>
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
              <router-link to="/projects" class="card-link">View All Projects <i class="fas fa-arrow-right"></i></router-link>
            </div>
            
            <div class="card objectives-card">
              <div class="card-header">
                <i class="fas fa-bullseye"></i>
                <h3>Objectives</h3>
              </div>
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
              <router-link to="/objectives" class="card-link">View All Objectives <i class="fas fa-arrow-right"></i></router-link>
            </div>
            
           <!-- <div class="card timeline-card">
              <div class="card-header">
                <i class="fas fa-history"></i>
                <h3>Timeline</h3>
              </div>
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
              <router-link to="/timeline" class="card-link">View Timeline <i class="fas fa-arrow-right"></i></router-link>
            </div>
           -->
          </div>
          <!-- Progress Tracking Section -->
          <div class="progress-section">
            <div class="progress-card">
              <div class="section-header">
                <i class="fas fa-chart-line"></i>
                <h3>Monthly Progress</h3>
              </div>
              <div class="progress-chart">
                <canvas ref="progressChart"></canvas>
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
          <!-- Recent Projects Section -->
          <div class="recent-projects">
            <div class="section-header">
              <i class="fas fa-tasks"></i>
              <h3>Recent Projects</h3>
              <router-link to="/projects" class="view-all">View All</router-link>
            </div>
            <div v-if="loadingProjects" class="loading">
              <i class="fas fa-spinner fa-spin"></i> Loading projects...
            </div>
            <div v-else-if="recentProjects.length === 0" class="no-projects">
              <i class="fas fa-project-diagram"></i>
              <p>No recent projects found</p>
            </div>
            <div v-else class="projects-list">
              <div v-for="project in recentProjects" :key="project.id" class="project-item">
                <div class="project-icon" :class="project.status">
                  <i :class="getProjectIcon(project.status)"></i>
                </div>
                <div class="project-info">
                  <h4>{{ project.name }}</h4>
                  <p>{{ project.description }}</p>
                  <div class="project-meta">
                    <span class="project-deadline">
                      <i class="far fa-calendar-alt"></i> 
                      {{ formatDate(project.endDate) }}
                    </span>
                    <span class="project-progress">
                      <i class="fas fa-spinner"></i> 
                      {{ project.progress }}% Complete
                    </span>
                  </div>
                </div>
                <div class="project-actions">
                  <button @click="openProject(project.id)" class="project-btn">
                    <i class="fas fa-external-link-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Charts Section -->
          <div class="charts-section">
            <div class="chart-container">
              <div class="section-header">
                <i class="fas fa-chart-pie"></i>
                <h3>Skills by Level</h3>
              </div>
              <div class="chart-wrapper">
                <canvas ref="skillsChart"></canvas>
              </div>
            </div>
            
            <div class="chart-container">
              <div class="section-header">
                <i class="fas fa-chart-bar"></i>
                <h3>Projects by Status</h3>
              </div>
              <div class="chart-wrapper">
                <canvas ref="projectsChart"></canvas>
              </div>
            </div>
          </div>

  <!-- Time Allocation Section -->
  <div class="time-allocation">
    <div class="section-header">
      <i class="fas fa-clock"></i>
      <h3>Time Allocation</h3>
      <button @click="openTimeModal" class="edit-btn" :disabled="loadingTimeAllocation">
        <i class="fas fa-edit"></i> Customize
      </button>
    </div>
    
    <div v-if="loadingTimeAllocation" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i> Loading your time allocation...
    </div>
    
    <div v-else>
      <div class="time-chart-container">
        <div class="time-chart">
          <canvas ref="timeChart"></canvas>
          <div class="chart-center-text" v-if="timeAllocation.categories.length">
            {{ timeAllocation.categories.reduce((sum, item) => sum + item.percentage, 0) }}%
          </div>
        </div>
      </div>
      
      <div class="time-legend">
        <div v-for="(item, index) in timeAllocation.categories" :key="index" class="legend-item">
          <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
          <span class="legend-label">{{ item.name }}</span>
          <span class="legend-percentage">{{ item.percentage }}%</span>
        </div>
      </div>
  
<div>
    <!-- Time Allocation Modal -->
    <div v-if="showTimeModal" class="time-modal-overlay">
      <div class="time-modal">
        <div class="modal-header">
          <h3>Customize Time Allocation</h3>
          <button @click="showTimeModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="allocation-controls">
            <div v-for="(item, index) in timeAllocation.categories" :key="index" class="allocation-item">
              <input
                type="color"
                v-model="item.color"
                class="color-picker"
                title="Change color"
              >
              <input
                type="text"
                v-model="item.name"
                class="category-name"
                placeholder="Category name"
              >
              <div class="percentage-control">
                <button 
                  @click="item.percentage > 5 ? item.percentage -= 5 : null"
                  class="percentage-btn minus"
                >
                  -
                </button>
                <input
                  type="number"
                  v-model.number="item.percentage"
                  min="0"
                  max="100"
                  class="percentage-input"
                  @change="adjustPercentages"
                >
                <span>%</span>
                <button 
                  @click="item.percentage < 100 ? item.percentage += 5 : null"
                  class="percentage-btn plus"
                >
                  +
                </button>
              </div>
              <button 
                @click="removeCategory(index)"
                class="remove-btn"
                :disabled="timeAllocation.categories.length <= 1"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            
            <div class="add-category">
              <input
                type="text"
                v-model="newCategoryName"
                placeholder="New category name"
                class="new-category-input"
              >
              <input
                type="number"
                v-model.number="newCategoryPercentage"
                placeholder="%"
                min="1"
                max="100"
                class="new-category-percent"
              >
              <button @click="addCategory" class="add-btn">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showTimeModal = false" class="btn cancel-btn">
            Cancel
          </button>
          <button @click="saveTimeAllocation" class="btn save-btn">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
          
          <!-- Community Posts -->
          <div class="community-posts">
            <div class="section-header">
              <i class="fas fa-users"></i>
              <h3>Community Feed</h3>
            </div>
            <div class="post-form">
              <textarea 
                v-model="newPostContent" 
                placeholder="Share your progress with the community..."
                @keyup.enter="addPost"
              ></textarea>
              <div class="post-actions">
                <button @click="addPost" class="post-btn" :disabled="!newPostContent.trim()">
                  <i class="fas fa-paper-plane"></i> Post
                </button>
              </div>
            </div>
            <div v-if="loadingPosts" class="loading">
              <i class="fas fa-spinner fa-spin"></i> Loading posts...
            </div>
            <div v-else-if="communityPosts.length === 0" class="no-posts">
              <i class="far fa-comment-dots"></i>
              <p>No posts yet. Be the first to share!</p>
            </div>
            <div v-else class="posts-list">
              <div v-for="post in communityPosts" :key="post.id" class="post-item">
                <div class="post-header">
                  <img :src="post.userPhoto || 'https://via.placeholder.com/40'" alt="User" class="post-user-img">
                  <div class="post-user-info">
                    <span class="post-username">{{ post.userName }}</span>
                    <span class="post-date">{{ formatDate(post.timestamp) }}</span>
                  </div>
                </div>
                <div class="post-content">
                  <p>{{ post.content }}</p>
                </div>
                <div class="post-footer">
                  <button @click="toggleLike(post)" class="post-action">
                    <i :class="['far', 'fa-heart', { 'fas text-red-500': post.liked }]"></i>
                    <span>{{ post.likes || 0 }}</span>
                  </button>
                  <button @click="toggleComments(post)" class="post-action">
                    <i class="far fa-comment"></i>
                    <span>{{ post.comments ? post.comments.length : 0 }}</span>
                  </button>
                  <button v-if="post.userId === userId" @click="deletePost(post.id)" class="post-action delete">
                    <i class="far fa-trash-alt"></i>
                  </button>
                </div>
                <div v-if="post.showComments" class="post-comments">
                  <div class="comment-form">
                    <input 
                      v-model="newComments[post.id]" 
                      type="text" 
                      placeholder="Add a comment..."
                      @keyup.enter="addComment(post)"
                    >
                    <button @click="addComment(post)" class="comment-btn" :disabled="!newComments[post.id]?.trim()">
                      <i class="fas fa-paper-plane"></i>
                    </button>
                  </div>
                  <div v-if="post.comments && post.comments.length > 0">
                    <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                      <img :src="comment.userPhoto || 'https://via.placeholder.com/30'" alt="User" class="comment-user-img">
                      <div class="comment-content">
                        <span class="comment-username">{{ comment.userName }}</span>
                        <p>{{ comment.content }}</p>
                      </div>
                      <button 
                        v-if="comment.userId === userId || post.userId === userId" 
                        @click="deleteComment(post, comment.id)" 
                        class="comment-delete"
                      >
                        <i class="far fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                  <div v-else class="no-comments">
                    No comments yet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div></div>
</template>

<script>
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  deleteDoc,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { Chart, registerables } from 'chart.js';
import {db, auth} from '@/services/firebase'
Chart.register(...registerables);

export default {
  name: 'EnhancedDashboard',
  data() {
    return {
      navItems: [
        { path: '/dash', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
        { path: '/projects', icon: 'fas fa-project-diagram', text: 'Projects' },
        { path: '/skills', icon: 'fas fa-code', text: 'Skills' },
        { path: '/objectives', icon: 'fas fa-bullseye', text: 'Goals' },
        { path: '/timeline', icon: 'fas fa-history', text: 'Timeline' },
        { path: '/community', icon: 'fas fa-users', text: 'Community' },
        { path: '/community/projects', icon: 'fas fa-book', text: 'Community Projects' },
        { path: '/profile', icon: 'fas fa-user', text: 'Profile' }
      ],
      sidebarCollapsed: false,
      darkMode: false,
      userStatus: 'active',
      hoverItem: null,
      user: {
        displayName: '',
        email: '',
        photoURL: '',
        profileImageUrl: '',
        uid: ''
      },
      skillStats: {
        total: 0,
        advanced: 0,
        intermediate: 0,
        beginner: 0,
        learning: 0
      },
      projectStats: {
        total: 0,
        completed: 0,
        inProgress: 0,
        planning: 0
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
      recentProjects: [],
      recentActivities: [],
      communityPosts: [],
      newPostContent: '',
      newComments: {},
      monthlyProgress: 0,
      streakDays: 0,
      completedTasks: 0,
      totalTasks: 0,
      loadingActivities: false,
      loadingPosts: true,
      loadingProjects: true,
      userId: null,
      skillsChart: null,
      projectsChart: null,
      progressChart: null,
      timeChart: null,
      showTimeModal: false,
      timeAllocation: {
      categories: [] // Will be loaded from Firestore
    },
    newCategoryName: '',
    newCategoryPercentage: '',
    timeChart: null,
    loadingTimeAllocation: true
    };
  },
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  async mounted() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
  // Get additional user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const userData = userDoc.data();
  
  this.userId = user.uid;
  this.user = {
    displayName: `${userData?.name || ''}`.trim() || user.displayName || 'User',
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: user.email,
    photoURL: user.photoURL,
    profileImageUrl: userData?.profileImageUrl || user.photoURL  ,
    uid: user.uid
  };
      
      await this.loadStats();
      await this.loadRecentProjects();
      await this.loadCommunityPosts();
      await this.loadRecentActivities();
      await this.loadTimeAllocation();
      this.initCharts();
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.darkMode = savedTheme === 'true';
      document.body.classList.toggle('dark-theme', this.darkMode);
    }
  },
  beforeUnmount() {
    if (this.skillsChart) this.skillsChart.destroy();
    if (this.projectsChart) this.projectsChart.destroy();
    if (this.progressChart) this.progressChart.destroy();
    if (this.timeChart) this.timeChart.destroy();
  },
  methods: {
    async loadTimeAllocation() {
    this.loadingTimeAllocation = true;
    try {
      const docRef = doc(this.db, "users", this.userId, "preferences", "timeAllocation");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        this.timeAllocation = docSnap.data();
      } else {
        // Initialize with default categories if no data exists
        this.timeAllocation = {
          categories: [
            { name: 'Development', percentage: 40, color: '#4e79a7' },
            { name: 'Learning', percentage: 30, color: '#f28e2b' },
            { name: 'Planning', percentage: 20, color: '#e15759' },
            { name: 'Meetings', percentage: 10, color: '#76b7b2' }
          ]
        };
        await this.saveTimeAllocation(); // Save defaults
        
      }
    } catch (error) {
      console.error("Error loading time allocation:", error);
    } finally {
      this.loadingTimeAllocation = false;
      this.$nextTick(() => this.initTimeChart());
    }
  },

  // Save to Firestore
  async saveTimeAllocation() {
    try {
      const docRef = doc(this.db, "users", this.userId, "preferences", "timeAllocation");
      await setDoc(docRef, this.timeAllocation);
      this.showTimeModal = false;
      this.updateChart();
      this.initTimeChart();
    } catch (error) {
      console.error("Error saving time allocation:", error);
    }
  },

  // Add new category
  addCategory() {
    if (this.newCategoryName && this.newCategoryPercentage) {
      this.timeAllocation.categories.push({
        name: this.newCategoryName,
        percentage: parseInt(this.newCategoryPercentage),
        color: this.getRandomColor()
      });
      this.newCategoryName = '';
      this.newCategoryPercentage = '';
      this.adjustPercentages();
    }
  },

  // Remove category
  removeCategory(index) {
    this.timeAllocation.categories.splice(index, 1);
    this.adjustPercentages();
  },

  // Ensure percentages total 100%
  adjustPercentages() {
    const total = this.timeAllocation.categories.reduce((sum, item) => sum + item.percentage, 0);
    if (total !== 100) {
      const adjustment = 100 / total;
      this.timeAllocation.categories.forEach(item => {
        item.percentage = Math.round(item.percentage * adjustment);
      });
      // Fix rounding errors
      const newTotal = this.timeAllocation.categories.reduce((sum, item) => sum + item.percentage, 0);
      if (newTotal !== 100) {
        this.timeAllocation.categories[0].percentage += (100 - newTotal);
      }
    }
  },
  initTimeChart() {
    if (this.timeChart) {
      this.timeChart.destroy();
    }
    
    const ctx = this.$refs.timeChart.getContext('2d');
    this.timeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.timeAllocation.categories.map(c => c.name),
        datasets: [{
          data: this.timeAllocation.categories.map(c => c.percentage),
          backgroundColor: this.timeAllocation.categories.map(c => c.color),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  },
   // Generate random color
   getRandomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
  },

  // Update chart with new data
  updateChart() {
    if (this.timeChart) {
      this.timeChart.data.labels = this.timeAllocation.categories.map(c => c.name);
      this.timeChart.data.datasets[0].data = this.timeAllocation.categories.map(c => c.percentage);
      this.timeChart.data.datasets[0].backgroundColor = this.timeAllocation.categories.map(c => c.color);
      this.timeChart.update();
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
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
 

  async logout() {
    try {
      const auth = getAuth();
      await signOut(auth);
      this.$router.push('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    toggleTheme() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-theme', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
    },
    async loadStats() {
      const db = getFirestore();
      
      try {
        // Load skills stats
        const skillsCol = collection(db, 'users', this.userId, 'skills');
        const skillsSnapshot = await getDocs(skillsCol);
        const skills = skillsSnapshot.docs.map(doc => doc.data());
        
        this.skillStats.total = skills.length;
        this.skillStats.advanced = skills.filter(s => s.level === 'Advanced').length;
        this.skillStats.intermediate = skills.filter(s => s.level === 'Intermediate').length;
        this.skillStats.beginner = skills.filter(s => s.level === 'Beginner').length;
        this.skillStats.learning = this.skillStats.intermediate + this.skillStats.beginner;
        
        // Load projects stats
        const projectsCol = collection(db, 'users', this.userId, 'projects');
        const projectsSnapshot = await getDocs(projectsCol);
        const projects = projectsSnapshot.docs.map(doc => doc.data());
        
        this.projectStats.total = projects.length;
        this.projectStats.completed = projects.filter(p => p.status === 'completed').length;
        this.projectStats.inProgress = projects.filter(p => p.status === 'in-progress').length;
        this.projectStats.planning = projects.filter(p => p.status === 'planning').length;
        
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
    
    async loadRecentProjects() {
      const db = getFirestore();
      
      try {
        const projectsCol = collection(db, 'users', this.userId, 'projects');
        const q = query(
          projectsCol,
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        
        const snapshot = await getDocs(q);
        this.recentProjects = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Untitled Project',
            description: data.description || 'No description',
            status: data.status || 'in-progress',
            progress: data.progress || 0,
            endDate: this.parseFirestoreDate(data.endDate),
            lastUpdated: data.updatedAt?.toDate() || new Date()
          };
        });
      } catch (error) {
        console.error("Error loading recent projects:", error);
      } finally {
        this.loadingProjects = false;
      }
    },
    
    parseFirestoreDate(dateValue) {
    // Handle Firestore Timestamp
    if (dateValue?.toDate) return dateValue.toDate();
    // Handle string dates (like your startDate)
    if (typeof dateValue === 'string' && dateValue) return new Date(dateValue);
    // Return null for empty values
    return null;
  },
    
    async loadCommunityPosts() {
      const db = getFirestore();
      
      try {
        const postsCol = collection(db, 'community_posts');
        const q = query(postsCol, orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        
        this.communityPosts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            showComments: false,
            liked: data.likes && data.likes.includes(this.userId),
            likes: data.likes ? data.likes.length : 0,
            comments: data.comments || [],
            timestamp: data.timestamp?.toDate() || new Date()
          };
        });
      } catch (error) {
        console.error("Error loading community posts:", error);
      } finally {
        this.loadingPosts = false;
      }
    },
    
    async addPost() {
      if (!this.newPostContent.trim()) return;
      
      const db = getFirestore();
      
      try {
        await addDoc(collection(db, 'community_posts'), {
          content: this.newPostContent,
          userId: this.userId,
          userName: this.user.displayName,
          userPhoto: this.user.photoURL || this.user.profileImageUrl,
          likes: [],
          comments: [],
          timestamp: Timestamp.now()
         });
        
        this.newPostContent = '';
        await this.loadCommunityPosts();
      } catch (error) {
        console.error("Error adding post:", error);
      }
    },
    
    async toggleLike(post) {
      const db = getFirestore();
      const postRef = doc(db, 'community_posts', post.id);
      
      try {
        if (post.liked) {
          await updateDoc(postRef, {
            likes: arrayRemove(this.userId)
          });
          post.likes--;
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(this.userId)
          });
          post.likes++;
        }
        post.liked = !post.liked;
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    },
    
    async addComment(post) {
      if (!this.newComments[post.id]?.trim()) return;
      
      const db = getFirestore();
      const postRef = doc(db, 'community_posts', post.id);
      
      try {
        const newComment = {
          id: Date.now().toString(),
          content: this.newComments[post.id],
          userId: this.userId,
          userName: this.user.displayName,
          userPhoto: this.user.profileImageUrl,
          timestamp: Timestamp.now()
        };
        
        await updateDoc(postRef, {
          comments: arrayUnion(newComment)
        });
        
        if (!post.comments) {
          post.comments = [];
        }
        post.comments.push(newComment);
        this.newComments[post.id] = '';
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    },
    
    async deletePost(postId) {
      if (!confirm('Are you sure you want to delete this post?')) return;
      
      const db = getFirestore();
      
      try {
        await deleteDoc(doc(db, 'community_posts', postId));
        this.communityPosts = this.communityPosts.filter(post => post.id !== postId);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    
    async deleteComment(post, commentId) {
      if (!confirm('Are you sure you want to delete this comment?')) return;
      
      const db = getFirestore();
      const postRef = doc(db, 'community_posts', post.id);
      
      try {
        const commentToDelete = post.comments.find(c => c.id === commentId);
        if (!commentToDelete) return;
        
        await updateDoc(postRef, {
          comments: arrayRemove(commentToDelete)
        });
        
        post.comments = post.comments.filter(c => c.id !== commentId);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    },
    
    toggleComments(post) {
      post.showComments = !post.showComments;
      if (post.showComments && (!post.comments || post.comments.length === 0)) {
        // Optionally load comments here if not already loaded
      }
    },
    
    getActivityText(activity) {
      if (activity.objective) {
        return `Worked on "${activity.objective}" - ${activity.progress}% complete`;
      } else if (activity.project) {
        return `Worked on project "${activity.project}"`;
      } else if (activity.skill) {
        return `Practiced skill "${activity.skill}"`;
      }
      return activity.text || "Completed an activity";
    },
    
    getActivityType(activity) {
      if (activity.progress === 100) return 'completed';
      if (activity.progress > 50) return 'in-progress';
      return activity.type || 'started';
    },
    
    getActivityIcon(type) {
      switch (type) {
        case 'completed': return 'fas fa-check-circle text-green-500';
        case 'in-progress': return 'fas fa-spinner text-blue-500';
        case 'updated': return 'fas fa-sync-alt text-yellow-500';
        default: return 'fas fa-play-circle text-blue-400';
      }
    },
    
    getProjectIcon(status) {
      switch (status) {
        case 'completed': return 'fas fa-check-circle';
        case 'in-progress': return 'fas fa-spinner';
        case 'planning': return 'fas fa-tasks';
        default: return 'fas fa-project-diagram';
      }
    },
    
    openProject(projectId) {
      this.$router.push(`/projects/${projectId}`);
    },
    
    formatDate(date) {
      if (!date) return '';
      const options = { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    },
    
    initCharts() {
      // Skills Chart
      const skillsCtx = this.$refs.skillsChart?.getContext('2d');
      if (skillsCtx) {
        this.skillsChart = new Chart(skillsCtx, {
          type: 'doughnut',
          data: {
            labels: ['Beginner', 'Intermediate', 'Advanced'],
            datasets: [{
              data: [
                this.skillStats.beginner,
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
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
      
      // Projects Chart
      const projectsCtx = this.$refs.projectsChart?.getContext('2d');
      if (projectsCtx) {
        this.projectsChart = new Chart(projectsCtx, {
          type: 'bar',
          data: {
            labels: ['Planning', 'In Progress', 'Completed'],
            datasets: [{
              label: 'Projects',
              data: [
                this.projectStats.planning,
                this.projectStats.inProgress,
                this.projectStats.completed
              ],
              backgroundColor: [
                '#f39c12',
                '#3498db',
                '#2ecc71'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
      
      // Progress Chart
      const progressCtx = this.$refs.progressChart?.getContext('2d');
      if (progressCtx) {
        this.progressChart = new Chart(progressCtx, {
          type: 'line',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'Weekly Progress',
              data: [20, 45, 60, this.monthlyProgress],
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: '#3498db',
              pointRadius: 5,
              pointHoverRadius: 7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.raw + '%';
                  }
                }
              }
            }
          }
        });
      }
      
      
    },
    initTimeChart() {
  if (this.timeChart) {
    this.timeChart.destroy();
  }
  
  const ctx = this.$refs.timeChart?.getContext('2d');
  if (!ctx) return;
  
  this.timeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: this.timeAllocation.categories.map(c => c.name),
      datasets: [{
        data: this.timeAllocation.categories.map(c => c.percentage),
        backgroundColor: this.timeAllocation.categories.map(c => c.color),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });
}
  }
};
</script>

<style scoped>
/* Ultra-Elegant Animated Logo */  
.logo-container {  
  width:950px;
  display: flex;  
  flex-direction: column;  
  align-items: center;  
  justify-content: center;  
  padding: 0.2rem;  
  
  border-radius: 24px;  
  box-shadow:  
    0 8px 32px rgba(10, 10, 30, 0.1),  
    inset 0 0 12px rgba(255, 255, 255, 0.4);  
  backdrop-filter: blur(8px);  
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);  
  overflow: hidden;  
  position: relative;  
  border: none;  
}  

/* Subtle animated gradient overlay */  
.logo-container::before {  
  content: '';  
  position: absolute;  
  top: -50%;  
  left: -50%;  
  width: 200%;  
  height: 200%;  
  background: linear-gradient(  
    to right,  
    rgba(255, 255, 255, 0) 0%,  
    rgba(255, 255, 255, 0.15) 50%,  
    rgba(255, 255, 255, 0) 100%  
  );  
  transform: rotate(30deg);  
  animation: shimmer 6s infinite linear;  
  opacity: 0.5;  
}  

@keyframes shimmer {  
  0% { transform: translateX(-100%) rotate(30deg); }  
  100% { transform: translateX(100%) rotate(30deg); }  
}  

.logo-container img {  
  width: 900px;  
  height: 80px;  
  object-fit: contain;  
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);  
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));  
  z-index: 2;  
}  

/* Hover Effects */  
.logo-container:hover {  
  transform: translateY(-4px) scale(1.02);  
 
}  

.logo-container:hover img {  
  width:900px;
  transform: scale(1.08) rotate(-1deg);  
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.12));  
}  

/* Elegant Text with Animated Underline */  
.logo-text {  
  margin-top: 1.2rem;  
  font-size: 1.1rem;  
  font-weight: 500;  
  font-family: 'Georgia', serif;  
  color: #444;  
  letter-spacing: 0.03em;  
  position: relative;  
  transition: all 0.4s ease;  
}  

.logo-text::after {  
  content: '';  
  position: absolute;  
  bottom: -4px;  
  left: 50%;  
  width: 0;  
  height: 1px;  
 transition: all 0.6s ease;  
}  

.logo-container:hover .logo-text {  
  color: #222;  
  letter-spacing: 0.05em;  
}  

.logo-container:hover .logo-text::after {  
  left: 0;  
  width: 100%;  
}  
/* Time Allocation Container */
.time-allocation {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}

/* Header */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0 0.5rem 0 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.section-header i {
  color: #4a89dc;
}

.edit-btn {
  margin-left: auto;
  background: #f5f9ff;
  border: 1px solid #d6e4ff;
  color: #3a7bd5;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #e0ecff;
}

.edit-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

/* Loading State */
.loading-state {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.loading-state i {
  margin-right: 0.5rem;
  color: #4a89dc;
}

/* Chart Container */
.time-chart-container {
  position: relative;
  height: 250px;
  margin: 1rem 0;
}

.time-chart {
  width: 100%;
  height: 100%;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Legend */
.time-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.85rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
}

.legend-label {
  font-weight: 500;
  color: #2c3e50;
}

.legend-percentage {
  color: #6c757d;
  font-weight: 600;
}

/* Modal Styles */
.time-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.time-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f5f5f5;
}

.modal-body {
  padding: 1.5rem;
}

/* Allocation Controls */
.allocation-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.allocation-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.color-picker {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
  overflow: hidden;
}

.category-name {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0ecff;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
}

.category-name:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 2px rgba(58, 123, 213, 0.2);
}

.percentage-control {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.percentage-input {
  width: 50px;
  padding: 0.5rem;
  border: 1px solid #e0ecff;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
}

.percentage-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e0ecff;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3a7bd5;
}

.percentage-btn:hover {
  background: #e0ecff;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ffebee;
  background: #ffebee;
  border-radius: 6px;
  cursor: pointer;
  color: #ff5252;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #ffcdd2;
}

.remove-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
  color: #9e9e9e;
  border-color: #e0e0e0;
}

/* Add Category Section */
.add-category {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e0e0e0;
}

.new-category-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0ecff;
  border-radius: 6px;
  font-size: 0.9rem;
}

.new-category-percent {
  width: 70px;
  padding: 0.5rem;
  border: 1px solid #e0ecff;
  border-radius: 6px;
  text-align: center;
}

.add-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #3a7bd5;
  color: white;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-btn:hover {
  background: #2a6bc4;
}

/* Modal Footer */
.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: white;
  border: 1px solid #e0e0e0;
  color: #6c757d;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

.save-btn {
  background: #3a7bd5;
  border: 1px solid #2a6bc4;
  color: white;
}

.save-btn:hover {
  background: #2a6bc4;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .allocation-item {
    flex-wrap: wrap;
  }
  
  .category-name {
    min-width: 100%;
    order: 1;
  }
  
  .percentage-control {
    flex: 1;
  }
  
  .add-category {
    flex-wrap: wrap;
  }
  
  .new-category-input {
    min-width: 100%;
  }
}
:root {
/* Primary color scheme */
--primary-color: #4361ee;
--primary-light: #4895ef;
--primary-dark: #3a0ca3;

/* Secondary accent colors */
--accent-color: #4cc9f0;
--accent-secondary: #7209b7;

/* UI colors */
--success-color: #2ecc71;
--warning-color: #f39c12;
--danger-color: #e74c3c;
--info-color: #3498db;

/* Neutrals */
--bg-light: #f8fafc;
--bg-dark: #0f172a;
--text-light: #f8fafc;
--text-dark: #1e293b;
--text-muted: #94a3b8;

/* Card and container styling */
--card-bg-light: #ffffff;
--card-bg-dark: #1e293b;
--border-radius: 12px;
--box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
--box-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;

/* Transitions */
--transition-speed: 0.3s;
}

/* Base styles and reset */
* {
box-sizing: border-box;
margin: 0;
padding: 0;
}

body {
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
background-color: var(--bg-light);
color: var(--text-dark);
line-height: 1.6;
font-size: 16px;
transition: background-color var(--transition-speed) ease;
}

h1, h2, h3, h4, h5, h6 {
font-weight: 600;
line-height: 1.3;
margin-bottom: var(--spacing-md);
color: var(--text-dark);
}

h1 {
font-size: 2rem;
font-weight: 700;
margin-bottom: var(--spacing-lg);
}

h3 {
font-size: 1.25rem;
}

p {
margin-bottom: var(--spacing-md);
}

a {
text-decoration: none;
color: var(--primary-color);
transition: all var(--transition-speed) ease;
}

a:hover {
color: var(--primary-light);
}

button {
cursor: pointer;
border: none;
background: none;
transition: all var(--transition-speed) ease;
}

input, textarea {
font-family: inherit;
font-size: 1rem;
border-radius: var(--border-radius);
border: 1px solid #e2e8f0;
padding: var(--spacing-sm) var(--spacing-md);
transition: all var(--transition-speed) ease-in-out;
}

input:focus, textarea:focus {
outline: none;
border-color: var(--primary-light);
box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

canvas {
max-width: 100%;
}

/* App Container */
.app-container {
display: flex;
min-height: 100vh;
background-color: var(--bg-light);
transition: background-color var(--transition-speed) ease;
}

/* Sidebar Styling */
.sidebar {
width: 260px;
background: linear-gradient(to bottom, var(--primary-dark), var(--primary-color));
color: var(--text-light);
height: 100vh;
position: fixed;
left: 0;
top: 0;
display: flex;
flex-direction: column;
transition: width var(--transition-speed) ease, transform var(--transition-speed) ease;
z-index: 100;
box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
width: 70px;
}

.sidebar-header {
display: flex;
align-items: center;
justify-content: space-between;
padding: var(--spacing-lg);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
color: var(--text-light);
font-weight: 700;
margin: 0;
font-size: 1.5rem;
letter-spacing: 0.5px;
}

.logo-icon {
font-size: 1.75rem;
}

.collapse-btn {
color: var(--text-light);
opacity: 0.8;
background: none;
border: none;
cursor: pointer;
padding: var(--spacing-xs);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
transition: all var(--transition-speed) ease;
}

.collapse-btn:hover {
opacity: 1;
background-color: rgba(255, 255, 255, 0.1);
}

.user-status {
padding: var(--spacing-lg);
display: flex;
align-items: center;
gap: var(--spacing-sm);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.status-indicator {
width: 8px;
height: 8px;
border-radius: 50%;
margin-right: var(--spacing-xs);
}

.status-indicator.active {
background-color: var(--success-color);
box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.3);
}

.profile-img {
  width: 80px; /* Increased size */
  height: 80px; /* Increased size */
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3); /* Slightly thicker border */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Added shadow for better visibility */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-img:hover {
  transform: scale(1.1); /* Slight zoom effect on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
}

.user-info {
display: flex;
flex-direction: column;
}

.username {
font-weight: 600;
font-size: 0.9rem;
}

.status {
font-size: 0.75rem;
color: rgba(255, 255, 255, 0.7);
}

.sidebar-nav {
flex: 1;
padding: var(--spacing-md) 0;
overflow-y: auto;
}

.nav-item {
display: flex;
align-items: center;
padding: var(--spacing-md) var(--spacing-lg);
color: rgba(255, 255, 255, 0.8);
position: relative;
text-decoration: none;
transition: all var(--transition-speed) ease;
}

.nav-item i {
font-size: 1.25rem;
min-width: 24px;
display: flex;
justify-content: center;
}

.nav-text {
margin-left: var(--spacing-md);
white-space: nowrap;
opacity: 1;
transition: opacity var(--transition-speed) ease;
}

.fade-enter-active, .fade-leave-active {
transition: opacity var(--transition-speed) ease;
}

.fade-enter, .fade-leave-to {
opacity: 0;
}

.nav-item:hover, .nav-item.active {
background-color: rgba(255, 255, 255, 0.1);
color: var(--text-light);
}

.nav-item.active {
border-left: 3px solid var(--accent-color);
}

.nav-tooltip {
position: absolute;
left: 100%;
top: 50%;
transform: translateY(-50%);
background-color: var(--primary-dark);
color: var(--text-light);
padding: var(--spacing-xs) var(--spacing-sm);
border-radius: var(--border-radius);
font-size: 0.85rem;
white-space: nowrap;
margin-left: var(--spacing-md);
z-index: 10;
box-shadow: var(--box-shadow);
}

.nav-tooltip::before {
content: '';
position: absolute;
top: 50%;
left: -5px;
transform: translateY(-50%);
border-width: 5px 5px 5px 0;
border-style: solid;
border-color: transparent var(--primary-dark) transparent transparent;
}

.sidebar-footer {
padding: var(--spacing-md) var(--spacing-lg);
border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-toggle {
display: flex;
align-items: center;
gap: var(--spacing-sm);
color: rgba(255, 255, 255, 0.8);
font-size: 0.85rem;
width: 100%;
padding: var(--spacing-sm);
border-radius: var(--border-radius);
transition: background-color var(--transition-speed) ease;
}

.theme-toggle:hover {
background-color: rgba(255, 255, 255, 0.1);
color: var(--text-light);
}

/* Main Content Styling */
.main-content {
flex: 1;
margin-left: 260px;
padding: 0;
transition: margin-left var(--transition-speed) ease;
}

.main-content.sidebar-collapsed {
margin-left: 70px;
}

/* Top Navigation */
.top-nav {
display: flex;
align-items: center;
justify-content: space-between;
padding: var(--spacing-md) var(--spacing-xl);
background-color: var(--card-bg-light);
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
position: sticky;
top: 0;
z-index: 20;
}

.search-bar {
display: flex;
align-items: center;
background-color: rgba(0, 0, 0, 0.03);
border-radius: 50px;
padding: var(--spacing-sm) var(--spacing-lg);
width: 300px;
transition: all var(--transition-speed) ease;
}

.search-bar:focus-within {
background-color: rgba(0, 0, 0, 0.05);
box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
}

.search-bar i {
color: var(--text-muted);
margin-right: var(--spacing-sm);
}

.search-bar input {
border: none;
background: none;
width: 100%;
padding: 0;
}

.search-bar input:focus {
box-shadow: none;
}

.nav-actions {
display: flex;
align-items: center;
gap: var(--spacing-md);
}

.nav-btn {
background: none;
border: none;
font-size: 1.1rem;
color: var(--text-dark);
position: relative;
width: 40px;
height: 40px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
transition: all var(--transition-speed) ease;
}

.nav-btn:hover {
background-color: rgba(0, 0, 0, 0.05);
}

.badge {
position: absolute;
top: 0;
right: 0;
background-color: var(--danger-color);
color: white;
font-size: 0.7rem;
font-weight: 600;
padding: 1px 6px;
border-radius: 10px;
border: 2px solid var(--card-bg-light);
}

.profile-btn {
padding: 0;
overflow: hidden;
}

.profile-btn img {
width: 100%;
height: 100%;
object-fit: cover;
}

/* Dashboard Container */
.dashboard-container {
padding: var(--spacing-xl);
max-width: 1600px;
margin: 0 auto;
}

.dashboard-container h1 {
font-size: 1.75rem;
font-weight: 700;
margin-bottom: var(--spacing-xl);
color: var(--text-dark);
}

/* Dashboard Grid Layout */
.dashboard-grid {
display: grid;
grid-template-columns: repeat(12, 1fr);
grid-auto-rows: minmax(100px, auto);
gap: var(--spacing-lg);
}

/* Overview Cards */
.overview-cards {
grid-column: span 12;
display: grid;
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
gap: var(--spacing-lg);
}

.card {
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
display: flex;
flex-direction: column;
height: 100%;
}

.card:hover {
transform: translateY(-3px);
box-shadow: var(--box-shadow-hover);
}

.card-header {
display: flex;
align-items: center;
margin-bottom: var(--spacing-md);
}

.card-header i {
font-size: 1.25rem;
margin-right: var(--spacing-sm);
width: 24px;
height: 24px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 50%;
}

.card-header h3 {
margin: 0;
font-size: 1.1rem;
}

.skills-card .card-header i {
color: var(--accent-color);
background-color: rgba(76, 201, 240, 0.1);
}

.projects-card .card-header i {
color: var(--primary-color);
background-color: rgba(67, 97, 238, 0.1);
}

.objectives-card .card-header i {
color: var(--warning-color);
background-color: rgba(243, 156, 18, 0.1);
}

.timeline-card .card-header i {
color: var(--accent-secondary);
background-color: rgba(114, 9, 183, 0.1);
}

.card-content {
display: flex;
justify-content: space-between;
flex: 1;
margin-bottom: var(--spacing-md);
}

.stat {
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
}

.stat-value {
font-size: 1.5rem;
font-weight: 700;
margin-bottom: var(--spacing-xs);
color: var(--text-dark);
}

.stat-label {
font-size: 0.8rem;
color: var(--text-muted);
white-space: nowrap;
}

.card-link {
display: block;
text-align: center;
padding: var(--spacing-sm) 0;
color: var(--primary-color);
font-weight: 500;
font-size: 0.85rem;
border-top: 1px solid rgba(0, 0, 0, 0.05);
margin-top: auto;
transition: all var(--transition-speed) ease;
}

.card-link:hover {
background-color: rgba(67, 97, 238, 0.05);
color: var(--primary-dark);
}

.card-link i {
margin-left: var(--spacing-xs);
font-size: 0.8rem;
}

/* Progress Section */
.progress-section {
grid-column: span 12;
}

.progress-card {
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
height: 100%;
}

.section-header {
display: flex;
align-items: center;
margin-bottom: var(--spacing-lg);
}

.section-header i {
font-size: 1.25rem;
margin-right: var(--spacing-sm);
color: var(--primary-color);
}

.section-header h3 {
margin: 0;
font-size: 1.1rem;
}

.progress-chart {
height: 300px;
position: relative;
}

/* Recent Activities */
.recent-activities {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.activities-list {
display: flex;
flex-direction: column;
gap: var(--spacing-md);
max-height: 400px;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--text-muted) transparent;
}

.activities-list::-webkit-scrollbar {
width: 4px;
}

.activities-list::-webkit-scrollbar-track {
background: transparent;
}

.activities-list::-webkit-scrollbar-thumb {
background-color: var(--text-muted);
border-radius: 10px;
}

.activity-item {
display: flex;
align-items: flex-start;
background-color: rgba(0, 0, 0, 0.01);
border-radius: var(--border-radius);
padding: var(--spacing-md);
transition: all var(--transition-speed) ease;
}

.activity-item:hover {
background-color: rgba(0, 0, 0, 0.03);
}

.activity-icon {
width: 36px;
height: 36px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
margin-right: var(--spacing-md);
flex-shrink: 0;
}

.activity-icon.completed {
background-color: rgba(46, 204, 113, 0.1);
color: var(--success-color);
}

.activity-icon.in-progress {
background-color: rgba(52, 152, 219, 0.1);
color: var(--info-color);
}

.activity-icon.updated {
background-color: rgba(243, 156, 18, 0.1);
color: var(--warning-color);
}

.activity-content {
flex: 1;
}

.activity-content p {
margin-bottom: var(--spacing-xs);
line-height: 1.4;
}

.activity-date {
font-size: 0.75rem;
color: var(--text-muted);
}

.loading, .no-activities {
text-align: center;
padding: var(--spacing-xl);
color: var(--text-muted);
}

.loading i, .no-activities i {
font-size: 2rem;
margin-bottom: var(--spacing-sm);
display: block;
}

/* Recent Projects */
.recent-projects {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.section-header .view-all {
margin-left: auto;
font-size: 0.85rem;
color: var(--primary-color);
font-weight: 500;
}

.projects-list {
display: flex;
flex-direction: column;
gap: var(--spacing-md);
max-height: 400px;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--text-muted) transparent;
}

.projects-list::-webkit-scrollbar {
width: 4px;
}

.projects-list::-webkit-scrollbar-track {
background: transparent;
}

.projects-list::-webkit-scrollbar-thumb {
background-color: var(--text-muted);
border-radius: 10px;
}

.project-item {
display: flex;
align-items: flex-start;
background-color: rgba(0, 0, 0, 0.01);
border-radius: var(--border-radius);
padding: var(--spacing-md);
transition: all var(--transition-speed) ease;
}

.project-item:hover {
background-color: rgba(0, 0, 0, 0.03);
}

.project-icon {
width: 40px;
height: 40px;
border-radius: var(--border-radius);
display: flex;
align-items: center;
justify-content: center;
margin-right: var(--spacing-md);
flex-shrink: 0;
}

.project-icon.completed {
background-color: rgba(46, 204, 113, 0.1);
color: var(--success-color);
}

.project-icon.in-progress {
background-color: rgba(52, 152, 219, 0.1);
color: var(--info-color);
}

.project-icon.planning {
background-color: rgba(243, 156, 18, 0.1);
color: var(--warning-color);
}

.project-info {
flex: 1;
}

.project-info h4 {
margin: 0;
margin-bottom: var(--spacing-xs);
font-size: 1rem;
}

.project-info p {
font-size: 0.85rem;
color: var(--text-muted);
margin-bottom: var(--spacing-sm);
line-height: 1.4;
}

.project-meta {
display: flex;
align-items: center;
gap: var(--spacing-md);
font-size: 0.75rem;
color: var(--text-muted);
}

.project-meta i {
margin-right: var(--spacing-xs);
}

.project-actions {
margin-left: var(--spacing-sm);
}

.project-btn {
width: 32px;
height: 32px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
background-color: rgba(67, 97, 238, 0.1);
color: var(--primary-color);
transition: all var(--transition-speed) ease;
}

.project-btn:hover {
background-color: var(--primary-color);
color: white;
}

/* Charts Section */
.charts-section {
grid-column: span 12;
display: grid;
grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
gap: var(--spacing-lg);
}

.chart-container {
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.chart-wrapper {
height: 250px;
position: relative;
}

/* Time Allocation */
.time-allocation {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.time-chart {
height: 200px;
position: relative;
margin-bottom: var(--spacing-lg);
}

.time-legend {
display: flex;
flex-wrap: wrap;
gap: var(--spacing-md);
justify-content: center;
}

.legend-item {
display: flex;
align-items: center;
font-size: 0.85rem;
}

.legend-color {
width: 12px;
height: 12px;
border-radius: 50%;
margin-right: var(--spacing-xs);
}

/* Community Posts */
.community-posts {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.post-form {
margin-bottom: var(--spacing-lg);
}

.post-form textarea {
width: 100%;
min-height: 80px;
padding: var(--spacing-md);
margin-bottom: var(--spacing-sm);
resize: vertical;
border: 1px solid rgba(0, 0, 0, 0.1);
background-color: rgba(0, 0, 0, 0.02);
}

.post-actions {
display: flex;
justify-content: flex-end;
}

.post-btn {
background-color: var(--primary-color);
color: white;
padding: var(--spacing-sm) var(--spacing-lg);
border-radius: 50px;
font-size: 0.85rem;
font-weight: 500;
display: flex;
align-items: center;
gap: var(--spacing-sm);
transition: all var(--transition-speed) ease;
}

.post-btn:hover:not(:disabled) {
background-color: var(--primary-dark);
}

.post-btn:disabled {
opacity: 0.5;
cursor: not-allowed;
}

.posts-list {
display: flex;
flex-direction: column;
gap: var(--spacing-md);
max-height: 500px;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--text-muted) transparent;
}

.post-item {
background-color: rgba(0, 0, 0, 0.01);
border-radius: var(--border-radius);
padding: var(--spacing-md);
}

.post-header {
display: flex;
align-items: center;
margin-bottom: var(--spacing-sm);
}

.post-user-img {
width: 40px;
height: 40px;
border-radius: 50%;
object-fit: cover;
margin-right: var(--spacing-sm);
}

.post-user-info {
display: flex;
flex-direction: column;
}

.post-username {
font-weight: 600;
font-size: 0.9rem;
}

.post-date {
font-size: 0.75rem;
color: var(--text-muted);
}

.post-content {
margin-bottom: var(--spacing-sm);
line-height: 1.5;
font-size: 0.95rem;
}

.post-footer {
display: flex;
align-items: center;
gap: var(--spacing-lg);
margin-bottom: var(--spacing-sm);
border-top: 1px solid rgba(0, 0, 0, 0.05);
padding-top: var(--spacing-sm);
}

.post-action {
display: flex;
align-items: center;
gap: var(--spacing-xs);
color: var(--text-muted);
font-size: 0.85rem;
padding: var(--spacing-xs) var(--spacing-sm);
border-radius: var(--border-radius);
transition: all var(--transition-speed) ease;
}

.post-action:hover {
background-color: rgba(0, 0, 0, 0.05);
color: var(--text-dark);
}

.post-action.delete:hover {
color: var(--danger-color);
}

.text-red-500 {
color: var(--danger-color) !important;
}

.post-comments {
margin-top: var(--spacing-sm);
padding-top: var(--spacing-sm);
border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.comment-form {
display: flex;
margin-bottom: var(--spacing-md);
}

.comment-form input {
flex: 1;
padding: var(--spacing-sm) var(--spacing-md);
font-size: 0.85rem;
border: 1px solid rgba(0, 0, 0, 0.1);
background-color: rgba(0, 0, 0, 0.02);
border-radius: 20px;
}

.comment-btn {
margin-left: var(--spacing-xs);
width: 30px;
height: 30px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
color: var(--primary-color);
}
/* DevTrack Dashboard - Modern Web Developer Portfolio & Tracking System
 A clean, elegant dashboard UI with developer-centric aesthetics */

/* Core Variables */
:root {
/* Primary color scheme */
--primary-color: #4361ee;
--primary-light: #4895ef;
--primary-dark: #3a0ca3;

/* Secondary accent colors */
--accent-color: #4cc9f0;
--accent-secondary: #7209b7;

/* UI colors */
--success-color: #2ecc71;
--warning-color: #f39c12;
--danger-color: #e74c3c;
--info-color: #3498db;

/* Neutrals */
--bg-light: #f8fafc;
--bg-dark: #0f172a;
--text-light: #f8fafc;
--text-dark: #1e293b;
--text-muted: #94a3b8;

/* Card and container styling */
--card-bg-light: #ffffff;
--card-bg-dark: #1e293b;
--border-radius: 12px;
--box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
--box-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;

/* Transitions */
--transition-speed: 0.3s;
}

/* Base styles and reset */
* {
box-sizing: border-box;
margin: 0;
padding: 0;
}

body {
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
background-color: var(--bg-light);
color: var(--text-dark);
line-height: 1.6;
font-size: 16px;
transition: background-color var(--transition-speed) ease;
}

h1, h2, h3, h4, h5, h6 {
font-weight: 600;
line-height: 1.3;
margin-bottom: var(--spacing-md);
color: var(--text-dark);
}

h1 {
font-size: 2rem;
font-weight: 700;
margin-bottom: var(--spacing-lg);
}

h3 {
font-size: 1.25rem;
}

p {
margin-bottom: var(--spacing-md);
}

a {
text-decoration: none;
color: var(--primary-color);
transition: all var(--transition-speed) ease;
}

a:hover {
color: var(--primary-light);
}

button {
cursor: pointer;
border: none;
background: none;
transition: all var(--transition-speed) ease;
}

input, textarea {
font-family: inherit;
font-size: 1rem;
border-radius: var(--border-radius);
border: 1px solid #e2e8f0;
padding: var(--spacing-sm) var(--spacing-md);
transition: all var(--transition-speed) ease-in-out;
}

input:focus, textarea:focus {
outline: none;
border-color: var(--primary-light);
box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

canvas {
max-width: 100%;
}

/* App Container */
.app-container {
display: flex;
min-height: 100vh;
background-color: var(--bg-light);
transition: background-color var(--transition-speed) ease;
}

/* Sidebar Styling */
.sidebar {
width: 260px;
background: linear-gradient(to bottom, var(--primary-dark), var(--primary-color));
color: var(--text-light);
height: 100vh;
position: fixed;
left: 0;
top: 0;
display: flex;
flex-direction: column;
transition: width var(--transition-speed) ease, transform var(--transition-speed) ease;
z-index: 100;
box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
width: 70px;
}

.sidebar-header {
display: flex;
align-items: center;
justify-content: space-between;
padding: var(--spacing-lg);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
color: var(--text-light);
font-weight: 700;
margin: 0;
font-size: 1.5rem;
letter-spacing: 0.5px;
}

.logo-icon {
font-size: 1.75rem;
}

.collapse-btn {
color: var(--text-light);
opacity: 0.8;
background: none;
border: none;
cursor: pointer;
padding: var(--spacing-xs);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
transition: all var(--transition-speed) ease;
}

.collapse-btn:hover {
opacity: 1;
background-color: rgba(255, 255, 255, 0.1);
}

.user-status {
padding: var(--spacing-lg);
display: flex;
align-items: center;
gap: var(--spacing-sm);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.status-indicator {
width: 8px;
height: 8px;
border-radius: 50%;
margin-right: var(--spacing-xs);
}

.status-indicator.active {
background-color: var(--success-color);
box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.3);
}

.profile-img {
width: 40px;
height: 40px;
border-radius: 50%;
object-fit: cover;
border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-info {
display: flex;
flex-direction: column;
}

.username {
font-weight: 600;
font-size: 0.9rem;
}

.status {
font-size: 0.75rem;
color: rgba(255, 255, 255, 0.7);
}

.sidebar-nav {
flex: 1;
padding: var(--spacing-md) 0;
overflow-y: auto;
}

.nav-item {
display: flex;
align-items: center;
padding: var(--spacing-md) var(--spacing-lg);
color: rgba(255, 255, 255, 0.8);
position: relative;
text-decoration: none;
transition: all var(--transition-speed) ease;
}

.nav-item i {
font-size: 1.25rem;
min-width: 24px;
display: flex;
justify-content: center;
}

.nav-text {
margin-left: var(--spacing-md);
white-space: nowrap;
opacity: 1;
transition: opacity var(--transition-speed) ease;
}

.fade-enter-active, .fade-leave-active {
transition: opacity var(--transition-speed) ease;
}

.fade-enter, .fade-leave-to {
opacity: 0;
}

.nav-item:hover, .nav-item.active {
background-color: rgba(255, 255, 255, 0.1);
color: var(--text-light);
}

.nav-item.active {
border-left: 3px solid var(--accent-color);
}

.nav-tooltip {
position: absolute;
left: 100%;
top: 50%;
transform: translateY(-50%);
background-color: var(--primary-dark);
color: var(--text-light);
padding: var(--spacing-xs) var(--spacing-sm);
border-radius: var(--border-radius);
font-size: 0.85rem;
white-space: nowrap;
margin-left: var(--spacing-md);
z-index: 10;
box-shadow: var(--box-shadow);
}

.nav-tooltip::before {
content: '';
position: absolute;
top: 50%;
left: -5px;
transform: translateY(-50%);
border-width: 5px 5px 5px 0;
border-style: solid;
border-color: transparent var(--primary-dark) transparent transparent;
}

.sidebar-footer {
padding: var(--spacing-md) var(--spacing-lg);
border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-toggle {
display: flex;
align-items: center;
gap: var(--spacing-sm);
color: rgba(255, 255, 255, 0.8);
font-size: 0.85rem;
width: 100%;
padding: var(--spacing-sm);
border-radius: var(--border-radius);
transition: background-color var(--transition-speed) ease;
}

.theme-toggle:hover {
background-color: rgba(255, 255, 255, 0.1);
color: var(--text-light);
}

/* Main Content Styling */
.main-content {
flex: 1;
margin-left: 260px;
padding: 0;
transition: margin-left var(--transition-speed) ease;
}

.main-content.sidebar-collapsed {
margin-left: 70px;
}

/* Top Navigation */
.top-nav {
display: flex;
align-items: center;
justify-content: space-between;
padding: var(--spacing-md) var(--spacing-xl);
background-color: var(--card-bg-light);
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
position: sticky;
top: 0;
z-index: 20;
}

.search-bar {
display: flex;
align-items: center;
background-color: rgba(0, 0, 0, 0.03);
border-radius: 50px;
padding: var(--spacing-sm) var(--spacing-lg);
width: 300px;
transition: all var(--transition-speed) ease;
}

.search-bar:focus-within {
background-color: rgba(0, 0, 0, 0.05);
box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
}

.search-bar i {
color: var(--text-muted);
margin-right: var(--spacing-sm);
}

.search-bar input {
border: none;
background: none;
width: 100%;
padding: 0;
}

.search-bar input:focus {
box-shadow: none;
}

.nav-actions {
display: flex;
align-items: center;
gap: var(--spacing-md);
}

.nav-btn {
background: none;
border: none;
font-size: 1.1rem;
color: var(--text-dark);
position: relative;
width: 40px;
height: 40px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
transition: all var(--transition-speed) ease;
}

.nav-btn:hover {
background-color: rgba(0, 0, 0, 0.05);
}

.badge {
position: absolute;
top: 0;
right: 0;
background-color: var(--danger-color);
color: white;
font-size: 0.7rem;
font-weight: 600;
padding: 1px 6px;
border-radius: 10px;
border: 2px solid var(--card-bg-light);
}

.profile-btn {
padding: 0;
overflow: hidden;
}

.profile-btn img {
width: 100%;
height: 100%;
object-fit: cover;
}

/* Dashboard Container */
.dashboard-container {
padding: var(--spacing-xl);
max-width: 1600px;
margin: 0 auto;
}

.dashboard-container h1 {
font-size: 1.75rem;
font-weight: 700;
margin-bottom: var(--spacing-xl);
color: var(--text-dark);
}

/* Dashboard Grid Layout */
.dashboard-grid {
display: grid;
grid-template-columns: repeat(12, 1fr);
grid-auto-rows: minmax(100px, auto);
gap: var(--spacing-lg);
}

/* Overview Cards */
.overview-cards {
grid-column: span 12;
display: grid;
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
gap: var(--spacing-lg);
}

.card {
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
display: flex;
flex-direction: column;
height: 100%;
}

.card:hover {
transform: translateY(-3px);
box-shadow: var(--box-shadow-hover);
}

.card-header {
display: flex;
align-items: center;
margin-bottom: var(--spacing-md);
}

.card-header i {
font-size: 1.25rem;
margin-right: var(--spacing-sm);
width: 24px;
height: 24px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 50%;
}

.card-header h3 {
margin: 0;
font-size: 1.1rem;
}

.skills-card .card-header i {
color: var(--accent-color);
background-color: rgba(76, 201, 240, 0.1);
}

.projects-card .card-header i {
color: var(--primary-color);
background-color: rgba(67, 97, 238, 0.1);
}

.objectives-card .card-header i {
color: var(--warning-color);
background-color: rgba(243, 156, 18, 0.1);
}

.timeline-card .card-header i {
color: var(--accent-secondary);
background-color: rgba(114, 9, 183, 0.1);
}

.card-content {
display: flex;
justify-content: space-between;
flex: 1;
margin-bottom: var(--spacing-md);
}

.stat {
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
}

.stat-value {
font-size: 1.5rem;
font-weight: 700;
margin-bottom: var(--spacing-xs);
color: var(--text-dark);
}

.stat-label {
font-size: 0.8rem;
color: var(--text-muted);
white-space: nowrap;
}

.card-link {
display: block;
text-align: center;
padding: var(--spacing-sm) 0;
color: var(--primary-color);
font-weight: 500;
font-size: 0.85rem;
border-top: 1px solid rgba(0, 0, 0, 0.05);
margin-top: auto;
transition: all var(--transition-speed) ease;
}

.card-link:hover {
background-color: rgba(67, 97, 238, 0.05);
color: var(--primary-dark);
}

.card-link i {
margin-left: var(--spacing-xs);
font-size: 0.8rem;
}

/* Progress Section */
.progress-section {
grid-column: span 12;
}

.progress-card {
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
height: 100%;
}

.section-header {
display: flex;
align-items: center;
margin-bottom: var(--spacing-lg);
}

.section-header i {
font-size: 1.25rem;
margin-right: var(--spacing-sm);
color: var(--primary-color);
}

.section-header h3 {
margin: 0;
font-size: 1.1rem;
}

.progress-chart {
height: 300px;
position: relative;
}

/* Recent Activities */
.recent-activities {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.activities-list {
display: flex;
flex-direction: column;
gap: var(--spacing-md);
max-height: 400px;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--text-muted) transparent;
}

.activities-list::-webkit-scrollbar {
width: 4px;
}

.activities-list::-webkit-scrollbar-track {
background: transparent;
}

.activities-list::-webkit-scrollbar-thumb {
background-color: var(--text-muted);
border-radius: 10px;
}

.activity-item {
display: flex;
align-items: flex-start;
background-color: rgba(0, 0, 0, 0.01);
border-radius: var(--border-radius);
padding: var(--spacing-md);
transition: all var(--transition-speed) ease;
}

.activity-item:hover {
background-color: rgba(0, 0, 0, 0.03);
}

.activity-icon {
width: 36px;
height: 36px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
margin-right: var(--spacing-md);
flex-shrink: 0;
}

.activity-icon.completed {
background-color: rgba(46, 204, 113, 0.1);
color: var(--success-color);
}

.activity-icon.in-progress {
background-color: rgba(52, 152, 219, 0.1);
color: var(--info-color);
}

.activity-icon.updated {
background-color: rgba(243, 156, 18, 0.1);
color: var(--warning-color);
}

.activity-content {
flex: 1;
}

.activity-content p {
margin-bottom: var(--spacing-xs);
line-height: 1.4;
}

.activity-date {
font-size: 0.75rem;
color: var(--text-muted);
}

.loading, .no-activities {
text-align: center;
padding: var(--spacing-xl);
color: var(--text-muted);
}

.loading i, .no-activities i {
font-size: 2rem;
margin-bottom: var(--spacing-sm);
display: block;
}

/* Recent Projects */
.recent-projects {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.section-header .view-all {
margin-left: auto;
font-size: 0.85rem;
color: var(--primary-color);
font-weight: 500;
}

.projects-list {
display: flex;
flex-direction: column;
gap: var(--spacing-md);
max-height: 400px;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--text-muted) transparent;
}

.projects-list::-webkit-scrollbar {
width: 4px;
}

.projects-list::-webkit-scrollbar-track {
background: transparent;
}

.projects-list::-webkit-scrollbar-thumb {
background-color: var(--text-muted);
border-radius: 10px;
}

.project-item {
display: flex;
align-items: flex-start;
background-color: rgba(0, 0, 0, 0.01);
border-radius: var(--border-radius);
padding: var(--spacing-md);
transition: all var(--transition-speed) ease;
}

.project-item:hover {
background-color: rgba(0, 0, 0, 0.03);
}

.project-icon {
width: 40px;
height: 40px;
border-radius: var(--border-radius);
display: flex;
align-items: center;
justify-content: center;
margin-right: var(--spacing-md);
flex-shrink: 0;
}

.project-icon.completed {
background-color: rgba(46, 204, 113, 0.1);
color: var(--success-color);
}

.project-icon.in-progress {
background-color: rgba(52, 152, 219, 0.1);
color: var(--info-color);
}

.project-icon.planning {
background-color: rgba(243, 156, 18, 0.1);
color: var(--warning-color);
}

.project-info {
flex: 1;
}

.project-info h4 {
margin: 0;
margin-bottom: var(--spacing-xs);
font-size: 1rem;
}

.project-info p {
font-size: 0.85rem;
color: var(--text-muted);
margin-bottom: var(--spacing-sm);
line-height: 1.4;
}

.project-meta {
display: flex;
align-items: center;
gap: var(--spacing-md);
font-size: 0.75rem;
color: var(--text-muted);
}

.project-meta i {
margin-right: var(--spacing-xs);
}

.project-actions {
margin-left: var(--spacing-sm);
}

.project-btn {
width: 32px;
height: 32px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
background-color: rgba(67, 97, 238, 0.1);
color: var(--primary-color);
transition: all var(--transition-speed) ease;
}

.project-btn:hover {
background-color: var(--primary-color);
color: white;
}

/* Charts Section */
.charts-section {
grid-column: span 12;
display: grid;
grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
gap: var(--spacing-lg);
}

.chart-container {
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.chart-wrapper {
height: 250px;
position: relative;
}

/* Time Allocation */
.time-allocation {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.time-chart {
height: 200px;
position: relative;
margin-bottom: var(--spacing-lg);
}

.time-legend {
display: flex;
flex-wrap: wrap;
gap: var(--spacing-md);
justify-content: center;
}

.legend-item {
display: flex;
align-items: center;
font-size: 0.85rem;
}

.legend-color {
width: 12px;
height: 12px;
border-radius: 50%;
margin-right: var(--spacing-xs);
}

/* Community Posts */
.community-posts {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.post-form {
margin-bottom: var(--spacing-lg);
}

.post-form textarea {
width: 100%;
min-height: 80px;
padding: var(--spacing-md);
margin-bottom: var(--spacing-sm);
resize: vertical;
border: 1px solid rgba(0, 0, 0, 0.1);
background-color: rgba(0, 0, 0, 0.02);
}

.post-actions {
display: flex;
justify-content: flex-end;
}

.post-btn {
background-color: var(--primary-color);
color: white;
padding: var(--spacing-sm) var(--spacing-lg);
border-radius: 50px;
font-size: 0.85rem;
font-weight: 500;
display: flex;
align-items: center;
gap: var(--spacing-sm);
transition: all var(--transition-speed) ease;
}

.post-btn:hover:not(:disabled) {
background-color: var(--primary-dark);
}

.post-btn:disabled {
opacity: 0.5;
cursor: not-allowed;
}

.posts-list {
display: flex;
flex-direction: column;
gap: var(--spacing-md);
max-height: 500px;
overflow-y: auto;
scrollbar-width: thin;
scrollbar-color: var(--text-muted) transparent;
}

.post-item {
background-color: rgba(0, 0, 0, 0.01);
border-radius: var(--border-radius);
padding: var(--spacing-md);
}

.post-header {
display: flex;
align-items: center;
margin-bottom: var(--spacing-sm);
}

.post-user-img {
width: 40px;
height: 40px;
border-radius: 50%;
object-fit: cover;
margin-right: var(--spacing-sm);
}

.post-user-info {
display: flex;
flex-direction: column;
}

.post-username {
font-weight: 600;
font-size: 0.9rem;
}

.post-date {
font-size: 0.75rem;
color: var(--text-muted);
}

.post-content {
margin-bottom: var(--spacing-sm);
line-height: 1.5;
font-size: 0.95rem;
}

.post-footer {
display: flex;
align-items: center;
gap: var(--spacing-lg);
margin-bottom: var(--spacing-sm);
border-top: 1px solid rgba(0, 0, 0, 0.05);
padding-top: var(--spacing-sm);
}

.post-action {
display: flex;
align-items: center;
gap: var(--spacing-xs);
color: var(--text-muted);
font-size: 0.85rem;
padding: var(--spacing-xs) var(--spacing-sm);
border-radius: var(--border-radius);
transition: all var(--transition-speed) ease;
}

.post-action:hover {
background-color: rgba(0, 0, 0, 0.05);
color: var(--text-dark);
}

.post-action.delete:hover {
color: var(--danger-color);
}

.text-red-500 {
color: var(--danger-color) !important;
}

.post-comments {
margin-top: var(--spacing-sm);
padding-top: var(--spacing-sm);
border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.comment-form {
display: flex;
margin-bottom: var(--spacing-md);
}

.comment-form input {
flex: 1;
padding: var(--spacing-sm) var(--spacing-md);
font-size: 0.85rem;
border: 1px solid rgba(0, 0, 0, 0.1);
background-color: rgba(0, 0, 0, 0.02);
border-radius: 20px;
}
.comment-btn {
margin-left: var(--spacing-xs);
width: 30px;
height: 30px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
background-color: var(--primary-color);
color: white;
transition: all var(--transition-speed) ease;
}

.comment-btn:hover {
background-color: var(--primary-dark);
}

.comments-list {
margin-top: var(--spacing-sm);
display: flex;
flex-direction: column;
gap: var(--spacing-sm);
}

.comment-item {
display: flex;
align-items: flex-start;
font-size: 0.85rem;
padding: var(--spacing-xs) 0;
}

.comment-user-img {
width: 28px;
height: 28px;
border-radius: 50%;
object-fit: cover;
margin-right: var(--spacing-sm);
flex-shrink: 0;
}

.comment-content {
flex: 1;
background-color: rgba(0, 0, 0, 0.02);
border-radius: 15px;
padding: var(--spacing-sm) var(--spacing-md);
}

.comment-author {
font-weight: 600;
margin-right: var(--spacing-xs);
}

.comment-text {
display: inline;
}

.comment-date {
font-size: 0.75rem;
color: var(--text-muted);
margin-top: var(--spacing-xs);
}

/* Skills Section */
.skills-section {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.skills-list {
display: flex;
flex-direction: column;
gap: var(--spacing-md);
}

.skill-item {
display: flex;
flex-direction: column;
}

.skill-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: var(--spacing-xs);
}

.skill-name {
font-weight: 500;
font-size: 0.9rem;
}

.skill-level {
font-size: 0.8rem;
color: var(--text-muted);
}

.skill-bar {
height: 6px;
background-color: rgba(0, 0, 0, 0.05);
border-radius: 3px;
overflow: hidden;
position: relative;
}

.skill-progress {
height: 100%;
border-radius: 3px;
transition: width 1s ease;
}

.skill-progress.frontend {
background: linear-gradient(to right, var(--primary-light), var(--primary-color));
}

.skill-progress.backend {
background: linear-gradient(to right, var(--accent-color), var(--primary-light));
}

.skill-progress.design {
background: linear-gradient(to right, var(--accent-secondary), var(--primary-dark));
}

.skill-progress.database {
background: linear-gradient(to right, var(--success-color), var(--accent-color));
}

/* Goals Section */
.goals-section {
grid-column: span 6;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.goals-list {
display: flex;
flex-direction: column;
gap: var(--spacing-md);
}

.goal-item {
display: flex;
align-items: flex-start;
padding: var(--spacing-sm);
border-radius: var(--border-radius);
transition: all var(--transition-speed) ease;
border-left: 3px solid transparent;
}

.goal-item:hover {
background-color: rgba(0, 0, 0, 0.02);
}

.goal-item.active {
border-left-color: var(--primary-color);
background-color: rgba(67, 97, 238, 0.05);
}

.goal-item.completed {
border-left-color: var(--success-color);
}

.goal-checkbox {
margin-right: var(--spacing-sm);
width: 20px;
height: 20px;
border-radius: 50%;
border: 2px solid var(--text-muted);
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all var(--transition-speed) ease;
flex-shrink: 0;
}

.goal-checkbox i {
font-size: 0.7rem;
color: white;
opacity: 0;
transition: opacity var(--transition-speed) ease;
}

.goal-item.completed .goal-checkbox {
border-color: var(--success-color);
background-color: var(--success-color);
}

.goal-item.completed .goal-checkbox i {
opacity: 1;
}

.goal-content {
flex: 1;
}

.goal-title {
font-weight: 500;
margin-bottom: var(--spacing-xs);
transition: all var(--transition-speed) ease;
}

.goal-item.completed .goal-title {
text-decoration: line-through;
color: var(--text-muted);
}

.goal-details {
font-size: 0.85rem;
color: var(--text-muted);
display: flex;
align-items: center;
gap: var(--spacing-md);
}

.goal-details i {
margin-right: var(--spacing-xs);
font-size: 0.8rem;
}

/* Calendar Section */
.calendar-section {
grid-column: span 12;
background-color: var(--card-bg-light);
border-radius: var(--border-radius);
box-shadow: var(--box-shadow);
padding: var(--spacing-lg);
}

.calendar-container {
display: grid;
grid-template-columns: repeat(7, 1fr);
gap: var(--spacing-xs);
}

.calendar-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: var(--spacing-lg);
}

.calendar-nav {
display: flex;
align-items: center;
gap: var(--spacing-sm);
}

.calendar-nav button {
width: 32px;
height: 32px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
background-color: rgba(0, 0, 0, 0.05);
color: var(--text-dark);
transition: all var(--transition-speed) ease;
}

.calendar-nav button:hover {
background-color: rgba(0, 0, 0, 0.1);
}

.calendar-month {
font-weight: 600;
font-size: 1.1rem;
}

.calendar-days {
display: grid;
grid-template-columns: repeat(7, 1fr);
gap: var(--spacing-xs);
margin-bottom: var(--spacing-xs);
}

.day-name {
font-size: 0.8rem;
color: var(--text-muted);
text-align: center;
padding: var(--spacing-xs);
font-weight: 500;
}

.calendar-dates {
display: grid;
grid-template-columns: repeat(7, 1fr);
gap: var(--spacing-xs);
}

.date-cell {
aspect-ratio: 1/1;
display: flex;
flex-direction: column;
border-radius: var(--border-radius);
overflow: hidden;
transition: all var(--transition-speed) ease;
cursor: pointer;
}

.date-cell:hover {
background-color: rgba(0, 0, 0, 0.02);
}

.date-number {
padding: var(--spacing-xs);
font-size: 0.9rem;
font-weight: 500;
}

.date-cell.today {
background-color: rgba(67, 97, 238, 0.05);
}

.date-cell.today .date-number {
color: var(--primary-color);
font-weight: 600;
}

.date-cell.different-month {
opacity: 0.5;
}

.date-events {
flex: 1;
padding: 0 var(--spacing-xs) var(--spacing-xs) var(--spacing-xs);
display: flex;
flex-direction: column;
gap: 2px;
overflow: hidden;
}

.date-event {
font-size: 0.6rem;
padding: 2px 4px;
border-radius: 2px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
color: white;
}

.date-event.type-1 {
background-color: var(--primary-color);
}

.date-event.type-2 {
background-color: var(--accent-color);
}

.date-event.type-3 {
background-color: var(--accent-secondary);
}

.date-event.type-4 {
background-color: var(--success-color);
}

.date-event.type-5 {
background-color: var(--warning-color);
}

/* Footer Section */
.footer {
border-top: 1px solid rgba(0, 0, 0, 0.05);
padding: var(--spacing-lg) var(--spacing-xl);
margin-top: var(--spacing-xl);
text-align: center;
color: var(--text-muted);
font-size: 0.85rem;
}

.footer a {
color: var(--primary-color);
}

/* Dark Mode Styles */
body.dark-mode {
background-color: var(--bg-dark);
color: var(--text-light);
}

body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, 
body.dark-mode h4, body.dark-mode h5, body.dark-mode h6 {
color: var(--text-light);
}

body.dark-mode .top-nav,
body.dark-mode .card,
body.dark-mode .progress-card,
body.dark-mode .recent-activities,
body.dark-mode .recent-projects,
body.dark-mode .chart-container,
body.dark-mode .time-allocation,
body.dark-mode .community-posts,
body.dark-mode .skills-section,
body.dark-mode .goals-section,
body.dark-mode .calendar-section {
background-color: var(--card-bg-dark);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

body.dark-mode .search-bar {
background-color: rgba(255, 255, 255, 0.05);
}

body.dark-mode .search-bar:focus-within {
background-color: rgba(255, 255, 255, 0.1);
}

body.dark-mode .search-bar input {
color: var(--text-light);
}

body.dark-mode .nav-btn {
color: var(--text-light);
}

body.dark-mode .nav-btn:hover {
background-color: rgba(255, 255, 255, 0.1);
}

body.dark-mode .activity-item,
body.dark-mode .project-item,
body.dark-mode .post-item,
body.dark-mode .goal-item:hover {
background-color: rgba(255, 255, 255, 0.03);
}

body.dark-mode .activity-item:hover,
body.dark-mode .project-item:hover,
body.dark-mode .post-form textarea,
body.dark-mode .comment-form input {
background-color: rgba(255, 255, 255, 0.05);
}

body.dark-mode .card-link {
border-top-color: rgba(255, 255, 255, 0.05);
}

body.dark-mode .post-footer,
body.dark-mode .post-comments {
border-top-color: rgba(255, 255, 255, 0.05);
}

body.dark-mode .calendar-nav button {
background-color: rgba(255, 255, 255, 0.1);
color: var(--text-light);
}

body.dark-mode .calendar-nav button:hover {
background-color: rgba(255, 255, 255, 0.15);
}

body.dark-mode .date-cell:hover {
background-color: rgba(255, 255, 255, 0.05);
}

body.dark-mode .skill-bar {
background-color: rgba(255, 255, 255, 0.1);
}

body.dark-mode .goal-item.active {
background-color: rgba(67, 97, 238, 0.15);
}

body.dark-mode .comment-content {
background-color: rgba(255, 255, 255, 0.05);
}

/* Responsive Styles */
@media screen and (max-width: 1200px) {
.dashboard-grid {
  gap: var(--spacing-md);
}

.recent-activities, .recent-projects {
  grid-column: span 12;
}

.skills-section, .goals-section {
  grid-column: span 12;
}

.time-allocation, .community-posts {
  grid-column: span 12;
}
}

@media screen and (max-width: 992px) {
.sidebar {
  width: 70px;
  transform: translateX(0);
}

.sidebar.expanded {
  width: 260px;
}

.main-content {
  margin-left: 70px;
}

.nav-text {
  opacity: 0;
}

.sidebar.expanded .nav-text {
  opacity: 1;
}

.charts-section {
  grid-template-columns: 1fr;
}
}

@media screen and (max-width: 768px) {
.top-nav {
  padding: var(--spacing-sm) var(--spacing-md);
}

.search-bar {
  width: 200px;
}

.dashboard-container {
  padding: var(--spacing-md);
}

.overview-cards {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.activity-item, .project-item {
  flex-direction: column;
}

.activity-icon, .project-icon {
  margin-bottom: var(--spacing-sm);
}

.calendar-container {
  overflow-x: auto;
}
}

@media screen and (max-width: 576px) {
.sidebar {
  position: fixed;
  transform: translateX(-100%);
  z-index: 1000;
  width: 260px;
}

.sidebar.mobile-visible {
  transform: translateX(0);
}

.main-content {
  margin-left: 0;
}

.nav-text {
  opacity: 1;
}

.mobile-menu-btn {
  display: block;
}

.top-nav {
  justify-content: space-between;
  padding: var(--spacing-xs) var(--spacing-md);
}

.search-bar {
  display: none;
}

.mobile-search-btn {
  display: block;
}

.mobile-search-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--card-bg-light);
  padding: var(--spacing-md);
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: none;
}

.mobile-search-container.visible {
  display: block;
}

.mobile-search-container .search-bar {
  display: flex;
  width: 100%;
}

.mobile-search-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
}

.overview-cards {
  grid-template-columns: 1fr;
}

.dashboard-grid {
  gap: var(--spacing-md);
}

.stat-value {
  font-size: 1.25rem;
}
}

/* Animations */
@keyframes fadeIn {
from {
  opacity: 0;
}
to {
  opacity: 1;
}
}

@keyframes slideIn {
from {
  transform: translateY(20px);
  opacity: 0;
}
to {
  transform: translateY(0);
  opacity: 1;
}
}

.fade-in {
animation: fadeIn 0.5s ease forwards;
}

.slide-in {
animation: slideIn 0.5s ease forwards;
}

/* Utility Classes */
.text-primary {
color: var(--primary-color);
}

.text-success {
color: var(--success-color);
}

.text-warning {
color: var(--warning-color);
}

.text-danger {
color: var(--danger-color);
}

.text-info {
color: var(--info-color);
}

.text-muted {
color: var(--text-muted);
}

.bg-primary {
background-color: var(--primary-color);
}

.bg-success {
background-color: var(--success-color);
}

.bg-warning {
background-color: var(--warning-color);
}

.bg-danger {
background-color: var(--danger-color);
}

.bg-info {
background-color: var(--info-color);
}

.d-flex {
display: flex;
}

.align-center {
align-items: center;
}

.justify-between {
justify-content: space-between;
}

.gap-sm {
gap: var(--spacing-sm);
}

.gap-md {
gap: var(--spacing-md);
}

.w-100 {
width: 100%;
}

.mb-sm {
margin-bottom: var(--spacing-sm);
}

.mb-md {
margin-bottom: var(--spacing-md);
}

.mb-lg {
margin-bottom: var(--spacing-lg);
}

.mt-sm {
margin-top: var(--spacing-sm);
}

.mt-md {
margin-top: var(--spacing-md);
}

.mt-lg {
margin-top: var(--spacing-lg);
}

.p-sm {
padding: var(--spacing-sm);
}

.p-md {
padding: var(--spacing-md);
}

.p-lg {
padding: var(--spacing-lg);
}

.rounded {
border-radius: var(--border-radius);
}

.shadow {
box-shadow: var(--box-shadow);
}

.comment-btn {
margin-left: var(--spacing-xs);
width: 30px;
height: 30px;}
/* Add these new styles for recent activities */
.recent-activities {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.dark-theme .recent-activities {
  background-color: #16213e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.activities-list {
  display: grid;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: transform 0.3s, box-shadow 0.3s;
}

.dark-theme .activity-item {
  background-color: #1e293b;
}

.activity-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.dark-theme .activity-item:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.2rem;
  background-color: rgba(52, 152, 219, 0.1);
}

.activity-icon.completed {
  background-color: rgba(46, 204, 113, 0.1);
}

.activity-icon.in-progress {
  background-color: rgba(52, 152, 219, 0.1);
}

.activity-icon.updated {
  background-color: rgba(243, 156, 18, 0.1);
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 0.95rem;
}

.dark-theme .activity-content p {
  color: #e2e8f0;
}

.activity-date {
  font-size: 0.8rem;
  color: #64748b;
}

.dark-theme .activity-date {
  color: #94a3b8;
}

.no-activities {
  text-align: center;
  padding: 30px;
  color: #64748b;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.dark-theme .no-activities {
  color: #94a3b8;
}

.no-activities i {
  font-size: 2rem;
  color: #bdc3c7;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

.app-container.dark-theme {
  background-color: #1a1a2e;
  color: #ffffff;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #3498db;
  font-weight: 700;
}

.logo-icon {
  font-size: 1.5rem;
  color: #3498db;
}

.collapse-btn {
  background: none;
  border: none;
  color: #bdc3c7;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s;
}

.collapse-btn:hover {
  color: #3498db;
}

.user-status {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}

.status-indicator.active {
  background-color: #2ecc71;
}

.status-indicator.idle {
  background-color: #f39c12;
}

.status-indicator.offline {
  background-color: #95a5a6;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3498db;
}

.user-info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  font-size: 0.9rem;
}

.status {
  font-size: 0.8rem;
  color: #bdc3c7;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
}

.nav-item i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #3498db;
}

.nav-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: #2c3e50;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  white-space: nowrap;
  margin-left: 10px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.nav-item:hover .nav-tooltip {
  opacity: 1;
  visibility: visible;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-toggle {
  background: none;
  border: none;
  color: #ecf0f1;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.theme-toggle i {
  margin-right: 10px;
  font-size: 1.1rem;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.main-content.sidebar-collapsed {
  margin-left: 70px;
}

.top-nav {
  background-color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark-theme .top-nav {
  background-color: #16213e;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 8px 15px;
  width: 300px;
  transition: all 0.3s;
}

.dark-theme .search-bar {
  background-color: #1e293b;
}

.search-bar i {
  color: #64748b;
  margin-right: 10px;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
}

.dark-theme .search-bar input {
  color: #e2e8f0;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.nav-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.2rem;
  margin-left: 20px;
  position: relative;
  cursor: pointer;
  transition: color 0.3s;
}

.dark-theme .nav-btn {
  color: #94a3b8;
}

.nav-btn:hover {
  color: #3498db;
}

.nav-btn.profile-btn {
  margin-left: 25px;
}

.nav-btn.profile-btn img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3498db;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dashboard Container */
.dashboard-container {
  flex: 1;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-container h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
}

.dark-theme .dashboard-container h1 {
  color: #e2e8f0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

/* Overview Cards */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
  border-top: 4px solid #3498db;
}

.dark-theme .card {
  background-color: #16213e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.dark-theme .card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-header i {
  font-size: 1.5rem;
  margin-right: 10px;
  color: #3498db;
}

.card h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

.dark-theme .card h3 {
  color: #e2e8f0;
}

.card-content {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}

.stat {
  text-align: center;
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
}

.dark-theme .stat-value {
  color: #e2e8f0;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-theme .stat-label {
  color: #94a3b8;
}

.card-link {
  margin-top: auto;
  text-align: right;
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  transition: color 0.3s;
}

.card-link i {
  margin-left: 5px;
  font-size: 0.8rem;
}

.card-link:hover {
  color: #1e6fba;
  text-decoration: none;
}

.skills-card {
  border-top-color: #9b59b6;
}

.skills-card .card-header i {
  color: #9b59b6;
}

.projects-card {
  border-top-color: #2ecc71;
}

.projects-card .card-header i {
  color: #2ecc71;
}

.objectives-card {
  border-top-color: #3498db;
}

.objectives-card .card-header i {
  color: #3498db;
}

.timeline-card {
  border-top-color: #f39c12;
}

.timeline-card .card-header i {
  color: #f39c12;
}

/* Progress Section */
.progress-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.dark-theme .progress-section {
  background-color: #16213e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.section-header i {
  font-size: 1.5rem;
  color: #3498db;
  margin-right: 10px;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
}

.dark-theme .section-header h3 {
  color: #e2e8f0;
}

.view-all {
  margin-left: auto;
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s;
}

.view-all:hover {
  color: #1e6fba;
  text-decoration: none;
}

.progress-chart {
  height: 250px;
  margin: 20px 0;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.progress-stat {
  text-align: center;
  background: #f1f5f9;
  padding: 15px;
  border-radius: 8px;
}

.dark-theme .progress-stat {
  background-color: #1e293b;
}

.progress-stat .stat-value {
  font-size: 1.5rem;
  color: #3498db;
  margin-bottom: 5px;
}

.progress-stat .stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

.dark-theme .progress-stat .stat-label {
  color: #94a3b8;
}

/* Recent Projects */
.recent-projects {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.dark-theme .recent-projects {
  background-color: #16213e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.projects-list {
  display: grid;
  gap: 15px;
}

.project-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: transform 0.3s, box-shadow 0.3s;
}

.dark-theme .project-item {
  background-color: #1e293b;
}

.project-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.dark-theme .project-item:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.project-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.2rem;
  color: white;
}

.project-icon.completed {
  background-color: #2ecc71;
}

.project-icon.in-progress {
  background-color: #3498db;
}

.project-icon.planning {
  background-color: #f39c12;
}

.project-info {
  flex: 1;
}

.project-info h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1rem;
}

.dark-theme .project-info h4 {
  color: #e2e8f0;
}

.project-info p {
  margin: 0 0 5px 0;
  color: #64748b;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark-theme .project-info p {
  color: #94a3b8;
}

.project-meta {
  display: flex;
  gap: 15px;
  margin-top: 8px;
}

.project-meta span {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #64748b;
}

.dark-theme .project-meta span {
  color: #94a3b8;
}

.project-meta i {
  margin-right: 5px;
  font-size: 0.8rem;
}

.project-actions {
  margin-left: 15px;
}

.project-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s;
}

.dark-theme .project-btn {
  color: #94a3b8;
}

.project-btn:hover {
  color: #3498db;
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.dark-theme .chart-container {
  background-color: #16213e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.chart-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Time Allocation */
.time-allocation {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.dark-theme .time-allocation {
  background-color: #16213e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.time-chart {
  height: 250px;
  margin: 20px 0;
}

.time-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  margin-right: 8px;
}

.legend-label {
  font-size: 0.9rem;
  color: #64748b;
}

.dark-theme .legend-label {
  color: #94a3b8;
}

/* Community Posts */
.community-posts {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.dark-theme .community-posts {
  background-color: #16213e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.post-form {
  margin-bottom: 20px;
}

.post-form textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.dark-theme .post-form textarea {
  background-color: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}

.post-form textarea:focus {
  outline: none;
  border-color: #3498db;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
}

.post-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.post-btn:hover {
  background-color: #2980b9;
}

.post-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.posts-list {
  margin-top: 20px;
}

.post-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  transition: box-shadow 0.3s;
}

.dark-theme .post-item {
  border-color: #334155;
}

.post-item:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
}

.dark-theme .post-item:hover {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.post-user-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.post-user-info {
  display: flex;
  flex-direction: column;
}

.post-username {
  font-weight: 600;
  font-size: 0.95rem;
  color: #2c3e50;
}

.dark-theme .post-username {
  color: #e2e8f0;
}

.post-date {
  font-size: 0.8rem;
  color: #64748b;
}

.dark-theme .post-date {
  color: #94a3b8;
}

.post-content {
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 0.95rem;
  line-height: 1.5;
}

.dark-theme .post-content {
  color: #e2e8f0;
}

.post-footer {
  display: flex;
  border-top: 1px solid #e2e8f0;
  padding-top: 10px;
}

.dark-theme .post-footer {
  border-top-color: #334155;
}

.post-action {
  background: none;
  border: none;
  color: #64748b;
  margin-right: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.dark-theme .post-action {
  color: #94a3b8;
}

.post-action i {
  margin-right: 5px;
  font-size: 0.9rem;
}

.post-action:hover {
  color: #3498db;
}

.post-action.delete:hover {
  color: #e74c3c;
}

.text-red-500 {
  color: #e74c3c;
}

.post-comments {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.dark-theme .post-comments {
  border-top-color: #334155;
}

.comment-form {
  display: flex;
  margin-bottom: 15px;
  gap: 10px;
}

.comment-form input {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 0.9rem;
  transition: border-color 0.3s;
}

.dark-theme .comment-form input {
  background-color: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}

.comment-form input:focus {
  outline: none;
  border-color: #3498db;
}

.comment-btn {
  background-color: #3498db;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.comment-btn:hover {
  background-color: #2980b9;
}

.comment-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.comment-item {
  display: flex;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8fafc;
  position: relative;
}

.dark-theme .comment-item {
  background-color: #1e293b;
}

.comment-user-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-username {
  font-weight: 600;
  font-size: 0.85rem;
  color: #2c3e50;
  display: block;
  margin-bottom: 3px;
}

.dark-theme .comment-username {
  color: #e2e8f0;
}

.comment-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
}

.dark-theme .comment-content p {
  color: #94a3b8;
}

.comment-delete {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.8rem;
  transition: color 0.3s;
}

.comment-delete:hover {
  color: #e74c3c;
}

.no-comments {
  text-align: center;
  padding: 10px;
  color: #64748b;
  font-size: 0.9rem;
}

.dark-theme .no-comments {
  color: #94a3b8;
}
/* DevTrack App - Main Stylesheet */

:root {
  --primary-color: #3498db;
  --primary-dark: #2980b9;
  --secondary-color: #2ecc71;
  --secondary-dark: #27ae60;
  --accent-color: #9b59b6;
  --warning-color: #e74c3c;
  --info-color: #f39c12;
  --text-color: #2d3436;
  --text-muted: #636e72;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --dark-bg: #2c3e50;
  --dark-card: #34495e;
  --dark-text: #ecf0f1;
  --border-color: #dfe6e9;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', 'Segoe UI', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  transition: var(--transition);
  padding: 20px;
}

.main-content.sidebar-collapsed {
  margin-left: 70px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.logo img {
  height: 40px;
}

/* Dashboard Container */
.dashboard-container {
  padding: 20px;
}

.dashboard-container h1 {
  margin-bottom: 24px;
  font-weight: 600;
  color: var(--text-color);
  font-size: 28px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 10px;
  display: inline-block;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

/* Overview Cards */
.overview-cards {
  grid-column: span 12;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.card {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(52, 152, 219, 0.1);
  border-bottom: 1px solid var(--border-color);
}

.card-header i {
  font-size: 20px;
  margin-right: 12px;
  color: var(--primary-color);
}

.card-header h3 {
  font-size: 18px;
  font-weight: 500;
}

.card-content {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 6px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
}

.card-link {
  display: block;
  padding: 12px 20px;
  text-align: right;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  border-top: 1px solid var(--border-color);
  transition: var(--transition);
}

.card-link:hover {
  background: rgba(52, 152, 219, 0.05);
}

.card-link i {
  margin-left: 6px;
  font-size: 14px;
}

/* Skills Card */
.skills-card .card-header i {
  color: var(--primary-color);
}

.skills-card .stat-value {
  color: var(--primary-color);
}

/* Projects Card */
.projects-card .card-header i {
  color: var(--secondary-color);
}

.projects-card .stat-value {
  color: var(--secondary-color);
}

/* Objectives Card */
.objectives-card .card-header i {
  color: var(--accent-color);
}

.objectives-card .stat-value {
  color: var(--accent-color);
}

/* Progress Section */
.progress-section {
  grid-column: span 12;
}

.progress-card {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.section-header i {
  font-size: 18px;
  margin-right: 12px;
  color: var(--primary-color);
}

.section-header h3 {
  font-size: 18px;
  font-weight: 500;
  flex: 1;
}

.view-all {
  font-size: 14px;
  color: var(--primary-color);
  text-decoration: none;
}

.progress-chart {
  padding: 20px;
  height: 300px;
}

/* Recent Activity */
.recent-activity {
  grid-column: span 6;
  margin-bottom: 24px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.recent-activity h3 {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  font-size: 18px;
  font-weight: 500;
}

.activity-list {
  list-style: none;
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.activity-item:hover {
  background: rgba(52, 152, 219, 0.05);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.activity-icon.project {
  background: rgba(46, 204, 113, 0.2);
  color: var(--secondary-color);
}

.activity-icon.skill {
  background: rgba(52, 152, 219, 0.2);
  color: var(--primary-color);
}

.activity-icon.objective {
  background: rgba(155, 89, 182, 0.2);
  color: var(--accent-color);
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin-bottom: 5px;
  font-size: 14px;
}

.activity-date {
  font-size: 12px;
  color: var(--text-muted);
}

/* Recent Projects */
.recent-projects {
  grid-column: span 6;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
}

.projects-list {
  max-height: 400px;
  overflow-y: auto;
}

.project-item {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.project-item:hover {
  background: rgba(52, 152, 219, 0.05);
}

.project-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.project-icon.inProgress {
  background: rgba(243, 156, 18, 0.2);
  color: var(--info-color);
}

.project-icon.completed {
  background: rgba(46, 204, 113, 0.2);
  color: var(--secondary-color);
}

.project-info {
  flex: 1;
}

.project-info h4 {
  font-size: 16px;
  margin-bottom: 5px;
}

.project-info p {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.project-meta {
  display: flex;
  font-size: 12px;
  color: var(--text-muted);
}

.project-deadline {
  margin-right: 15px;
}

.project-meta i {
  margin-right: 4px;
}

.project-actions {
  display: flex;
  align-items: center;
}

.project-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(52, 152, 219, 0.1);
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  transition: var(--transition);
}

.project-btn:hover {
  background: var(--primary-color);
  color: white;
}

.loading {
  padding: 20px;
  text-align: center;
  color: var(--text-muted);
}

.no-projects, .no-posts {
  padding: 30px;
  text-align: center;
  color: var(--text-muted);
}

.no-projects i, .no-posts i {
  font-size: 32px;
  margin-bottom: 10px;
  opacity: 0.5;
}

/* Charts Section */
.charts-section {
  grid-column: span 12;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.chart-container {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.chart-wrapper {
  padding: 20px;
  height: 300px;
}

/* Time Allocation */
.time-allocation {
  grid-column: span 12;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
}

.time-chart-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.time-chart {
  position: relative;
  width: 300px;
  height: 300px;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.time-legend {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px 20px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 8px 15px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
}

.legend-label {
  margin-right: 8px;
  font-size: 14px;
}

.legend-percentage {
  font-weight: 600;
  color: var(--text-color);
  font-size: 14px;
}

.edit-btn {
  background: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.edit-btn i {
  margin-right: 5px;
}

.loading-state {
  padding: 30px;
  text-align: center;
  color: var(--text-muted);
}

/* Time Modal */
.time-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.time-modal {
  width: 90%;
  max-width: 600px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 500;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-muted);
}

.modal-body {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.allocation-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.color-picker {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
}

.category-name {
  flex: 1;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0 12px;
  margin-right: 10px;
}

.percentage-control {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.percentage-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.percentage-input {
  width: 60px;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  text-align: center;
  margin: 0 5px;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(231, 76, 60, 0.1);
  color: var(--warning-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-category {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.new-category-input {
  flex: 1;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0 12px;
  margin-right: 10px;
}

.new-category-percent {
  width: 80px;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  text-align: center;
  margin-right: 10px;
}

.add-btn {
  height: 38px;
  padding: 0 15px;
  border-radius: 6px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.add-btn i {
  margin-right: 5px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.cancel-btn {
  background: var(--bg-color);
  color: var(--text-color);
  margin-right: 10px;
}

.save-btn {
  background: var(--primary-color);
  color: white;
}

/* Community Posts */
.community-posts {
  grid-column: span 12;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
}

.post-form {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.post-form textarea {
  width: 100%;
  height: 80px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  resize: none;
  margin-bottom: 10px;
  font-family: inherit;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
}

.post-btn {
  padding: 8px 16px;
  border-radius: 6px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.post-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.post-btn i {
  margin-right: 6px;
}

.post-item {
  border-bottom: 1px solid var(--border-color);
  padding: 20px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.post-user-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.post-user-info {
  display: flex;
  flex-direction: column;
}

.post-username {
  font-weight: 500;
  font-size: 16px;
}

.post-date {
  font-size: 12px;
  color: var(--text-muted);
}

.post-content {
  margin-bottom: 15px;
  font-size: 15px;
}

.post-footer {
  display: flex;
  align-items: center;
}

.post-action {
  display: flex;
  align-items: center;
  margin-right: 20px;
  padding: 6px 10px;
  border-radius: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.post-action:hover {
  background: rgba(52, 152, 219, 0.1);
}

.post-action.delete:hover {
  background: rgba(231, 76, 60, 0.1);
  color: var(--warning-color);
}

.post-action i {
  margin-right: 6px;
}

.post-comments {
  margin-top: 15px;
  background: rgba(52, 152, 219, 0.05);
  border-radius: 8px;
  padding: 15px;
}

.comment-form {
  display: flex;
  margin-bottom: 15px;
}

.comment-form input {
  flex: 1;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0 12px;
  margin-right: 10px;
}

.comment-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.comment-user-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.comment-content {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 10px;
  position: relative;
}

.comment-username {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
}

.comment-content p {
  font-size: 14px;
}

.comment-delete {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.6;
  transition: var(--transition);
}

.comment-delete:hover {
  opacity: 1;
  color: var(--warning-color);
}

.no-comments {
  text-align: center;
  padding: 10px;
  color: var(--text-muted);
  font-size: 14px;
}

/* Dark Theme */
.dark-theme {
  --bg-color: #1a1a2e;
  --card-bg: #16213e;
  --text-color: #e6e6e6;
  --text-muted: #a7a7a7;
  --border-color: #2a2a3c;
}

.dark-theme .card-header {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .activity-item:hover,
.dark-theme .project-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .post-comments {
  background: rgba(255, 255, 255, 0.05);
}

.dark-theme .comment-content {
  background: #1e2a45;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .recent-activity,
  .recent-projects {
    grid-column: span 12;
  }
}

@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .card-content {
    flex-direction: column;
  }
  
  .stat {
    margin-bottom: 15px;
  }
  
  .project-item,
  .activity-item {
    flex-direction: column;
  }
  
  .project-icon,
  .activity-icon {
    margin-bottom: 10px;
    margin-right: 0;
  }
  
  .project-meta {
    flex-direction: column;
  }
  
  .project-deadline {
    margin-bottom: 5px;
  }
}

@media (max-width: 576px) {
  .dashboard-container {
    padding: 10px;
  }
  
  .dashboard-grid {
    gap: 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .section-header h3 {
    margin-bottom: 10px;
  }
  
  .time-chart-container {
    padding: 10px;
  }
  
  .time-chart {
    width: 100%;
    height: 250px;
  }
}
  </style>
  