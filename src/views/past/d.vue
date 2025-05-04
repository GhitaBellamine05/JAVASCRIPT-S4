<!-- src/views/Dashboard.vue -->
<template>
    <div class="dashboard-container">
      <!-- Top Navigation Bar -->
      <header class="dashboard-header">
        <div class="logo-container">
          <h1 class="logo">DevGate</h1>
        </div>
        <nav class="main-nav">
          <router-link to="/dashboard" class="nav-link active">Home</router-link>
          <router-link to="/projects" class="nav-link">Projects</router-link>
          <router-link to="/community" class="nav-link">Community</router-link>
          <router-link to="/resources" class="nav-link">Resources</router-link>
        </nav>
        <div class="user-controls">
          <div class="search-box">
            <input type="text" placeholder="Search..." v-model="searchQuery" @keyup.enter="performSearch" />
            <button class="search-button" @click="performSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <div class="notifications">
            <button class="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="notification-indicator" v-if="notifications.length > 0"></span>
            </button>
          </div>
          <div class="user-menu" @click="toggleUserMenu">
            <img :src="userProfile?.photoURL || '/default-avatar.png'" alt="Profile" class="avatar" />
            <div class="user-dropdown" v-if="showUserMenu">
              <div class="user-info">
                <p class="user-name">{{ userProfile?.name || 'User' }}</p>
                <p class="user-email">{{ userProfile?.email || '' }}</p>
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
            <img :src="userProfile?.photoURL || '/default-avatar.png'" alt="Profile" class="profile-avatar" />
            <h3 class="profile-name">{{ userProfile?.name || 'User' }}</h3>
            <p class="profile-role">{{ userProfile?.role || 'Developer' }}</p>
          </div>
          <nav class="sidebar-nav">
            <h4 class="nav-section-title">Main</h4>
            <ul class="nav-section">
              <li class="nav-item active">
                <router-link to="/dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect>
                    <rect x="3" y="16" width="7" height="5"></rect>
                  </svg>
                  Dashboard
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/tasks">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  Tasks
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/analytics">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  Analytics
                </router-link>
              </li>
            </ul>
            <h4 class="nav-section-title">Projects</h4>
            <ul class="nav-section">
              <li class="nav-item">
                <router-link to="/projects/current">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Current Projects
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/projects/archived">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="21 8 21 21 3 21 3 8"></polyline>
                    <rect x="1" y="3" width="22" height="5"></rect>
                    <line x1="10" y1="12" x2="14" y2="12"></line>
                  </svg>
                  Archived
                </router-link>
              </li>
            </ul>
            <h4 class="nav-section-title">Settings</h4>
            <ul class="nav-section">
              <li class="nav-item">
                <router-link to="/profile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/settings">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Settings
                </router-link>
              </li>
            </ul>
          </nav>
        </aside>
  
        <!-- Main Content Area -->
        <main class="main-content">
          <div class="content-header">
            <h2 class="page-title">Dashboard</h2>
            <div class="date-display">{{ formattedDate }}</div>
          </div>
  
          <!-- Dashboard Overview Cards -->
          <div class="dashboard-cards">
            <div class="card overview-card">
              <div class="card-icon progress-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="card-content">
                <h3 class="card-title">In Progress</h3>
                <p class="card-value">{{ stats.inProgress }}</p>
              </div>
            </div>
            <div class="card overview-card">
              <div class="card-icon completed-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="card-content">
                <h3 class="card-title">Completed</h3>
                <p class="card-value">{{ stats.completed }}</p>
              </div>
            </div>
            <div class="card overview-card">
              <div class="card-icon pending-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="card-content">
                <h3 class="card-title">Pending</h3>
                <p class="card-value">{{ stats.pending }}</p>
              </div>
            </div>
            <div class="card overview-card">
              <div class="card-icon team-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="card-content">
                <h3 class="card-title">Team Members</h3>
                <p class="card-value">{{ stats.teamMembers }}</p>
              </div>
            </div>
          </div>
  
          <!-- Recent Activity -->
          <div class="card activity-section">
            <div class="section-header">
              <h3 class="section-title">Recent Activity</h3>
              <button class="btn-link">View All</button>
            </div>
            <div class="activity-list">
              <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  <svg v-if="activity.type === 'commit'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="4"></circle>
                    <line x1="1.05" y1="12" x2="7" y2="12"></line>
                    <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                  </svg>
                  <svg v-else-if="activity.type === 'issue'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <svg v-else-if="activity.type === 'pr'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                    <line x1="6" y1="9" x2="6" y2="21"></line>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div class="activity-details">
                  <p class="activity-description">
                    <span class="activity-user">{{ activity.user }}</span>
                    {{ activity.action }}
                    <a href="#" class="activity-link">{{ activity.subject }}</a>
                  </p>
                  <p class="activity-time">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Project Status & Upcoming Tasks -->
          <div class="dashboard-double-section">
            <!-- Project Status -->
            <div class="card project-status-section">
              <div class="section-header">
                <h3 class="section-title">Project Status</h3>
                <button class="btn-link">All Projects</button>
              </div>
              <div class="projects-list">
                <div v-for="(project, index) in projects" :key="index" class="project-item">
                  <div class="project-info">
                    <h4 class="project-name">{{ project.name }}</h4>
                    <div class="project-meta">
                      <span class="project-date">Due: {{ project.dueDate }}</span>
                      <span class="project-owner">Lead: {{ project.lead }}</span>
                    </div>
                  </div>
                  <div class="project-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: project.progress + '%', backgroundColor: getProgressColor(project.progress) }"></div>
                    </div>
                    <span class="progress-text">{{ project.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Upcoming Tasks -->
            <div class="card upcoming-tasks-section">
              <div class="section-header">
                <h3 class="section-title">Upcoming Tasks</h3>
                <button class="btn-link">View All</button>
              </div>
              <div class="tasks-list">
                <div v-for="(task, index) in upcomingTasks" :key="index" class="task-item">
                  <div class="task-details">
                    <div class="task-checkbox">
                      <input type="checkbox" :id="'task-' + index" v-model="task.completed" />
                      <label :for="'task-' + index"></label>
                    </div>
                    <div class="task-content">
                      <h4 class="task-title" :class="{ 'completed': task.completed }">{{ task.title }}</h4>
                      <div class="task-meta">
                        <span class="task-project">{{ task.project }}</span>
                        <span class="task-date">Due: {{ task.dueDate }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="task-priority" :class="task.priority.toLowerCase()">
                    {{ task.priority }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Dashboard',
    data() {
      return {
        searchQuery: '',
        showUserMenu: false,
        userProfile: {
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          photoURL: '/assets/profile-image.jpg',
          role: 'Senior Developer'
        },
        notifications: [
          { id: 1, message: 'New comment on your PR', read: false },
          { id: 2, message: 'Project deadline updated', read: false }
        ],
        stats: {
          inProgress: 8,
          completed: 24,
          pending: 5,
          teamMembers: 12
        },
        recentActivities: [
          { 
            type: 'commit', 
            user: 'Mark Chen', 
            action: 'pushed a commit to', 
            subject: 'feature/user-authentication', 
            time: '10 minutes ago' 
          },
          { 
            type: 'pr', 
            user: 'Sarah Kim', 
            action: 'opened a pull request on', 
            subject: 'DevGate Repository', 
            time: '1 hour ago' 
          },
          { 
            type: 'issue', 
            user: 'James Wilson', 
            action: 'reported an issue on', 
            subject: 'API Integration Module', 
            time: '2 hours ago' 
          },
          { 
            type: 'commit', 
            user: 'You', 
            action: 'pushed a commit to', 
            subject: 'fix/dashboard-layout', 
            time: '3 hours ago' 
          },
          { 
            type: 'issue', 
            user: 'Emma Davis', 
            action: 'closed an issue on', 
            subject: 'Authentication Service', 
            time: '5 hours ago' 
          }
        ],
        projects: [
          { 
            name: 'DevGate Platform', 
            dueDate: 'May 15, 2025', 
            lead: 'Alex Johnson', 
            progress: 75 
          },
          { 
            name: 'Mobile App Integration', 
            dueDate: 'June 3, 2025', 
            lead: 'Sarah Kim', 
            progress: 45 
          },
          { 
            name: 'API Documentation', 
            dueDate: 'May 10, 2025', 
            lead: 'Mark Chen', 
            progress: 90 
          },
          { 
            name: 'User Authentication Service', 
            dueDate: 'May 20, 2025', 
            lead: 'Emma Davis', 
            progress: 30 
          }
        ],
        upcomingTasks: [
          { 
            title: 'Implement user authentication flow', 
            project: 'DevGate Platform', 
            dueDate: 'Apr 30, 2025', 
            priority: 'High', 
            completed: false 
          },
          { 
            title: 'Review API documentation changes', 
            project: 'API Documentation', 
            dueDate: 'May 2, 2025', 
            priority: 'Medium', 
            completed: false 
          },
          { 
            title: 'Fix responsive layout issues', 
            project: 'Mobile App Integration', 
            dueDate: 'May 3, 2025', 
            priority: 'Low', 
            completed: true 
          },
          { 
            title: 'Update project dependencies', 
            project: 'DevGate Platform', 
            dueDate: 'May 5, 2025', 
            priority: 'Medium', 
            completed: false 
          },
          { 
            title: 'Set up CI/CD pipeline', 
            project: 'User Authentication Service', 
            dueDate: 'May 8, 2025', 
            priority: 'High', 
            completed: false 
          }
        ]
      };
    },
    computed: {
      formattedDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return now.toLocaleDateString('en-US', options);
      }
    },
    methods: {
      toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
      },
      performSearch() {
        if (this.searchQuery.trim()) {
          console.log('Searching for:', this.searchQuery);
          // Implement search functionality
          this.$router.push({ name: 'search-results', query: { q: this.searchQuery } });
        }
      },
      logout() {
        console.log('Logging out...');
        // Implement logout functionality
        this.$router.push('/login');
      },
      getProgressColor(progress) {
        if (progress < 30) return '#ff4d4f'; // Red for low progress
        if (progress < 70) return '#faad14'; // Yellow for medium progress
        return '#52c41a'; // Green for good progress
      }
    }
  };
  </script>
  
  <style scoped>
  /* Main Layout Styles */
  .dashboard-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
    color: #333;
    font-family: 'Inter', sans-serif;
  }
  
  .dashboard-content {
    display: flex;
    flex: 1;
  }
  
  /* Header Styles */
  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 60px;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
    color: #3366ff;
    margin: 0;
  }
  
  .main-nav {
    display: flex;
    align-items: center;
    margin-left: 40px;
  }
  
  .nav-link {
    padding: 8px 16px;
    margin: 0 4px;
    text-decoration: none;
    color: #555;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .nav-link:hover {
    color: #3366ff;
    background-color: rgba(51, 102, 255, 0.05);
  }
  
  .nav-link.active {
    color: #3366ff;
    background-color: rgba(51, 102, 255, 0.1);
  }
  
  .user-controls {
    display: flex;
    align-items: center;
  }
  
  .search-box {
    position: relative;
    margin-right: 16px;
  }
  
  .search-box input {
    width: 240px;
    padding: 8px 12px;
    padding-right: 36px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.875rem;
    transition: all 0.3s ease;
  }
  
  .search-box input:focus {
    outline: none;
    border-color: #3366ff;
    box-shadow: 0 0 0 2px rgba(51, 102, 255, 0.2);
  }
  
  .search-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .search-button:hover {
    color: #3366ff;
  }
  
  .notifications {
    margin-right: 16px;
    position: relative;
  }
  
  .icon-button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #555;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .icon-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #3366ff;
  }
  
  .notification-indicator {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    background-color: #ff4d4f;
    border-radius: 50%;
  }
  
  .user-menu {
    position: relative;
    cursor: pointer;
  }
  
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f0f0f0;
  }
  
  .user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 240px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    margin-top: 12px;
    overflow: hidden;
    z-index: 10;
  }
  
  .user-info {
    padding: 16px;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .user-name {
    margin: 0;
    font-weight: 600;
    font-size: 0.9375rem;
  }
  
  .user-email {
    margin: 4px 0 0;
    font-size: 0.8125rem;
    color: #64748b;
  }
  
  .dropdown-menu {
    list-style-type: none;
    padding: 8px 0;
    margin: 0;
  }
  
  .dropdown-menu li {
    padding: 0;
  }
  
.dropdown-menu a {
  display: block;
  padding: 10px 16px;
  color: #475569;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.dropdown-menu a:hover {
  background-color: #f1f5f9;
  color: #3366ff;
}

/* Sidebar Styles */
.sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #e2e8f0;
  padding: 20px 0;
  overflow-y: auto;
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
}

