<template>
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="user-profile">
          <div class="avatar">
            <img :src="user.photoURL || 'https://ui-avatars.com/api/?name='+user.displayName" alt="User Avatar">
          </div>
          <div class="user-info">
            <h3>{{ user.displayName || 'User' }}</h3>
            <p>{{ user.email }}</p>
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
        
         <div class="sidebar-nav">
                 <router-link to="/dash" class="menu-item" active-class="active">
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
        
      <!-- Main Content -->
      <div class="main-content">
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1>Welcome back, {{ user.displayName?.split(' ')[0] || 'Developer' }}!</h1>
            <div class="header-actions">
              <button class="btn-notification">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" v-if="notificationsCount > 0">{{ notificationsCount }}</span>
              </button>
              <button class="btn-search">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          
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
             <!-- Projects Progress -->
             <div class="dashboard-card">
              <div class="card-header">
                <h3>Projects Progress</h3>
                <div class="card-actions">
                  <button class="btn-action" @click="viewAllProjects">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="project-timeline">
                  <div v-for="project in activeProjects" :key="project.id" class="project-item">
                    <div class="project-info">
                      <h4>{{ project.name }}</h4>
                      <p>{{ project.description }}</p>
                      <div class="project-meta">
                        <span class="deadline">
                          <i class="fas fa-calendar-alt"></i> {{ formatDate(project.deadline) }}
                        </span>
                        <span class="team">
                          <i class="fas fa-users"></i> {{ project.team.length }}
                        </span>
                      </div>
                    </div>
                    <div class="project-progress">
                      <div class="progress-circle" :style="progressCircleStyle(project.progress)">
                        <span>{{ project.progress }}%</span>
                      </div>
                      <div class="project-status" :class="project.status">
                        {{ project.status }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
             <!-- Skills Development -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Skills Development</h3>
                <div class="card-actions">
                  <button class="btn-action" @click="viewAllSkills">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="skills-chart">
                  <canvas ref="skillsChart"></canvas>
                </div>
                <div class="skills-legend">
                  <div v-for="(skill, index) in topSkills" :key="skill.id" class="legend-item">
                    <span class="legend-color" :style="{ backgroundColor: chartColors[index] }"></span>
                    <span class="legend-label">{{ skill.name }}</span>
                    <span class="legend-value">{{ skill.level }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Objectives Timeline -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Objectives Timeline</h3>
                <div class="card-actions">
                  <button class="btn-action" @click="viewAllObjectives">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="timeline-container">
                  <div v-for="objective in recentObjectives" :key="objective.id" class="timeline-item">
                    <div class="timeline-marker" :class="objective.status"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <h4>{{ objective.title }}</h4>
                        <span class="timeline-date">{{ formatDate(objective.deadline) }}</span>
                      </div>
                      <p>{{ objective.description }}</p>
                      <div class="timeline-progress">
                        <div class="progress-bar" :style="{ width: objective.progress + '%' }"></div>
                      </div>
                      <div class="timeline-meta">
                        <span class="progress-text">{{ objective.progress }}% completed</span>
                        <span class="priority" :class="objective.priority">{{ objective.priority }} priority</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Community Activity -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Community Activity</h3>
                <div class="card-actions">
                  <button class="btn-action" @click="viewAllCommunity">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="community-feed">
                  <div class="post-composer">
                    <img :src="user.avatar || 'https://ui-avatars.com/api/?name='+user.name" class="composer-avatar">
                    <div class="composer-input">
                      <input type="text" placeholder="Share something with the community..." @click="openPostModal">
                    </div>
                  </div>
                  
                  <div v-for="post in communityPosts" :key="post.id" class="community-post">
                    <div class="post-header">
                      <img :src="post.user.avatar" class="post-avatar">
                      <div class="post-user">
                        <h4>{{ post.user.name }}</h4>
                        <span class="post-time">{{ formatTime(post.time) }}</span>
                      </div>
                    </div>
                    
                    <div class="post-content">
                      <p>{{ post.content }}</p>
                      <div v-if="post.image" class="post-image">
                        <img :src="post.image" alt="Post image">
                      </div>
                    </div>
                    
                    <div class="post-actions">
                      <button class="btn-like" @click="toggleLike(post.id)" :class="{ liked: post.isLiked }">
                        <i class="far fa-heart"></i> {{ post.likes }}
                      </button>
                      <button class="btn-comment" @click="focusComment(post.id)">
                        <i class="far fa-comment"></i> {{ post.comments.length }}
                      </button>
                      <button class="btn-share">
                        <i class="fas fa-share"></i> Share
                      </button>
                    </div>
                    
                    <div class="post-comments" v-if="post.showComments || post.comments.length > 0">
                      <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                        <img :src="comment.user.avatar" class="comment-avatar">
                        <div class="comment-content">
                          <div class="comment-header">
                            <span class="comment-user">{{ comment.user.name }}</span>
                            <span class="comment-time">{{ formatTime(comment.time) }}</span>
                          </div>
                          <p>{{ comment.text }}</p>
                        </div>
                      </div>
                      
                      <div class="comment-input">
                        <img :src="user.avatar || 'https://ui-avatars.com/api/?name='+user.name" class="comment-avatar">
                        <input type="text" placeholder="Write a comment..." 
                               v-model="post.newComment"
                               @keyup.enter="addComment(post.id)">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Activity Stats -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Activity Statistics</h3>
                <div class="card-actions">
                  <button class="btn-action" @click="viewAllActivity">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="activity-stats">
                  <div class="stats-chart">
                    <canvas ref="activityChart"></canvas>
                  </div>
                  <div class="stats-summary">
                    <div class="stat-item">
                      <div class="stat-value">{{ activityStats.weekly }}</div>
                      <div class="stat-label">This Week</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ activityStats.monthly }}</div>
                      <div class="stat-label">This Month</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-value">{{ activityStats.total }}</div>
                      <div class="stat-label">Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
            <!-- Community Feed -->
            <div class="community-feed">
              <h3>Community Activity</h3>
              <div class="feed-tabs">
                <button 
                  v-for="tab in feedTabs" 
                  :key="tab.id" 
                  :class="{ active: activeFeedTab === tab.id }"
                  @click="activeFeedTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </div>
              
              <div v-if="loadingCommunity" class="loading">Loading community posts...</div>
              <div v-else class="feed-content">
                <div v-if="activeFeedTab === 'projects'" class="feed-items">
                  <div v-for="post in communityProjects" :key="post.id" class="feed-item">
                    <div class="post-header">
                      <img :src="post.user.avatar" class="post-avatar" />
                      <div class="post-user">
                        <strong>{{ post.user.name }}</strong>
                        <span>{{ formatDate(post.date) }}</span>
                      </div>
                    </div>
                    <div class="post-content">
                      <h4>{{ post.title }}</h4>
                      <p>{{ post.description }}</p>
                      <div class="post-tags">
                        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
                      </div>
                    </div>
                    <div class="post-actions">
                      <button class="btn-like">
                        <i class="far fa-heart"></i> {{ post.likes }}
                      </button>
                      <button class="btn-comment">
                        <i class="far fa-comment"></i> {{ post.comments }}
                      </button>
                      <button class="btn-share">
                        <i class="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeFeedTab === 'discussions'" class="feed-items">
                  <div v-for="post in communityDiscussions" :key="post.id" class="feed-item">
                    <div class="post-header">
                      <img :src="post.user.avatar" class="post-avatar" />
                      <div class="post-user">
                        <strong>{{ post.user.name }}</strong>
                        <span>{{ formatDate(post.date) }}</span>
                      </div>
                    </div>
                    <div class="post-content">
                      <p>{{ post.content }}</p>
                    </div>
                    <div class="post-actions">
                      <button class="btn-like">
                        <i class="far fa-heart"></i> {{ post.likes }}
                      </button>
                      <button class="btn-comment">
                        <i class="far fa-comment"></i> {{ post.comments }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="recent-activity">
              <h3>Your Recent Activity</h3>
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
              
            <!-- Recent Followers -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Recent Followers</h3>
                <div class="card-actions">
                  <button class="btn-action" @click="viewAllFollowers">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="followers-list">
                  <div v-for="follower in recentFollowers" :key="follower.id" class="follower-item">
                    <img :src="follower.avatar" class="follower-avatar">
                    <div class="follower-info">
                      <h4>{{ follower.name }}</h4>
                      <p>{{ follower.title }}</p>
                    </div>
                    <button class="btn-follow" :class="{ following: follower.isFollowing }" 
                            @click="toggleFollow(follower.id)">
                      {{ follower.isFollowing ? 'Following' : 'Follow back' }}
                    </button>
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
  import { db, auth } from '@/firebase'
  import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, orderBy, limit } from 'firebase/firestore'
  import { Chart, registerables } from 'chart.js'
  
  export default {
    name: 'Dashboard',
    data() {
      return {
        user: {
          displayName: '',
          email: '',
          photoURL: ''
        },
        userStats: {
          followers: 0,
          following: 0
        },
        projectStats: {
          active: 0,
          completed: 0,
          total: 0
        },
        skillStats: {
          total: 0,
          advanced: 0,
          learning: 0
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
        activeProjects: [],
        topSkills: [],
        recentObjectives: [],
        communityPosts: [],
        recentFollowers: [],
        activityStats: {
          weekly: 0,
          monthly: 0,
          total: 0
        },
        notifications: {
          total: 0,
          messages: 0,
          community: 0
        },
        feedTabs: [
          { id: 'projects', label: 'Projects' },
          { id: 'discussions', label: 'Discussions' }
        ],
        activeFeedTab: 'projects',
        newPostContent: '',
        postImage: null,
        loading: true,
        loadingCommunity: false,
        loadingActivities: false,
        loadingDeadlines: false,
        showPostModal: false,
        chartColors: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
      }
    },
    async created() {
      Chart.register(...registerables)
      await this.loadUserData()
      await this.loadProjects()
      await this.loadSkills()
      await this.loadObjectives()
      await this.loadCommunityPosts()
      await this.loadFollowers()
      await this.loadActivityStats()
      this.initCharts()
      this.loading = false
    },
    methods: {
      async loadUserData() {
        const user = auth.currentUser
        if (user) {
          this.user = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          }
  
          // Get user stats from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            this.userStats = {
              followers: userData.followers?.length || 0,
              following: userData.following?.length || 0
            }
          }
        }
      },
      async loadProjects() {
        const q = query(
          collection(db, 'projects'),
          where('userId', '==', auth.currentUser.uid)
        )
        const snapshot = await getDocs(q)
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        this.projectStats = {
          total: projects.length,
          completed: projects.filter(p => p.status === 'completed').length,
          active: projects.filter(p => p.status === 'in-progress').length
        }
        
        this.activeProjects = projects
          .filter(p => p.status === 'in-progress')
          .slice(0, 3)
      },
      async loadSkills() {
        const q = query(
          collection(db, 'skills'),
          where('userId', '==', auth.currentUser.uid)
        )
        const snapshot = await getDocs(q)
        const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        this.skillStats = {
          total: skills.length,
          advanced: skills.filter(s => s.level >= 80).length,
          learning: skills.filter(s => s.level < 50).length
        }
        
        this.topSkills = skills
          .sort((a, b) => b.level - a.level)
          .slice(0, 5)
      },
      async loadObjectives() {
        const q = query(
          collection(db, 'objectives'),
          where('userId', '==', auth.currentUser.uid)
        )
        const snapshot = await getDocs(q)
        const objectives = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        this.objectiveStats = {
          total: objectives.length,
          completed: objectives.filter(o => o.status === 'completed').length,
          inProgress: objectives.filter(o => o.status === 'in-progress').length
        }
        
        this.recentObjectives = objectives
          .filter(o => o.status === 'in-progress')
          .slice(0, 3)
      },
      async loadCommunityPosts() {
        this.loadingCommunity = true
        
        // Get posts from followed users and current user
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        const following = userDoc.exists() ? userDoc.data().following || [] : []
        
        const q = query(
          collection(db, 'posts'),
          where('userId', 'in', [...following, auth.currentUser.uid]),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        
        const snapshot = await getDocs(q)
        this.communityPosts = await Promise.all(snapshot.docs.map(async doc => {
          const post = doc.data()
          const userDoc = await getDoc(doc(db, 'users', post.userId))
          return {
            id: doc.id,
            ...post,
            user: {
              id: post.userId,
              name: userDoc.data().displayName,
              avatar: userDoc.data().photoURL
            },
            isLiked: post.likes?.includes(auth.currentUser.uid) || false,
            showComments: false,
            newComment: ''
          }
        }))
        
        this.loadingCommunity = false
      },
      async loadFollowers() {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        if (userDoc.exists()) {
          const followers = userDoc.data().followers || []
          this.recentFollowers = await Promise.all(followers.slice(0, 3).map(async userId => {
            const followerDoc = await getDoc(doc(db, 'users', userId))
            return {
              id: userId,
              name: followerDoc.data().displayName,
              avatar: followerDoc.data().photoURL,
              title: followerDoc.data().title || 'Member',
              isFollowing: (userDoc.data().following || []).includes(userId)
            }
          }))
        }
      },
      async loadActivityStats() {
        // Load activity stats from Firestore
        const q = query(
          collection(db, 'activities'),
          where('userId', '==', auth.currentUser.uid)
        )
        const snapshot = await getDocs(q)
        const activities = snapshot.docs.map(doc => doc.data())
        
        this.activityStats = {
          total: activities.length,
          monthly: activities.filter(a => {
            const activityDate = a.date.toDate()
            const now = new Date()
            return activityDate > new Date(now.getFullYear(), now.getMonth(), 1)
          }).length,
          weekly: activities.filter(a => {
            const activityDate = a.date.toDate()
            const now = new Date()
            const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
            return activityDate > lastWeek
          }).length
        }
      },
      async toggleLike(postId) {
        const post = this.communityPosts.find(p => p.id === postId)
        if (!post) return
        
        const postRef = doc(db, 'posts', postId)
        
        if (post.isLiked) {
          await updateDoc(postRef, {
            likes: arrayRemove(auth.currentUser.uid)
          })
          post.likes = post.likes - 1
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(auth.currentUser.uid)
          })
          post.likes = post.likes + 1
        }
        
        post.isLiked = !post.isLiked
      },
      async addComment(postId) {
        const post = this.communityPosts.find(p => p.id === postId)
        if (!post || !post.newComment.trim()) return
        
        const comment = {
          text: post.newComment,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp()
        }
        
        // Add comment to Firestore
        await updateDoc(doc(db, 'posts', postId), {
          comments: arrayUnion(comment)
        })
        
        // Update local state
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        post.comments.push({
          ...comment,
          user: {
            id: auth.currentUser.uid,
            name: userDoc.data().displayName,
            avatar: userDoc.data().photoURL
          }
        })
        
        post.newComment = ''
      },
      async toggleFollow(userId) {
        const userRef = doc(db, 'users', auth.currentUser.uid)
        const follower = this.recentFollowers.find(f => f.id === userId)
        
        if (follower.isFollowing) {
          await updateDoc(userRef, {
            following: arrayRemove(userId)
          })
        } else {
          await updateDoc(userRef, {
            following: arrayUnion(userId)
          })
        }
        
        follower.isFollowing = !follower.isFollowing
      },
      async submitPost() {
        if (!this.newPostContent.trim()) return
        
        const post = {
          content: this.newPostContent,
          userId: auth.currentUser.uid,
          likes: [],
          comments: [],
          createdAt: serverTimestamp()
        }
        
        // Add post to Firestore
        const docRef = await addDoc(collection(db, 'posts'), post)
        
        // Update local state
        this.communityPosts.unshift({
          ...post,
          id: docRef.id,
          user: {
            id: auth.currentUser.uid,
            name: this.user.displayName,
            avatar: this.user.photoURL
          },
          isLiked: false,
          showComments: false,
          newComment: ''
        })
        
        this.newPostContent = ''
        this.showPostModal = false
      },
      initCharts() {
        // Skills Chart
        const skillsCtx = this.$refs.skillsChart?.getContext('2d')
        if (skillsCtx) {
          new Chart(skillsCtx, {
            type: 'doughnut',
            data: {
              labels: this.topSkills.map(skill => skill.name),
              datasets: [{
                data: this.topSkills.map(skill => skill.level),
                backgroundColor: this.chartColors,
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
          })
        }
        
        // Activity Chart
        const activityCtx = this.$refs.activityChart?.getContext('2d')
        if (activityCtx) {
          new Chart(activityCtx, {
            type: 'bar',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              datasets: [{
                label: 'Activities',
                data: [12, 19, 15, 24, 18, 22, 27],
                backgroundColor: '#4e73df',
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
          })
        }
      },
      formatDate(date) {
        if (!date) return ''
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return date.toDate().toLocaleDateString('en-US', options)
      },
      formatTime(timestamp) {
        if (!timestamp) return ''
        const options = { hour: '2-digit', minute: '2-digit' }
        return timestamp.toDate().toLocaleTimeString('en-US', options)
      },
      progressCircleStyle(progress) {
        return {
          'background': `conic-gradient(#4e73df ${progress}%, #eee ${progress}%)`
        }
      },
      openPostModal() {
        this.showPostModal = true
      },
      closePostModal() {
        this.showPostModal = false
      },
      focusComment(postId) {
        const post = this.communityPosts.find(p => p.id === postId)
        if (post) {
          post.showComments = true
          this.$nextTick(() => {
            const input = this.$el.querySelector(`#post-${postId} .comment-input input`)
            if (input) input.focus()
          })
        }
      },
      viewAllProjects() {
        this.$router.push('/projects')
      },
      viewAllSkills() {
        this.$router.push('/skills')
      },
      viewAllObjectives() {
        this.$router.push('/objectives')
      },
      viewAllCommunity() {
        this.$router.push('/community')
      },
      viewAllActivity() {
        this.$router.push('/activities')
      },
      viewAllFollowers() {
        this.$router.push('/followers')
      }
    }
  }
  </script>
  
  <style scoped>
  /* Dashboard Layout */
  .dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f5f7fa;
  }
  
  /* Sidebar Styles */
  .sidebar {
    width: 280px;
    background: #2c3e50;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 15px;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .user-info h3 {
    margin: 0;
    font-size: 1.2rem;
    text-align: center;
  }
  
  .user-info p {
    margin: 5px 0 15px;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .profile-stats {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 20px 0;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    border-radius: 5px;
    margin-bottom: 5px;
    transition: all 0.3s;
  }
  
  .menu-item i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }
  
  .menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .menu-item.active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .badge {
    margin-left: auto;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 10px;
  }
  
  .badge-primary {
    background: #4e73df;
  }
  
  /* Main Content Styles */
  .main-content {
    flex: 1;
    padding: 20px;
  }
  
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .dashboard-header h1 {
    margin: 0;
    color: #2c3e50;
  }
  
  .header-actions {
    display: flex;
    gap: 10px;
  }
  
  .btn-notification, .btn-search {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    position: relative;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #e74c3c;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .card h3 {
    margin-top: 0;
    color: #2c3e50;
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
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: #7f8c8d;
  }
  
  .card-link {
    display: block;
    text-align: right;
    color: #3498db;
    text-decoration: none;
    font-size: 0.9rem;
  }
  
  /* Dashboard Cards */
  .dashboard-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
  }
  
  .card-header {
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-header h3 {
    margin: 0;
    font-size: 1.1rem;
  }
  
  .card-actions .btn-action {
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
  }
  
  .card-body {
    padding: 20px;
  }
  
  /* Project Timeline */
  .project-timeline {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .project-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .project-info h4 {
    margin: 0 0 5px;
  }
  
  .project-info p {
    margin: 0 0 10px;
    color: #666;
    font-size: 0.9rem;
  }
  
  .project-meta {
    display: flex;
    gap: 15px;
    font-size: 0.8rem;
    color: #888;
  }
  
  .project-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .progress-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .project-status {
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 12px;
    text-transform: capitalize;
  }
  
  .project-status.in-progress {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  /* Skills Chart */
  .skills-chart {
    height: 200px;
    margin-bottom: 15px;
  }
  
  .skills-legend {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 8px;
  }
  
  .legend-value {
    margin-left: auto;
    font-weight: bold;
  }
  
  /* Timeline */
  .timeline-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .timeline-item {
    display: flex;
    gap: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .timeline-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .timeline-marker {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #eee;
    margin-top: 3px;
    position: relative;
  }
  
  .timeline-marker:after {
    content: '';
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% - 20px);
    background: #eee;
  }
  
  .timeline-item:last-child .timeline-marker:after {
    display: none;
  }
  
  .timeline-marker.completed {
    background: #4CAF50;
  }
  
  .timeline-marker.in-progress {
    background: #FFC107;
  }
  
  .timeline-content {
    flex: 1;
  }
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  
  .timeline-header h4 {
    margin: 0;
  }
  
  .timeline-date {
    font-size: 0.8rem;
    color: #888;
  }
  
  .timeline-progress {
    height: 4px;
    background: #eee;
    border-radius: 2px;
    margin: 10px 0;
    overflow: hidden;
  }
  
  .timeline-progress .progress-bar {
    height: 100%;
    background: #4e73df;
  }
  
  .timeline-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
  }
  
  .priority {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: bold;
  }
  
  .priority.high {
    background: #ffebee;
    color: #f44336;
  }
  
  .priority.medium {
    background: #fff8e1;
    color: #ff9800;
  }
  
  .priority.low {
    background: #e8f5e9;
    color: #4CAF50;
  }
  
  /* Community Feed */
  .community-feed {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .post-composer {
    display: flex;
    gap: 10px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .composer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .composer-input {
    flex: 1;
  }
  
  .composer-input input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: white;
  }
  
  .community-post {
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .post-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .post-user h4 {
    margin: 0;
    font-size: 1rem;
  }
  
  .post-time {
    font-size: 0.8rem;
    color: #888;
  }
  
  .post-content {
    margin-bottom: 15px;
  }
  
  .post-image {
    margin-top: 10px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .post-image img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
  }
  
  .post-actions {
    display: flex;
    gap: 15px;
    padding-top: 10px;
    border-top: 1px solid #eee;
  }
  
  .btn-like, .btn-comment, .btn-share {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
  }
  
  .btn-like.liked {
    color: #e91e63;
  }
  
  .post-comments {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
  
  .comment-item {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  
  .comment-content {
    flex: 1;
  }
  
  .comment-header {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .comment-user {
    font-weight: bold;
    font-size: 0.9rem;
  }
  
  .comment-time {
    font-size: 0.7rem;
    color: #888;
  }
  
  .comment-input {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .comment-input input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
  }
  
  /* Followers List */
  .followers-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .follower-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border-radius: 8px;
    background: #f9f9f9;
  }
  
  .follower-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .follower-info h4 {
    margin: 0;
    font-size: 1rem;
  }
  
  .follower-info p {
    margin: 0;
    font-size: 0.8rem;
    color: #888;
  }
  
  .btn-follow {
    margin-left: auto;
    padding: 5px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: white;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .btn-follow.following {
    background: #4e73df;
    color: white;
    border-color: #4e73df;
  }
  
  /* Activity Stats */
  .activity-stats {
    display: flex;
    gap: 20px;
  }
  
  .stats-chart {
    flex: 2;
    height: 200px;
  }
  
  .stats-summary {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .stat-item {
    text-align: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4e73df;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #666;
  }
  
  /* Responsive Design */
  @media (max-width: 1200px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
    
    .sidebar {
      width: 80px;
      padding: 10px;
    }
    
    .user-profile, .user-info p, .stat-label, .menu-item span {
      display: none;
    }
    
    .menu-item {
      justify-content: center;
      padding: 12px 5px;
    }
    
    .menu-item i {
      margin-right: 0;
    }
    
    .badge {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    .overview-cards {
      grid-template-columns: 1fr 1fr;
    }
    
    .activity-stats {
      flex-direction: column;
    }
  }
  
  @media (max-width: 576px) {
    .overview-cards {
      grid-template-columns: 1fr;
    }
    
    .project-item {
      flex-direction: column;
      gap: 10px;
    }
  }
  </style>