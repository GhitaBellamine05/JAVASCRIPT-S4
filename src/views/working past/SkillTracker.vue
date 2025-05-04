<template>
  <div class="skills-manager">
    <div class="header">
      <div class="logo">
        <img src="https://via.placeholder.com/60x60" alt="Logo" />
        <h1>Gestionnaire de Compétences</h1>
      </div>
    </div>

    <div class="skills-form">
      <h2>{{ isEditing ? 'Modifier' : 'Ajouter' }} une compétence</h2>
      <div class="form-grid">
        <div class="form-group">
          <label for="skillName">Compétence</label>
          <input
            type="text"
            id="skillName"
            v-model="newSkill.name"
            class="form-control"
            placeholder="Ex: React, Git, Docker..."
            @keyup.enter="handleAddSkill"
          />
        </div>
        <div class="form-group">
          <label for="learningHours">Heures d'apprentissage</label>
          <input
            type="number"
            id="learningHours"
            v-model.number="newSkill.learningHours"
            class="form-control"
            min="0"
            placeholder="Ex: 10, 50, 200..."
          />
        </div>
        <div class="form-group">
          <label for="certificates">Nombre de certificats</label>
          <input
            type="number"
            id="certificates"
            v-model.number="newSkill.certificates"
            class="form-control"
            min="0"
            placeholder="Ex: 0, 1, 3..."
          />
        </div>
        <div class="form-group">
          <label for="projects">Nombre de projets</label>
          <input
            type="number"
            id="projects"
            v-model.number="newSkill.projects"
            class="form-control"
            min="0"
            placeholder="Ex: 0, 2, 5..."
          />
        </div>
        <div class="form-group">
          <label for="acquisitionDate">Date d'acquisition / progression</label>
          <input
            type="date"
            id="acquisitionDate"
            v-model="newSkill.date"
            class="form-control"
          />
        </div>
      </div>
      <div class="form-group skill-level-display">
        <label>Niveau calculé:</label>
        <span :class="['skill-level', getLevelClass(calculateSkillLevel(newSkill))]">
          {{ calculateSkillLevel(newSkill) }}
        </span>
      </div>
      <div class="btn-group">
        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="btn btn-secondary"
        >
          <i class="fas fa-times"></i> Annuler
        </button>
        <button @click="handleAddSkill" class="btn btn-primary">
          <i :class="isEditing ? 'fas fa-save' : 'fas fa-plus-circle'"></i>
          {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
        </button>
      </div>
    </div>

    <div class="skills-list">
      <div class="skills-header">
        <h2>Mes compétences</h2>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Rechercher des compétences..."
          />
        </div>
      </div>

      <table v-if="filteredSkills.length > 0" class="skills-table">
        <thead>
          <tr>
            <th>Compétence</th>
            <th>Niveau</th>
            <th>Heures d'apprentissage</th>
            <th>Certificats</th>
            <th>Projets</th>
            <th>Date d'acquisition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(skill, index) in filteredSkills" :key="index">
            <td>{{ skill.name }}</td>
            <td>
              <span :class="['skill-level', getLevelClass(skill.level)]">
                {{ skill.level }}
              </span>
            </td>
            <td>{{ skill.learningHours || 0 }} h</td>
            <td>{{ skill.certificates || 0 }}</td>
            <td>{{ skill.projects || 0 }}</td>
            <td>{{ formatDate(skill.date) }}</td>
            <td class="action-buttons">
              <span
                class="btn-icon btn-edit tooltip"
                @click="editSkill(getOriginalIndex(skill))"
              >
                <i class="fas fa-edit"></i>
                <span class="tooltip-text">Modifier</span>
              </span>
              <span
                class="btn-icon btn-delete tooltip"
                @click="deleteSkill(getOriginalIndex(skill))"
              >
                <i class="fas fa-trash"></i>
                <span class="tooltip-text">Supprimer</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <i :class="searchTerm ? 'fas fa-search' : 'fas fa-code'"></i>
        <h3>
          {{ searchTerm ? 'Aucun résultat trouvé' : 'Aucune compétence ajoutée' }}
        </h3>
        <p>
          {{
            searchTerm
              ? 'Essayez avec un autre terme de recherche.'
              : 'Commencez à ajouter vos compétences techniques pour les gérer facilement.'
          }}
        </p>
      </div>
    </div>

    <div v-if="skills.length > 0" class="badge-box" id="skillBadges">
      <div
        v-for="(skill, index) in skills"
        :key="`badge-${index}`"
        :class="['skill-badge', getBadgeClass(skill.level)]"
      >
        <span>{{ skill.name }}</span>
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
        learningHours: 0,
        certificates: 0,
        projects: 0,
        level: 'Débutant',
        date: new Date().toISOString().split('T')[0]
      },
      isEditing: false,
      editIndex: null,
      searchTerm: '',
      currentUser: null,
      currentSkillDocId: null,
      loading: false,
      error: null
    };
  },
  computed: {
    filteredSkills() {
      if (!this.searchTerm) {
        return this.skills;
      }
      const term = this.searchTerm.toLowerCase();
      return this.skills.filter(
        skill =>
          skill.name.toLowerCase().includes(term) ||
          skill.level.toLowerCase().includes(term)
      );
    }
  },
  created() {
    // Set up auth state listener
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
    // Clean up auth listener
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
      
      if (score <= 3) return 'Débutant';
      else if (score <= 8) return 'Intermédiaire';
      else return 'Avancé';
    },
    getLevelClass(level) {
      switch (level) {
        case 'Débutant': return 'level-beginner';
        case 'Intermédiaire': return 'level-intermediate';
        case 'Avancé': return 'level-advanced';
        default: return '';
      }
    },
    getBadgeClass(level) {
      switch (level) {
        case 'Débutant': return 'beginner';
        case 'Intermédiaire': return 'intermediate';
        case 'Avancé': return 'advanced';
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
        };

        const calculatedLevel = this.calculateSkillLevel(skillData);
        
        const skillToSave = {
          ...skillData,
          level: calculatedLevel,
          updatedAt: serverTimestamp()
        };

        if (!this.isEditing) {
          skillToSave.createdAt = serverTimestamp();
        }

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
          if (!this.currentSkillDocId) {
            throw new Error('Missing skill ID for update');
          }
          
          const skillDocRef = doc(db, 'users', this.currentUser.uid, 'skills', this.currentSkillDocId);
          await updateDoc(skillDocRef, skillToSave);
          
          // Update local state
          const index = this.skills.findIndex(s => s.id === this.currentSkillDocId);
          if (index !== -1) {
            this.skills[index] = {
              id: this.currentSkillDocId,
              ...skillToSave
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
          const docRef = await addDoc(skillsColRef, skillToSave);
          
          this.skills.push({
            id: docRef.id,
            ...skillToSave
          });
        }

        this.resetForm();
      } catch (error) {
        console.error("Error saving skill: ", error);
        this.error = error.message || "An error occurred while saving";
        alert(this.error);
      }
    },
    editSkill(index) {
      const skill = this.skills[index];
      this.newSkill = { 
        name: skill.name,
        learningHours: skill.learningHours,
        certificates: skill.certificates,
        projects: skill.projects,
        date: skill.date || new Date().toISOString().split('T')[0]
      };
      this.isEditing = true;
      this.editIndex = index;
      this.currentSkillDocId = skill.id;
      this.$nextTick(() => {
        document.querySelector('.skills-form').scrollIntoView({ behavior: 'smooth' });
      });
    },
    cancelEdit() {
      this.isEditing = false;
      this.editIndex = null;
      this.currentSkillDocId = null;
      this.resetForm();
    },
    resetForm() {
      this.newSkill = {
        name: '',
        learningHours: 0,
        certificates: 0,
        projects: 0,
        level: 'Débutant',
        date: new Date().toISOString().split('T')[0]
      };
      this.error = null;
    },
    async deleteSkill(index) {
      if (!confirm('Are you sure you want to delete this skill?')) return;
      
      this.error = null;
      try {
        if (!this.currentUser) {
          throw new Error('User not authenticated');
        }
        
        const skillId = this.skills[index].id;
        if (!skillId) {
          throw new Error('Invalid skill ID');
        }
        
        await deleteDoc(doc(db, 'users', this.currentUser.uid, 'skills', skillId));
        this.skills.splice(index, 1);

        if (this.isEditing && this.editIndex === index) {
          this.cancelEdit();
        }
      } catch (error) {
        console.error("Error deleting skill: ", error);
        this.error = error.message || "An error occurred while deleting";
        alert(this.error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
      } catch (e) {
        return dateString;
      }
    },
    getOriginalIndex(skill) {
      return this.skills.findIndex(s => s.id === skill.id);
    }
  }
};
</script>

