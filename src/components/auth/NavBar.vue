<template>
    <div class="devgate-nav">
      <h2>DevGate</h2>
      <div class="user-section">
        <img :src="userPhoto" alt="Profile" class="profile-pic" v-if="userPhoto">
        <p>Welcome, {{ userName || 'Developer' }}</p>
      </div>
      
      <nav>
        <router-link :to="`/profile/${userId}`">My Profile</router-link>
        <router-link :to="`/profile/${userId}/activities`">Activities</router-link>
        <router-link :to="`/profile/${userId}/projects`">Projects</router-link>
        <router-link :to="`/profile/${userId}/timeline`">Timeline</router-link>
        <router-link :to="`/profile/${userId}/skills`">Skills</router-link>
        <router-link to="/explore">Explore Projects</router-link>
        <button @click="logout" class="logout-btn">Log Out</button>
      </nav>
    </div>
  </template>
  
  <script>
  import { getAuth } from "firebase/auth";
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  export default {
    name: 'Navbar',
    setup() {
      const userId = ref(null);
      const userName = ref('');
      const userPhoto = ref('');
      const router = useRouter();
  
      onMounted(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          userId.value = user.uid;
          userName.value = user.displayName;
          userPhoto.value = user.photoURL;
        }
      });
  
      const logout = async () => {
        try {
          await getAuth().signOut();
          router.push('/login');
        } catch (error) {
          console.error("Logout error:", error);
        }
      };
  
      return {
        userId,
        userName,
        userPhoto,
        logout
      };
    }
  }
  </script>
  
  <style scoped>
  .devgate-nav {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    min-height: 100vh;
    width: 250px;
    position: fixed;
  }
  
  .profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .user-section {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background 0.3s;
  }
  
  nav a:hover {
    background: #34495e;
  }
  
  nav a.router-link-exact-active {
    background: #42b983;
    font-weight: bold;
  }
  
  .logout-btn {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .logout-btn:hover {
    background: #c0392b;
  }
  </style>