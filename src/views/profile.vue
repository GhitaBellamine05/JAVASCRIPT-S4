<template>
  <div class="profile-container" :class="{ 'dark-mode': darkMode }">
    <!-- Header with logo and toggle button -->
    <div class="header-section">
      <div class="logo">
        <img src="/logoDev.jpg" alt="Logo" />
        <div class="logo-text">Profile Page</div>
      </div>
      <button @click="toggleDarkMode" class="theme-toggle-btn">
        <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </div>
    
    <div class="profile-header">
      <div class="status-indicator">
        <span class="status-label">Status:</span>
        <span class="status-value" :class="{ 'online': isOnline }">
          {{ isOnline ? 'Online' : 'Offline' }}
        </span>
      </div>
    </div>
    
    <div class="profile-form">
      <div class="profile-picture-section">
        <div class="profile-picture-container">
          <img 
            :src="profileImageUrl || '/default-avatar.png'" 
            alt="Profile Picture" 
            class="profile-picture"
            @error="handleImageError"
          />
          <div v-if="isUploading" class="upload-overlay">
            <div class="upload-progress">{{ uploadProgress }}%</div>
          </div>
        </div>
        
        <div class="profile-picture-actions">
          <div class="image-url-form">
            <input 
              type="text" 
              v-model="imageUrlInput" 
              placeholder="Enter image URL" 
              class="image-url-input"
            >
            <button 
              @click="setImageFromUrl" 
              class="url-button"
              :disabled="isUploading || !imageUrlInput"
            >
              Set Image
            </button>
          </div>
          
          <div class="or-divider">- OR -</div>
          
          <label for="profilePicture" class="upload-button">
            <span class="upload-icon">📷</span> Choose Photo
          </label>
          <input 
            id="profilePicture" 
            type="file" 
            accept="image/*" 
            @change="handleImageUpload" 
            class="file-input"
          >
          <button 
            v-if="profileImageUrl" 
            @click="removeProfilePicture" 
            class="remove-button"
            :disabled="isUploading"
          >
            Remove Photo
          </button>
        </div>
      </div>
      
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          v-model="firstName"
          :placeholder="firstName || 'Enter your first name'"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input 
          id="lastName"
          type="text" 
          v-model="lastName" 
          :placeholder="lastName || 'Enter your last name'"
          required
        >
      </div>

      <!-- Social Media Section -->
      <div class="social-media-section">
        <h3>Social Media Accounts</h3>
        <div class="social-input-group">
          <div class="social-input">
            <i class="fab fa-github"></i>
            <input 
              type="text" 
              v-model="socialLinks.github" 
              placeholder="GitHub username"
            >
          </div>
          <div class="social-input">
            <i class="fab fa-linkedin"></i>
            <input 
              type="text" 
              v-model="socialLinks.linkedin" 
              placeholder="LinkedIn URL"
            >
          </div>
          <div class="social-input">
            <i class="fab fa-instagram"></i>
            <input 
              type="text" 
              v-model="socialLinks.instagram" 
              placeholder="Instagram username"
            >
          </div>
          <div class="social-input">
            <i class="fab fa-facebook"></i>
            <input 
              type="text" 
              v-model="socialLinks.facebook" 
              placeholder="Facebook URL"
            >
          </div>
          <div class="social-input">
            <i class="fab fa-discord"></i>
            <input 
              type="text" 
              v-model="socialLinks.discord" 
              placeholder="Discord username#1234"
            >
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label for="currentPassword">Current Password</label>
        <input 
          id="currentPassword"
          type="password" 
          v-model="oldPass" 
          placeholder="Enter current password"
        >
      </div>
      
      <div class="form-group">
        <label for="newPassword">New Password</label>
        <input 
          id="newPassword"
          type="password" 
          v-model="newPass" 
          placeholder="Enter new password"
        >
      </div>
      
      <div class="form-group">
        <label for="newEmail">Email</label>
        <p class="email-help">Type new email here if you want to change yours</p>
        <input
          id="newEmail" 
          type="email" 
          v-model="newEmail" 
          :placeholder="email"
        >
      </div>
      
      <div class="form-actions">
        <button @click="updateProfile" class="save-button" :disabled="isUploading">Save Changes</button>
      </div>
      
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
    
    <div class="navigation-links">
      <router-link to="/dash" class="back-link">
        <span class="back-icon">←</span> Return to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail,
  sendEmailVerification,
  updateProfile as updateAuthProfile
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: "ProfilePage",
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // User data
    const firstName = ref('');
    const lastName = ref('');
    const oldPass = ref('');
    const newPass = ref('');
    const newEmail = ref('');
    const userId = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');
    const email = ref('');
    const emailVerified = ref(false);
    const isOnline = ref(false);
    const profileImageUrl = ref('');
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const profileImagePath = ref('');
    const imageUrlInput = ref('');
    const darkMode = ref(false);
    
    // Social media links
    const socialLinks = ref({
      github: '',
      linkedin: '',
      instagram: '',
      facebook: '',
      discord: ''
    });

    // Toggle dark mode
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      if (darkMode.value) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
      localStorage.setItem('darkMode', darkMode.value);
    };

    // Get current user on component load
    const getCurrentUser = () => {
      const auth = getAuth();
      return auth.currentUser;
    };
    
    // Safely determine user ID from either auth or route params
    const determineUserId = () => {
      const currentUser = getCurrentUser();
      if (currentUser?.uid) {
        return currentUser.uid;
      }
      
      if (route.params.userid) {
        return route.params.userid;
      }
      
      return null;
    };
    
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const id = determineUserId();
        
        if (!id) {
          errorMessage.value = "No user ID found. Please log in.";
          console.error("User ID not found");
          setTimeout(() => {
            router.push('/dash');
          }, 2000);
          return;
        }
        
        userId.value = id;
        console.log("User ID:", userId.value);
        
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", userId.value));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          firstName.value = userData.firstName || '';
          lastName.value = userData.lastName || '';
          email.value = userData.email || '';
          isOnline.value = userData.isOnline || false;
          
          if (userData.profileImageUrl) {
            profileImageUrl.value = userData.profileImageUrl;
            profileImagePath.value = userData.profileImagePath || '';
            console.log("Loaded profile image:", profileImageUrl.value);
          }
          
          if (userData.socialLinks) {
            socialLinks.value = {
              ...socialLinks.value,
              ...userData.socialLinks
            };
          }
          
          const currentUser = getCurrentUser();
          if (currentUser) {
            emailVerified.value = currentUser.emailVerified || false;
            
            if (!email.value && currentUser.email) {
              email.value = currentUser.email;
              await updateDoc(doc(db, 'users', userId.value), {
                email: currentUser.email,
                updatedAt: new Date()
              });
            }
          }
          
          console.log("User data loaded successfully");
        } else {
          const currentUser = getCurrentUser();
          
          if (currentUser) {
            console.log("Creating new user document...");
            await setDoc(doc(db, 'users', userId.value), {
              firstName: '',
              lastName: '',
              email: currentUser.email || '',
              isOnline: true,
              profileImageUrl: '',
              profileImagePath: '',
              socialLinks: {},
              createdAt: new Date()
            });
            
            email.value = currentUser.email || '';
            emailVerified.value = currentUser.emailVerified || false;
            console.log("New user document created");
          } else {
            console.error("No user found in Auth or Firestore");
            errorMessage.value = "User not found. Please log in again.";
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        errorMessage.value = "Failed to fetch user data: " + error.message;
      }
    };
    
    const setImageFromUrl = async () => {
      if (!imageUrlInput.value) return;
      
      try {
        successMessage.value = '';
        errorMessage.value = '';
        isUploading.value = true;
        
        if (!userId.value) {
          const id = determineUserId();
          if (!id) {
            errorMessage.value = "User ID not found. Please log in again.";
            isUploading.value = false;
            return;
          }
          userId.value = id;
        }
        
        try {
          new URL(imageUrlInput.value);
        } catch (e) {
          errorMessage.value = "Please enter a valid URL";
          isUploading.value = false;
          return;
        }
        
        try {
          const imgPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(new Error("Could not load image from URL"));
            img.src = imageUrlInput.value;
          });
          
          await imgPromise;
        } catch (loadError) {
          errorMessage.value = "Could not load image from this URL. Please check that it's a valid, accessible image URL.";
          isUploading.value = false;
          return;
        }
        
        const currentUser = getCurrentUser();
        if (currentUser) {
          try {
            await updateAuthProfile(currentUser, {
              photoURL: imageUrlInput.value
            });
            console.log("Auth profile updated with URL");
          } catch (authError) {
            console.error("Failed to update auth profile:", authError);
          }
        }
        
        const db = getFirestore();
        await updateDoc(doc(db, 'users', userId.value), {
          profileImageUrl: imageUrlInput.value,
          profileImagePath: 'external_url',
          updatedAt: new Date()
        });
        
        profileImageUrl.value = imageUrlInput.value;
        profileImagePath.value = 'external_url';
        successMessage.value = "Profile picture updated successfully!";
        
        imageUrlInput.value = '';
        
      } catch (error) {
        console.error("Set image URL error:", error);
        errorMessage.value = "Failed to set profile picture: " + error.message;
      } finally {
        isUploading.value = false;
      }
    };
    
    const handleImageError = () => {
      if (profileImageUrl.value) {
        errorMessage.value = "Failed to load image. The URL may be invalid or inaccessible.";
        profileImageUrl.value = '/default-avatar.png';
      }
    };
    
    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        errorMessage.value = "Please upload a valid image file (JPEG, PNG, GIF, WEBP)";
        return;
      }
      
      const maxSize = 500 * 1024;
      if (file.size > maxSize) {
        errorMessage.value = "Image size must be less than 500KB";
        return;
      }
      
      try {
        isUploading.value = true;
        uploadProgress.value = 0;
        successMessage.value = '';
        errorMessage.value = '';
        
        if (!userId.value) {
          const id = determineUserId();
          if (!id) {
            errorMessage.value = "User ID not found. Please log in again.";
            isUploading.value = false;
            return;
          }
          userId.value = id;
        }
        
        const reader = new FileReader();
        
        reader.onloadstart = () => {
          uploadProgress.value = 10;
        };
        
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 90);
            uploadProgress.value = progress;
          }
        };
        
        reader.onerror = () => {
          errorMessage.value = "Failed to read image file";
          isUploading.value = false;
        };
        
        reader.onload = async (e) => {
          try {
            uploadProgress.value = 95;
            const base64Image = e.target.result;
            
            const currentUser = getCurrentUser();
            if (currentUser) {
              try {
                await updateAuthProfile(currentUser, {
                  photoURL: base64Image
                });
                console.log("Auth profile updated with base64 image");
              } catch (authError) {
                console.error("Failed to update auth profile:", authError);
              }
            }
            
            const db = getFirestore();
            await updateDoc(doc(db, 'users', userId.value), {
              profileImageUrl: base64Image,
              profileImagePath: 'base64_image',
              updatedAt: new Date()
            });
            
            profileImageUrl.value = base64Image;
            profileImagePath.value = 'base64_image';
            successMessage.value = "Profile picture updated successfully!";
            uploadProgress.value = 100;
          } catch (finalError) {
            console.error("Error saving base64 image:", finalError);
            errorMessage.value = "Failed to save image: " + finalError.message;
          } finally {
            isUploading.value = false;
          }
        };
        
        reader.readAsDataURL(file);
        
      } catch (error) {
        console.error("Upload handler error:", error);
        errorMessage.value = "Failed to process image: " + error.message;
        isUploading.value = false;
      }
    };
    
    const removeProfilePicture = async () => {
      if (isUploading.value) return;
      
      try {
        successMessage.value = '';
        errorMessage.value = '';
        
        if (!profileImageUrl.value) {
          errorMessage.value = "No profile picture to remove";
          return;
        }
        
        isUploading.value = true;
        console.log("Removing profile picture");
        
        if (!userId.value) {
          const id = determineUserId();
          if (!id) {
            errorMessage.value = "User ID not found. Please log in again.";
            isUploading.value = false;
            return;
          }
          userId.value = id;
        }
        
        const currentUser = getCurrentUser();
        if (currentUser) {
          try {
            await updateAuthProfile(currentUser, {
              photoURL: null
            });
            console.log("Auth profile photo URL cleared");
          } catch (authError) {
            console.error("Error updating auth profile:", authError);
          }
        }
        
        const db = getFirestore();
        await updateDoc(doc(db, 'users', userId.value), {
          profileImageUrl: '',
          profileImagePath: '',
          updatedAt: new Date()
        });
        
        profileImageUrl.value = '';
        profileImagePath.value = '';
        successMessage.value = "Profile picture removed successfully!";
      } catch (error) {
        console.error("Remove profile picture error:", error);
        errorMessage.value = "Failed to remove profile picture: " + error.message;
      } finally {
        isUploading.value = false;
      }
    };
    
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    const updateProfile = async () => {
      if (isUploading.value) return;
      
      try {
        successMessage.value = '';
        errorMessage.value = '';
        
        if (!userId.value) {
          const id = determineUserId();
          if (!id) {
            errorMessage.value = "User ID not found. Please log in again.";
            return;
          }
          userId.value = id;
        }
        
        const currentUser = getCurrentUser();
        if (!currentUser) {
          errorMessage.value = "You must be logged in to update your profile";
          return;
        }
        
        if (!firstName.value.trim() || !lastName.value.trim()) {
          errorMessage.value = "First and last name are required";
          return;
        }
        
        const db = getFirestore();
        
        const updateData = {
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          socialLinks: socialLinks.value,
          updatedAt: new Date()
        };
        
        console.log("Updating profile with data:", updateData);
        await updateDoc(doc(db, 'users', userId.value), updateData);
        console.log("Basic profile data updated successfully");
        
        if (oldPass.value) {
          try {
            console.log("Re-authenticating user for sensitive operations");
            const userEmail = currentUser.email || email.value;
            if (!userEmail) {
              errorMessage.value = "No email found for authentication. Please contact support.";
              return;
            }
            
            const credential = EmailAuthProvider.credential(userEmail, oldPass.value);
            await reauthenticateWithCredential(currentUser, credential);
            console.log("Re-authentication successful");
            
            if (newPass.value) {
              if (newPass.value.length < 6) {
                errorMessage.value = "Password must be at least 6 characters";
                return;
              }
              console.log("Updating password");
              await updatePassword(currentUser, newPass.value);
              oldPass.value = '';
              newPass.value = '';
              successMessage.value = "Password updated successfully!";
              console.log("Password updated successfully");
            }
            
            if (newEmail.value && newEmail.value !== userEmail) {
              if (!isValidEmail(newEmail.value)) {
                errorMessage.value = "Please enter a valid email address";
                return;
              }
              
              console.log("Updating email address to:", newEmail.value);
              await updateEmail(currentUser, newEmail.value);
              console.log("Auth email updated");
              
              await sendEmailVerification(currentUser);
              console.log("Verification email sent");
              
              await updateDoc(doc(db, 'users', userId.value), {
                email: newEmail.value,
                updatedAt: new Date()
              });
              console.log("Firestore email updated");
              
              email.value = newEmail.value;
              
              successMessage.value = successMessage.value 
                ? successMessage.value + " Email updated successfully! Verification email sent."
                : "Email updated successfully! Verification email sent.";
              
              newEmail.value = '';
            }
          } catch (authError) {
            console.error("Authentication error:", authError);
            errorMessage.value = "Authentication failed: " + authError.message;
            return;
          }
        } else if (newPass.value || newEmail.value) {
          errorMessage.value = "Current password is required to change password or email";
          return;
        }
        
        if (!successMessage.value) {
          successMessage.value = "Profile updated successfully!";
        }
      } catch (error) {
        console.error("Update profile error:", error);
        errorMessage.value = "Failed to update profile: " + error.message;
      }
    };
    
    onMounted(async () => {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        darkMode.value = savedTheme === 'true';
        if (darkMode.value) {
          document.documentElement.classList.add('dark-theme');
        }
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkMode.value = true;
        document.documentElement.classList.add('dark-theme');
      }
      
      console.log("ProfilePage component mounted");
      await fetchUserData();
    });
    
    return {
      firstName,
      lastName,
      oldPass,
      newPass,
      newEmail,
      userId,
      successMessage,
      errorMessage,
      email,
      emailVerified,
      isOnline,
      profileImageUrl,
      isUploading,
      uploadProgress,
      imageUrlInput,
      socialLinks,
      darkMode,
      toggleDarkMode,
      setImageFromUrl,
      handleImageError,
      handleImageUpload,
      removeProfilePicture,
      updateProfile
    };
  }
};
</script>

