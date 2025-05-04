<template>
    <div class="activities-container">
      <div class="header-section">
        <h2 class="page-title">My Activities</h2>
        <div class="header-actions">
          <router-link to='/dash' class="back-link">
            <span class="back-icon">←</span> Return to Discussions
          </router-link>
          <button @click="toggleAddForm" class="add-button">
            {{ showAddForm ? 'Cancel' : 'Add Activity' }}
            <span class="button-icon">{{ showAddForm ? '×' : '+' }}</span>
          </button>
        </div>
      </div>
      
      <transition name="slide-fade">
        <form v-if="showAddForm" @submit.prevent="submitActivity" class="activity-form">
          <div class="form-group">
            <label for="objective">Objective:</label>
            <input 
              type="text" 
              id="objective" 
              v-model="newActivity.objective" 
              required 
              placeholder="What do you want to accomplish?"
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label>Category:</label>
            <div class="category-selector">
              <select 
                id="category" 
                v-model="newActivity.category"
                @change="handleCategoryChange"
                class="form-input"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in allCategories" :value="category" :key="category">
                  {{ category }}
                </option>
                <option value="custom">Custom Category...</option>
              </select>
              <input
                v-if="newActivity.category === 'custom'"
                type="text"
                v-model="newActivity.customCategory"
                placeholder="Enter custom category"
                class="custom-category-input"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>Tools/Technologies:</label>
            <div v-for="(tool, index) in newActivity.tools" :key="`tool-${index}`" class="tool-input">
              <input 
                type="text" 
                v-model="newActivity.tools[index]" 
                :placeholder="`Tool ${index + 1}`"
                class="form-input"
              >
              <button 
                type="button" 
                @click="removeTool(index)" 
                class="remove-tool"
                :disabled="newActivity.tools.length <= 1"
                :title="newActivity.tools.length <= 1 ? 'At least one tool is required' : 'Remove tool'"
              >×</button>
            </div>
            <button type="button" @click="addTool" class="add-tool">+ Add Tool</button>
          </div>
          
          <div class="form-group">
            <label for="progress">Progress (%):</label>
            <div class="progress-input-container">
              <input 
                type="range" 
                id="progress" 
                v-model.number="newActivity.progress" 
                min="0" 
                max="100" 
                step="5"
                class="progress-slider"
                @input="updateProgressColor"
              >
              <span 
                class="progress-value"
                :style="{'color': progressColor}"
              >{{ newActivity.progress }}%</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="priority">Priority:</label>
            <select id="priority" v-model="newActivity.priority" class="form-input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="deadline">Deadline (optional):</label>
            <input 
              type="date" 
              id="deadline" 
              v-model="newActivity.deadline" 
              class="form-input"
              :min="new Date().toISOString().split('T')[0]"
            >
          </div>
          
          <div class="form-group">
            <label for="notes">Notes (optional):</label>
            <textarea
              id="notes"
              v-model="newActivity.notes"
              placeholder="Add any additional notes..."
              class="form-input"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-button">
              <span class="button-icon">✓</span> Save Activity
            </button>
            <button type="button" @click="resetForm" class="reset-button">
              <span class="button-icon">↻</span> Reset
            </button>
          </div>
        </form>
      </transition>
      
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-value">{{ completedActivities }}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ inProgressActivities }}</div>
          <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ highPriorityActivities }}</div>
          <div class="stat-label">High Priority</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ overdueActivities }}</div>
          <div class="stat-label">Overdue</div>
        </div>
      </div>
      
      <!-- Statistics Charts -->
      <div class="charts-container">
        <div class="chart-card">
          <h3>Progress Distribution</h3>
          <div class="chart-wrapper">
            <canvas ref="progressChart"></canvas>
          </div>
        </div>
        
        <div class="chart-card">
          <h3>Category Breakdown</h3>
          <div class="chart-wrapper">
            <canvas ref="categoryChart" class="h"></canvas>
          </div>
        </div>
      </div>
      
      <!-- View Toggle -->
      <div class="view-toggle">
        <button 
          @click="currentView = 'cards'"
          :class="{ 'active': currentView === 'cards' }"
          class="view-btn"
        >
          <i class="fas fa-th-large"></i> Card View
        </button>
        <button 
          @click="currentView = 'list'"
          :class="{ 'active': currentView === 'list' }"
          class="view-btn"
        >
          <i class="fas fa-list"></i> List View
        </button>
        <button 
          @click="currentView = 'table'"
          :class="{ 'active': currentView === 'table' }"
          class="view-btn"
        >
          <i class="fas fa-table"></i> Table View
        </button>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <div>Loading activities...</div>
      </div>
      
      <!-- Card View -->
      <div v-if="!loading && currentView === 'cards' && filteredActivities.length > 0" class="activities-grid">
        <div 
          v-for="activity in filteredActivities" 
          :key="activity.id" 
          class="activity-card"
          :class="{
            'completed-card': activity.progress === 100,
            'priority-high': activity.priority === 'high',
            'priority-medium': activity.priority === 'medium',
            'priority-low': activity.priority === 'low',
            'overdue-card': isOverdue(activity.deadline) && activity.progress !== 100
          }"
        >
          <div class="activity-header">
            <h4 class="activity-title">{{ activity.objective || 'Untitled Activity' }}</h4>
            <div class="activity-meta">
              <span class="activity-date">{{ formatDate(activity.startedAt) }}</span>
              <span 
                class="activity-priority"
                :class="{
                  'priority-high-badge': activity.priority === 'high',
                  'priority-medium-badge': activity.priority === 'medium',
                  'priority-low-badge': activity.priority === 'low'
                }"
              >
                {{ activity.priority || 'medium' }}
              </span>
            </div>
          </div>
          
          <div class="activity-category" v-if="displayCategory(activity)">
            <span class="category-label">Category:</span>
            <span class="category-value">{{ displayCategory(activity) }}</span>
          </div>
          
          <div class="activity-tools" v-if="activity.tools && activity.tools.length > 0">
            <span class="tools-label">Tools:</span>
            <span 
              class="tool-tag" 
              v-for="(tool, tIndex) in activity.tools" 
              :key="`tag-${activity.id}-${tIndex}`"
            >
              {{ tool }}
            </span>
          </div>
          
          <div class="activity-progress">
            <div class="progress-bar-container">
              <div 
                class="progress-bar" 
                :style="{ width: `${activity.progress || 0}%` }"
                :class="{ 
                  'progress-low': (activity.progress || 0) < 30, 
                  'progress-mid': (activity.progress || 0) >= 30 && (activity.progress || 0) < 70,
                  'progress-high': (activity.progress || 0) >= 70 
                }"
              ></div>
            </div>
            <div class="progress-text">{{ activity.progress || 0 }}% complete</div>
          </div>
          
          <div class="activity-notes" v-if="activity.notes">
            <div class="notes-label">Notes:</div>
            <div class="notes-content">{{ activity.notes }}</div>
          </div>
          
          <div class="activity-footer">
            <div class="activity-status">
              Status: <span :class="{ 'status-completed': activity.progress === 100 }">
                {{ activity.progress === 100 ? 'Completed' : 'In progress' }}
              </span>
            </div>
            <div class="activity-deadline" v-if="activity.deadline">
              Deadline: {{ formatDeadline(activity.deadline) }}
              <span 
                class="deadline-warning" 
                v-if="isDeadlineApproaching(activity.deadline) && activity.progress !== 100"
              >
                ⏰
              </span>
              <span 
                class="deadline-danger" 
                v-if="isOverdue(activity.deadline) && activity.progress !== 100"
              >
                ‼️
              </span>
            </div>
            <div class="activity-actions">
                <button 
    @click="markAsComplete(activity.id)" 
    class="action-btn complete"
    v-if="activity.progress !== 100"
    title="Mark as Complete"
  >
    <i class="fas fa-check"></i>
  </button>

              <button @click="editActivity(activity)" class="action-btn edit">
                <i class="fas fa-edit"></i>
              </button>
              <button 
  @click.stop="toggleFavorite(activity.id)" 
  class="action-btn favorite"
  :title="activity.favorite ? 'Remove from favorites' : 'Add to favorites'"
