
<template>
    <div class="dashboard-container">
      <!-- Top Navigation Bar -->
      <header class="dashboard-header">
        <div class="logo-container">
          <h1 class="logo">DevGate</h1>
        </div>
        <nav class="main-nav">
          <router-link to="/dashboard" class="nav-link active">Dashboard</router-link>
          <router-link to="/projects" class="nav-link">Projects</router-link>
          <router-link to="/skills" class="nav-link">Skills</router-link>
          <router-link to="/community" class="nav-link">Community</router-link>
        </nav>
        <div class="user-controls">
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="Search..." @input="performSearch" />
            <button class="search-button" @click="performSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <div class="user-menu" @click="toggleUserMenu">
            <img :src="user.photoURL || '/default-avatar.png'" alt="Profile" class="avatar" />
            <div class="user-dropdown" v-if="showUserMenu">
              <div class="user-info">
                <p class="user-name">{{ user.displayName || 'User' }}</p>
                <p class="user-email">{{ user.email }}</p>
              </div>
              <ul class="dropdown-menu">
                <li><router-link to="/profile">Profile</router-link></li>
                <li><router-link to="/settings">Settings</router-link></li>
                <li><a href="#" @click.prevent="logout">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>
  
      <div class="dashboard-content">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <div class="user-profile-card">
            <img :src="user.photoURL || '/default-avatar.png'" alt="Profile" class="profile-avatar" />
            <h3 class="profile-name">{{ user.displayName || 'User' }}</h3>
            <p class="profile-title">Developer</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-number">{{ projectStats.total }}</span>
                <span class="stat-label">Projects</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ skillStats.total }}</span>
                <span class="stat-label">Skills</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ objectiveStats.completed }}/{{ objectiveStats.total }}</span>
                <span class="stat-label">Objectives</span>
              </div>
            </div>
          </div>
          
          <nav class="sidebar-nav">
            <ul>
              <li>
                <router-link to="/profile" class="sidebar-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </router-link>
              </li>
              <li>
                <router-link to="/activities" class="sidebar-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  Activities
                </router-link>
              </li>
              <li>
                <router-link to="/projects" class="sidebar-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Projects
                </router-link>
              </li>
              <li>
                <router-link to="/objectives" class="sidebar-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  Objectives
                </router-link>
              </li>
              <li>
                <router-link to="/skills" class="sidebar-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  Skills
                </router-link>
              </li>
              <li>
                <router-link to="/network" class="sidebar-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Network
                </router-link>
              </li>
            </ul>
          </nav>
        </aside>
  
        <!-- Main Content Area -->
        <main class="main-content">
          <!-- Action Button for new posts/projects -->
          <div class="action-button-container">
            <button class="action-button" @click="showNewPostModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create New
            </button>
          </div>
  
          <!-- Dashboard Overview Section -->
          <section class="dashboard-overview">
            <h2 class="section-title">Development Overview</h2>
            <div class="overview-cards">
              <div class="overview-card">
                <div class="overview-icon projects-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div class="overview-details">
                  <h3>Projects</h3>
                  <p class="overview-number">{{ projectStats.total }}</p>
                  <p class="overview-status">
                    <span class="status-in-progress">{{ projectStats.inProgress }}</span> in progress
                  </p>
                </div>
                <router-link to="/projects" class="overview-action">View All</router-link>
              </div>
              
              <div class="overview-card">
                <div class="overview-icon skills-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <div class="overview-details">
                  <h3>Skills</h3>
                  <p class="overview-number">{{ skillStats.total }}</p>
                  <p class="overview-status">
                    <span class="status-advanced">{{ skillStats.advanced }}</span> advanced
                  </p>
                </div>
                <router-link to="/skills" class="overview-action">View All</router-link>
              </div>
              
              <div class="overview-card">
                <div class="overview-icon objectives-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div class="overview-details">
                  <h3>Objectives</h3>
                  <p class="overview-number">{{ objectiveStats.completed }}/{{ objectiveStats.total }}</p>
                  <p class="overview-status">
                    <span class="status-in-progress">{{ objectiveStats.inProgress }}</span> in progress
                  </p>
                </div>
                <router-link to="/objectives" class="overview-action">View All</router-link>
              </div>
            </div>
          </section>
  
          <!-- Charts Section -->
          <section class="charts-section">
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
          </section>
  
          <!-- Recent Activity & Upcoming Deadlines -->
          <section class="activity-deadlines">
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
              <router-link to="/objectives" class="view-all">View All Objectives</router-link>
            </div>
          </section>
        </main>
  
        <!-- Right Sidebar for community and resources -->
        <aside class="right-sidebar">
          <!-- Community Feed -->
          <section class="community-feed">
            <h3 class="sidebar-title">Community Updates</h3>
            <div class="community-posts">
              <div v-for="post in communityPosts" :key="post.id" class="community-post">
                <div class="post-header">
                  <div class="post-meta">
                    <div class="post-author">{{ post.author.name }}</div>
                    <div class="post-time">{{ formatDate(post.timestamp) }}</div>
                  </div>
                </div>
                <div class="post-content">
                  <p>{{ post.content }}</p>
                  <div v-if="post.project" class="project-preview">
                    <h4>{{ post.project.title }}</h4>
                    <p class="project-description">{{ post.project.description }}</p>
                  </div>
                </div>
                <div class="post-actions">
                  <button class="post-action-button" @click="likePost(post.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    {{ post.likes }}
                  </button>
                  <button class="post-action-button" @click="showComments(post.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    {{ post.comments.length }}
                  </button>
                </div>
                <!-- Comments section (hidden by default) -->
                <div v-if="activeCommentPost === post.id" class="comments-section">
                  <div v-for="comment in post.comments" :key="comment.id" class="comment">
                    <div class="comment-header">
                      <img :src="comment.author.photoURL || '/default-avatar.png'" alt="Profile" class="comment-avatar" />
                      <div class="comment-meta">
                        <div class="comment-author">{{ comment.author.name }}</div>
                        <div class="comment-time">{{ formatDate(comment.timestamp) }}</div>
                      </div>
                    </div>
                    <div class="comment-content">
                      <p>{{ comment.content }}</p>
                    </div>
                  </div>
                  <div class="add-comment">
                    <textarea v-model="newComment" placeholder="Add a comment..." rows="2"></textarea>
                    <button class="comment-button" @click="addComment(post.id)">Comment</button>
                  </div>
                </div>
              </div>
            </div>
            <router-link to="/community" class="see-all-link">See all community posts</router-link>
          </section>
  
          <!-- Learning Resources -->
          <section class="resources-section">
            <h3 class="sidebar-title">Recommended Resources</h3>
            <div class="resource-list">
              <a href="#" class="resource-card">
                <div class="resource-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div class="resource-info">
                  <h4>Modern JavaScript</h4>
                  <p>ES6+ features guide</p>
                </div>
              </a>
              <a href="#" class="resource-card">
                <div class="resource-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </div>
                <div class="resource-info">
                  <h4>Vue.js Best Practices</h4>
                  <p>Advanced patterns</p>
                </div>
              </a>
            </div>
          </section>
        </aside>
      </div>
  
      <!-- New Post/Project Modal -->
      <div class="modal-overlay" v-if="showNewPostModal" @click="showNewPostModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Create New</h3>
            <button class="close-modal" @click="showNewPostModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="post-type-tabs">
              <button 
                class="post-type-tab" 
                :class="{ 'active': newPostType === 'project' }" 
                @click="newPostType = 'project'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Project
              </button>
              <button 
                class="post-type-tab" 
                :class="{ 'active': newPostType === 'objective' }" 
                @click="newPostType = 'objective'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Objective
              </button>
              <button 
                class="post-type-tab" 
                :class="{ 'active': newPostType === 'post' }" 
                @click="newPostType = 'post'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Post
              </button>
            </div>
            
            <div class="post-text-input" v-if="newPostType === 'post'">
              <textarea 
                v-model="newPostContent" 
                placeholder="Share your thoughts with the community..." 
                rows="4"
              ></textarea>
            </div>
            
            <!-- Project Fields -->
            <div v-if="newPostType === 'project'" class="project-fields">
              <div class="input-group">
                <label for="project-title">Project Title</label>
                <input type="text" id="project-title" v-model="newProject.title" placeholder="Enter project title" />
              </div>
              
              <div class="input-group">
                <label for="project-description">Description</label>
                <textarea 
                  id="project-description" 
                  v-model="newProject.description" 
                  placeholder="Describe your project..." 
                  rows="3"
                ></textarea>
              </div>
              
              <div class="input-group">
                <label for="project-technologies">Technologies</label>
                <input 
                  type="text" 
                  id="project-technologies" 
                  v-model="newProject.technologiesInput" 
                  placeholder="e.g. Vue.js, Firebase, Tailwind CSS" 
                />
              </div>
              
              <div class="input-group">
                <label for="project-status">Status</label>
                <select id="project-status" v-model="newProject.status">
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <!-- Objective Fields -->
            <div v-if="newPostType === 'objective'" class="objective-fields">
              <div class="input-group">
                <label for="objective-title">Objective Title</label>
                <input type="text" id="objective-title" v-model="newObjective.title" placeholder="Enter objective title" />
              </div>
              
              <div class="input-group">
                <label for="objective-description">Description</label>
                <textarea 
                  id="objective-description" 
                  v-model="newObjective.description" 
                  placeholder="Describe your learning objective..." 
                  rows="3"
                ></textarea>
              </div>
              
              <div class="input-group">
                <label for="objective-deadline">Target Date</label>
                <input 
                  type="date" 
                  id="objective-deadline" 
                  v-model="newObjective.targetDate" 
                />
              </div>
            </div>
            
            <div class="post-attachments">
              <button class="attachment-button" @click="addAttachment('image')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Image
              </button>
              <button class="attachment-button" @click="addAttachment('document')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Document
              </button>
              <button class="attachment-button" @click="addAttachment('code')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                Code
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="cancel-button" @click="showNewPostModal = false">Cancel</button>
            <button class="post-button" @click="createNewItem">{{ newPostType === 'post' ? 'Post' : 'Create' }}</button>
          </div>
        </div>
      </div>
    </div>
  </template>