<style scoped>
.skills-manager {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f5f5f5;
  padding-bottom: 1rem;
}

.header h1 {
  color: #e74c3c;
  font-size: 2rem;
  margin: 0;
}

.header .logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header .logo img {
  height: 60px;
}

.skills-form {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.skills-form h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.skill-level-display {
  margin-bottom: 1.5rem;
}

.skill-level-display label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #3498db;
  outline: none;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background-color: #e74c3c;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #c0392b;
}

.btn-secondary {
  background-color: #3498db;
  color: #ffffff;
}

.btn-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.skills-list {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.skills-header {
  background-color: #f5f5f5;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skills-header h2 {
  margin: 0;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-box input {
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
}

.skills-table {
  width: 100%;
  border-collapse: collapse;
}

.skills-table th,
.skills-table td {
  padding: 1.25rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #f5f5f5;
}

.skills-table th {
  font-weight: 600;
  background-color: #f9f9f9;
}

.skills-table tr:last-child td {
  border-bottom: none;
}

.skills-table tr:hover {
  background-color: rgba(244, 244, 244, 0.5);
}

.skill-level {
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
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

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #333;
  transition: all 0.3s;
  cursor: pointer;
}

.btn-icon:hover {
  transform: translateY(-2px);
}

.btn-edit:hover {
  background-color: #3498db;
  color: #ffffff;
}

.btn-delete:hover {
  background-color: #e74c3c;
  color: #ffffff;
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  color: #999;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  max-width: 500px;
  margin: 0 auto;
}

.badge-box {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
}

.skill-badge {
  background-color: #f5f5f5;
  border-radius: 50px;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  cursor: default;
}

.skill-badge:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.skill-badge.beginner {
  background-color: rgba(52, 152, 219, 0.15);
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.skill-badge.intermediate {
  background-color: rgba(46, 204, 113, 0.15);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.skill-badge.advanced {
  background-color: rgba(155, 89, 182, 0.15);
  border: 1px solid rgba(155, 89, 182, 0.3);
}

.tooltip {
  position: relative;
}

.tooltip .tooltip-text {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .skills-table {
    display: block;
    overflow-x: auto;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .btn-group {
    justify-content: flex-start;
  }
  
  .skills-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
}
</style>