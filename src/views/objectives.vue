<template>
  <div class="objectives-manager" :class="{ 'dark-mode': darkMode }">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="logo">
          <img src="/logoDev.jpg" alt="Logo" />
          <div class="logo-text">
            <h1>Learning Objectives</h1>
            <router-link to="/dash" class="return-to-dash">
              ← Return to Main Dashboard
            </router-link>
          </div>
        </div>
        
        <div class="theme-toggle-container">
          <button class="theme-toggle" @click="toggleTheme">
            <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
            <span>{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
        </div>
        
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-value">{{ totalObjectives }}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ inProgressObjectives }}</div>
            <div class="stat-label">In Progress</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ completedObjectives }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ overdueObjectives }}</div>
            <div class="stat-label">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Main Content -->
    <div class="objectives-container">
      <!-- Form and Visualization -->
      <div class="objectives-form-container">
        <div class="objectives-form">
          <h2>{{ isEditing ? 'Edit Objective' : 'Add New Objective' }}</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="objectiveTitle">Objective</label>
              <input
                type="text"
                id="objectiveTitle"
                v-model="currentObjective.title"
                placeholder="What do you want to learn?"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="objectiveCategory">Category</label>
              <select id="objectiveCategory" v-model="currentObjective.category" required>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="database">Database</option>
                <option value="devops">DevOps</option>
                <option value="mobile">Mobile Development</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="objectivePriority">Priority</label>
              <select id="objectivePriority" v-model="currentObjective.priority" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="objectiveStatus">Status</label>
              <select id="objectiveStatus" v-model="currentObjective.status" required>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="objectiveDescription">Description</label>
            <textarea
              id="objectiveDescription"
              v-model="currentObjective.description"
              rows="3"
              placeholder="Details about this learning objective"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="targetDate">Target Date</label>
              <input
                type="date"
                id="targetDate"
                v-model="currentObjective.targetDate"
              /><br>
            </div><br>
            
            <div class="form-group" v-if="currentObjective.status === 'in-progress'">
              <label for="objectiveProgress">Progress</label>
              <div class="input-with-icon">
                <input
                  type="range"
                  id="objectiveProgress"
                  v-model.number="currentObjective.progress"
                  min="0"
                  max="100"
                  step="5"
                  @input="updateTooltip"
                  :style="{'--tooltip-position': currentObjective.progress + '%'}"
                >
                <div class="slider-tooltip">
                  Set to {{ currentObjective.progress }}%
                </div>
              </div>
            </div>
          </div>
          
          <div class="objective-preview">
            <div class="preview-header">
              <span>Objective Preview:</span>
              <span :class="['objective-status', currentObjective.status]">
                {{ formatStatus(currentObjective.status) }}
              </span>
            </div>
            <div class="progress-container">
              <div class="progress-bar" :style="{ width: (currentObjective.progress || 0) + '%' }"></div>
            </div>
          </div>
          
          <div class="form-actions">
            <button v-if="isEditing" @click="cancelEdit" class="btn cancel-btn">
              Cancel
            </button>
            <button @click="saveObjective" class="btn primary-btn">
              {{ isEditing ? 'Update Objective' : 'Save Objective' }}
            </button>
          </div>
        </div>
        
        <div class="objectives-visualization">
          <h3>Objectives Overview</h3>
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
      
      <!-- Objectives List -->
      <div class="objectives-list-container">
        <div class="list-controls">
          <div class="search-container">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search objectives..."
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <div class="filter-group">
            <label>Status:</label>
            <select v-model="filterStatus">
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Priority:</label>
            <select v-model="filterPriority">
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Sort by:</label>
            <select v-model="sortBy">
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="priority-asc">Priority (Low-High)</option>
              <option value="priority-desc">Priority (High-Low)</option>
              <option value="date-asc">Date (Old-New)</option>
              <option value="date-desc">Date (New-Old)</option>
            </select>
          </div>
        </div>
        
        <div v-if="filteredObjectives.length > 0" class="objectives-table">
          <table>
            <thead>
              <tr>
                <th @click="sortByField('title')">
                  Objective
                  <span class="sort-icon" v-if="sortField === 'title'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('category')">
                  Category
                  <span class="sort-icon" v-if="sortField === 'category'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('priority')">
                  Priority
                  <span class="sort-icon" v-if="sortField === 'priority'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('status')">
                  Status
                  <span class="sort-icon" v-if="sortField === 'status'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('targetDate')">
                  Target Date
                  <span class="sort-icon" v-if="sortField === 'targetDate'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="objective in filteredObjectives" :key="objective.id">
                <td>
                  <div class="objective-name-cell">
                    <span class="objective-name">{{ objective.title }}</span>
                    <span class="objective-description-mobile">{{ truncateDescription(objective.description) }}</span>
                  </div>
                </td>
                <td class="objective-category">{{ formatCategory(objective.category) }}</td>
                <td>
                  <span :class="['objective-priority', objective.priority]">
                    {{ formatPriority(objective.priority) }}
                  </span>
                </td>
                <td>
                  <span :class="['objective-status', objective.status]">
                    {{ formatStatus(objective.status) }}
                  </span>
                </td>
                <td>{{ objective.targetDate ? formatDate(objective.targetDate) : '-' }}</td>
                <td>
                  <div class="progress-container">
                    <div class="progress-bar" :style="{ width: (objective.progress || 0) + '%' }"></div>
                    <span class="progress-text">{{ objective.progress || 0 }}%</span>
                  </div>
                </td>
                <td class="actions">
                  <button 
                    @click="updateStatus(objective.id, 'in-progress')" 
                    class="action-btn start-btn"
                    v-if="objective.status === 'not-started'"
                  >
                    Start
                  </button>
                  <button 
                    @click="updateStatus(objective.id, 'completed')" 
                    class="action-btn complete-btn"
                    v-if="objective.status === 'in-progress'"
                  >
                    Complete
                  </button>
                  <button @click="editObjective(objective)" class="action-btn edit-btn">
                    Edit
                  </button>
                  <button @click="confirmDelete(objective.id)" class="action-btn delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>No objectives found</h3>
          <p>{{ searchTerm ? 'Try a different search term' : 'Add your first objective to get started' }}</p>
          <button v-if="!searchTerm" @click="showAddForm = true" class="btn primary-btn">
            Add Your First Objective
          </button>
        </div>
      </div>
    </div>
    
    <!-- Objectives Badges -->
    <div class="objectives-badges">
      <h3>Your Learning Path</h3>
      <div class="badges-container">
        <div 
          v-for="objective in objectives" 
          :key="objective.id" 
          :class="['objective-badge', objective.priority, objective.status]"
          @click="editObjective(objective)"
        >
          <span class="badge-name">{{ objective.title }}</span>
          <span class="badge-status">{{ formatStatus(objective.status) }}</span>
          <span class="badge-category">{{ formatCategory(objective.category) }}</span>
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
          <p>Are you sure you want to delete "{{ objectiveToDeleteName }}"? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn cancel-btn">Cancel</button>
          <button @click="deleteObjective" class="btn delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'ObjectivesManager',
  data() {
    return {
      objectives: [],
      loading: true,
      showAddForm: false,
      isEditing: false,
      editingObjectiveId: null,
      filterStatus: 'all',
      filterPriority: 'all',
      searchTerm: '',
      sortBy: 'title-asc',
      sortField: 'title',
      sortDirection: 'asc',
      currentObjective: {
        title: '',
        category: 'frontend',
        priority: 'medium',
        description: '',
        targetDate: '',
        status: 'not-started',
        progress: 0
      },
      userId: null,
      darkMode: false,
      showDeleteModal: false,
      objectiveToDelete: null,
      objectiveToDeleteName: ''
    };
  },
  computed: {
    filteredObjectives() {
      let filtered = [...this.objectives];
      
      // Apply status filter
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter(obj => obj.status === this.filterStatus);
      }
      
      // Apply priority filter
      if (this.filterPriority !== 'all') {
        filtered = filtered.filter(obj => obj.priority === this.filterPriority);
      }
      
      // Apply search filter
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(obj => 
          (obj.title || '').toLowerCase().includes(term) ||
          (obj.description || '').toLowerCase().includes(term) ||
          (obj.category || '').toLowerCase().includes(term))
      }
      
      // Apply sorting
      return this.sortObjectives(filtered);
    },
    totalObjectives() {
      return this.objectives.length;
    },
    inProgressObjectives() {
      return this.objectives.filter(obj => obj.status === 'in-progress').length;
    },
    completedObjectives() {
      return this.objectives.filter(obj => obj.status === 'completed').length;
    },
    overdueObjectives() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return this.objectives.filter(obj => 
        obj.status !== 'completed' && 
        obj.targetDate && 
        new Date(obj.targetDate) < today
      ).length;
    },
    statusDistribution() {
      const distribution = {
        'not-started': 0,
        'in-progress': 0,
        'completed': 0
      };
      
      this.objectives.forEach(obj => {
        distribution[obj.status]++;
      });
      
      return distribution;
    },
    maxStatusCount() {
      return Math.max(...Object.values(this.statusDistribution));
    }
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      // Apply to document element
      if (this.darkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    },
    updateTooltip(event) {
      const tooltip = event.target.nextElementSibling.nextElementSibling;
      if (tooltip) {
        tooltip.style.left = `${event.target.value}%`;
      }
    },
    async loadObjectives() {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        this.loading = false;
        return;
      }
      
      this.userId = user.uid;
      const db = getFirestore();
      
      try {
        const objectivesCol = collection(db, 'users', this.userId, 'objectives');
        const snapshot = await getDocs(objectivesCol);
        
        this.objectives = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
      } catch (error) {
        console.error("Error loading objectives:", error);
      } finally {
        this.loading = false;
      }
    },
    async saveObjective() {
      try {
        const db = getFirestore();
        const objectiveData = {
          ...this.currentObjective,
          userId: this.userId,
          updatedAt: new Date()
        };
        
        if (this.isEditing) {
          // Update existing objective
          const objectiveRef = doc(db, 'users', this.userId, 'objectives', this.editingObjectiveId);
          await updateDoc(objectiveRef, objectiveData);
          
          // Update local state
          const index = this.objectives.findIndex(o => o.id === this.editingObjectiveId);
          if (index !== -1) {
            this.objectives[index] = { id: this.editingObjectiveId, ...objectiveData };
          }
          
        } else {
          // Add new objective
          objectiveData.createdAt = new Date();
          const objectivesCol = collection(db, 'users', this.userId, 'objectives');
          const docRef = await addDoc(objectivesCol, objectiveData);
          
          // Add to local state
          this.objectives.push({
            id: docRef.id,
            ...objectiveData
          });
        }
        
        this.resetForm();
        this.showAddForm = false;
        
      } catch (error) {
        console.error("Error saving objective:", error);
      }
    },
    editObjective(objective) {
      this.currentObjective = {
        title: objective.title,
        category: objective.category,
        priority: objective.priority,
        description: objective.description,
        targetDate: objective.targetDate,
        status: objective.status,
        progress: objective.progress || 0
      };
      
      this.editingObjectiveId = objective.id;
      this.isEditing = true;
      this.showAddForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async updateStatus(objectiveId, newStatus) {
      try {
        const db = getFirestore();
        const objectiveRef = doc(db, 'users', this.userId, 'objectives', objectiveId);
        
        const updates = {
          status: newStatus,
          updatedAt: new Date()
        };
        
        if (newStatus === 'in-progress' && updates.progress === undefined) {
          updates.progress = 10; // Default progress when starting
        }
        
        if (newStatus === 'completed') {
          updates.progress = 100;
        }
        
        await updateDoc(objectiveRef, updates);
        
        // Update local state
        const index = this.objectives.findIndex(o => o.id === objectiveId);
        if (index !== -1) {
          this.objectives[index] = {
            ...this.objectives[index],
            ...updates
          };
        }
        
      } catch (error) {
        console.error("Error updating objective status:", error);
      }
    },
    confirmDelete(objectiveId) {
      const objective = this.objectives.find(o => o.id === objectiveId);
      if (objective) {
        this.objectiveToDelete = objectiveId;
        this.objectiveToDeleteName = objective.title;
        this.showDeleteModal = true;
      }
    },
    async deleteObjective() {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, 'users', this.userId, 'objectives', this.objectiveToDelete));
        
        // Remove from local state
        this.objectives = this.objectives.filter(obj => obj.id !== this.objectiveToDelete);
        
      } catch (error) {
        console.error("Error deleting objective:", error);
      } finally {
        this.showDeleteModal = false;
        this.objectiveToDelete = null;
        this.objectiveToDeleteName = '';
      }
    },
    resetForm() {
      this.currentObjective = {
        title: '',
        category: 'frontend',
        priority: 'medium',
        description: '',
        targetDate: '',
        status: 'not-started',
        progress: 0
      };
      
      this.editingObjectiveId = null;
      this.isEditing = false;
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    formatStatus(status) {
      const statusMap = {
        'not-started': 'Not Started',
        'in-progress': 'In Progress',
        'completed': 'Completed'
      };
      return statusMap[status] || status;
    },
    formatCategory(category) {
      const categoryMap = {
        'frontend': 'Frontend',
        'backend': 'Backend',
        'database': 'Database',
        'devops': 'DevOps',
        'mobile': 'Mobile',
        'other': 'Other'
      };
      return categoryMap[category] || category;
    },
    formatPriority(priority) {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    },
    truncateDescription(description) {
      if (!description) return '';
      return description.length > 50 ? description.substring(0, 50) + '...' : description;
    },
    sortObjectives(objectives) {
      return [...objectives].sort((a, b) => {
        let compareA, compareB;
        switch (this.sortField) {
          case 'title':
            compareA = (a.title || '').toLowerCase();
            compareB = (b.title || '').toLowerCase();
            break;
          case 'category':
            compareA = (a.category || '').toLowerCase();
            compareB = (b.category || '').toLowerCase();
            break;
          case 'priority':
            // Custom sort order for priorities
            const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
            compareA = priorityOrder[a.priority];
            compareB = priorityOrder[b.priority];
            break;
          case 'status':
            // Custom sort order for statuses
            const statusOrder = { 'not-started': 1, 'in-progress': 2, 'completed': 3 };
            compareA = statusOrder[a.status];
            compareB = statusOrder[b.status];
            break;
          case 'targetDate':
            compareA = new Date(a.targetDate || 0);
            compareB = new Date(b.targetDate || 0);
            break;
          default:
            compareA = a.title.toLowerCase();
            compareB = b.title.toLowerCase();
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
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    this.darkMode = savedDarkMode;
    if (this.darkMode) {
      document.documentElement.classList.add('dark-mode');
    }
    this.loadObjectives();
  },
  watch: {
    'currentObjective.status'(newVal) {
      if (newVal === 'completed') {
        this.currentObjective.progress = 100;
      } else if (newVal === 'not-started') {
        this.currentObjective.progress = 0;
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
  body{
    backgroundColor:rgb(12, 37, 62);
  }
  /* Base Styles */
  .dark-mode .objectives-manager {
  background-color: #0f172a; /* Dark blue background */
  color: #e2e8f0; /* Light text color */
}
.objectives-manager {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color:rgb(215, 220, 226);
  background-color:rgb(12, 37, 62);
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Dark Mode Styles */
.dark-mode {
  background-color: #0f172a;
  color: #e2e8f0;
}

.dark-mode .objectives-form,
.dark-mode .objectives-visualization,
.dark-mode .objectives-table,
.dark-mode .empty-state,
.dark-mode .list-controls,
.dark-mode .modal-container {
  background-color: #1e293b;
  color: #e2e8f0;
  border-color:rgb(218, 223, 230);
}

.dark-mode .form-group input,
.dark-mode .form-group select,
.dark-mode .form-group textarea,
.dark-mode .search-container input,
.dark-mode .filter-group select {
  background-color:rgb(28, 41, 59);
  color:rgb(242, 246, 252);
  border-color:rgb(159, 176, 200);
}

.dark-mode .objective-preview {
  background-color:rgb(28, 44, 66);
  border-color:rgb(182, 196, 215);
}

.dark-mode .progress-container {
  background-color:rgb(35, 54, 82);
}

.dark-mode .progress-text {
  color: #e2e8f0;
}

.dark-mode .objective-name,
.dark-mode .objective-category,
.dark-mode .objective-description-mobile,
.dark-mode .empty-state h3 {
  color: #e2e8f0;
}

.dark-mode .empty-state p,
.dark-mode .objective-description-mobile,
.dark-mode .badge-category {
  color:rgb(225, 228, 232);
}

.dark-mode .objective-badge {
  background-color:rgb(19, 33, 55);
  border-color:rgb(20, 38, 63);
}

.dark-mode .header-section {
  background: linear-gradient(135deg, #1e3a8a, #0c4a6e);
}

.dark-mode .stat-card {
  background: rgba(30, 58, 138, 0.3);
}

.dark-mode .return-to-dash {
  color: rgba(248, 243, 243, 0.8);
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
  height: 150px;
  width: 150px;
  object-fit: cover;
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

.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Objectives Container */
.objectives-container {
  max-width: 1200px;
  margin: 0 auto;
}

.objectives-form-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .objectives-form-container {
    grid-template-columns: 1fr;
  }
}

/* Objectives Form */
.objectives-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  transition: all 0.3s ease;
}

.objectives-form h2 {
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

.form-row {
  display: flex;
  gap: 1.5rem;
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

/* Objective Preview */
.objective-preview {
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px dashed #e2e8f0;
  transition: all 0.3s ease;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.objective-status {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.objective-status.not-started {
  background-color: rgba(149, 165, 166, 0.15);
  color: #7f8c8d;
}

.objective-status.in-progress {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.objective-status.completed {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

/* Progress Bar Styles */
.progress-container {
  height: 12px;
  background-color: #edf2f7;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  transition: all 0.3s ease;
}

.progress-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 6px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.progress-container.completed .progress-bar {
  background: linear-gradient(90deg, #38a169, #48bb78);
}

.progress-container.in-progress .progress-bar {
  background: linear-gradient(90deg, #3182ce, #4299e1);
}

.progress-container.not-started .progress-bar {
  background: linear-gradient(90deg, #a0aec0, #cbd5e0);
}

.progress-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* Interactive Progress Bar */
.input-with-icon {
  position: relative;
  width: 100%;
  margin-top: 0.5rem;
}

.input-with-icon input[type="range"] {
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background: #edf2f7;
  outline: none;
  padding: 0;
  margin: 0;
}

  .dark-mode {
  background-color:rgb(27, 48, 82);
}
.dark-mode .projects-form {
  background-color: #334155;
}
.dark-mode .form-group input {
  background-color: #475569;
}
.dar-mode .body{
  background-color:rgb(27, 48, 82);
  
}
  /* Dark Blue Theme */
.dark-mode {
  background-color: #0f172a;  /* Very dark blue */
  color: #e2e8f0;
}

.dark-mode .projects-form,
.dark-mode .projects-visualization,
.dark-mode .projects-display-container,
.dark-mode .projects-list,
.dark-mode .projects-cards,
.dark-mode .projects-table {
  background-color: #1e293b;  /* Slightly lighter dark blue */
  color: #e2e8f0;
  border-color: #334155;      /* Medium dark blue border */
}

.dark-mode .form-group input,
.dark-mode .form-group select,
.dark-mode .form-group textarea {
  background-color: #334155;  /* Input fields in medium dark blue */
  color: #e2e8f0;
  border-color: #475569;
}

.dark-mode .tags-input {
  background-color: #334155;
  border-color: #475569;
}

.dark-mode .tag {
  background-color: #1e40af;  /* Blue accent */
  color: #ebf8ff;
}

.dark-mode .header-section {
  background: linear-gradient(135deg, #1e3a8a, #0c4a6e); /* Dark blue gradient */
}

.dark-mode .stat-card {
  background: rgba(30, 58, 138, 0.3); /* Semi-transparent dark blue */
}

.dark-mode .progress-container {
  background-color: #334155;
}

.dark-mode .progress-bar {
  background: linear-gradient(90deg, #3b82f6, #60a5fa); /* Lighter blue progress */
}

.dark-mode .action-btn.edit-btn {
  background-color: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
}

.dark-mode .action-btn.delete-btn {
  background-color: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

/* Add more dark blue styles as needed */
.return-to-dash {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}
  /* Base Styles */
  .objectives-manager {
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
    height: 150px;
    width: 150px;
    
    object-fit: cover;

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
  
  /* Objectives Container */
  .objectives-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .objectives-form-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 1024px) {
    .objectives-form-container {
      grid-template-columns: 1fr;
    }
  }
  
  /* Objectives Form */
  .objectives-form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
  }
  
  .objectives-form h2 {
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
  
  .form-row {
    display: flex;
    gap: 1.5rem;
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
  
  /* Objective Preview */
  .objective-preview {
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
  
  .objective-status {
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    display: inline-block;
  }
  
  .objective-status.not-started {
    background-color: rgba(149, 165, 166, 0.15);
    color: #7f8c8d;
  }
  
  .objective-status.in-progress {
    background-color: rgba(52, 152, 219, 0.15);
    color: #2980b9;
  }
  
  .objective-status.completed {
    background-color: rgba(46, 204, 113, 0.15);
    color: #27ae60;
  }
  
/* Improved Progress Bar Styles */
.progress-container {
  height: 12px;
  background-color: #edf2f7;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.progress-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
  position: relative;
  overflow: hidden;
}

/* Gradient colors based on progress percentage */
.progress-bar {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 6px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Different colors based on status */
.progress-container.completed .progress-bar {
  background: linear-gradient(90deg, #38a169, #48bb78);
}

.progress-container.in-progress .progress-bar {
  background: linear-gradient(90deg, #3182ce, #4299e1);
}

.progress-container.not-started .progress-bar {
  background: linear-gradient(90deg, #a0aec0, #cbd5e0);
}

/* Progress percentage indicator */
.progress-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* Pulse animation for in-progress items */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

/* Apply pulse to in-progress items */
.objective-status.in-progress {
  position: relative;
}

.objective-status.in-progress::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50px;
  animation: pulse 2s infinite;
  z-index: -1;
}

/* Tooltip for progress bar */
.progress-container:hover .progress-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.progress-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  background: #2d3748;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 10;
  margin-bottom: 5px;
}

.progress-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #2d3748 transparent transparent transparent;
}
/* Improved Interactive Progress Bar */
.input-with-icon {
  position: relative;
  width: 100%;
  margin-top: 0.5rem;
}

.input-with-icon input[type="range"] {
  width: 100%;
  height: 12px;
  border-radius: 6px;
  background: #edf2f7;
  outline: none;
  padding: 0;
  margin: 0;
}

/* Track styling */
.input-with-icon input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 12px;
  cursor: pointer;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  border-radius: 6px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-with-icon input[type="range"]::-moz-range-track {
  width: 100%;
  height: 12px;
  cursor: pointer;
  background: linear-gradient(90deg, #3a7bd5, #00d2ff);
  border-radius: 6px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Thumb styling */
.input-with-icon input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 3px solid #3a7bd5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-top: -6px;
  transition: all 0.2s ease;
}

.input-with-icon input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 3px solid #3a7bd5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

/* Hover effects */
.input-with-icon input[type="range"]:hover::-webkit-slider-thumb {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.input-with-icon input[type="range"]:hover::-moz-range-thumb {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

/* Active/focus effects */
.input-with-icon input[type="range"]:focus::-webkit-slider-thumb {
  border-color: #00d2ff;
  box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.3);
}

.input-with-icon input[type="range"]:focus::-moz-range-thumb {
  border-color: #00d2ff;
  box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.3);
}


.input-with-icon:hover  {
  transform: translateY(-50%) scale(1.05);
}

/* Tooltip for the slider */
.slider-tooltip {
  position: absolute;
  bottom: 100%;
  left: var(--tooltip-position, 50%);
  transform: translateX(-50%) translateY(-10px);
  background: #2d3748;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 10;
  margin-bottom: 5px;
}

.slider-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #2d3748 transparent transparent transparent;
}

.input-with-icon:hover .slider-tooltip {
  opacity: 1;
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
  
  /* Objectives Visualization */
  .objectives-visualization {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
  }
  
  .objectives-visualization h3 {
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
  
  .legend-color.not-started {
    background-color: #95a5a6;
  }
  
  .legend-color.in-progress {
    background-color: #3498db;
  }
  
  .legend-color.completed {
    background-color: #2ecc71;
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
  
  .chart-segment.not-started {
    background-color: #95a5a6;
  }
  
  .chart-segment.in-progress {
    background-color: #3498db;
  }
  
  .chart-segment.completed {
    background-color: #2ecc71;
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
    min-width: 200px;
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
  
  /* Objectives Table */
  .objectives-table {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
    overflow-x: auto;
  }
  
  .objectives-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .objectives-table th,
  .objectives-table td {
    padding: 1rem 1.25rem;
    text-align: left;
  }
  
  .objectives-table th {
    font-weight: 600;
    color: #4a5568;
    border-bottom: 2px solid #e2e8f0;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  
  .objectives-table th:hover {
    background-color: #f8fafc;
  }
  
  .objectives-table td {
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
  }
  
  .objectives-table tr:last-child td {
    border-bottom: none;
  }
  
  .objectives-table tr:hover td {
    background-color: #f8fafc;
  }
  /* Sort Icon */
.sort-icon {
  margin-left: 0.5rem;
  font-weight: bold;
}

/* Objective Priority */
.objective-priority {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.objective-priority.low {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.objective-priority.medium {
  background-color: rgba(241, 196, 15, 0.15);
  color: #f39c12;
}

.objective-priority.high {
  background-color: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
}

/* Progress Text */
.progress-text {
  font-size: 0.9rem;
  color: #4a5568;
  margin-left: 0.5rem;
}

/* Action Buttons */
.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
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
  color: #e74c3c;
}

.delete-btn:hover {
  background-color: rgba(231, 76, 60, 0.25);
}

.start-btn {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.start-btn:hover {
  background-color: rgba(46, 204, 113, 0.25);
}

.complete-btn {
  background-color: rgba(155, 89, 182, 0.15);
  color: #8e44ad;
}

.complete-btn:hover {
  background-color: rgba(155, 89, 182, 0.25);
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
  opacity: 0.5;
}

.empty-state h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.empty-state p {
  color: #718096;
  margin-bottom: 1.5rem;
}

/* Objectives Badges */
.objectives-badges {
  margin-top: 3rem;
  padding: 2rem 0;
}

.objectives-badges h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.badges-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.objective-badge {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  flex: 1 1 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
}

.objective-badge:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.objective-badge.low {
  border-left: 4px solid #27ae60;
}

.objective-badge.medium {
  border-left: 4px solid #f39c12;
}

.objective-badge.high {
  border-left: 4px solid #e74c3c;
}

.objective-badge.not-started {
  background-color: rgba(149, 165, 166, 0.05);
}

.objective-badge.in-progress {
  background-color: rgba(52, 152, 219, 0.05);
}

.objective-badge.completed {
  background-color: rgba(46, 204, 113, 0.05);
}

.badge-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.badge-status {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.badge-category {
  display: block;
  font-size: 0.8rem;
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
  color: #e74c3c;
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

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-stats {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .stat-card {
    min-width: 100px;
    padding: 0.75rem 1rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .list-controls {
    flex-direction: column;
  }
  
  .search-container {
    min-width: 100%;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group select {
    flex: 1;
  }
  
  .objectives-table th,
  .objectives-table td {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}

/* Mobile view for table */
@media (max-width: 640px) {
  .objective-name-cell {
    display: flex;
    flex-direction: column;
  }
  
  .objective-description-mobile {
    font-size: 0.8rem;
    color: #718096;
    margin-top: 0.25rem;
  }
  
  .objective-category {
    display: none;
  }
}
  </style>