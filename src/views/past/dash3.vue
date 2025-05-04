<template>
    <div class="dashboard-container">
      <div class="sidebar">
        <div class="profile-section">
          <img :src="userData.photoURL || 'default-profile.jpg'" alt="Profile" class="profile-pic">
          <h3>{{ userData.displayName || 'User' }}</h3>
          <p>{{ userData.title || 'Developer' }}</p>
        </div>
        
        <nav class="dashboard-nav">
          <router-link to="/dashboard" exact-active-class="active">
            <i class="fas fa-home"></i> Overview
          </router-link>
          <router-link to="/projects" active-class="active">
            <i class="fas fa-project-diagram"></i> Projects
          </router-link>
          <router-link to="/activities" active-class="active">
            <i class="fas fa-tasks"></i> Activities
          </router-link>
          <router-link to="/skills" active-class="active">
            <i class="fas fa-code"></i> Skills
          </router-link>
          <router-link to="/timeline" active-class="active">
            <i class="fas fa-history"></i> Timeline
          </router-link>
        </nav>
      </div>
      
      <div class="main-content">
        <div class="header">
          <h2>Dashboard Overview</h2>
          <div class="header-actions">
            <button @click="refreshData" class="refresh-btn">
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: #4e73df;">
              <i class="fas fa-project-diagram"></i>
            </div>
            <div class="stat-info">
              <p>Active Projects</p>
              <h3>{{ stats.activeProjects || 0 }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: #1cc88a;">
              <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-info">
              <p>Completed Tasks</p>
              <h3>{{ stats.completedTasks || 0 }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: #36b9cc;">
              <i class="fas fa-code"></i>
            </div>
            <div class="stat-info">
              <p>Skills</p>
              <h3>{{ stats.skillsCount || 0 }}</h3>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: #f6c23e;">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-info">
              <p>Reputation</p>
              <h3>{{ stats.reputation || 0 }}</h3>
            </div>
          </div>
        </div>
        
        <div class="content-grid">
          <div class="recent-projects">
            <h3><i class="fas fa-project-diagram"></i> Recent Projects</h3>
            <div v-if="loadingProjects" class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </div>
            <div v-else>
              <div v-for="project in recentProjects" :key="project.id" class="project-item">
                <div class="project-info">
                  <h4>{{ project.title }}</h4>
                  <p>{{ project.description }}</p>
                  <div class="project-tech">
                    <span v-for="tech in project.technologies" :key="tech" class="tech-tag">
                      {{ tech }}
                    </span>
                  </div>
                </div>
                <div class="project-status" :class="project.status">
                  {{ project.status }}
                </div>
              </div>
              <router-link to="/projects" class="view-all-link">
                View All Projects <i class="fas fa-arrow-right"></i>
              </router-link>
            </div>
          </div>
          
          <div class="recent-activity">
            <h3><i class="fas fa-history"></i> Recent Activity</h3>
            <div v-if="loadingActivities" class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </div>
            <div v-else>
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon">
                  <i :class="getActivityIcon(activity.type)"></i>
                </div>
                <div class="activity-details">
                  <p>{{ activity.description }}</p>
                  <small>{{ formatDate(activity.timestamp) }}</small>
                </div>
              </div>
              <router-link to="/timeline" class="view-all-link">
                View Full Timeline <i class="fas fa-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { getAuth } from 'firebase/auth'
  import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    getDocs,
    doc,
    getDoc
  } from 'firebase/firestore'
  
  export default {
    setup() {
      const db = getFirestore()
      const auth = getAuth()
      const userId = ref(null)
      
      // User data
      const userData = ref({})
      
      // Stats data
      const stats = ref({
        activeProjects: 0,
        completedTasks: 0,
        skillsCount: 0,
        reputation: 0
      })
      
      // Recent projects
      const recentProjects = ref([])
      const loadingProjects = ref(true)
      
      // Recent activities
      const recentActivities = ref([])
      const loadingActivities = ref(true)
      
      // Fetch user data from Firestore
      const fetchUserData = async () => {
        try {
          const user = auth.currentUser
          if (user) {
            userId.value = user.uid
            const userDoc = await getDoc(doc(db, 'users', userId.value))
            if (userDoc.exists()) {
              userData.value = userDoc.data()
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
      
      // Fetch dashboard statistics
      const fetchStats = async () => {
        try {
          if (!userId.value) return
          
          // Active projects count
          const projectsQuery = query(
            collection(db, 'projects'),
            where('userId', '==', userId.value),
            where('status', '==', 'active')
          )
          const projectsSnapshot = await getDocs(projectsQuery)
          stats.value.activeProjects = projectsSnapshot.size
          
          // Completed tasks count
          const tasksQuery = query(
            collection(db, 'tasks'),
            where('userId', '==', userId.value),
            where('status', '==', 'completed')
          )
          const tasksSnapshot = await getDocs(tasksQuery)
          stats.value.completedTasks = tasksSnapshot.size
          
          // Skills count
          const skillsQuery = query(
            collection(db, 'skills'),
            where('userId', '==', userId.value)
          )
          const skillsSnapshot = await getDocs(skillsQuery)
          stats.value.skillsCount = skillsSnapshot.size
          
          // Reputation (you might have a different way to calculate this)
          const userDoc = await getDoc(doc(db, 'users', userId.value))
          stats.value.reputation = userDoc.data()?.reputation || 0
          
        } catch (error) {
          console.error("Error fetching stats:", error)
        }
      }
      
      // Fetch recent projects
      const fetchRecentProjects = async () => {
        try {
          loadingProjects.value = true
          if (!userId.value) return
          
          const q = query(
            collection(db, 'projects'),
            where('userId', '==', userId.value),
            orderBy('createdAt', 'desc'),
            limit(5)
          )
          
          const querySnapshot = await getDocs(q)
          recentProjects.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
        } catch (error) {
          console.error("Error fetching projects:", error)
        } finally {
          loadingProjects.value = false
        }
      }
      
      // Fetch recent activities
      const fetchRecentActivities = async () => {
        try {
          loadingActivities.value = true
          if (!userId.value) return
          
          const q = query(
            collection(db, 'activities'),
            where('userId', '==', userId.value),
            orderBy('timestamp', 'desc'),
            limit(5)
          )
          
          const querySnapshot = await getDocs(q)
          recentActivities.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
        } catch (error) {
          console.error("Error fetching activities:", error)
        } finally {
          loadingActivities.value = false
        }
      }
      
      // Helper function to get activity icon
      const getActivityIcon = (type) => {
        const icons = {
          project: 'fas fa-project-diagram',
          task: 'fas fa-tasks',
          skill: 'fas fa-code',
          achievement: 'fas fa-trophy',
          default: 'fas fa-bell'
        }
        return icons[type] || icons.default
      }
      
      // Helper function to format date
      const formatDate = (timestamp) => {
        if (!timestamp) return ''
        const date = timestamp.toDate()
        return date.toLocaleString()
      }
      
      // Refresh all data
      const refreshData = () => {
        fetchUserData()
        fetchStats()
        fetchRecentProjects()
        fetchRecentActivities()
      }
      
      // Initialize
      onMounted(() => {
        refreshData()
      })
      
      return {
        userData,
        stats,
        recentProjects,
        recentActivities,
        loadingProjects,
        loadingActivities,
        refreshData,
        getActivityIcon,
        formatDate
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background-color: #f8f9fc;
  }
  
  .sidebar {
    width: 250px;
    background: #4e73df;
    background: linear-gradient(180deg, #4e73df 10%, #224abe 100%);
    color: white;
    padding: 20px;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  }
  
  .profile-section {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    margin-bottom: 20px;
  }
  
  .profile-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 15px;
  }
  
  .profile-section h3 {
    margin: 10px 0 5px;
    font-size: 1.2rem;
  }
  
  .profile-section p {
    margin: 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .dashboard-nav {
    display: flex;
    flex-direction: column;
  }
  
  .dashboard-nav a {
    color: rgba(255, 255, 255, 0.8);
    padding: 12px;
    margin: 5px 0;
    border-radius: 5px;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: all 0.3s;
  }
  
  .dashboard-nav a:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .dashboard-nav a.active {
    color: white;
    background: rgba(255, 255, 255, 0.2);
    font-weight: bold;
  }
  
  .dashboard-nav a i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .header h2 {
    color: #5a5c69;
    font-size: 1.8rem;
    margin: 0;
  }
  
  .refresh-btn {
    background: #4e73df;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .refresh-btn:hover {
    background: #3a5bc7;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
    display: flex;
    align-items: center;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    margin-right: 15px;
  }
  
  .stat-info p {
    margin: 0;
    color: #858796;
    font-size: 0.9rem;
  }
  
  .stat-info h3 {
    margin: 5px 0 0;
    color: #5a5c69;
    font-size: 1.5rem;
  }
  
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  .recent-projects, .recent-activity {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
  }
  
  .recent-projects h3, .recent-activity h3 {
    color: #5a5c69;
    margin-top: 0;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .project-item {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #e3e6f0;
  }
  
  .project-item:last-child {
    border-bottom: none;
  }
  
  .project-info h4 {
    margin: 0 0 5px;
    color: #4e73df;
  }
  
  .project-info p {
    margin: 0 0 10px;
    color: #858796;
    font-size: 0.9rem;
  }
  
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .tech-tag {
    background: #f8f9fc;
    color: #4e73df;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
  }
  
  .project-status {
    font-size: 0.8rem;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 20px;
    align-self: center;
  }
  
  .project-status.active {
    background: #e1f0ff;
    color: #4e73df;
  }
  
  .project-status.completed {
    background: #e6f7ee;
    color: #1cc88a;
  }
  
  .project-status.pending {
    background: #fff8e6;
    color: #f6c23e;
  }
  
  .activity-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #e3e6f0;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    background: #f8f9fc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: #4e73df;
  }
  
  .activity-details p {
    margin: 0 0 5px;
    color: #5a5c69;
  }
  
  .activity-details small {
    color: #858796;
    font-size: 0.8rem;
  }
  
  .view-all-link {
    display: inline-block;
    margin-top: 15px;
    color: #4e73df;
    text-decoration: none;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .view-all-link:hover {
    text-decoration: underline;
  }
  
  .loading-spinner {
    padding: 20px;
    text-align: center;
    color: #858796;
  }
  
  .loading-spinner i {
    margin-right: 8px;
  }
  
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .content-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .dashboard-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
    }
  }
  </style>