<style scoped>
/* CSS Variables for Light Mode */
.profile-container {
  --primary-blue: #3498db;
  --primary-dark-blue: #2980b9;
  --primary-light-blue: #e1f0fa;
  --secondary-blue: #2c3e50;
  --accent-blue: #1abc9c;
  --text-color: #2c3e50;
  --text-light: #7f8c8d;
  --bg-color: #f9f9f9;
  --card-bg: #ffffff;
  --border-color: #eaeaea;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  border-radius: 10px;
  box-shadow: var(--shadow-lg);
  transition: background-color 0.3s, color 0.3s;
}

/* Dark Mode Variables */
.profile-container.dark-mode {
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

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Theme Toggle Button */
.theme-toggle-btn {
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
}

.theme-toggle-btn:hover {
  background: var(--primary-blue);
  color: white;
  transform: rotate(15deg);
}

/* Logo Styles */
.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo img {
  height: 100px;
  width: 100px;
  
}

.logo-text {
  font-size: 1.8em;
  color: var(--primary-blue);
  font-weight: bold;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-header h2 {
  color: var(--secondary-blue);
  margin-bottom: 0.5rem;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  background-color: var(--card-bg);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
}

.status-label {
  font-weight: 500;
  margin-right: 0.5rem;
  color: var(--text-light);
}

.status-value {
  font-weight: 600;
}

.status-value.online {
  color: #4CAF50;
}

.profile-form {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

/* Profile Picture Section */
.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-picture-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 3px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.profile-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.profile-picture-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.image-url-form {
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
}

.image-url-input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 4px 0 0 4px;
  font-size: 0.9rem;
  background-color: var(--card-bg);
  color: var(--text-color);
}

.url-button {
  padding: 0.6rem 1rem;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.url-button:hover:not(:disabled) {
  background-color: var(--primary-dark-blue);
}

.url-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

.or-divider {
  margin: 0.5rem 0;
  color: var(--text-light);
  font-size: 0.9rem;
}

.upload-button {
  display: inline-block;
  padding: 0.6rem 1rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
}

.upload-button:hover {
  background-color: #27ae60;
}

.file-input {
  display: none;
}

.remove-button {
  padding: 0.6rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-button:hover:not(:disabled) {
  background-color: #c0392b;
}

.remove-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--secondary-blue);
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  background-color: var(--card-bg);
  color: var(--text-color);
}

.form-group input:focus {
  border-color: var(--primary-blue);
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.email-help {
  margin: 0.3rem 0;
  font-size: 0.85rem;
  color: var(--text-light);
}

/* Social Media Section */
.social-media-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--primary-light-blue);
  border-radius: 8px;
}

.social-media-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--secondary-blue);
}

