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
            <input type="text" placeholder="Search..." />
            <button class="search-button">
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
                  <img :src="post.author.photoURL || '/default-avatar.png'" alt="Profile" class="post-avatar" />
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
                  <button class="post-action-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    {{ post.comments.length }}
                  </button>
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
              <button class="attachment-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                Image
              </button>
              <button class="attachment-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Document
              </button>
              <button class="attachment-button">
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
  import { getFirestore, collection, getDocs, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import { Chart, registerables } from 'chart.js';
  
  export default {
    name: 'EnhancedDashboard',
    data() {
      return {
        user: {
          displayName: '',
          email: '',
          photoURL: ''
        },
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
        searchQuery: '',
        unsubscribeFunctions: [],
        communityPosts: [
          {
            id: 1,
            author: {
              name: 'Sarah Parker',
              photoURL: '/default-avatar.png'
            },
            content: 'Just launched my new portfolio website using Vue.js and TailwindCSS! Check it out and let me know what you think.',
            timestamp: new Date(2025, 3, 25, 14, 30),
            likes: 28,
            comments: [
              {
                id: 1,
                author: {
                  name: 'Michael Chen',
                  photoURL: '/default-avatar.png'
                },
                text: 'Looks amazing! Love the clean design and smooth transitions.',
                timestamp: new Date(2025, 3, 25, 15, 15)
              }
            ],
            project: {
              title: 'Modern Portfolio',
              description: 'A responsive portfolio website with dark/light mode and animation effects'
            }
          },
          {
            id: 2,
            author: {
              name: 'David Wilson',
              photoURL: '/default-avatar.png'
            },
            content: "I've been learning about Web3 development for the past month. Finally built my first dApp using Ethereum and React.",
            timestamp: new Date(2025, 3, 26, 9, 15),
            likes: 42,
            comments: [],
            project: {
              title: 'CryptoTracker',
              description: 'A decentralized application for tracking crypto assets with real-time updates'
            }
          }
        ],
        showNewPostModal: false,
        newPostType: 'project',
        newPostContent: '',
        newProject: {
          title: '',
          description: '',
          technologiesInput: '',
          status: 'planning'
        },
        newObjective: {
          title: '',
          description: '',
          targetDate: ''
        },
        skillsChart: null,
        projectsChart: null
      };
    },
    async mounted() {
      Chart.register(...registerables);
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        this.user = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        };
        await this.loadStats();
        await this.setupRealtimeListeners();
        await this.loadRecentActivities();
        await this.loadUpcomingDeadlines();
        this.initCharts();
      }
    },
    beforeUnmount() {
      this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
      if (this.skillsChart) this.skillsChart.destroy();
      if (this.projectsChart) this.projectsChart.destroy();
    },
    methods: {
      toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
      },
      logout() {
        const auth = getAuth();
        auth.signOut().then(() => {
          this.$router.push('/login');
        });
      },
      async loadStats() {
        const db = getFirestore();
        const userId = this.user.uid;
        
        try {
          // Load skills stats
          const skillsCol = collection(db, 'users', userId, 'skills');
          const skillsSnapshot = await getDocs(skillsCol);
          const skills = skillsSnapshot.docs.map(doc => doc.data());
          
          this.skillStats.total = skills.length;
          this.skillStats.advanced = skills.filter(s => s.level === 'advanced').length;
          this.skillStats.learning = skills.filter(s => s.level === 'beginner' || s.level === 'intermediate').length;
          
          // Load projects stats
          const projectsCol = collection(db, 'users', userId, 'projects');
          const projectsSnapshot = await getDocs(projectsCol);
          const projects = projectsSnapshot.docs.map(doc => doc.data());
          
          this.projectStats.total = projects.length;
          this.projectStats.completed = projects.filter(p => p.status === 'completed').length;
          this.projectStats.inProgress = projects.filter(p => p.status === 'in-progress').length;
          
          // Load objectives stats
          const objectivesCol = collection(db, 'users', userId, 'objectives');
          const objectivesSnapshot = await getDocs(objectivesCol);
          const objectives = objectivesSnapshot.docs.map(doc => doc.data());
          
          this.objectiveStats.total = objectives.length;
          this.objectiveStats.completed = objectives.filter(o => o.status === 'completed').length;
          this.objectiveStats.inProgress = objectives.filter(o => o.status === 'in-progress').length;
          
        } catch (error) {
          console.error("Error loading dashboard stats:", error);
        }
      },
      async loadRecentActivities() {
        const db = getFirestore();
        const userId = this.user.uid;
        
        try {
          const activitiesCol = collection(db, 'users', userId, 'activities');
          const q = query(
            activitiesCol,
            orderBy('createdAt', 'desc'),
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
        const userId = this.user.uid;
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        
        try {
          // Get upcoming project deadlines
          const projectsCol = collection(db, 'users', userId, 'projects');
          const projectsQuery = query(
            projectsCol,
            where('endDate', '>=', today.toISOString().split('T')[0]),
            where('endDate', '<=', nextMonth.toISOString().split('T')[0]),
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
              date: new Date(data.endDate),
              type: 'Project'
            };
          });
          
          // Get upcoming objective deadlines
          const objectivesCol = collection(db, 'users', userId, 'objectives');
          const objectivesQuery = query(
            objectivesCol,
            where('targetDate', '>=', today.toISOString().split('T')[0]),
            where('targetDate', '<=', nextMonth.toISOString().split('T')[0]),
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
              date: new Date(data.targetDate),
              type: 'Learning Objective'
            };
          });
          
          // Combine and sort all deadlines
          this.upcomingDeadlines = [...projectDeadlines, ...objectiveDeadlines]
            .sort((a, b) => a.date - b.date)
            .slice(0, 5);
            
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
      },
      likePost(postId) {
        const post = this.communityPosts.find(p => p.id === postId);
        if (post) {
          post.likes++;
        }
      },
      async createNewItem() {
        const db = getFirestore();
        const userId = this.user.uid;
        
        try {
          if (this.newPostType === 'project') {
            await addDoc(collection(db, 'users', userId, 'projects'), {
              name: this.newProject.title,
              description: this.newProject.description,
              technologies: this.newProject.technologiesInput.split(',').map(t => t.trim()),
              status: this.newProject.status,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          } else if (this.newPostType === 'objective') {
            await addDoc(collection(db, 'users', userId, 'objectives'), {
              title: this.newObjective.title,
              description: this.newObjective.description,
              targetDate: this.newObjective.targetDate,
              status: 'in-progress',
              createdAt: new Date()
            });
          } else if (this.newPostType === 'post') {
            // Add to community feed
            this.communityPosts.unshift({
              id: this.communityPosts.length + 1,
              author: {
                name: this.user.displayName,
                photoURL: this.user.photoURL
              },
              content: this.newPostContent,
              timestamp: new Date(),
              likes: 0,
              comments: []
            });
          }
          
          // Refresh stats
          await this.loadStats();
          
          // Reset form
          this.newPostContent = '';
          this.newProject = {
            title: '',
            description: '',
            technologiesInput: '',
            status: 'planning'
          };
          this.newObjective = {
            title: '',
            description: '',
            targetDate: ''
          };
          
          // Close modal
          this.showNewPostModal = false;
          
        } catch (error) {
          console.error("Error creating new item:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Base Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #333;
    background-color: #f5f7fa;
    line-height: 1.5;
  }
  
  .dashboard-container {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
  }
  
  /* Header */
  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #3b82f6;
    margin-right: 2rem;
  }
  
  .main-nav {
    display: flex;
    align-items: center;
    margin-right: auto;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    color: #4b5563;
    font-weight: 500;
    border-radius: 0.375rem;
    margin-right: 0.5rem;
    transition: background-color 0.2s, color 0.2s;
  }
  
  .nav-link:hover {
    background-color: #f3f4f6;
  }
  
  .nav-link.active {
    color: #3b82f6;
    background-color: #ebf5ff;
  }
  
  .user-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    width: 14rem;
  }
  
  .search-box input {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .search-button {
    background: transparent;
    border: none;
    color: #6b7280;
  }
  
  .user-menu {
    position: relative;
    cursor: pointer;
  }
  
  .avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e5e7eb;
  }
  
  .user-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    width: 15rem;
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 50;
    overflow: hidden;
  }
  
  .user-info {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .user-name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .user-email {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .dropdown-menu {
    list-style: none;
  }
  
  .dropdown-menu li a {
    display: block;
    padding: 0.75rem 1rem;
    color: #4b5563;
    transition: background-color 0.2s;
  }
  
  .dropdown-menu li a:hover {
    background-color: #f3f4f6;
  }
  
  /* Content Layout */
  .dashboard-content {
    display: grid;
    grid-template-columns: 16rem 1fr 18rem;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  /* Sidebar */
  .sidebar {
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .user-profile-card {
    padding: 1.5rem;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .profile-avatar {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e5e7eb;
    margin: 0 auto 1rem;
  }
  
  .profile-name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .profile-title {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
  }
  
  .profile-stats {
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-number {
    display: block;
    font-weight: 600;
    color: #1f2937;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .sidebar-nav ul {
    list-style: none;
  }
  
  .sidebar-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: #4b5563;
    transition: background-color 0.2s;
  }
  
  .sidebar-link:hover {
    background-color: #f3f4f6;
  }
  
  .sidebar-link svg {
    margin-right: 0.75rem;
  }
  
  /* Main Content */
  .main-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .action-button-container {
    display: flex;
    justify-content: flex-end;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .action-button:hover {
    background-color: #2563eb;
  }
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .overview-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .overview-card {
    background-color: #ffffff;
    border-radius: 0.5rem;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
  }
  
  .overview-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    margin-right: 1rem;
  }
  
  .projects-icon {
    background-color: #3b82f6;
  }
  
  .skills-icon {
    background-color: #10b981;
  }
  
  .objectives-icon {
    background-color: #f59e0b;
  }
  
  .overview-details {
    flex: 1;
  }
  
  .overview-details h3 {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .overview-number {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .overview-status {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .status-increase {
    color: #10b981;
  }
  
  .status-completed {
    color: #3b82f6;
  }
  
  .status-in-progress {
    color: #f59e0b;
  }
  
  .status-advanced {
    color: #8b5cf6;
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