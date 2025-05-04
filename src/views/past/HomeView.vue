<template>
    <div class="home">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Elevate Your Developer Journey</h1>
          <p class="hero-subtitle">Track, showcase, and grow your technical skills with DevGate</p>
          <div class="hero-actions">
            <button @click="scrollToFeatures" class="btn btn-outline">Learn More</button>
            <button @click="showAuthModal('signup')" class="btn btn-primary">Get Started</button>
          </div>
        </div>
        <div class="hero-image">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800" alt="DevGate Dashboard Preview">
        </div>
      </section>
  
      <!-- Features Section -->
      <section ref="features" class="features">
        <h2 class="section-title">Why Choose DevGate?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Skill Tracking</h3>
            <p>Visualize your progress with detailed skill analytics and level tracking.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3>Project Showcase</h3>
            <p>Display your best work with beautiful project cards and tech stack visualization.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3>Progress Timeline</h3>
            <p>See your developer journey unfold with an interactive timeline of achievements.</p>
          </div>
        </div>
      </section>
  
      <!-- Testimonials -->
      <section class="testimonials">
        <h2 class="section-title">What Developers Say</h2>
        <div class="testimonials-slider">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"DevGate helped me organize my learning path and land my first developer job!"</p>
            </div>
            <div class="testimonial-author">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200" alt="Sarah K.">
              <div>
                <h4>Sarah K.</h4>
                <p>Frontend Developer</p>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"The skill visualization helped me identify gaps in my knowledge and focus my studies."</p>
            </div>
            <div class="testimonial-author">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200" alt="Miguel R.">
              <div>
                <h4>Miguel R.</h4>
                <p>Fullstack Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="cta">
        <h2>Ready to Supercharge Your Developer Journey?</h2>
        <button @click="showAuthModal('signup')" class="btn btn-primary btn-large">Join DevGate Now</button>
      </section>
  
      <!-- Auth Modal -->
      <transition name="fade">
        <div v-if="showModal" class="auth-modal">
          <div class="auth-modal-content">
            <button @click="closeModal" class="close-modal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
            <AuthForm 
              :isLoginMode="authMode === 'login'" 
              @submit="handleAuthSubmit"
              @toggleMode="toggleAuthMode"
            />
            <div class="auth-divider">OR</div>
            <AuthProviders @google="loginWithGoogle" />
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import AuthForm from '@/components/auth/AuthForm.vue'
  import AuthProviders from '@/components/auth/AuthProviders.vue'
  import { mapActions } from 'vuex'
  
  export default {
    name: 'HomeView',
    components: {
      AuthForm,
      AuthProviders
    },
    data() {
      return {
        showModal: false,
        authMode: 'login' // 'login' or 'signup'
      }
    },
    methods: {
      ...mapActions(['loginWithEmail', 'signupWithEmail', 'loginWithGoogle']),
      scrollToFeatures() {
        this.$refs.features.scrollIntoView({ behavior: 'smooth' })
      },
      showAuthModal(mode) {
        this.authMode = mode
        this.showModal = true
        document.body.style.overflow = 'hidden'
      },
      closeModal() {
        this.showModal = false
        document.body.style.overflow = 'auto'
      },
      toggleAuthMode() {
        this.authMode = this.authMode === 'login' ? 'signup' : 'login'
      },
      async handleAuthSubmit(authData) {
        try {
          if (this.authMode === 'login') {
            await this.loginWithEmail(authData)
          } else {
            await this.signupWithEmail(authData)
          }
          this.closeModal()
          this.$router.push('/dashboard')
        } catch (error) {
          console.error('Authentication error:', error)
        }
      },
      async loginWithGoogle() {
        try {
          await this.$store.dispatch('loginWithGoogle')
          this.closeModal()
          this.$router.push('/dashboard')
        } catch (error) {
          console.error('Google login error:', error)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .home {
    overflow-x: hidden;
  }
  
  /* Hero Section */
  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 80px 5% 120px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: radial-gradient(circle, rgba(56, 182, 255, 0.15) 0%, transparent 70%);
    z-index: 0;
  }
  
  .hero-content {
    max-width: 600px;
    z-index: 1;
  }
  
  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #38b6ff, #6c63ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 2.5rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .hero-actions {
    display: flex;
    gap: 1rem;
  }
  
  .hero-image {
    width: 50%;
    z-index: 1;
    animation: float 6s ease-in-out infinite;
  }
  
  .hero-image img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  
  /* Features Section */
  .features {
    padding: 100px 5%;
    background-color: #f8fafc;
  }
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1e293b;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .feature-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .feature-icon svg {
    width: 30px;
    height: 30px;
    color: white;
  }
  
  .feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1e293b;
  }
  
  .feature-card p {
    color: #64748b;
    line-height: 1.6;
  }
  
  /* Testimonials */
  .testimonials {
    padding: 100px 5%;
    background-color: white;
  }
  
  .testimonials-slider {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    padding: 1rem 0;
    scroll-snap-type: x mandatory;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .testimonial-card {
    min-width: 400px;
    background: #f8fafc;
    padding: 2rem;
    border-radius: 12px;
    scroll-snap-align: start;
  }
  
  .testimonial-content {
    font-size: 1.1rem;
    font-style: italic;
    color: #334155;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .testimonial-author img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .testimonial-author h4 {
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .testimonial-author p {
    color: #64748b;
    font-size: 0.9rem;
  }
  
  /* CTA Section */
  .cta {
    padding: 100px 5%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    text-align: center;
  }
  
  .cta h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  
  /* Auth Modal */
  .auth-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .auth-modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 100%;
    max-width: 450px;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
  }
  
  .close-modal svg {
    width: 24px;
    height: 24px;
  }
  
  .close-modal:hover {
    color: #1e293b;
  }
  
  .auth-divider {
    margin: 1.5rem 0;
    text-align: center;
    color: #94a3b8;
    position: relative;
  }
  
  .auth-divider::before,
  .auth-divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background: #e2e8f0;
  }
  
  .auth-divider::before {
    left: 0;
  }
  
  .auth-divider::after {
    right: 0;
  }
  
  /* Buttons */
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-size: 1rem;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    color: white;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(56, 182, 255, 0.3), 0 4px 6px -2px rgba(108, 99, 255, 0.2);
  }
  
  .btn-outline {
    background: transparent;
    color: white;
    border: 2px solid white;
  }
  
  .btn-outline:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
  
  /* Transitions */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .hero {
      flex-direction: column;
      padding: 60px 5%;
      text-align: center;
    }
  
    .hero-content {
      margin-bottom: 3rem;
    }
  
    .hero-image {
      width: 100%;
    }
  
    .hero-title {
      font-size: 2.5rem;
    }
  
    .hero-subtitle {
      font-size: 1.2rem;
    }
  
    .hero-actions {
      justify-content: center;
    }
  
    .testimonial-card {
      min-width: 300px;
    }
  }
  </style>