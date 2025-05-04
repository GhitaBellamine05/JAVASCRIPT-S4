<template>
  <div class="community-manager" :class="{ 'dark-mode': darkMode }">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="logo">
          <img src="/logoDev.jpg" alt="Community Logo" />
          <div>
            <h1>Developer Community</h1>
            <router-link to="/dash" class="return-to-dash">
              ← Return to Main Dashboard
            </router-link>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-value">{{ users.length }}</div>
            <div class="stat-label">Total Developers</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ following.length }}</div>
            <div class="stat-label">Following</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ followers.length }}</div>
            <div class="stat-label">Followers</div>
          </div>
          <button @click="toggleDarkMode" class="theme-toggle-btn">
            <svg v-if="darkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="community-container">
      <div class="tabs">
        <button 
          @click="activeTab = 'all'"
          :class="{ active: activeTab === 'all' }"
        >
          All Developers
        </button>
        <button 
          @click="activeTab = 'following'"
          :class="{ active: activeTab === 'following' }"
        >
          Following
        </button>
        <button 
          @click="activeTab = 'followers'"
          :class="{ active: activeTab === 'followers' }"
        >
          Followers
        </button>
      </div>
      
      <div class="users-grid">
        <div 
          v-for="user in filteredUsers" 
          :key="user.uid" 
          class="user-card"
        >
          <div class="user-avatar" :style="user.profileImageUrl ? { 
            backgroundImage: `url(${user.profileImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}">
            <span v-if="!user.profileImageUrl">{{ getUserInitials(user.name) }}</span>
          </div>
          <div class="user-info">
            <h3 class="user-name">{{ user.name }}</h3>
            <p class="user-email">{{ user.email }}</p>
            
            <div v-if="user.socials" class="user-socials">
              <!-- GitHub -->
              <a v-if="user.socials.github" :href="user.socials.github" target="_blank" class="social-icon" title="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              
              <!-- LinkedIn -->
              <a v-if="user.socials.linkedin" :href="user.socials.linkedin" target="_blank" class="social-icon" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                </svg>
              </a>
              
              <!-- Twitter/X -->
              <a v-if="user.socials.twitter" :href="user.socials.twitter" target="_blank" class="social-icon" title="Twitter/X">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              <!-- Facebook -->
              <a v-if="user.socials.facebook" :href="user.socials.facebook" target="_blank" class="social-icon" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                </svg>
              </a>
              
              <!-- Instagram -->
              <a v-if="user.socials.instagram" :href="user.socials.instagram" target="_blank" class="social-icon" title="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              
              <!-- Discord -->
              <a v-if="user.socials.discord" :href="`https://discord.com/users/${user.socials.discord}`" target="_blank" class="social-icon" title="Discord">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v19.056c0 1.368-1.104 2.472-2.46 2.472H4.46C3.104 24 2 22.896 2 21.528V2.472C2 1.104 3.104 0 4.46 0h15.08zm-4.632 15.672c2.652-.84 3.691-2.568 3.691-2.568-3.334-1.296-4.274-2.832-4.274-2.832-1.872 1.344-2.232 2.304-2.232 2.304-2.112-.024-2.904-1.296-2.904-1.296-1.584 1.728-.372 3.096-.372 3.096-1.128 3.264-.924 4.752-.6 5.04.6.6 1.728-.108 1.728-.108 0-.864-.348-1.464-.348-1.464 2.052.24 3.24 1.536 3.24 1.536 1.896 3.072 5.004 2.868 5.004 2.868l1.464-1.92c-1.32-.468-2.172-1.404-2.172-1.404-1.224.84-2.52 1.296-3.612 1.68-.972.312-1.956.456-2.952.456-1.008 0-1.992-.144-2.964-.456-1.08-.384-2.388-.84-3.612-1.68 0 0-.864.936-2.196 1.404l1.464 1.92s3.108.204 5.004-2.868c0 0 1.188-1.296 3.24-1.536 0 0-.348.6-.348 1.464 0 0 1.128.708 1.728.108.324-.288.528-1.776-.6-5.04 0 0 1.2-1.368-.372-3.096 0 0-.792 1.272-2.904 1.296 0 0-.36-.96-2.232-2.304 0 0-.94 1.536-4.274 2.832 0 0 1.039 1.728 3.691 2.568 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416-.132-.18-.204-.288-.204-.288.144.096.324.216.516.324.18.108.372.204.54.288.084.036.168.072.228.108l.036.012c1.68.708 3.66 1.2 5.964 1.2s4.284-.492 5.964-1.2l.036-.012c.06-.036.144-.072.228-.108.168-.084.36-.18.54-.288a2.75 2.75 0 00.516-.324s-.576.96-2.1 1.416c.36.456.804.996.804.996zM8.508 11.16c-.72 0-1.308.588-1.308 1.308 0 .72.588 1.308 1.308 1.308.72 0 1.308-.588 1.308-1.308 0-.72-.588-1.308-1.308-1.308zm6.984 0c-.72 0-1.308.588-1.308 1.308 0 .72.588 1.308 1.308 1.308.72 0 1.308-.588 1.308-1.308 0-.72-.588-1.308-1.308-1.308z"/>
                </svg>
              </a>
            </div>
            
            <div class="user-actions">
              <div v-if="user.uid !== currentUser.uid">
                <!-- Follow button - shown when not following -->
                <button 
                  v-if="!isFollowing(user.uid)"
                  @click="followUser(user.uid)"
                  :class="{
                    'action-btn': true,
                    'follow-btn': true,
                    'loading': processingUser === user.uid
                  }"
                  :disabled="processingUser === user.uid"
                >
                  <span v-if="processingUser === user.uid">
                    <span class="loader"></span>
                  </span>
                  <span v-else>Follow</span>
                </button>
                
                <!-- Unfollow button - shown when already following -->
                <button 
                  v-else
                  @click="handleUnfollowAction(user)"
                  :class="{
                    'action-btn': true,
                    'unfollow-btn': true,
                    'loading': processingUser === user.uid
                  }"
                  :disabled="processingUser === user.uid"
                >
                  <span v-if="processingUser === user.uid">
                    <span class="loader"></span>
                  </span>
                  <span v-else>Unfollow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Unfollow confirmation modal -->
    <div v-if="showUnfollowModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Unfollow {{ unfollowingUser.name }}?</h3>
        <p>You won't see their updates in your feed anymore.</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="cancelUnfollow">Cancel</button>
          <button class="unfollow-btn" @click="confirmUnfollow">Unfollow</button>
        </div>
      </div>
    </div>

    <!-- Toast message -->
    <div v-if="toast.show" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import { db } from '@/services/firebase';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'CommunityPage',
  data() {
    return {
      users: [],
      currentUser: {},
      following: [],
      followers: [],
      activeTab: 'all',
      showUnfollowModal: false,
      unfollowingUser: null,
      processingUser: null,
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
      darkMode: false
    }
  },
  computed: {
    filteredUsers() {
      if (this.activeTab === 'following') {
        return this.users.filter(user => 
          this.following.includes(user.uid) && user.uid !== this.currentUser.uid
        );
      } else if (this.activeTab === 'followers') {
        return this.users.filter(user => 
          this.followers.includes(user.uid) && user.uid !== this.currentUser.uid);
      }
      return this.users.filter(user => user.uid !== this.currentUser.uid);
    }
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
    getUserInitials(name) {
      if (!name) return '?';
      const parts = name.split(' ');
      return parts.length > 1 
        ? `${parts[0][0]}${parts[parts.length-1][0]}`.toUpperCase()
        : name.length > 1 ? `${name[0]}${name[1]}`.toUpperCase() : `${name[0]}`.toUpperCase();
    },
    
    isFollowing(userId) {
      return this.following.includes(userId);
    },
    
    handleUnfollowAction(user) {
      this.unfollowingUser = user;
      this.showUnfollowModal = true;
    },
    
    cancelUnfollow() {
      this.showUnfollowModal = false;
      this.unfollowingUser = null;
    },
    
    confirmUnfollow() {
      if (this.unfollowingUser) {
        this.unfollowUser(this.unfollowingUser.uid);
        this.showUnfollowModal = false;
        this.unfollowingUser = null;
      }
    },
    
    async followUser(userId) {
      this.processingUser = userId;
      const auth = getAuth();
      const currentUserId = auth.currentUser.uid;
      const followRef = doc(db, 'users', currentUserId, 'following', userId);
      const followerRef = doc(db, 'users', userId, 'followers', currentUserId);
      
      try {
        await setDoc(followRef, { timestamp: new Date() });
        await setDoc(followerRef, { timestamp: new Date() });
        
        if (!this.following.includes(userId)) {
          this.following.push(userId);
        }
        
        this.showToast('Successfully followed user', 'success');
      } catch (error) {
        console.error('Error following user:', error);
        this.showToast('Failed to follow user', 'error');
      } finally {
        this.processingUser = null;
      }
    },
    
    async unfollowUser(userId) {
      this.processingUser = userId;
      const auth = getAuth();
      const currentUserId = auth.currentUser.uid;
      const followRef = doc(db, 'users', currentUserId, 'following', userId);
      const followerRef = doc(db, 'users', userId, 'followers', currentUserId);
      
      try {
        await deleteDoc(followRef);
        await deleteDoc(followerRef);
        
        this.following = this.following.filter(id => id !== userId);
        
        if (this.activeTab === 'following') {
          this.$nextTick(() => {
            if (this.filteredUsers.length === 0 && this.following.length > 0) {
              this.activeTab = 'all';
            }
          });
        }
        
        this.showToast('Successfully unfollowed user', 'success');
      } catch (error) {
        console.error('Error unfollowing user:', error);
        this.showToast('Failed to unfollow user', 'error');
      } finally {
        this.processingUser = null;
      }
    },
    
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type
      };
      
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
    
    async fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        this.users = querySnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
        this.showToast('Error loading users', 'error');
      }
    },
    
    async fetchCurrentUser() {
      const auth = getAuth();
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            this.currentUser = {
              uid: userDoc.id,
              ...userDoc.data()
            };
          } else {
            this.showToast('Your user profile could not be found', 'error');
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
          this.showToast('Error loading your profile', 'error');
        }
      } else {
        this.$router.push('/dash');
      }
    },
    
    async fetchFollowing() {
      const auth = getAuth();
      if (auth.currentUser) {
        try {
          const followingSnapshot = await getDocs(
            collection(db, 'users', auth.currentUser.uid, 'following')
          );
          this.following = followingSnapshot.docs.map(doc => doc.id);
        } catch (error) {
          console.error('Error fetching following:', error);
          this.showToast('Error loading your following list', 'error');
        }
      }
    },
    
    async fetchFollowers() {
      const auth = getAuth();
      if (auth.currentUser) {
        try {
          const followersSnapshot = await getDocs(
            collection(db, 'users', auth.currentUser.uid, 'followers')
          );
          this.followers = followersSnapshot.docs.map(doc => doc.id);
        } catch (error) {
          console.error('Error fetching followers:', error);
          this.showToast('Error loading your followers list', 'error');
        }
      }
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

    try {
      await this.fetchCurrentUser();
      await Promise.all([
        this.fetchUsers(),
        this.fetchFollowing(),
        this.fetchFollowers()
      ]);
    } catch (error) {
      console.error('Error initializing community page:', error);
      this.showToast('Error loading community data', 'error');
    }
  }
}
</script>

