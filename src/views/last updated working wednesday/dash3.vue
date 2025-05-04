<template>
    <div class="dashboard-container">
      <!-- Side Navigation -->
      <nav class="sidenav">
        <div class="sidenav-header">
          <div class="user-profile">
            <img :src="user.avatar || 'https://ui-avatars.com/api/?name='+user.name" class="profile-avatar">
            <div class="profile-info">
              <h3>{{ user.name }}</h3>
              <p>{{ user.title }}</p>
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
            <h1>Dashboard Overview</h1>
            <div class="breadcrumbs">
              <span>Home</span>
              <span class="divider">/</span>
              <span class="active">Dashboard</span>
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
                <img :src="user.avatar || 'https://ui-avatars.com/api/?name='+user.name" class="user-avatar">
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
        
        <!-- Notification Panel -->
        <div class="notification-panel" v-if="showNotificationPanel">
          <div class="notification-header">
            <h3>Notifications ({{ notifications.total }})</h3>
            <button class="btn-close" @click="toggleNotifications">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="notification-list">
            <div v-for="notification in notificationList" :key="notification.id" 
                 class="notification-item" :class="{ unread: !notification.read }">
              <div class="notification-icon">
                <i :class="notification.icon"></i>
              </div>
              <div class="notification-content">
                <p>{{ notification.message }}</p>
                <span class="notification-time">{{ formatTime(notification.time) }}</span>
              </div>
              <button class="btn-dismiss" @click="dismissNotification(notification.id)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div class="notification-footer">
            <button class="btn-mark-all" @click="markAllAsRead">
              Mark all as read
            </button>
          </div>
        </div>
        
        <!-- Dashboard Content -->
        <div class="dashboard-content">
          <!-- Summary Cards -->
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-icon bg-primary">
                <i class="fas fa-project-diagram"></i>
              </div>
              <div class="card-content">
                <h3>Active Projects</h3>
                <div class="card-value">{{ projectStats.active }}</div>
                <div class="card-progress">
                  <div class="progress-bar" :style="{ width: projectStats.completionRate + '%' }"></div>
                </div>
                <div class="card-meta">
                  <span>{{ projectStats.completed }} completed</span>
                  <span>{{ projectStats.completionRate }}%</span>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="card-icon bg-success">
                <i class="fas fa-code"></i>
              </div>
              <div class="card-content">
                <h3>Skills Mastered</h3>
                <div class="card-value">{{ skillStats.mastered }}</div>
                <div class="card-progress">
                  <div class="progress-bar" :style="{ width: skillStats.masteryRate + '%' }"></div>
                </div>
                <div class="card-meta">
                  <span>{{ skillStats.learning }} learning</span>
                  <span>{{ skillStats.masteryRate }}%</span>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="card-icon bg-warning">
                <i class="fas fa-bullseye"></i>
              </div>
              <div class="card-content">
                <h3>Objectives</h3>
                <div class="card-value">{{ objectiveStats.completed }}</div>
                <div class="card-progress">
                  <div class="progress-bar" :style="{ width: objectiveStats.completionRate + '%' }"></div>
                </div>
                <div class="card-meta">
                  <span>{{ objectiveStats.inProgress }} in progress</span>
                  <span>{{ objectiveStats.completionRate }}%</span>
                </div>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="card-icon bg-info">
                <i class="fas fa-users"></i>
              </div>
              <div class="card-content">
                <h3>Community</h3>
                <div class="card-value">{{ communityStats.posts }}</div>
                <div class="card-progress">
                  <div class="progress-bar" :style="{ width: communityStats.engagementRate + '%' }"></div>
                </div>
                <div class="card-meta">
                  <span>{{ communityStats.followers }} followers</span>
                  <span>{{ communityStats.engagementRate }}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Main Dashboard Grid -->
          <div class="dashboard-grid">
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
      </main>
      
      <!-- Post Modal -->
      <div class="modal-overlay" v-if="showPostModal" @click.self="closePostModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Create Post</h3>
            <button class="btn-close" @click="closePostModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="post-composer">
              <img :src="user.avatar || 'https://ui-avatars.com/api/?name='+user.name" class="composer-avatar">
              <div class="composer-input">
                <textarea v-model="newPostContent" placeholder="What's on your mind?"></textarea>
              </div>
            </div>
            
            <div class="post-options">
              <label class="option-item">
                <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;">
                <i class="fas fa-image"></i> Photo
              </label>
              <label class="option-item">
                <i class="fas fa-video"></i> Video
              </label>
              <label class="option-item">
                <i class="fas fa-link"></i> Link
              </label>
            </div>
            
            <div v-if="postImage" class="post-preview">
              <img :src="postImage" class="preview-image">
              <button class="btn-remove" @click="removeImage">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="closePostModal">Cancel</button>
            <button class="btn-post" @click="submitPost" :disabled="!newPostContent">Post</button>
          </div>
        </div>
      </div>
      
      
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js';
  import { ref, onMounted, computed } from 'vue';
  
  export default {
    name: 'ProfessionalDashboard',
    setup() {
      Chart.register(...registerables);
      
      // User data
      const user = ref({
        id: 'user1',
        name: 'Alex Johnson',
        title: 'Senior Developer',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        email: 'alex.johnson@example.com',
        joinDate: '2022-01-15'
      });
      
      const userStats = ref({
        followers: 124,
        following: 86,
        projects: 15,
        skills: 28
      });
      
      // Project data
      const projectStats = ref({
        active: 5,
        completed: 10,
        completionRate: 67
      });
      
      const activeProjects = ref([
        {
          id: 'proj1',
          name: 'Portfolio Website Redesign',
          description: 'Complete redesign of personal portfolio with new features',
          deadline: '2023-06-15',
          progress: 75,
          status: 'in-progress',
          team: ['user2', 'user3']
        },
        {
          id: 'proj2',
          name: 'Mobile App Development',
          description: 'Build a cross-platform mobile application for task management',
          deadline: '2023-07-30',
          progress: 30,
          status: 'in-progress',
          team: ['user4', 'user5']
        },
        {
          id: 'proj3',
          name: 'API Integration Project',
          description: 'Integrate third-party APIs into existing system',
          deadline: '2023-05-20',
          progress: 90,
          status: 'almost-done',
          team: ['user6']
        }
      ]);
      
      // Skills data
      const skillStats = ref({
        mastered: 12,
        learning: 8,
        masteryRate: 60
      });
      
      const topSkills = ref([
        { id: 'skill1', name: 'Vue.js', level: 90 },
        { id: 'skill2', name: 'JavaScript', level: 85 },
        { id: 'skill3', name: 'CSS/SASS', level: 80 },
        { id: 'skill4', name: 'Node.js', level: 75 },
        { id: 'skill5', name: 'UI/UX Design', level: 70 }
      ]);
      
      // Objectives data
      const objectiveStats = ref({
        completed: 8,
        inProgress: 4,
        completionRate: 67
      });
      
      const recentObjectives = ref([
        {
          id: 'obj1',
          title: 'Learn Advanced Vue Patterns',
          description: 'Master advanced Vue.js concepts like composition API, state management, etc.',
          deadline: '2023-05-30',
          progress: 60,
          status: 'in-progress',
          priority: 'high'
        },
        {
          id: 'obj2',
          title: 'Complete Certification',
          description: 'Finish the advanced JavaScript certification course',
          deadline: '2023-06-15',
          progress: 30,
          status: 'in-progress',
          priority: 'medium'
        },
        {
          id: 'obj3',
          title: 'Build Personal Project',
          description: 'Develop a side project to showcase new skills',
          deadline: '2023-04-28',
          progress: 100,
          status: 'completed',
          priority: 'low'
        }
      ]);
      
      // Community data
      const communityStats = ref({
        posts: 24,
        followers: 124,
        engagementRate: 78
      });
      
      const communityPosts = ref([
        {
          id: 'post1',
          user: {
            id: 'user2',
            name: 'Sarah Miller',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          content: 'Just published my new article about Vue 3 composition API best practices. Check it out and let me know what you think!',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
          time: '2023-04-15T10:30:00',
          likes: 12,
          isLiked: false,
          comments: [
            {
              id: 'comment1',
              user: {
                id: 'user3',
                name: 'Mike Chen',
                avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
              },
              text: 'Great article! Especially liked the section about reactive patterns.',
              time: '2023-04-15T11:15:00'
            },
            {
              id: 'comment2',
              user: {
                id: 'user4',
                name: 'Emma Wilson',
                avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
              },
              text: 'Would love to see more examples of state management with the composition API.',
              time: '2023-04-15T12:30:00'
            }
          ],
          showComments: false,
          newComment: ''
        },
        {
          id: 'post2',
          user: {
            id: 'user5',
            name: 'David Kim',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
          },
          content: 'Looking for recommendations for the best JavaScript testing frameworks in 2023. What are you all using?',
          time: '2023-04-14T15:45:00',
          likes: 8,
          isLiked: true,
          comments: [
            {
              id: 'comment3',
              user: {
                id: 'user6',
                name: 'Lisa Wong',
                avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
              },
              text: 'I switched to Vitest recently and love it! Much faster than Jest.',
              time: '2023-04-14T16:20:00'
            }
          ],
          showComments: true,
          newComment: ''
        }
      ]);
      
      // Activity data
      const activityStats = ref({
        weekly: 18,
        monthly: 72,
        total: 245
      });
      
      // Followers data
      const recentFollowers = ref([
        {
          id: 'follower1',
          name: 'Jennifer Lopez',
          title: 'Frontend Developer',
          avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
          isFollowing: false
        },
        {
          id: 'follower2',
          name: 'Robert Smith',
          title: 'UX Designer',
          avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
          isFollowing: true
        },
        {
          id: 'follower3',
          name: 'Amanda Johnson',
          title: 'Full Stack Developer',
          avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
          isFollowing: false
        }
      ]);
      
      // Notifications
      const notifications = ref({
        total: 5,
        messages: 2,
        community: 3
      });
      
      const notificationList = ref([
        {
          id: 'notif1',
          message: 'Sarah Miller commented on your post',
          icon: 'fas fa-comment',
          time: '2023-04-15T11:15:00',
          read: false
        },
        {
          id: 'notif2',
          message: 'You have a new follower - Jennifer Lopez',
          icon: 'fas fa-user-plus',
          time: '2023-04-15T09:30:00',
          read: false
        },
        {
          id: 'notif3',
          message: 'Your project "Portfolio Redesign" is due in 5 days',
          icon: 'fas fa-calendar-exclamation',
          time: '2023-04-14T14:20:00',
          read: true
        },
        {
          id: 'notif4',
          message: 'Mike Chen mentioned you in a post',
          icon: 'fas fa-at',
          time: '2023-04-14T10:45:00',
          read: true
        },
        {
          id: 'notif5',
          message: 'New message from Emma Wilson',
          icon: 'fas fa-envelope',
          time: '2023-04-13T16:10:00',
          read: true
        }
      ]);
      
      // UI states
      const showDropdown = ref(false);
      const showNotificationPanel = ref(false);
      const showPostModal = ref(false);
      const showUpgradeModal = ref(false);
      
      // Post modal data
      const newPostContent = ref('');
      const postImage = ref(null);
      const fileInput = ref(null);
      
      // Chart colors
      const chartColors = [
        '#4e73df',
        '#1cc88a',
        '#36b9cc',
        '#f6c23e',
        '#e74a3b'
      ];
      
      // Chart refs
      const skillsChart = ref(null);
      const activityChart = ref(null);
      
      // Methods
      const toggleUserDropdown = () => {
        showDropdown.value = !showDropdown.value;
      };
      
      const toggleNotifications = () => {
        showNotificationPanel.value = !showNotificationPanel.value;
      };
      
      const dismissNotification = (id) => {
        notificationList.value = notificationList.value.filter(n => n.id !== id);
        notifications.value.total = notificationList.value.filter(n => !n.read).length;
      };
      
      const markAllAsRead = () => {
        notificationList.value.forEach(n => n.read = true);
        notifications.value.total = 0;
      };
      
      const formatTime = (timeString) => {
        const now = new Date();
        const time = new Date(timeString);
        const diff = now - time;
        
        // If less than a minute ago
        if (diff < 60000) return 'Just now';
        
        // If less than an hour ago
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        
        // If less than a day ago
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        
        // Otherwise show date
        return time.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
      
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
      };
      
      const progressCircleStyle = (progress) => {
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (progress / 100) * circumference;
        
        return {
          'background': `conic-gradient(${getProgressColor(progress)} ${progress}%, #eee ${progress}%)`
        };
      };
      
      const getProgressColor = (progress) => {
        if (progress >= 80) return '#1cc88a';
        if (progress >= 50) return '#f6c23e';
        return '#e74a3b';
      };
      
      const toggleLike = (postId) => {
        const post = communityPosts.value.find(p => p.id === postId);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likes += post.isLiked ? 1 : -1;
        }
      };
      
      const focusComment = (postId) => {
        const post = communityPosts.value.find(p => p.id === postId);
        if (post) {
          post.showComments = true;
        }
      };
      
      const addComment = (postId) => {
        const post = communityPosts.value.find(p => p.id === postId);
        if (post && post.newComment.trim()) {
          post.comments.push({
            id: `comment${Date.now()}`,
            user: {
              id: user.value.id,
              name: user.value.name,
              avatar: user.value.avatar
            },
            text: post.newComment,
            time: new Date().toISOString()
          });
          post.newComment = '';
        }
      };
      
      const toggleFollow = (followerId) => {
        const follower = recentFollowers.value.find(f => f.id === followerId);
        if (follower) {
          follower.isFollowing = !follower.isFollowing;
          userStats.value.following += follower.isFollowing ? 1 : -1;
        }
      };
      
      const openPostModal = () => {
        showPostModal.value = true;
      };
      
      const closePostModal = () => {
        showPostModal.value = false;
        newPostContent.value = '';
        postImage.value = null;
      };
      
      const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            postImage.value = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
      
      const removeImage = () => {
        postImage.value = null;
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      };
      
      const submitPost = () => {
        if (newPostContent.value.trim()) {
          communityPosts.value.unshift({
            id: `post${Date.now()}`,
            user: {
              id: user.value.id,
              name: user.value.name,
              avatar: user.value.avatar
            },
            content: newPostContent.value,
            image: postImage.value,
            time: new Date().toISOString(),
            likes: 0,
            isLiked: false,
            comments: [],
            showComments: false,
            newComment: ''
          });
          
          communityStats.value.posts += 1;
          closePostModal();
        }
      };
      
      const showUpgradeModalFn = () => {
        showUpgradeModal.value = true;
      };
      
      const closeUpgradeModal = () => {
        showUpgradeModal.value = false;
      };
      
      const logout = () => {
        console.log('Logging out...');
        // Implement actual logout logic
      };
      
      const viewAllProjects = () => {
        console.log('View all projects');
      };
      
      const viewAllSkills = () => {
        console.log('View all skills');
      };
      
      const viewAllObjectives = () => {
        console.log('View all objectives');
      };
      
      const viewAllCommunity = () => {
        console.log('View all community');
      };
      
      const viewAllActivity = () => {
        console.log('View all activity');
      };
      
      const viewAllFollowers = () => {
        console.log('View all followers');
      };
      
      // Initialize charts
      onMounted(() => {
        // Skills Chart (Doughnut)
        new Chart(skillsChart.value, {
          type: 'doughnut',
          data: {
            labels: topSkills.value.map(skill => skill.name),
            datasets: [{
              data: topSkills.value.map(skill => skill.level),
              backgroundColor: chartColors,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
        
        // Activity Chart (Line)
        new Chart(activityChart.value, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
              label: 'Activities',
              data: [12, 19, 15, 24, 18, 22, 27],
              fill: true,
              backgroundColor: 'rgba(78, 115, 223, 0.05)',
              borderColor: '#4e73df',
              tension: 0.4,
              pointBackgroundColor: '#4e73df',
              pointBorderColor: '#fff',
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#4e73df',
              pointHoverBorderColor: '#fff',
              pointHitRadius: 10,
              pointBorderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      });
      
      return {
        user,
        userStats,
        projectStats,
        activeProjects,
        skillStats,
        topSkills,
        objectiveStats,
        recentObjectives,
        communityStats,
        communityPosts,
        activityStats,
        recentFollowers,
        notifications,
        notificationList,
        showDropdown,
        showNotificationPanel,
        showPostModal,
        showUpgradeModal,
        newPostContent,
        postImage,
        fileInput,
        chartColors,
        skillsChart,
        activityChart,
        toggleUserDropdown,
        toggleNotifications,
        dismissNotification,
        markAllAsRead,
        formatTime,
        formatDate,
        progressCircleStyle,
        toggleLike,
        focusComment,
        addComment,
        toggleFollow,
        openPostModal,
        closePostModal,
        handleFileUpload,
        removeImage,
        submitPost,
        showUpgradeModal: showUpgradeModalFn,
        closeUpgradeModal,
        logout,
        viewAllProjects,
        viewAllSkills,
        viewAllObjectives,
        viewAllCommunity,
        viewAllActivity,
        viewAllFollowers
      };
    }
  };
  </script>
  
  <style scoped>
  /* Base Styles */
  :root {
    --primary: #4e73df;
    --primary-light: rgba(78, 115, 223, 0.1);
    --secondary: #858796;
    --success: #1cc88a;
    --info: #36b9cc;
    --warning: #f6c23e;
    --danger: #e74a3b;
    --light: #f8f9fc;
    --dark: #5a5c69;
    --gray-100: #f8f9fc;
    --gray-200: #eaecf4;
    --gray-300: #dddfeb;
    --gray-400: #d1d3e2;
    --gray-500: #b7b9cc;
    --gray-600: #858796;
    --gray-700: #6e707e;
    --gray-800: #5a5c69;
    --gray-900: #3a3b45;
    --font-sans: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    --shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
    --shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: var(--font-sans);
    color: var(--gray-800);
    background-color: var(--gray-100);
  }
  
  .dashboard-container {
    display: flex;
    min-height: 100vh;
  }
  
  /* Side Navigation */
  .sidenav {
    width: 250px;
    background: white;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    z-index: 10;
  }
  
  .sidenav-header {
    padding: 1.5rem 1rem;
    border-bottom: 1px solid var(--gray-200);
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
    margin-bottom: 1rem;
    border: 4px solid var(--gray-200);
  }
  
  .profile-info h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .profile-info p {
    color: var(--gray-600);
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  
  .profile-stats {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font-weight: 700;
    color: var(--primary);
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: var(--gray-600);
  }
  
  .sidenav-menu {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: var(--gray-700);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
    position: relative;
  }
  
  .menu-item i {
    margin-right: 0.5rem;
    width: 20px;
    text-align: center;
    font-size: 0.9rem;
  }
  
  .menu-item:hover {
    color: var(--primary);
    background-color: var(--primary-light);
  }
  
  .menu-item.active {
    color: var(--primary);
    background-color: var(--primary-light);
    border-left: 3px solid var(--primary);
  }
  
  .badge {
    margin-left: auto;
    background-color: var(--gray-200);
    color: var(--gray-700);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 10rem;
  }
  
  .badge-primary {
    background-color: var(--primary);
    color: white;
  }
  
  .sidenav-footer {
    padding: 1rem;
    border-top: 1px solid var(--gray-200);
  }
  
  .btn-upgrade {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(to right, #f6c23e, #e74a3b);
    color: white;
    border: none;
    border-radius: 0.35rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .btn-upgrade:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  /* Main Content */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--gray-100);
  }
  
  .main-header {
    background-color: white;
    box-shadow: var(--shadow-sm);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 5;
  }
  
  .header-left h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 0.25rem;
  }
  
  .breadcrumbs {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: var(--gray-600);
  }
  
  .breadcrumbs .divider {
    margin: 0 0.5rem;
  }
  
  .breadcrumbs .active {
    color: var(--primary);
    font-weight: 600;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .search-box {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-box i {
    position: absolute;
    left: 1rem;
    color: var(--gray-500);
  }
  
  .search-box input {
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid var(--gray-300);
    border-radius: 0.35rem;
    font-size: 0.9rem;
    width: 200px;
    transition: all 0.2s;
  }
  
  .search-box input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem var(--primary-light);
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .btn-notification {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--gray-100);
    border: none;
    color: var(--gray-600);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-notification:hover {
    background-color: var(--gray-200);
    color: var(--gray-900);
  }
  
  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: var(--danger);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .user-dropdown {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    position: relative;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-dropdown i {
    font-size: 0.8rem;
    color: var(--gray-600);
    transition: transform 0.2s;
  }
  
  .user-dropdown:hover i {
    color: var(--gray-900);
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border-radius: 0.35rem;
    box-shadow: var(--shadow);
    min-width: 200px;
    padding: 0.5rem 0;
    z-index: 100;
    display: none;
  }
  
  .user-dropdown:hover .dropdown-menu {
    display: block;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    color: var(--gray-700);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  
  .dropdown-item i {
    margin-right: 0.5rem;
    width: 20px;
    text-align: center;
  }
  
  .dropdown-item:hover {
    background-color: var(--gray-100);
    color: var(--primary);
  }
  
  .dropdown-divider {
    height: 1px;
    background-color: var(--gray-200);
    margin: 0.5rem 0;
  }
  
  /* Notification Panel */
  .notification-panel {
    position: fixed;
    top: 80px;
    right: 20px;
    width: 350px;
    background-color: white;
    border-radius: 0.35rem;
    box-shadow: var(--shadow-lg);
    z-index: 1050;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--gray-200);
  }
  
  .notification-header h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
  }
  
  .btn-close {
    background: none;
    border: none;
    color: var(--gray-600);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0.25rem;
  }
  
  .btn-close:hover {
    color: var(--gray-900);
  }
  
  .notification-list {
    flex: 1;
    overflow-y: auto;
  }
  
  .notification-item {
    display: flex;
    padding: 1rem;
    border-bottom: 1px solid var(--gray-200);
    transition: all 0.2s;
    position: relative;
  }
  
  .notification-item.unread {
    background-color: var(--primary-light);
  }
  
  .notification-item:hover {
    background-color: var(--gray-100);
  }
  
  .notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--gray-200);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    color: var(--primary);
    flex-shrink: 0;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-content p {
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }
  
  .notification-time {
    font-size: 0.75rem;
    color: var(--gray-600);
  }
  
  .btn-dismiss {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--gray-500);
    cursor: pointer;
    font-size: 0.8rem;
    opacity: 0;
    transition: all 0.2s;
  }
  
  .notification-item:hover .btn-dismiss {
    opacity: 1;
  }
  
  .btn-dismiss:hover {
    color: var(--danger);
  }
  
  .notification-footer {
    padding: 1rem;
    border-top: 1px solid var(--gray-200);
    text-align: center;
  }
  
  .btn-mark-all {
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .btn-mark-all:hover {
    text-decoration: underline;
  }
  
  /* Dashboard Content */
  .dashboard-content {
    flex: 1;
    padding: 1.5rem;
  }
  
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .summary-card {
    background-color: white;
    border-radius: 0.35rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    transition: all 0.2s;
  }
  
  .summary-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow);
  }
  
  .card-icon {
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    color: white;
    border-top-left-radius: 0.35rem;
    border-bottom-left-radius: 0.35rem;
  }
  
  .bg-primary {
    background-color: var(--primary);
  }
  
  .bg-success {
    background-color: var(--success);
  }
  
  .bg-warning {
    background-color: var(--warning);
  }
  
  .bg-info {
    background-color: var(--info);
  }
  
  .card-content {
    flex: 1;
    padding: 1.25rem;
  }
  
  .card-content h3 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--gray-600);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  
  .card-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 0.75rem;
  }
  
  .card-progress {
    height: 4px;
    background-color: var(--gray-200);
    border-radius: 2px;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background-color: var(--success);
    border-radius: 2px;
  }
  
  .card-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: var(--gray-600);
  }
  
  /* Dashboard Grid */
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;
  }
  
  .dashboard-card {
    background-color: white;
    border-radius: 0.35rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
  }
  
  .dashboard-card:nth-child(1) {
    grid-column: span 8;
  }
  
  .dashboard-card:nth-child(2) {
    grid-column: span 4;
  }
  
  .dashboard-card:nth-child(3) {
    grid-column: span 6;
  }
  
  .dashboard-card:nth-child(4) {
    grid-column: span 6;
  }
  
  .dashboard-card:nth-child(5) {
    grid-column: span 8;
  }
  
  .dashboard-card:nth-child(6) {
    grid-column: span 4;
  }
  
  .card-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-header h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
  }
  
  .card-actions .btn-action {
    background: none;
    border: none;
    color: var(--gray-600);
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem;
  }
  
  .card-actions .btn-action:hover {
    color: var(--gray-900);
  }
  
  .card-body {
    flex: 1;
    padding: 1.25rem;
    overflow-y: auto;
  }
  
  /* Projects Progress */
  .project-timeline {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .project-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 0.35rem;
    background-color: var(--gray-100);
    transition: all 0.2s;
  }
  
  .project-item:hover {
    background-color: var(--gray-200);
  }
  
  .project-info h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .project-info p {
    font-size: 0.85rem;
    color: var(--gray-600);
    margin-bottom: 0.5rem;
  }
  
  .project-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: var(--gray-600);
  }
  
  .project-meta i {
    margin-right: 0.25rem;
  }
  
  .project-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .progress-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
  }
  
  .project-status {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 10rem;
    text-transform: capitalize;
  }
  
  .project-status.in-progress {
    background-color: rgba(78, 115, 223, 0.1);
    color: var(--primary);
  }
  
  .project-status.almost-done {
    background-color: rgba(28, 200, 138, 0.1);
    color: var(--success);
  }
  
  /* Skills Chart */
  .skills-chart {
    height: 200px;
    margin-bottom: 1rem;
  }
  
  .skills-legend {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 0.5rem;
  }
  
  .legend-value {
    margin-left: auto;
    font-weight: 700;
  }
  
  /* Timeline */
  .timeline-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .timeline-item {
    display: flex;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--gray-200);
  }
  
  .timeline-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .timeline-marker {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--gray-200);
    margin-top: 0.25rem;
    flex-shrink: 0;
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
    background-color: var(--gray-200);
  }
  
  .timeline-item:last-child .timeline-marker:after {
    display: none;
  }
  
  .timeline-marker.completed {
    background-color: var(--success);
  }
  
  .timeline-marker.in-progress {
    background-color: var(--primary);
  }
  
  .timeline-content {
    flex: 1;
  }
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .timeline-header h4 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
  }
  
  .timeline-date {
    font-size: 0.8rem;
    color: var(--gray-600);
  }
  
  .timeline-content p {
    font-size: 0.9rem;
    color: var(--gray-600);
    margin-bottom: 0.75rem;
  }
  
  .timeline-progress {
    height: 4px;
    background-color: var(--gray-200);
    border-radius: 2px;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }
  
  .timeline-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
  }
  
  .progress-text {
    color: var(--gray-600);
  }
  
  .priority {
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 10rem;
  }
  
  .priority.high {
    background-color: rgba(231, 74, 59, 0.1);
    color: var(--danger);
  }
  
  .priority.medium {
    background-color: rgba(246, 194, 62, 0.1);
    color: var(--warning);
  }
  
  .priority.low {
    background-color: rgba(54, 185, 204, 0.1);
    color: var(--info);
  }
  
  /* Community Feed */
  .community-feed {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .post-composer {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border-radius: 0.35rem;
    box-shadow: var(--shadow-sm);
  }
  
  .composer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .composer-input {
    flex: 1;
  }
  
  .composer-input input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--gray-300);
    border-radius: 2rem;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  
  .composer-input input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem var(--primary-light);
  }
  
  .community-post {
    background-color: white;
    border-radius: 0.35rem;
    box-shadow: var(--shadow-sm);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .post-header {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .post-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .post-user h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .post-time {
    font-size: 0.8rem;
    color: var(--gray-600);
  }
  
  .post-content p {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }
  
  .post-image {
    margin-top: 1rem;
    border-radius: 0.35rem;
    overflow: hidden;
  }
  
  .post-image img {
    width: 100%;
    height: auto;
    max-height: 300px;
    object-fit: cover;
  }
  
  .post-actions {
    display: flex;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--gray-200);
  }
  
  .btn-like, .btn-comment, .btn-share {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: var(--gray-600);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-like:hover, .btn-comment:hover, .btn-share:hover {
    color: var(--gray-900);
  }
  
  .btn-like.liked {
    color: var(--danger);
  }
  
  .btn-like.liked i {
    font-weight: 900;
  }
  
  .post-comments {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--gray-200);
  }
  
  .comment-item {
    display: flex;
    gap: 1rem;
  }
  
  .comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    margin-top: 0.25rem;
  }
  
  .comment-content {
    flex: 1;
  }
  
  .comment-header {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.25rem;
  }
  
  .comment-user {
    font-size: 0.9rem;
    font-weight: 700;
  }
  
  .comment-time {
    font-size: 0.75rem;
    color: var(--gray-600);
  }
  
  .comment-content p {
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .comment-input {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding-top: 0.5rem;
  }
  
  .comment-input input {
    flex: 1;
    padding: 0.5rem 1rem;
    border: 1px solid var(--gray-300);
    border-radius: 2rem;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  
  .comment-input input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem var(--primary-light);
  }
  
  /* Activity Stats */
  .activity-stats {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .stats-chart {
    height: 200px;
    margin-bottom: 1rem;
  }
  
  .stats-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    text-align: center;
    margin-top: auto;
  }
  
  .stat-item {
    padding: 1rem;
    background-color: var(--gray-100);
    border-radius: 0.35rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.85rem;
    color: var(--gray-600);
  }
  
  /* Followers List */
  .followers-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .follower-item {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border-radius: 0.35rem;
    background-color: var(--gray-100);
    transition: all 0.2s;
  }
  
  .follower-item:hover {
    background-color: var(--gray-200);
  }
  
  .follower-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .follower-info h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  
  .follower-info p {
    font-size: 0.85rem;
    color: var(--gray-600);
  }
  
  .btn-follow {
    margin-left: auto;
    padding: 0.35rem 1rem;
    border: 1px solid var(--gray-300);
    border-radius: 2rem;
    background-color: white;
    color: var(--gray-700);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-follow:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
  
  .btn-follow.following {
    background-color: var(--primary);
    border-color: var(--primary);
    color: white;
  }
  
  /* Modals */
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
    z-index: 1100;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
  }
  
  .modal-header {
    padding: 1.25rem;
    border-bottom: 1px solid var(--gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }
  
  .modal-body {
    flex: 1;
    padding: 1.25rem;
    overflow-y: auto;
  }
  
  .modal-footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--gray-200);
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
  
  .btn-cancel, .btn-post {
    padding: 0.5rem 1.25rem;
    border-radius: 0.35rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-cancel {
    background-color: var(--gray-200);
    border: 1px solid var(--gray-300);
    color: var(--gray-700);
  }
  
  .btn-cancel:hover {
    background-color: var(--gray-300);
  }
  
  .btn-post {
    background-color: var(--primary);
    border: 1px solid var(--primary);
    color: white;
  }
  
  .btn-post:hover {
    background-color: #3a5bc7;
    border-color: #3a5bc7;
  }
  
  .btn-post:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .post-options {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .option-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--gray-600);
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 0.35rem;
    transition: all 0.2s;
  }
  
  .option-item:hover {
    background-color: var(--gray-100);
    color: var(--gray-900);
  }
  
  .post-preview {
    margin-top: 1rem;
    position: relative;
    border-radius: 0.35rem;
    overflow: hidden;
  }
  
  .preview-image {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
  }
  .btn-remove {
    background-color: rgba(0, 0, 0, 0.7);
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-remove:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }

  /* Upgrade Modal */
  .upgrade-modal {
    background-color: white;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-lg);
  }

  .pricing-plans {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 1.25rem;
  }

  .plan-card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.3s;
  }

  .plan-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow);
  }

  .plan-card.featured {
    border: 2px solid var(--primary);
  }

  .plan-badge {
    position: absolute;
    top: -10px;
    right: 20px;
    background-color: var(--primary);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 1rem;
    border-radius: 10rem;
  }

  .plan-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .plan-header h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
  }

  .plan-price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
  }

  .plan-price span {
    font-size: 1rem;
    font-weight: 400;
    color: var(--gray-600);
  }

  .plan-features {
    flex: 1;
    margin-bottom: 1.5rem;
  }

  .plan-features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
  }

  .plan-features i {
    color: var(--success);
  }

  .btn-plan {
    padding: 0.75rem;
    border-radius: 0.35rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid var(--gray-300);
    background-color: white;
    color: var(--gray-700);
  }

  .btn-plan:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .btn-plan:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: var(--primary);
    border-color: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background-color: #3a5bc7;
    border-color: #3a5bc7;
    color: white;
  }

  /* Responsive Styles */
  @media (max-width: 1200px) {
    .dashboard-grid {
      grid-template-columns: repeat(6, 1fr);
    }

    .dashboard-card:nth-child(1),
    .dashboard-card:nth-child(5) {
      grid-column: span 6;
    }

    .dashboard-card:nth-child(2),
    .dashboard-card:nth-child(6) {
      grid-column: span 3;
    }

    .dashboard-card:nth-child(3),
    .dashboard-card:nth-child(4) {
      grid-column: span 3;
    }
  }

  @media (max-width: 992px) {
    .sidenav {
      width: 80px;
      overflow: hidden;
    }

    .sidenav-header,
    .sidenav-footer {
      padding: 1rem 0.5rem;
    }

    .profile-avatar {
      width: 50px;
      height: 50px;
    }

    .profile-info,
    .profile-stats,
    .menu-item span,
    .btn-upgrade span {
      display: none;
    }

    .menu-item {
      justify-content: center;
      padding: 0.75rem;
    }

    .menu-item i {
      margin-right: 0;
      font-size: 1.1rem;
    }

    .badge {
      display: none;
    }

    .main-content {
      margin-left: 80px;
    }

    .header-left h1 {
      font-size: 1.25rem;
    }

    .search-box input {
      width: 150px;
    }

    .pricing-plans {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .dashboard-card {
      grid-column: span 1 !important;
    }

    .summary-cards {
      grid-template-columns: 1fr 1fr;
    }

    .header-right {
      gap: 0.5rem;
    }

    .search-box {
      display: none;
    }

    .notification-panel {
      width: 300px;
      right: 10px;
    }
  }

  @media (max-width: 576px) {
    .summary-cards {
      grid-template-columns: 1fr;
    }

    .modal-content,
    .upgrade-modal {
      width: 95%;
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-overlay {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-content,
  .upgrade-modal,
  .notification-panel {
    animation: slideIn 0.3s ease-out;
  }

  /* Utility Classes */
  .bg-primary {
    background-color: var(--primary);
  }

  .bg-success {
    background-color: var(--success);
  }

  .bg-warning {
    background-color: var(--warning);
  }

  .bg-info {
    background-color: var(--info);
  }

  .bg-danger {
    background-color: var(--danger);
  }

  .text-primary {
    color: var(--primary);
  }

  .text-success {
    color: var(--success);
  }

  .text-warning {
    color: var(--warning);
  }

  .text-info {
    color: var(--info);
  }

  .text-danger {
    color: var(--danger);
  }
</style>
 