<template>
    <div class="home">
      <!-- Animated Background -->
      <div class="animated-background">
        <div class="particle" v-for="(particle, index) in particles" :key="index" :style="particle.style"></div>
      </div>
  
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text" ref="typingText"></span>
          </h1>
          <p class="hero-subtitle">
            The ultimate platform to <span class="rotating-words">
              <span v-for="(word, index) in rotatingWords" 
                    :key="index" 
                    :class="{ active: currentWordIndex === index }">
                {{ word }}
              </span>
            </span> your developer journey
          </p>
          
          <div class="hero-cta">
            <button @click="showAuthModal('signup')" class="cta-button primary" @mouseenter="animateButton">
              <span>Start For Free</span>
              <svg viewBox="0 0 24 24">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
              </svg>
            </button>
            <button @click="scrollToFeatures" class="cta-button secondary">
              <svg viewBox="0 0 24 24">
                <path d="M19 14L12 21L5 14M19 10L12 3L5 10" />
              </svg>
              See How It Works
            </button>
          </div>
  
          <div class="hero-stats">
            <div class="stat-item" v-for="stat in animatedStats" :key="stat.id">
              <div class="stat-number" ref="counter">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
  
        <div class="hero-image">
          <div class="dashboard-container">
            <img :src="currentDashboardImage" 
                 alt="DevGate Dashboard" 
                 class="dashboard-image"
                 @mouseover="startImageRotation"
                 @mouseleave="stopImageRotation">
            
            <div class="floating-card skill-card" :style="floatingCardStyle(0)">
              <div class="skill-progress">
                <CircularProgress :progress="85" />
              </div>
              <div class="skill-info">
                <h4>React.js</h4>
                <p>Advanced Level</p>
              </div>
            </div>
            
            <div class="floating-card project-card" :style="floatingCardStyle(1)">
              <img :src="currentProjectImage" alt="Project thumbnail" class="project-thumbnail">
              <div class="project-info">
                <h4>{{ currentProjectTitle }}</h4>
                <div class="tech-stack">
                  <span class="tech-badge" v-for="(tech, index) in currentProjectTech" :key="index">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Trusted By Section -->
      <section class="trusted-by">
        <p class="trusted-by-label">Trusted by developers at</p>
        <div class="companies-marquee">
          <div class="marquee-content">
            <img v-for="(company, index) in companies" 
                 :key="index" 
                 :src="company.logo" 
                 :alt="company.name"
                 class="company-logo">
            <img v-for="(company, index) in companies" 
                 :key="index + companies.length" 
                 :src="company.logo" 
                 :alt="company.name"
                 class="company-logo">
          </div>
        </div>
      </section>
  
      <!-- Features Section -->
      <section ref="features" class="features">
        <h2 class="section-title">
          <span class="highlight">Why</span> DevGate?
        </h2>
        <p class="section-subtitle">Everything you need to showcase your developer journey</p>
        
        <div class="features-grid">
          <div class="feature-card" 
               v-for="(feature, index) in features" 
               :key="index"
               @mouseenter="hoverFeature(index)"
               @mouseleave="unhoverFeature(index)">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24">
                <path :d="feature.icon" />
              </svg>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <div class="feature-preview">
              <img :src="feature.image" :alt="feature.title">
            </div>
            <div class="feature-badge">New</div>
          </div>
        </div>
      </section>
  
      <!-- Testimonials Carousel -->
      <section class="testimonials">
        <h2 class="section-title">
          What <span class="highlight">Developers</span> Say
        </h2>
        
        <div class="testimonials-carousel">
          <button class="carousel-button prev" @click="prevTestimonial">
            <svg viewBox="0 0 24 24"><path d="M15 18L9 12L15 6" /></svg>
          </button>
          
          <div class="carousel-track" :style="carouselTrackStyle">
            <div class="testimonial-card" 
                 v-for="(testimonial, index) in testimonials" 
                 :key="index"
                 :class="{ active: currentTestimonial === index }">
              <div class="testimonial-content">
                <div class="quote-icon">
                  <svg viewBox="0 0 24 24"><path d="M14 6H9V19H14V6ZM21 6H16V19H21V6Z" /></svg>
                </div>
                <p>{{ testimonial.text }}</p>
              </div>
              <div class="testimonial-author">
                <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar">
                <div class="author-info">
                  <h4>{{ testimonial.name }}</h4>
                  <p>{{ testimonial.position }}</p>
                  <div class="author-rating">
                    <span v-for="star in 5" :key="star">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button class="carousel-button next" @click="nextTestimonial">
            <svg viewBox="0 0 24 24"><path d="M9 6L15 12L9 18" /></svg>
          </button>
        </div>
        
        <div class="carousel-indicators">
          <button v-for="(testimonial, index) in testimonials" 
                  :key="index"
                  :class="{ active: currentTestimonial === index }"
                  @click="goToTestimonial(index)"></button>
        </div>
      </section>
  
      <!-- Interactive Demo Section -->
      <section class="interactive-demo">
        <div class="demo-content">
          <h2>Try Our <span class="highlight">Interactive Demo</span></h2>
          <p>Experience DevGate's features without signing up</p>
          
          <div class="demo-selector">
            <button v-for="(demo, index) in demos" 
                    :key="index"
                    :class="{ active: currentDemo === index }"
                    @click="currentDemo = index">
              {{ demo.label }}
            </button>
          </div>
          
          <div class="demo-viewer">
            <component :is="demos[currentDemo].component" />
          </div>
          
          <button @click="showAuthModal('signup')" class="cta-button primary large">
            Get Full Access
          </button>
        </div>
      </section>
  
      <!-- Auth Modal -->
      <transition name="modal">
        <div v-if="showModal" class="auth-modal">
          <div class="auth-modal-content">
            <button @click="closeModal" class="close-modal">
              <svg viewBox="0 0 24 24"><path d="M19 5L5 19M5 5L19 19" /></svg>
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
  import { gsap } from 'gsap'
  import { TextPlugin } from 'gsap/TextPlugin'
  import AuthForm from '@/components/auth/AuthForm.vue'
  import AuthProviders from '@/components/auth/AuthProviders.vue'
  import CircularProgress from '@/components/ui/CircularProgress.vue'
  import SkillDemo from '@/components/demos/SkillDemo.vue'
  import ProjectDemo from '@/components/demos/ProjectDemo.vue'
  import TimelineDemo from '@/components/demos/TimelineDemo.vue'
  
  gsap.registerPlugin(TextPlugin)
  
  export default {
    name: 'HomeView',
    components: {
      AuthForm,
      AuthProviders,
      CircularProgress,
      SkillDemo,
      ProjectDemo,
      TimelineDemo
    },
    data() {
      return {
        // Dynamic typing text
        typingText: "Elevate Your Developer Journey",
        typingIndex: 0,
        isTyping: true,
        
        // Rotating words
        rotatingWords: ['track', 'showcase', 'enhance', 'boost', 'document'],
        currentWordIndex: 0,
        
        // Animated stats
        animatedStats: [
          { id: 1, value: 0, target: 12500, label: 'Developers' },
          { id: 2, value: 0, target: 53000, label: 'Projects' },
          { id: 3, value: 0, target: 120, label: 'Tech Skills' }
        ],
        
        // Floating particles
        particles: Array.from({ length: 20 }, (_, i) => ({
          size: Math.random() * 5 + 3,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 10
        })),
        
        // Dashboard images rotation
        dashboardImages: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
        ],
        currentDashboardIndex: 0,
        imageRotationInterval: null,
        
        // Project showcase
        projects: [
          {
            title: 'E-commerce Platform',
            image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
            tech: ['React', 'Node.js', 'MongoDB']
          },
          {
            title: 'Task Management App',
            image: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
            tech: ['Vue.js', 'Firebase', 'Tailwind']
          },
          {
            title: 'Social Network',
            image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
            tech: ['React', 'GraphQL', 'PostgreSQL']
          }
        ],
        currentProjectIndex: 0,
        projectRotationInterval: null,
        
        // Companies marquee
        companies: [
          { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1280px-Google_2015_logo.svg.png' },
          { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png' },
          { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1280px-Amazon_logo.svg.png' },
          { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1280px-Apple_logo_black.svg.png' },
          { name: 'Facebook', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1280px-Facebook_f_logo_%282019%29.svg.png' },
          { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Netflix_icon.svg/1280px-Netflix_icon.svg.png' }
        ],
        
        // Features
        features: [
          {
            title: 'Skill Analytics',
            description: 'Visualize your progress with beautiful charts and track your growth across all technologies.',
            icon: 'M9 17.25V21L12 19.5L15 21V17.25M19 3H5C3.895 3 3 3.895 3 5V17C3 18.105 3.895 19 5 19H19C20.105 19 21 18.105 21 17V5C21 3.895 20.105 3 19 3ZM9 10.5H5V15H9V10.5ZM19 15H15V10.5H19V15ZM19 9H5V6H19V9Z',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
          },
          {
            title: 'Project Showcase',
            description: 'Display your best work with beautiful project cards, tech stack visualization, and live demos.',
            icon: 'M3 16L10 21L17 16M3 10L10 15L17 10M3 4L10 9L17 4',
            image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
          },
          {
            title: 'Community Support',
            description: 'Connect with other developers, get feedback, and find collaborators for your next project.',
            icon: 'M17 20C17 18.343 14.314 17 11 17C7.686 17 5 18.343 5 20M21 16C21 14.343 18.99 13 16.5 13C14.01 13 12 14.343 12 16M3 16C3 14.343 5.01 13 7.5 13C9.99 13 12 14.343 12 16M11 14C8.239 14 6 11.761 6 9C6 6.239 8.239 4 11 4C13.761 4 16 6.239 16 9C16 11.761 13.761 14 11 14ZM16.5 11C15.12 11 14 9.88 14 8.5C14 7.12 15.12 6 16.5 6C17.88 6 19 7.12 19 8.5C19 9.88 17.88 11 16.5 11ZM7.5 11C6.12 11 5 9.88 5 8.5C5 7.12 6.12 6 7.5 6C8.88 6 10 7.12 10 8.5C10 9.88 8.88 11 7.5 11Z',
            image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
          }
        ],
        
        // Testimonials carousel
        testimonials: [
          {
            text: "DevGate helped me organize my learning path and land my first developer job! The skill tracking kept me motivated and the project showcase was perfect for my portfolio.",
            name: "Sarah K.",
            position: "Frontend Developer @ TechCorp",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
          },
          {
            text: "As a hiring manager, I love when candidates share their DevGate profiles. The skill visualization helps me quickly understand their strengths and growth areas.",
            name: "Miguel R.",
            position: "Engineering Manager @ DevSolutions",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
          },
          {
            text: "The community aspect of DevGate helped me find collaborators for my open-source projects and get valuable feedback from experienced developers.",
            name: "Alex T.",
            position: "Fullstack Developer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
          }
        ],
        currentTestimonial: 0,
        
        // Interactive demos
        demos: [
          { label: 'Skill Tracking', component: 'SkillDemo' },
          { label: 'Project Showcase', component: 'ProjectDemo' },
          { label: 'Progress Timeline', component: 'TimelineDemo' }
        ],
        currentDemo: 0,
        
        // Auth modal
        showModal: false,
        authMode: 'login'
      }
    },
    computed: {
      currentDashboardImage() {
        return this.dashboardImages[this.currentDashboardIndex]
      },
      currentProjectImage() {
        return this.projects[this.currentProjectIndex].image
      },
      currentProjectTitle() {
        return this.projects[this.currentProjectIndex].title
      },
      currentProjectTech() {
        return this.projects[this.currentProjectIndex].tech
      },
      carouselTrackStyle() {
        return {
          transform: `translateX(-${this.currentTestimonial * 100}%)`
        }
      }
    },
    mounted() {
      this.initAnimations()
      this.startWordRotation()
      this.startStatsAnimation()
      this.startParticleAnimation()
    },
    beforeUnmount() {
      clearInterval(this.wordRotationInterval)
      clearInterval(this.imageRotationInterval)
      clearInterval(this.projectRotationInterval)
    },
    methods: {
      initAnimations() {
        // Typing animation
        gsap.to(this.$refs.typingText, {
          text: this.typingText,
          duration: 2,
          ease: "power1.inOut",
          delay: 0.5
        })
        
        // Floating cards animation
        gsap.to(".floating-card", {
          y: 10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        })
      },
      
      startWordRotation() {
        setInterval(() => {
          this.currentWordIndex = (this.currentWordIndex + 1) % this.rotatingWords.length
        }, 2000)
      },
      
      startStatsAnimation() {
        this.animatedStats.forEach(stat => {
          const duration = 2
          const increment = stat.target / (duration * 60) // 60fps
          
          const timer = setInterval(() => {
            if (stat.value < stat.target) {
              stat.value = Math.min(stat.value + increment, stat.target)
              stat.value = Math.floor(stat.value)
            } else {
              clearInterval(timer)
            }
          }, 1000 / 60)
        })
      },
      
      startParticleAnimation() {
        this.particles.forEach((particle, i) => {
          gsap.to(`.particle:nth-child(${i + 1})`, {
            x: `+=${Math.random() * 100 - 50}`,
            y: `+=${Math.random() * 100 - 50}`,
            duration: particle.duration,
            delay: particle.delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          })
        })
      },
      
      startImageRotation() {
        this.imageRotationInterval = setInterval(() => {
          this.currentDashboardIndex = (this.currentDashboardIndex + 1) % this.dashboardImages.length
        }, 3000)
      },
      
      stopImageRotation() {
        clearInterval(this.imageRotationInterval)
      },
      
      floatingCardStyle(index) {
        const delays = ['0.2s', '0.4s']
        return {
          'animation-delay': delays[index]
        }
      },
      
      hoverFeature(index) {
        gsap.to(`.feature-card:nth-child(${index + 1}) .feature-preview img`, {
          scale: 1.1,
          duration: 0.5
        })
        gsap.to(`.feature-card:nth-child(${index + 1})`, {
          y: -10,
          duration: 0.3
        })
      },
      
      unhoverFeature(index) {
        gsap.to(`.feature-card:nth-child(${index + 1}) .feature-preview img`, {
          scale: 1,
          duration: 0.5
        })
        gsap.to(`.feature-card:nth-child(${index + 1})`, {
          y: 0,
          duration: 0.3
        })
      },
      
      animateButton(e) {
        const button = e.currentTarget
        gsap.to(button, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        })
      },
      
      nextTestimonial() {
        this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length
      },
      
      prevTestimonial() {
        this.currentTestimonial = (this.currentTestimonial - 1 + this.testimonials.length) % this.testimonials.length
      },
      
      goToTestimonial(index) {
        this.currentTestimonial = index
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
      
      handleAuthSubmit(authData) {
        // Implement auth logic
        console.log('Auth data:', authData)
        this.closeModal()
        this.$router.push('/dashboard')
      },
      
      loginWithGoogle() {
        // Implement Google auth
        console.log('Google login initiated')
        this.closeModal()
        this.$router.push('/dashboard')
      },
      
      scrollToFeatures() {
        this.$refs.features.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
  </script>
  
  <style scoped>
  /* Base Styles */
  .home {
    overflow-x: hidden;
    color: #1a1a2e;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
  }
  
  /* Animated Background */
  .animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }
  
  .particle {
    position: absolute;
    background: rgba(56, 182, 255, 0.1);
    border-radius: 50%;
    animation: float 15s infinite ease-in-out;
  }
  
  /* Hero Section */
  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 120px 5% 150px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
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
    position: relative;
  }
  
  .hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .hero-subtitle {
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    margin-bottom: 2.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
  }
  
  .rotating-words {
    position: relative;
    display: inline-block;
    min-width: 120px;
    height: 1.5em;
    vertical-align: bottom;
  }
  
  .rotating-words span {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
    background: linear-gradient(90deg, #6c63ff 0%, #ff6b6b 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .rotating-words span.active {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-cta {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }
  
  .cta-button {
    padding: 0.75rem 1.75rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
    overflow: hidden;
  }
  
  .cta-button svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
  
  .cta-button.primary {
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    color: white;
    border: none;
  }
  
  .cta-button.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px -5px rgba(56, 182, 255, 0.4);
  }
  
  .cta-button.primary:hover svg {
    transform: translateX(3px);
  }
  
  .cta-button.primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  .cta-button.primary:hover::before {
    left: 100%;
  }
  
  .cta-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
  }
  
  .cta-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .cta-button.large {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
  
  .hero-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-number {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: 700;
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 0.25rem;
  }
  
  .hero-image {
    width: 50%;
    z-index: 1;
    position: relative;
    perspective: 1000px;
  }
  
  .dashboard-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .dashboard-image {
    width: 100%;
    height: auto;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transform: perspective(1000px) rotateY(-15deg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.5s ease, box-shadow 0.5s ease;
  }
  
  .hero-image:hover .dashboard-image {
    transform: perspective(1000px) rotateY(-5deg) scale(1.02);
    box-shadow: 0 30px 60px -10px rgba(0, 0, 0, 0.3);
  }
  
  .floating-card {
    position: absolute;
    background: white;
    border-radius: 16px;
    padding: 1rem;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
    animation: float 6s ease-in-out infinite;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }
  
  .floating-card:hover {
    transform: scale(1.05) translateY(-5px);
    box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.2);
  }
  
  .skill-card {
    top: -20px;
    right: -30px;
    width: 180px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 2;
  }
  
  .project-card {
    bottom: -30px;
    left: -40px;
    width: 220px;
    display: flex;
    gap: 1rem;
    z-index: 2;
  }
  
  .project-thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .project-card:hover .project-thumbnail {
    transform: scale(1.1);
  }
  
  .project-info h4 {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;
  }
  
  .project-card:hover .project-info h4 {
    color: #6c63ff;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .tech-badge {
    background: #f1f5f9;
    color: #334155;
    font-size: 0.6rem;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    transition: all 0.3s ease;
  }
  
  .project-card:hover .tech-badge {
    background: #6c63ff;
    color: white;
  }
  
  /* Trusted By Section */
  .trusted-by {
    padding: 4rem 5%;
    background: white;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .trusted-by-label {
    color: #64748b;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    display: inline-block;
  }
  
  .trusted-by-label::before,
  .trusted-by-label::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 100px;
    height: 1px;
    background: #e2e8f0;
  }
  
  .trusted-by-label::before {
    left: -110px;
  }
  
  .trusted-by-label::after {
    right: -110px;
  }
  
  .companies-marquee {
    overflow: hidden;
    position: relative;
    width: 100%;
    margin: 0 auto;
  }
  
  .marquee-content {
    display: flex;
    width: 200%;
    animation: marquee 30s linear infinite;
  }
  
  .company-logo {
    height: 40px;
    margin: 0 2rem;
    opacity: 0.7;
    filter: grayscale(100%);
    transition: all 0.3s ease;
  }
  
  .company-logo:hover {
    opacity: 1;
    filter: grayscale(0%);
    transform: scale(1.1);
  }
  
  /* Features Section */
  .features {
    padding: 100px 5%;
    background: #f8fafc;
    position: relative;
  }
  
  .section-title {
    text-align: center;
    font-size: clamp(2rem, 4vw, 2.5rem);
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  .highlight {
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    position: relative;
  }
  
  .highlight::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    border-radius: 3px;
  }
  
  .section-subtitle {
    text-align: center;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto 3rem;
    font-size: 1.1rem;
    position: relative;
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
    border-radius: 16px;
    box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
    border-color: rgba(56, 182, 255, 0.3);
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
    transition: all 0.3s ease;
  }
  
  .feature-card:hover .feature-icon {
    transform: rotate(10deg) scale(1.1);
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
    transition: color 0.3s ease;
  }
  
  .feature-card:hover h3 {
    color: #6c63ff;
  }
  
  .feature-card p {
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .feature-preview {
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 1.5rem;
    position: relative;
  }
  
  .feature-preview::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
    z-index: 1;
  }
  
  .feature-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .feature-card:hover .feature-preview img {
    transform: scale(1.1);
  }
  
  .feature-badge {
    position: absolute;
    top: 20px;
    right: -30px;
    background: #ff6b6b;
    color: white;
    padding: 0.25rem 2rem;
    font-size: 0.8rem;
    font-weight: 600;
    transform: rotate(45deg);
    box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
  }
  
  /* Testimonials */
  .testimonials {
    padding: 100px 5%;
    background: white;
    position: relative;
  }
  
  .testimonials::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  }
  
  .testimonials-carousel {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }
  
  .carousel-track {
    display: flex;
    transition: transform 0.5s ease;
    width: 100%;
    overflow: hidden;
  }
  
  .testimonial-card {
    min-width: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
    transition: opacity 0.5s ease;
    opacity: 0.3;
  }
  
  .testimonial-card.active {
    opacity: 1;
  }
  
  .testimonial-content {
    position: relative;
    padding: 2rem;
    background: #f8fafc;
    border-radius: 16px;
    margin-bottom: 1.5rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .quote-icon {
    position: absolute;
    top: -15px;
    left: 20px;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .quote-icon svg {
    width: 16px;
    height: 16px;
    color: white;
  }
  
  .testimonial-content p {
    font-style: italic;
    color: #334155;
    line-height: 1.6;
    font-size: 1.1rem;
    position: relative;
    z-index: 1;
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .author-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #6c63ff;
    box-shadow: 0 5px 15px rgba(108, 99, 255, 0.2);
  }
  
  .author-info h4 {
    color: #1e293b;
    margin-bottom: 0.25rem;
    font-size: 1.1rem;
  }
  
  .author-info p {
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .author-rating {
    display: flex;
    gap: 0.25rem;
  }
  
  .author-rating svg {
    width: 16px;
    height: 16px;
    fill: #f59e0b;
  }
  
  .carousel-button {
    background: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    z-index: 2;
  }
  
  .carousel-button:hover {
    background: #6c63ff;
  }
  
  .carousel-button:hover svg {
    stroke: white;
  }
  
  .carousel-button svg {
    width: 24px;
    height: 24px;
    stroke: #6c63ff;
    transition: all 0.3s ease;
  }
  
  .carousel-button.prev {
    position: absolute;
    left: 0;
  }
  
  .carousel-button.next {
    position: absolute;
    right: 0;
  }
  
  .carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
  }
  
  .carousel-indicators button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: #e2e8f0;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .carousel-indicators button.active {
    background: #6c63ff;
    transform: scale(1.2);
  }
  
  /* Interactive Demo Section */
  .interactive-demo {
    padding: 100px 5%;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    position: relative;
    overflow: hidden;
  }
  
  .demo-content {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  
  .demo-content h2 {
    text-align: center;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    margin-bottom: 1rem;
  }
  
  .demo-content p {
    text-align: center;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto 3rem;
    font-size: 1.1rem;
  }
  
  .demo-selector {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  
  .demo-selector button {
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    border: none;
    background: white;
    color: #64748b;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .demo-selector button.active {
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    color: white;
    box-shadow: 0 10px 20px -5px rgba(56, 182, 255, 0.4);
  }
  
  .demo-viewer {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    padding: 2.5rem;
    border-radius: 16px;
    width: 100%;
    max-width: 450px;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: modalFadeIn 0.3s ease-out;
  }
  
  .close-modal {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    transition: color 0.3s ease;
  }
  
  .close-modal:hover {
    color: #1e293b;
  }
  
  .close-modal svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
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
  
  /* Animations */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .hero {
      flex-direction: column;
      text-align: center;
      padding-bottom: 80px;
      min-height: auto;
    }
    
    .hero-content {
      margin-bottom: 3rem;
      max-width: 100%;
    }
    
    .hero-image {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .hero-cta {
      justify-content: center;
    }
    
    .floating-card {
      display: none;
    }
    
    .testimonials-carousel {
      padding: 0 3rem;
    }
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .testimonial-card {
      min-width: 100%;
    }
    
    .carousel-button {
      width: 40px;
      height: 40px;
    }
    
    .carousel-button.prev {
      left: -10px;
    }
    
    .carousel-button.next {
      right: -10px;
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-cta {
      flex-direction: column;
    }
    
    .hero-stats {
      flex-direction: column;
      gap: 1rem;
    }
    
    .trusted-by-label::before,
    .trusted-by-label::after {
      display: none;
    }
    
    .demo-selector {
      flex-direction: column;
      align-items: center;
    }
    
    .demo-selector button {
      width: 100%;
      max-width: 250px;
    }
  }
  </style>