<template>
  <div class="skills-manager" :class="{ 'dark-mode': darkMode }">
    <div class="header-section">
      <div class="header-content">
        <div class="logo">
          <img src="/logoDev.jpg" alt="Logo" />
          <div class="logo-text">
            <h1>Skills Dashboard</h1>
            <router-link to="/dash" class="return-to-dash">
              ← Return to Main Dashboard
            </router-link>
          </div>
        </div>

        <div class="header-controls">
          <button class="theme-toggle" @click="toggleTheme">
            <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
            <span>{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>
        </div>

        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-value">{{ totalSkills }}</div>
            <div class="stat-label">Total Skills</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ advancedSkills }}</div>
            <div class="stat-label">Advanced</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalLearningHours }}</div>
            <div class="stat-label">Learning Hours</div>
          </div>
        </div>
      </div>
    </div>

    <div class="skills-container">
      <div class="skills-form-container">
        <div class="skills-form">
          <h2>{{ isEditing ? 'Edit Skill' : 'Add New Skill' }}</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="skillName">Skill Name</label>
              <div class="autocomplete-container">
                <input
                  type="text"
                  id="skillName"
                  v-model="newSkill.name"
                  placeholder="e.g. React, Python, Docker..."
                  @keyup.enter="handleAddSkill"
                  @input="searchSkillSuggestions"
                  @focus="showSuggestions = true"
                  @blur="() => { this.$nextTick(() => { showSuggestions = false }) }"
                />
                <div v-if="showSuggestions && skillSuggestions.length" class="suggestions-dropdown">
                  <div 
                    v-for="suggestion in skillSuggestions" 
                    :key="suggestion"
                    class="suggestion-item"
                    @mousedown="selectSuggestion(suggestion)"
                  >
                    {{ suggestion }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="category">Category</label>
              <div class="category-selector">
                <select 
                  id="category" 
                  v-model="newSkill.category"
                >
                  <option value="" disabled>Select a category</option>
                  <option v-for="category in allCategories" :value="category" :key="category">
                    {{ category }}
                  </option>
                  <option value="custom">Add New Category...</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="learningHours">Learning Hours</label>
              <div class="input-with-icon">
                <input
                  type="number"
                  id="learningHours"
                  v-model.number="newSkill.learningHours"
                  min="0"
                  placeholder="Hours spent learning"
                />
                <span class="input-icon">⏱️</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="certificates">Certificates</label>
              <div class="input-with-icon">
                <input
                  type="number"
                  id="certificates"
                  v-model.number="newSkill.certificates"
                  min="0"
                  placeholder="Number of certificates"
                />
                <span class="input-icon">📜</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="projects">Projects</label>
              <div class="input-with-icon">
                <input
                  type="number"
                  id="projects"
                  v-model.number="newSkill.projects"
                  min="0"
                  placeholder="Projects completed"
                />
                <span class="input-icon">💼</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="acquisitionDate">Last Practiced</label>
              <input
                type="date"
                id="acquisitionDate"
                v-model="newSkill.date"
              />
            </div>
          </div>
          
          <div class="skill-preview">
            <div class="preview-header">
              <span>Skill Level:</span>
              <span :class="['skill-level', getLevelClass(calculatedLevel)]">
                {{ calculatedLevel }}
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
            <button @click="handleAddSkill" class="btn primary-btn">
              {{ isEditing ? 'Update Skill' : 'Add Skill' }}
            </button>
          </div>
        </div>
        
        <div class="skills-visualization">
          <h3>Skills Distribution</h3>
          <div class="chart-container">
            <div class="chart-legend">
              <div v-for="(count, level) in levelDistribution" :key="level" class="legend-item">
                <span class="legend-color" :class="getLevelClass(level)"></span>
                <span>{{ level }} ({{ count }})</span>
              </div>
            </div>
            <div class="chart">
              <div 
                v-for="(count, level) in levelDistribution" 
                :key="level"
                class="chart-segment"
                :class="getLevelClass(level)"
                :style="{ height: (count / maxLevelCount) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="view-toggle">
        <button 
          @click="currentView = 'table'"
          :class="{ 'active': currentView === 'table' }"
          class="view-btn"
        >
          <i class="fas fa-table"></i> Table
        </button>
        <button 
          @click="currentView = 'cards'"
          :class="{ 'active': currentView === 'cards' }"
          class="view-btn"
        >
          <i class="fas fa-th-large"></i> Cards
        </button>
        <button 
          @click="currentView = 'list'"
          :class="{ 'active': currentView === 'list' }"
          class="view-btn"
        >
          <i class="fas fa-list"></i> List
        </button>
      </div>
      
      <div v-if="currentView === 'table'" class="skills-list-container">
        <div class="list-controls">
          <div class="search-container">
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search skills..."
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <div class="filter-group">
            <label>Filter:</label>
            <select v-model="filterLevel">
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Category:</label>
            <select v-model="filterCategory">
              <option value="all">All Categories</option>
              <option v-for="category in allCategories" :value="category" :key="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Sort by:</label>
            <select v-model="sortBy">
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="level-asc">Level (Low-High)</option>
              <option value="level-desc">Level (High-Low)</option>
              <option value="hours-asc">Hours (Low-High)</option>
              <option value="hours-desc">Hours (High-Low)</option>
              <option value="date-asc">Date (Old-New)</option>
              <option value="date-desc">Date (New-Old)</option>
            </select>
          </div>
        </div>
        
        <div v-if="filteredSkills.length > 0" class="skills-table">
          <table>
            <thead>
              <tr>
                <th @click="sortByField('name')">
                  Skill
                  <span class="sort-icon" v-if="sortField === 'name'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('category')">
                  Category
                  <span class="sort-icon" v-if="sortField === 'category'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('level')">
                  Level
                  <span class="sort-icon" v-if="sortField === 'level'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('learningHours')">
                  Hours
                  <span class="sort-icon" v-if="sortField === 'learningHours'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortByField('date')">
                  Last Practiced
                  <span class="sort-icon" v-if="sortField === 'date'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="skill in filteredSkills" :key="skill.id">
                <td>
                  <div class="skill-name-cell">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-category-mobile">{{ skill.category }}</span>
                  </div>
                </td>
                <td class="skill-category">{{ skill.category }}</td>
                <td>
                  <span :class="['skill-level', getLevelClass(skill.level)]">
                    {{ skill.level }}
                  </span>
                </td>
                <td>{{ skill.learningHours || 0 }}h</td>
                <td>{{ formatDate(skill.date) }}</td>
                <td class="actions">
                  <button @click="editSkill(skill.id)" class="action-btn edit-btn">
                    Edit
                  </button>
                  <button @click="confirmDelete(skill.id)" class="action-btn delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>No skills found</h3>
          <p>{{ searchTerm ? 'Try a different search term' : 'Add your first skill to get started' }}</p>
          <button v-if="!searchTerm" @click="showAddForm = true" class="btn primary-btn">
            Add Your First Skill
          </button>
        </div>
      </div>
      
      <div v-if="currentView === 'cards'" class="skills-cards-container">
        <div class="cards-grid">
          <div 
            v-for="skill in filteredSkills" 
            :key="skill.id"
            class="skill-card"
            :class="getLevelClass(skill.level)"
          >
            <div class="card-header">
              <h3>{{ skill.name }}</h3>
              <span class="card-category">{{ skill.category }}</span>
            </div>
            
            <div class="card-body">
              <div class="skill-level-badge">{{ skill.level }}</div>
              
              <div class="skill-stats">
                <div class="stat">
                  <span class="stat-icon">⏱️</span>
                  <span class="stat-value">{{ skill.learningHours || 0 }}h</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">📜</span>
                  <span class="stat-value">{{ skill.certificates || 0 }}</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">💼</span>
                  <span class="stat-value">{{ skill.projects || 0 }}</span>
                </div>
              </div>
              
              <div class="last-practiced">
                Last practiced: {{ formatDate(skill.date) }}
              </div>
            </div>
            
            <div class="card-actions">
              <button @click="editSkill(skill.id)" class="card-btn edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDelete(skill.id)" class="card-btn delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="currentView === 'list'" class="skills-compact-list">
        <div 
          v-for="skill in filteredSkills" 
          :key="skill.id"
          class="compact-skill-item"
          @click="toggleSkillDetails(skill.id)"
        >
          <div class="compact-skill-main">
            <span class="skill-name">{{ skill.name }}</span>
            <span :class="['skill-level', getLevelClass(skill.level)]">
              {{ skill.level }}
            </span>
            <span class="skill-hours">{{ skill.learningHours || 0 }}h</span>
            <span class="skill-date">{{ formatDate(skill.date, true) }}</span>
          </div>
          
          <div v-if="expandedSkills.includes(skill.id)" class="compact-skill-details">
            <div class="detail-row">
              <span>Category:</span>
              <span>{{ skill.category }}</span>
            </div>
            <div class="detail-row">
              <span>Certificates:</span>
              <span>{{ skill.certificates || 0 }}</span>
            </div>
            <div class="detail-row">
              <span>Projects:</span>
              <span>{{ skill.projects || 0 }}</span>
            </div>
            <div class="detail-actions">
              <button @click.stop="editSkill(skill.id)" class="btn small-btn">
                Edit
              </button>
              <button @click.stop="confirmDelete(skill.id)" class="btn small-btn delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Confirm Deletion</h3>
          <button @click="showDeleteModal = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this skill? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn cancel-btn">Cancel</button>
          <button @click="deleteSkill" class="btn delete-btn">Delete</button>
        </div>
      </div>
    </div>
    
    <div v-if="showCategoryModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Add New Category</h3>
          <button @click="showCategoryModal = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="add-category">
            <input 
              type="text" 
              v-model="newCategory" 
              placeholder="Enter category name"
              @keyup.enter="addNewCategory"
            />
            <div v-if="categoryError" class="error-message">{{ categoryError }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCategoryModal = false" class="btn cancel-btn">Cancel</button>
          <button @click="addNewCategory" class="btn primary-btn">Add Category</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/services/firebase';

export default {
  name: 'EnhancedSkillsManager',
  data() {
    return {
      skills: [],
      newSkill: {
        name: '',
        category: '',
        learningHours: 0,
        certificates: 0,
        projects: 0,
        level: 'Beginner',
        date: new Date().toISOString().split('T')[0],
      },
      isEditing: false,
      currentSkillId: null,
      searchTerm: '',
      filterLevel: 'all',
      filterCategory: 'all',
      sortBy: 'name-asc',
      sortField: 'name',
      sortDirection: 'asc',
      showDeleteModal: false,
      skillToDelete: null,
      currentUser: null,
      loading: false,
      error: null,
      showCategoryModal: false,
      newCategory: '',
      categoryError: '',
      defaultCategories: [
        'Frontend', 'Backend', 'Database', 'DevOps', 
        'Design', 'Mobile', 'Cloud', 'Data Science',
        'AI/ML', 'Cybersecurity', 'Networking', 'Testing'
      ],
      userCategories: [],
      skillSuggestions: [],
      showSuggestions: false,
      popularSkills: [
        'JavaScript', 'Python', 'Java', 'C#', 'PHP', 'TypeScript',
        'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django',
        'Flask', 'Spring', 'Laravel', 'Ruby on Rails',
        'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind CSS',
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
        'Git', 'GitHub', 'GitLab', 'CI/CD', 'Jenkins',
        'REST API', 'GraphQL', 'WebSockets', 'OAuth',
        'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium'
      ],
      currentView: 'table',
      expandedSkills: [],
      darkMode: false
    };
  },
  computed: {
    allCategories() {
      return [...this.defaultCategories, ...this.userCategories];
    },
    calculatedLevel() {
      return this.calculateSkillLevel(this.newSkill);
    },
    progressPercentage() {
      const hours = Number(this.newSkill.learningHours) || 0;
      const certs = Number(this.newSkill.certificates) || 0;
      const projs = Number(this.newSkill.projects) || 0;
      
      let score = 0;
      
      if (hours < 10) score += 1;
      else if (hours < 50) score += 2;
      else if (hours < 100) score += 3;
      else score += 4;
      
      score += Math.min(certs * 2, 4);
      score += Math.min(projs, 4);
      
      return Math.min((score / 12) * 100, 100);
    },
    totalSkills() {
      return this.skills.length;
    },
    advancedSkills() {
      return this.skills.filter(skill => skill.level === 'Advanced').length;
    },
    totalLearningHours() {
      return this.skills.reduce((total, skill) => total + (skill.learningHours || 0), 0);
    },
    levelDistribution() {
      const distribution = {
        Beginner: 0,
        Intermediate: 0,
        Advanced: 0
      };
      
      this.skills.forEach(skill => {
        distribution[skill.level]++;
      });
      
      return distribution;
    },
    maxLevelCount() {
      return Math.max(...Object.values(this.levelDistribution));
    },
    filteredSkills() {
      let filtered = [...this.skills];
      
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(skill => 
          (skill.name || '').toLowerCase().includes(term) ||
          (skill.category || '').toLowerCase().includes(term)
        );
      }
      
      if (this.filterLevel !== 'all') {
        filtered = filtered.filter(skill => skill.level === this.filterLevel);
      }
      
      if (this.filterCategory !== 'all') {
        filtered = filtered.filter(skill => skill.category === this.filterCategory);
      }
      
      return this.sortSkills(filtered);
    }
  },
  watch: {
    sortBy(newVal) {
      const [field, direction] = newVal.split('-');
      this.sortField = field;
      this.sortDirection = direction;
    },
    'newSkill.category'(newVal) {
      if (newVal === 'custom') {
        this.showCategoryModal = true;
        this.newSkill.category = '';
      }
    }
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      if (this.darkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    },
    getLevelClass(level) {
      switch (level) {
        case 'Beginner': return 'level-beginner';
        case 'Intermediate': return 'level-intermediate';
        case 'Advanced': return 'level-advanced';
        default: return '';
      }
    },
    
    calculateSkillLevel(skill) {
      const hours = Number(skill.learningHours) || 0;
      const certs = Number(skill.certificates) || 0;
      const projs = Number(skill.projects) || 0;
      
      let score = 0;
      
      if (hours < 10) score += 1;
      else if (hours < 50) score += 2;
      else if (hours < 100) score += 3;
      else score += 4;
      
      score += Math.min(certs * 2, 4);
      score += Math.min(projs, 4);
      
      if (score <= 3) return 'Beginner';
      else if (score <= 8) return 'Intermediate';
      else return 'Advanced';
    },
    
    async loadSkills() {
      this.loading = true;
      this.error = null;
      try {
        if (!this.currentUser) {
          throw new Error('User not authenticated');
        }
        
        const skillsCol = collection(db, 'users', this.currentUser.uid, 'skills');
        const snapshot = await getDocs(skillsCol);
        this.skills = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error loading skills: ", error);
        this.error = `Loading error: ${error.message}`;
        this.skills = [];
      } finally {
        this.loading = false;
      }
    },
    
    async loadUserCategories() {
      if (!this.currentUser) return;
      
      try {
        const userDocRef = doc(db, 'users', this.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          this.userCategories = userDoc.data().categories || [];
        }
      } catch (error) {
        console.error("Error loading categories: ", error);
      }
    },
    
    async handleAddSkill() {
      this.error = null;
      
      try {
        if (!this.currentUser) {
          throw new Error('User not authenticated');
        }
        
        const name = this.newSkill.name.trim();
        if (!name) {
          throw new Error('Please enter skill name');
        }

        if (!this.newSkill.category) {
          throw new Error('Please select a category');
        }

        const skillData = {
          ...this.newSkill,
          name: name,
          level: this.calculateSkillLevel(this.newSkill),
          updatedAt: serverTimestamp(),
        };

        const userDocRef = doc(db, 'users', this.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, { 
            email: this.currentUser.email,
            createdAt: serverTimestamp(),
            categories: [...this.defaultCategories]
          });
        }
        
        if (this.isEditing) {
          if (!this.currentSkillId) {
            throw new Error('Missing skill ID for update');
          }
          
          const skillDocRef = doc(db, 'users', this.currentUser.uid, 'skills', this.currentSkillId);
          await updateDoc(skillDocRef, skillData);
          
          const index = this.skills.findIndex(s => s.id === this.currentSkillId);
          if (index !== -1) {
            this.skills[index] = {
              id: this.currentSkillId,
              ...skillData
            };
          }
          
          this.cancelEdit();
        } else {
          const exists = this.skills.some(
            skill => skill.name.toLowerCase() === name.toLowerCase()
          );
          if (exists) {
            throw new Error('This skill already exists');
          }

          const skillsColRef = collection(db, 'users', this.currentUser.uid, 'skills');
          const docRef = await addDoc(skillsColRef, {
            ...skillData,
            createdAt: serverTimestamp()
          });
          
          this.skills.push({
            id: docRef.id,
            ...skillData
          });
        }

        this.resetForm();
      } catch (error) {
        console.error("Error saving skill: ", error);
        this.error = error.message || "An error occurred while saving";
        alert(this.error);
      }
    },
    
    editSkill(skillId) {
      const skill = this.skills.find(s => s.id === skillId);
      if (skill) {
        this.newSkill = { 
          name: skill.name,
          category: skill.category || '',
          learningHours: skill.learningHours,
          certificates: skill.certificates,
          projects: skill.projects,
          date: skill.date || new Date().toISOString().split('T')[0],
        };
        this.isEditing = true;
        this.currentSkillId = skillId;
        this.$nextTick(() => {
          document.querySelector('.skills-form').scrollIntoView({ behavior: 'smooth' });
        });
      }
    },
    
    cancelEdit() {
      this.isEditing = false;
      this.currentSkillId = null;
      this.resetForm();
    },
    
    resetForm() {
      this.newSkill = {
        name: '',
        category: '',
        learningHours: 0,
        certificates: 0,
        projects: 0,
        level: 'Beginner',
        date: new Date().toISOString().split('T')[0],
      };
      this.error = null;
      this.showSuggestions = false;
    },
    
    confirmDelete(skillId) {
      this.skillToDelete = skillId;
      this.showDeleteModal = true;
    },
    
    async deleteSkill() {
      if (!this.skillToDelete) return;
      
      this.error = null;
      try {
        if (!this.currentUser) {
          throw new Error('User not authenticated');
        }
        
        await deleteDoc(doc(db, 'users', this.currentUser.uid, 'skills', this.skillToDelete));
        this.skills = this.skills.filter(skill => skill.id !== this.skillToDelete);

        if (this.isEditing && this.currentSkillId === this.skillToDelete) {
          this.cancelEdit();
        }
      } catch (error) {
        console.error("Error deleting skill: ", error);
        this.error = error.message || "An error occurred while deleting";
        alert(this.error);
      } finally {
        this.showDeleteModal = false;
        this.skillToDelete = null;
      }
    },
    
    formatDate(dateString, short = false) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        if (short) {
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
          });
        }
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    },
    
    sortSkills(skills) {
      return [...skills].sort((a, b) => {
        let compareA, compareB;
        switch (this.sortField) {
          case 'name':
            compareA = (a.name || '').toLowerCase();
            compareB = (b.name || '').toLowerCase();
            break;
          case 'category':
            compareA = (a.category || '').toLowerCase();
            compareB = (b.category || '').toLowerCase();
            break;
          case 'level':
            const levelOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
            compareA = levelOrder[a.level];
            compareB = levelOrder[b.level];
            break;
          case 'learningHours':
            compareA = a.learningHours || 0;
            compareB = b.learningHours || 0;
            break;
          case 'certificates':
            compareA = a.certificates || 0;
            compareB = b.certificates || 0;
            break;
          case 'projects':
            compareA = a.projects || 0;
            compareB = b.projects || 0;
            break;
          case 'date':
            compareA = new Date(a.date || 0);
            compareB = new Date(b.date || 0);
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
    
    searchSkillSuggestions() {
      if (!this.newSkill.name) {
        this.skillSuggestions = [];
        return;
      }
      
      const term = this.newSkill.name.toLowerCase();
      this.skillSuggestions = this.popularSkills
        .filter(skill => skill.toLowerCase().includes(term))
        .slice(0, 5);
    },
    
    selectSuggestion(suggestion) {
      this.newSkill.name = suggestion;
      this.showSuggestions = false;
    },
    
    async addNewCategory() {
      this.categoryError = '';
      const category = this.newCategory.trim();
      
      if (!category) {
        this.categoryError = 'Please enter a category name';
        return;
      }
      
      if (this.allCategories.includes(category)) {
        this.categoryError = 'This category already exists';
        return;
      }
      
      try {
        this.userCategories.push(category);
        this.newCategory = '';
        this.showCategoryModal = false;
        
        if (this.currentUser) {
          const userDocRef = doc(db, 'users', this.currentUser.uid);
          await updateDoc(userDocRef, {
            categories: [...this.userCategories]
          });
        }
      } catch (error) {
        console.error("Error saving categories: ", error);
        this.categoryError = "Failed to save category";
      }
    },
    
    toggleSkillDetails(skillId) {
      const index = this.expandedSkills.indexOf(skillId);
      if (index === -1) {
        this.expandedSkills.push(skillId);
      } else {
        this.expandedSkills.splice(index, 1);
      }
    }
  },
  created() {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    this.darkMode = savedDarkMode;
    if (this.darkMode) {
      document.documentElement.classList.add('dark-mode');
    }

    this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        this.loadSkills();
        this.loadUserCategories();
      } else {
        this.skills = [];
        this.userCategories = [];
      }
    });
  },
  beforeUnmount() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.skills-manager {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
  background-color: #f8fafc;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Dark Mode Styles */
.skills-manager.dark-mode {
  background-color: #0f172a;
  color: #e2e8f0;
}

.dark-mode .skills-form,
.dark-mode .skills-visualization,
.dark-mode .skills-table,
.dark-mode .empty-state,
.dark-mode .list-controls,
.dark-mode .modal-container {
  background-color: #1e293b;
  color: #e2e8f0;
  border-color: #334155;
}

.dark-mode .form-group input,
.dark-mode .form-group select,
.dark-mode .search-container input,
.dark-mode .filter-group select {
  background-color: #334155;
  color: #e2e8f0;
  border-color: #475569;
}

.dark-mode .skill-preview {
  background-color: #1e293b;
  border-color: #334155;
}

.dark-mode .progress-container {
  background-color: #334155;
}

.dark-mode .progress-text {
  color: #e2e8f0;
}

.dark-mode .skill-name,
.dark-mode .skill-category,
.dark-mode .skill-category-mobile,
.dark-mode .empty-state h3 {
  color: #e2e8f0;
}

.dark-mode .empty-state p,
.dark-mode .skill-category-mobile,
.dark-mode .card-category {
  color: #94a3b8;
}

.dark-mode .skill-card {
  background-color: #1e293b;
  border-color: #334155;
}

.dark-mode .header-section {
  background: linear-gradient(135deg, #1e3a8a, #0c4a6e);
}

.dark-mode .stat-card {
  background: rgba(30, 58, 138, 0.3);
}

.dark-mode .return-to-dash {
  color: rgba(248, 250, 252, 0.8);
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
  
  /* Skills Container */
  .skills-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .skills-form-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 1024px) {
    .skills-form-container {
      grid-template-columns: 1fr;
    }
  }
  
  /* Skills Form */
  .skills-form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
  }
  
  .skills-form h2 {
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
  .form-group select {
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: #f8fafc;
  }
  
  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #3a7bd5;
    box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.2);
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
  
  /* Autocomplete */
  .autocomplete-container {
    position: relative;
  }
  
  .suggestions-dropdown {
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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .suggestion-item {
    padding: 0.75rem 1rem;
    cursor: pointer;
  }
  
  .suggestion-item:hover {
    background-color: #f8fafc;
  }
  
  /* Skill Preview */
  .skill-preview {
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
  
  .skill-level {
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    display: inline-block;
  }
  
  .level-beginner {
    background-color: rgba(52, 152, 219, 0.15);
    color: #2980b9;
  }
  
  .level-intermediate {
    background-color: rgba(46, 204, 113, 0.15);
    color: #27ae60;
  }
  
  .level-advanced {
    background-color: rgba(155, 89, 182, 0.15);
    color: #8e44ad;
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
  
  /* Skills Visualization */
  .skills-visualization {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
  }
  
  .skills-visualization h3 {
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
  
  .legend-color.level-beginner {
    background-color: #3498db;
  }
  
  .legend-color.level-intermediate {
    background-color: #2ecc71;
  }
  
  .legend-color.level-advanced {
    background-color: #9b59b6;
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
  
  .chart-segment.level-beginner {
    background-color: #3498db;
  }
  
  .chart-segment.level-intermediate {
    background-color: #2ecc71;
  }
  
  .chart-segment.level-advanced {
    background-color: #9b59b6;
  }
  
  /* View Toggle */
  .view-toggle {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 1.5rem 0;
  }
  
  .view-btn {
    padding: 0.5rem 1rem;
    background-color: #e2e8f0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .view-btn.active {
    background-color: #3a7bd5;
    color: white;
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
  
  /* Skills Table */
  .skills-table {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
    overflow-x: auto;
  }
  
  .skills-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .skills-table th,
  .skills-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .skills-table th {
    text-align: left;
    font-weight: 600;
    color: #4a5568;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  
  .skills-table th:hover {
    background-color: #f8fafc;
  }
  
  .skills-table tr:last-child td {
    border-bottom: none;
  }
  
  .skills-table tr:hover td {
    background-color: #f8fafc;
  }
  
  .sort-icon {
    margin-left: 0.5rem;
  }
  
  .skill-name-cell {
    display: flex;
    flex-direction: column;
  }
  
  .skill-category-mobile {
    display: none;
    font-size: 0.8rem;
    color: #718096;
    margin-top: 0.25rem;
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
  
  /* Card View */
  .skills-cards-container {
    margin-top: 1.5rem;
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .skill-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .skill-card.level-beginner {
    border-top: 4px solid #3498db;
  }
  
  .skill-card.level-intermediate {
    border-top: 4px solid #2ecc71;
  }
  
  .skill-card.level-advanced {
    border-top: 4px solid #9b59b6;
  }
  
  .card-header {
    padding: 1.25rem 1.25rem 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .card-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #2c3e50;
  }
  
  .card-category {
    font-size: 0.85rem;
    color: #718096;
    display: block;
    margin-top: 0.25rem;
  }
  
  .card-body {
    padding: 1.25rem;
    flex: 1;
  }
  
  .skill-level-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .skill-card.level-beginner .skill-level-badge {
    background-color: rgba(52, 152, 219, 0.15);
    color: #2980b9;
  }
  
  .skill-card.level-intermediate .skill-level-badge {
    background-color: rgba(46, 204, 113, 0.15);
    color: #27ae60;
  }
  
  .skill-card.level-advanced .skill-level-badge {
    background-color: rgba(155, 89, 182, 0.15);
    color: #8e44ad;
  }
  
  .skill-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .stat-icon {
    font-size: 0.9rem;
  }
  
  .stat-value {
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .last-practiced {
    font-size: 0.85rem;
    color: #718096;
    margin-bottom: 1rem;
  }
  
  .card-actions {
    display: flex;
    border-top: 1px solid #e2e8f0;
  }
  
  .card-btn {
    flex: 1;
    padding: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .card-btn.edit {
    color: #3498db;
  }
  
  .card-btn.delete {
    color: #e74c3c;
  }
  
  .card-btn:hover {
    background-color: #f8fafc;
  }
  
  /* Compact List View */
  .skills-compact-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
    overflow: hidden;
  }
  
  .compact-skill-item {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    cursor: pointer;
  }
  
  .compact-skill-item:last-child {
    border-bottom: none;
  }
  
  .compact-skill-item:hover {
    background-color: #f8fafc;
  }
  
  .compact-skill-main {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .skill-name {
    flex: 1;
    font-weight: 600;
  }
  
  .skill-hours {
    min-width: 60px;
    text-align: right;
  }
  
  .skill-date {
    min-width: 80px;
    text-align: right;
    font-size: 0.85rem;
    color: #718096;
  }
  
  .compact-skill-details {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed #e2e8f0;
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  .detail-row span:first-child {
    font-weight: 600;
    color: #4a5568;
  }
  
  .detail-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .small-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
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
  
  /* Add Category Modal */
  .add-category {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .add-category input {
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  .error-message {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  /* Responsive Adjustments */
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
    
    .skills-table th, 
    .skills-table td {
      padding: 0.75rem;
    }
    
    .skill-category {
      display: none;
    }
    
    .skill-category-mobile {
      display: inline;
    }
    
    .actions {
      flex-direction: column;
    }
    
    .compact-skill-main {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .skill-name {
      flex: 100%;
    }
    
    .skill-hours, .skill-date {
      text-align: left;
      min-width: auto;
    }
  }
  .return-to-dash {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}

  </style>