.user-profile-card {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  margin-bottom: 12px;
}

.profile-name {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 600;
}

.profile-role {
  margin: 0;
  font-size: 0.8125rem;
  color: #64748b;
}

.sidebar-nav {
  padding: 0 12px;
}

.nav-section-title {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #64748b;
  margin: 16px 0 8px 8px;
  letter-spacing: 0.5px;
}

.nav-section {
  list-style-type: none;
  padding: 0;
  margin: 0 0 16px;
}

.nav-item {
  margin-bottom: 2px;
}

.nav-item a {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  color: #475569;
  text-decoration: none;
  font-size: 0.875rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-item a svg {
  margin-right: 10px;
}

.nav-item a:hover {
  background-color: rgba(51, 102, 255, 0.05);
  color: #3366ff;
}

.nav-item.active a {
  background-color: rgba(51, 102, 255, 0.1);
  color: #3366ff;
  font-weight: 500;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.date-display {
  font-size: 0.875rem;
  color: #64748b;
}

/* Dashboard Cards */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.overview-card {
  display: flex;
  align-items: center;
  padding: 20px;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.progress-icon {
  background-color: rgba(51, 102, 255, 0.1);
  color: #3366ff;
}

.completed-icon {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.pending-icon {
  background-color: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.team-icon {
  background-color: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}

.card-content {
  flex: 1;
}

.card-title {
  margin: 0 0 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.card-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

/* Activity Section */
.activity-section {
  margin-bottom: 24px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.btn-link {
  background: none;
  border: none;
  color: #3366ff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-link:hover {
  background-color: rgba(51, 102, 255, 0.05);
  text-decoration: underline;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.activity-icon.commit {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.activity-icon.pr {
  background-color: rgba(51, 102, 255, 0.1);
  color: #3366ff;
}

.activity-icon.issue {
  background-color: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.activity-details {
  flex: 1;
}

.activity-description {
  margin: 0 0 4px;
  font-size: 0.875rem;
  color: #475569;
}

.activity-user {
  font-weight: 600;
  color: #1e293b;
}

.activity-link {
  color: #3366ff;
  text-decoration: none;
  font-weight: 500;
}

.activity-link:hover {
  text-decoration: underline;
}

.activity-time {
  margin: 0;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Dashboard Double Section */
.dashboard-double-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 1100px) {
  .dashboard-double-section {
    grid-template-columns: 1fr;
  }
}

/* Project Status Section */
.project-status-section {
  padding: 20px;
}

.projects-list {
  display: flex;
  flex-direction: column;
}

.project-item {
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.project-item:last-child {
  border-bottom: none;
}

.project-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.project-name {
  margin: 0 0 4px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
}

.project-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #64748b;
}

.project-progress {
  display: flex;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-right: 10px;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
}

.progress-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  min-width: 36px;
  text-align: right;
}

/* Upcoming Tasks Section */
.upcoming-tasks-section {
  padding: 20px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.task-item:last-child {
  border-bottom: none;
}

.task-details {
  display: flex;
  align-items: center;
  flex: 1;
}

.task-checkbox {
  margin-right: 12px;
}

.task-checkbox input[type="checkbox"] {
  display: none;
}

.task-checkbox label {
  display: block;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.task-checkbox input[type="checkbox"]:checked + label::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #3366ff;
  border-radius: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.task-content {
  display: flex;
  flex-direction: column;
}

.task-title {
  margin: 0 0 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}

.task-title.completed {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #64748b;
}

.task-priority {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.task-priority.high {
  background-color: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}

.task-priority.medium {
  background-color: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.task-priority.low {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .main-nav {
    margin-left: 20px;
  }
  
  .nav-link {
    padding: 8px 12px;
  }
  
  .search-box input {
    width: 200px;
  }
}

@media (max-width: 992px) {
  .dashboard-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-double-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .main-nav {
    display: none;
  }
  
  .search-box input {
    width: 160px;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .date-display {
    margin-top: 8px;
  }
}
</style>