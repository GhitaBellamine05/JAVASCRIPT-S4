<template>
    <div class="dashboard-container">
      <!-- Loading state -->
      <div v-if="loading" class="loading-overlay">
        <div class="loader"></div>
      </div>
  
      <!-- Main Content -->
      <div v-else class="dashboard-content">
        <!-- User Profile Header -->
        <div class="profile-header">
          <div class="avatar-container">
            <img :src="currentUser.photoURL" class="user-avatar">
            <div class="level-badge">
              {{ userLevel }}
            </div>
          </div>
          <div class="user-info">
            <h1>{{ currentUser.displayName }}</h1>
            <p>{{ currentUser.email }}</p>
            <div class="progress-container">
              <div class="progress-bar" :style="{ width: completionRate + '%' }"></div>
              <span>{{ completionRate }}% Profile Complete</span>
            </div>
          </div>
        </div>
  
        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in stats" :key="stat.title">
            <div class="stat-icon" :class="stat.color">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stat.value }}</h3>
              <p>{{ stat.title }}</p>
            </div>
          </div>
        </div>
  
        <!-- Projects Progress -->
        <div class="section-card">
          <div class="section-header">
            <h2><i class="fas fa-project-diagram"></i> Active Projects</h2>
            <router-link to="/projects">View All</router-link>
          </div>
          
          <div class="projects-list">
            <div v-for="project in activeProjects" :key="project.id" class="project-item">
              <div class="project-info">
                <h3>{{ project.name }}</h3>
                <p>{{ project.description }}</p>
                <div class="project-meta">
                  <span class="deadline">
                    <i class="fas fa-calendar-alt"></i> 
                    {{ formatDate(project.deadline) }}
                  </span>
                  <span class="progress">
                    {{ project.progress }}% Complete
                  </span>
                </div>
              </div>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: project.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Skills Progress -->
        <div class="section-card">
          <div class="section-header">
            <h2><i class="fas fa-code"></i> Top Skills</h2>
            <router-link to="/skills">View All</router-link>
          </div>
          
          <div class="skills-grid">
            <div v-for="skill in topSkills" :key="skill.id" class="skill-item">
              <div class="skill-header">
                <h3>{{ skill.name }}</h3>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: skill.level + '%', backgroundColor: getSkillColor(skill.level) }"></div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Community Activity -->
        <div class="section-card">
          <div class="section-header">
            <h2><i class="fas fa-users"></i> Recent Community Activity</h2>
            <router-link to="/community">View All</router-link>
          </div>
          
          <div class="community-feed">
            <div v-for="post in recentPosts" :key="post.id" class="post-item">
              <img :src="post.user.avatar" class="post-avatar">
              <div class="post-content">
                <div class="post-header">
                  <h3>{{ post.user.name }}</h3>
                  <span class="post-time">{{ formatTime(post.timestamp) }}</span>
                </div>
                <p>{{ post.content }}</p>
                <div class="post-actions">
                  <button @click="likePost(post.id)" :class="{ liked: post.isLiked }">
                    <i class="far fa-heart"></i> {{ post.likes }}
                  </button>
                  <button @click="focusComment(post.id)">
                    <i class="far fa-comment"></i> {{ post.comments.length }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters } from 'vuex'
  import { auth, db } from '@/firebase'
  import { format } from 'date-fns'
  
  export default {
    name: 'Dashboard',
    data() {
      return {
        loading: true,
        stats: [
          { title: 'Active Projects', value: 0, icon: 'fas fa-project-diagram', color: 'blue' },
          { title: 'Skills Mastered', value: 0, icon: 'fas fa-code', color: 'green' },
          { title: 'Completed Tasks', value: 0, icon: 'fas fa-check-circle', color: 'purple' },
          { title: 'Community Points', value: 0, icon: 'fas fa-users', color: 'orange' }
        ]
      }
    },
    computed: {
      ...mapState(['currentUser']),
      ...mapGetters(['activeProjects', 'topSkills', 'recentPosts']),
      
      userLevel() {
        const points = this.currentUser.xp || 0
        if (points < 100) return 'Beginner'
        if (points < 500) return 'Intermediate'
        if (points < 1000) return 'Advanced'
        return 'Expert'
      },
      
      completionRate() {
        let completed = 0
        if (this.currentUser.photoURL) completed += 25
        if (this.currentUser.skills?.length > 0) completed += 25
        if (this.currentUser.projects?.length > 0) completed += 25
        if (this.currentUser.bio) completed += 25
        return completed
      }
    },
    async created() {
      await this.$store.dispatch('fetchUserData', auth.currentUser.uid)
      
      // Update stats
      this.stats[0].value = this.activeProjects.length
      this.stats[1].value = this.topSkills.filter(s => s.level >= 80).length
      this.stats[2].value = this.currentUser.completedTasks || 0
      this.stats[3].value = this.currentUser.communityPoints || 0
      
      this.loading = false
    },
    methods: {
      formatDate(date) {
        return format(new Date(date), 'MMM dd, yyyy')
      },
      formatTime(timestamp) {
        return format(new Date(timestamp), 'h:mm a')
      },
      getSkillColor(level) {
        if (level >= 80) return '#4CAF50'
        if (level >= 50) return '#FFC107'
        return '#F44336'
      },
      likePost(postId) {
        this.$store.dispatch('likePost', { 
          postId,
          userId: this.currentUser.uid 
        })
      },
      focusComment(postId) {
        // Implement comment focus logic
      }
    }
  }
  </script>
  
  <style scoped>
  /* Consistent with your Skills.vue styling */
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .loading-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  
  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3f51b5;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  .avatar-container {
    position: relative;
    margin-right: 20px;
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #3f51b5;
  }
  
  .level-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #3f51b5;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
  }
  
  .user-info h1 {
    margin: 0;
    color: #333;
  }
  
  .user-info p {
    margin: 5px 0;
    color: #666;
  }
  
  .progress-container {
    margin-top: 10px;
    width: 100%;
    background: #f0f0f0;
    height: 10px;
    border-radius: 5px;
    position: relative;
  }
  
  .progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 5px;
    background: linear-gradient(90deg, #3f51b5, #2196F3);
    transition: width 0.5s ease;
  }
  
  .progress-container span {
    position: absolute;
    top: 15px;
    font-size: 12px;
    color: #666;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: white;
    font-size: 20px;
  }
  
  .stat-icon.blue { background: #2196F3; }
  .stat-icon.green { background: #4CAF50; }
  .stat-icon.purple { background: #9C27B0; }
  .stat-icon.orange { background: #FF9800; }
  
  .stat-content h3 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }
  
  .stat-content p {
    margin: 5px 0 0;
    color: #666;
    font-size: 14px;
  }
  
  .section-card {
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .section-header h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
    display: flex;
    align-items: center;
  }
  
  .section-header h2 i {
    margin-right: 10px;
    color: #3f51b5;
  }
  
  .section-header a {
    color: #3f51b5;
    text-decoration: none;
    font-size: 14px;
  }
  
  .section-header a:hover {
    text-decoration: underline;
  }
  
  .projects-list {
    display: grid;
    gap: 15px;
  }
  
  .project-item {
    padding: 15px;
    border-radius: 8px;
    background: #f9f9f9;
  }
  
  .project-info h3 {
    margin: 0 0 5px;
    font-size: 16px;
    color: #333;
  }
  
  .project-info p {
    margin: 0 0 10px;
    color: #666;
    font-size: 14px;
  }
  
  .project-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888;
    margin-bottom: 10px;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .skill-item {
    padding: 15px;
    border-radius: 8px;
    background: #f9f9f9;
  }
  
  .skill-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .skill-header h3 {
    margin: 0;
    font-size: 16px;
  }
  
  .skill-level {
    font-weight: bold;
    color: #3f51b5;
  }
  
  .community-feed {
    display: grid;
    gap: 15px;
  }
  
  .post-item {
    display: flex;
    padding: 15px;
    border-radius: 8px;
    background: #f9f9f9;
  }
  
  .post-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 15px;
    object-fit: cover;
  }
  
  .post-content {
    flex: 1;
  }
  
  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .post-header h3 {
    margin: 0;
    font-size: 15px;
  }
  
  .post-time {
    margin-left: 10px;
    font-size: 12px;
    color: #888;
  }
  
  .post-content p {
    margin: 0 0 10px;
    font-size: 14px;
    color: #333;
  }
  
  .post-actions {
    display: flex;
    gap: 15px;
  }
  
  .post-actions button {
    background: none;
    border: none;
    color: #666;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  
  .post-actions button i {
    margin-right: 5px;
  }
  
  .post-actions button.liked {
    color: #e91e63;
  }
  
  .post-actions button:hover {
    color: #3f51b5;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      text-align: center;
    }
    
    .avatar-container {
      margin-right: 0;
      margin-bottom: 15px;
    }
    
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .skills-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>