<style scoped>
/* Light mode background */
.community-manager:not(.dark-mode) {
  background-color: white;
}

/* Dark mode background */
.community-manager.dark-mode {
  background-color: #0f172a; /* Dark blue background */
}

/* User card styles for both modes */
.user-card {
  /* ... existing styles ... */
  transition: all 0.3s ease, background-color 0.3s;
}

/* Light mode user card */
:not(.dark-mode) .user-card {
  background: white;
  border: 1px solid #e0ecff;
}

/* Dark mode user card */
.dark-mode .user-card {
  background-color: #1e293b; /* Slightly lighter dark blue */
  border-color: #334155;
}

/* User name color in dark mode */
.dark-mode .user-name {
  color: #e2e8f0;
}

/* User email color in dark mode */
.dark-mode .user-email {
  color: #94a3b8;
}

/* Social icons in dark mode */
.dark-mode .social-icon {
  color: #94a3b8;
}

.dark-mode .social-icon:hover {
  color: #60a5fa; /* Light blue for hover */
}

/* Action buttons in dark mode */
.dark-mode .action-btn {
  color: white;
}

/* Follow button in dark mode */
.dark-mode .follow-btn {
  background: linear-gradient(135deg, #1e40af, #0369a1);
}

.dark-mode .follow-btn:hover {
  background: linear-gradient(135deg, #1e3a8a, #075985);
}

/* Unfollow button in dark mode */
.dark-mode .unfollow-btn {
  background-color: rgba(220, 38, 38, 0.9);
  color: white;
}

.dark-mode .unfollow-btn:hover {
  background-color: rgba(185, 28, 28, 0.9);
}

/* Tabs in dark mode */
.dark-mode .tabs button {
  background-color: #334155;
  color: #e2e8f0;
}

.dark-mode .tabs button.active {
  background: #1d4ed8;
  color: white;
}

/* Stats cards in dark mode */
.dark-mode .stat-card {
  background: rgba(15, 23, 42, 0.5);
}

.dark-mode .stat-card:hover {
  background: rgba(15, 23, 42, 0.7);
}
/* User tags container */
.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* Individual tag styles */
.user-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Light mode tags */
:not(.dark-mode) .user-tag {
  background-color: #e0ecff;
  color: #1e40af;
}

/* Dark mode tags */
.dark-mode .user-tag {
  background-color: #1e40af; /* Dark blue background */
  color: #e0ecff; /* Light text */
}
/* Base styles */
.community-manager {
  max-width: 1400px;
  margin: 0 auto;
  transition: background-color 0.3s, color 0.3s;
}

/* Light mode styles */
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

.return-to-dash {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}

.return-to-dash:hover {
  color: white;
  text-decoration: underline;
}

.logo img {
  height: 150px;
  width: 150px;
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

.theme-toggle-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.theme-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.community-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #f1f1f1;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tabs button.active {
  background: #0066cc;
  color: white;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #0066cc;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 2px solid #e0ecff;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 1.25rem;
  margin: 0 0 0.25rem;
  color: #2c3e50;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-socials {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-icon {
  width: 24px;
  height: 24px;
  color: #555;
  transition: color 0.2s ease;
}

.social-icon:hover {
  color: #0066cc;
}

.user-actions {
  margin-top: 0.5rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.follow-btn {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
}

.follow-btn:hover {
  background: linear-gradient(135deg, #2a6bc4, #00c2f0);
}

.unfollow-btn {
  background-color: rgba(231, 76, 60, 0.15);
  color: #c0392b;
}

.unfollow-btn:hover {
  background-color: rgba(231, 76, 60, 0.25);
}

.loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s infinite linear;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* Dark mode styles */
.community-projects.dark-mode {
  background-color: #1a202c;
  color: #e2e8f0;
}

.dark-mode .header-section {
  background: linear-gradient(135deg, #0d47a1, #1565c0);
}
.dark-mode {
  background-color:rgb(7, 19, 44);
  color: #e2e8f0;
}

.dark-mode .projects-form,
.dark-mode .projects-visualization,
.dark-mode .projects-display-container,
.dark-mode .projects-list,
.dark-mode .projects-cards,
.dark-mode .projects-table {
  background-color:rgb(16, 36, 71);
  color: #e2e8f0;
  border-color:rgb(18, 42, 84);
}

.dark-mode .form-group input,
.dark-mode .form-group select,
.dark-mode .form-group textarea {
  background-color:rgb(15, 32, 51);
  color: #e2e8f0;
  border-color:rgb(200, 209, 225);
}

.dark-mode .tags-input {
  background-color:rgb(44, 60, 91);
  border-color:rgb(210, 219, 234);
}

.dark-mode .tag {
  background-color:rgb(28, 45, 67);
  color:rgb(194, 201, 205);
}

/* Add more dark mode styles as needed */
.dark-mode .time-range-selector select {
  background-color: #334155;
  border-color:rgb(154, 163, 176);
  color: #e5e7eb;
}

.theme-toggle-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color:rgb(23, 34, 57);
  border: none;
  border-radius: 5px;
  color:rgb(178, 188, 208);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dark-mode .theme-toggle {
  background-color:rgb(39, 56, 79);
  color:rgb(213, 218, 228);
}

.theme-toggle:hover {
  background-color:rgb(14, 30, 54);
}

.dark-mode .theme-toggle:hover {
  background-color: #475569;
}
/* Dark Mode Styles for Project Cards */
.dark-mode .project-card {
  background-color: #0f172a; /* Dark blue background */
  border-color: #1e293b; /* Slightly lighter border */
  color: #e2e8f0; /* Light text color */
}

.dark-mode .project-card:hover {
  background-color: #1e293b; /* Slightly lighter dark blue on hover */
  border-color: #334155; /* Highlighted border on hover */
}

.dark-mode .project-image {
  filter: brightness(0.8); /* Slightly dim the image in dark mode */
}

.dark-mode .project-card .project-status-badge {
  background-color: rgba(255, 255, 255, 0.1); /* Transparent badge background */
  color: #e2e8f0; /* Light text color for the badge */
}

.dark-mode .project-card .project-name {
  color: #e2e8f0; /* Light text color for project names */
}

.dark-mode .project-card .project-description {
  color: #94a3b8; /* Muted light text color for descriptions */
}

.dark-mode .project-card .tech-tag {
  background-color: #1e293b; /* Dark blue for technology tags */
  color: #cbd5e1; /* Light text color for tags */
}

.dark-mode .project-card .tech-more {
  color: #94a3b8; /* Muted light text color for "more" tags */
}

/* Modal styles */
.modal-overlay {
  position: fixed}

.community-manager {
  max-width: 1400px;
  margin: 0 auto;
}

.header-section {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(58, 123, 213, 0.2);
}
/* Light Mode Body */
body {
  background-color: #ffffff; /* White background for light mode */
  color: #2c3e50; /* Dark text color for readability */
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Dark Mode Body */
body.dark-mode {
  background-color: #0f172a; /* Dark blue background for dark mode */
  color: #e2e8f0; /* Light text color for readability */
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

.return-to-dash {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-block;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}

.return-to-dash:hover {
  color: white;
  text-decoration: underline;
}

.logo img {
  height: 150px;
  width: 150px;
  
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

.community-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #f1f1f1;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tabs button.active {
  background: #0066cc;
  color: white;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0ecff;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #0066cc;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 2px solid #e0ecff;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 1.25rem;
  margin: 0 0 0.25rem;
  color: #2c3e50;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-socials {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-icon {
  width: 24px;
  height: 24px;
  color: #555;
  transition: color 0.2s ease;
}

.social-icon:hover {
  color: #0066cc;
}

.user-actions {
  margin-top: 0.5rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.follow-btn {
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  color: white;
}

.follow-btn:hover {
  background: linear-gradient(135deg, #2a6bc4, #00c2f0);
}

.unfollow-btn {
  background-color: rgba(231, 76, 60, 0.15);
  color: #c0392b;
}

.unfollow-btn:hover {
  background-color: rgba(231, 76, 60, 0.25);
}

.loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s infinite linear;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  color: #2c3e50;
}

.modal-content p {
  color: #666;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn {
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.unfollow-btn {
  background-color: rgba(231, 76, 60, 0.9);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.unfollow-btn:hover {
  background-color: rgba(231, 76, 60, 1);
}

/* Toast styles */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 350px;
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

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
  
  .users-grid {
    grid-template-columns: 1fr;
  }
  
  .user-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-socials {
    justify-content: center;
  }
  
  .user-actions {
    display: flex;
    justify-content: center;
  }
}
</style>