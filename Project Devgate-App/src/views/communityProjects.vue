<template>
  <div class="community-projects" :class="{ 'dark-mode': darkMode }">
    <div class="header-section">
      <div class="header-content">
        <div class="logo">
          <img src="/logoDev.jpg" alt="Logo" />
          <h1>&nbsp;&nbsp;&nbsp;&nbsp;Community Projects</h1>
          <br><br><br><br>
          <router-link to="/dash" class="return-to-dash">
            <br><br><br><br> ← Return to Main Dashboard
          </router-link>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-value">{{ totalProjects }}</div>
            <div class="stat-label">Total Projects</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ activeProjects }}</div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalLikes }}</div>
            <div class="stat-label">Likes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalComments }}</div>
            <div class="stat-label">Comments</div>
          </div>
          <button @click="toggleDarkMode" class="theme-toggle-btn">
            <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="projects-container">
      <div class="filters-container">
        <div class="search-container">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search projects..."
          />
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div>
        
        <div class="filter-group">
          <label>Sort by:</label>
          <select v-model="sortBy">
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="likes">Most Likes</option>
            <option value="comments">Most Comments</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Technologies:</label>
          <div class="tags-input">
            <span 
              v-for="(tech, index) in selectedTech" 
              :key="index" 
              class="tag"
            >
              {{ tech }}
              <span @click="removeTech(index)" class="remove-tag">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </span>
            </span>
            <input 
              type="text" 
              v-model="techInput" 
              @keydown.enter.prevent="addTech"
              @input="searchTechnologies"
              placeholder="Filter by technology"
            />
            <div v-if="techSearchResults.length > 0" class="search-results">
              <div 
                v-for="tech in techSearchResults" 
                :key="tech"
                @click="selectTechnology(tech)"
                class="search-result-item"
              >
                {{ tech }}
              </div>
            </div>
          </div>
        </div>

        <div class="view-toggle">
          <button 
            @click="viewMode = 'grid'" 
            :class="{ active: viewMode === 'grid' }"
            class="view-toggle-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
            </svg>
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="{ active: viewMode === 'list' }"
            class="view-toggle-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
          :class="project.status"
        >
          <div class="card-header">
            <div class="project-image-wrapper-card">
              <img 
                :src="project.imageUrl || 'https://via.placeholder.com/400x200?text=Project+Image'" 
                alt="Project image"
                class="project-image"
              />
            </div>
            <div class="project-status-badge">
              {{ formatStatus(project.status) }}
            </div>
            <div v-if="isProjectOwner(project)" class="project-actions">
              <button @click.stop="confirmDeleteProject(project)" class="delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="card-body">
            <div class="owner-info">
              <img 
                :src="getOwnerProfileImageUrl(project)" 
                class="owner-avatar"
                alt="Owner avatar"
              />
              <span class="owner-name">{{ getOwnerDisplayName(project) }}</span>
            </div>
            
            <h3 class="project-name">{{ project.name || 'Untitled Project' }}</h3>
            <p class="project-description">{{ truncateDescription(project.description, 100) }}</p>
            
            <div class="project-tech">
              <div class="tech-tags">
                <span 
                  v-for="(tech, index) in (project.technologies || []).slice(0, 3)" 
                  :key="index" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
                <span v-if="(project.technologies || []).length > 3" class="tech-more">
                  +{{ (project.technologies || []).length - 3 }} more
                </span>
              </div>
            </div>
            <div class="project-stats">
              <div class="stat-item">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
                <span class="stat-value">{{ getProjectLikes(project) }}</span>
              </div>
              <div class="stat-item">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                </svg>
                <span class="stat-value">{{ getProjectComments(project) }}</span>
              </div>
              <div class="stat-item">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                </svg>
                <span class="stat-value">{{ formatDate(project.createdAt) }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <button 
              @click="toggleLike(project)"
              class="action-btn like-btn"
              :class="{ liked: isLiked(project) }"
            >
              <svg v-if="isLiked(project)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
              </svg>
              {{ isLiked(project) ? 'Liked' : 'Like' }}
            </button>
            <button @click="viewProject(project)" class="action-btn view-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
              </svg>
              View Details
            </button>
          </div>
        </div>
      </div>
      
      <!-- List View -->
      <div v-if="viewMode === 'list'" class="projects-list">
        <div class="list-header">
          <div class="list-column">Project</div>
          <div class="list-column">Owner</div>
          <div class="list-column">Technologies</div>
          <div class="list-column">Status</div>
          <div class="list-column">Stats</div>
          <div class="list-column">Actions</div>
        </div>
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="list-item"
        >
          <div class="list-cell project-info">
            <div class="project-image-wrapper">
              <img 
                :src="project.imageUrl || 'https://via.placeholder.com/80x45?text=Project+Image'" 
                alt="Project image"
                class="project-image"
              />
            </div>
            <div class="project-details">
              <h3 class="project-name">{{ project.name || 'Untitled Project' }}</h3>
              <p class="project-description">{{ truncateDescription(project.description, 60) }}</p>
            </div>
          </div>
          <div class="list-cell owner-info">
            <img 
              :src="getOwnerProfileImageUrl(project)" 
              class="owner-avatar"
              alt="Owner avatar"
            />
            <span class="owner-name">{{ getOwnerDisplayName(project) }}</span>
          </div>
          <div class="list-cell technologies">
            <div class="tech-tags">
              <span 
                v-for="(tech, index) in (project.technologies || []).slice(0, 2)" 
                :key="index" 
                class="tech-tag"
              >
                {{ tech }}
              </span>
              <span v-if="(project.technologies || []).length > 2" class="tech-more">
                +{{ (project.technologies || []).length - 2 }} more
              </span>
            </div>
          </div>
          <div class="list-cell status">
            <span class="status-badge" :class="project.status">{{ formatStatus(project.status) }}</span>
          </div>
          <div class="list-cell stats">
            <div class="stat-item">
              <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
              <span>{{ getProjectLikes(project) }}</span>
            </div>
            <div class="stat-item">
              <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
              </svg>
              <span>{{ getProjectComments(project) }}</span>
            </div>
          </div>
          <div class="list-cell actions">
            <button 
              @click="toggleLike(project)"
              class="action-btn like-btn"
              :class="{ liked: isLiked(project) }"
            >
              <svg v-if="isLiked(project)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
              </svg>
            </button>
            <button @click="viewProject(project)" class="action-btn view-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
              </svg>
            </button>
            <button 
              v-if="isProjectOwner(project)"
              @click="confirmDeleteProject(project)"
              class="action-btn delete-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>Loading projects...</span>
      </div>
      
      <div v-if="!loading && filteredProjects.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5zm0 7a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/>
          </svg>
        </div>
        <h3>No projects found</h3>
        <p>{{ searchTerm || selectedTech.length ? 'Try different filters' : 'Be the first to share a project!' }}</p>
      </div>
      
      <div v-if="hasMore" class="load-more">
        <button @click="loadMore" class="btn primary-btn">
          Load More Projects
        </button>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Delete Project</h3>
          <p>Are you sure you want to delete "{{ projectToDelete?.name || 'this project' }}"? This action cannot be undone.</p>
          <div class="modal-actions">
            <button @click="showDeleteModal = false" class="btn cancel-btn">Cancel</button>
            <button @click="deleteProject" class="btn delete-confirm-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs, query, orderBy, limit, startAfter, doc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'CommunityProjects',
  data() {
    return {
      projects: [],
      loading: true,
      searchTerm: '',
      sortBy: 'recent',
      techInput: '',
      selectedTech: [],
      techSearchResults: [],
      lastVisible: null,
      hasMore: true,
      pageSize: 12,
      likedProjects: new Set(),
      userProfiles: new Map(),
      viewMode: 'grid', // 'grid' or 'list'
      showDeleteModal: false,
      projectToDelete: null,
      darkMode: false
    };
  },
  computed: {
    filteredProjects() {
      let filtered = [...this.projects];
      
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(project => 
          (project.name || '').toLowerCase().includes(term) ||
          (project.description || '').toLowerCase().includes(term) ||
          (this.getOwnerDisplayName(project)).toLowerCase().includes(term)
        );
      }
      
      if (this.selectedTech.length > 0) {
        filtered = filtered.filter(project => 
          this.selectedTech.every(tech => 
            (project.technologies || []).some(
              projectTech => projectTech.toLowerCase() === tech.toLowerCase()
            )
          )
        );
      }
      
      return this.sortProjects(filtered);
    },
    totalProjects() {
      return this.projects.length;
    },
    activeProjects() {
      return this.projects.filter(p => p.status === 'in-progress').length;
    },
    totalLikes() {
      return this.projects.reduce((sum, project) => sum + this.getProjectLikes(project), 0);
    },
    totalComments() {
      return this.projects.reduce((sum, project) => sum + this.getProjectComments(project), 0);
    },
    currentUser() {
      const auth = getAuth();
      return auth.currentUser;
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    },
    goToDashboard() {
      this.$router.push('/dash');
    },
    async loadProjects() {
      try {
        this.loading = true;
        const db = getFirestore();
        const projectsRef = collection(db, 'community_projects');
        const q = query(
          projectsRef,
          orderBy('createdAt', 'desc'),
          limit(this.pageSize)
        );
        
        const snapshot = await getDocs(q);
        
        const projectsData = [];
        for (const doc of snapshot.docs) {
          const projectData = {
            id: doc.id,
            ...doc.data()
          };
          
          if (projectData.ownerId) {
            await this.fetchOwnerData(projectData.ownerId);
          }
          
          projectsData.push(projectData);
        }
        
        this.projects = projectsData;
        this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
        this.hasMore = snapshot.docs.length >= this.pageSize;
        
        if (this.currentUser) {
          await this.loadLikedProjects();
        }
        
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchOwnerData(ownerId) {
      if (this.userProfiles.has(ownerId)) {
        return;
      }
      
      try {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', ownerId));
        if (userDoc.exists()) {
          this.userProfiles.set(ownerId, userDoc.data());
        } else {
          this.userProfiles.set(ownerId, { displayName: null, profileImageUrl: null });
        }
      } catch (error) {
        console.error("Error fetching owner data:", error);
        this.userProfiles.set(ownerId, { displayName: null, profileImageUrl: null });
      }
    },
    
    getOwnerDisplayName(project) {
      if (!project.ownerId) return 'Anonymous User';
      
      const ownerProfile = this.userProfiles.get(project.ownerId);
      if (ownerProfile && ownerProfile.name) {
        return ownerProfile.name;
      }
      
      return 'User ' + project.ownerId.substring(0, 5);
    },
    
    getOwnerProfileImageUrl(project) {
      if (!project.ownerId) return 'https://via.placeholder.com/40?text=Anonymous';
      
      const ownerProfile = this.userProfiles.get(project.ownerId);
      if (ownerProfile && ownerProfile.profileImageUrl) {
        return ownerProfile.profileImageUrl;
      }
      
      const name = this.getOwnerDisplayName(project);
      const initial = name.charAt(0).toUpperCase();
      return `https://via.placeholder.com/40/3498db/ffffff?text=${initial}`;
    },
    
    async loadLikedProjects() {
      if (!this.currentUser) return;
      
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', this.currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.likedProjects && Array.isArray(userData.likedProjects)) {
            userData.likedProjects.forEach(projectId => {
              this.likedProjects.add(projectId);
            });
          }
        }
      } catch (error) {
        console.error("Error loading liked projects:", error);
      }
    },
    
    async loadMore() {
      if (!this.hasMore) return;
      
      try {
        this.loading = true;
        const db = getFirestore();
        const projectsRef = collection(db, 'community_projects');
        const q = query(
          projectsRef,
          orderBy('createdAt', 'desc'),
          startAfter(this.lastVisible),
          limit(this.pageSize)
        );
        
        const snapshot = await getDocs(q);
        
        const newProjects = [];
        for (const doc of snapshot.docs) {
          const projectData = {
            id: doc.id,
            ...doc.data()
          };
          
          if (projectData.ownerId) {
            await this.fetchOwnerData(projectData.ownerId);
          }
          
          newProjects.push(projectData);
        }
        
        this.projects = [...this.projects, ...newProjects];
        this.lastVisible = snapshot.docs[snapshot.docs.length - 1];
        this.hasMore = snapshot.docs.length >= this.pageSize;
      } catch (error) {
        console.error("Error loading more projects:", error);
      } finally {
        this.loading = false;
      }
    },
    
    sortProjects(projects) {
      return [...projects].sort((a, b) => {
        switch (this.sortBy) {
          case 'recent': 
            return this.getTimestamp(b.createdAt) - this.getTimestamp(a.createdAt);
          case 'popular': 
            return (this.getProjectLikes(b) + this.getProjectComments(b)) - 
                   (this.getProjectLikes(a) + this.getProjectComments(a));
          case 'likes': 
            return this.getProjectLikes(b) - this.getProjectLikes(a);
          case 'comments': 
            return this.getProjectComments(b) - this.getProjectComments(a);
          default: 
            return this.getTimestamp(b.createdAt) - this.getTimestamp(a.createdAt);
        }
      });
    },
    
    getTimestamp(date) {
      if (!date) return 0;
      return date instanceof Date ? date.getTime() : 
             date.toDate ? date.toDate().getTime() : 
             new Date(date).getTime();
    },
    
    getProjectLikes(project) {
      if (typeof project.likes === 'number') {
        return project.likes;
      } else if (project.likesBy && Array.isArray(project.likesBy)) {
        return project.likesBy.length;
      }
      return 0;
    },
    
    getProjectComments(project) {
      if (typeof project.comments === 'number') {
        return project.comments;
      } else if (project.comments && Array.isArray(project.comments)) {
        return project.comments.length;
      } else if (project.comments && typeof project.comments === 'object') {
        return Object.keys(project.comments).length;
      } else if (project.commentsCount && typeof project.commentsCount === 'number') {
        return project.commentsCount;
      }
      return 0;
    },
    
    async toggleLike(project) {
      if (!this.currentUser) {
        alert('Please sign in to like projects');
        return;
      }
      
      try {
        const db = getFirestore();
        const projectRef = doc(db, 'community_projects', project.id);
        const userRef = doc(db, 'users', this.currentUser.uid);
        
        if (this.isLiked(project)) {
          await updateDoc(projectRef, {
            likes: Math.max((project.likes || 0) - 1, 0),
            likesBy: arrayRemove(this.currentUser.uid)
          });
          
          await updateDoc(userRef, {
            likedProjects: arrayRemove(project.id)
          });
          
          this.likedProjects.delete(project.id);
          
          const index = this.projects.findIndex(p => p.id === project.id);
          if (index !== -1) {
            if (typeof this.projects[index].likes === 'number') {
              this.projects[index].likes = Math.max((this.projects[index].likes || 0) - 1, 0);
            }
            if (Array.isArray(this.projects[index].likesBy)) {
              this.projects[index].likesBy = this.projects[index].likesBy.filter(id => id !== this.currentUser.uid);
            }
          }
        } else {
          await updateDoc(projectRef, {
            likes: (project.likes || 0) + 1,
            likesBy: arrayUnion(this.currentUser.uid)
          });
          
          await updateDoc(userRef, {
            likedProjects: arrayUnion(project.id)
          });
          
          this.likedProjects.add(project.id);
          
          const index = this.projects.findIndex(p => p.id === project.id);
          if (index !== -1) {
            if (typeof this.projects[index].likes === 'number') {
              this.projects[index].likes = (this.projects[index].likes || 0) + 1;
            } else {
              this.projects[index].likes = 1;
            }
            if (!Array.isArray(this.projects[index].likesBy)) {
              this.projects[index].likesBy = [];
            }
            this.projects[index].likesBy.push(this.currentUser.uid);
          }
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    },
    
    isLiked(project) {
      if (!this.currentUser) return false;
      
      if (this.likedProjects.has(project.id)) {
        return true;
      }
      
      return Array.isArray(project.likesBy) && 
             project.likesBy.includes(this.currentUser.uid);
    },
    
    isProjectOwner(project) {
      if (!this.currentUser || !project.ownerId) return false;
      return project.ownerId === this.currentUser.uid;
    },
    
    viewProject(project) {
      this.$router.push(`/community/projects/${project.id}`);
    },
    
    confirmDeleteProject(project) {
      this.projectToDelete = project;
      this.showDeleteModal = true;
    },
    
    async deleteProject() {
      if (!this.projectToDelete || !this.isProjectOwner(this.projectToDelete)) {
        this.showDeleteModal = false;
        return;
      }
      
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, 'community_projects', this.projectToDelete.id));
        
        this.projects = this.projects.filter(p => p.id !== this.projectToDelete.id);
        this.totalProjects--;
        if (this.projectToDelete.status === 'in-progress') {
          this.activeProjects--;
        }
        this.totalLikes -= this.getProjectLikes(this.projectToDelete);
        this.totalComments -= this.getProjectComments(this.projectToDelete);
        
        this.showDeleteModal = false;
        this.projectToDelete = null;
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        const date = dateString instanceof Date ? dateString : 
                    dateString.toDate ? dateString.toDate() : 
                    new Date(dateString);
                    
        if (isNaN(date.getTime())) {
          return 'Invalid date';
        }
        
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        return 'Unknown date';
      }
    },
    
    formatStatus(status) {
      const statusMap = {
        'planning': 'Planning',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'on-hold': 'On Hold'
      };
      return statusMap[status] || status || 'Unknown';
    },
    
    truncateDescription(description, length = 50) {
      if (!description) return 'No description available';
      return description.length > length 
        ? description.substring(0, length) + '...' 
        : description;
    },
    
    searchTechnologies() {
      if (this.techInput.trim().length > 1) {
        const term = this.techInput.toLowerCase();
        const allTech = this.getAllTechnologies();
        this.techSearchResults = allTech
          .filter(tech => 
            tech.toLowerCase().includes(term) &&
            !this.selectedTech.some(t => t.toLowerCase() === tech.toLowerCase())
          )
          .slice(0, 5);
      } else {
        this.techSearchResults = [];
      }
    },
    
    getAllTechnologies() {
      const allTech = new Set();
      this.projects.forEach(project => {
        (project.technologies || []).forEach(tech => allTech.add(tech));
      });
      return Array.from(allTech).sort();
    },
    
    selectTechnology(tech) {
      if (!this.selectedTech.some(t => t.toLowerCase() === tech.toLowerCase())) {
        this.selectedTech.push(tech);
      }
      this.techInput = '';
      this.techSearchResults = [];
    },
    
    addTech() {
      if (this.techInput.trim() && !this.selectedTech.some(t => t.toLowerCase() === this.techInput.trim().toLowerCase())) {
        this.selectedTech.push(this.techInput.trim());
        this.techInput = '';
        this.techSearchResults = [];
      }
    },
    
    removeTech(index) {
      this.selectedTech.splice(index, 1);
    }
  },
  created() {
    this.loadProjects();
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.darkMode = savedTheme === 'true';
      if (this.darkMode) {
        document.documentElement.classList.add('dark-theme');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = true;
      document.documentElement.classList.add('dark-theme');
    }
  },
  watch: {
    sortBy() {
      // Re-sort the existing data
    },
    searchTerm() {
      this.hasMore = true;
      this.lastVisible = null;
    },
    selectedTech() {
      this.hasMore = true;
      this.lastVisible = null;
    },
    currentUser() {
      if (this.currentUser) {
        this.loadLikedProjects();
      } else {
        this.likedProjects.clear();
      }
    },
    darkMode(newVal) {
      localStorage.setItem('darkMode', newVal);
    }
  }
};
</script>

