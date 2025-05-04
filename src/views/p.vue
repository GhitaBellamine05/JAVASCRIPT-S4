<template  >
  <div class="projects-manager" :class="{ 'dark-mode': darkMode }">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="logo">
  <img src="/logoDev.jpg" alt="Projects Logo" />
  <div>
    <h1>Projects Dashboard</h1>
    <router-link to="/dash" class="return-to-dash">
      ← Return to Main Dashboard
    </router-link>
     <div class="theme-toggle-container">
      <button class="theme-toggle" @click="toggleTheme">
        <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        <span>{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </div>
  </div>
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
            <div class="stat-value">{{ completedProjects }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalCollaborations }}</div>
            <div class="stat-label">Collaborations</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="projects-container">
      <!-- Form and Visualization -->
      <div class="projects-form-container">
        <div class="projects-form">
          <div class="form-header">
            <h2>{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h2>
            <button @click="toggleGitHubImport" class="btn github-btn">
              {{ showGitHubImport ? 'Manual Entry' : 'Import from GitHub' }}
            </button>
          </div>
          
          <!-- GitHub Import Form -->
          <div v-if="showGitHubImport" class="github-import-form">
            <div class="form-group">
              <label for="githubUsername">GitHub Username</label>
              <input
                type="text"
                id="githubUsername"
                v-model="githubUsername"
                placeholder="Your GitHub username"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="githubRepo">Repository</label>
              <div class="repo-selector">
                <select 
                  v-model="selectedRepo" 
                  @change="loadRepoDetails"
                  :disabled="!githubRepos.length"
                >
                  <option value="">Select a repository</option>
                  <option 
                    v-for="repo in githubRepos" 
                    :key="repo.id" 
                    :value="repo.name"
                  >
                    {{ repo.name }}
                  </option>
                </select>
                <button 
                  @click="fetchGitHubRepos" 
                  class="btn primary-btn fetch-btn"
                  :disabled="!githubUsername"
                >
                  Fetch Repos
                </button>
              </div>
            </div>
            
            <div v-if="githubRepoDetails" class="repo-preview">
              <h3>Repository Details</h3>
              <div class="repo-info">
                <div class="repo-image">
                  <img 
                    :src="githubRepoDetails.owner.avatar_url || 'https://via.placeholder.com/100'" 
                    alt="Repo owner avatar"
                  />
                </div>
                <div class="repo-meta">
                  <h4>{{ githubRepoDetails.name }}</h4>
                  <p>{{ githubRepoDetails.description }}</p>
                  <div class="repo-stats">
                    <span>⭐ {{ githubRepoDetails.stargazers_count }}</span>
                    <span>🍴 {{ githubRepoDetails.forks_count }}</span>
                    <span>👀 {{ githubRepoDetails.watchers_count }}</span>
                  </div>
                  <div class="repo-languages">
                    <span 
                      v-for="(percentage, lang) in repoLanguages" 
                      :key="lang"
                      class="language-tag"
                    >
                      {{ lang }} ({{ percentage }}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button 
                  @click="importFromGitHub" 
                  class="btn primary-btn"
                  :disabled="!selectedRepo"
                >
                  Import Project
                </button>
              </div>
            </div>
          </div>
          
          <!-- Manual Entry Form -->
          <div v-else>
            <div class="form-grid">
              <div class="form-group">
                <label for="projectName">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  v-model="currentProject.name"
                  placeholder="e.g. E-commerce Platform, Portfolio Site..."
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="projectStatus">Status</label>
                <select id="projectStatus" v-model="currentProject.status" required @change="handleStatusChange">
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  v-model="currentProject.startDate"
                />
              </div>
              
              <div class="form-group">
                <label for="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  v-model="currentProject.endDate"
                  :disabled="currentProject.status !== 'completed'"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="projectImage">Project Image</label>
              <div class="image-upload-container">
                <div v-if="currentProject.imageUrl" class="image-preview">
                  <img :src="currentProject.imageUrl" alt="Project preview" />
                  <button @click="removeImage" class="remove-image-btn">×</button>
                </div>
                <div v-else class="upload-placeholder" @click="triggerFileInput">
                  <span>+ Upload Image</span>
                  <input 
                    type="file" 
                    ref="fileInput" 
                    @change="handleImageUpload" 
                    accept="image/*"
                    style="display: none;"
                  />
                </div>
                <input
                  type="url"
                  v-model="currentProject.imageUrl"
                  placeholder="Or enter image URL"
                  class="image-url-input"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="projectDescription">Description</label>
              <textarea
                id="projectDescription"
                v-model="currentProject.description"
                rows="3"
                placeholder="Brief description of the project..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Technologies</label>
              <div class="tags-input">
                <span 
                  v-for="(tech, index) in currentProject.technologies" 
                  :key="index" 
                  class="tag"
                >
                  {{ tech }}
                  <span @click="removeTech(index)" class="remove-tag">×</span>
                </span>
                <input 
                  type="text" 
                  v-model="techInput" 
                  @keydown.enter.prevent="addTech"
                  @input="searchTechnologies"
                  placeholder="Add technology"
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
            
            <div class="form-group">
              <label>Collaborators</label>
              <div class="tags-input">
                <span 
                  v-for="(collab, index) in currentProject.collaborators" 
                  :key="'collab-'+index" 
                  class="tag collaborator-tag"
                >
                  <img :src="collab.profileImageUrl || 'https://via.placeholder.com/30'" class="collaborator-avatar" />
                  {{ collab.displayName || collab.email }}
                  <span @click="removeCollaborator(index)" class="remove-tag">×</span>
                </span>
                <input 
                  type="text" 
                  v-model="collabInput" 
                  @keydown.enter.prevent="addCollaborator"
                  @input="searchCollaborators"
                  placeholder="Add collaborator"
                />
                <div v-if="collabSearchResults.length > 0" class="search-results">
                  <div 
                    v-for="user in collabSearchResults" 
                    :key="user.uid"
                    @click="selectCollaborator(user)"
                    class="search-result-item"
                  >
                    <img :src="user.profileImageUrl || 'https://via.placeholder.com/30'" class="result-avatar" />
                    {{ user.name || user.email }}
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="currentProject.status === 'in-progress'" class="form-group">
              <label>Progress: {{ currentProject.progress || 0 }}%</label>
              <input
                type="range"
                min="0"
                max="100"
                v-model="currentProject.progress"
                class="progress-slider"
              />
              <div class="progress-labels">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="projectLink">Project Link (optional)</label>
              <div class="input-with-icon">
                <input
                  type="url"
                  id="projectLink"
                  v-model="currentProject.link"
                  placeholder="https://example.com"
                />
                <span class="input-icon">🔗</span>
              </div>
            </div>
            
            <div class="project-preview">
              <div class="preview-header">
                <span>Project Status:</span>
                <span :class="['project-status', currentProject.status]">
                  {{ formatStatus(currentProject.status) }}
                </span>
              </div>
              <div class="progress-container">
                <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
              </div>
            </div>
            
            <div class="form-actions">
              <button v-if="isEditing" @click="cancelEdit" class="btn cancel-btn">
                Cancel
              </button>
              <button @click="saveProject" class="btn primary-btn">
                {{ isEditing ? 'Update Project' : 'Save Project' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="projects-visualization">
          <div class="visualization-tabs">
            <button 
              v-for="tab in visualizationTabs" 
              :key="tab.id"
              @click="activeVisualization = tab.id"
              :class="{ active: activeVisualization === tab.id }"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div v-if="activeVisualization === 'status'" class="chart-container">
            <h3>Projects Distribution</h3>
            <div class="chart-wrapper">
              <div class="chart-legend">
                <div v-for="(count, status) in statusDistribution" :key="status" class="legend-item">
                  <span class="legend-color" :class="status"></span>
                  <span>{{ formatStatus(status) }} ({{ count }})</span>
                </div>
              </div>
              <div class="chart">
                <div 
                  v-for="(count, status) in statusDistribution" 
                  :key="status"
                  class="chart-segment"
                  :class="status"
                  :style="{ height: (count / maxStatusCount) * 100 + '%' }"
                  :title="`${formatStatus(status)}: ${count} projects`"
                ></div>
              </div>
            </div>
          </div>
          
          <div v-if="activeVisualization === 'timeline'" class="timeline-container">
            <h3>Projects Timeline</h3>
            <div class="timeline-controls">
              <div class="view-options">
                <button 
                  @click="timelineView = 'vertical'"
                  :class="{ active: timelineView === 'vertical' }"
                >
                  Vertical
                </button>
                <button 
                  @click="timelineView = 'horizontal'"
                  :class="{ active: timelineView === 'horizontal' }"
                >
                  Horizontal
                </button>
                <button 
                  @click="timelineView = 'gantt'"
                  :class="{ active: timelineView === 'gantt' }"
                >
                  Gantt
                </button>
              </div>
              <div class="date-range">
                <label>Date Range:</label>
                <select v-model="timelineRange">
                  <option value="all">All Time</option>
                  <option value="year">This Year</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>
            
            <div v-if="timelineView === 'vertical'" class="vertical-timeline">
              <div class="timeline-line"></div>
              <div 
                v-for="(project, index) in filteredTimelineProjects" 
                :key="project.id"
                class="timeline-item"
                :class="[project.status, { 'alternate': index % 2 === 0 }]"
              >
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-date">{{ formatDate(project.startDate) }}</div>
                  <h4 class="timeline-title">{{ project.name }}</h4>
                  <div class="timeline-status">{{ formatStatus(project.status) }}</div>
                  <div class="timeline-progress">
                    <div class="progress-container">
                      <div 
                        class="progress-bar" 
                        :style="{ width: getProjectProgress(project) + '%' }"
                      ></div>
                    </div>
                    <span>{{ getProjectProgress(project) }}%</span>
                  </div>
                  <div class="timeline-tech">
                    <span 
                      v-for="(tech, i) in project.technologies.slice(0, 3)" 
                      :key="i"
                      class="tech-tag"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="timelineView === 'horizontal'" class="horizontal-timeline">
              <div class="timeline-axis">
                <div 
                  v-for="month in timelineMonths" 
                  :key="month.date"
                  class="timeline-month"
                  :style="{ flex: month.days }"
                >
                  <div class="month-label">{{ month.label }}</div>
                  <div class="month-days">
                    <div 
                      v-for="day in month.days" 
                      :key="day"
                      class="timeline-day"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="timeline-items">
                <div 
                  v-for="project in filteredTimelineProjects" 
                  :key="project.id"
                  class="timeline-project"
                  :class="project.status"
                  :style="{
                    left: `${getTimelinePosition(project.startDate)}%`,
                    width: `${getProjectDuration(project)}%`
                  }"
                  :title="`${project.name} (${formatDate(project.startDate)} - ${project.endDate ? formatDate(project.endDate) : 'Present'})`"
                >
                  <div class="project-label">{{ project.name }}</div>
                </div>
              </div>
            </div>
            
            <div v-if="timelineView === 'gantt'" class="gantt-chart">
              <div class="gantt-header">
                <div class="gantt-project-name">Project</div>
                <div class="gantt-timeline">
                  <div 
                    v-for="month in ganttMonths" 
                    :key="month.date"
                    class="gantt-month"
                  >
                    {{ month.label }}
                  </div>
                </div>
              </div>
              <div class="gantt-body">
                <div 
                  v-for="project in filteredTimelineProjects" 
                  :key="project.id"
                  class="gantt-row"
                >
                  <div class="gantt-project-name">{{ project.name }}</div>
                  <div class="gantt-bar-container">
                    <div 
                      class="gantt-bar"
                      :class="project.status"
                      :style="{
                        left: `${getGanttPosition(project.startDate)}%`,
                        width: `${getGanttDuration(project)}%`
                      }"
                    >
                      <div class="gantt-progress" :style="{ width: `${getProjectProgress(project)}%` }"></div>
                      <div class="gantt-tooltip">
                        {{ project.name }}<br>
                        {{ formatDate(project.startDate) }} - {{ project.endDate ? formatDate(project.endDate) : 'Present' }}<br>
                        Progress: {{ getProjectProgress(project) }}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="activeVisualization === 'tech'" class="tech-chart-container">
            <h3>Technology Usage</h3>
            <div class="tech-chart">
              <div 
                v-for="tech in topTechnologies" 
                :key="tech.name"
                class="tech-bar"
                :style="{ width: `${(tech.count / maxTechCount) * 100}%` }"
                :title="`${tech.name}: ${tech.count} projects`"
              >
                <span class="tech-name">{{ tech.name }}</span>
                <span class="tech-count">{{ tech.count }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="activeVisualization === 'collaborators'" class="collaborators-chart">
            <h3>Top Collaborators</h3>
            <div class="collaborators-list">
              <div 
                v-for="collab in topCollaborators" 
                :key="collab.uid"
                class="collaborator-item"
              >
                <img :src="collab.profileImageUrl || 'https://via.placeholder.com/40'" class="collaborator-avatar" />
                <div class="collaborator-info">
                  <span class="collaborator-name">{{ collab.name || collab.email }}</span>
                  <span class="collaborator-count">{{ collab.count }} projects</span>
                </div>
                <div 
                  class="collaborator-bar"
                  :style="{ width: `${(collab.count / maxCollabCount) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Projects Display -->
      <div class="projects-display-container">
        <div class="display-controls">
          <div class="search-container">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search projects..."
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <div class="control-group">
            <div class="filter-group">
              <label>Status:</label>
              <select v-model="filterStatus">
                <option value="all">All Statuses</option>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Sort by:</label>
              <select v-model="sortBy">
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="date-asc">Start Date (Old-New)</option>
                <option value="date-desc">Start Date (New-Old)</option>
                <option value="status-asc">Status (A-Z)</option>
                <option value="status-desc">Status (Z-A)</option>
              </select>
            </div>
            
            <div class="view-toggle">
              <button 
                @click="currentView = 'list'" 
                :class="{ active: currentView === 'list' }"
                title="List View"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
              </button>
              <button 
                @click="currentView = 'cards'" 
                :class="{ active: currentView === 'cards' }"
                title="Card View"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
                </svg>
              </button>
              <button 
                @click="currentView = 'table'" 
                :class="{ active: currentView === 'table' }"
                title="Table View"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- List View -->
        <div v-if="currentView === 'list' && filteredProjects.length > 0" class="projects-list">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="list-item"
            :class="project.status"
          >
            <div class="list-item-main">
              <div class="project-image-wrapper">
                <img 
                  :src="project.imageUrl || 'https://via.placeholder.com/60'" 
                  alt="Project image"
                />
              </div>
              <div class="project-info">
                <h3 class="project-name">{{ project.name }}</h3>
                <div class="project-meta">
                  <span :class="['project-status', project.status]">
                    {{ formatStatus(project.status) }}
                  </span>
                  <span class="project-date">
                    {{ project.startDate ? formatDate(project.startDate) : '' }}
                    <template v-if="project.endDate"> - {{ formatDate(project.endDate) }}</template>
                  </span>
                </div>
                <p class="project-description">{{ truncateDescription(project.description, 100) }}</p>
              </div>
              <div class="project-progress">
                <div class="progress-container">
                  <div 
                    class="progress-bar" 
                    :style="{ width: getProjectProgress(project) + '%' }"
                  ></div>
                </div>
                <span>{{ getProjectProgress(project) }}%</span>
              </div>
            </div>
            <div class="list-item-footer">
              <div class="project-tech">
                <span 
                  v-for="(tech, index) in project.technologies.slice(0, 5)" 
                  :key="index" 
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>
              <div class="project-actions">
                <button @click="editProject(project)" class="action-btn edit-btn">
                  Edit
                </button>
                <button 
                  v-if="project.status !== 'completed'"
                  @click="markAsComplete(project)" 
                  class="action-btn complete-btn"
                >
                  Complete
                </button>
<button 
  v-if="!project.sharedToCommunity"
  @click="shareToCommunity(project)"
  class="action-btn share-btn"
>
  Share to Community
</button>
                <button @click="confirmDelete(project.id)" class="action-btn delete-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Card View -->
        <div v-if="currentView === 'cards' && filteredProjects.length > 0" class="projects-cards">
          <div class="projects-grid">
            <div 
              v-for="project in filteredProjects" 
              :key="project.id"
              class="project-card"
              :class="project.status"
            >
              <div class="card-header">
                <div class="project-image-wrapper">
                  <img 
                    :src="project.imageUrl || 'https://via.placeholder.com/300x150'" 
                    alt="Project image"
                    class="project-image"
                  />
                </div>
                <div class="project-status-badge">
                  {{ formatStatus(project.status) }}
                </div>
              </div>
              <div class="card-body">
                <h3 class="project-name">{{ project.name }}</h3>
                <p class="project-description">{{ truncateDescription(project.description, 100) }}</p>
                
                <div class="project-dates">
                  <div class="date-item">
                    <span class="date-label">Start:</span>
                    <span class="date-value">{{ project.startDate ? formatDate(project.startDate) : '-' }}</span>
                  </div>
                  <div class="date-item">
                    <span class="date-label">End:</span>
                    <span class="date-value">{{ project.endDate ? formatDate(project.endDate) : '-' }}</span>
                  </div>
                </div>
                
                <div class="project-tech">
                  <label>Technologies:</label>
                  <div class="tech-tags">
                    <span 
                      v-for="(tech, index) in project.technologies.slice(0, 3)" 
                      :key="index" 
                      class="tech-tag"
                    >
                      {{ tech }}
                    </span>
                    <span v-if="project.technologies.length > 3" class="tech-more">
                      +{{ project.technologies.length - 3 }} more
                    </span>
                  </div>
                </div>
                
                <div class="project-collaborators">
                  <label>Collaborators:</label>
                  <div class="collaborators-list">
                    <div 
                      v-for="(collab, index) in project.collaborators.slice(0, 3)" 
                      :key="index"
                      class="collaborator-avatar-wrapper"
                      :title="collab.name || collab.email"
                    >
                      <img 
                        :src="collab.profileImageUrl || 'https://via.placeholder.com/30'" 
                        class="collaborator-avatar"
                      />
                    </div>
                    <div 
                      v-if="project.collaborators.length > 3" 
                      class="collaborator-more"
                    >
                      +{{ project.collaborators.length - 3 }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="progress-container">
                  <div class="progress-bar" :style="{ width: getProjectProgress(project) + '%' }"></div>
                </div>
                <div class="card-actions">
                  <button @click="editProject(project)" class="action-btn edit-btn">
                    Edit
                  </button>
                  <button 
                    v-if="project.status !== 'completed'"
                    @click="markAsComplete(project)" 
                    class="action-btn complete-btn"
                  >
                    Complete
                  </button>
                  <button 
  v-if="!project.sharedToCommunity"
  @click="shareToCommunity(project)"
  class="action-btn share-btn"
>
  Share to Community
</button>
                  <button @click="confirmDelete(project.id)" class="action-btn delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Table View -->
        <div v-if="currentView === 'table' && filteredProjects.length > 0" class="projects-table">
          <table>
            <thead>
              <tr>
                <th @click="sortByField('name')">
                  Project
                  <span class="sort-icon" v-if="sortField === 'name'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('status')">
                  Status
                  <span class="sort-icon" v-if="sortField === 'status'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('startDate')">
                  Start Date
                  <span class="sort-icon" v-if="sortField === 'startDate'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('endDate')">
                  End Date
                  <span class="sort-icon" v-if="sortField === 'endDate'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Technologies</th>
                <th>Collaborators</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in filteredProjects" :key="project.id">
                <td>
                  <div class="project-name-cell">
                    <div class="project-image-wrapper">
                      <img 
                        :src="project.imageUrl || 'https://via.placeholder.com/40'" 
                        alt="Project image"
                        class="project-image"
                      />
                    </div>
                    <div>
                      <span class="project-name">{{ project.name }}</span>
                      <span class="project-description-mobile">{{ truncateDescription(project.description) }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span :class="['project-status', project.status]">
                    {{ formatStatus(project.status) }}
                  </span>
                </td>
                <td>{{ project.startDate ? formatDate(project.startDate) : '-' }}</td>
                <td>{{ project.endDate ? formatDate(project.endDate) : '-' }}</td>
                <td>
                  <div class="tech-tags">
                    <span 
                      v-for="(tech, index) in project.technologies" 
                      :key="index" 
                      class="tech-tag"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="collaborators-list">
                    <div 
                      v-for="(collab, index) in project.collaborators" 
                      :key="index"
                      class="collaborator-avatar-wrapper"
                      :title="collab.name || collab.email"
                    >
                      <img 
                        :src="collab.profileImageUrl || 'https://via.placeholder.com/30'" 
                        class="collaborator-avatar"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div class="progress-cell">
                    <div class="progress-container">
                      <div 
                        class="progress-bar" 
                        :style="{ width: getProjectProgress(project) + '%' }"
                      ></div>
                    </div>
                    <span>{{ getProjectProgress(project) }}%</span>
                  </div>
                </td>
                <td class="actions">
                  <button @click="editProject(project)" class="action-btn edit-btn">
                    Edit
                  </button>
                  <button 
                    v-if="project.status !== 'completed'"
                    @click="markAsComplete(project)" 
                    class="action-btn complete-btn"
                  >
                    Complete
                  </button>
                  <button 
  v-if="!project.sharedToCommunity"
  @click="shareToCommunity(project)"
  class="action-btn share-btn"
>
  Share to Community
</button>
                  <button @click="confirmDelete(project.id)" class="action-btn delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="filteredProjects.length === 0" class="empty-state">
          <div class="empty-icon">📁</div>
          <h3>No projects found</h3>
          <p>{{ searchTerm ? 'Try a different search term' : 'Add your first project to get started' }}</p>
          <button v-if="!searchTerm" @click="showAddForm = true" class="btn primary-btn">
            Add Your First Project
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirm Deletion</h3>
          <button @click="showDeleteModal = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete "{{ projectToDeleteName }}"? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn cancel-btn">Cancel</button>
          <button @click="deleteProject" class="btn delete-btn">Delete</button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { getFirestore,getDoc, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Technology database for autocomplete
const TECHNOLOGY_DB = [
  'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'SASS', 'LESS',
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
  'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'Laravel', 'Spring',
  'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'GraphQL', 'Apollo',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Heroku',
  'Jest', 'Mocha', 'Cypress', 'Selenium', 'JUnit',
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Trello',
  'Webpack', 'Babel', 'ESLint', 'Prettier', 'Vite', 'Rollup',
  'Bootstrap', 'Tailwind CSS', 'Material UI', 'Ant Design', 'Chakra UI',
  'Redux', 'Vuex', 'Pinia', 'MobX', 'RxJS',
  'Three.js', 'D3.js', 'Chart.js', 'GSAP',
  'Electron', 'React Native', 'Flutter', 'Ionic',
  'TensorFlow', 'PyTorch', 'OpenCV',
  'WordPress', 'Shopify', 'Magento', 'WooCommerce'
];

export default {
  name: 'ProjectsManager',
  data() {
    return {
      projects: [],
      loading: true,
      showAddForm: false,
      isEditing: false,
      editingProjectId: null,
      filterStatus: 'all',
      searchTerm: '',
      techInput: '',
      techSearchResults: [],
      collabInput: '',
      collabSearchResults: [],
    sortBy: 'name-asc',
    sortField: 'name',
    sortDirection: 'asc',
    currentView: 'cards',
    currentProject: {
      name: '',
      description: '',
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      technologies: [],
      collaborators: [],
      link: '',
      imageUrl: '',
      progress: 0
    },
    darkMode: false,
    userId: null,
    showDeleteModal: false,
    projectToDelete: null,
    projectToDeleteName: '',
    activeVisualization: 'status',
    visualizationTabs: [
      { id: 'status', label: 'Status' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'tech', label: 'Technologies' },
      { id: 'collaborators', label: 'Collaborators' }
    ],
    allUsers: [],
    // GitHub integration
    showGitHubImport: false,
    githubUsername: '',
    githubRepos: [],
    selectedRepo: '',
    githubRepoDetails: null,
    repoLanguages: {},
    // Timeline views
    timelineView: 'vertical',
    timelineRange: 'all',
    timelineMonths: [],
    ganttMonths: []
  };
},
computed: {
  filteredProjects() {
    let filtered = [...this.projects];
    
    // Apply status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(project => project.status === this.filterStatus);
    }
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        (project.name || '').toLowerCase().includes(term) ||
        (project.description || '').toLowerCase().includes(term) ||
        (project.technologies || []).some(tech => tech.toLowerCase().includes(term)) ||
        (project.collaborators || []).some(collab => 
          (collab.displayName || '').toLowerCase().includes(term) || 
          (collab.email || '').toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    return this.sortProjects(filtered);
  },
  totalProjects() {
    return this.projects.length;
  },
  activeProjects() {
    return this.projects.filter(p => p.status === 'in-progress').length;
  },
  completedProjects() {
    return this.projects.filter(p => p.status === 'completed').length;
  },
  totalCollaborations() {
    return this.projects.reduce((total, project) => {
      return total + (project.collaborators ? project.collaborators.length : 0);
    }, 0);
  },
  progressPercentage() {
    if (this.currentProject.status === 'in-progress' && this.currentProject.progress) {
      return this.currentProject.progress;
    }
    switch(this.currentProject.status) {
      case 'planning': return 25;
      case 'in-progress': return 60;
      case 'completed': return 100;
      case 'on-hold': return 40;
      default: return 0;
    }
  },
  statusDistribution() {
    const distribution = {
      'planning': 0,
      'in-progress': 0,
      'completed': 0,
      'on-hold': 0
    };
    
    this.projects.forEach(project => {
      distribution[project.status]++;
    });
    
    return distribution;
  },
  maxStatusCount() {
    return Math.max(...Object.values(this.statusDistribution));
  },
  filteredTimelineProjects() {
    let projects = [...this.projects];
    
    // Filter by date range
    const now = new Date();
    let startDate = new Date(0); // All time
    
    switch(this.timelineRange) {
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
    }
    
    projects = projects.filter(project => {
      const projectDate = new Date(project.startDate || 0);
      return projectDate >= startDate;
    });
    
    // Sort by date
    return projects.sort((a, b) => {
      const dateA = new Date(a.startDate || 0);
      const dateB = new Date(b.startDate || 0);
      return dateA - dateB;
    });
  },
  technologyUsage() {
    const techMap = {};
    this.projects.forEach(project => {
      (project.technologies || []).forEach(tech => {
        techMap[tech] = (techMap[tech] || 0) + 1;
      });
    });
    return techMap;
  },
  topTechnologies() {
    return Object.entries(this.technologyUsage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },
  maxTechCount() {
    return this.topTechnologies.length > 0 
      ? Math.max(...this.topTechnologies.map(t => t.count))
      : 1;
  },
  collaboratorUsage() {
    const collabMap = {};
    this.projects.forEach(project => {
      (project.collaborators || []).forEach(collab => {
        if (!collabMap[collab.uid]) {
          collabMap[collab.uid] = { ...collab, count: 0 };
        }
        collabMap[collab.uid].count++;
      });
    });
    return collabMap;
  },
  topCollaborators() {
    return Object.values(this.collaboratorUsage)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },
  maxCollabCount() {
    return this.topCollaborators.length > 0 
      ? Math.max(...this.topCollaborators.map(c => c.count))
      : 1;
  }
},
methods: {
    toggleTheme() {
  this.darkMode = !this.darkMode;
  localStorage.setItem('darkMode', this.darkMode);
  // Toggle class on the root element
  if (this.darkMode) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
},
  async shareToCommunity(project) {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error('User profile not found');
      alert('Your profile is not properly set up');
      return;
    }


const communityProject = {
  ...project,
  originalProjectId: project.id,
  ownerId: user.uid,
  ownerName: user.name || 'Anonymous', // Use displayName instead of name
  ownerPhoto: user.profileImageUrl || null, // Use photoURL instead of profileImageUrl
  createdAt: new Date(),
  sharedAt: new Date(),
  likes: 0,
  likesBy: [],
  comments: 0
};
    
    // Remove internal fields we don't want to share
    delete communityProject.id;
    delete communityProject.userId;
    
    // Add to community collection
    const communityCol = collection(db, 'community_projects');
    await addDoc(communityCol, communityProject);
    
    // Update original project to mark as shared
    const projectRef = doc(db, 'users', user.uid, 'projects', project.id);
    await updateDoc(projectRef, {
      sharedToCommunity: true,
      communitySharedAt: new Date()
    });
    
    // Update local state
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      this.projects[index].sharedToCommunity = true;
      this.projects[index].communitySharedAt = new Date();
    }
    
    alert('Project shared to community successfully!');
  } catch (error) {
    console.error("Error sharing to community:", error);
    alert('Failed to share project to community');
  }
},
  async loadProjects() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      this.loading = false;
      return;
    }
    
    this.userId = user.uid;
    const db = getFirestore();
    
    try {
      // Load projects
      const projectsCol = collection(db, 'users', this.userId, 'projects');
      const snapshot = await getDocs(projectsCol);
      
      this.projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Load all users for collaborators
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCol);
      this.allUsers = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      this.loading = false;
    }
  },
  async saveProject() {
  try {
    const db = getFirestore();
    
    // Prepare the project data
    const projectData = {
      name: this.currentProject.name,
      description: this.currentProject.description,
      status: this.currentProject.status,
      startDate: this.currentProject.startDate,
      endDate: this.currentProject.endDate,
      technologies: this.currentProject.technologies || [],
      collaborators: (this.currentProject.collaborators || []).map(collab => ({
        uid: collab.uid,
        email: collab.email,
        name: collab.displayName || collab.name || collab.email.split('@')[0],
        profileImageUrl: collab.profileImageUrl || collab.profilePictureUrl || null
      })),
      link: this.currentProject.link,
      imageUrl: this.currentProject.imageUrl,
      progress: this.currentProject.progress || 0,
      updatedAt: new Date()
    };

    if (this.isEditing) {
      const projectRef = doc(db, 'users', this.userId, 'projects', this.editingProjectId);
      await updateDoc(projectRef, projectData);
      
      // Update local state
      const index = this.projects.findIndex(p => p.id === this.editingProjectId);
      if (index !== -1) {
        this.projects[index] = { 
          ...this.projects[index],
          ...projectData,
          id: this.editingProjectId
        };
      }
    } else {
      projectData.createdAt = new Date();
      projectData.userId = this.userId;
      
      const projectsCol = collection(db, 'users', this.userId, 'projects');
      const docRef = await addDoc(projectsCol, projectData);
      
      this.projects.push({
        id: docRef.id,
        ...projectData
      });
    }
    
    this.resetForm();
    this.showAddForm = false;
    
  } catch (error) {
    console.error("Error saving project:", error);
    alert('Failed to save project. Please check console for details.');
  }
},
async markAsComplete(project) {
    try {
      const db = getFirestore();
      const projectRef = doc(db, 'users', this.userId, 'projects', project.id);
      
      await updateDoc(projectRef, {
        status: 'completed',
        endDate: new Date().toISOString().split('T')[0],
        progress: 100,
        updatedAt: new Date()
      });
      
      // Update local state
      const index = this.projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        this.projects[index] = {
          ...this.projects[index],
          status: 'completed',
          endDate: new Date().toISOString().split('T')[0],
          progress: 100
        };
      }
      
    } catch (error) {
      console.error("Error marking project as complete:", error);
    }
  },
  editProject(project) {
    this.currentProject = {
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      technologies: [...(project.technologies || [])],
      collaborators: [...(project.collaborators || [])],
      link: project.link,
      imageUrl: project.imageUrl,
      progress: project.progress || 0
    };
    
    this.editingProjectId = project.id;
    this.isEditing = true;
    this.showAddForm = true;
    this.showGitHubImport = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  cancelEdit() {
    this.isEditing = false;
    this.editingProjectId = null;
    this.resetForm();
  },
  confirmDelete(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      this.projectToDelete = projectId;
      this.projectToDeleteName = project.name;
      this.showDeleteModal = true;
    }
  },
  async deleteProject() {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'users', this.userId, 'projects', this.projectToDelete));
      
      // Remove from local state
      this.projects = this.projects.filter(project => project.id !== this.projectToDelete);
      
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      this.showDeleteModal = false;
      this.projectToDelete = null;
      this.projectToDeleteName = '';
    }
  },
  resetForm() {
    this.currentProject = {
      name: '',
      description: '',
      status: 'planning',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      technologies: [],
      collaborators: [],
      link: '',
      imageUrl: '',
      progress: 0
    };
    
    this.editingProjectId = null;
    this.isEditing = false;
    this.techInput = '';
    this.techSearchResults = [];
    this.collabInput = '';
    this.collabSearchResults = [];
    this.showGitHubImport = false;
    this.githubRepoDetails = null;
    this.repoLanguages = {};
  },
  async searchTechnologies() {
    if (this.techInput.trim().length > 1) {
      const term = this.techInput.toLowerCase();
      this.techSearchResults = TECHNOLOGY_DB
        .filter(tech => 
          tech.toLowerCase().includes(term) &&
          !this.currentProject.technologies.includes(tech)
        )
        .slice(0, 5);
    } else {
      this.techSearchResults = [];
    }
  },
  selectTechnology(tech) {
    if (!this.currentProject.technologies.includes(tech)) {
      this.currentProject.technologies.push(tech);
    }
    this.techInput = '';
    this.techSearchResults = [];
  },
  addTech() {
    if (this.techInput.trim() && !this.currentProject.technologies.includes(this.techInput.trim())) {
      this.currentProject.technologies.push(this.techInput.trim());
      this.techInput = '';
      this.techSearchResults = [];
    }
  },
  removeTech(index) {
    this.currentProject.technologies.splice(index, 1);
  },
  searchCollaborators() {
    if (this.collabInput.trim()) {
      const term = this.collabInput.toLowerCase();
      this.collabSearchResults = this.allUsers
        .filter(user => 
          (user.displayName || '').toLowerCase().includes(term) || 
          (user.email || '').toLowerCase().includes(term))
        .filter(user => !this.currentProject.collaborators.some(c => c.uid === user.uid))
        .slice(0, 5);
    } else {
      this.collabSearchResults = [];
    }
  },

