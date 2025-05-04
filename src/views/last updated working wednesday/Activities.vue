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
          >
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
    
    <div class="stats-container" v-if="activities.length > 0">
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
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div>Loading activities...</div>
    </div>
    
    <div v-if="!loading && filteredActivities.length > 0" class="activities-list">
      <div class="list-controls">
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
          </select>
        </div>
      </div>
      
      <div class="activity-grid">
        <div 
          v-for="activity in filteredActivities" 
          :key="activity.id" 
          class="activity-card"
          :class="{
            'completed-card': activity.progress === 100,
            'priority-high': activity.priority === 'high',
            'priority-medium': activity.priority === 'medium',
            'priority-low': activity.priority === 'low'
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
            <div class="progress-edit-container">
              <span class="progress-text">{{ activity.progress || 0 }}% complete</span>
              <div class="progress-actions">
                <button 
                  @click="toggleEditProgress(activity.id)" 
                  class="edit-progress-btn"
                  :class="{ 'editing': editingProgressId === activity.id }"
                >
                  {{ editingProgressId === activity.id ? 'Cancel' : 'Update' }}
                </button>
                <button 
                  @click="completeActivity(activity.id)" 
                  class="complete-btn"
                  v-if="activity.progress !== 100"
                >
                  Mark Complete
                </button>
              </div>
            </div>
            
            <div v-if="editingProgressId === activity.id" class="progress-editor">
              <input 
                type="range" 
                v-model.number="activityProgress" 
                min="0" 
                max="100" 
                step="5"
                class="progress-slider"
              >
              <span class="progress-value">{{ activityProgress }}%</span>
              <button @click="updateProgress(activity.id)" class="save-progress-btn">Save</button>
            </div>
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
            </div>
            <div class="activity-actions">
              <button @click="confirmDelete(activity.id)" class="delete-btn" title="Delete activity">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
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
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { ref, onMounted, computed } from "vue";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  updateDoc,
  deleteDoc
} from "firebase/firestore";