>
  <i :class="activity.favorite ? 'fas fa-star' : 'far fa-star'"></i>
</button>
              <button @click="confirmDelete(activity.id)" class="action-btn delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- List View -->
      <div v-if="!loading && currentView === 'list' && filteredActivities.length > 0" class="activities-list">
        <div 
          v-for="activity in filteredActivities" 
          :key="activity.id" 
          class="activity-item"
          :class="{
            'completed-item': activity.progress === 100,
            'priority-high-item': activity.priority === 'high',
            'overdue-item': isOverdue(activity.deadline) && activity.progress !== 100
          }"
          @click="toggleActivityDetails(activity.id)"
        >
          <div class="item-main">
            <div class="item-title">{{ activity.objective || 'Untitled Activity' }}</div>
            <div class="item-meta">
              <span class="item-category">{{ displayCategory(activity) || 'No category' }}</span>
              <span class="item-date">{{ formatDate(activity.startedAt, true) }}</span>
            </div>
            <div class="item-progress">
              <div class="progress-bar-container">
                <div 
                  class="progress-bar" 
                  :style="{ width: `${activity.progress || 0}%` }"
                  :class="{ 
                    'progress-low': (activity.progress || 0) < 30, 
                    'progress-mid': (activity.progress || 0) >= 30 && (activity.progress || 0) < 70,
                    'progress-high': (activity.progress || 0) >= 70 
                  }"
                ></div>
              </div>
              <span class="progress-text">{{ activity.progress || 0 }}%</span>
            </div>
          </div>
          
          <div v-if="expandedActivities.includes(activity.id)" class="item-details">
            <div class="details-section">
              <h5>Tools & Technologies</h5>
              <div class="tools-container">
                <span 
                  class="tool-tag" 
                  v-for="(tool, tIndex) in activity.tools" 
                  :key="`tag-${activity.id}-${tIndex}`"
                >
                  {{ tool }}
                </span>
              </div>
            </div>
            
            <div class="details-section" v-if="activity.notes">
              <h5>Notes</h5>
              <p class="notes-content">{{ activity.notes }}</p>
            </div>
            
            <div class="details-section">
              <h5>Status</h5>
              <div class="status-info">
                <span class="status-text" :class="{ 'status-completed': activity.progress === 100 }">
                  {{ activity.progress === 100 ? 'Completed' : 'In progress' }}
                </span>
                <span class="priority-badge" :class="`priority-${activity.priority || 'medium'}-badge`">
                  {{ activity.priority || 'medium' }}
                </span>
              </div>
            </div>
            
            <div class="details-actions">
              <button @click.stop="editActivity(activity)" class="btn small-btn">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button 
                @click.stop="updateActivityProgress(activity.id, 100)" 
                class="btn small-btn complete"
                v-if="activity.progress !== 100"
              >
                <i class="fas fa-check"></i> Mark Complete
              </button>
              <button @click.stop="confirmDelete(activity.id)" class="btn small-btn delete">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Table View -->
      <div v-if="!loading && currentView === 'table'" class="activities-table">
        <div class="table-controls">
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search activities..." 
              class="search-input"
            >
            <span class="search-icon">🔍</span>
          </div>
          <div class="filter-container">
            <label>Filter:</label>
            <select v-model="filterStatus" class="filter-select">
              <option value="all">All Activities</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="overdue">Overdue</option>
              <option value="favorites">Favorites</option>
            </select>
            <select v-model="filterCategory" class="filter-select">
    <option value="">All Categories</option>
    <option v-for="category in allCategories" :value="category" :key="'filter-'+category">
      {{ category }}
    </option>
  </select>
          </div>
          <div class="sort-container">
            <label>Sort by:</label>
            <select v-model="sortBy" class="sort-select">
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="progress-asc">Progress (Low to High)</option>
              <option value="progress-desc">Progress (High to Low)</option>
              <option value="priority">Priority</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>
        <!-- Empty state when no results -->
  <div v-if="filteredActivities.length === 0" class="empty-table-state">
    <p>No activities found matching your criteria.</p>
    <button @click="resetFilters" class="reset-filters-btn">
      Reset Filters
    </button>
  </div>
        
        <table v-if = "filteredActivities.length>0">
          <thead>
            <tr>
              <th @click="sortByField('objective')">
                Objective
                <span class="sort-icon" v-if="sortField === 'objective'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortByField('category')">
                Category
                <span class="sort-icon" v-if="sortField === 'category'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortByField('progress')">
                Progress
                <span class="sort-icon" v-if="sortField === 'progress'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortByField('priority')">
                Priority
                <span class="sort-icon" v-if="sortField === 'priority'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortByField('startedAt')">
                Started
                <span class="sort-icon" v-if="sortField === 'startedAt'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortByField('deadline')">
                Deadline
                <span class="sort-icon" v-if="sortField === 'deadline'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="activity in filteredActivities" 
              :key="activity.id"
              :class="{
                'completed-row': activity.progress === 100,
                'priority-high-row': activity.priority === 'high',
                'overdue-row': isOverdue(activity.deadline) && activity.progress !== 100
              }"
            >
              <td>
                <div class="activity-title">
                  {{ activity.objective || 'Untitled Activity' }}
                  <span v-if="activity.favorite" class="favorite-star">★</span>
                </div>
                <div class="activity-tools" v-if="activity.tools && activity.tools.length > 0">
                  <span 
                    class="tool-tag" 
                    v-for="(tool, tIndex) in activity.tools" 
                    :key="`tag-${activity.id}-${tIndex}`"
                  >
                    {{ tool }}
                  </span>
                </div>
              </td>
              <td>{{ displayCategory(activity) || '—' }}</td>
              <td>
                <div class="progress-cell">
                  <div class="progress-bar-container">
                    <div 
                      class="progress-bar" 
                      :style="{ width: `${activity.progress || 0}%` }"
                      :class="{ 
                        'progress-low': (activity.progress || 0) < 30, 
                        'progress-mid': (activity.progress || 0) >= 30 && (activity.progress || 0) < 70,
                        'progress-high': (activity.progress || 0) >= 70 
                      }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ activity.progress || 0 }}%</span>
                </div>
              </td>
              <td>
                <span class="priority-badge" :class="`priority-${activity.priority || 'medium'}-badge`">
                  {{ activity.priority || 'medium' }}
                </span>
              </td>
              <td>{{ formatDate(activity.startedAt, true) }}</td>
              <td>
                <div class="deadline-cell" :class="{ 'overdue': isOverdue(activity.deadline) && activity.progress !== 100 }">
                  {{ activity.deadline ? formatDeadline(activity.deadline) : '—' }}
                  <span 
                    v-if="isDeadlineApproaching(activity.deadline) && activity.progress !== 100"
                    class="deadline-warning"
                  >
                    ⏰
                  </span>
                </div>
              </td>
              <td>
                <div class="table-actions">
                <button 
      @click.stop="markAsComplete(activity.id)" 
      class="action-btn complete"
      v-if="activity.progress !== 100"
      title="Mark as Complete"
    >
      <i class="fas fa-check"></i>
    </button>
                  <button @click.stop="editActivity(activity)" class="action-btn edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
  @click.stop="toggleFavorite(activity.id)" 
  class="action-btn favorite"
  :title="activity.favorite ? 'Remove from favorites' : 'Add to favorites'"