selectCollaborator(user) {
  if (!this.currentProject.collaborators.some(c => c.uid === user.uid)) {
    this.currentProject.collaborators.push({
      uid: user.uid,
      email: user.email,
      displayName: user.name || user.email.split('@')[0],
      profileImageUrl: user.profileImageUrl || null
    });
  }
  this.collabInput = '';
  this.collabSearchResults = [];
},

removeCollaborator(index) {
  this.currentProject.collaborators.splice(index, 1);
},
  handleStatusChange() {
    if (this.currentProject.status === 'completed') {
      this.currentProject.endDate = new Date().toISOString().split('T')[0];
      this.currentProject.progress = 100;
    }
    
    if (this.currentProject.status !== 'completed') {
      this.currentProject.endDate = '';
    }
    
    if (this.currentProject.status !== 'in-progress') {
      this.currentProject.progress = 0;
    }
  },
  triggerFileInput() {
    this.$refs.fileInput.click();
  },
  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentProject.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  },
  removeImage() {
    this.currentProject.imageUrl = '';
  },
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  },
  formatStatus(status) {
    const statusMap = {
      'planning': 'Planning',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'on-hold': 'On Hold'
    };
    return statusMap[status] || status;
  },
  truncateDescription(description, length = 50) {
    if (!description) return '';
    return description.length > length 
      ? description.substring(0, length) + '...' 
      : description;
  },
  sortProjects(projects) {
    return [...projects].sort((a, b) => {
      let compareA, compareB;
      switch (this.sortField) {
        case 'name':
          compareA = (a.name || '').toLowerCase();
          compareB = (b.name || '').toLowerCase();
          break;
        case 'status':
          compareA = (a.status || '').toLowerCase();
          compareB = (b.status || '').toLowerCase();
          break;
        case 'startDate':
          compareA = new Date(a.startDate || 0);
          compareB = new Date(b.startDate || 0);
          break;
        case 'endDate':
          compareA = new Date(a.endDate || 0);
          compareB = new Date(b.endDate || 0);
          break;
        default:
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
      }
      
      if (compareA < compareB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  },
  sortByField(field) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortBy = `${field}-${this.sortDirection}`;
  },
  getProjectProgress(project) {
    if (project.status === 'in-progress' && project.progress) {
      return project.progress;
    }
    
    switch(project.status) {
      case 'planning': return 25;
      case 'in-progress': return 60;
      case 'completed': return 100;
      case 'on-hold': return 40;
      default: return 0;
    }
  },
  getTimelinePosition(dateString) {
    if (!dateString) return 0;
    
    const dates = this.projects
      .map(p => p.startDate ? new Date(p.startDate) : null)
      .filter(d => d);
    
    if (dates.length === 0) return 50;
    
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    if (minDate.getTime() === maxDate.getTime()) return 50;
    
    const currentDate = new Date(dateString);
    const totalRange = maxDate - minDate;
    const positionFromStart = currentDate - minDate;
    
    return (positionFromStart / totalRange) * 100;
  },
  getProjectDuration(project) {
    if (!project.startDate) return 10;
    
    const startDate = new Date(project.startDate);
    const endDate = project.endDate ? new Date(project.endDate) : new Date();
    const durationDays = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const allDates = this.projects.map(p => {
      const pStart = p.startDate ? new Date(p.startDate) : null;
      const pEnd = p.endDate ? new Date(p.endDate) : new Date();
      return pStart ? (pEnd - pStart) / (1000 * 60 * 60 * 24) : 0;
    });
    
    const maxDuration = Math.max(...allDates, 30);
    
    return (durationDays / maxDuration) * 100;
  },
  getGanttPosition(dateString) {
    if (!dateString) return 0;
    
    const dates = this.filteredTimelineProjects
      .map(p => p.startDate ? new Date(p.startDate) : null)
      .filter(d => d);
    
    if (dates.length === 0) return 0;
    
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date();
    
    const currentDate = new Date(dateString);
    const totalRange = maxDate - minDate;
    const positionFromStart = currentDate - minDate;
    
    return (positionFromStart / totalRange) * 100;
  },
  getGanttDuration(project) {
    if (!project.startDate) return 10;
    
    const startDate = new Date(project.startDate);
    const endDate = project.endDate ? new Date(project.endDate) : new Date();
    const durationDays = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const allDates = this.filteredTimelineProjects.map(p => {
      const pStart = p.startDate ? new Date(p.startDate) : null;
      const pEnd = p.endDate ? new Date(p.endDate) : new Date();
      return pStart ? (pEnd - pStart) / (1000 * 60 * 60 * 24) : 0;
    });
    
    const maxDuration = Math.max(...allDates, 30);
    
    return (durationDays / maxDuration) * 100;
  },
  toggleGitHubImport() {
    this.showGitHubImport = !this.showGitHubImport;
    if (this.showGitHubImport) {
      this.githubRepoDetails = null;
      this.repoLanguages = {};
    }
  },
  async fetchGitHubRepos() {
    try {
      const response = await fetch(`https://api.github.com/users/${this.githubUsername}/repos`);
      this.githubRepos = await response.json();
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      this.githubRepos = [];
    }
  },
  async loadRepoDetails() {
    if (!this.selectedRepo) return;
    
    try {
      // Get repo details
      const repoResponse = await fetch(
        `https://api.github.com/repos/${this.githubUsername}/${this.selectedRepo}`
      );
      this.githubRepoDetails = await repoResponse.json();
      
      // Get repo languages
      const langResponse = await fetch(
        `https://api.github.com/repos/${this.githubUsername}/${this.selectedRepo}/languages`
      );
      const languages = await langResponse.json();
      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
      
      // Calculate percentages
      this.repoLanguages = {};
      for (const [lang, bytes] of Object.entries(languages)) {
        this.repoLanguages[lang] = Math.round((bytes / totalBytes) * 100);
      }
      
    } catch (error) {
      console.error("Error fetching repo details:", error);
      this.githubRepoDetails = null;
      this.repoLanguages = {};
    }
  },
  importFromGitHub() {
    if (!this.githubRepoDetails) return;
    
    this.currentProject = {
      name: this.githubRepoDetails.name,
      description: this.githubRepoDetails.description,
      status: 'in-progress',
      startDate: new Date(this.githubRepoDetails.created_at).toISOString().split('T')[0],
      endDate: this.githubRepoDetails.archived ? 
        new Date(this.githubRepoDetails.pushed_at).toISOString().split('T')[0] : '',
      technologies: Object.keys(this.repoLanguages),
      collaborators: [], // Could fetch contributors here
      link: this.githubRepoDetails.html_url,
      imageUrl: '',
      progress: this.githubRepoDetails.archived ? 100 : 60
    };
    
    this.showGitHubImport = false;
  },
  generateTimelineMonths() {
    const months = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 6); // Show last 6 months by default
    
    while (startDate <= now) {
      const daysInMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      ).getDate();
      
      months.push({
        date: startDate.toISOString(),
        label: startDate.toLocaleString('default', { month: 'short' }),
        days: daysInMonth
      });
      
      startDate.setMonth(startDate.getMonth() + 1);
    }
    
    this.timelineMonths = months;
  },
  generateGanttMonths() {
    const months = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 6); // Show last 6 months by default
    
    while (startDate <= now) {
      months.push({
        date: startDate.toISOString(),
        label: startDate.toLocaleString('default', { month: 'short' })
      });
      
      startDate.setMonth(startDate.getMonth() + 1);
    }
    
    this.ganttMonths = months;
  }
},
created() {
   const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  this.darkMode = savedDarkMode;
  if (this.darkMode) {
    document.documentElement.classList.add('dark-mode');
  }
  this.loadProjects();
  this.generateTimelineMonths();
  this.generateGanttMonths();
},
watch: {
  sortBy(newVal) {
    const [field, direction] = newVal.split('-');
    this.sortField = field;
    this.sortDirection = direction;
  },
  timelineRange() {
    this.generateTimelineMonths();
    this.generateGanttMonths();
  }
}
};
</script>