.social-input-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.social-input {
  display: flex;
  align-items: center;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem;
}

.social-input i {
  width: 30px;
  text-align: center;
  color: var(--text-light);
  font-size: 1.2rem;
}

.social-input input {
  flex: 1;
  border: none;
  padding: 0.5rem;
  font-size: 0.9rem;
  background-color: transparent;
  color: var(--text-color);
}

.social-input input:focus {
  outline: none;
  box-shadow: none;
}

/* Form Actions */
.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.save-button {
  padding: 0.8rem 2rem;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover:not(:disabled) {
  background-color: var(--primary-dark-blue);
}

.save-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
}

/* Messages */
.success-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #dff0d8;
  color: #3c763d;
  border-radius: 4px;
  border-left: 4px solid #3c763d;
}

.error-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f2dede;
  color: #a94442;
  border-radius: 4px;
  border-left: 4px solid #a94442;
}

/* Navigation Links */
.navigation-links {
  margin-top: 2rem;
  text-align: center;
}

.back-link {
  display: inline-block;
  padding: 0.6rem 1rem;
  color: var(--primary-blue);
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--primary-dark-blue);
}

.back-icon {
  margin-right: 0.5rem;
}

/* Font Awesome Icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .profile-form {
    padding: 1rem;
  }
  
  .social-input-group {
    grid-template-columns: 1fr;
  }
  
  .logo-text {
    font-size: 1.5em;
  }
  
  .logo img {
    height: 50px;
    width: 50px;
  }
}
</style>