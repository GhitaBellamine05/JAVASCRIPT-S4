<template>
  <div class="project-details-container" :class="{ 'dark-mode': darkMode }">
    <div class="logo">
      <img src="/logoDev.jpg" alt="Logo" />
      <div class="logo-text">Project Details</div>
    </div>
    
    <!-- Back Button -->
    <button @click="$router.go(-1)" class="back-btn">
      <i class="fas fa-arrow-left"></i> Back to Community
    </button>

    <!-- Dark Mode Toggle -->
    <button @click="toggleDarkMode" class="theme-toggle-btn">
      <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"><span style="color:white">hy</span></i>
    </button>

    <!-- Project Header -->
    <div class="project-header">
      <div class="project-image-wrapper">
        <img :src="project.imageUrl || 'https://via.placeholder.com/1200x400'" 
             alt="Project image" 
             class="project-image">
      </div>
      <div class="project-meta">
        <div class="status-badge" :class="project.status">
          {{ formatStatus(project.status) }}
        </div>
        <h1 class="project-title">{{ project.name }}</h1>
        <div class="owner-info">
          <img :src="ownerProfileImageUrl || 'https://via.placeholder.com/60'" 
               alt="Owner" 
               class="owner-avatar">
          <div class="owner-details">
            <span class="owner-name">{{ ownerName }}</span>
            <span class="project-date">{{ formatDate(project.createdAt) }}</span>
          </div>
        </div>
        <div class="action-buttons">
          <button @click="toggleLike" class="like-btn" :class="{ liked: isLiked }">
            <i class="fas fa-heart"></i> {{ project.likes || 0 }} Likes
          </button>
          <button class="share-btn">
            <i class="fas fa-share-alt"></i> Share
          </button>
        </div>
      </div>
    </div>

    <!-- Project Content -->
    <div class="project-content">
      <div class="main-content">
        <!-- Description Section -->
        <section class="description-section">
          <h2>About This Project</h2>
          <div class="description-content" v-html="formatDescription(project.description)"></div>
        </section>

        <!-- Technologies Section -->
        <section class="technologies-section">
          <h2>Technologies Used</h2>
          <div class="tech-tags">
            <span v-for="(tech, index) in project.technologies" 
                  :key="index" 
                  class="tech-tag">
              {{ tech }}
            </span>
          </div>
        </section>

        <!-- Gallery Section -->
        <section class="gallery-section" v-if="project.gallery && project.gallery.length > 0">
          <h2>Project Gallery</h2>
          <div class="gallery-grid">
            <div v-for="(image, index) in project.gallery" 
                 :key="index" 
                 class="gallery-item"
                 @click="openLightbox(index)">
              <img :src="image.url" :alt="image.caption || 'Project image'" class="gallery-image">
              <div v-if="image.caption" class="image-caption">{{ image.caption }}</div>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <div class="project-sidebar">
        <!-- Project Stats -->
        <div class="stats-card">
          <h3>Project Stats</h3>
          <div class="stat-item">
            <i class="fas fa-eye"></i>
            <span>{{ project.views || 0 }} Views</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-heart"></i>
            <span>{{ project.likes || 0 }} Likes</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-comment"></i>
            <span>{{ project.comments ? project.comments.length : 0 }} Comments</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-calendar-alt"></i>
            <span>Started {{ formatDate(project.createdAt) }}</span>
          </div>
          <div v-if="project.endDate" class="stat-item">
            <i class="fas fa-flag-checkered"></i>
            <span>Completed {{ formatDate(project.endDate) }}</span>
          </div>
        </div>

        <!-- Project Links -->
        <div class="links-card" v-if="project.links && project.links.length > 0">
          <h3>Project Links</h3>
          <a v-for="(link, index) in project.links" 
             :key="index" 
             :href="link.url" 
             target="_blank" 
             class="project-link">
            <i :class="getLinkIcon(link.type)"></i>
            <span>{{ link.label || link.type }}</span>
          </a>
        </div>

        <!-- Team Members -->
        <div class="team-card" v-if="project.team && project.team.length > 0">
          <h3>Team Members</h3>
          <div v-for="(member, index) in project.team" 
               :key="index" 
               class="team-member">
            <img :src="member.profileImageUrl || 'https://via.placeholder.com/40'" 
                 alt="Team member" 
                 class="member-avatar">
            <div class="member-info">
              <span class="member-name">{{ member.name }}</span>
              <span class="member-role">{{ member.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="comments-section">
      <h2>Discussion</h2>
      <div class="comment-form">
        <img :src="currentUserProfileImageUrl || 'https://via.placeholder.com/40'" 
             alt="Your profile" 
             class="comment-avatar">
        <div class="comment-input-container">
          <textarea v-model="newComment" 
                    placeholder="Add a comment..." 
                    @keyup.enter.prevent></textarea>
          <button @click="addComment" 
                  :disabled="!newComment.trim() || !currentUser" 
                  class="comment-submit">
            Post
          </button>
        </div>
      </div>
      
      <div v-if="!currentUser" class="login-prompt">
        <i class="fas fa-lock"></i>
        <p>Please sign in to post comments.</p>
      </div>

      <div v-if="loadingComments" class="loading-comments">
        <i class="fas fa-spinner fa-spin"></i> Loading comments...
      </div>

      <div v-else-if="project.comments && project.comments.length > 0" class="comments-list">
        <div v-for="(comment, index) in sortedComments" 
             :key="comment.id || index" 
             class="comment-item">
          <img :src="comment.userProfileImageUrl || 'https://via.placeholder.com/40'" 
               alt="Commenter" 
               class="commenter-avatar">
          <div class="comment-content">
            <div class="comment-header">
              <span class="commenter-name">{{ comment.userName }}</span>
              <span class="comment-date">{{ formatDate(comment.timestamp) }}</span>
              <button v-if="isCommentOwner(comment)" 
                      @click="deleteComment(comment.id)" 
                      class="delete-comment">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <p class="comment-text">{{ comment.text }}</p>
          </div>
        </div>
      </div>

      <div v-else class="no-comments">
        <i class="far fa-comment-dots"></i>
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
      <button @click="closeLightbox" class="close-lightbox">
        <i class="fas fa-times"></i>
      </button>
      <button @click="prevImage" class="nav-btn prev-btn">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="lightbox-content">
        <img :src="project.gallery[lightboxIndex].url" 
             :alt="project.gallery[lightboxIndex].caption || 'Project image'"
             class="lightbox-image">
        <div v-if="project.gallery[lightboxIndex].caption" 
             class="lightbox-caption">
          {{ project.gallery[lightboxIndex].caption }}
        </div>
      </div>
      <button @click="nextImage" class="nav-btn next-btn">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { marked } from 'marked';

export default {
  name: 'ProjectDetails',
  props: ['id'],
  data() {
    return {
      project: {
        comments: []
      },
      loading: true,
      loadingComments: false,
      newComment: '',
      lightboxOpen: false,
      lightboxIndex: 0,
      currentUser: null,
      ownerName: 'Loading...',
      ownerProfileImageUrl: '',
      currentUserProfileImageUrl: '',
      commenters: {},
      commentSubmitting: false,
      darkMode: false
    };
  },
  computed: {
    isLiked() {
      if (!this.currentUser || !this.project.likesBy) return false;
      return this.project.likesBy.includes(this.currentUser.uid);
    },
    isOwner() {
      if (!this.currentUser) return false;
      return this.project.ownerId === this.currentUser.uid;
    },
    currentUserName() {
      return this.currentUser?.displayName || 'Anonymous';
    },
    sortedComments() {
      if (!this.project.comments) return [];
      return [...this.project.comments].sort((a, b) => {
        const dateA = a.timestamp?.toDate?.() || new Date(a.timestamp);
        const dateB = b.timestamp?.toDate?.() || new Date(b.timestamp);
        return dateB - dateA;
      });
    }
  },
  async created() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.darkMode = savedTheme === 'true';
      if (this.darkMode) {
        document.documentElement.classList.add('dark-theme');
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = true;
      document.documentElement.classList.add('dark-theme');
    }

    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      this.currentUser = user;
      if (user) {
        this.currentUserProfileImageUrl = user.photoURL || '';
        await this.loadUserProfile(user.uid);
      }
    });
    
    if (!this.$route.params.id) {
      console.error("No project ID provided");
      this.$router.push('/community/projects');
      return;
    }
    
    await this.loadProject();
    await this.incrementViews();
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (this.darkMode) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
      localStorage.setItem('darkMode', this.darkMode);
    },
    async loadProject() {
      try {
        this.loading = true;
        const db = getFirestore();
        const projectRef = doc(db, 'community_projects', this.$route.params.id);
        const docSnap = await getDoc(projectRef);
        
        if (docSnap.exists()) {
          this.project = {
            id: docSnap.id,
            ...docSnap.data()
          };

          if (!this.project.comments) {
            this.project.comments = [];
          }

          if (this.project.ownerId) {
            await this.loadOwnerProfile(this.project.ownerId);
          }

          if (this.project.comments && this.project.comments.length > 0) {
            await this.loadCommenterProfiles();
          }
        } else {
          console.error("Project not found");
          this.$router.push('/community/projects');
        }
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        this.loading = false;
      }
    },
    async loadOwnerProfile(ownerId) {
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', ownerId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.ownerName = userData.name || userData.displayName || 'Unknown User';
          this.ownerProfileImageUrl = userData.profileImageUrl || '';
        }
      } catch (error) {
        console.error("Error loading owner profile:", error);
      }
    },
    async loadCommenterProfiles() {
      try {
        this.loadingComments = true;
        const uniqueUserIds = new Set();
        
        this.project.comments.forEach(comment => {
          if (comment.userId) {
            uniqueUserIds.add(comment.userId);
          }
        });

        for (const userId of uniqueUserIds) {
          if (!this.commenters[userId]) {
            await this.loadUserProfile(userId);
          }
        }

        this.project.comments = this.project.comments.map(comment => {
          if (comment.userId && this.commenters[comment.userId]) {
            return {
              ...comment,
              userName: this.commenters[comment.userId].name || 'Anonymous',
              userProfileImageUrl: this.commenters[comment.userId].profileImageUrl || ''
            };
          }
          return comment;
        });
      } catch (error) {
        console.error("Error loading commenter profiles:", error);
      } finally {
        this.loadingComments = false;
      }
    },
    async loadUserProfile(userId) {
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.commenters[userId] = {
            name: userData.name || userData.displayName || 'Anonymous',
            profileImageUrl: userData.profileImageUrl || ''
          };
          
          if (this.currentUser && userId === this.currentUser.uid) {
            this.currentUserProfileImageUrl = userData.profileImageUrl || this.currentUser.photoURL || '';
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    },
    async incrementViews() {
      try {
        if (!this.project.id) return;
        
        const db = getFirestore();
        const projectRef = doc(db, 'community_projects', this.project.id);
        await updateDoc(projectRef, {
          views: (this.project.views || 0) + 1
        });
        this.project.views = (this.project.views || 0) + 1;
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    },
    async toggleLike() {
      if (!this.currentUser) {
        alert('Please sign in to like projects');
        return;
      }
      
      try {
        const db = getFirestore();
        const projectRef = doc(db, 'community_projects', this.project.id);
        
        if (this.isLiked) {
          await updateDoc(projectRef, {
            likes: (this.project.likes || 0) - 1,
            likesBy: arrayRemove(this.currentUser.uid)
          });
          this.project.likes = (this.project.likes || 0) - 1;
          this.project.likesBy = this.project.likesBy.filter(id => id !== this.currentUser.uid);
        } else {
          await updateDoc(projectRef, {
            likes: (this.project.likes || 0) + 1,
            likesBy: arrayUnion(this.currentUser.uid)
          });
          this.project.likes = (this.project.likes || 0) + 1;
          if (!this.project.likesBy) {
            this.project.likesBy = [];
          }
          this.project.likesBy.push(this.currentUser.uid);
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    },
    async addComment() {
      if (!this.currentUser || !this.newComment.trim() || this.commentSubmitting) return;
      
      const commentText = this.newComment;
      let commentId = null;
      
      try {
        this.commentSubmitting = true;
        const db = getFirestore();
        const projectRef = doc(db, 'community_projects', this.project.id);
        
        let userName = this.currentUser.displayName || 'Anonymous';
        let userProfileImageUrl = this.currentUserProfileImageUrl || '';
        
        if (this.commenters[this.currentUser.uid]) {
          userName = this.commenters[this.currentUser.uid].name || userName;
          userProfileImageUrl = this.commenters[this.currentUser.uid].profileImageUrl || userProfileImageUrl;
        }
        
        commentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        const newComment = {
          id: commentId,
          userId: this.currentUser.uid,
          userName: userName,
          userProfileImageUrl: userProfileImageUrl,
          text: commentText,
          timestamp: new Date()
        };
        
        if (!this.project.comments) {
          this.project.comments = [];
        }
        this.project.comments.unshift({...newComment});
        this.newComment = '';
        
        const firestoreComment = {
          ...newComment,
          timestamp: new Date()
        };
        
        await updateDoc(projectRef, {
          comments: arrayUnion(firestoreComment)
        });
        
      } catch (error) {
        console.error("Error adding comment:", error);
        if (commentId) {
          this.project.comments = this.project.comments.filter(c => c.id !== commentId);
        }
        this.newComment = commentText;
        alert('Failed to post comment. Please try again.');
      } finally {
        this.commentSubmitting = false;
      }
    },
    async deleteComment(commentId) {
      if (!confirm('Are you sure you want to delete this comment?')) return;
      
      try {
        const db = getFirestore();
        const projectRef = doc(db, 'community_projects', this.project.id);
        const commentToDelete = this.project.comments.find(c => c.id === commentId);
        
        if (commentToDelete) {
          this.project.comments = this.project.comments.filter(c => c.id !== commentId);
          await updateDoc(projectRef, {
            comments: arrayRemove(commentToDelete)
          });
          await this.loadProject();
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
        await this.loadProject();
      }
    },
    isCommentOwner(comment) {
      if (!this.currentUser) return false;
      return comment.userId === this.currentUser.uid;
    },
    formatDate(date) {
      if (!date) return 'N/A';
      try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch(e) {
        console.error("Error formatting date:", e);
        return 'Invalid Date';
      }
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
    formatDescription(description) {
      if (!description) return '';
      try {
        return marked(description);
      } catch (error) {
        console.error("Error formatting description:", error);
        return description;
      }
    },
    getLinkIcon(type) {
      const iconMap = {
        'github': 'fab fa-github',
        'website': 'fas fa-globe',
        'demo': 'fas fa-play-circle',
        'documentation': 'fas fa-book',
        'download': 'fas fa-download'
      };
      return iconMap[type.toLowerCase()] || 'fas fa-link';
    },
    openLightbox(index) {
      if (!this.project.gallery || this.project.gallery.length === 0) return;
      this.lightboxIndex = index;
      this.lightboxOpen = true;
      document.body.style.overflow = 'hidden';
    },
    closeLightbox() {
      this.lightboxOpen = false;
      document.body.style.overflow = '';
    },
    nextImage() {
      if (!this.project.gallery || this.project.gallery.length === 0) return;
      this.lightboxIndex = (this.lightboxIndex + 1) % this.project.gallery.length;
    },
    prevImage() {
      if (!this.project.gallery || this.project.gallery.length === 0) return;
      this.lightboxIndex = (this.lightboxIndex - 1 + this.project.gallery.length) % this.project.gallery.length;
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.project-details-container {
  --primary-blue: #3498db;
  --primary-dark-blue: #2980b9;
  --primary-light-blue: #e1f0fa;
  --secondary-blue: #2c3e50;
  --accent-blue: #1abc9c;
  --text-color: #2c3e50;
  --text-light: #7f8c8d;
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: var(--text-color);
  background-color: var(--bg-color);
  transition: background-color 0.3s, color 0.3s;
}

/* Dark Mode Variables */
.project-details-container.dark-mode {
  --primary-blue: #3498db;
  --primary-dark-blue: #2980b9;
  --primary-light-blue: rgba(52, 152, 219, 0.1);
  --secondary-blue: #ecf0f1;
  --accent-blue: #1abc9c;
  --text-color: #ecf0f1;
  --text-light: #bdc3c7;
  --bg-color: #0f172a;
  --card-bg: #1e293b;
  --border-color: #334155;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.logo img {
  height: 150px;
  width: 150px;
  object-fit: cover;
}

.logo-text {
  font-size: 4em;
  color: var(--primary-blue);
  font-weight: bold;
}

.dark-mode .logo-text {
  color: var(--primary-blue);
}

/* Theme Toggle Button */
.theme-toggle-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: var(--primary-light-blue);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--primary-blue);
  transition: all 0.3s;
  z-index: 10;
}

.theme-toggle-btn:hover {
  background: var(--primary-blue);
  color: white;
}

/* Back Button */
.back-btn {
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: 1rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.back-btn:hover {
  color: var(--primary-dark-blue);
  background-color: var(--primary-light-blue);
}

/* Project Header */
.project-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: transform 0.3s;
}

.project-header:hover {
  transform: translateY(-2px);
}

.project-image-wrapper {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.project-image:hover {
  transform: scale(1.02);
}

.project-meta {
  background: var(--card-bg);
  padding: 1.5rem;
  border-bottom: 4px solid var(--primary-blue);
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  box-shadow: var(--shadow-sm);
}

.status-badge.planning {
  background-color: rgba(243, 156, 18, 0.1);
  color: #d35400;
}

.status-badge.in-progress {
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-blue);
}

.status-badge.completed {
  background-color: rgba(46, 204, 113, 0.1);
  color: #27ae60;
}

.status-badge.on-hold {
  background-color: rgba(149, 165, 166, 0.1);
  color: #7f8c8d;
}

.project-title {
  margin: 0 0 1.5rem;
  font-size: 2rem;
  color: var(--secondary-blue);
  font-weight: 700;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.owner-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-blue);
  box-shadow: var(--shadow-md);
}

.owner-details {
  display: flex;
  flex-direction: column;
}

.owner-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--secondary-blue);
}

.project-date {
  font-size: 0.9rem;
  color: var(--text-light);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.like-btn, .share-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  box-shadow: var(--shadow-sm);
  backgroundColor:black;
}

.like-btn {
  background-color: var(--primary-light-blue);
  color: var(--primary-blue);
}

.like-btn.liked {
  background-color: var(--primary-blue);
  color: white;
}

.like-btn:hover {
  background-color: var(--primary-blue);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.share-btn {
  background-color: var(--border-color);
  color: var(--text-color);
}

.share-btn:hover {
  background-color: var(--primary-light-blue);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Project Content Layout */
.project-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.main-content {
  flex: 2;
}

.project-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Sections */
.description-section, 
.technologies-section, 
.gallery-section {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s;
}

.description-section:hover,
.technologies-section:hover,
.gallery-section:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--secondary-blue);
  font-size: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.description-content {
  line-height: 1.8;
  color: var(--text-color);
}

.description-content >>> p {
  margin-bottom: 1.2rem;
}

.description-content >>> a {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 500;
}

.description-content >>> a:hover {
  text-decoration: underline;
}

.description-content >>> code {
  background-color: var(--primary-light-blue);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: var(--primary-dark-blue);
}

.description-content >>> pre {
  background-color: var(--primary-light-blue);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  border-left: 4px solid var(--primary-blue);
}

.description-content >>> img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: var(--shadow-md);
}

/* Technologies */
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: var(--primary-light-blue);
  color: var(--primary-blue);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.dark-mode .tech-tag {
  background-color: var(--primary-dark-blue);
  color: white;
}

.tech-tag:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.gallery-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.5s;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.image-caption {
  padding: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-light);
  text-align: center;
  background-color: rgba(0, 0, 0, 0.05);
}

/* Sidebar Cards */
.stats-card, 
.links-card, 
.team-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s;
}