<style scoped>
/* Base styles */
.community-projects {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  transition: background-color 0.3s, color 0.3s;
}

/* Light mode styles */
.header-section {
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo img {
  height: 150px;
  width: 150px;
}

.logo h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-align: center;
  min-width: 120px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.return-to-dash {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
  text-align:left;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}

.theme-toggle-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.theme-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* Filters */
.filters-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-end;
  transition: background-color 0.3s, border-color 0.3s;
}

.search-container {
  position: relative;
  flex: 1;
  width: 100%;
}

.search-container input {
  width: 85%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.search-container input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #4a5568;
}

.filter-group select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.filter-group select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-height: 44px;
  position: relative;
  background-color: #f8fafc;
}

.tag {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-tag {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  margin-left: 0.25rem;
}

.remove-tag svg {
  width: 12px;
  height: 12px;
}

.tags-input input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  padding: 0.5rem;
  background: transparent;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-result-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: #f8fafc;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.view-toggle-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-toggle-btn:hover {
  background: #e2e8f0;
}

.view-toggle-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.view-toggle-btn svg {
  width: 16px;
  height: 16px;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #1976d2;
}

.project-card.planning {
  border-top: 4px solid #f39c12;
}

.project-card.in-progress {
  border-top: 4px solid #3498db;
}

