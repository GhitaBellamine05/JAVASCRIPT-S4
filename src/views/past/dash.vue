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
            <input type="text" placeholder="Search..." />
            <button class="search-button">
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
              <span class="notification-indicator"></span>
            </button>
          </div>
          <div class="user-menu" @click="toggleUserMenu">
            <img :src="user.photoURL || '/default-avatar.png'" alt="Profile" class="avatar" />
            <div class="user-dropdown" v-if="showUserMenu">
              <div class="user-info">
                <p class="user-name">{{ user.name }}</p>
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
            <h3 class="profile-name">{{ user.name }}</h3>
            <p class="profile-title">Software Developer</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-number">{{ userStats.projects }}</span>
                <span class="stat-label">Projects</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ userStats.skills }}</span>
                <span class="stat-label">Skills</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ userStats.followers }}</span>
                <span class="stat-label">Followers</span>
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
              Create
            </button>
          </div>
  
          <!-- Dashboard Overview Section -->
          <section class="dashboard-overview">
            <h2 class="section-title">Overview</h2>
            <div class="overview-cards">
              <div class="overview-card">
                <div class="overview-icon projects-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div class="overview-details">
                  <h3>Projects</h3>
                  <p class="overview-number">{{ userStats.projects }}</p>
                  <p class="overview-status">
                    <span class="status-increase">+2</span> this month
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
                  <p class="overview-number">{{ userStats.skills }}</p>
                  <p class="overview-status">
                    <span class="status-increase">+3</span> new skills
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
                  <p class="overview-number">{{ userStats.objectives }}</p>
                  <p class="overview-status">
                    <span class="status-completed">2 completed</span>
                  </p>
                </div>
                <router-link to="/objectives" class="overview-action">View All</router-link>
              </div>
            </div>
          </section>
  
          <!-- Community Feed Section -->
          <section class="feed-section">
            <div class="section-header">
              <h2 class="section-title">Developer Feed</h2>
              <div class="section-actions">
                <button class="filter-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Filter
                </button>
              </div>
            </div>
  
            <!-- Feed Posts -->
            <div class="feed-posts">
              <div v-for="post in communityPosts" :key="post.id" class="post-card">
                <div class="post-header">
                  <img :src="post.author.photoURL || '/default-avatar.png'" alt="Profile" class="post-avatar" />
                  <div class="post-meta">
                    <div class="post-author">{{ post.author.name }}</div>
                    <div class="post-time">{{ formatDate(post.timestamp) }}</div>
                  </div>
                  <button class="post-options">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                </div>
                
                <div class="post-content">
                  <p>{{ post.content }}</p>
                  <div v-if="post.projectId" class="project-preview">
                    <div class="project-preview-header">
                      <h4>{{ post.project.title }}</h4>
                      <span class="project-type">{{ post.project.type }}</span>
                    </div>
                    <p class="project-description">{{ post.project.description }}</p>
                    <div class="project-tech">
                      <span v-for="tech in post.project.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
                    </div>
                    <router-link :to="`/projects/${post.projectId}`" class="project-link">View Project</router-link>
                  </div>
                  <div v-if="post.imageUrl" class="post-image">
                    <img :src="post.imageUrl" alt="Post image" />
                  </div>
                </div>
                
                <div class="post-actions">
                  <button class="post-action-button" @click="likePost(post.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    <span>{{ post.likes }} Likes</span>
                  </button>
                  <button class="post-action-button" @click="focusComment(post.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <span>{{ post.comments.length }} Comments</span>
                  </button>
                  <button class="post-action-button" @click="sharePost(post.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
                
                <div class="post-comments" v-if="post.showComments">
                  <div v-for="comment in post.comments" :key="comment.id" class="comment">
                    <img :src="comment.author.photoURL || '/default-avatar.png'" alt="Profile" class="comment-avatar" />
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.author.name }}</span>
                        <span class="comment-time">{{ formatDate(comment.timestamp) }}</span>
                      </div>
                      <p class="comment-text">{{ comment.text }}</p>
                    </div>
                  </div>
                  <div class="add-comment">
                    <img :src="user.photoURL || '/default-avatar.png'" alt="Profile" class="comment-avatar" />
                    <input 
                      type="text" 
                      :ref="`comment-input-${post.id}`" 
                      placeholder="Add a comment..." 
                      v-model="commentText[post.id]" 
                      @keyup.enter="addComment(post.id)"
                    />
                    <button class="send-comment" @click="addComment(post.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
  
        <!-- Right Sidebar for upcoming events and suggested connections -->
        <aside class="right-sidebar">
          <!-- Upcoming Events -->
          <section class="events-section">
            <h3 class="sidebar-title">Upcoming Events</h3>
            <div class="events-list">
              <div class="event-card">
                <div class="event-date">
                  <span class="event-month">May</span>
                  <span class="event-day">15</span>
                </div>
                <div class="event-details">
                  <h4 class="event-title">Frontend Developers Meetup</h4>
                  <p class="event-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Online
                  </p>
                  <button class="event-register">Register</button>
                </div>
              </div>
              <div class="event-card">
                <div class="event-date">
                  <span class="event-month">May</span>
                  <span class="event-day">22</span>
                </div>
                <div class="event-details">
                  <h4 class="event-title">Web3 Development Workshop</h4>
                  <p class="event-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Tech Hub, San Francisco
                  </p>
                  <button class="event-register">Register</button>
                </div>
              </div>
            </div>
            <a href="/events" class="see-all-link">See all events</a>
          </section>
  
          <!-- Suggested Connections -->
          <section class="connections-section">
            <h3 class="sidebar-title">People You May Know</h3>
            <div class="connections-list">
              <div v-for="connection in suggestedConnections" :key="connection.id" class="connection-card">
                <img :src="connection.photoURL || '/default-avatar.png'" alt="Profile" class="connection-avatar" />
                <div class="connection-info">
                  <h4 class="connection-name">{{ connection.name }}</h4>
                  <p class="connection-title">{{ connection.title }}</p>
                </div>
                <button class="connect-button">Connect</button>
              </div>
            </div>
            <a href="/network/suggestions" class="see-all-link">See more</a>
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
                  <h4>Modern JavaScript for Beginners</h4>
                  <p>Comprehensive guide to ES6+ features</p>
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
                  <p>Learn advanced patterns and techniques</p>
                </div>
              </a>
            </div>
          </section>
        </aside>
      </div>
  
      <!-- New Post Modal -->
      <div class="modal-overlay" v-if="showNewPostModal" @click="showNewPostModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Create Post</h3>
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
                :class="{ 'active': newPostType === 'post' }" 
                @click="newPostType = 'post'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Post
              </button>
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
                :class="{ 'active': newPostType === 'activity' }" 
                @click="newPostType = 'activity'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Activity
              </button>
            </div>
            
            <!-- Common Text Input -->
            <div class="post-text-input">
              <textarea 
                v-model="newPostContent" 
                placeholder="What's on your mind?" 
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
                  placeholder="e.g. Vue.js, Firebase, Tailwind CSS (comma separated)" 
                />
              </div>
              
              <div class="input-group">
                <label for="project-type">Project Type</label>
                <select id="project-type" v-model="newProject.type">
                  <option value="Web Application">Web Application</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="API">API</option>
                  <option value="Library/Package">Library/Package</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <!-- Activity Fields -->
            <div v-if="newPostType === 'activity'" class="activity-fields">
              <div class="input-group">
                <label for="activity-type">Activity Type</label>
                <select id="activity-type" v-model="newActivity.type">
                  <option value="Learning">Learning</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Milestone">Milestone</option>
                  <option value="Other">Other</option>
                </select>
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
            <button class="attachment-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Location
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showNewPostModal = false">Cancel</button>
          <button class="post-button" @click="createNewPost">Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeveloperDashboard',
  data() {
    return {
      user: {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        photoURL: '/profile-avatar.jpg'
      },
      userStats: {
        projects: 12,
        skills: 24,
        objectives: 8,
        followers: 156
      },
      showUserMenu: false,
      communityPosts: [
        {
          id: 1,
          author: {
            name: 'Sarah Parker',
            photoURL: '/avatar-sarah.jpg'
          },
          content: 'Just launched my new portfolio website using Vue.js and TailwindCSS! Check it out and let me know what you think.',
          timestamp: new Date(2025, 3, 25, 14, 30),
          likes: 28,
          comments: [
            {
              id: 1,
              author: {
                name: 'Michael Chen',
                photoURL: '/avatar-michael.jpg'
              },
              text: 'Looks amazing! Love the clean design and smooth transitions.',
              timestamp: new Date(2025, 3, 25, 15, 15)
            },
            {
              id: 2,
              author: {
                name: 'Emma Rodriguez',
                photoURL: '/avatar-emma.jpg'
              },
              text: 'Great job on the responsive design! Works perfectly on mobile.',
              timestamp: new Date(2025, 3, 25, 16, 45)
            }
          ],
          showComments: false,
          imageUrl: '/portfolio-preview.jpg',
          projectId: 101,
          project: {
            title: 'Modern Portfolio',
            type: 'Web Application',
            description: 'A responsive portfolio website with dark/light mode and animation effects',
            technologies: ['Vue.js', 'TailwindCSS', 'GSAP']
          }
        },
        {
          id: 2,
          author: {
            name: 'David Wilson',
            photoURL: '/avatar-david.jpg'
          },
          content: "I've been learning about Web3 development for the past month. Finally built my first dApp using Ethereum and React. The learning curve was steep but worth it!",
          timestamp: new Date(2025, 3, 26, 9, 15),
          likes: 42,
          comments: [
            {
              id: 1,
              author: {
                name: 'Leila Hassan',
                photoURL: '/avatar-leila.jpg'
              },
              text: 'That\'s awesome! Would love to see it in action. Are you planning to open source it?',
              timestamp: new Date(2025, 3, 26, 10, 20)
            }
          ],
          showComments: false,
          projectId: 102,
          project: {
            title: 'CryptoTracker',
            type: 'Web3 Application',
            description: 'A decentralized application for tracking crypto assets with real-time updates',
            technologies: ['React', 'Ethereum', 'Web3.js', 'Solidity']
          }
        },
        {
          id: 3,
          author: {
            name: 'Alex Johnson',
            photoURL: '/profile-avatar.jpg'
          },
          content: "Just completed the Advanced Node.js course! Learned a ton about performance optimization and scalable architecture patterns.",
          timestamp: new Date(2025, 3, 27, 16, 45),
          likes: 19,
          comments: [],
          showComments: false,
          imageUrl: '/nodejs-certificate.jpg'
        }
      ],
      suggestedConnections: [
        {
          id: 1,
          name: 'Priya Sharma',
          title: 'Full Stack Developer',
          photoURL: '/avatar-priya.jpg'
        },
        {
          id: 2,
          name: 'James Thompson',
          title: 'UI/UX Designer',
          photoURL: '/avatar-james.jpg'
        },
        {
          id: 3,
          name: 'Olivia Martinez',
          title: 'DevOps Engineer',
          photoURL: '/avatar-olivia.jpg'
        }
      ],
      showNewPostModal: false,
      newPostType: 'post',
      newPostContent: '',
      newProject: {
        title: '',
        description: '',
        technologiesInput: '',
        type: 'Web Application'
      },
      newActivity: {
        type: 'Learning'
      },
      commentText: {}
    };
  },
  methods: {
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    logout() {
      // Implement logout functionality
      console.log('Logging out...');
      this.$router.push('/login');
    },
    likePost(postId) {
      const post = this.communityPosts.find(p => p.id === postId);
      if (post) {
        post.likes++;
      }
    },
    focusComment(postId) {
      const post = this.communityPosts.find(p => p.id === postId);
      if (post) {
        post.showComments = !post.showComments;
        if (post.showComments) {
          this.$nextTick(() => {
            const inputRef = this.$refs[`comment-input-${postId}`];
            if (inputRef) {
              inputRef.focus();
            }
          });
        }
      }
    },
    addComment(postId) {
      const post = this.communityPosts.find(p => p.id === postId);
      const commentText = this.commentText[postId];
      
      if (post && commentText && commentText.trim() !== '') {
        post.comments.push({
          id: post.comments.length + 1,
          author: this.user,
          text: commentText,
          timestamp: new Date()
        });
        this.commentText[postId] = '';
      }
    },
    sharePost(postId) {
      // Implement share functionality
      console.log(`Sharing post ${postId}`);
      // Could open a share modal or use Web Share API
    },
    formatDate(date) {
      // Simple date formatting for demonstration
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    },
    createNewPost() {
      // Create a new post based on the selected type
      const newPost = {
        id: this.communityPosts.length + 1,
        author: this.user,
        content: this.newPostContent,
        timestamp: new Date(),
        likes: 0,
        comments: [],
        showComments: false
      };
      
      // Add type-specific data
      if (this.newPostType === 'project' && this.newProject.title) {
        newPost.projectId = 100 + this.communityPosts.length + 1;
        newPost.project = {
          title: this.newProject.title,
          description: this.newProject.description,
          type: this.newProject.type,
          technologies: this.newProject.technologiesInput.split(',').map(tech => tech.trim())
        };
      }
      
      // Add to feed
      this.communityPosts.unshift(newPost);
      
      // Reset form
      this.newPostContent = '';
      this.newProject = {
        title: '',
        description: '',
        technologiesInput: '',
        type: 'Web Application'
      };
      this.newActivity = {
        type: 'Learning'
      };
      
      // Close modal
      this.showNewPostModal = false;
    }
  }
};
</script>

