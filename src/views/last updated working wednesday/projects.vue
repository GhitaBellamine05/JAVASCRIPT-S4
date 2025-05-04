<template>
  <div class="projects-manager">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="logo">
          <img src="https://via.placeholder.com/60x60" alt="Logo" />
          <h1>Projects Dashboard</h1>
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
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="projects-container">
      <!-- Form and Visualization -->
      <div class="projects-form-container">
        <div class="projects-form">
          <h2>{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h2>
          
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
              <select id="projectStatus" v-model="currentProject.status" required>
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
                placeholder="Add technology"
              />
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
        
        <div class="projects-visualization">
          <h3>Projects Distribution</h3>
          <div class="chart-container">
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
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Projects List -->
      <div class="projects-list-container">
        <div class="list-controls">
          <div class="search-container">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search projects..."
            />
            <span class="search-icon">🔍</span>
          </div>
          
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
        </div>
        
        <div v-if="filteredProjects.length > 0" class="projects-table">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in filteredProjects" :key="project.id">
                <td>
                  <div class="project-name-cell">
                    <span class="project-name">{{ project.name }}</span>
                    <span class="project-description-mobile">{{ truncateDescription(project.description) }}</span>
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
                <td class="actions">
                  <button @click="editProject(project)" class="action-btn edit-btn">
                    Edit
                  </button>
                  <button @click="confirmDelete(project.id)" class="action-btn delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">📁</div>
          <h3>No projects found</h3>
          <p>{{ searchTerm ? 'Try a different search term' : 'Add your first project to get started' }}</p>
          <button v-if="!searchTerm" @click="showAddForm = true" class="btn primary-btn">
            Add Your First Project
          </button>
        </div>
      </div>
    </div>
    
    <!-- Projects Badges -->
    <div class="projects-badges">
      <h3>Your Projects Gallery</h3>
      <div class="badges-container">
        <div 
          v-for="project in projects" 
          :key="project.id" 
          :class="['project-badge', project.status]"
          @click="editProject(project)"
        >
          <span class="badge-name">{{ project.name }}</span>
          <span class="badge-status">{{ formatStatus(project.status) }}</span>
          <span class="badge-tech" v-if="project.technologies && project.technologies.length > 0">
            {{ project.technologies[0] }}
          </span>
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
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
      sortBy: 'name-asc',
      sortField: 'name',
      sortDirection: 'asc',
      currentProject: {
        name: '',
        description: '',
        status: 'planning',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        technologies: [],
        link: ''
      },
      userId: null,
      showDeleteModal: false,
      projectToDelete: null,
      projectToDeleteName: ''
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
          (project.technologies || []).some(tech => tech.toLowerCase().includes(term)));
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
    progressPercentage() {
      // Calculate progress based on status
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
    }
  },
  methods: {
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
        const projectsCol = collection(db, 'users', this.userId, 'projects');
        const snapshot = await getDocs(projectsCol);
        
        this.projects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        this.loading = false;
      }
    },
    async saveProject() {
      try {
        const db = getFirestore();
        const projectData = {
          ...this.currentProject,
          userId: this.userId,
          updatedAt: new Date()
        };
        
        if (this.isEditing) {
          // Update existing project
          const projectRef = doc(db, 'users', this.userId, 'projects', this.editingProjectId);
          await updateDoc(projectRef, projectData);
          
          // Update local state
          const index = this.projects.findIndex(p => p.id === this.editingProjectId);
          if (index !== -1) {
            this.projects[index] = { id: this.editingProjectId, ...projectData };
          }
          
        } else {
          // Add new project
          projectData.createdAt = new Date();
          const projectsCol = collection(db, 'users', this.userId, 'projects');
          const docRef = await addDoc(projectsCol, projectData);
          
          // Add to local state
          this.projects.push({
            id: docRef.id,
            ...projectData
          });
        }
        
        this.resetForm();
        this.showAddForm = false;
        
      } catch (error) {
        console.error("Error saving project:", error);
      }
    },
    editProject(project) {
      this.currentProject = {
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        technologies: [...project.technologies],
        link: project.link
      };
      
      this.editingProjectId = project.id;
      this.isEditing = true;
      this.showAddForm = true;
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
        link: ''
      };
      
      this.editingProjectId = null;
      this.isEditing = false;
      this.techInput = '';
    },
    addTech() {
      if (this.techInput.trim() && !this.currentProject.technologies.includes(this.techInput.trim())) {
        this.currentProject.technologies.push(this.techInput.trim());
        this.techInput = '';
      }
    },
    removeTech(index) {
      this.currentProject.technologies.splice(index, 1);
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
    truncateDescription(description) {
      if (!description) return '';
      return description.length > 50 ? description.substring(0, 50) + '...' : description;
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
    }
  },
  created() {
    this.loadProjects();
  },
  watch: {
    'currentProject.status'(newVal) {
      if (newVal !== 'completed') {
        this.currentProject.endDate = '';
      }
    },
    sortBy(newVal) {
      const [field, direction] = newVal.split('-');
      this.sortField = field;
      this.sortDirection = direction;
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.projects-manager {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(58, 123, 213, 0.2);
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
  height: 60px;
  width: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
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

.projects-visualization h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-container {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  height: 200px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

/* List Controls */
.list-controls {
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
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-container input {
  width: 100%;
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
  flex-direction: column;
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

/* Projects Badges */
.projects-badges {
  margin-top: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
}

.projects-badges h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.badges-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.project-badge {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.project-badge.planning {
  background-color: rgba(243, 156, 18, 0.15);
  color: #d35400;
}

.project-badge.in-progress {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.project-badge.completed {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.project-badge.on-hold {
  background-color: rgba(149, 165, 166, 0.15);
  color: #7f8c8d;
}

.badge-name {
  font-weight: 600;
}

.badge-status {
  font-size: 0.8rem;
  opacity: 0.8;
}

.badge-tech {
  font-size: 0.8rem;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 0.1rem 0.5rem;
  border-radius: 50px;
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
  
  .list-controls {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group select {
    flex: 1;
  }
  
  .projects-table th, 
  .projects-table td {
    padding: 0.75rem;
  }
  
  .project-description-mobile {
    display: inline;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>