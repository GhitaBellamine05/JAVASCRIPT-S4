// src/store/index.js
import { createStore } from 'vuex';
import { db, auth, storage } from '@/services/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default createStore({
  state: {
    user: null,
    userProfile: null,
    userStats: null,
    projects: [],
    skills: [],
    objectives: [],
    activities: [],
    communityPosts: [],
    suggestedConnections: [],
    upcomingEvents: [],
    recommendedResources: [],
    loading: false,
    error: null
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    userId(state) {
      return state.user ? state.user.uid : null;
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USER_PROFILE(state, profile) {
      state.userProfile = profile;
    },
    SET_USER_STATS(state, stats) {
      state.userStats = stats;
    },
    SET_PROJECTS(state, projects) {
      state.projects = projects;
    },
    SET_SKILLS(state, skills) {
      state.skills = skills;
    },
    SET_OBJECTIVES(state, objectives) {
      state.objectives = objectives;
    },
    SET_ACTIVITIES(state, activities) {
      state.activities = activities;
    },
    SET_COMMUNITY_POSTS(state, posts) {
      state.communityPosts = posts;
    },
    SET_SUGGESTED_CONNECTIONS(state, connections) {
      state.suggestedConnections = connections;
    },
    SET_UPCOMING_EVENTS(state, events) {
      state.upcomingEvents = events;
    },
    SET_RECOMMENDED_RESOURCES(state, resources) {
      state.recommendedResources = resources;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    ADD_POST(state, post) {
      state.communityPosts.unshift(post);
    },
    UPDATE_POST_LIKES(state, { postId, likes }) {
      const post = state.communityPosts.find(p => p.id === postId);
      if (post) {
        post.likes = likes;
      }
    },
    ADD_COMMENT(state, { postId, comment }) {
      const post = state.communityPosts.find(p => p.id === postId);
      if (post) {
        if (!post.comments) {
          post.comments = [];
        }
        post.comments.push(comment);
      }
    }
  },
  actions: {
    // Authentication Actions
    async register({ commit }, { email, password, name }) {
      try {
        commit('SET_LOADING', true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Create user profile in Firestore
        const profileRef = doc(db, 'userProfiles', userCredential.user.uid);
        await setDoc(profileRef, {
          name,
          email,
          title: 'Software Developer', // Default title
          photoURL: null,
          createdAt: new Date()
        });
        
        // Create user stats in Firestore
        const statsRef = doc(db, 'userStats', userCredential.user.uid);
        await setDoc(statsRef, {
          projects: 0,
          skills: 0,
          objectives: 0,
          followers: 0
        });
        
        commit('SET_USER', userCredential.user);
        commit('SET_LOADING', false);
        return userCredential.user;
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    async login({ commit }, { email, password }) {
      try {
        commit('SET_LOADING', true);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        commit('SET_USER', userCredential.user);
        commit('SET_LOADING', false);
        return userCredential.user;
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    async logout({ commit }) {
      try {
        await signOut(auth);
        commit('SET_USER', null);
        commit('SET_USER_PROFILE', null);
        commit('SET_USER_STATS', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // User Data Actions
    async fetchUserProfile({ commit, state }) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        const profileRef = doc(db, 'userProfiles', state.user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          commit('SET_USER_PROFILE', profileData);
        }
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
      }
    },
    
    async fetchUserStats({ commit, state }) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        const statsRef = doc(db, 'userStats', state.user.uid);
        const statsSnap = await getDoc(statsRef);
        
        if (statsSnap.exists()) {
          const statsData = statsSnap.data();
          commit('SET_USER_STATS', statsData);
        }
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
      }
    },
    
    async updateUserProfile({ commit, state }, profileData) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        const profileRef = doc(db, 'userProfiles', state.user.uid);
        await updateDoc(profileRef, profileData);
        
        // If profile photo is updated, also update auth profile
        if (profileData.photoURL) {
          await updateProfile(state.user, { photoURL: profileData.photoURL });
        }
        
        commit('SET_USER_PROFILE', { ...state.userProfile, ...profileData });
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
      }
    },
    
    // Project Actions
    async fetchProjects({ commit, state }) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        const projectsQuery = query(
          collection(db, 'projects'),
          where('userId', '==', state.user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const projectsSnap = await getDocs(projectsQuery);
        const projects = [];
        
        projectsSnap.forEach(doc => {
          projects.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        commit('SET_PROJECTS', projects);
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
      }
    },
    
    async addProject({ commit, state, dispatch }, projectData) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        
        // Add project to Firestore
        const projectRef = await addDoc(collection(db, 'projects'), {
          ...projectData,
          userId: state.user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Update user stats
        const statsRef = doc(db, 'userStats', state.user.uid);
        const statsSnap = await getDoc(statsRef);
        
        if (statsSnap.exists()) {
          const statsData = statsSnap.data();
          await updateDoc(statsRef, {
            projects: statsData.projects + 1
          });
          
          // Update local state
          commit('SET_USER_STATS', {
            ...state.userStats,
            projects: state.userStats.projects + 1
          });
        }
        
        // Refetch projects
        await dispatch('fetchProjects');
        commit('SET_LOADING', false);
        
        return projectRef.id;
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Skills Actions
    async fetchSkills({ commit, state }) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        const skillsQuery = query(
          collection(db, 'skills'),
          where('userId', '==', state.user.uid),
          orderBy('level', 'desc')
        );
        
        const skillsSnap = await getDocs(skillsQuery);
        const skills = [];
        
        skillsSnap.forEach(doc => {
          skills.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        commit('SET_SKILLS', skills);
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
      }
    },
    
    async addSkill({ commit, state, dispatch }, skillData) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        
        // Add skill to Firestore
        const skillRef = await addDoc(collection(db, 'skills'), {
          ...skillData,
          userId: state.user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Update user stats
        const statsRef = doc(db, 'userStats', state.user.uid);
        const statsSnap = await getDoc(statsRef);
        
        if (statsSnap.exists()) {
          const statsData = statsSnap.data();
          await updateDoc(statsRef, {
            skills: statsData.skills + 1
          });
          
          // Update local state
          commit('SET_USER_STATS', {
            ...state.userStats,
            skills: state.userStats.skills + 1
          });
        }
        
        // Refetch skills
        await dispatch('fetchSkills');
        commit('SET_LOADING', false);
        
        return skillRef.id;
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Objectives Actions
    async fetchObjectives({ commit, state }) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        const objectivesQuery = query(
          collection(db, 'objectives'),
          where('userId', '==', state.user.uid),
          orderBy('dueDate', 'asc')
        );
        
        const objectivesSnap = await getDocs(objectivesQuery);
        const objectives = [];
        
        objectivesSnap.forEach(doc => {
          objectives.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        commit('SET_OBJECTIVES', objectives);
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
      }
    },
    
    async addObjective({ commit, state, dispatch }, objectiveData) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        
        // Add objective to Firestore
        const objectiveRef = await addDoc(collection(db, 'objectives'), {
          ...objectiveData,
          userId: state.user.uid,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Update user stats
        const statsRef = doc(db, 'userStats', state.user.uid);
        const statsSnap = await getDoc(statsRef);
        
        if (statsSnap.exists()) {
          const statsData = statsSnap.data();
          await updateDoc(statsRef, {
            objectives: statsData.objectives + 1
          });
          
          // Update local state
          commit('SET_USER_STATS', {
            ...state.userStats,
            objectives: state.userStats.objectives + 1
          });
        }
        
        // Refetch objectives
        await dispatch('fetchObjectives');
        commit('SET_LOADING', false);
        
        return objectiveRef.id;
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Activities Actions
    async fetchActivities({ commit, state }) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        const activitiesQuery = query(
          collection(db, 'activities'),
          where('userId', '==', state.user.uid),
          orderBy('timestamp', 'desc')
        );
        
        const activitiesSnap = await getDocs(activitiesQuery);
        const activities = [];
        
        activitiesSnap.forEach(doc => {
          activities.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        commit('SET_ACTIVITIES', activities);
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
      }
    },
    
    async addActivity({ commit, state, dispatch }, activityData) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        
        // Add activity to Firestore
        const activityRef = await addDoc(collection(db, 'activities'), {
          ...activityData,
          userId: state.user.uid,
          timestamp: new Date()
        });
        
        // Refetch activities
        await dispatch('fetchActivities');
        commit('SET_LOADING', false);
        
        return activityRef.id;
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Community Posts Actions
    async fetchCommunityPosts({ commit }) {
      try {
        commit('SET_LOADING', true);
        const postsQuery = query(
          collection(db, 'posts'),
          orderBy('timestamp', 'desc'),
          limit(20)
        );
        
        const postsSnap = await getDocs(postsQuery);
        const posts = [];
        
        for (const postDoc of postsSnap.docs) {
          const postData = postDoc.data();
          const post = {
            id: postDoc.id,
            ...postData,
            showComments: false,
            comments: []
          };
          
          // Get author info
          if (postData.authorId) {
            const authorRef = doc(db, 'userProfiles', postData.authorId);
            const authorSnap = await getDoc(authorRef);
            if (authorSnap.exists()) {
              post.author = authorSnap.data();
            }
          }
          
          // Get project info if post has projectId
          if (postData.projectId) {
            const projectRef = doc(db, 'projects', postData.projectId);
            const projectSnap = await getDoc(projectRef);
            if (projectSnap.exists()) {
              post.project = projectSnap.data();
            }
          }
          
          // Get comments
          const commentsQuery = query(
            collection(db, 'comments'),
            where('postId', '==', postDoc.id),
            orderBy('timestamp', 'asc')
          );
          
          const commentsSnap = await getDocs(commentsQuery);
          const comments = [];
          
          for (const commentDoc of commentsSnap.docs) {
            const commentData = commentDoc.data();
            const comment = {
              id: commentDoc.id,
              ...commentData
            };
            
            // Get comment author info
            if (commentData.authorId) {
              const authorRef = doc(db, 'userProfiles', commentData.authorId);
              const authorSnap = await getDoc(authorRef);
              if (authorSnap.exists()) {
                comment.author = authorSnap.data();
              }
            }
            
            comments.push(comment);
          }
          
          post.comments = comments;
          posts.push(post);
        }
        
        commit('SET_COMMUNITY_POSTS', posts);
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
      }
    },
    
    async createPost({ commit, state }, postData) {
      if (!state.user) return;
      
      try {
        commit('SET_LOADING', true);
        
        let projectId = null;
        
        // If post includes a project, create it first
        if (postData.newPostType === 'project' && postData.newProject.title) {
          const projectRef = await addDoc(collection(db, 'projects'), {
            title: postData.newProject.title,
            description: postData.newProject.description,
            type: postData.newProject.type,
            technologies: postData.newProject.technologiesInput.split(',').map(tech => tech.trim()),
            userId: state.user.uid,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          projectId = projectRef.id;
          
          // Update user stats
          const statsRef = doc(db, 'userStats', state.user.uid);
          const statsSnap = await getDoc(statsRef);
          
          if (statsSnap.exists()) {
            const statsData = statsSnap.data();
            await updateDoc(statsRef, {
              projects: statsData.projects + 1
            });
            
            // Update local state
            if (state.userStats) {
              commit('SET_USER_STATS', {
                ...state.userStats,
                projects: state.userStats.projects + 1
              });
            }
          }
        }
        
        // Create post in Firestore
        const post = {
          content: postData.newPostContent,
          authorId: state.user.uid,
          timestamp: new Date(),
          likes: 0,
          type: postData.newPostType
        };
        
        if (projectId) {
          post.projectId = projectId;
        }
        
        if (postData.newPostType === 'activity' && postData.newActivity.type) {
          post.activityType = postData.newActivity.type;
          
          // Also add to activities collection
          await addDoc(collection(db, 'activities'), {
            userId: state.user.uid,
            type: postData.newActivity.type,
            content: postData.newPostContent,
            timestamp: new Date()
          });
        }
        
        // Handle image upload if there's an image
        if (postData.imageFile) {
          const storageRef = ref(storage, `post-images/${state.user.uid}/${Date.now()}`);
          await uploadBytes(storageRef, postData.imageFile);
          const imageUrl = await getDownloadURL(storageRef);
          post.imageUrl = imageUrl;
        }
        
        const postRef = await addDoc(collection(db, 'posts'), post);
        const newPost = {
          id: postRef.id,
          ...post,
          author: state.userProfile,
          comments: [],
          showComments: false
        };
        
        if (projectId && postData.newProject) {
          newPost.project = {
            title: postData.newProject.title,
            description: postData.newProject.description,
            type: postData.newProject.type,
            technologies: postData.newProject.technologiesInput.split(',').map(tech => tech.trim())
          };
        }
        
        commit('ADD_POST', newPost);
        commit('SET_LOADING', false);
        
        return postRef.id;
      } catch (error) {
        commit('SET_LOADING', false);
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    async likePost({ commit, state }, postId) {
      if (!state.user) return;
      
      try {
        // Get current post
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const postData = postSnap.data();
          const currentLikes = postData.likes || 0;
          
          // Check if user already liked this post
          const likeRef = doc(db, 'likes', `${state.user.uid}_${postId}`);
          const likeSnap = await getDoc(likeRef);
          
          if (likeSnap.exists()) {
            // User already liked this post, unlike it
            await deleteDoc(likeRef);
            await updateDoc(postRef, {
              likes: currentLikes - 1
            });
            
            commit('UPDATE_POST_LIKES', { postId, likes: currentLikes - 1 });
          } else {
            // User has not liked this post, like it
            await setDoc(likeRef, {
              userId: state.user.uid,
              postId,
              timestamp: new Date()
            });
            
            await updateDoc(postRef, {
              likes: currentLikes + 1
            });
            
            commit('UPDATE_POST_LIKES', { postId, likes: currentLikes + 1 });
          }
        }
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    
    async addComment({ commit, state }, { postId, text }) {
      if (!state.user || !text.trim()) return;
      
      try {
        const commentData = {
          postId,
          authorId: state.user.uid,
          text,
          timestamp: new Date()
        };
        
        const commentRef = await addDoc(collection(db, 'comments'), commentData);
        
        const comment = {
          id: commentRef.id,
          ...commentData,
          author: state.userProfile
        };
        
        commit('ADD_COMMENT', { postId, comment });
        
        return commentRef.id;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Suggested Connections Actions
    async fetchSuggestedConnections({ commit, state }) {
      if (!state.user) return;
      
      try {
        // Get some random users who are not the current user
        // In a real app, you would have a more sophisticated algorithm
        const usersQuery = query(
          collection(db, 'userProfiles'),
          limit(5)
        );
        
        const usersSnap = await getDocs(usersQuery);
        const connections = [];
        
        usersSnap.forEach(doc => {
          if (doc.id !== state.user.uid) {
            connections.push({
              id: doc.id,
              ...doc.data()
            });
          }
        });
        
        commit('SET_SUGGESTED_CONNECTIONS', connections);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    
    // Upcoming Events Actions
    async fetchUpcomingEvents({ commit }) {
      try {
        const now = new Date();
        const eventsQuery = query(
          collection(db, 'events'),
          where('date', '>=', now),
          orderBy('date', 'asc'),
          limit(3)
        );
        
        const eventsSnap = await getDocs(eventsQuery);
        const events = [];
        
        eventsSnap.forEach(doc => {
          events.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        commit('SET_UPCOMING_EVENTS', events);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    
    // Recommended Resources Actions
    async fetchRecommendedResources({ commit, state }) {
      if (!state.user) return;
      
      try {
        // In a real app, you might base recommendations on user skills and interests
        const resourcesQuery = query(
          collection(db, 'resources'),
          limit(3)
        );
        
        const resourcesSnap = await getDocs(resourcesQuery);
        const resources = [];
        
        resourcesSnap.forEach(doc => {
          resources.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        commit('SET_RECOMMENDED_RESOURCES', resources);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },
    
    // Initialize app data
    async initializeAppData({ dispatch }) {
      await Promise.all([
        dispatch('fetchUserProfile'),
        dispatch('fetchUserStats'),
        dispatch('fetchProjects'),
        dispatch('fetchSkills'),
        dispatch('fetchObjectives'),
        dispatch('fetchActivities'),
        dispatch('fetchCommunityPosts'),
        dispatch('fetchSuggestedConnections'),
        dispatch('fetchUpcomingEvents'),
        dispatch('fetchRecommendedResources')
      ]);
    }
  }
});