.stats-card:hover,
.links-card:hover,
.team-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--secondary-blue);
  font-size: 1.2rem;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.stat-item i {
  width: 1.5rem;
  text-align: center;
  color: var(--primary-blue);
}

.project-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: var(--text-color);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.project-link:hover {
  background-color: var(--primary-light-blue);
  transform: translateX(5px);
}

.project-link i {
  color: var(--primary-blue);
  width: 1.5rem;
  text-align: center;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}

.team-member:hover {
  transform: translateX(5px);
}

.team-member:last-child {
  border-bottom: none;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-blue);
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 500;
  color: var(--secondary-blue);
}

.member-role {
  font-size: 0.85rem;
  color: var(--text-light);
}

/* Comments Section */
.comments-section {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
}

.comment-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: var(--primary-light-blue);
  padding: 1rem;
  border-radius: 8px;
}

.comment-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  align-self: flex-start;
  border: 2px solid var(--primary-blue);
}

.comment-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-input-container textarea {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s;
  background-color: var(--card-bg);
  color: var(--text-color);
}

.comment-input-container textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.comment-submit {
  align-self: flex-end;
  padding: 0.5rem 1.5rem;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.comment-submit:hover:not(:disabled) {
  background-color: var(--primary-dark-blue);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.comment-submit:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.loading-comments {
  text-align: center;
  padding: 2rem;
  color: var(--primary-blue);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}

.comment-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 1rem;
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.commenter-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  align-self: flex-start;
  border: 2px solid var(--primary-blue);
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.commenter-name {
  font-weight: 600;
  color: var(--secondary-blue);
}

.comment-date {
  font-size: 0.85rem;
  color: var(--text-light);
}

.delete-comment {
  margin-left: auto;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s;
  padding: 0.25rem;
  border-radius: 4px;
}

.delete-comment:hover {
  opacity: 1;
  background-color: rgba(231, 76, 60, 0.1);
}

.comment-text {
  margin: 0;
  line-height: 1.6;
  color: var(--text-color);
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
  background-color: var(--primary-light-blue);
  border-radius: 8px;
}

.no-comments i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-blue);
}

