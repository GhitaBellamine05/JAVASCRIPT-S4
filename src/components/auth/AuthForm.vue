<template>
  <div class="auth-form">
    <h2 class="auth-title">{{ isLoginMode ? 'Log In' : 'Sign Up' }}</h2>
    <p class="auth-subtitle">
      {{ isLoginMode ? 'Welcome back!' : 'Join the developer community' }}
    </p>

    <form @submit.prevent="handleSubmit" class="form-container">
      <!-- Only show in sign up mode -->
      <div v-if="!isLoginMode" class="form-group">
        <label for="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          placeholder="Enter your full name"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          placeholder="Enter your email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            v-model="formData.password" 
            placeholder="Enter your password"
            required
            minlength="6"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showPassword = !showPassword"
          >
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Only show in sign up mode -->
      <div v-if="!isLoginMode" class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="formData.confirmPassword" 
          placeholder="Confirm your password"
          required
          minlength="6"
        />
        <div v-if="passwordMismatch" class="error-message">
          Passwords do not match
        </div>
      </div>

      <!-- Add Socials button (only for signup) -->
      <div v-if="!isLoginMode && !showSocials" class="add-socials-container">
        <button 
          type="button" 
          class="add-socials-button" 
          @click="showSocials = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="plus-icon">
            <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
          </svg>
          Add Social Media Profiles
        </button>
      </div>

      <!-- Social Media Section (only for signup and when button is clicked) -->
      <div v-if="!isLoginMode && showSocials" class="social-media-section">
        <div class="section-header">
          <h3 class="section-title">Social Media (Optional)</h3>
          <button 
            type="button" 
            class="collapse-button" 
            @click="showSocials = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="collapse-icon">
              <path fill-rule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
            Hide
          </button>
        </div>
        <div class="social-media-grid">
          <div class="form-group">
            <label for="github">GitHub</label>
            <input 
              type="url" 
              id="github" 
              v-model="formData.socials.github" 
              placeholder="https://github.com/username"
            />
          </div>
          <div class="form-group">
            <label for="linkedin">LinkedIn</label>
            <input 
              type="url" 
              id="linkedin" 
              v-model="formData.socials.linkedin" 
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div class="form-group">
            <label for="twitter">Twitter/X</label>
            <input 
              type="url" 
              id="twitter" 
              v-model="formData.socials.twitter" 
              placeholder="https://x.com/username"
            />
          </div>
          <div class="form-group">
            <label for="facebook">Facebook</label>
            <input 
              type="url" 
              id="facebook" 
              v-model="formData.socials.facebook" 
              placeholder="https://facebook.com/username"
            />
          </div>
          <div class="form-group">
            <label for="instagram">Instagram</label>
            <input 
              type="url" 
              id="instagram" 
              v-model="formData.socials.instagram" 
              placeholder="https://instagram.com/username"
            />
          </div>
          <div class="form-group">
            <label for="discord">Discord</label>
            <input 
              type="text" 
              id="discord" 
              v-model="formData.socials.discord" 
              placeholder="Username#1234"
            />
          </div>
        </div>
      </div>

      <!-- Terms checkbox for signup -->
      <div v-if="!isLoginMode" class="form-group checkbox-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formData.agreeTerms" 
            required
          />
          <span>I agree to the <a href="#" @click.prevent="showTerms">Terms and Conditions</a></span>
        </label>
      </div>

      <!-- Forgot password for login -->
      <div v-else class="forgot-password">
        <router-link to="/forgot-password" @click.prevent="forgotPassword">
          Forgot your password?
        </router-link>
      </div>

      <!-- Error message display -->
      <div v-if="errorMessage" class="error-message auth-error">
        {{ errorMessage }}
      </div>

      <button 
        type="submit" 
        class="auth-submit-button" 
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting" class="spinner"></span>
        <span v-else>{{ isLoginMode ? 'Log In' : 'Create Account' }}</span>
      </button>
    </form>

    <div class="auth-switch">
      {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
      <a href="#" @click.prevent="$emit('toggleMode')">
        {{ isLoginMode ? 'Sign Up' : 'Log In' }}
      </a>
    </div>
  </div>
</template>
<script>
import { auth, db } from '@/services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';

export default {
  name: 'AuthForm',
  props: {
    isLoginMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPassword: false,
      isSubmitting: false,
      errorMessage: '',
      showSocials: false, // Added to control social media section visibility
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        socials: {
          github: '',
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: '',
          discord: ''
        }
      }
    }
  },
  computed: {
    passwordMismatch() {
      return !this.isLoginMode && 
             this.formData.password && 
             this.formData.confirmPassword && 
             this.formData.password !== this.formData.confirmPassword;
    }
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = '';
      
      // Basic validation
      if (!this.formData.email || !this.formData.password) {
        this.errorMessage = 'Please fill in all required fields';
        return;
      }
      
      // Check password match for signup
      if (!this.isLoginMode && this.passwordMismatch) {
        this.errorMessage = 'Passwords do not match';
        return;
      }
      
      // Check terms agreement for signup
      if (!this.isLoginMode && !this.formData.agreeTerms) {
        this.errorMessage = 'You must agree to the Terms and Conditions';
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        if (this.isLoginMode) {
          // Login existing user
          const userCredential = await signInWithEmailAndPassword(
            auth, 
            this.formData.email, 
            this.formData.password
          );
          
          // Update user status to online and last login time
          await this.updateUserOnlineStatus(userCredential.user.uid, true);
          
          this.$emit('success', userCredential);
        } else {
          // Create new user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            this.formData.email,
            this.formData.password
          );
          
          // Create user document with online status
          await this.createUserInFirestore(userCredential.user);
          
          this.$emit('success', userCredential);
        }
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    
    async updateUserOnlineStatus(userId, isOnline) {
      try {
        await setDoc(doc(db, 'users', userId), {
          isOnline,
          lastLogin: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    },
    
    async createUserInFirestore(user) {
      try {
        // Modern avatar options using the newer DiceBear API
    const defaultAvatarStyles = [
      'adventurer',   // Adventurer character
      'avataaars',    // Customizable avatar
      'bottts',       // Robot avatar
      'notionists',   // Professional looking avatar
      'micah',        // Minimalist character
      'miniavs',      // Minimal avatar
      'open-peeps',   // Illustrated people
      'pixel-art',    // Pixel art character
      'fun-emoji'     // Emoji style
    ];
    
    // Generate random default avatar style
    const randomAvatarStyle = defaultAvatarStyles[Math.floor(Math.random() * defaultAvatarStyles.length)];
    // Using the newer DiceBear API (v7)
    const defaultAvatarUrl = `https://api.dicebear.com/7.x/${randomAvatarStyle}/svg?seed=${user.uid}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
        const userData = {
          uid: user.uid,
          name: this.formData.name,
          email: user.email,
          isOnline: true,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          profileComplete: false,
          profileImageUrl: defaultAvatarUrl, // Set default avatar
          socials: {
            github: this.formData.socials.github || null,
            linkedin: this.formData.socials.linkedin || null,
            twitter: this.formData.socials.twitter || null,
            facebook: this.formData.socials.facebook || null,
            instagram: this.formData.socials.instagram || null,
            discord: this.formData.socials.discord || null
          }
        };
        
        // Create user document
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, userData);
        
        // Initialize user subcollections
        await Promise.all([
          setDoc(doc(db, 'users', user.uid, 'private', 'stats'), {
            totalSkills: 0,
            totalProjects: 0,
            totalObjectives: 0
          }),
          collection(db, 'users', user.uid, 'skills'),
          collection(db, 'users', user.uid, 'projects'),
          collection(db, 'users', user.uid, 'objectives'),
          collection(db, 'users', user.uid, 'activities')
        ]);
        
      } catch (error) {
        console.error('Error creating user in Firestore:', error);
        this.errorMessage = 'Account created but profile setup failed. Please contact support.';
        throw error;
      }
    },
    
    handleAuthError(error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/user-not-found':
          this.errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Incorrect password.';
          break;
        case 'auth/too-many-requests':
          this.errorMessage = 'Too many attempts. Please try again later.';
          break;
        case 'auth/operation-not-allowed':
          this.errorMessage = 'Email/password authentication is not enabled.';
          break;
        case 'permission-denied':
          this.errorMessage = 'You do not have permission to perform this action.';
          break;
        default:
          this.errorMessage = error.message || 'An error occurred. Please try again.';
          console.error('Authentication error:', error);
      }
    },
    
    forgotPassword() {
      this.$emit('forgot-password');
    },
    
    showTerms() {
      this.$emit('show-terms');
    }
  }
}
</script>

<style scoped>
.auth-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  max-height: 100vh; /* Limit height to viewport */
  overflow-y: auto; /* Enable vertical scrolling */
}

/* For better mobile experience */
@media (max-height: 800px) {
  .auth-form {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

/* Optional: Add some padding at the bottom for better scrolling */
.auth-switch {
  margin-bottom: 2rem;
}

/* Add Socials Button Styles */
.add-socials-container {
  margin: 1rem 0;
}

.add-socials-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  width: 100%;
  font-size: 0.875rem;
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-socials-button:hover {
  background-color: #eff6ff;
  border-color: #4f46e5;
}

.plus-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Social Media Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.collapse-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
}

.collapse-button:hover {
  color: #4b5563;
}

.collapse-icon {
  width: 1rem;
  height: 1rem;
}

/* Social Media Grid */
.social-media-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .social-media-grid {
    grid-template-columns: 1fr;
  }
}

.social-media-grid .form-group {
  position: relative;
}

.social-media-grid .form-group label::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.social-media-grid .form-group:nth-child(1) label::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/%3E%3C/svg%3E");
}

.social-media-grid .form-group:nth-child(2) label::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230A66C2'%3E%3Cpath d='M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z'/%3E%3C/svg%3E");
}

/* Add similar for other social media platforms */
.auth-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
}

.auth-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="url"],
.form-group textarea {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1rem;
  width: 100%;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.toggle-password svg {
  width: 1.25rem;
  height: 1.25rem;
}

.additional-info-section {
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.checkbox-label a {
  color: #4f46e5;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.forgot-password {
  text-align: right;
  font-size: 0.875rem;
  margin-top: -0.5rem;
}

.forgot-password a {
  color: #4f46e5;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.auth-error {
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(239, 68, 68, 0.1);
  text-align: center;
}

/* Updated button style with blue gradient */
.auth-submit-button {
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  margin-top: 1rem;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1);
}

.auth-submit-button:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6);
  box-shadow: 0 6px 10px -1px rgba(37, 99, 235, 0.25), 0 4px 6px -1px rgba(37, 99, 235, 0.15);
  transform: translateY(-1px);
}

.auth-submit-button:active {
  transform: translateY(0px);
  box-shadow: 0 2px 4px -1px rgba(37, 99, 235, 0.2), 0 1px 2px -1px rgba(37, 99, 235, 0.1);
}

.auth-submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: linear-gradient(135deg, #9ca3af, #d1d5db);
  box-shadow: none;
  transform: none;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-switch {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}

.auth-switch a {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}

.auth-switch a:hover {
  text-decoration: underline;
}
dark-mode {
  background-color: #0f172a;
  color: #e2e8f0;
}

.dark-mode .header-section {
  background: linear-gradient(135deg, #1e3a8a, #0c4a6e);
}

.dark-mode .objectives-form,
.dark-mode .objectives-visualization,
.dark-mode .objectives-list-container,
.dark-mode .objectives-table,
.dark-mode .empty-state,
.dark-mode .list-controls {
  background-color: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}

.dark-mode .form-group input,
.dark-mode .form-group select,
.dark-mode .form-group textarea {
  background-color: #334155;
  color: #e2e8f0;
  border-color: #475569;
}

.dark-mode .search-container input {
  background-color: #334155;
  color: #e2e8f0;
  border-color: #475569;
}

.dark-mode .search-icon {
  color: #94a3b8;
}

.dark-mode .stat-card {
  background: rgba(30, 58, 138, 0.3);
}

.dark-mode .objective-status.not-started {
  background-color: rgba(100, 116, 139, 0.2);
  color: #94a3b8;
}

.dark-mode .objective-status.in-progress {
  background-color: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

.dark-mode .objective-status.completed {
  background-color: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.dark-mode .objective-priority.low {
  background-color: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.dark-mode .objective-priority.medium {
  background-color: rgba(234, 179, 8, 0.2);
  color: #fde047;
}

.dark-mode .objective-priority.high {
  background-color: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.dark-mode .progress-container {
  background-color: #334155;
}

.dark-mode .progress-bar {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.dark-mode .btn.cancel-btn {
  background-color: #334155;
  color: #e2e8f0;
}

.dark-mode .theme-toggle {
  background-color: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
}

.dark-mode .theme-toggle:hover {
  background-color: #334155;
}

/* Header Layout Fix */
.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo img {
  height: 150px;
  width: 150px;
  object-fit: cover;
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

.theme-toggle-container {
  position: absolute;
  top: 20px;
  right: 20px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 5px;
  color: #1e293b;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
</style>