<style scoped>
/* Dark mode styles */
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

.share-btn {
  background-color: rgba(142, 45, 226, 0.15);
  color: #8E2DE2;
}

.share-btn:hover {
  background-color: rgba(142, 45, 226, 0.25);
}
/* GitHub Import Form Styles */
.github-import-form {
display: flex;
flex-direction: column;
gap: 1.5rem;
}

.repo-selector {
display: flex;
gap: 1rem;
}

.repo-selector select {
flex: 1;
padding: 0.75rem 1rem;
border: 1px solid #e2e8f0;
border-radius: 8px;
font-size: 1rem;
}

.fetch-btn {
padding: 0.75rem 1.5rem;
}

.repo-preview {
background-color: #f8fafc;
padding: 1.5rem;
border-radius: 8px;
border: 1px dashed #e2e8f0;
}

.repo-info {
display: flex;
gap: 1.5rem;
margin-top: 1rem;
}

.repo-image {
width: 100px;
height: 100px;
border-radius: 8px;
overflow: hidden;
flex-shrink: 0;
}

.repo-image img {
width: 100%;
height: 100%;
object-fit: cover;
}

.repo-meta {
flex: 1;
}

.repo-meta h4 {
margin: 0 0 0.5rem;
font-size: 1.25rem;
}