export default {
  name: 'ActivitiesPage',
  
  setup() {
    const db = getFirestore();
    const auth = getAuth();
    
    // Refs
    const userId = ref(null);
    const showAddForm = ref(false);
    const activities = ref([]);
    const loading = ref(true);
    const editingProgressId = ref(null);
    const activityProgress = ref(0);
    const progressColor = ref('#4a89dc');
    const searchQuery = ref('');
    const filterStatus = ref('all');
    const sortBy = ref('date-desc');
    const showDeleteModal = ref(false);
    const activityToDelete = ref(null);
    
    const newActivity = ref({
      objective: "",
      tools: [""],
      done: false,
      progress: 0,
      priority: "medium",
      deadline: ""
    });

    // Computed properties
    const completedActivities = computed(() => {
      return activities.value.filter(a => a.progress === 100).length;
    });
    
    const inProgressActivities = computed(() => {
      return activities.value.filter(a => a.progress < 100).length;
    });
    
    const highPriorityActivities = computed(() => {
      return activities.value.filter(a => a.priority === 'high').length;
    });
    
    const filteredActivities = computed(() => {
      let filtered = [...activities.value];
      
      // Apply status filter
      if (filterStatus.value === 'completed') {
        filtered = filtered.filter(a => a.progress === 100);
      } else if (filterStatus.value === 'in-progress') {
        filtered = filtered.filter(a => a.progress < 100);
      }
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(a => 
          a.objective.toLowerCase().includes(query) || 
          (a.tools && a.tools.some(tool => tool.toLowerCase().includes(query))));
      }
      
      // Apply sorting
      switch (sortBy.value) {
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
        default: // date-desc
          filtered.sort((a, b) => (b.startedAt?.seconds || 0) - (a.startedAt?.seconds || 0));
      }
      
      return filtered;
    });

    // Methods
    const toggleAddForm = () => {
      showAddForm.value = !showAddForm.value;
      if (!showAddForm.value) {
        resetForm();
      }
    };
    
    const updateProgressColor = () => {
      const progress = newActivity.value.progress;
      if (progress < 30) {
        progressColor.value = '#ff9800';
      } else if (progress < 70) {
        progressColor.value = '#2196f3';
      } else {
        progressColor.value = '#4caf50';
      }
    };
    
    const toggleEditProgress = (activityId) => {
      if (editingProgressId.value === activityId) {
        editingProgressId.value = null;
      } else {
        const activity = activities.value.find(a => a.id === activityId);
        if (activity) {
          activityProgress.value = activity.progress || 0;
          editingProgressId.value = activityId;
        }
      }
    };
    
    const updateProgress = async (activityId) => {
      try {
        if (!userId.value || !activityId) return;
        
        const progress = parseInt(activityProgress.value) || 0;
        const validProgress = Math.max(0, Math.min(100, progress));
        
        const activityRef = doc(db, "users", userId.value, "activities", activityId);
        
        await updateDoc(activityRef, {
          progress: validProgress,
          done: validProgress === 100
        });
        
        const activityIndex = activities.value.findIndex(a => a.id === activityId);
        if (activityIndex !== -1) {
          activities.value[activityIndex].progress = validProgress;
          activities.value[activityIndex].done = validProgress === 100;
        }
        
        editingProgressId.value = null;
      } catch (error) {
        console.error("Error updating progress:", error);
        alert(`Failed to update progress: ${error.message}`);
      }
    };
    
    const completeActivity = async (activityId) => {
      try {
        if (!userId.value || !activityId) return;
        
        const activityRef = doc(db, "users", userId.value, "activities", activityId);
        
        await updateDoc(activityRef, {
          progress: 100,
          done: true
        });
        
        const activityIndex = activities.value.findIndex(a => a.id === activityId);
        if (activityIndex !== -1) {
          activities.value[activityIndex].progress = 100;
          activities.value[activityIndex].done = true;
        }
      } catch (error) {
        console.error("Error completing activity:", error);
        alert(`Failed to complete activity: ${error.message}`);
      }
    };
    
    const confirmDelete = (activityId) => {
      activityToDelete.value = activityId;
      showDeleteModal.value = true;
    };
    
    const deleteActivity = async () => {
      try {
        if (!userId.value || !activityToDelete.value) return;
        
        const activityRef = doc(db, "users", userId.value, "activities", activityToDelete.value);
        await deleteDoc(activityRef);
        
        activities.value = activities.value.filter(a => a.id !== activityToDelete.value);
        showDeleteModal.value = false;
        activityToDelete.value = null;
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert(`Failed to delete activity: ${error.message}`);
      }
    };
    
    const addTool = () => {
      if (!newActivity.value.tools) {
        newActivity.value.tools = [];
      }
      newActivity.value.tools.push("");
    };
    
    const removeTool = (index) => {
      if (!newActivity.value.tools) return;
      
      newActivity.value.tools.splice(index, 1);
      if (newActivity.value.tools.length === 0) {
        newActivity.value.tools.push("");
      }
    };
    
    const resetForm = () => {
      newActivity.value = {
        objective: "",
        tools: [""],
        done: false,
        progress: 0,
        priority: "medium",
        deadline: ""
      };
      progressColor.value = '#4a89dc';
    };
    
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      try {
        const date = timestamp.toDate();
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
    };
    
    const formatDeadline = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    };
    
    const isDeadlineApproaching = (dateString) => {
      if (!dateString) return false;
      const deadline = new Date(dateString);
      const today = new Date();
      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    };
    
    const submitActivity = async () => {
      try {
        if (!userId.value || userId.value.trim() === "") {
          alert("You must be logged in to add activities. Please login and try again.");
          return;
        }
        
        if (!Array.isArray(newActivity.value.tools)) {
          newActivity.value.tools = [];
        }
        
        const filteredTools = newActivity.value.tools.filter(tool => tool && tool.trim() !== "");
        const progress = parseInt(newActivity.value.progress) || 0;
        const validProgress = Math.max(0, Math.min(100, progress));
        const isDone = validProgress === 100;
        
        const activityData = {
          objective: (newActivity.value.objective || "").trim(),
          tools: filteredTools || [],
          done: isDone,
          progress: validProgress,
          priority: newActivity.value.priority || 'medium',
          startedAt: serverTimestamp(),
          userId: userId.value
        };
        
        // Add deadline if provided
        if (newActivity.value.deadline) {
          activityData.deadline = newActivity.value.deadline;
        }
        
        const userActivitiesRef = collection(db, "users", userId.value, "activities");
        await addDoc(userActivitiesRef, activityData);
        
        await loadActivities();
        resetForm();
        showAddForm.value = false;
      } catch (error) {
        console.error("Error adding activity:", error);
        if (error.code === 'permission-denied') {
          alert("Permission denied. You may not have access to add activities.");
        } else {
          alert(`Failed to save activity: ${error.message}`);
        }
      }
    };

    const loadActivities = async () => {
      if (!userId.value) {
        console.warn("Cannot load activities: No user ID available");
        loading.value = false;
        activities.value = [];
        return;
      }
      
      loading.value = true;
      try {
        const userActivitiesRef = collection(db, "users", userId.value, "activities");
        const activitiesQuery = query(userActivitiesRef, orderBy("startedAt", "desc"));
        const querySnapshot = await getDocs(activitiesQuery);
        
        activities.value = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const progress = parseInt(data.progress) || 0;
          
          return {
            id: doc.id,
            objective: data.objective || "Untitled Activity",
            tools: Array.isArray(data.tools) ? data.tools : [],
            done: progress === 100 ? true : Boolean(data.done),
            startedAt: data.startedAt || null,
            userId: data.userId || userId.value,
            progress: progress,
            priority: data.priority || 'medium',
            deadline: data.deadline || null
          };
        });
      } catch (error) {
        console.error("Error loading activities:", error);
        if (error.code === 'permission-denied') {
          alert("Permission denied. You may not have access to view these activities.");
        } else {
          alert(`Failed to load activities: ${error.message}`);
        }
        activities.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      const user = auth.currentUser;
      if (user) {
        userId.value = user.uid;
        loadActivities();
      } else {
        loading.value = false;
      }
      
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          userId.value = user.uid;
          await loadActivities();
        } else {
          userId.value = null;
          activities.value = [];
          loading.value = false;
        }
      });
      
      return () => unsubscribe();
    });
    
    return {
      userId,
      showAddForm,
      activities,
      newActivity,
      loading,
      editingProgressId,
      activityProgress,
      progressColor,
      searchQuery,
      filterStatus,
      sortBy,
      showDeleteModal,
      activityToDelete,
      completedActivities,
      inProgressActivities,
      highPriorityActivities,
      filteredActivities,
      toggleAddForm,
      updateProgressColor,
      toggleEditProgress,
      updateProgress,
      completeActivity,
      confirmDelete,
      deleteActivity,
      addTool,
      removeTool,
      resetForm,
      submitActivity,
      formatDate,
      formatDeadline,
      isDeadlineApproaching
    };
  }
}
</script>

