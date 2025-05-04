<template>
    <div class="objectives-container">
      <h2>My Learning Objectives</h2>
      
      <div class="controls">
        <button @click="toggleAddObjective" class="add-button">
          {{ showAddForm ? 'Cancel' : 'Add Objective' }}
        </button>
        
        <div class="filter-controls">
          <label>
            Filter by status:
            <select v-model="filterStatus">
              <option value="all">All Objectives</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>
      </div>
      
      <form v-if="showAddForm" @submit.prevent="saveObjective" class="objective-form">
        <div class="form-group">
          <label for="objectiveTitle">Objective:</label>
          <input 
            type="text" 
            id="objectiveTitle" 
            v-model="currentObjective.title" 
            required 
            placeholder="What do you want to learn?"
          >
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="objectiveCategory">Category:</label>
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
            <label for="objectivePriority">Priority:</label>
            <select id="objectivePriority" v-model="currentObjective.priority" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="objectiveDescription">Description:</label>
          <textarea 
            id="objectiveDescription" 
            v-model="currentObjective.description" 
            rows="3"
            placeholder="Details about this learning objective"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="targetDate">Target Date:</label>
            <input 
              type="date" 
              id="targetDate" 
              v-model="currentObjective.targetDate"
            >
          </div>
          
          <div class="form-group">
            <label for="objectiveStatus">Status:</label>
            <select id="objectiveStatus" v-model="currentObjective.status" required>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="resetForm" class="cancel-button">Cancel</button>
          <button type="submit" class="save-button">
            {{ isEditing ? 'Update Objective' : 'Save Objective' }}
          </button>
        </div>
      </form>
      
      <div v-if="loading" class="loading">Loading objectives...</div>
      
      <div v-else class="objectives-list">
        <div 
          v-for="objective in filteredObjectives" 
          :key="objective.id" 
          class="objective-card"
          :class="[objective.priority, objective.status]"
        >
          <div class="objective-header">
            <div class="objective-title">
              <h3>{{ objective.title }}</h3>
              <span class="objective-category">{{ formatCategory(objective.category) }}</span>
            </div>
            <span class="objective-status" :class="objective.status">
              {{ formatStatus(objective.status) }}
            </span>
          </div>
          
          <p class="objective-description">{{ objective.description }}</p>
          
          <div class="objective-meta">
            <span class="objective-priority" :class="objective.priority">
              Priority: {{ formatPriority(objective.priority) }}
            </span>
            <span v-if="objective.targetDate" class="objective-date">
              Target: {{ formatDate(objective.targetDate) }}
            </span>
          </div>
          
          <div class="objective-progress" v-if="objective.status === 'in-progress'">
            <label>Progress:</label>
            <div class="progress-container">
              <div class="progress-bar" :style="{ width: `${objective.progress || 0}%` }"></div>
              <span class="progress-text">{{ objective.progress || 0 }}%</span>
            </div>
          </div>
          
          <div class="objective-actions">
            <button 
              @click="updateStatus(objective.id, 'in-progress')" 
              class="start-button"
              v-if="objective.status === 'not-started'"
            >
              Start Learning
            </button>
            
            <button 
              @click="updateStatus(objective.id, 'completed')" 
              class="complete-button"
              v-if="objective.status === 'in-progress'"
            >
              Mark Complete
            </button>
            
            <div class="edit-buttons">
              <button @click="editObjective(objective)" class="edit-button">Edit</button>
              <button @click="confirmDelete(objective.id)" class="delete-button">Delete</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && objectives.length === 0" class="empty-objectives">
        No learning objectives yet. Add your first objective!
      </div>
    </div>
  </template>
  
  <script>
  import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  export default {
    name: 'ObjectivesPage',
    data() {
      return {
        objectives: [],
        loading: true,
        showAddForm: false,
        isEditing: false,
        editingObjectiveId: null,
        filterStatus: 'all',
        currentObjective: {
          title: '',
          category: 'frontend',
          priority: 'medium',
          description: '',
          targetDate: '',
          status: 'not-started',
          progress: 0
        },
        userId: null
      };
    },
    computed: {
      filteredObjectives() {
        if (this.filterStatus === 'all') return this.objectives;
        return this.objectives.filter(obj => obj.status === this.filterStatus);
      }
    },
    methods: {
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
      toggleAddObjective() {
        this.showAddForm = !this.showAddForm;
        if (!this.showAddForm) {
          this.resetForm();
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
      async confirmDelete(objectiveId) {
        if (confirm('Are you sure you want to delete this objective?')) {
          await this.deleteObjective(objectiveId);
        }
      },
      async deleteObjective(objectiveId) {
        try {
          const db = getFirestore();
          await deleteDoc(doc(db, 'users', this.userId, 'objectives', objectiveId));
          
          // Remove from local state
          this.objectives = this.objectives.filter(obj => obj.id !== objectiveId);
          
        } catch (error) {
          console.error("Error deleting objective:", error);
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
      }
    },
    created() {
      this.loadObjectives();
    }
  };
  </script>
  
  <style scoped>
  .objectives-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .add-button {
    background-color: #4a89dc;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .add-button:hover {
    background-color: #3b7dd8;
  }
  
  .filter-controls select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  .objective-form {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
    flex: 1;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-group textarea {
    min-height: 80px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-button {
    background-color: #95a5a6;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .save-button {
    background-color: #2ecc71;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .loading {
    text-align: center;
    padding: 40px;
    color: #7f8c8d;
  }
  
  .objectives-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .objective-card {
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .objective-card.high {
    border-left: 4px solid #e74c3c;
  }
  
  .objective-card.medium {
    border-left: 4px solid #f39c12;
  }
  
  .objective-card.low {
    border-left: 4px solid #3498db;
  }
  
  .objective-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  
  .objective-title {
    flex: 1;
  }
  
  .objective-title h3 {
    margin: 0;
    font-size: 1.2em;
  }
  
  .objective-category {
    display: inline-block;
    background: #f1f1f1;
    color: #555;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7em;
    margin-top: 5px;
  }
  
  .objective-status {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 500;
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
  
  .objective-description {
    color: #555;
    font-size: 0.9em;
    margin: 10px 0;
  }
  
  .objective-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: #7f8c8d;
    margin: 10px 0;
  }
  
  .objective-priority {
    padding: 2px 6px;
    border-radius: 12px;
  }
  
  .objective-priority.high {
    background-color: rgba(231, 76, 60, 0.15);
    color: #c0392b;
  }
  
  .objective-priority.medium {
    background-color: rgba(243, 156, 18, 0.15);
    color: #d35400;
  }
  
  .objective-priority.low {
    background-color: rgba(52, 152, 219, 0.15);
    color: #2980b9;
  }
  
  .objective-progress {
    margin: 15px 0;
  }
  
  .objective-progress label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.8em;
    color: #7f8c8d;
  }
  
  .progress-container {
    height: 20px;
    background-color: #f1f1f1;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background-color: #4a89dc;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.7em;
    color: white;
    text-shadow: 0 0 2px rgba(0,0,0,0.5);
  }
  
  .objective-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
  
  .start-button, .complete-button, .edit-button, .delete-button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
  }
  
  .start-button {
    background-color: #3498db;
    color: white;
  }
  
  .complete-button {
    background-color: #2ecc71;
    color: white;
  }
  
  .edit-buttons {
    display: flex;
    gap: 10px;
  }
  
  .edit-button {
    background-color: #3498db;
    color: white;
  }
  
  .delete-button {
    background-color: #e74c3c;
    color: white;
  }
  
  .empty-objectives {
    text-align: center;
    padding: 40px;
    color: #7f8c8d;
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }
    
    .form-row {
      flex-direction: column;
      gap: 0;
    }
    
    .objective-header {
      flex-direction: column;
      gap: 10px;
    }
    
    .objective-meta {
      flex-direction: column;
      gap: 5px;
    }
    
    .objective-actions {
      flex-direction: column;
      gap: 10px;
    }
    
    .edit-buttons {
      justify-content: flex-end;
    }
  }
  </style>