.repo-meta p {
margin: 0 0 1rem;
color: #4a5568;
}

.repo-stats {
display: flex;
gap: 1rem;
margin-bottom: 1rem;
}

.repo-stats span {
font-size: 0.9rem;
color: #718096;
}

.repo-languages {
display: flex;
flex-wrap: wrap;
gap: 0.5rem;
}

.language-tag {
background-color: #e0f7fa;
color: #00838f;
padding: 0.25rem 0.75rem;
border-radius: 50px;
font-size: 0.8rem;
}

.github-btn {
background-color: #24292e;
color: white;
}

.github-btn:hover {
background-color: #1a1f24;
}

/* Timeline View Styles */
.timeline-controls {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 1.5rem;
}

.view-options {
display: flex;
gap: 0.5rem;
}

.view-options button {
padding: 0.5rem 1rem;
border: 1px solid #e2e8f0;
background-color: #f8fafc;
border-radius: 6px;
cursor: pointer;
font-size: 0.9rem;
}

.view-options button.active {
background-color: #3a7bd5;
color: white;
border-color: #3a7bd5;
}

.date-range {
display: flex;
align-items: center;
gap: 0.5rem;
}

.date-range label {
font-weight: 500;
font-size: 0.9rem;
}

.date-range select {
padding: 0.5rem 1rem;
border: 1px solid #e2e8f0;
border-radius: 6px;
background-color: #f8fafc;
}

