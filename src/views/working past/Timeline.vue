<template>
  <div class="timeline-container">
    <h2>My Development Timeline</h2>
    
    <div class="controls">
      <button @click="toggleAddEvent" class="add-button">
        {{ showAddForm ? 'Cancel' : 'Add Timeline Event' }}
      </button>
      
      <div class="filter-controls">
        <label>
          Filter by type:
          <select v-model="filterType">
            <option value="all">All Events</option>
            <option value="education">Education</option>
            <option value="work">Work Experience</option>
            <option value="project">Project</option>
            <option value="certification">Certification</option>
          </select>
        </label>
      </div>
    </div>
    
    <form v-if="showAddForm" @submit.prevent="addTimelineEvent" class="event-form">
      <div class="form-group">
        <label for="eventTitle">Title:</label>
        <input 
          type="text" 
          id="eventTitle" 
          v-model="newEvent.title" 
          required 
          placeholder="Event title"
        >
      </div>
      
      <div class="form-group">
        <label for="eventType">Type:</label>
        <select id="eventType" v-model="newEvent.type" required>
          <option value="education">Education</option>
          <option value="work">Work Experience</option>
          <option value="project">Project</option>
          <option value="certification">Certification</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Start Date:</label>
          <input 
            type="date" 
            id="startDate" 
            v-model="newEvent.startDate" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="endDate">End Date:</label>
          <input 
            type="date" 
            id="endDate" 
            v-model="newEvent.endDate" 
            :disabled="newEvent.isCurrent"
          >
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="newEvent.isCurrent"
            > Current
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label for="eventDescription">Description:</label>
        <textarea 
          id="eventDescription" 
          v-model="newEvent.description" 
          rows="3"
          placeholder="Details about this event"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="save-button">Save Event</button>
      </div>
    </form>
    
    <div v-if="loading" class="loading">Loading timeline...</div>
    
    <div v-else class="timeline">
      <div 
        v-for="(event, index) in filteredEvents" 
        :key="event.id" 
        class="timeline-event"
        :class="[event.type, { 'current': event.isCurrent }]"
      >
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="event-header">
            <h3>{{ event.title }}</h3>
            <span class="event-date">
              {{ formatDate(event.startDate) }} - 
              {{ event.isCurrent ? 'Present' : formatDate(event.endDate) }}
            </span>
            <span class="event-type">{{ formatType(event.type) }}</span>
          </div>
          <p class="event-description">{{ event.description }}</p>
          <div class="event-actions">
            <button @click="editEvent(event, index)" class="edit-button">Edit</button>
            <button @click="confirmDelete(event.id)" class="delete-button">Delete</button>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && events.length === 0" class="empty-timeline">
        No timeline events yet. Add your first event!
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'TimelinePage',
  data() {
    return {
      events: [],
      loading: true,
      showAddForm: false,
      editingEventId: null,
      filterType: 'all',
      newEvent: {
        title: '',
        type: 'education',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        description: '',
        isCurrent: false
      },
      userId: null
    };
  },
  computed: {
    filteredEvents() {
      if (this.filterType === 'all') return this.events;
      return this.events.filter(event => event.type === this.filterType);
    }
  },
  methods: {
    async loadEvents() {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        this.loading = false;
        return;
      }
      
      this.userId = user.uid;
      const db = getFirestore();
      
      try {
        const eventsCol = collection(db, 'users', this.userId, 'timeline');
        const snapshot = await getDocs(eventsCol);
        
        this.events = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        
      } catch (error) {
        console.error("Error loading timeline events:", error);
      } finally {
        this.loading = false;
      }
    },
    async addTimelineEvent() {
      try {
        const db = getFirestore();
        const eventData = {
          ...this.newEvent,
          userId: this.userId,
          createdAt: new Date()
        };
        
        if (this.editingEventId) {
          // Update existing event
          const eventRef = doc(db, 'users', this.userId, 'timeline', this.editingEventId);
          await updateDoc(eventRef, eventData);
          
          // Update local state
          const index = this.events.findIndex(e => e.id === this.editingEventId);
          if (index !== -1) {
            this.events[index] = { id: this.editingEventId, ...eventData };
          }
          
          this.editingEventId = null;
        } else {
          // Add new event
          const eventsCol = collection(db, 'users', this.userId, 'timeline');
          const docRef = await addDoc(eventsCol, eventData);
          
          // Add to local state
          this.events.unshift({
            id: docRef.id,
            ...eventData
          });
        }
        
        this.resetForm();
        this.showAddForm = false;
        
      } catch (error) {
        console.error("Error saving timeline event:", error);
      }
    },
    editEvent(event, index) {
      this.newEvent = {
        title: event.title,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        description: event.description,
        isCurrent: event.isCurrent || false
      };
      
      this.editingEventId = event.id;
      this.showAddForm = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async confirmDelete(eventId) {
      if (confirm('Are you sure you want to delete this event?')) {
        await this.deleteEvent(eventId);
      }
    },
    async deleteEvent(eventId) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, 'users', this.userId, 'timeline', eventId));
        
        // Remove from local state
        this.events = this.events.filter(event => event.id !== eventId);
        
      } catch (error) {
        console.error("Error deleting timeline event:", error);
      }
    },
    toggleAddEvent() {
      this.showAddForm = !this.showAddForm;
      if (!this.showAddForm) {
        this.resetForm();
        this.editingEventId = null;
      }
    },
    resetForm() {
      this.newEvent = {
        title: '',
        type: 'education',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        description: '',
        isCurrent: false
      };
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    formatType(type) {
      const types = {
        education: 'Education',
        work: 'Work Experience',
        project: 'Project',
        certification: 'Certification',
        other: 'Other'
      };
      return types[type] || type;
    }
  },
  created() {
    this.loadEvents();
  }
};
</script>

<style scoped>
.timeline-container {
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

.event-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  font-size: 0.9em;
}

.form-actions {
  margin-top: 20px;
}

.save-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #27ae60;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-event {
  position: relative;
  margin-bottom: 30px;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  top: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a89dc;
  border: 3px solid white;
}

.timeline-event.education .timeline-marker {
  background: #8e44ad;
}

.timeline-event.work .timeline-marker {
  background: #3498db;
}

.timeline-event.project .timeline-marker {
  background: #2ecc71;
}

.timeline-event.certification .timeline-marker {
  background: #f39c12;
}

.timeline-event.current .timeline-marker {
  box-shadow: 0 0 0 3px rgba(74, 137, 220, 0.3);
}

.timeline-content {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.event-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.event-header h3 {
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.event-date {
  color: #7f8c8d;
  font-size: 0.9em;
}

.event-type {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  background: #f1f1f1;
  color: #555;
}

.event-description {
  margin: 10px 0;
  color: #555;
}

.event-actions {
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

.empty-timeline {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

@media (max-width: 600px) {
  .controls {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>