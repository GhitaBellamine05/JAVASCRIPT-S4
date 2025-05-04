<template>
    <div class="skills-manager">
      <div class="header-section">
        <div class="header-content">
          <div class="logo">
            <img src="https://via.placeholder.com/60x60" alt="Logo" />
            <h1>Skills Dashboard</h1>
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
                <input
                  type="text"
                  id="skillName"
                  v-model="newSkill.name"
                  placeholder="e.g. React, Python, Docker..."
                  @keyup.enter="handleAddSkill"
                />
              </div>
              
              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" v-model="newSkill.category">
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Design">Design</option>
                  <option value="Other">Other</option>
                </select>
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
                <span>Skill Level Preview:</span>
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
        
        <div class="skills-list-container">
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
                <option v-for="category in categories" :value="category" :key="category">
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
                  <th @click="sortByField('certificates')">
                    Certs
                    <span class="sort-icon" v-if="sortField === 'certificates'">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </th>
                  <th @click="sortByField('projects')">
                    Projects
                    <span class="sort-icon" v-if="sortField === 'projects'">
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
                  <td>{{ skill.certificates || 0 }}</td>
                  <td>{{ skill.projects || 0 }}</td>
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
      </div>
      
      <div class="skills-badges">
        <h3>Your Skills Badges</h3>
        <div class="badges-container">
          <div 
            v-for="skill in skills" 
            :key="skill.id" 
            :class="['skill-badge', getLevelClass(skill.level)]"
            @click="editSkill(skill.id)"
          >
            <span class="badge-name">{{ skill.name }}</span>
            <span class="badge-level">{{ skill.level }}</span>
            <span class="badge-hours">{{ skill.learningHours }}h</span>
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
            <p>Are you sure you want to delete this skill? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="btn cancel-btn">Cancel</button>
            <button @click="deleteSkill" class="btn delete-btn">Delete</button>
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
    name: 'SkillsManager',
    data() {
      return {
        skills: [],
        newSkill: {
          name: '',
          category: 'Frontend',
          learningHours: 0,
          certificates: 0,
          projects: 0,
          level: 'Beginner',
          date: new Date().toISOString().split('T')[0]
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
        error: null
      };
    },
    computed: {
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
        
        // Convert score to percentage (max score is 12)
        return Math.min((score / 12) * 100, 100);
      },
      categories() {
        const categories = new Set(this.skills.map(skill => skill.category));
        return Array.from(categories).sort();
      },
      filteredSkills() {
    let filtered = [...this.skills];
  
     // Apply search filter
     if (this.searchTerm) {
    const term = (this.searchTerm || '').toLowerCase();
    filtered = filtered.filter(skill => 
      (skill.name || '').toLowerCase().includes(term) ||
      (skill.category || '').toLowerCase().includes(term)
    );
  }
        
        // Apply level filter
        if (this.filterLevel !== 'all') {
          filtered = filtered.filter(skill => skill.level === this.filterLevel);
        }
        
        // Apply category filter
        if (this.filterCategory !== 'all') {
          filtered = filtered.filter(skill => skill.category === this.filterCategory);
        }
        
        // Apply sorting
        return this.sortSkills(filtered);
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
      }
    },
    watch: {
      sortBy(newVal) {
        const [field, direction] = newVal.split('-');
        this.sortField = field;
        this.sortDirection = direction;
      }
    },
    created() {
      this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        if (user) {
          this.loadSkills();
        } else {
          this.skills = [];
        }
      });
    },
    beforeUnmount() {
      if (this.unsubscribeAuth) {
        this.unsubscribeAuth();
      }
    },
    methods: {
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
      getLevelClass(level) {
        switch (level) {
          case 'Beginner': return 'level-beginner';
          case 'Intermediate': return 'level-intermediate';
          case 'Advanced': return 'level-advanced';
          default: return '';
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
  
          const skillData = {
            ...this.newSkill,
            name: name,
            learningHours: Number(this.newSkill.learningHours),
            certificates: Number(this.newSkill.certificates),
            projects: Number(this.newSkill.projects),
            level: this.calculatedLevel,
            updatedAt: serverTimestamp()
          };
  
          // Check if user document exists
          const userDocRef = doc(db, 'users', this.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, { 
              email: this.currentUser.email,
              createdAt: serverTimestamp()
            });
          }
          
          if (this.isEditing) {
            if (!this.currentSkillId) {
              throw new Error('Missing skill ID for update');
            }
            
            const skillDocRef = doc(db, 'users', this.currentUser.uid, 'skills', this.currentSkillId);
            await updateDoc(skillDocRef, skillData);
            
            // Update local state
            const index = this.skills.findIndex(s => s.id === this.currentSkillId);
            if (index !== -1) {
              this.skills[index] = {
                id: this.currentSkillId,
                ...skillData
              };
            }
            
            this.cancelEdit();
          } else {
            // Check if skill already exists
            const exists = this.skills.some(
              skill => skill.name.toLowerCase() === name.toLowerCase()
            );
            if (exists) {
              throw new Error('This skill already exists');
            }
  
            // Add new skill
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
            category: skill.category || 'Frontend',
            learningHours: skill.learningHours,
            certificates: skill.certificates,
            projects: skill.projects,
            date: skill.date || new Date().toISOString().split('T')[0]
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
          category: 'Frontend',
          learningHours: 0,
          certificates: 0,
          projects: 0,
          level: 'Beginner',
          date: new Date().toISOString().split('T')[0]
        };
        this.error = null;
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
      formatDate(dateString) {
        if (!dateString) return '';
        
        try {
          const date = new Date(dateString);
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
              // Custom sort order for levels
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
    padding: 1rem 1.25rem
  }
 /* Skills Table (continued) */
.skills-table th {
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.skills-table th:hover {
  background-color: #f8fafc;
}

.skills-table td {
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
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

/* Skills Badges */
.skills-badges {
  margin-top: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
}

.skills-badges h3 {
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

.skill-badge {
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

.skill-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.skill-badge.level-beginner {
  background-color: rgba(52, 152, 219, 0.15);
  color: #2980b9;
}

.skill-badge.level-intermediate {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
}

.skill-badge.level-advanced {
  background-color: rgba(155, 89, 182, 0.15);
  color: #8e44ad;
}

.badge-name {
  font-weight: 600;
}

.badge-level {
  font-size: 0.8rem;
  opacity: 0.8;
}

.badge-hours {
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
}
</style>