/* Vertical Timeline */
.vertical-timeline {
position: relative;
padding: 2rem 0;
}

.timeline-line {
position: absolute;
left: 50%;
top: 0;
bottom: 0;
width: 2px;
background-color: #e2e8f0;
transform: translateX(-50%);
}

.timeline-item {
position: relative;
width: 45%;
margin-bottom: 2rem;
padding: 1.5rem;
background-color: white;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-item.alternate {
margin-left: auto;
}

.timeline-dot {
position: absolute;
width: 16px;
height: 16px;
border-radius: 50%;
top: 1.5rem;
transform: translateX(-50%);
}

.timeline-item.planning .timeline-dot {
background-color: #f39c12;
left: calc(100% + 8px);
}

.timeline-item.alternate.planning .timeline-dot {
left: auto;
right: calc(100% + 8px);
transform: translateX(50%);
}

.timeline-item.in-progress .timeline-dot {
background-color: #3498db;
left: calc(100% + 8px);
}

.timeline-item.alternate.in-progress .timeline-dot {
left: auto;
right: calc(100% + 8px);
transform: translateX(50%);
}

.timeline-item.completed .timeline-dot {
background-color: #2ecc71;
left: calc(100% + 8px);
}

.timeline-item.alternate.completed .timeline-dot {
left: auto;
right: calc(100% + 8px);
transform: translateX(50%);
}

.timeline-item.on-hold .timeline-dot {
background-color: #95a5a6;
left: calc(100% + 8px);
}

.timeline-item.alternate.on-hold .timeline-dot {
left: auto;
right: calc(100% + 8px);
transform: translateX(50%);
}

.timeline-date {
font-size: 0.8rem;
color: #718096;
margin-bottom: 0.5rem;
}

.timeline-title {
margin: 0 0 0.5rem;
font-size: 1.1rem;
}

.timeline-status {
display: inline-block;
padding: 0.25rem 0.75rem;
border-radius: 50px;
font-size: 0.8rem;
margin-bottom: 1rem;
}

.timeline-item.planning .timeline-status {
background-color: rgba(243, 156, 18, 0.15);
color: #d35400;
}

.timeline-item.in-progress .timeline-status {
background-color: rgba(52, 152, 219, 0.15);
color: #2980b9;
}

.timeline-item.completed .timeline-status {
background-color: rgba(46, 204, 113, 0.15);
color: #27ae60;
}

.timeline-item.on-hold .timeline-status {
background-color: rgba(149, 165, 166, 0.15);
color: #7f8c8d;
}

.timeline-progress {
display: flex;
align-items: center;
gap: 1rem;
margin-bottom: 1rem;
}

.timeline-progress .progress-container {
flex: 1;
}

.timeline-progress span {
font-size: 0.9rem;
color: #4a5568;
}

.timeline-tech {
display: flex;
flex-wrap: wrap;
gap: 0.5rem;
}

/* Horizontal Timeline */
.horizontal-timeline {
margin-top: 2rem;
}

.timeline-axis {
display: flex;
border-bottom: 1px solid #e2e8f0;
padding-bottom: 0.5rem;
}

.timeline-month {
display: flex;
flex-direction: column;
align-items: center;
}

.month-label {
font-size: 0.8rem;
color: #718096;
margin-bottom: 0.5rem;
}

.month-days {
display: flex;
width: 100%;
}

.timeline-day {
flex: 1;
height: 4px;
border-right: 1px solid #e2e8f0;
}

.timeline-items {
position: relative;
height: 100px;
margin-top: 1rem;
}

.timeline-project {
position: absolute;
height: 30px;
background-color: white;
border-radius: 4px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
display: flex;
align-items: center;
padding: 0 0.75rem;
font-size: 0.9rem;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}

.timeline-project.planning {
background-color: #f39c12;
color: white;
}

.timeline-project.in-progress {
background-color: #3498db;
color: white;
}

.timeline-project.completed {
background-color: #2ecc71;
color: white;
}

.timeline-project.on-hold {
background-color: #95a5a6;
color: white;
}

.project-label {
overflow: hidden;
text-overflow: ellipsis;
}

/* Gantt Chart */
.gantt-chart {
margin-top: 1rem;
}

.gantt-header {
display: flex;
border-bottom: 1px solid #e2e8f0;
padding-bottom: 0.5rem;
margin-bottom: 0.5rem;
}

.gantt-project-name {
width: 200px;
flex-shrink: 0;
font-weight: 600;
padding-right: 1rem;
}

.gantt-timeline {
display: flex;
flex: 1;
}

.gantt-month {
flex: 1;
text-align: center;
font-size: 0.8rem;
color: #718096;
}

.gantt-body {
display: flex;
flex-direction: column;
gap: 0.75rem;
}

.gantt-row {
display: flex;
height: 30px;
align-items: center;
}

.gantt-bar-container {
flex: 1;
height: 20px;
background-color: #f8fafc;
border-radius: 4px;
position: relative;
overflow: hidden;
}

.gantt-bar {
position: absolute;
height: 100%;
border-radius: 4px;
top: 0;
}

.gantt-bar.planning {
background-color: rgba(243, 156, 18, 0.2);
border-left: 3px solid #f39c12;
}

.gantt-bar.in-progress {
background-color: rgba(52, 152, 219, 0.2);
border-left: 3px solid #3498db;
}

.gantt-bar.completed {
background-color: rgba(46, 204, 113, 0.2);
border-left: 3px solid #2ecc71;
}

.gantt-bar.on-hold {
background-color: rgba(149, 165, 166, 0.2);
border-left: 3px solid #95a5a6;
}

.gantt-progress {
height: 100%;
background-color: rgba(255, 255, 255, 0.3);
}

.gantt-tooltip {
position: absolute;
top: 100%;
left: 50%;
transform: translateX(-50%);
background-color: #2d3748;
color: white;
padding: 0.5rem;
} 
.header-section {
  background: linear-gradient(135deg,rgb(17, 58, 115),rgb(12, 25, 69));
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(58, 123, 213, 0.2);
  font-size:3em;
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

.return-to-dash {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}

.return-to-dash:hover {
  color: white;
  text-decoration: underline;
}


.logo img {
  height: 200px;
  width:200px;
  object-fit: contain;
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

/* Projects Container */
.projects-container {
  max-width: 1200px;
  margin: 0 auto;
}

.projects-form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .projects-form-container {
    grid-template-columns: 1fr;
  }
}

/* Projects Form */
.projects-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
}

.projects-form h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.input-with-icon {
  position: relative;
}

.input-with-icon .input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  opacity: 0.6;
}

