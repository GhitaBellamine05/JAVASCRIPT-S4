<template>
    <div class="app-layout">
      <!-- Side Navigation -->
      <nav class="sidenav">
        <div class="sidenav-header">
          <div class="user-profile">
            <img :src="user.photoURL || 'https://ui-avatars.com/api/?name='+user.displayName" class="profile-avatar">
            <div class="profile-info">
              <h3>{{ user.displayName }}</h3>
              <p>{{ user.title || 'Developer' }}</p>
              <div class="profile-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ userStats.followers }}</span>
                  <span class="stat-label">Followers</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ userStats.following }}</span>
                  <span class="stat-label">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidenav-menu">
          <router-link to="/dashboard" class="menu-item" active-class="active">
            <i class="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/profile" class="menu-item" active-class="active">
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </router-link>
          <router-link to="/projects" class="menu-item" active-class="active">
            <i class="fas fa-project-diagram"></i>
            <span>Projects</span>
            <span class="badge">{{ projectStats.active }}</span>
          </router-link>
          <router-link to="/skills" class="menu-item" active-class="active">
            <i class="fas fa-code"></i>
            <span>Skills</span>
          </router-link>
          <router-link to="/objectives" class="menu-item" active-class="active">
            <i class="fas fa-bullseye"></i>
            <span>Objectives</span>
            <span class="badge">{{ objectiveStats.inProgress }}</span>
          </router-link>
          <router-link to="/timeline" class="menu-item" active-class="active">
            <i class="fas fa-stream"></i>
            <span>Timeline</span>
          </router-link>
          <router-link to="/community" class="menu-item" active-class="active">
            <i class="fas fa-users"></i>
            <span>Community</span>
            <span class="badge badge-primary">{{ notifications.community }}</span>
          </router-link>
          <router-link to="/messages" class="menu-item" active-class="active">
            <i class="fas fa-envelope"></i>
            <span>Messages</span>
            <span class="badge badge-primary" v-if="notifications.messages > 0">{{ notifications.messages }}</span>
          </router-link>
        </div>
      </nav>
  
      <!-- Main Content -->
      <main class="main-content">
        <header class="main-header">
          <div class="header-left">
            <h1>{{ pageTitle }}</h1>
            <div class="breadcrumbs">
              <span>Home</span>
              <span class="divider">/</span>
              <span class="active">{{ currentRoute }}</span>
            </div>
          </div>
          
          <div class="header-right">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Search...">
            </div>
            
            <div class="header-actions">
              <button class="btn-notification" @click="toggleNotifications">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" v-if="notifications.total > 0">{{ notifications.total }}</span>
              </button>
              
              <div class="user-dropdown" @click="toggleUserDropdown">
                <img :src="user.photoURL || 'https://ui-avatars.com/api/?name='+user.displayName" class="user-avatar">
                <i class="fas fa-chevron-down"></i>
                
                <div class="dropdown-menu" v-if="showDropdown">
                  <router-link to="/profile" class="dropdown-item">
                    <i class="fas fa-user"></i> My Profile
                  </router-link>
                  <router-link to="/settings" class="dropdown-item">
                    <i class="fas fa-cog"></i> Settings
                  </router-link>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item" @click="logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
  
        <!-- Main Content Slot -->
        <div class="content-wrapper">
          <slot></slot>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SideNavbar',
    data() {
      return {
        user: {
          displayName: '',
          photoURL: '',
          title: ''
        },
        userStats: {
          followers: 0,
          following: 0
        },
        projectStats: {
          total: 0,
          completed: 0,
          inProgress: 0,
          active: 0
        },
        objectiveStats: {
          total: 0, 
          completed: 0,
          inProgress: 0
        },
        notifications: {
          total: 0,
          messages: 0,
          community: 0
        },
        showDropdown: false,
        showNotifications: false,
        pageTitle: 'Dashboard Overview',
        currentRoute: 'Dashboard'
      };
    },
    created() {
      this.getCurrentUser();
      this.loadUserStats();
    },
    watch: {
      '$route'(to) {
        this.updatePageInfo(to);
      }
    },
    methods: {
      getCurrentUser() {
        // Get current user from Firebase using your existing setup
        const auth = this.$firebase.auth();
        const user = auth.currentUser;
        
        if (user) {
          this.user = {
            displayName: user.displayName || 'User',
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
          };
          
          // Get additional user data from Firestore
          this.getUserProfile(user.uid);
        } else {
          // If not logged in, redirect to login page
          this.$router.push('/login');
        }
      },
      async getUserProfile(userId) {
        try {
          const db = this.$firebase.firestore();
          const userDoc = await db.collection('users').where('uid', '==', userId).get();
          
          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            this.user = {
              ...this.user,
              title: userData.title || 'Developer',
              bio: userData.bio
            };
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      },
      async loadUserStats() {
        const auth = this.$firebase.auth();
        const user = auth.currentUser;
        
        if (!user) return;
        
        try {
          const db = this.$firebase.firestore();
          
          // Load followers & following stats
          const followersSnapshot = await db.collection('followers').where('userId', '==', user.uid).get();
          const followingSnapshot = await db.collection('following').where('userId', '==', user.uid).get();
          
          this.userStats.followers = followersSnapshot.size;
          this.userStats.following = followingSnapshot.size;
          
          // Load project stats
          const projectsSnapshot = await db.collection('users').doc(user.uid).collection('projects').get();
          const projects = projectsSnapshot.docs.map(doc => doc.data());
          
          this.projectStats.total = projects.length;
          this.projectStats.completed = projects.filter(p => p.status === 'completed').length;
          this.projectStats.inProgress = projects.filter(p => p.status === 'in-progress').length;
          this.projectStats.active = projects.filter(p => p.status !== 'completed' && p.status !== 'on-hold').length;
          
          // Load objectives stats
          const objectivesSnapshot = await db.collection('users').doc(user.uid).collection('objectives').get();
          const objectives = objectivesSnapshot.docs.map(doc => doc.data());
          
          this.objectiveStats.total = objectives.length;
          this.objectiveStats.completed = objectives.filter(o => o.status === 'completed').length;
          this.objectiveStats.inProgress = objectives.filter(o => o.status === 'in-progress').length;
          
          // Load notifications
          const notificationsSnapshot = await db.collection('users').doc(user.uid).collection('notifications')
            .where('read', '==', false).get();
          
          const notifications = notificationsSnapshot.docs.map(doc => doc.data());
          this.notifications.total = notifications.length;
          this.notifications.messages = notifications.filter(n => n.type === 'message').length;
          this.notifications.community = notifications.filter(n => n.type === 'community').length;
          
        } catch (error) {
          console.error("Error loading user stats:", error);
        }
      },
      updatePageInfo(route) {
        // Update page title and breadcrumb based on current route
        const routeName = route.name || route.path.split('/').pop();
        this.currentRoute = routeName.charAt(0).toUpperCase() + routeName.slice(1);
        this.pageTitle = `${this.currentRoute} Overview`;
      },
      toggleUserDropdown() {
        this.showDropdown = !this.showDropdown;
        if (this.showDropdown) {
          this.showNotifications = false;
        }
      },
      toggleNotifications() {
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) {
          this.showDropdown = false;
        }
      },
      async logout() {
        try {
          await this.$firebase.auth().signOut();
          this.$router.push('/login');
        } catch (error) {
          console.error("Error signing out:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Layout */
  .app-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f5f8fa;
  }
  
  /* Side Navigation */
  .sidenav {
    width: 280px;
    background-color: #ffffff;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    z-index: 10;
  }
  
  .sidenav-header {
    padding: 25px 20px;
    border-bottom: 1px solid #f1f1f1;
  }
  
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 3px solid #f1f1f1;
  }
  
  .profile-info h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.1rem;
  }
  
  .profile-info p {
    margin: 5px 0 10px;
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .profile-stats {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: #95a5a6;
  }
  
  .sidenav-menu {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 12px 25px;
    color: #57606f;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .menu-item i {
    margin-right: 15px;
    width: 18px;
    text-align: center;
  }
  
  .menu-item:hover {
    color: #3498db;
    background-color: #f8f9fa;
  }
  
  .menu-item.active {
    color: #3498db;
    background-color: #f0f7ff;
    border-left: 3px solid #3498db;
  }
  
  .badge {
    background-color: #e74c3c;
    color: white;
    border-radius: 10px;
    padding: 2px 8px;
    font-size: 0.75rem;
    margin-left: auto;
  }
  
  .badge-primary {
    background-color: #3498db;
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 280px;
    padding: 20px;
    max-width: calc(100% - 280px);
  }
  
  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eaeaea;
  }
  
  .header-left h1 {
    margin: 0 0 5px;
    font-size: 1.5rem;
    color: #2c3e50;
  }
  
  .breadcrumbs {
    font-size: 0.85rem;
    color: #95a5a6;
  }
  
  .breadcrumbs .divider {
    margin: 0 5px;
  }
  
  .breadcrumbs .active {
    color: #3498db;
  }
  
  .header-right {
    display: flex;
    align-items: center;
  }
  
  .search-box {
    position: relative;
    margin-right: 20px;
  }
  
  .search-box i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #95a5a6;
  }
  
  .search-box input {
    padding: 8px 12px 8px 35px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    width: 220px;
    font-size: 0.9rem;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
  }
  
  .btn-notification {
    background: none;
    border: none;
    position: relative;
    cursor: pointer;
    margin-right: 15px;
    font-size: 1.1rem;
    color: #57606f;
  }
  
  .notification-badge {
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
  
  .user-dropdown {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 5px;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 45px;
    right: 0;
    background: white;
    width: 200px;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 10px 0;
    z-index: 100;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    color: #57606f;
    text-decoration: none;
    transition: background 0.3s ease;
  }
  
  .dropdown-item i {
    margin-right: 10px;
    width: 16px;
    text-align: center;
  }
  
  .dropdown-item:hover {
    background-color: #f8f9fa;
  }
  
  .dropdown-divider {
    height: 1px;
    background-color: #eaeaea;
    margin: 5px 0;
  }
  
  /* Content Wrapper */
  .content-wrapper {
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    padding: 25px;
  }
  
  /* Responsive */
  @media (max-width: 992px) {
    .sidenav {
      width: 250px;
    }
    
    .main-content {
      margin-left: 250px;
      max-width: calc(100% - 250px);
    }
  }
  
  @media (max-width: 768px) {
    .sidenav {
      width: 70px;
    }
    
    .sidenav-header {
      padding: 15px 10px;
    }
    
    .profile-info, 
    .profile-stats,
    .menu-item span {
      display: none;
    }
    
    .profile-avatar {
      width: 40px;
      height: 40px;
      margin-bottom: 0;
    }
    
    .menu-item {
      padding: 15px 0;
      justify-content: center;
    }
    
    .menu-item i {
      margin-right: 0;
      font-size: 1.2rem;
    }
    
    .badge {
      position: absolute;
      top: 8px;
      right: 8px;
      margin-left: 0;
    }
    
    .main-content {
      margin-left: 70px;
      max-width: calc(100% - 70px);
    }
    
    .search-box input {
      width: 180px;
    }
  }
  
  @media (max-width: 576px) {
    .main-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .header-right {
      width: 100%;
      margin-top: 15px;
      justify-content: space-between;
    }
    
    .search-box {
      flex: 1;
      margin-right: 10px;
    }
    
    .search-box input {
      width: 100%;
    }
  }
  </style>