.project-card.completed {
  border-top: 4px solid #2ecc71;
}

.project-card.on-hold {
  border-top: 4px solid #95a5a6;
}

.card-header {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.project-image-wrapper-card {
  width: 100%;
  height: 100%;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-card.planning .project-status-badge {
  color: #d35400;
}

.project-card.in-progress .project-status-badge {
  color: #2980b9;
}

.project-card.completed .project-status-badge {
  color: #27ae60;
}

.project-card.on-hold .project-status-badge {
  color: #7f8c8d;
}

.project-actions {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}

.delete-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  color: #e74c3c;
}

.delete-btn:hover {
  background: #e74c3c;
  color: white;
}

.delete-btn svg {
  width: 16px;
  height: 16px;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.owner-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.owner-name {
  font-weight: 500;
  color: #4a5568;
}

.project-name {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.project-description {
  margin: 0 0 1.5rem;
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
}

.project-tech {
  margin-bottom: 1.5rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tech-more {
  font-size: 0.8rem;
  color: #718096;
}

.project-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: auto;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #718096;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.like-btn {
  background-color: #f0fdf4;
  color: #16a34a;
}

.like-btn.liked {
  background-color: #dcfce7;
  color: #166534;
}

.like-btn:hover {
  background-color: #dcfce7;
}

.view-btn {
  background-color: #e0f2fe;
  color: #0369a1;
}

.view-btn:hover {
  background-color: #bae6fd;
}

/* Projects List View */
.projects-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  margin-bottom: 2rem;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #4a5568;
}

.list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: #f8fafc;
}

.list-cell {
  display: flex;
  align-items: center;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.project-image-wrapper {
  width: 80px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-details {
  flex: 1;
}

.project-name {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.project-description {
  margin: 0;
  color: #718096;
  font-size: 0.85rem;
  line-height: 1.4;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.owner-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.owner-name {
  font-size: 0.9rem;
  color: #4a5568;
}

.technologies {
  display: flex;
  align-items: center;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tech-more {
  font-size: 0.75rem;
  color: #718096;
}

.status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.planning {
  background-color: #fef3e6;
  color: #d35400;
}

.status-badge.in-progress {
  background-color: #e1f0fe;
  color: #2980b9;
}

.status-badge.completed {
  background-color: #e6f7ed;
  color: #27ae60;
}

.status-badge.on-hold {
  background-color: #f0f2f3;
  color: #7f8c8d;
}

.stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #718096;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions .action-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  margin-bottom: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e2e8f0;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container span {
  color: #4a5568;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  text-align: center;
  margin-bottom: 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
  color: #1976d2;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
}

.empty-state p {
  margin: 0 0 1.5rem;
  color: #718096;
}

/* Load More */
.load-more {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.primary-btn {
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #1565c0, #1976d2);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-content p {
  margin: 1rem 0 2rem;
  color: #4a5568;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  background: #f1f5f9;
  color: #4a5568;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.delete-confirm-btn {
  background: #e74c3c;
  color: white;
}

.delete-confirm-btn:hover {
  background: #c0392b;
}

/* Dark mode styles */
.community-projects.dark-mode {
  background-color: #1a202c;
  color: #e2e8f0;
}

.dark-mode .header-section {
  background: linear-gradient(135deg, #0d47a1, #1565c0);
}
.dark-mode {
  background-color:rgb(7, 19, 44);
  color: #e2e8f0;
}

.dark-mode .projects-form,
.dark-mode .projects-visualization,
.dark-mode .projects-display-container,
.dark-mode .projects-list,
.dark-mode .projects-cards,
.dark-mode .projects-table {
  background-color:rgb(16, 36, 71);
  color: #e2e8f0;
  border-color:rgb(18, 42, 84);
}

.dark-mode .form-group input,
.dark-mode .form-group select,
.dark-mode .form-group textarea {
  background-color:rgb(15, 32, 51);
  color: #e2e8f0;
  border-color:rgb(200, 209, 225);
}

.dark-mode .tags-input {
  background-color:rgb(44, 60, 91);
  border-color:rgb(210, 219, 234);
}

.dark-mode .tag {
  background-color:rgb(28, 45, 67);
  color:rgb(194, 201, 205);
}

/* Add more dark mode styles as needed */
.dark-mode .time-range-selector select {
  background-color: #334155;
  border-color:rgb(154, 163, 176);
  color: #e5e7eb;
}

.theme-toggle-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color:rgb(23, 34, 57);
  border: none;
  border-radius: 5px;
  color:rgb(178, 188, 208);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dark-mode .theme-toggle {
  background-color:rgb(39, 56, 79);
  color:rgb(213, 218, 228);
}

.theme-toggle:hover {
  background-color:rgb(14, 30, 54);
}

.dark-mode .theme-toggle:hover {
  background-color: #475569;
}
/* Dark Mode Styles for Project Cards */
.dark-mode .project-card {
  background-color: #0f172a; /* Dark blue background */
  border-color: #1e293b; /* Slightly lighter border */
  color: #e2e8f0; /* Light text color */
}

.dark-mode .project-card:hover {
  background-color: #1e293b; /* Slightly lighter dark blue on hover */
  border-color: #334155; /* Highlighted border on hover */
}

.dark-mode .project-image {
  filter: brightness(0.8); /* Slightly dim the image in dark mode */
}

.dark-mode .project-card .project-status-badge {
  background-color: rgba(255, 255, 255, 0.1); /* Transparent badge background */
  color: #e2e8f0; /* Light text color for the badge */
}

.dark-mode .project-card .project-name {
  color: #e2e8f0; /* Light text color for project names */
}

.dark-mode .project-card .project-description {
  color: #94a3b8; /* Muted light text color for descriptions */
}

.dark-mode .project-card .tech-tag {
  background-color: #1e293b; /* Dark blue for technology tags */
  color: #cbd5e1; /* Light text color for tags */
}

.dark-mode .project-card .tech-more {
  color: #94a3b8; /* Muted light text color for "more" tags */
}




.community-projects {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-section {
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo img {
  height: 150px;
  width: 150px;
  
}

.logo h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-align: center;
  min-width: 120px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}
.return-to-dash {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
  text-align:left;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}





/* Filters */
.filters-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-end;
}

.search-container {
  position: relative;
  flex: 1;
  width: 100%;
}

.search-container input {
  width: 85%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.search-container input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #4a5568;
}

.filter-group select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.filter-group select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-height: 44px;
  position: relative;
  background-color: #f8fafc;
}

.tag {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-tag {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  margin-left: 0.25rem;
}

.remove-tag svg {
  width: 12px;
  height: 12px;
}

.tags-input input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  padding: 0.5rem;
  background: transparent;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-result-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: #f8fafc;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.view-toggle-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-toggle-btn:hover {
  background: #e2e8f0;
}

.view-toggle-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.view-toggle-btn svg {
  width: 16px;
  height: 16px;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #1976d2;
}

.project-card.planning {
  border-top: 4px solid #f39c12;
}

.project-card.in-progress {
  border-top: 4px solid #3498db;
}

.project-card.completed {
  border-top: 4px solid #2ecc71;
}

.project-card.on-hold {
  border-top: 4px solid #95a5a6;
}

.card-header {
  position: relative;
  height: 200px; /* Fixed height for consistency */
  overflow: hidden; /* Hide any overflow */
  border-radius: 12px 12px 0 0; /* Match card's top corners */

}

.project-image-wrapper {
  width: 100%;
  height: 100%;
}

.project-image {
  width: 100%;
  height: 100%;
  object-position: center; /* Centers the image */
  transition: transform 0.3s ease;
  object-fit: cover;
}

.project-status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-card.planning .project-status-badge {
  color: #d35400;
}

.project-card.in-progress .project-status-badge {
  color: #2980b9;
}

.project-card.completed .project-status-badge {
  color: #27ae60;
}

.project-card.on-hold .project-status-badge {
  color: #7f8c8d;
}

.project-actions {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}

.delete-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  color: #e74c3c;
}

.delete-btn:hover {
  background: #e74c3c;
  color: white;
}

.delete-btn svg {
  width: 16px;
  height: 16px;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.owner-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.owner-name {
  font-weight: 500;
  color: #4a5568;
}

.project-name {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.project-description {
  margin: 0 0 1.5rem;
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
}

.project-tech {
  margin-bottom: 1.5rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tech-more {
  font-size: 0.8rem;
  color: #718096;
}

.project-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: auto;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #718096;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.like-btn {
  background-color: #f0fdf4;
  color: #16a34a;
}

.like-btn.liked {
  background-color: #dcfce7;
  color: #166534;
}

.like-btn:hover {
  background-color: #dcfce7;
}

.view-btn {
  background-color: #e0f2fe;
  color: #0369a1;
}

.view-btn:hover {
  background-color: #bae6fd;
}

/* Projects List View */
.projects-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  margin-bottom: 2rem;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #4a5568;
}

.list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: #f8fafc;
}

.list-cell {
  display: flex;
  align-items: center;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.project-image-wrapper
 {
  width: 80px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-details {
  flex: 1;
}

.project-name {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.project-description {
  margin: 0;
  color: #718096;
  font-size: 0.85rem;
  line-height: 1.4;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.owner-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.owner-name {
  font-size: 0.9rem;
  color: #4a5568;
}

.technologies {
  display: flex;
  align-items: center;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tech-more {
  font-size: 0.75rem;
  color: #718096;
}

.status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.planning {
  background-color: #fef3e6;
  color: #d35400;
}

.status-badge.in-progress {
  background-color: #e1f0fe;
  color: #2980b9;
}

.status-badge.completed {
  background-color: #e6f7ed;
  color: #27ae60;
}

.status-badge.on-hold {
  background-color: #f0f2f3;
  color: #7f8c8d;
}

.stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #718096;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions .action-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  margin-bottom: 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e2e8f0;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container span {
  color: #4a5568;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  text-align: center;
  margin-bottom: 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
  color: #1976d2;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
}

.empty-state p {
  margin: 0 0 1.5rem;
  color: #718096;
}

/* Load More */
.load-more {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.primary-btn {
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #1565c0, #1976d2);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-content p {
  margin: 1rem 0 2rem;
  color: #4a5568;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  background: #f1f5f9;
  color: #4a5568;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.delete-confirm-btn {
  background: #e74c3c;
  color: white;
}

.delete-confirm-btn:hover {
  background: #c0392b;
}

/* Responsive */
@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .list-header, .list-item {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  }
  
  .list-header div:nth-child(3),
  .list-item div:nth-child(3) {
    display: none;
  }
}

@media (max-width: 992px) {
  .filters-container {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .view-toggle {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .stat-card {
    flex: 1;
    min-width: auto;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .list-header, .list-item {
    grid-template-columns: 2fr 1fr 1fr;
  }
  
  .list-header div:nth-child(4),
  .list-header div:nth-child(5),
  .list-item div:nth-child(4),
  .list-item div:nth-child(5) {
    display: none;
  }
}

@media (max-width: 576px) {
  .list-header, .list-item {
    grid-template-columns: 2fr 1fr;
  }
  
  .list-header div:nth-child(2),
  .list-item div:nth-child(2) {
    display: none;
  }
  
  .project-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .project-image-wrapper-card {
    width: 100%;
    height: 100%;
  }
}
.project-image-wrapper-card {
    width: 100%;
    height: 100%;
  }
.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* This ensures the image covers the area while maintaining aspect ratio */
  object-position: center; /* Center the image within the container */
  transition: transform 0.3s ease; /* Add smooth zoom effect on hover */
}

.project-card:hover .project-image {
  transform: scale(1.05); /* Slight zoom effect on hover */
}
</style>