/* Image Upload */
.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  height: 150px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  border-color: #3a7bd5;
  background-color: rgba(58, 123, 213, 0.05);
}

.upload-placeholder span {
  color: #4a5568;
  font-weight: 500;
}

.image-url-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

/* Tags Input */
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
}

.tag {
  background-color: #e0f7fa;
  color: #00838f;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.collaborator-tag {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
}

.collaborator-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.remove-tag {
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  margin-left: 0.25rem;
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-result-item:hover {
  background-color: #f8fafc;
}

.result-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

/* Milestones */
.milestones-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.milestone-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.milestone-item input[type="text"] {
  flex: 2;
}

.milestone-item input[type="date"] {
  flex: 1;
}

.remove-milestone {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-milestone:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.add-milestone-btn {
  padding: 0.5rem;
  background-color: #f8fafc;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-milestone-btn:hover {
  background-color: #f0fdf4;
  border-color: #86efac;
}

/* Project Preview */
.project-preview {
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px dashed #e2e8f0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.project-status {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.project-status.planning {
  background-color: rgba(243, 156, 18, 0.15);
  color: #d35400;
}

.project-status.in-progress {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.project-status.completed {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.project-status.on-hold {
  background-color: rgba(149, 165, 166, 0.15);
  color: #7f8c8d;
}

.progress-container {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.primary-btn {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
}

.primary-btn:hover {
  background: linear-gradient(135deg, #2a6bc4, #00c2f0);
}

.cancel-btn {
  background-color: #e2e8f0;
  color: #4a5568;
}

.cancel-btn:hover {
  background-color: #cbd5e0;
}

/* Projects Visualization */
.projects-visualization {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
}

.visualization-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.visualization-tabs button {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #4a5568;
}

.visualization-tabs button.active {
  border-bottom-color: #3a7bd5;
  color: #3a7bd5;
  font-weight: 600;
}

.projects-visualization h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-container {
  margin-bottom: 2rem;
}

.chart-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  height: 200px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 120px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.planning {
  background-color: #f39c12;
}

.legend-color.in-progress {
  background-color: #3498db;
}

.legend-color.completed {
  background-color: #2ecc71;
}

.legend-color.on-hold {
  background-color: #95a5a6;
}

.chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 100%;
}

.chart-segment {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  position: relative;
}

.chart-segment.planning {
  background-color: #f39c12;
}

.chart-segment.in-progress {
  background-color: #3498db;
}

.chart-segment.completed {
  background-color: #2ecc71;
}

.chart-segment.on-hold {
  background-color: #95a5a6;
}

/* Timeline Chart */
.timeline-container {
  margin-bottom: 2rem;
}

.timeline-chart {
  height: 60px;
  background-color: #f8fafc;
  border-radius: 8px;
  position: relative;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
}

.timeline-item {
  position: absolute;
  height: 40px;
  top: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.timeline-item.planning {
  background-color: #f39c12;
}

.timeline-item.in-progress {
  background-color: #3498db;
}

.timeline-item.completed {
  background-color: #2ecc71;
}

.timeline-item.on-hold {
  background-color: #95a5a6;
}

.timeline-axis {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
}

.timeline-label {
  font-size: 0.8rem;
  color: #718096;
}

/* Tech Chart */
.tech-chart-container {
  margin-bottom: 2rem;
}

.tech-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tech-bar {
  height: 30px;
  background-color: #3a7bd5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  color: white;
  font-size: 0.9rem;
}

.tech-name {
  font-weight: 500;
}

/* Collaborators Chart */
.collaborators-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.collaborator-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  padding: 0.5rem;
}

.collaborator-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.collaborator-info {
  flex: 1;
  min-width: 0;
}

.collaborator-name {
  font-weight: 500;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collaborator-count {
  font-size: 0.8rem;
  color: #718096;
}

.collaborator-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  background-color: #3a7bd5;
  border-radius: 0 0 4px 4px;
}

/* Display Controls */
.display-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
}

.search-container {
  width:400px;
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-container input {
  width: 80%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.search-container input:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  min-width: 150px;
}

.filter-group select:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
}

.view-toggle {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.view-toggle button {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-toggle button:hover {
  background-color: #f8fafc;
}

.view-toggle button.active {
  background-color: #e0ecff;
}

/* Projects Table */
.projects-table {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  overflow-x: auto;
}

.projects-table table {
  width: 100%;
  border-collapse: collapse;
}

.projects-table th,
.projects-table td {
  padding: 1rem 1.25rem;
  text-align: left;
}

.projects-table th {
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.projects-table th:hover {
  background-color: #f8fafc;
}

.projects-table td {
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.projects-table tr:last-child td {
  border-bottom: none;
}

.projects-table tr:hover td {
  background-color: #f8fafc;
}

.sort-icon {
  margin-left: 0.5rem;
}

.project-name-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.project-image-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-description-mobile {
  display: none;
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.25rem;
}

/* Tech Tags */
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: #e0f7fa;
  color: #00838f;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
}

/* Collaborators List */
.collaborators-list {
  display: flex;
  gap: 0.5rem;
}

.collaborator-avatar-wrapper {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.edit-btn:hover {
  background-color: rgba(52, 152, 219, 0.25);
}

.delete-btn {
  background-color: rgba(231, 76, 60, 0.15);
  color: #c0392b;
}

.delete-btn:hover {
  background-color: rgba(231, 76, 60, 0.25);
}

/* Projects Cards */
.projects-cards {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  position: relative;
  height: 150px;
}

.project-image-wrapper {
  width: 100%;
  height: 100%;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-status-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.project-card.planning .project-status-badge {
  background-color: rgba(243, 156, 18, 0.9);
  color: white;
}

.project-card.in-progress .project-status-badge {
  background-color: rgba(52, 152, 219, 0.9);
  color: white;
}

.project-card.completed .project-status-badge {
  background-color: rgba(46, 204, 113, 0.9);
  color: white;
}

.project-card.on-hold .project-status-badge {
  background-color: rgba(149, 165, 166, 0.9);
  color: white;
}

.card-body {
  padding: 1.25rem;
  flex: 1;
}

.project-name {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.project-description {
  margin: 0 0 1rem;
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.5;
}

.project-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
/* Enhanced List View Styles */
.projects-list {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
}

.list-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #3a7bd5;
}

.list-item-main {
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
  align-items: flex-start;
}

.project-image-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
}

.project-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-name {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.project-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.project-status {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
}

.project-status.planning {
  background-color: rgba(243, 156, 18, 0.15);
  color: #d35400;
}

.project-status.in-progress {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.project-status.completed {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.project-status.on-hold {
  background-color: rgba(149, 165, 166, 0.15);
  color: #7f8c8d;
}

.project-date {
  font-size: 0.85rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-description {
  margin: 0;
  color: #4a5568;
  line-height: 1.5;
}

.project-progress {
  width: 200px;
  flex-shrink: 0;
}

.progress-container {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.list-item.planning .progress-bar {
  background: linear-gradient(90deg, #f39c12, #f1c40f);
}

.list-item.in-progress .progress-bar {
  background: linear-gradient(90deg, #3498db, #2980b9);
}

.list-item.completed .progress-bar {
  background: linear-gradient(90deg, #2ecc71, #27ae60);
}

.list-item.on-hold .progress-bar {
  background: linear-gradient(90deg, #95a5a6, #7f8c8d);
}

.list-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.tech-tag {
  background-color: #e0f7fa;
  color: #00838f;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.edit-btn:hover {
  background-color: rgba(52, 152, 219, 0.25);
}

.complete-btn {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.complete-btn:hover {
  background-color: rgba(46, 204, 113, 0.25);
}

.delete-btn {
  background-color: rgba(231, 76, 60, 0.15);
  color: #c0392b;
}

.delete-btn:hover {
  background-color: rgba(231, 76, 60, 0.25);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .list-item-main {
    flex-direction: column;
    padding: 1rem;
  }
  
  .project-progress {
    width: 100%;
  }
  
  .list-item-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .project-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

.date-item {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.date-value {
  font-size: 0.9rem;
  font-weight: 500;
}

.project-tech {
  margin-bottom: 1rem;
}

.project-tech label {
  display: block;
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.tech-more {
  font-size: 0.8rem;
  color: #718096;
}

.project-collaborators {
  margin-bottom: 1rem;
}

.project-collaborators label {
  display: block;
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.collaborator-more {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #4a5568;
}

.card-footer {
  padding: 0 1.25rem 1.25rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

/* Empty State */
.empty-state {
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
}

.empty-state p {
  margin: 0 0 1.5rem;
  color: #718096;
}

/* Modal */
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
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0 0.5rem;
}

.modal-close:hover {
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.delete-btn {
  background-color: rgba(231, 76, 60, 0.9);
  color: white;
}

.delete-btn:hover {
  background-color: rgba(231, 76, 60, 1);
}

/* Responsive */
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
  
  .display-controls {
    flex-direction: column;
  }
  
  .control-group {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .filter-group {
    flex: 1;
    min-width: 150px;
  }
  
  .projects-table th, 
  .projects-table td {
    padding: 0.75rem;
  }
  
  .project-name-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .project-image-wrapper {
    display: none;
  }
  
  .project-description-mobile {
    display: inline;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}  
/* Progress Slider */
.progress-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
  outline: none;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3a7bd5;
  cursor: pointer;
}

.progress-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3a7bd5;
  cursor: pointer;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.5rem;
}

/* Complete Button */
.complete-btn {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.complete-btn:hover {
  background-color: rgba(46, 204, 113, 0.25);
}

/* Timeline */
.timeline {
  position: relative;
  height: 300px;
  margin: 2rem 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #e2e8f0;
  transform: translateX(-50%);
}

.timeline-item {
  position: absolute;
  width: 200px;
  margin-left: -100px;
  padding: 1rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timeline-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.timeline-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  top: -6px;
}

.timeline-item.planning .timeline-dot {
  background-color: #f39c12;
}

.timeline-item.in-progress .timeline-dot {
  background-color: #3498db;
}

.timeline-item.completed .timeline-dot {
  background-color: #2ecc71;
}

.timeline-item.on-hold .timeline-dot {
  background-color: #95a5a6;
}

.timeline-content {
  text-align: center;
}

.timeline-date {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.timeline-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.timeline-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  display: inline-block;
}

.timeline-item.planning .timeline-status {
  background-color: rgba(243, 156, 18, 0.15);
  color: #d35400;
}

.timeline-item.in-progress .timeline-status {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.timeline-item.completed .timeline-status {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.timeline-item.on-hold .timeline-status {
  background-color: rgba(149, 165, 166, 0.15);
  color: #7f8c8d;
}

/* Project Image in List View */
.project-image-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .timeline-item {
    width: 150px;
    margin-left: -75px;
  }
}
/* Enhanced Card View with Larger Images */
.projects-cards .projects-grid {
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Wider cards */
gap: 2rem;
}

.projects-cards .project-card {
border-radius: 12px;
overflow: hidden;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
transition: all 0.3s ease;
}

.projects-cards .card-header {
position: relative;
height: 240px; /* Increased height for larger image */
}

.projects-cards .project-image-wrapper {
width: 100%;
height: 100%;
}

.projects-cards .project-image {
width: 100%;
height: 100%;
object-fit: cover;
transition: transform 0.3s ease;
}

.projects-cards .project-card:hover .project-image {
transform: scale(1.03); /* Subtle zoom effect */
}

.projects-cards .project-status-badge {
position: absolute;
top: 1rem;
right: 1rem;
padding: 0.5rem 1rem;
border-radius: 50px;
font-size: 0.9rem;
font-weight: 600;
background-color: rgba(255, 255, 255, 0.9);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Larger placeholder image */
.projects-cards .project-image[src*="placeholder.com"] {
background-color: #f5f5f5;
object-fit: contain; /* Show full placeholder without cropping */
padding: 1rem;
}

/* Adjust card body to accommodate larger image */
.projects-cards .card-body {
padding: 1.5rem;
}

/* Make sure other elements don't get too small */
.projects-cards .project-name {
font-size: 1.2rem;
margin-bottom: 1rem;
}

.projects-cards .project-description {
font-size: 0.95rem;
line-height: 1.5;
}
</style>