>
  <i :class="activity.favorite ? 'fas fa-star' : 'far fa-star'"></i>
</button>
                  <button @click.stop="confirmDelete(activity.id)" class="action-btn delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!loading && activities.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>No activities yet</h3>
        <p>Start by adding your first activity to track your progress!</p>
        <button @click="toggleAddForm" class="cta-button">
          Add Your First Activity
        </button>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Confirm Deletion</h3>
            <button @click="showDeleteModal = false" class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this activity? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="modal-cancel">Cancel</button>
            <button @click="deleteActivity" class="modal-confirm">Delete</button>
          </div>
        </div>
      </div>
      
      <!-- Activity Log Modal -->
      <div v-if="showLogModal" class="modal-overlay">
        <div class="modal-container large-modal">
          <div class="modal-header">
            <h3>Activity Log: {{ selectedActivity?.objective || 'Untitled Activity' }}</h3>
            <button @click="showLogModal = false" class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <div class="log-container">
              <div class="log-form">
                <h4>Add Log Entry</h4>
                <div class="form-group">
                  <label>Progress Update:</label>
                  <input 
                    type="range" 
                    v-model.number="logProgress" 
                    min="0" 
                    max="100" 
                    step="5"
                    class="progress-slider"
                  >
                  <span class="progress-value">{{ logProgress }}%</span>
                </div>
                <div class="form-group">
                  <label>Notes:</label>
                  <textarea v-model="logNotes" placeholder="Describe what you accomplished..." rows="3"></textarea>
                </div>
                <button @click="addLogEntry" class="btn primary-btn">Add Entry</button>
              </div>
              
              <div class="log-entries">
                <h4>History</h4>
                <div v-if="activityLogs.length === 0" class="empty-logs">
                  No log entries yet
                </div>
                <div 
                  v-for="(log, index) in activityLogs" 
                  :key="index"
                  class="log-entry"
                >
                  <div class="log-header">
                    <span class="log-date">{{ formatDate(log.timestamp) }}</span>
                    <span class="log-progress">{{ log.progress }}%</span>
                  </div>
                  <div class="log-content" v-if="log.notes">{{ log.notes }}</div>
                  <button @click="deleteLogEntry(log.id)" class="log-delete">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs,
    getDoc, 
    query, 
    orderBy, 
    serverTimestamp, 
    doc, 
    updateDoc,
    deleteDoc,
    where
  } from "firebase/firestore";
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);
  import '@fortawesome/fontawesome-free/css/all.min.css'
  export default {
    name: 'EnhancedActivitiesPage',
    
    data() {
      return {
        unsubscribe : null,
        filterCategory: '',
        showCategoriesModal: false,
        newCategory: '',
        db: null,
        auth: null,
        userId: null,
        showAddForm: false,
        activities: [],
        loading: true,
        editingProgressId: null,
        activityProgress: 0,
        progressColor: '#4a89dc',
        searchQuery: '',
        filterStatus: 'all',
        sortBy: 'date-desc',
        sortField: 'date',
        sortDirection: 'desc',
        showDeleteModal: false,
        activityToDelete: null,
        showLogModal: false,
        selectedActivity: null,
        activityLogs: [],
        logProgress: 0,
        logNotes: '',
        currentView: 'cards', // 'cards', 'list', 'table'
        expandedActivities: [],
        progressChart: null,
        categoryChart: null,
        defaultCategories: [
          'Learning', 'Project', 'Work', 'Personal', 
          'Health', 'Finance', 'Creative', 'Other'
        ],
        userCategories: [],
        newActivity: {
          objective: "",
          category: "",
          customCategory: "",
          tools: [""],
          done: false,
          progress: 0,
          priority: "medium",
          deadline: "",
          notes: "",
          favorite: false
        }
      };
    },
    
    computed: {
      allCategories() {
        return [...this.defaultCategories, ...this.userCategories];
      },
      
      completedActivities() {
        return this.activities.filter(a => a.progress === 100).length;
      },
      
      inProgressActivities() {
        return this.activities.filter(a => a.progress < 100).length;
      },
      
      highPriorityActivities() {
        return this.activities.filter(a => a.priority === 'high').length;
      },
      
      overdueActivities() {
        return this.activities.filter(a => this.isOverdue(a.deadline) && a.progress !== 100).length;
      },
      
      filteredActivities() {
        let filtered = [...this.activities];
        
        // Apply status filter
        switch (this.filterStatus) {
          case 'completed':
            filtered = filtered.filter(a => a.progress === 100);
            break;
          case 'in-progress':
            filtered = filtered.filter(a => a.progress < 100);
            break;
          case 'overdue':
            filtered = filtered.filter(a => this.isOverdue(a.deadline) && a.progress !== 100);
            break;
          case 'favorites':
            filtered = filtered.filter(a => a.favorite);
            break;
        }
        if (this.filterCategory) {
    filtered = filtered.filter(a => 
      this.displayCategory(a) === this.filterCategory
    );
  }
    // Apply search filter
        if (this.searchQuery) {
    const query = this.searchQuery.toLowerCase();
    filtered = filtered.filter(a => 
      a.objective.toLowerCase().includes(query) || 
      (a.tools && a.tools.some(tool => tool.toLowerCase().includes(query))) ||
      (a.notes && a.notes.toLowerCase().includes(query)) ||
      this.displayCategory(a).toLowerCase().includes(query)
    );
  }
        // Apply sorting
        switch (this.sortBy) {
          case 'date-asc':
            filtered.sort((a, b) => (a.startedAt?.seconds || 0) - (b.startedAt?.seconds || 0));
            break;
          case 'progress-asc':
            filtered.sort((a, b) => (a.progress || 0) - (b.progress || 0));
            break;
          case 'progress-desc':
            filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
            break;
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            filtered.sort((a, b) => priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium']);
            break;
          case 'deadline':
            filtered.sort((a, b) => {
              if (!a.deadline && !b.deadline) return 0;
              if (!a.deadline) return 1;
              if (!b.deadline) return -1;
              return new Date(a.deadline) - new Date(b.deadline);
            });
            break;
          default: // date-desc
            filtered.sort((a, b) => (b.startedAt?.seconds || 0) - (a.startedAt?.seconds || 0));
        }
        
        return filtered;
      },
      
      progressDistribution() {
        const distribution = {
          '0-20%': 0,
          '21-40%': 0,
          '41-60%': 0,
          '61-80%': 0,
          '81-100%': 0
        };
        
        this.activities.forEach(activity => {
          const progress = activity.progress || 0;
          if (progress <= 20) {
            distribution['0-20%']++;
          } else if (progress <= 40) {
            distribution['21-40%']++;
          } else if (progress <= 60) {
            distribution['41-60%']++;
          } else if (progress <= 80) {
            distribution['61-80%']++;
          } else {
            distribution['81-100%']++;
          }
        });
        
        return distribution;
      },
      
      categoryDistribution() {
        const distribution = {};
        
        this.activities.forEach(activity => {
          const category = this.displayCategory(activity) || 'Uncategorized';
          distribution[category] = (distribution[category] || 0) + 1;
        });
        
        return distribution;
      },
      
      
    },
    
    methods: {
    handleCategoryChange() {
  if (this.newActivity.category === 'custom') {
    this.openCategoriesModal();
    this.newActivity.customCategory = '';
  }
},
    openCategoriesModal() {
    this.showCategoriesModal = true;
    this.newCategory = '';
  },
  
  addCategory() {
    if (this.newCategory.trim() && !this.userCategories.includes(this.newCategory.trim())) {
      this.userCategories.push(this.newCategory.trim());
      this.newCategory = '';
    }
  },
  
  removeCategory(index) {
    this.userCategories.splice(index, 1);
  },
  
  async saveCategories() {
    try {
      if (!this.userId) return;
      
      const userRef = doc(this.db, "users", this.userId);
      await updateDoc(userRef, {
        categories: this.userCategories
      });
      
      this.showCategoriesModal = false;
    } catch (error) {
      console.error("Error saving categories:", error);
      alert(`Failed to save categories: ${error.message}`);
    }
  },
    resetFilters() {
  this.searchQuery = '';
  this.filterStatus = 'all';
  this.sortBy = 'date-desc';
},
      displayCategory(activity) {
        return activity.customCategory || activity.category || '';
      },
      
      toggleAddForm() {
        this.showAddForm = !this.showAddForm;
        if (!this.showAddForm) {
          this.resetForm();
        }
      },
      
      updateProgressColor() {
        const progress = this.newActivity.progress;
        if (progress < 30) {
          this.progressColor = '#ff9800';
        } else if (progress < 70) {
          this.progressColor = '#2196f3';
        } else {
          this.progressColor = '#4caf50';
        }
      },
      
      toggleEditProgress(activityId) {
        if (this.editingProgressId === activityId) {
          this.editingProgressId = null;
        } else {
          const activity = this.activities.find(a => a.id === activityId);
          if (activity) {
            this.activityProgress = activity.progress || 0;
            this.editingProgressId = activityId;
          }
        }
      },
      
      async updateProgress(activityId) {
        try {
          if (!this.userId || !activityId) return;
          
          const progress = parseInt(this.activityProgress) || 0;
          const validProgress = Math.max(0, Math.min(100, progress));
          
          const activityRef = doc(this.db, "users", this.userId, "activities", activityId);
          
          await updateDoc(activityRef, {
            progress: validProgress,
            done: validProgress === 100,
            ...(validProgress === 100 ? { completedAt: serverTimestamp() } : {})
          });
          
          const activityIndex = this.activities.findIndex(a => a.id === activityId);
          if (activityIndex !== -1) {
            this.activities[activityIndex].progress = validProgress;
            this.activities[activityIndex].done = validProgress === 100;
            if (validProgress === 100) {
              this.activities[activityIndex].completedAt = { seconds: Math.floor(Date.now() / 1000) };
            }
          }
          
          this.editingProgressId = null;
          this.updateCharts();
        } catch (error) {
          console.error("Error updating progress:", error);
          alert(`Failed to update progress: ${error.message}`);
        }
      },
      
      async updateActivityProgress(activityId, progress) {
        this.activityProgress = progress;
        await this.updateProgress(activityId);
      },
      
      async completeActivity(activityId) {
        this.activityProgress = 100;
        await this.updateProgress(activityId);
      },
      
      confirmDelete(activityId) {
        this.activityToDelete = activityId;
        this.showDeleteModal = true;
      },
      
      async deleteActivity() {
        try {
          if (!this.userId || !this.activityToDelete) return;
          
          const activityRef = doc(this.db, "users", this.userId, "activities", this.activityToDelete);
          await deleteDoc(activityRef);
          
          this.activities = this.activities.filter(a => a.id !== this.activityToDelete);
          this.showDeleteModal = false;
          this.activityToDelete = null;
          this.updateCharts();
        } catch (error) {
          console.error("Error deleting activity:", error);
          alert(`Failed to delete activity: ${error.message}`);
        }
      },
      
      addTool() {
        this.newActivity.tools.push("");
      },
      
      removeTool(index) {
        this.newActivity.tools.splice(index, 1);
        if (this.newActivity.tools.length === 0) {
          this.newActivity.tools.push("");
        }
      },
      
      resetForm() {
        this.newActivity = {
          objective: "",
          category: "",
          customCategory: "",
          tools: [""],
          done: false,
          progress: 0,
          priority: "medium",
          deadline: "",
          notes: "",
          favorite: false
        };
        this.progressColor = '#4a89dc';
      },
      
      formatDate(timestamp, short = false) {
        if (!timestamp) return 'N/A';
        try {
          const date = timestamp.toDate();
          if (short) {
            return date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            });
          }
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch (error) {
          console.error("Date formatting error:", error);
          return 'Invalid date';
        }
      },
      
      formatDeadline(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        });
      },
      
      isDeadlineApproaching(dateString) {
        if (!dateString) return false;
        const deadline = new Date(dateString);
        const today = new Date();
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0;
      },
      
      isOverdue(dateString) {
        if (!dateString) return false;
        const deadline = new Date(dateString);
        const today = new Date();
        return deadline < today;
      },
      
      sortByField(field) {
        if (this.sortField === field) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortField = field;
          this.sortDirection = 'desc';
        }
        this.sortBy = `${field}-${this.sortDirection}`;
      },
      
      async submitActivity() {
        try {
          if (!this.userId || this.userId.trim() === "") {
            alert("You must be logged in to add activities. Please login and try again.");
            return;
          }
          // Validate and prepare data
    const filteredTools = this.newActivity.tools.filter(tool => tool && tool.trim() !== "");
    const progress = parseInt(this.newActivity.progress) || 0;
    const validProgress = Math.max(0, Math.min(100, progress));
    const isDone = validProgress === 100;

    const activityData = {
      objective: (this.newActivity.objective || "").trim(),
      category: this.newActivity.category === 'custom' ? '' : this.newActivity.category,
      customCategory: this.newActivity.category === 'custom' ? this.newActivity.customCategory : '',
      tools: filteredTools || [],
      done: isDone,
      progress: validProgress,
      priority: this.newActivity.priority || 'medium',
      notes: this.newActivity.notes || '',
      favorite: this.newActivity.favorite || false
    };

    // Add deadline if provided
    if (this.newActivity.deadline) {
      activityData.deadline = this.newActivity.deadline;
    }

    // If editing existing activity
    if (this.currentActivityId) {
      const activityRef = doc(this.db, "users", this.userId, "activities", this.currentActivityId);
      await updateDoc(activityRef, activityData);
      
      // Update local state
      const index = this.activities.findIndex(a => a.id === this.currentActivityId);
      if (index !== -1) {
        this.activities[index] = {
          ...this.activities[index],
          ...activityData
        };
      }
    } 
    // If adding new activity
    else {
      activityData.startedAt = serverTimestamp();
      if (isDone) {
        activityData.completedAt = serverTimestamp();
      }
      
      const userActivitiesRef = collection(this.db, "users", this.userId, "activities");
      await addDoc(userActivitiesRef, activityData);
    }

    await this.loadActivities();
    this.resetForm();
    this.showAddForm = false;
    this.currentActivityId = null;
  } catch (error) {
    console.error("Error saving activity:", error);
    alert(`Failed to save activity: ${error.message}`);
  }
},
      
      async loadActivities() {
        if (!this.userId) {
          console.warn("Cannot load activities: No user ID available");
          this.loading = false;
          this.activities = [];
          return;
        }
        
        this.loading = true;
        try {
          const userActivitiesRef = collection(this.db, "users", this.userId, "activities");
          const activitiesQuery = query(userActivitiesRef, orderBy("startedAt", "desc"));
          const querySnapshot = await getDocs(activitiesQuery);
          
          this.activities = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const progress = parseInt(data.progress) || 0;
            
            return {
              id: doc.id,
              objective: data.objective || "Untitled Activity",
              category: data.category || '',
              customCategory: data.customCategory || '',
              tools: Array.isArray(data.tools) ? data.tools : [],
              done: progress === 100 ? true : Boolean(data.done),
              startedAt: data.startedAt || null,
              completedAt: data.completedAt || null,
              userId: data.userId || this.userId,
              progress: progress,
              priority: data.priority || 'medium',
              deadline: data.deadline || null,
              notes: data.notes || '',
              favorite: data.favorite || false
            };
          });
          
          // Load user categories if they exist
          const userDocRef = doc(this.db, "users", this.userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().categories) {
            this.userCategories = userDoc.data().categories;
          }
          
          this.updateCharts();
        } catch (error) {
          console.error("Error loading activities:", error);
          if (error.code === 'permission-denied') {
            alert("Permission denied. You may not have access to view these activities.");
          } else {
            alert(`Failed to load activities: ${error.message}`);
          }
          this.activities = [];
        } finally {
          this.loading = false;
        }
      },
      
      async toggleFavorite(activityId) {
        try {
          if (!this.userId || !activityId) return;
          
          const activity = this.activities.find(a => a.id === activityId);
          if (!activity) return;
          
          const newFavoriteStatus = !activity.favorite;
          const activityRef = doc(this.db, "users", this.userId, "activities", activityId);
          
          await updateDoc(activityRef, {
            favorite: newFavoriteStatus
          });
          
          activity.favorite = newFavoriteStatus;
        } catch (error) {
          console.error("Error toggling favorite:", error);
          alert(`Failed to update favorite status: ${error.message}`);
        }
      },
      async markAsComplete(activityId) {
  try {
    if (!this.userId || !activityId) return;
    
    const activityRef = doc(this.db, "users", this.userId, "activities", activityId);
    
    await updateDoc(activityRef, {
      progress: 100,
      done: true,
      completedAt: serverTimestamp()
    });
    
    // Update local state
    const activity = this.activities.find(a => a.id === activityId);
    if (activity) {
      activity.progress = 100;
      activity.done = true;
      activity.completedAt = { seconds: Math.floor(Date.now() / 1000) };
    }
    
    this.updateCharts();
  } catch (error) {
    console.error("Error marking as complete:", error);
    alert(`Failed to mark as complete: ${error.message}`);
  }
},
      
      editActivity(activity) {
        this.newActivity = { 
          objective: activity.objective,
          category: activity.customCategory ? 'custom' : activity.category || '',
          customCategory: activity.customCategory || '',
          tools: [...(activity.tools || [])],
          progress: activity.progress || 0,
          priority: activity.priority || 'medium',
          deadline: activity.deadline || '',
          notes: activity.notes || '',
          favorite: activity.favorite || false
        };
        
        this.currentActivityId = activity.id;
        this.isEditing = true;
        this.showAddForm = true;
        
        // Scroll to form
        this.$nextTick(() => {
          document.querySelector('.activity-form')?.scrollIntoView({ behavior: 'smooth' });
        });
      },
      
      toggleActivityDetails(activityId) {
        const index = this.expandedActivities.indexOf(activityId);
        if (index === -1) {
          this.expandedActivities.push(activityId);
        } else {
          this.expandedActivities.splice(index, 1);
        }
      },
      
      async showActivityLog(activity) {
        this.selectedActivity = activity;
        this.logProgress = activity.progress || 0;
        this.logNotes = '';
        this.showLogModal = true;
        
        try {
          const logsRef = collection(this.db, "users", this.userId, "activities", activity.id, "logs");
          const logsQuery = query(logsRef, orderBy("timestamp", "desc"));
          const querySnapshot = await getDocs(logsQuery);
          
          this.activityLogs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.error("Error loading activity logs:", error);
          this.activityLogs = [];
        }
      },
      
      async addLogEntry() {
        try {
          if (!this.userId || !this.selectedActivity) return;
          
          const logsRef = collection(this.db, "users", this.userId, "activities", this.selectedActivity.id, "logs");
          
          await addDoc(logsRef, {
            progress: this.logProgress,
            notes: this.logNotes,
            timestamp: serverTimestamp()
          });
          
          // Update activity progress if changed
          if (this.logProgress !== this.selectedActivity.progress) {
            await this.updateActivityProgress(this.selectedActivity.id, this.logProgress);
          }
          
          // Reload logs
          await this.showActivityLog(this.selectedActivity);
          this.logNotes = '';
        } catch (error) {
          console.error("Error adding log entry:", error);
          alert(`Failed to add log entry: ${error.message}`);
        }
      },
      
      async deleteLogEntry(logId) {
        try {
          if (!this.userId || !this.selectedActivity || !logId) return;
          
          const logRef = doc(this.db, "users", this.userId, "activities", this.selectedActivity.id, "logs", logId);
          await deleteDoc(logRef);
          
          this.activityLogs = this.activityLogs.filter(log => log.id !== logId);
        } catch (error) {
          console.error("Error deleting log entry:", error);
          alert(`Failed to delete log entry: ${error.message}`);
        }
      },
      
      updateCharts() {
        if (!this.$refs.progressChart || !this.$refs.categoryChart) return;
        
        // Destroy existing charts if they exist
        if (this.progressChart) this.progressChart.destroy();
        if (this.categoryChart) this.categoryChart.destroy();
        
        // Progress Distribution Chart
        this.progressChart = new Chart(this.$refs.progressChart, {
    type: 'bar',
    data: {
      labels: ['Not Started (0%)', 'Beginning (1-20%)', 'Progressing (21-50%)', 'Almost There (51-90%)', 'Completed (91-100%)'],
      datasets: [{
        label: 'Number of Activities',
        data: [
          this.activities.filter(a => (a.progress || 0) === 0).length,
          this.activities.filter(a => (a.progress || 0) > 0 && (a.progress || 0) <= 20).length,
          this.activities.filter(a => (a.progress || 0) > 20 && (a.progress || 0) <= 50).length,
          this.activities.filter(a => (a.progress || 0) > 50 && (a.progress || 0) <= 90).length,
          this.activities.filter(a => (a.progress || 0) > 90).length
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',    // Red - Not started
          'rgba(255, 159, 64, 0.7)',    // Orange - Beginning
          'rgba(255, 205, 86, 0.7)',    // Yellow - Progressing
          'rgba(54, 162, 235, 0.7)',   // Blue - Almost there
          'rgba(75, 192, 192, 0.7)'    // Green - Completed
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position : 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} activities`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Activities'
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          title: {
            display: true,
            text: 'Progress Stage'
          }
        }
      }
    }
  });
        
        
        // Category Chart
        const categoryLabels = Object.keys(this.categoryDistribution);
        const categoryValues = Object.values(this.categoryDistribution);
        
        this.categoryChart = new Chart(this.$refs.categoryChart, {
          type: 'doughnut',
          data: {
            labels: categoryLabels,
            datasets: [{
              data: categoryValues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
                        maintainAspectRatio: false,

            plugins: {
              legend: {
                position: 'right'
              }
            }
          }
        });
      }
    },
     
    beforeUnmount() {
      if (this.unsubscribe) {
      this.unsubscribe();
    }
  if (this.progressChart) this.progressChart.destroy();
  if (this.timelineChart) this.timelineChart.destroy();
  if (this.categoryChart) this.categoryChart.destroy();
},
    mounted() {
      this.db = getFirestore();
      this.auth = getAuth();
      
       this.unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          this.userId = user.uid;
          await this.loadActivities();
        } else {
          this.userId = null;
          this.activities = [];
          this.loading = false;
        }
      });
     
    }
  }
  </script>
  
  <style scoped>
  /* Base Styles */
  .activities-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f5f9ff;
    min-height: 100vh;
  }
  
  /* Header Section */
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #d6e4ff;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #2c3e50;
    background: linear-gradient(to right, #3a7bd5, #00d2ff);
    -webkit-text-fill-color: transparent;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  /* Buttons */
  .button-icon {
    margin-left: 5px;
    font-weight: bold;
  }
  
  .add-button {
    background: linear-gradient(135deg, #3a7bd5, #00d2ff);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(58, 123, 213, 0.2);
  }
  
  .add-button:hover {
    background: linear-gradient(135deg, #2a6bc4, #00c2f0);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(58, 123, 213, 0.3);
  }
  
  .back-link {
    text-decoration: none;
    color: #3a7bd5;
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 0.5rem;
    border-radius: 4px;
  }
  
  .back-link:hover {
    background-color: rgba(58, 123, 213, 0.1);
  }
  
  .back-icon {
    margin-right: 5px;
    font-weight: bold;
  }
  
  /* Form Styles */
  .activity-form {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e0ecff;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: #f5f9ff;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #3a7bd5;
    box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
  }
  
  textarea.form-input {
    min-height: 100px;
    resize: vertical;
  }
  
  /* Category Selector */
  .category-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .custom-category-input {
    padding: 0.75rem;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: #f5f9ff;
  }
  
  /* Tool Inputs */
  .tool-input {
    display: flex;
    margin-bottom: 0.5rem;
    align-items: center;
  }
  
  .tool-input input {
    flex-grow: 1;
    margin-right: 0.5rem;
  }
  
  .remove-tool {
    background: #ff6b6b;
    color: white;
    border: none;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .remove-tool:hover {
    background: #ff5252;
    transform: scale(1.1);
  }
  
  .remove-tool:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
  
  .add-tool {
    background: #4dabf7;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .add-tool:hover {
    background: #339af0;
  }
  
  /* Progress Input */
  .progress-input-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .progress-slider {
    flex-grow: 1;
    height: 8px;
    border-radius: 4px;
    background: #e0ecff;
    outline: none;
    transition: all 0.3s ease;
  }
  
  .progress-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3a7bd5;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  .progress-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    background: #2a6bc4;
  }
  
  .progress-value {
    min-width: 3.5rem;
    font-weight: 600;
    text-align: center;
  }
  
  /* Form Actions */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .save-button {
    background: linear-gradient(135deg, #4dabf7, #3a7bd5);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(77, 171, 247, 0.3);
  }
  
  .save-button:hover {
    background: linear-gradient(135deg, #339af0, #2a6bc4);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(77, 171, 247, 0.4);
  }
  
  .reset-button {
    background-color: #e0ecff;
    color: #3a7bd5;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }
  
  .reset-button:hover {
    background-color: #d0e0ff;
  }
  
  /* Stats Container */
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    border: 1px solid #e0ecff;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #3a7bd5;
  }
  
  .stat-label {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  /* Charts Container */
  .charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .chart-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    border: 1px solid #e0ecff;
  }
  
  .chart-card h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #2c3e50;
    font-size: 1.25rem;
  }
  
  .chart-wrapper {
    position: relative;
    height: 250px;
    width:100%;
  }
  
  
  /* View Toggle */
  .view-toggle {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    border: 1px solid #e0ecff;
  }
  
  .view-btn {
    background: #e0ecff;
    color: #3a7bd5;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .view-btn.active {
    background: #3a7bd5;
    color: white;
  }
  
  .view-btn:hover:not(.active) {
    background: #d0e0ff;
  }
  
  /* Loading State */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #6c757d;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(58, 123, 213, 0.2);
    border-radius: 50%;
    border-top-color: #3a7bd5;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Card View */
  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .activity-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    border: 1px solid #e0ecff;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  
  .activity-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  }
  
  .activity-card.completed-card {
    border-left: 4px solid #51cf66;
  }
  
  .activity-card.priority-high {
    border-left: 4px solid #ff6b6b;
  }
  
  .activity-card.priority-medium {
    border-left: 4px solid #ff922b;
  }
  
  .activity-card.priority-low {
    border-left: 4px solid #51cf66;
  }
  
  .activity-card.overdue-card {
    border-left: 4px solid #ff6b6b;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
  }
  
  .activity-header {
    margin-bottom: 1rem;
  }
  
  .activity-title {
    margin: 0;
    font-size: 1.25rem;
    color: #2c3e50;
    word-break: break-word;
  }
  
  .activity-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #6c757d;
  }
  
  .activity-date {
    font-size: 0.8rem;
  }
  
  .activity-priority {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  
  .priority-high-badge {
    background-color: #fff0f0;
    color: #e03131;
  }
  
  .priority-medium-badge {
    background-color: #fff4e6;
    color: #e67700;
  }
  
  .priority-low-badge {
    background-color: #ebfbee;
    color: #2b8a3e;
  }
  
  .activity-category {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }
  
  .category-label {
    font-weight: 600;
    margin-right: 0.5rem;
  }
  
  /* Activity Tools */
  .activity-tools {
    margin: 1rem 0;
  }
  
  .tools-label {
    font-weight: 600;
    margin-right: 0.5rem;
    font-size: 0.9rem;
  }
  
  .tool-tag {
    display: inline-block;
    background: #e3f2fd;
    color: #1976d2;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .tool-tag:hover {
    background: #bbdefb;
    transform: translateY(-1px);
  }
  
  /* Progress Bar */
  .activity-progress {
    margin: 1rem 0;
  }
  
  .progress-bar-container {
    height: 8px;
    background-color: #e0ecff;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  
  .progress-bar {
    height: 100%;
    transition: width 0.5s ease;
  }
  
  .progress-low {
    background-color: #ff922b;
  }
  
  .progress-mid {
    background-color: #3a7bd5;
  }
  
  .progress-high {
    background-color: #51cf66;
  }
  
  .progress-text {
    font-size: 0.9rem;
    color: #6c757d;
    text-align: center;
  }
  
  /* Activity Notes */
  .activity-notes {
    margin: 1rem 0;
    font-size: 0.9rem;
  }
  
  .notes-label {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .notes-content {
    background: #f5f9ff;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px dashed #d6e4ff;
    white-space: pre-wrap;
  }
  
  /* Activity Footer */
  .activity-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.85rem;
    padding-top: 1rem;
    border-top: 1px solid #e0ecff;
  }
  
  .activity-status {
    color: #6c757d;
  }
  
  .status-completed {
    color: #51cf66;
    font-weight: 600;
  }
  
  .activity-deadline {
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .deadline-warning {
    color: #ff922b;
    font-size: 1rem;
  }
  
  .deadline-danger {
    color: #ff6b6b;
    font-size: 1rem;
  }
  
  .activity-actions {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }
  
  .action-btn {
    background: none;
    border: none;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .action-btn.edit {
    color: #3a7bd5;
  }
  .action-btn.complete {
  color: #4CAF50; /* Green color */
}

.action-btn.complete:hover {
  color: #3d8b40; /* Darker green on hover */
}
  
  .action-btn.edit:hover {
    background: rgba(58, 123, 213, 0.1);
  }
  
  .action-btn.favorite {
    color: #f1c40f;
  }
  
  .action-btn.favorite:hover {
    background: rgba(241, 196, 15, 0.1);
  }
  
  .action-btn.delete {
    color: #ff6b6b;
  }
  
  .action-btn.delete:hover {
    background: rgba(255, 107, 107, 0.1);
  }
  
  /* List View */
  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .activity-item {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    border: 1px solid #e0ecff;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .activity-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .activity-item.completed-item {
    border-left: 4px solid #51cf66;
  }
  
  .activity-item.priority-high-item {
    border-left: 4px solid #ff6b6b;
  }
  
  .activity-item.overdue-item {
    border-left: 4px solid #ff6b6b;
    animation: pulse 2s infinite;
  }
  
  .item-main {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .item-title {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .item-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    color: #6c757d;
  }
  
  .item-category {
    font-weight: 500;
  }
  
  .item-date {
    margin-left: auto;
  }
  
  .item-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .item-progress .progress-bar-container {
    flex-grow: 1;
    height: 6px;
  }
  
  .item-progress .progress-text {
    font-size: 0.8rem;
    min-width: 3rem;
  }
  
  .item-details {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed #e0ecff;
  }
  
  .details-section {
    margin-bottom: 1rem;
  }
  
  .details-section h5 {
    margin: 0 0 0.5rem;
    font-size: 0.9rem;
    color: #2c3e50;
  }
  
  .tools-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .notes-content {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #495057;
  }
  
  .status-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .status-text {
    font-size: 0.9rem;
  }
  
  .status-completed {
    color: #51cf66;
    font-weight: 600;
  }
  
  .priority-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  
  .priority-high-badge {
    background-color: #fff0f0;
    color: #e03131;
  }
  
  .priority-medium-badge {
    background-color: #fff4e6;
    color: #e67700;
  }
  
  .priority-low-badge {
    background-color: #ebfbee;
    color: #2b8a3e;
  }
  
  .details-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }
  
  .btn.small-btn {
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .btn.complete {
    background: #51cf66;
    color: white;
  }
  
  .btn.complete:hover {
    background: #40c057;
  }
  
  .btn.delete {
    background: #ff6b6b;
    color: white;
  }
  
  .btn.delete:hover {
    background: #ff5252;
  }
  
  /* Table View */
  .activities-table {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    border: 1px solid #e0ecff;
    overflow-x: auto;
  }
  
  .table-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    align-items: center;
  }
  
  .search-container {
    position: relative;
    flex-grow: 1;
    min-width: 200px;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: #f5f9ff;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #3a7bd5;
    box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
  }
  
  .filter-container, .sort-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .filter-select, .sort-select {
    padding: 0.75rem;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    background-color: #f5f9ff;
  }
  
  .filter-select:focus, .sort-select:focus {
    outline: none;
    border-color: #3a7bd5;
    box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0ecff;
  }
  
  th {
    font-weight: 600;
    color: #2c3e50;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  
  th:hover {
    background-color: #f5f9ff;
  }
  
  .sort-icon {
    margin-left: 0.5rem;
  }
  
  tr:hover td {
    background-color: #f5f9ff;
  }
  
  .completed-row {
    background-color: rgba(81, 207, 102, 0.05);
  }
  
  .priority-high-row {
    background-color: rgba(255, 107, 107, 0.05);
  }
  
  .overdue-row {
    animation: pulse-bg 2s infinite;
  }
  
  @keyframes pulse-bg {
    0% { background-color: rgba(255, 107, 107, 0.05); }
    50% { background-color: rgba(255, 107, 107, 0.1); }
    100% { background-color: rgba(255, 107, 107, 0.05); }
  }
  
  .activity-title {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .favorite-star {
    color: #f1c40f;
    margin-left: 0.5rem;
  }
  
  .progress-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .progress-cell .progress-bar-container {
    flex-grow: 1;
    height: 6px;
  }
  
  .progress-cell .progress-text {
    min-width: 3rem;
    text-align: right;
  }
  
  .deadline-cell {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .deadline-cell.overdue {
    color: #ff6b6b;
    font-weight: 500;
  }
  
  .table-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    margin-top: 2rem;
    border: 1px solid #e0ecff;
  }
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.7;
    color: #3a7bd5;
  }
  
  .empty-state h3 {
    margin: 0.5rem 0;
    color: #2c3e50;
  }
  
  .empty-state p {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
  
  .cta-button {
    background: linear-gradient(135deg, #3a7bd5, #00d2ff);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(58, 123, 213, 0.2);
  }
  
  .cta-button:hover {
    background: linear-gradient(135deg, #2a6bc4, #00c2f0);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(58, 123, 213, 0.3);
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
    animation: fadeIn 0.3s ease;
  }
  
  .modal-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 500px;
    overflow: hidden;
    animation: modalSlideUp 0.3s ease;
  }
  
  .modal-container.large-modal {
    max-width: 800px;
  }
  
  @keyframes modalSlideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e0ecff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h3 {
    margin: 0;
    color: #2c3e50;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
    transition: all 0.3s ease;
    padding: 0.25rem;
  }
  
  .modal-close:hover {
    color: #ff6b6b;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .log-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .log-form {
    padding: 1rem;
    border-right: 1px solid #e0ecff;
  }
  
  .log-entries {
    padding: 1rem;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .log-entry {
    position: relative;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #f5f9ff;
    border-radius: 8px;
    border: 1px solid #e0ecff;
  }
  
  .log-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .log-date {
    color: #6c757d;
    font-size: 0.85rem;
  }
  
  .log-progress {
    color: #3a7bd5;
    font-weight: 600;
  }
  
  .log-content {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #495057;
  }
  
  .log-delete {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: #ff6b6b;
    cursor: pointer;
    font-size: 1.2rem;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .log-delete:hover {
    background: rgba(255, 107, 107, 0.1);
  }
  
  .empty-logs {
    color: #6c757d;
    text-align: center;
    padding: 2rem;
    font-style: italic;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e0ecff;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .modal-cancel {
    background: #e0ecff;
    color: #3a7bd5;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .modal-cancel:hover {
    background: #d0e0ff;
  }
  
  .modal-confirm {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .modal-confirm:hover {
    background: #ff5252;
  }
  
  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .header-section {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
    
    .charts-container {
      grid-template-columns: 1fr;
    }
    
    .log-container {
      grid-template-columns: 1fr;
    }
    
    .log-form {
      border-right: none;
      border-bottom: 1px solid #e0ecff;
      padding-bottom: 1.5rem;
    }
    
    .modal-container.large-modal {
      max-height: 80vh;
      overflow-y: auto;
    }
  }
  
  @media (max-width: 480px) {
    .activities-container {
      padding: 1rem;
    }
    
    .form-actions {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .save-button, .reset-button {
      width: 100%;
    }
    
    .table-controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .filter-container, .sort-container {
      width: 100%;
    }
    
    .filter-select, .sort-select {
      width: 100%;
    }
  }
  .manage-categories-btn {
  margin-left: 10px;
  padding: 8px 12px;
  background: #f0f2f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.manage-categories-btn:hover {
  background: #e0e2e5;
  border-color: #ccc;
}

.manage-categories-btn i {
  font-size: 14px;
}
.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d6e4ff;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background-color: #f5f9ff;
  min-width: 150px;
}

.empty-table-state {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px dashed #e0ecff;
}

.reset-filters-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3a7bd5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-filters-btn:hover {
  background: #2a6bc4;
}
.action-btn.favorite {
  color: #f1c40f;
}

.action-btn.favorite:hover {
  background: rgba(241, 196, 15, 0.1);
}

/* Ensure Font Awesome icons are visible */
.fas, .far {
  font-size: 1rem;
  width: 1em;
  height: 1em;
  display: inline-block;
}
  </style>