/* Lightbox Styles */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-lightbox {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s;
}

.close-lightbox:hover {
  transform: scale(1.2);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
  padding: 1rem;
  transition: all 0.3s;
}

.nav-btn:hover {
  transform: translateY(-50%) scale(1.2);
}

.prev-btn {
  left: 2rem;
}

.next-btn {
  right: 2rem;
}

.lightbox-content {
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.lightbox-caption {
  color: white;
  margin-top: 1rem;
  text-align: center;
  max-width: 80%;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 992px) {
  .project-content {
    flex-direction: column;
  }
  
  .project-sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .stats-card,
  .links-card,
  .team-card {
    flex: 1;
    min-width: 300px;
  }
}

@media (max-width: 768px) {
  .project-image-wrapper {
    height: 300px;
  }
  
  .project-title {
    font-size: 1.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    width: 100%;
    justify-content: center;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .logo-text {
    font-size: 2.5em;
  }
}

@media (max-width: 576px) {
  .project-image-wrapper {
    height: 200px;
  }
  
  .project-title {
    font-size: 1.5rem;
  }
  
  .comment-form {
    flex-direction: column;
  }
  
  .comment-avatar {
    align-self: center;
  }
  
  .logo {
    flex-direction: column;
    text-align: center;
  }
  
  .logo-text {
    font-size: 2em;
  }
}
</style>



<style scoped>
.project-details-container {
  position: relative;
}
.theme-toggle-btn {
  z-index: 1000;
}
.theme-toggle-btn {
  background: #f1f1f1;
  color: #2c3e50;
}
.logo-text{
  font-size:4em;
  color: #3498db;
  font-weight:bold;
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
/* Sophisticated Blue Theme */
.project-details-container {
  --primary-blue: #3498db;
  --primary-dark-blue: #2980b9;
  --primary-light-blue: #e1f0fa;
  --secondary-blue: #2c3e50;
  --accent-blue: #1abc9c;
  --text-color: #2c3e50;
  --text-light: #7f8c8d;
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: var(--text-color);
  background-color: var(--bg-color);
}

/* Back Button */
.back-btn {
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: 1rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.back-btn:hover {
  color: var(--primary-dark-blue);
  background-color: var(--primary-light-blue);
}

/* Project Header */
.project-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: transform 0.3s;
}

.project-header:hover {
  transform: translateY(-2px);
}

.project-image-wrapper {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.project-image:hover {
  transform: scale(1.02);
}

.project-meta {
  background: var(--card-bg);
  padding: 1.5rem;
  border-bottom: 4px solid var(--primary-blue);
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  box-shadow: var(--shadow-sm);
}

.status-badge.planning {
  background-color: rgba(243, 156, 18, 0.1);
  color: #d35400;
}

.status-badge.in-progress {
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-dark-blue);
}

.status-badge.completed {
  background-color: rgba(46, 204, 113, 0.1);
  color: #27ae60;
}

.status-badge.on-hold {
  background-color: rgba(149, 165, 166, 0.1);
  color: #7f8c8d;
}

.project-title {
  margin: 0 0 1.5rem;
  font-size: 2rem;
  color: var(--secondary-blue);
  font-weight: 700;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.owner-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-blue);
  box-shadow: var(--shadow-md);
}

.owner-details {
  display: flex;
  flex-direction: column;
}

.owner-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.project-date {
  font-size: 0.9rem;
  color: var(--text-light);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.like-btn, .share-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  box-shadow: var(--shadow-sm);
}

.like-btn {
  background-color: var(--primary-light-blue);
  color: var(--primary-blue);
}

.like-btn.liked {
  background-color: var(--primary-blue);
  color: white;
}

.like-btn:hover {
  background-color: var(--primary-blue);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.share-btn {
  background-color: #f0f0f0;
  color: var(--text-color);
}

.share-btn:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Project Content Layout */
.project-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.main-content {
  flex: 2;
}

.project-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Sections */
.description-section, 
.technologies-section, 
.gallery-section {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s;
}

.description-section:hover,
.technologies-section:hover,
.gallery-section:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--secondary-blue);
  font-size: 1.5rem;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.description-content {
  line-height: 1.8;
  color: var(--text-color);
}

.description-content >>> p {
  margin-bottom: 1.2rem;
}

.description-content >>> a {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 500;
}

.description-content >>> a:hover {
  text-decoration: underline;
}

.description-content >>> code {
  background-color: var(--primary-light-blue);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: var(--primary-dark-blue);
}

.description-content >>> pre {
  background-color: var(--primary-light-blue);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  border-left: 4px solid var(--primary-blue);
}

.description-content >>> img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: var(--shadow-md);
}

/* Technologies */
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background-color: var(--primary-light-blue);
  color: var(--primary-blue);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.tech-tag:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.gallery-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.5s;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.image-caption {
  padding: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-light);
  text-align: center;
  background-color: rgba(0, 0, 0, 0.05);
}