<script>
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Chart from 'chart.js/auto';

export default {
  name: 'Dashboard',
  setup() {
    // Firebase setup
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    
    // UI state
    const showUserMenu = ref(false);
    const showNewPostModal = ref(false);
    const newPostType = ref('post');
    const newPostContent = ref('');
    const searchQuery = ref('');
    const activeCommentPost = ref(null);
    const newComment = ref('');
    
    // Data loading states
    const loadingActivities = ref(true);
    const loadingDeadlines = ref(true);
    
    // Stats
    const projectStats = ref({ total: 0, inProgress: 0, completed: 0 });
    const skillStats = ref({ total: 0, advanced: 0, intermediate: 0, beginner: 0 });
    const objectiveStats = ref({ total: 0, completed: 0, inProgress: 0 });
    
    // Chart references
    const skillsChart = ref(null);
    const projectsChart = ref(null);
    
    // Data
    const recentActivities = ref([]);
    const upcomingDeadlines = ref([]);
    const communityPosts = ref([]);
    
    // Form data
    const newProject = ref({
      title: '',
      description: '',
      technologiesInput: '',
      status: 'planning'
    });
    
    const newObjective = ref({
      title: '',
      description: '',
      targetDate: new Date().toISOString().substr(0, 10)
    });
    
    // Methods
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
    };
    
    const logout = async () => {
      // Firebase logout logic here
      console.log('User logged out');
    };
    
    const fetchUserData = async () => {
      try {
        // Get the current user's UID from auth
        // For demo, we'll use a fixed UID
        const uid = 'currentUserID'; 
        
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          user.value = {
            displayName: userData.displayName || 'User',
            email: userData.email,
          };
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    const fetchProjects = async () => {
      try {
        const uid = 'currentUserID'; // Replace with actual user ID from auth
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        
        let total = 0;
        let inProgress = 0;
        let completed = 0;
        
        querySnapshot.forEach((doc) => {
          total++;
          const project = doc.data();
          if (project.status === 'completed') {
            completed++;
          } else if (project.status === 'in-progress') {
            inProgress++;
          }
        });
        
        projectStats.value = { total, inProgress, completed };
        
        // Update the projects chart
        updateProjectsChart();
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    const fetchSkills = async () => {
      try {
        const uid = 'currentUserID'; // Replace with actual user ID from auth
        const skillsRef = collection(db, 'skills');
        const q = query(skillsRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        
        let total = 0;
        let advanced = 0;
        let intermediate = 0;
        let beginner = 0;
        
        querySnapshot.forEach((doc) => {
          total++;
          const skill = doc.data();
          if (skill.level === 'advanced') {
            advanced++;
          } else if (skill.level === 'intermediate') {
            intermediate++;
          } else if (skill.level === 'beginner') {
            beginner++;
          }
        });
        
        skillStats.value = { total, advanced, intermediate, beginner };
        
        // Update the skills chart
        updateSkillsChart();
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    
    const fetchObjectives = async () => {
      try {
        const uid = 'currentUserID'; // Replace with actual user ID from auth
        const objectivesRef = collection(db, 'objectives');
        const q = query(objectivesRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);
        
        let total = 0;
        let completed = 0;
        let inProgress = 0;
        
        querySnapshot.forEach((doc) => {
          total++;
          const objective = doc.data();
          if (objective.status === 'completed') {
            completed++;
          } else {
            inProgress++;
          }
        });
        
        objectiveStats.value = { total, completed, inProgress };
      } catch (error) {
        console.error('Error fetching objectives:', error);
      }
    };
    
    const fetchActivities = async () => {
      try {
        loadingActivities.value = true;
        const uid = 'currentUserID'; // Replace with actual user ID from auth
        const activitiesRef = collection(db, 'activities');
        const q = query(
          activitiesRef, 
          where("userId", "==", uid), 
          orderBy("startedAt", "desc"), 
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        
        const activities = [];
        querySnapshot.forEach((doc) => {
          activities.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        recentActivities.value = activities;
        loadingActivities.value = false;
      } catch (error) {
        console.error('Error fetching activities:', error);
        loadingActivities.value = false;
      }
    };
    
    const fetchDeadlines = async () => {
      try {
        loadingDeadlines.value = true;
        const uid = 'currentUserID'; // Replace with actual user ID from auth
        const objectivesRef = collection(db, 'objectives');
        const today = new Date();
        const q = query(
          objectivesRef, 
          where("userId", "==", uid),
          where("status", "!=", "completed"),
          orderBy("status"),
          orderBy("targetDate"), 
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        
        const deadlines = [];
        querySnapshot.forEach((doc) => {
          deadlines.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        upcomingDeadlines.value = deadlines;
        loadingDeadlines.value = false;
      } catch (error) {
        console.error('Error fetching deadlines:', error);
        loadingDeadlines.value = false;
      }
    };
    
    const fetchCommunityPosts = async () => {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy("timestamp", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        
        const posts = [];
        
        for (const docSnap of querySnapshot.docs) {
          const postData = docSnap.data();
          
          // Fetch author data
          const authorRef = doc(db, 'users', postData.authorId);
          const authorSnap = await getDoc(authorRef);
          const authorData = authorSnap.exists() ? authorSnap.data() : { name: 'Unknown User' };
          
          // Fetch comments
          const commentsRef = collection(db, 'posts', docSnap.id, 'comments');
          const commentsQuery = query(commentsRef, orderBy("timestamp", "desc"));
          const commentsSnap = await getDocs(commentsQuery);
          
          const comments = [];
          for (const commentDoc of commentsSnap.docs) {
            const commentData = commentDoc.data();
            // Fetch comment author
            const commentAuthorRef = doc(db, 'users', commentData.authorId);
            const commentAuthorSnap = await getDoc(commentAuthorRef);
            const commentAuthorData = commentAuthorSnap.exists() 
              ? commentAuthorSnap.data() 
              : { name: 'Unknown User' };
            
            comments.push({
              id: commentDoc.id,
              ...commentData,
              author: {
                name: commentAuthorData.displayName || commentAuthorData.name,
                photoURL: commentAuthorData.photoURL
              }
            });
          }
          
          posts.push({
            id: docSnap.id,
            ...postData,
            author: {
              name: authorData.displayName || authorData.name,
              photoURL: authorData.photoURL
            },
            comments: comments
          });
        }
        
        communityPosts.value = posts;
      } catch (error) {
        console.error('Error fetching community posts:', error);
      }
    };
    
    const performSearch = () => {
      if (searchQuery.value.trim() === '') return;
      
      console.log('Searching for:', searchQuery.value);
      // Implement search functionality here
      // This could search through projects, skills, objectives, etc.
      // and redirect to a search results page
    };
    
    const createNewItem = async () => {
      try {
        const uid = 'currentUserID'; // Replace with actual user ID from auth
        const now = new Date();
        
        if (newPostType.value === 'post') {
          if (!newPostContent.value.trim()) {
            alert('Please enter content for your post');
            return;
          }
          
          // Add post to Firebase
          await addDoc(collection(db, 'posts'), {
            content: newPostContent.value,
            authorId: uid,
            timestamp: now,
            likes: 0,
            comments: []
          });
          
          // Add activity
          await addDoc(collection(db, 'activities'), {
            userId: uid,
            type: 'post',
            text: 'Created a new community post',
            date: now
          });
          
          // Reset form and refresh data
          newPostContent.value = '';
          fetchCommunityPosts();
          fetchActivities();
          
        } else if (newPostType.value === 'project') {
          if (!newProject.value.title || !newProject.value.description) {
            alert('Please fill in all required fields');
            return;
          }
          
          // Parse technologies
          const technologies = newProject.value.technologiesInput
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech !== '');
          
          // Add project to Firebase
          await addDoc(collection(db, 'projects'), {
            userId: uid,
            title: newProject.value.title,
            description: newProject.value.description,
            technologies: technologies,
            status: newProject.value.status,
            createdAt: now,
            updatedAt: now
          });
          
          // Add activity
          await addDoc(collection(db, 'activities'), {
            userId: uid,
            type: 'project',
            text: `Created a new project: ${newProject.value.title}`,
            date: now
          });
          
          // Reset form and refresh data
          newProject.value = {
            title: '',
            description: '',
            technologiesInput: '',
            status: 'planning'
          };
          fetchProjects();
          fetchActivities();
          
        } else if (newPostType.value === 'objective') {
          if (!newObjective.value.title || !newObjective.value.description || !newObjective.value.targetDate) {
            alert('Please fill in all required fields');
            return;
          }
          
          // Parse target date
          const targetDate = new Date(newObjective.value.targetDate);
          
          // Add objective to Firebase
          await addDoc(collection(db, 'objectives'), {
            userId: uid,
            title: newObjective.value.title,
            description: newObjective.value.description,
            targetDate: targetDate,
            status: 'pending',
            createdAt: now
          });
          
          // Add activity
          await addDoc(collection(db, 'activities'), {
            userId: uid,
            type: 'objective',
            text: `Created a new objective: ${newObjective.value.title}`,
            date: now
          });
          
          // Reset form and refresh data
          newObjective.value = {
            title: '',
            description: '',
            targetDate: new Date().toISOString().substr(0, 10)
          };
          fetchObjectives();
          fetchDeadlines();
          fetchActivities();
        }
        
        // Close modal
        showNewPostModal.value = false;
        
      } catch (error) {
        console.error('Error creating new item:', error);
        alert('There was an error creating your item. Please try again.');
      }
    };
    
    const updateSkillsChart = () => {
      if (skillsChart.value) {
        skillsChart.value.destroy();
      }
      
      const ctx = document.getElementById('skillsChart');
      if (!ctx) return;
      
      skillsChart.value = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Beginner', 'Intermediate', 'Advanced'],
          datasets: [{
            data: [
              skillStats.value.beginner,
              skillStats.value.intermediate,
              skillStats.value.advanced
            ],
            backgroundColor: [
              '#3498db',
              '#f39c12',
              '#2ecc71'
            ],
            borderColor: 'transparent',
            borderWidth: 2
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
              mode: 'index',
              intersect: false
            }
          }
        }
      });
    };
    
    const updateProjectsChart = () => {
      if (projectsChart.value) {
        projectsChart.value.destroy();
      }
      
      const ctx = document.getElementById('projectsChart');
      if (!ctx) return;
      
      projectsChart.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Planning', 'In Progress', 'Completed'],
          datasets: [{
            label: 'Project Status',
            data: [
              projectStats.value.total - projectStats.value.inProgress - projectStats.value.completed,
              projectStats.value.inProgress,
              projectStats.value.completed
            ],
            backgroundColor: [
              '#9b59b6',
              '#e74c3c',
              '#2ecc71'
            ],
            borderWidth: 0
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
            legend: {
              display: false
            }
          }
        }
      });
    };
    
    const likePost = async (postId) => {
      try {
        // Get the post reference
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const currentLikes = postSnap.data().likes || 0;
          
          // Update likes count
          await updateDoc(postRef, {
            likes: currentLikes + 1
          });
          
          // Update local state
          communityPosts.value = communityPosts.value.map(post => {
            if (post.id === postId) {
              return { ...post, likes: post.likes + 1 };
            }
            return post;
          });
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    };
    
    const showComments = (postId) => {
      if (activeCommentPost.value === postId) {
        activeCommentPost.value = null;
      } else {
        activeCommentPost.value = postId;
      }
    };
    
    const addComment = async (postId) => {
      try {
        if (!newComment.value.trim()) {
          return;
        }
        
        const uid = 'currentUserID'; // Replace with actual user ID from auth
        const now = new Date();
        
        // Add comment to Firebase
        const commentRef = collection(db, 'posts', postId, 'comments');
        await addDoc(commentRef, {
          content: newComment.value,
          authorId: uid,
          timestamp: now
        });
        
        // Get user info
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : { name: 'User' };
        
        // Update local state
        communityPosts.value = communityPosts.value.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now().toString(), // Temporary ID until we refresh data
                  content: newComment.value,
                  timestamp: now,
                  author: {
                    name: userData.displayName || userData.name,
                    photoURL: userData.photoURL
                  }
                }
              ]
            };
          }
          return post;
        });
        
        // Reset comment input
        newComment.value = '';
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };
    
    const addAttachment = (type) => {
      // This would normally trigger a file upload dialog
      console.log(`Adding ${type} attachment`);
      // For now, just show an alert
      alert(`${type} attachment functionality will be implemented in a future update.`);
    };
    
    const formatDate = (date) => {
      if (!date) return '';
      
      const d = typeof date === 'object' ? date : date.toDate();
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);
      
      if (diffMins < 1) {
        return 'Just now';
      } else if (diffMins < 60) {
        return `${diffMins} min ago`;
      } else if (diffHrs < 24) {
        return `${diffHrs} hr ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };
    
    const formatDay = (date) => {
      if (!date) return '';
      const d = typeof date === 'object' ? date : date.toDate();
      return d.getDate();
    };
    
    const formatMonth = (date) => {
      if (!date) return '';
      const d = typeof date === 'object' ? date : date.toDate();
      return d.toLocaleDateString('en-US', { month: 'short' });
    };
    
    const getActivityIcon = (type) => {
      switch (type) {
        case 'project':
          return 'fas fa-folder';
        case 'skill':
          return 'fas fa-tools';
        case 'objective':
          return 'fas fa-tasks';
        case 'post':
          return 'fas fa-comment';
        default:
          return 'fas fa-bell';
      }
    };
    
    // Load data on component mount
    onMounted(async () => {
      await fetchUserData();
      await Promise.all([
        fetchProjects(),
        fetchSkills(),
        fetchObjectives(),
        fetchActivities(),
        fetchDeadlines(),
        fetchCommunityPosts()
      ]);
      
      // Set up chart initialization when the DOM is ready
      setTimeout(() => {
        updateSkillsChart();
        updateProjectsChart();
      }, 100);
    });
    
    return {
      user,
      showUserMenu,
      toggleUserMenu,
      logout,
      projectStats,
      skillStats,
      objectiveStats,
      recentActivities,
      upcomingDeadlines,
      communityPosts,
      showNewPostModal,
      newPostType,
      newPostContent,
      newProject,
      newObjective,
      createNewItem,
      loadingActivities,
      loadingDeadlines,
      formatDate,
      formatDay,
      formatMonth,
      getActivityIcon,
      likePost,
      activeCommentPost,
      showComments,
      newComment,
      addComment,
      searchQuery,
      performSearch,
      addAttachment
    };
  }
};
</script>

<style scoped>
/* Dashboard Container */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Header Styles */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0;
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #3b82f6;
  background-color: #f1f5f9;
}

.nav-link.active {
  color: #3b82f6;
  background-color: #eff6ff;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box input {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 200px;
  transition: all 0.2s ease;
}

.search-box input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-button {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.user-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: #ffffff;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 250px;
  overflow: hidden;
  z-index: 10;
}

.user-info {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.user-name {
  font-weight: 600;
  margin: 0;
}

.user-email {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
}

.dropdown-menu {
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
}

.dropdown-menu li a {
  display: block;
  padding: 0.5rem 1rem;
  color: #334155;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.dropdown-menu li a:hover {
  background-color: #f1f5f9;
}

/* Dashboard Content */
.dashboard-content {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  flex: 1;
}

/* Sidebar */
.sidebar {
  background-color: #ffffff;
  padding: 1.5rem;
  border-right: 1px solid #e2e8f0;
}

.user-profile-card {
  background-color: #f1f5f9;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #ffffff;
}

.profile-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.profile-title {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 1rem;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-weight: 600;
  color: #334155;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  color: #334155;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-bottom: 0.25rem;
}

.sidebar-link:hover {
  background-color: #f1f5f9;
}

.sidebar-link svg {
  color: #64748b;
}

/* Main Content */
.main-content {
  padding: 1.5rem;
  overflow-y: auto;
}

.action-button-container {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: #2563eb;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #334155;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.overview-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.overview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
}

.projects-icon {
  background-color: #eff6ff;
  color: #3b82f6;
}

.skills-icon {
  background-color: #f0fdf4;
  color: #22c55e;
}

.objectives-icon {
  background-color: #fef3c7;
  color: #f59e0b;
}

.overview-details h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
}

.overview-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155;
  margin: 0.25rem 0;
}

.overview-status {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.status-in-progress {
  color: #f59e0b;
  font-weight: 500;
}

.status-advanced {
  color: #22c55e;
  font-weight: 500;
}

.overview-action {
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  /* Charts Section */
  .charts-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .chart-container {
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .chart-container h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .chart-wrapper {
    position: relative;
    height: 250px;
    width: 100%;
  }
  
  /* Activity & Deadlines Section */
  .activity-deadlines {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .recent-activity, .upcoming-deadlines {
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .recent-activity h3, .upcoming-deadlines h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
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
  
  /* Right Sidebar */
  .right-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .sidebar-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .community-feed, .resources-section {
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .community-posts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .community-post {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1rem;
  }
  
  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .post-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.75rem;
  }
  
  .post-meta {
    flex: 1;
  }
  
  .post-author {
    font-weight: 500;
    color: #1f2937;
    font-size: 0.875rem;
  }
  
  .post-time {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .post-content {
    margin-bottom: 0.75rem;
  }
  
  .post-content p {
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }
  
  .project-preview {
    background-color: #ffffff;
    border-radius: 0.375rem;
    padding: 0.75rem;
    margin-top: 0.5rem;
    border: 1px solid #e5e7eb;
  }
  
  .project-preview h4 {
    font-weight: 500;
    color: #1f2937;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }
  
  .project-description {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .post-actions {
    display: flex;
    gap: 0.5rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.75rem;
  }
  
  .post-action-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: transparent;
    border: none;
    color: #6b7280;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }
  
  .post-action-button:hover {
    background-color: #f3f4f6;
  }
  
  .see-all-link {
    font-size: 0.875rem;
    font-weight: 500;
    display: block;
    text-align: center;
  }
  
  .resource-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .resource-card {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
  }
  
  .resource-card:hover {
    background-color: #f3f4f6;
  }
  
  .resource-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background-color: #ebf5ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    color: #3b82f6;
  }
  
  .resource-info h4 {
    font-weight: 500;
    color: #1f2937;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }
  
  .resource-info p {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #ffffff;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-header h3 {
    font-weight: 600;
    color: #1f2937;
  }
  
  .close-modal {
    background: transparent;
    border: none;
    color: #6b7280;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }
  
  .close-modal:hover {
    background-color: #f3f4f6;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .post-type-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .post-type-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #f3f4f6;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #4b5563;
    transition: all 0.2s;
  }
  
  .post-type-tab.active {
    background-color: #3b82f6;
    color: white;
  }
  
  .post-text-input textarea {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    padding: 0.75rem;
    font-family: inherit;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
  }
  
  .post-text-input textarea:focus {
    border-color: #3b82f6;
  }
  
  .input-group {
    margin-bottom: 1rem;
  }
  
  .input-group label {
    display: block;
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 0.25rem;
  }
  
  .input-group input,
  .input-group textarea,
  .input-group select {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }
  
  .input-group input:focus,
  .input-group textarea:focus,
  .input-group select:focus {
    border-color: #3b82f6;
  }
  
  .input-group textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .post-attachments {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .attachment-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background-color: #f3f4f6;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: #4b5563;
    transition: background-color 0.2s;
  }
  
  .attachment-button:hover {
    background-color: #e5e7eb;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    gap: 0.75rem;
  }
  
  .cancel-button {
    background-color: #f3f4f6;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    color: #4b5563;
    transition: background-color 0.2s;
  }
  
  .cancel-button:hover {
    background-color: #e5e7eb;
  }
  
  .post-button {
    background-color: #3b82f6;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    color: white;
    transition: background-color 0.2s;
  }
  
  .post-button:hover {
    background-color: #2563eb;
  }
  
  /* Responsive Styles */
  @media (max-width: 1200px) {
    .dashboard-content {
      grid-template-columns: 16rem 1fr;
    }
    
    .right-sidebar {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    .dashboard-content {
      grid-template-columns: 1fr;
      padding: 1rem;
    }
    
    .sidebar {
      display: none;
    }
    
    .overview-cards {
      grid-template-columns: 1fr;
    }
    
    .charts-section {
      grid-template-columns: 1fr;
    }
    
    .activity-deadlines {
      grid-template-columns: 1fr;
    }
    
    .dashboard-header {
      padding: 0.75rem 1rem;
    }
    
    .logo {
      margin-right: 1rem;
      font-size: 1.25rem;
    }
    
    .search-box {
      width: 10rem;
    }
  }
  </style>