<style>
/* Reset and Base Styles */
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

a {
  text-decoration: none;
  color: #3b82f6;
}

button {
  cursor: pointer;
  font-family: inherit;
}

/* Main Container */
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

.logo-container {
  display: flex;
  align-items: center;
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

.icon-button {
  background: transparent;
  border: none;
  color: #6b7280;
  position: relative;
  padding: 0.375rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: #f3f4f6;
}

.notification-indicator {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid #ffffff;
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

.overview-action {
  font-size: 0.75rem;
  font-weight: 500;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #4b5563;
  transition: background-color 0.2s;
}

.filter-button:hover {
  background-color: #f3f4f6;
}

.feed-posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.post-header {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.post-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.post-meta {
  margin-left: 0.75rem;
  flex: 1;
}

.post-author {
  font-weight: 600;
  color: #1f2937;
}

.post-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.post-options {
  background: transparent;
  border: none;
  color: #6b7280;
  padding: 0.375rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.post-options:hover {
  background-color: #f3f4f6;
}

.post-content {
  padding: 0 1rem 1rem;
}

.post-content p {
  margin-bottom: 1rem;
}

.project-preview {
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.project-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.project-preview-header h4 {
  font-weight: 600;
  color: #1f2937;
}

.project-type {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.project-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tech-tag {
  font-size: 0.75rem;
  background-color: #ebf5ff;
  color: #3b82f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.project-link {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
}

.post-image {
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  max-height: 20rem;
  object-fit: cover;
}

.post-actions {
  display: flex;
  padding: 0.5rem 1rem;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.post-action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  flex: 1;
  justify-content: center;
}

.post-action-button:hover {
  background-color: #f3f4f6;
}

.post-comments {
  padding: 1rem;
}

.comment {
  display: flex;
  margin-bottom: 1rem;
}

.comment-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}

.comment-content {
  background-color: #f3f4f6;
  border-radius: 0.75rem;
  padding: 0.75rem;
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.comment-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.comment-text {
  font-size: 0.875rem;
  color: #4b5563;
}

.add-comment {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.add-comment input {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.add-comment input:focus {
  border-color: #3b82f6;
}

.send-comment {
  background-color: #3b82f6;
  color: white;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.send-comment:hover {
  background-color: #2563eb;
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

.events-section, .connections-section, .resources-section {
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.event-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.375rem;
  min-width: 3rem;
  border-top: 3px solid #3b82f6;
}

.event-month {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.event-day {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.event-details {
  flex: 1;
}

.event-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.event-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.event-register {
  background-color: #ebf5ff;
  color: #3b82f6;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.event-register:hover {
  background-color: #dbeafe;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.connection-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.connection-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.connection-info {
  flex: 1;
}

.connection-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.connection-title {
  font-size: 0.75rem;
  color: #6b7280;
}

.connect-button {
  background-color: #ebf5ff;
  color: #3b82f6;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.connect-button:hover {
  background-color: #dbeafe;
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
  background-color: red}
  </style>