/* Sidebar Cards */
.stats-card, 
.links-card, 
.team-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s;
}

.stats-card:hover,
.links-card:hover,
.team-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--secondary-blue);
  font-size: 1.2rem;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.stat-item i {
  width: 1.5rem;
  text-align: center;
  color: var(--primary-blue);
}

.project-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: var(--text-color);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.project-link:hover {
  background-color: var(--primary-light-blue);
  transform: translateX(5px);
}

.project-link i {
  color: var(--primary-blue);
  width: 1.5rem;
  text-align: center;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}

.team-member:hover {
  transform: translateX(5px);
}

.team-member:last-child {
  border-bottom: none;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-blue);
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 500;
}

.member-role {
  font-size: 0.85rem;
  color: var(--text-light);
}

/* Comments Section */
.comments-section {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
}

.comment-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: var(--primary-light-blue);
  padding: 1rem;
  border-radius: 8px;
}

.comment-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  align-self: flex-start;
  border: 2px solid var(--primary-blue);
}

.comment-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-input-container textarea {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s;
}

.comment-input-container textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.comment-submit {
  align-self: flex-end;
  padding: 0.5rem 1.5rem;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.comment-submit:hover:not(:disabled) {
  background-color: var(--primary-dark-blue);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.comment-submit:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.loading-comments {
  text-align: center;
  padding: 2rem;
  color: var(--primary-blue);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}

.comment-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 1rem;
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.commenter-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  align-self: flex-start;
  border: 2px solid var(--primary-blue);
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.commenter-name {
  font-weight: 600;
  color: var(--secondary-blue);
}

.comment-date {
  font-size: 0.85rem;
  color: var(--text-light);
}

.delete-comment {
  margin-left: auto;
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s;
  padding: 0.25rem;
  border-radius: 4px;
}

.delete-comment:hover {
  opacity: 1;
  background-color: rgba(231, 76, 60, 0.1);
}

.comment-text {
  margin: 0;
  line-height: 1.6;
  color: var(--text-color);
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
  background-color: var(--primary-light-blue);
  border-radius: 8px;
}

.no-comments i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-blue);
}

/* Lightbox Styles */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-lightbox {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s;
}

.close-lightbox:hover {
  transform: scale(1.2);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
  padding: 1rem;
  transition: all 0.3s;
}

.nav-btn:hover {
  transform: translateY(-50%) scale(1.2);
}

.prev-btn {
  left: 2rem;
}

.next-btn {
  right: 2rem;
}

.lightbox-content {
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.lightbox-caption {
  color: white;
  margin-top: 1rem;
  text-align: center;
  max-width: 80%;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

/* Responsive Design */
@media (max-width: 992px) {
  .project-content {
    flex-direction: column;
  }
  
  .project-sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .stats-card,
  .links-card,
  .team-card {
    flex: 1;
    min-width: 300px;
  }
}

@media (max-width: 768px) {
  .project-image-wrapper {
    height: 300px;
  }
  
  .project-title {
    font-size: 1.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    width: 100%;
    justify-content: center;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 576px) {
  .project-image-wrapper {
    height: 200px;
  }
  
  .project-title {
    font-size: 1.5rem;
  }
  
  .comment-form {
    flex-direction: column;
  }
  
  .comment-avatar {
    align-self: center;
  }
}
</style>