<style scoped>
/* Base Styles */
.activities-container {
  max-width: 1200px;
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
  color: #3a7bd5;
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

/* List Controls */
.list-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  border: 1px solid #e0ecff;
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

/* Activity Grid */
.activity-grid {
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

.progress-edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-text {
  font-size: 0.9rem;
  color: #6c757d;
}

.progress-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-progress-btn {
  background: #3a7bd5;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-progress-btn:hover {
  background: #2a6bc4;
}

.edit-progress-btn.editing {
  background: #ff922b;
}

.edit-progress-btn.editing:hover {
  background: #e67700;
}

.complete-btn {
  background: #51cf66;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.complete-btn:hover {
  background: #40c057;
}

.progress-editor {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f5f9ff;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.save-progress-btn {
  background: #51cf66;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-progress-btn:hover {
  background: #40c057;
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

.activity-actions {
  margin-left: auto;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  padding: 0.25rem;
  border-radius: 4px;
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  transform: scale(1.1);
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
  max-width: 400px;
  overflow: hidden;
  animation: modalSlideUp 0.3s ease;
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
}

.modal-close:hover {
  color: #ff6b6b;
}

.modal-body {
  padding: 1.5rem;
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
  
  .activity-grid {
    grid-template-columns: 1fr;
  }
  
  .list-controls {
    flex-direction: column;
    align-items: stretch;
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
}
</style>