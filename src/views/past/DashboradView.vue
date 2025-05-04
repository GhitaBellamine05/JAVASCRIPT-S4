<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>Welcome back</h1>
    </div>

    <!-- Stats Cards Row -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="card-title">Skills</div>
        <div class="card-content">
          <div class="stat-number">{{ skillsCount }}</div>
          <div class="stat-label">Total skills tracked</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="card-title">Projects</div>
        <div class="card-content">
          <div class="stat-number">{{ projectsCount }}</div>
          <div class="stat-label">Completed projects</div>
        </div>
      </div>
      
      
      <div class="stat-card">
        <div class="card-title">Objectives</div>
        <div class="card-content">
          <div class="stat-number">{{ objectivesStats.completed }}</div>
          <div class="stat-label">Completed / {{ objectivesStats.total }} total</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="card-title">Activity</div>
        <div class="card-content">
          <div class="stat-number">{{ recentActivitiesCount }}</div>
          <div class="stat-label">Actions this week</div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- Recent Activity Timeline -->
      <div class="activity-section">
        <div class="card">
          <div class="card-header">
            <span>Recent Activity</span>
            <router-link to="/timeline" class="btn primary">View All</router-link>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="timeline-item"
              >
                <div class="timeline-indicator" :class="getActivityColorClass(activity.type)"></div>
                <div class="timeline-content">
                  <span>{{ activity.description }}</span>
                  <span class="date-label">{{ formatDate(activity.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Objectives Progress -->
      <div class="objectives-section">
        <div class="card">
          <div class="card-header">
            <span>Current Objectives</span>
            <router-link to="/objectives" class="btn primary">Manage</router-link>
          </div>
          <div class="card-body">
            <div v-for="objective in currentObjectives" :key="objective.id" class="objective-item">
              <div class="objective-header">
                <span>{{ objective.title }}</span>
                <span>{{ objective.progress }}%</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: objective.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="lower-content">
      <!-- Skills Overview -->
      <div class="skills-section">
        <div class="card">
          <div class="card-header">
            <span>Skills Overview</span>
            <router-link to="/skills" class="btn primary">Manage Skills</router-link>
          </div>
          <div class="card-body">
            <div v-if="topSkills.length === 0" class="empty-state">
              <p>No skills added yet</p>
              <router-link to="/skills" class="btn primary">Add your first skill</router-link>
            </div>
            <div v-else class="skill-chips">
              <span
                v-for="skill in topSkills"
                :key="skill.id"
                class="skill-chip"
                :class="getSkillLevelClass(skill.level)"
              >
                {{ skill.name }} ({{ skill.level }})
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Projects -->
      <div class="projects-section">
        <div class="card">
          <div class="card-header">
            <span>Recent Projects</span>
            <router-link to="/projects" class="btn primary">View All</router-link>
          </div>
          <div class="card-body">
            <div v-if="recentProjects.length === 0" class="empty-state">
              <p>No projects added yet</p>
              <router-link to="/projects" class="btn primary">Add your first project</router-link>
            </div>
            <div v-else class="project-list">
              <div
                v-for="project in recentProjects"
                :key="project.id"
                class="project-item"
                @click="goToProject(project.id)"
              >
                <div class="project-image">
                  <img
                    :src="project.imageUrl || '/img/default-project.png'"
                    alt="Project Image"
                  />
                </div>
                <div class="project-details">
                  <div class="project-title">{{ project.title }}</div>
                  <div class="project-tech">
                    <span
                      v-for="tech in project.technologies.slice(0, 3)"
                      :key="tech"
                      class="tech-chip"
                    >
                      {{ tech }}
                    </span>
                    <span v-if="project.technologies.length > 3" class="more-tech">
                      +{{ project.technologies.length - 3 }} more
                    </span>
                  </div>
                </div>
              </div>
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
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/services/firebase';

export default {
  name: 'Dashboard',
  setup() {
    const auth = getAuth();
    const router = useRouter();
    const user = ref(null);
    const skillsCount = ref(0);
    const projectsCount = ref(0);
    const objectivesStats = ref({ total: 0, completed: 0 });
    const recentActivities = ref([]);
    const recentActivitiesCount = ref(0);
    const topSkills = ref([]);
    const recentProjects = ref([]);
    const currentObjectives = ref([]);

    onMounted(() => {
      // Check if user is authenticated
      onAuthStateChanged(auth, async (userData) => {
        if (userData) {
          user.value = userData;
          await fetchDashboardData(userData.uid);
        }
      });
    });

    const fetchDashboardData = async (userId) => {
      try {
        // Fetch skills count
        const skillsRef = collection(db, 'skills');
        const skillsQuery = query(
          skillsRef,
          where('userId', '==', userId)
        );
        const skillsSnapshot = await getDocs(skillsQuery);
        skillsCount.value = skillsSnapshot.size;
        
        // Set top skills (up to 10 most recent)
        topSkills.value = skillsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 10);

        // Fetch projects count
        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(
          projectsRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        projectsCount.value = projectsSnapshot.size;
        
        // Set recent projects (up to 3)
        recentProjects.value = projectsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .slice(0, 3);

        // Fetch objectives stats
        const objectivesRef = collection(db, 'objectives');
        const objectivesQuery = query(
          objectivesRef,
          where('userId', '==', userId)
        );
        const objectivesSnapshot = await getDocs(objectivesQuery);
        const objectives = objectivesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        objectivesStats.value = {
          total: objectives.length,
          completed: objectives.filter(obj => obj.status === 'Completed').length
        };
        
        // Set current in-progress objectives
        currentObjectives.value = objectives
          .filter(obj => obj.status === 'In Progress')
          .slice(0, 4);

        // Fetch recent activities
        const activitiesRef = collection(db, 'activities');
        const activitiesQuery = query(
          activitiesRef,
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        recentActivities.value = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Count this week's activities
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyActivitiesQuery = query(
          activitiesRef,
          where('userId', '==', userId),
          where('timestamp', '>=', oneWeekAgo)
        );
        const weeklyActivitiesSnapshot = await getDocs(weeklyActivitiesQuery);
        recentActivitiesCount.value = weeklyActivitiesSnapshot.size;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const getActivityColorClass = (type) => {
      const classes = {
        'skill': 'activity-skill',
        'project': 'activity-project',
        'objective': 'activity-objective',
        'default': 'activity-default'
      };
      return classes[type] || classes.default;
    };

    const getSkillLevelClass = (level) => {
      const classes = {
        'Beginner': 'level-beginner',
        'Intermediate': 'level-intermediate',
        'Advanced': 'level-advanced',
        'default': 'level-default'
      };
      return classes[level] || classes.default;
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('default', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };
    
    const goToProject = (projectId) => {
      router.push(`/projects/${projectId}`);
    };

    return {
      user,
      skillsCount,
      projectsCount,
      objectivesStats,
      recentActivities,
      recentActivitiesCount,
      topSkills,
      recentProjects,
      currentObjectives,
      getActivityColorClass,
      getSkillLevelClass,
      formatDate,
      goToProject
    };
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 30px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 15px;
}

.card-content {
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  color: #666;
  font-size: 14px;
  margin-top: 5px;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.lower-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.card-body {
  padding: 20px;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background-color: #4a6cf7;
  color: white;
}

.btn.primary:hover {
  background-color: #3a5ce6;
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  margin-bottom: 16px;
  position: relative;
}

.timeline-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 16px;
  flex-shrink: 0;
  margin-top: 5px;
}

.activity-skill {
  background-color: #4caf50;
}

.activity-project {
  background-color: #9c27b0;
}

.activity-objective {
  background-color: #2196f3;
}

.activity-default {
  background-color: #9e9e9e;
}

.timeline-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.date-label {
  color: #888;
  font-size: 12px;
}

.objective-item {
  margin-bottom: 16px;
}

.objective-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-bar-container {
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4a6cf7;
  border-radius: 5px;
}

.empty-state {
  text-align: center;
  padding: 20px 0;
}

.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  border: 1px solid;
}

.level-beginner {
  border-color: #4caf50;
  color: #4caf50;
}

.level-intermediate {
  border-color: #2196f3;
  color: #2196f3;
}

.level-advanced {
  border-color: #9c27b0;
  color: #9c27b0;
}

.level-default {
  border-color: #9e9e9e;
  color: #9e9e9e;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s;
}

.project-item:hover {
  background-color: #f0f0f0;
}

.project-image {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 16px;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.project-tech {
  display: flex;
  gap: 6px;
  align-items: center;
}

.tech-chip {
  background-color: #eee;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

.more-tech {
  font-size: 11px;
  color: #888;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content,
  .lower-content {
    grid-template-columns: 1fr;
  }
}
</style>