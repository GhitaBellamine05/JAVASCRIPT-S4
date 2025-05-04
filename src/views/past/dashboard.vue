<template>
    <div class="dashboard-container">
      <!-- User Profile Section -->
      <div class="profile-section">
        <div class="profile-header">
          <div class="avatar-container">
            <img :src="userData.photoURL || '/img/default-avatar.png'" alt="Profile" class="avatar" />
            <div class="avatar-badge" v-if="userData.status === 'active'">
              <i class="fas fa-check"></i>
            </div>
          </div>
          <div class="profile-info">
            <h1>{{ userData.displayName || 'Anonymous User' }}</h1>
            <p class="profile-title">{{ userData.title || 'Developer' }}</p>
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-number">{{ connectionsCount }}</span>
                <span class="stat-label">Connections</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ projectsCount }}</span>
                <span class="stat-label">Projects</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ skillsCount }}</span>
                <span class="stat-label">Skills</span>
              </div>
            </div>
          </div>
          <div class="profile-actions">
            <button class="btn primary" @click="editProfile">
              <i class="fas fa-user-edit"></i> Edit Profile
            </button>
            <button class="btn secondary" @click="shareProfile">
              <i class="fas fa-share-alt"></i> Share
            </button>
          </div>
        </div>
        
        <div class="profile-details">
          <div class="detail-card">
            <h3>About</h3>
            <p>{{ userData.bio || 'No bio added yet' }}</p>
          </div>
          
          <div class="detail-card">
            <h3>Top Skills</h3>
            <div class="skills-container">
              <div v-for="skill in topSkills" :key="skill.id" class="skill-item">
                <div class="skill-info">
                  <span class="skill-name">{{ skill.name }}</span>
                  <div class="skill-level">
                    <div class="level-bar" :style="{ width: getSkillLevelWidth(skill.level) }"></div>
                  </div>
                </div>
                <span class="skill-percentage">{{ getSkillLevelPercentage(skill.level) }}%</span>
              </div>
            </div>
            <router-link to="/skills" class="btn link">View all skills</router-link>
          </div>
          
          <div class="detail-card">
            <h3>Current Objectives</h3>
            <div v-for="objective in currentObjectives" :key="objective.id" class="objective-item">
              <div class="objective-header">
                <i :class="getObjectiveIcon(objective.category)"></i>
                <span>{{ objective.title }}</span>
                <span class="objective-status" :class="getStatusClass(objective.status)">
                  {{ objective.status }}
                </span>
              </div>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: objective.progress + '%' }"></div>
              </div>
              <div class="objective-meta">
                <span>Due: {{ formatDate(objective.dueDate) }}</span>
                <span>{{ objective.progress }}% complete</span>
              </div>
            </div>
            <router-link to="/objectives" class="btn link">View all objectives</router-link>
          </div>
        </div>
      </div>
  
      <!-- Public Projects Section -->
      <div class="public-projects-section">
        <div class="section-header">
          <h2>Community Projects</h2>
          <div class="filter-controls">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                v-model="projectSearch" 
                placeholder="Search projects..." 
                @input="filterProjects"
              />
            </div>
            <select v-model="projectFilter" @change="filterProjects" class="filter-select">
              <option value="all">All Technologies</option>
              <option v-for="tech in allTechnologies" :key="tech" :value="tech">{{ tech }}</option>
            </select>
          </div>
        </div>
        
        <div class="projects-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id" 
            class="project-card"
            @click="viewProject(project.id)"
          >
            <div class="project-image">
              <img :src="project.imageUrl || '/img/default-project.png'" alt="Project" />
              <div class="project-likes">
                <i class="fas fa-heart"></i>
                <span>{{ project.likes || 0 }}</span>
              </div>
            </div>
            <div class="project-content">
              <div class="project-header">
                <h3>{{ project.title }}</h3>
                <div class="project-author">
                  <img 
                    :src="project.authorAvatar || '/img/default-avatar.png'" 
                    alt="Author" 
                    class="author-avatar"
                  />
                  <span>{{ project.authorName }}</span>
                </div>
              </div>
              <p class="project-description">{{ truncateDescription(project.description) }}</p>
              <div class="project-tech">
                <span 
                  v-for="tech in project.technologies.slice(0, 3)" 
                  :key="tech" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
                <span v-if="project.technologies.length > 3" class="more-tech">
                  +{{ project.technologies.length - 3 }} more
                </span>
              </div>
              <div class="project-footer">
                <span class="project-date">{{ formatDate(project.createdAt) }}</span>
                <div class="project-actions">
                  <button class="icon-btn" @click.stop="likeProject(project.id)">
                    <i class="far fa-heart"></i>
                  </button>
                  <button class="icon-btn" @click.stop="bookmarkProject(project.id)">
                    <i class="far fa-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredProjects.length === 0" class="empty-state">
          <i class="fas fa-project-diagram"></i>
          <p>No projects match your search criteria</p>
          <button class="btn primary" @click="resetFilters">
            <i class="fas fa-redo"></i> Reset Filters
          </button>
        </div>
        
        <div class="load-more" v-if="hasMoreProjects">
          <button class="btn outline" @click="loadMoreProjects">
            <i class="fas fa-plus"></i> Load More Projects
          </button>
        </div>
      </div>
      
      <!-- Recent Activity Section -->
      <div class="activity-section">
        <div class="section-header">
          <h2>Your Recent Activity</h2>
          <router-link to="/activity" class="btn link">
            View All Activity <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        
        <div class="activity-timeline">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id" 
            class="activity-item"
            :class="'activity-' + activity.type"
          >
            <div class="activity-icon">
              <i :class="getActivityIcon(activity.type)"></i>
            </div>
            <div class="activity-content">
              <p>{{ activity.description }}</p>
              <div class="activity-meta">
                <span class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</span>
                <span class="activity-type">{{ activity.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove
  } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { db } from '@/services/firebase';
  
  export default {
    name: 'EnhancedDashboard',
    setup() {
      const router = useRouter();
      const auth = getAuth();
      
      // User data
      const userData = ref({
        displayName: '',
        photoURL: '',
        title: '',
        bio: '',
        status: 'active'
      });
      
      // Stats
      const skillsCount = ref(0);
      const projectsCount = ref(0);
      const connectionsCount = ref(0);
      
      // Personal content
      const topSkills = ref([]);
      const currentObjectives = ref([]);
      const recentActivities = ref([]);
      
      // Projects data
      const allProjects = ref([]);
      const filteredProjects = ref([]);
      const projectSearch = ref('');
      const projectFilter = ref('all');
      const allTechnologies = ref([]);
      const projectsLimit = ref(6);
      const hasMoreProjects = ref(true);
      
      // Formatting functions
      const formatDate = (timestamp) => {
        if (!timestamp) return 'No date';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      };
      
      const formatTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
        
        return Math.floor(seconds) + " second" + (seconds === 1 ? "" : "s") + " ago";
      };
      
      const truncateDescription = (text) => {
        if (!text) return '';
        return text.length > 120 ? text.substring(0, 120) + '...' : text;
      };
      
      // Helper functions
      const getSkillLevelWidth = (level) => {
        const levels = {
          'Beginner': '33%',
          'Intermediate': '66%',
          'Advanced': '100%',
          'Expert': '100%'
        };
        return levels[level] || '0%';
      };
      
      const getSkillLevelPercentage = (level) => {
        const levels = {
          'Beginner': 33,
          'Intermediate': 66,
          'Advanced': 100,
          'Expert': 100
        };
        return levels[level] || 0;
      };
      
      const getObjectiveIcon = (category) => {
        const icons = {
          'learning': 'fas fa-graduation-cap',
          'career': 'fas fa-briefcase',
          'personal': 'fas fa-user',
          'fitness': 'fas fa-running',
          'default': 'fas fa-bullseye'
        };
        return icons[category] || icons.default;
      };
      
      const getStatusClass = (status) => {
        return status.toLowerCase().replace(' ', '-');
      };
      
      const getActivityIcon = (type) => {
        const icons = {
          'skill': 'fas fa-code',
          'project': 'fas fa-project-diagram',
          'objective': 'fas fa-bullseye',
          'connection': 'fas fa-user-plus',
          'default': 'fas fa-bell'
        };
        return icons[type] || icons.default;
      };
      
      // Data fetching
      const fetchUserData = async (userId) => {
        try {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            userData.value = { ...userData.value, ...userSnap.data() };
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      const fetchUserStats = async (userId) => {
        try {
          // Skills count
          const skillsQuery = query(collection(db, 'skills'), where('userId', '==', userId));
          const skillsSnap = await getDocs(skillsQuery);
          skillsCount.value = skillsSnap.size;
          
          // Top skills
          topSkills.value = skillsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (b.level || '').localeCompare(a.level || ''))
            .slice(0, 5);
            
          // Projects count
          const projectsQuery = query(
            collection(db, 'projects'), 
            where('userId', '==', userId)
          );
          const projectsSnap = await getDocs(projectsQuery);
          projectsCount.value = projectsSnap.size;
          
          // Connections count
          const connectionsQuery = query(
            collection(db, 'connections'), 
            where('userId', '==', userId)
          );
          const connectionsSnap = await getDocs(connectionsQuery);
          connectionsCount.value = connectionsSnap.size;
          
          // Objectives
          const objectivesQuery = query(
            collection(db, 'objectives'),
            where('userId', '==', userId),
            where('status', '==', 'In Progress'),
            orderBy('dueDate', 'asc'),
            limit(3)
          );
          const objectivesSnap = await getDocs(objectivesQuery);
          currentObjectives.value = objectivesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Recent activity
          const activitiesQuery = query(
            collection(db, 'activities'),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(5)
          );
          const activitiesSnap = await getDocs(activitiesQuery);
          recentActivities.value = activitiesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.error('Error fetching user stats:', error);
        }
      };
      
      const fetchPublicProjects = async () => {
        try {
          const projectsQuery = query(
            collection(db, 'projects'),
            where('isPublic', '==', true),
            orderBy('createdAt', 'desc'),
            limit(projectsLimit.value)
          );
          const projectsSnap = await getDocs(projectsQuery);
          
          // Get all unique technologies
          const techSet = new Set();
          
          allProjects.value = await Promise.all(projectsSnap.docs.map(async doc => {
            const projectData = doc.data();
            
            // Get author info
            let authorName = 'Unknown';
            let authorAvatar = '';
            
            if (projectData.userId) {
              try {
                const userRef = doc(db, 'users', projectData.userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  authorName = userSnap.data().displayName || authorName;
                  authorAvatar = userSnap.data().photoURL || authorAvatar;
                }
              } catch (error) {
                console.error('Error fetching author info:', error);
              }
            }
            
            // Add technologies to set
            if (projectData.technologies) {
              projectData.technologies.forEach(tech => techSet.add(tech));
            }
            
            return {
              id: doc.id,
              ...projectData,
              authorName,
              authorAvatar
            };
          }));
          
          allTechnologies.value = Array.from(techSet).sort();
          filteredProjects.value = [...allProjects.value];
          hasMoreProjects.value = allProjects.value.length >= projectsLimit.value;
        } catch (error) {
          console.error('Error fetching public projects:', error);
        }
      };
      
      // Filter functions
      const filterProjects = () => {
        filteredProjects.value = allProjects.value.filter(project => {
          // Search filter
          const matchesSearch = 
            project.title.toLowerCase().includes(projectSearch.value.toLowerCase()) ||
            project.description.toLowerCase().includes(projectSearch.value.toLowerCase());
          
          // Technology filter
          const matchesTech = 
            projectFilter.value === 'all' || 
            (project.technologies && project.technologies.includes(projectFilter.value));
          
          return matchesSearch && matchesTech;
        });
      };
      
      const resetFilters = () => {
        projectSearch.value = '';
        projectFilter.value = 'all';
        filterProjects();
      };
      
      const loadMoreProjects = async () => {
        projectsLimit.value += 6;
        await fetchPublicProjects();
      };
      
      // Action functions
      const viewProject = (projectId) => {
        router.push(`/projects/${projectId}`);
      };
      
      const likeProject = async (projectId) => {
        try {
          const projectRef = doc(db, 'projects', projectId);
          const userId = auth.currentUser?.uid;
          
          if (!userId) return;
          
          // Check if already liked
          const project = allProjects.value.find(p => p.id === projectId);
          const isLiked = project.likedBy?.includes(userId);
          
          if (isLiked) {
            // Unlike
            await updateDoc(projectRef, {
              likes: (project.likes || 0) - 1,
              likedBy: arrayRemove(userId)
            });
          } else {
            // Like
            await updateDoc(projectRef, {
              likes: (project.likes || 0) + 1,
              likedBy: arrayUnion(userId)
            });
          }
          
          // Update local state
          const index = allProjects.value.findIndex(p => p.id === projectId);
          if (index !== -1) {
            allProjects.value[index] = {
              ...allProjects.value[index],
              likes: isLiked ? (project.likes || 0) - 1 : (project.likes || 0) + 1,
              likedBy: isLiked 
                ? (project.likedBy || []).filter(id => id !== userId)
                : [...(project.likedBy || []), userId]
            };
          }
          
          filterProjects();
        } catch (error) {
          console.error('Error liking project:', error);
        }
      };
      
      const bookmarkProject = async (projectId) => {
        try {
          const userId = auth.currentUser?.uid;
          if (!userId) return;
          
          const userRef = doc(db, 'users', userId);
          const project = allProjects.value.find(p => p.id === projectId);
          const isBookmarked = project.bookmarkedBy?.includes(userId);
          
          if (isBookmarked) {
            // Remove bookmark
            await updateDoc(userRef, {
              bookmarkedProjects: arrayRemove(projectId)
            });
          } else {
            // Add bookmark
            await updateDoc(userRef, {
              bookmarkedProjects: arrayUnion(projectId)
            });
          }
          
          // Update local state
          const index = allProjects.value.findIndex(p => p.id === projectId);
          if (index !== -1) {
            allProjects.value[index] = {
              ...allProjects.value[index],
              bookmarkedBy: isBookmarked 
                ? (project.bookmarkedBy || []).filter(id => id !== userId)
                : [...(project.bookmarkedBy || []), userId]
            };
          }
        } catch (error) {
          console.error('Error bookmarking project:', error);
        }
      };
      
      const editProfile = () => {
        router.push('/profile/edit');
      };
      
      const shareProfile = () => {
        if (navigator.share) {
          navigator.share({
            title: `Check out ${userData.value.displayName}'s profile`,
            text: `View ${userData.value.displayName}'s developer profile and projects`,
            url: window.location.href
          }).catch(err => {
            console.log('Error sharing:', err);
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          alert('Share functionality not available in your browser');
        }
      };
      
      // Initialize
      onMounted(() => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            await fetchUserData(user.uid);
            await fetchUserStats(user.uid);
            await fetchPublicProjects();
          }
        });
      });
      
      return {
        // Data
        userData,
        skillsCount,
        projectsCount,
        connectionsCount,
        topSkills,
        currentObjectives,
        recentActivities,
        allProjects,
        filteredProjects,
        projectSearch,
        projectFilter,
        allTechnologies,
        hasMoreProjects,
        
        // Methods
        formatDate,
        formatTimeAgo,
        truncateDescription,
        getSkillLevelWidth,
        getSkillLevelPercentage,
        getObjectiveIcon,
        getStatusClass,
        getActivityIcon,
        filterProjects,
        resetFilters,
        loadMoreProjects,
        viewProject,
        likeProject,
        bookmarkProject,
        editProfile,
        shareProfile
      };
    }
  };
  </script>
  
  <style scoped>
  /* Base Styles */
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  /* Profile Section */
  .profile-section {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .avatar-container {
    position: relative;
    margin-right: 25px;
  }
  
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .avatar-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    background-color: #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid white;
  }
  
  .profile-info {
    flex: 1;
  }
  
  .profile-info h1 {
    font-size: 32px;
    margin: 0 0 5px 0;
    color: #2c3e50;
  }
  
  .profile-title {
    font-size: 18px;
    color: #7f8c8d;
    margin: 0 0 15px 0;
    font-weight: 500;
  }
  
  .profile-stats {
    display: flex;
    gap: 25px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-number {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    display: block;
  }
  
  .stat-label {
    font-size: 14px;
    color: #7f8c8d;
  }
  
  .profile-actions {
    display: flex;
    gap: 15px;
  }
  
  /* Detail Cards */
  .profile-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
  }
  
  .detail-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .detail-card h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 18px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  /* Skills */
  .skills-container {
    margin-bottom: 15px;
  }
  
  .skill-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .skill-info {
    flex: 1;
  }
  
  .skill-name {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  .skill-level {
    height: 6px;
    background: #ecf0f1;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .level-bar {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    border-radius: 3px;
  }
  
  .skill-percentage {
    font-size: 14px;
    color: #7f8c8d;
    margin-left: 15px;
  }
  
  /* Objectives */
  .objective-item {
    margin-bottom: 20px;
  }
  
  .objective-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .objective-header i {
    margin-right: 10px;
    color: #3498db;
  }
  
  .objective-header span:first-of-type {
    flex: 1;
    font-weight: 500;
  }
  
  .objective-status {
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 12px;
    background: #ecf0f1;
    color: #7f8c8d;
  }
  
  .objective-status.in-progress {
    background: #fff4e5;
    color: #e67e22;
  }
  
  .objective-status.completed {
    background: #e8f8f5;
    color: #27ae60;
  }
  
  .objective-status.not-started {
    background: #f5f6fa;
    color: #7f8c8d;
  }
  
  .progress-container {
    height: 6px;
    background: #ecf0f1;
    border-radius: 3px;
    margin-bottom: 5px;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    border-radius: 3px;
    transition: width 0.5s ease;
  }
  
  .objective-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #95a5a6;
  }
  
  /* Public Projects Section */
  .public-projects-section {
    margin-bottom: 40px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }
  
  .section-header h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 24px;
  }
  
  .filter-controls {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .search-box {
    position: relative;
  }
  
  .search-box i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #95a5a6;
  }
  
  .search-box input {
    padding: 10px 15px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 25px;
    width: 200px;
    transition: all 0.3s;
  }
  
  .search-box input:focus {
    width: 250px;
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
  
  .filter-select {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 25px;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .filter-select:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
  
  /* Projects Grid */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;
  }
  
  .project-card {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
  }
  
  .project-image {
    position: relative;
    height: 180px;
    overflow: hidden;
  }
  
  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .project-card:hover .project-image img {
    transform: scale(1.05);
  }
  
  .project-likes {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .project-likes i {
    color: #ff6b6b;
  }
  
  .project-content {
    padding: 20px;
  }
  
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  
  .project-header h3 {
    margin: 0;
    font-size: 18px;
    color: #2c3e50;
    flex: 1;
  }
  
  .project-author {
    display: flex;
    align-items: center;
    margin-left: 15px;
  }
  
  .author-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 8px;
    border: 2px solid #eee;
  }
  
  .project-description {
    color: #7f8c8d;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 15px;
  }
  
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
  }
  
  .tech-tag {
    background: #f1f3f6;
    color: #3498db;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .more-tech {
    font-size: 12px;
    color: #95a5a6;
    align-self: center;
  }
  
  .project-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #95a5a6;
  }
  
  .project-actions {
    display: flex;
    gap: 10px;
  }
  
  .icon-btn {
    background: none;
    border: none;
    color: #95a5a6;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon-btn:hover {
    background: #f5f7fa;
    color: #3498db;
  }
  
  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 50px 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  }
  
  .empty-state i {
    font-size: 50px;
    color: #bdc3c7;
    margin-bottom: 20px;
  }
  
  .empty-state p {
    color: #7f8c8d;
    margin-bottom: 20px;
    font-size: 16px;
  }
  
  /* Load More */
  .load-more {
    text-align: center;
    margin-top: 30px;
  }
  
  /* Activity Section */
  .activity-section {
    margin-bottom: 40px;
  }
  
  .activity-timeline {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  }
  
  .activity-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #f1f3f6;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    flex-shrink: 0;
    color: #3498db;
  }
  
  .activity-item.activity-skill .activity-icon {
    background: #e8f4fc;
    color: #3498db;
  }
  
  .activity-item.activity-project .activity-icon {
    background: #f0e8f5;
    color: #9b59b6;
  }
  
  .activity-item.activity-objective .activity-icon {
    background: #e8f5e9;
    color: #27ae60;
  }
  
  .activity-item.activity-connection .activity-icon {
    background: #fff4e5;
    color: #e67e22;
  }
  
  .activity-content {
    flex: 1;
  }
  
  .activity-content p {
    margin: 0 0 5px 0;
    color: #2c3e50;
  }
  
  .activity-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #95a5a6;
  }
  
  .activity-type {
    text-transform: capitalize;
  }
  
  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-size: 14px;
    gap: 8px;
  }
  
  .btn i {
    font-size: 14px;
  }
  
  .btn.primary {
    background: linear-gradient(135deg, #3498db, #2ecc71);
    color: white;
    box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
  }
  
  .btn.primary:hover {
    background: linear-gradient(135deg, #2980b9, #27ae60);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  }
  
  .btn.secondary {
    background: white;
    color: #3498db;
    border: 1px solid #3498db;
  }
  
  .btn.secondary:hover {
    background: #f5f7fa;
    transform: translateY(-2px);
  }
  
  .btn.outline {
    background: transparent;
    color: #349}
</style>