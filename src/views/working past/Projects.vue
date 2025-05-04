<template>
  <div class="projects-container">
    <h2>My Projects</h2>
    
    <div class="project-controls">
      <button @click="toggleAddProject" class="add-button">
        {{ showAddForm ? 'Cancel' : 'Add Project' }}
      </button>
      
      <div class="filter-controls">
        <label>
          Filter by status:
          <select v-model="filterStatus">
            <option value="all">All Projects</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </label>
      </div>
    </div>
    
    <form v-if="showAddForm" @submit.prevent="saveProject" class="project-form">
      <div class="form-row">
        <div class="form-group">
          <label for="projectName">Project Name:</label>
          <input 
            type="text" 
            id="projectName" 
            v-model="currentProject.name" 
            required 
            placeholder="My Awesome Project"
          >
        </div>
        
        <div class="form-group">
          <label for="projectStatus">Status:</label>
          <select id="projectStatus" v-model="currentProject.status" required>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="projectDescription">Description:</label>
        <textarea 
          id="projectDescription" 
          v-model="currentProject.description" 
          rows="3"
          placeholder="What's this project about?"
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Start Date:</label>
          <input 
            type="date" 
            id="startDate" 
            v-model="currentProject.startDate"
          >
        </div>
        
        <div class="form-group">
          <label for="endDate">End Date:</label>
          <input 
            type="date" 
            id="endDate" 
            v-model="currentProject.endDate"
            :disabled="currentProject.status !== 'completed'"
          >
        </div>
      </div>
      
      <div class="form-group">
        <label>Technologies:</label>
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
          >
        </div>
      </div>
      
      <div class="form-group">
        <label for="projectLink">Project Link (optional):</label>
        <input 
          type="url" 
          id="projectLink" 
          v-model="currentProject.link" 
          placeholder="https://example.com"
        >
      </div>
      
      <div class="form-actions">
        <button type="button" @click="resetForm" class="cancel-button">Cancel</button>
        <button type="submit" class="save-button">
          {{ isEditing ? 'Update Project' : 'Save Project' }}
        </button>
      </div>
    </form>
    
    <div v-if="loading" class="loading">Loading projects...</div>
    
    <div v-else class="projects-grid">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id" 
        class="project-card"
        :class="project.status"
      >
        <div class="project-header">
          <h3>{{ project.name }}</h3>
          <span class="project-status" :class="project.status">
            {{ formatStatus(project.status) }}
          </span>
        </div>
        
        <p class="project-description">{{ project.description }}</p>
        
        <div class="project-dates">
          <span v-if="project.startDate">
            Started: {{ formatDate(project.startDate) }}
          </span>
          <span v-if="project.endDate">
            Completed: {{ formatDate(project.endDate) }}
          </span>
        </div>
        
        <div v-if="project.technologies && project.technologies.length > 0" class="project-tech">
          <span class="tech-label">Technologies:</span>
          <span 
            v-for="(tech, index) in project.technologies" 
            :key="index" 
            class="tech-tag"
          >
            {{ tech }}
          </span>
        </div>
        
        <div v-if="project.link" class="project-link">
          <a :href="project.link" target="_blank" rel="noopener noreferrer">
            View Project
          </a>
        </div>
        
        <div class="project-actions">
          <button @click="editProject(project)" class="edit-button">Edit</button>
          <button @click="confirmDelete(project.id)" class="delete-button">Delete</button>
        </div>
      </div>
    </div>
    
    <div v-if="!loading && projects.length === 0" class="empty-projects">
      No projects yet. Add your first project!
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'ProjectsPage',
  data() {
    return {
      projects: [],
      loading: true,
      showAddForm: false,
      isEditing: false,
      editingProjectId: null,
      filterStatus: 'all',
      techInput: '',
      currentProject: {
        name: '',
        description: '',
        status: 'planning',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        technologies: [],
        link: ''
      },
      userId: null
    };
  },
  computed: {
    filteredProjects() {
      if (this.filterStatus === 'all') return this.projects;
      return this.projects.filter(project => project.status === this.filterStatus);
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
    toggleAddProject() {
      this.showAddForm = !this.showAddForm;
      if (!this.showAddForm) {
        this.resetForm();
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
    async confirmDelete(projectId) {
      if (confirm('Are you sure you want to delete this project?')) {
        await this.deleteProject(projectId);
      }
    },
    async deleteProject(projectId) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, 'users', this.userId, 'projects', projectId));
        
        // Remove from local state
        this.projects = this.projects.filter(project => project.id !== projectId);
        
      } catch (error) {
        console.error("Error deleting project:", error);
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
    }
  },
  created() {
    this.loadProjects();
  }
};
</script>

<style scoped>
.projects-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.project-controls {
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

.project-form {
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

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 40px;
}

.tag {
  background-color: #e0f7fa;
  color: #00838f;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  display: flex;
  align-items: center;
}

.remove-tag {
  margin-left: 5px;
  cursor: pointer;
  font-size: 1.1em;
}

.tags-input input {
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  padding: 5px;
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.project-card.completed {
  border-left: 4px solid #2ecc71;
}

.project-card.in-progress {
  border-left: 4px solid #3498db;
}

.project-card.planning {
  border-left: 4px solid #f39c12;
}

.project-card.on-hold {
  border-left: 4px solid #95a5a6;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-header h3 {
  margin: 0;
  font-size: 1.2em;
}

.project-status {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8em;
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

.project-description {
  color: #555;
  font-size: 0.9em;
  margin: 10px 0;
  flex-grow: 1;
}

.project-dates {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.8em;
  color: #7f8c8d;
  margin: 10px 0;
}

.project-tech {
  margin: 10px 0;
}

.tech-label {
  font-size: 0.8em;
  color: #7f8c8d;
  margin-right: 5px;
}

.tech-tag {
  display: inline-block;
  background: #e0f7fa;
  color: #00838f;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.7em;
  margin-right: 5px;
  margin-bottom: 5px;
}

.project-link a {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9em;
}

.project-link a:hover {
  text-decoration: underline;
}

.project-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.edit-button, .delete-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.edit-button {
  background-color: #3498db;
  color: white;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.empty-projects {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

@media (max-width: 768px) {
  .project-controls {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>