<template>
    <div class="home">
      <!-- Animated Background Elements -->
      <div class="bg-elements">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
  
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              <span class="gradient-text" ref="titleWord">Elevate</span> Your Developer Journey
            </h1>
            <p class="hero-subtitle" ref="subtitle">
              The modern way to track, showcase, and grow your technical skills
            </p>
            <div class="hero-cta">
              <button @click="showAuthModal('signup')" class="cta-button primary" ref="primaryBtn">
                Get Started
              </button>
              <button @click="scrollToFeatures" class="cta-button secondary" ref="secondaryBtn">
                Learn More
              </button>
            </div>
            <div class="hero-stats">
              <div class="stat-item" v-for="(stat, index) in stats" :key="stat.label" :ref="'stat'+index">
                <div class="stat-number">{{ stat.value }}+</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
          <div class="hero-image" ref="heroImage">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                 alt="Developer dashboard" 
                 class="dashboard-image">
          </div>
        </div>
      </section>
  
      <!-- Features Section -->
      <section ref="features" class="features">
        <div class="container">
          <h2 class="section-title" ref="featuresTitle">
            Powerful Features for <span class="gradient-text">Developers</span>
          </h2>
          <p class="section-subtitle" ref="featuresSubtitle">Everything you need to showcase your skills and projects</p>
          
          <div class="features-grid">
            <div class="feature-card" v-for="(feature, index) in features" :key="index" :ref="'feature'+index">
              <div class="feature-icon">
                <span class="icon" :class="feature.iconClass"></span>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Testimonials -->
      <section class="testimonials">
        <div class="container">
          <h2 class="section-title" ref="testimonialsTitle">
            Trusted by <span class="gradient-text">Developers</span> Worldwide
          </h2>
          
          <div class="testimonials-grid">
            <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index" 
                 :ref="'testimonial'+index" 
                 @mouseenter="hoverTestimonial(index)"
                 @mouseleave="unhoverTestimonial(index)">
              <div class="testimonial-content">
                <p>"{{ testimonial.content }}"</p>
              </div>
              <div class="testimonial-author">
                <img :src="testimonial.avatar" 
                     :alt="testimonial.name" 
                     class="author-avatar">
                <div class="author-info">
                  <h4>{{ testimonial.name }}</h4>
                  <p>{{ testimonial.position }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="cta-section" ref="ctaSection">
        <div class="container">
          <div class="cta-content">
            <h2>Ready to showcase your skills?</h2>
            <p>Join our community of developers building their portfolios</p>
            <button @click="showAuthModal('signup')" class="cta-button primary large pulse">
              Start Building Your Portfolio
            </button>
          </div>
        </div>
      </section>
  
      <!-- Auth Modal -->
      <transition name="modal">
        <div v-if="showModal" class="auth-modal">
          <div class="auth-modal-content">
            <button @click="closeModal" class="close-modal">
              &times;
            </button>
            <AuthForm 
              :isLoginMode="authMode === 'login'" 
              @success="handleAuthSuccess"
              @error="handleAuthError"
              @toggleMode="toggleAuthMode"
            />
          </div>  
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import AuthForm from '@/components/auth/AuthForm.vue'
  import gsap from 'gsap'
  
  export default {
    name: 'HomeView',
    components: {
      AuthForm
    },
    data() {
      return {
        showModal: false,
        authMode: 'login',
        stats: [
          { value: 10, label: 'K+ Developers' },
          { value: 50, label: 'K+ Projects' },
          { value: 100, label: 'Tech Skills' }
        ],
        features: [
          { 
            title: 'Skill Tracking', 
            description: 'Visualize your progress with intuitive dashboards and charts.',
            iconClass: 'icon-chart'
          },
          { 
            title: 'Project Showcase', 
            description: 'Display your best work with beautiful project galleries.',
            iconClass: 'icon-project'
          },
          { 
            title: 'Community', 
            description: 'Connect with other developers and get feedback on your work.',
            iconClass: 'icon-community'
          }
        ],
        testimonials: [
          {
            content: "This platform helped me land my dream job by showcasing my skills effectively.",
            name: "Sarah K.",
            position: "Frontend Developer",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
          },
          {
            content: "As a hiring manager, I appreciate how clearly DevGate profiles display candidates' abilities.",
            name: "Michael T.",
            position: "Engineering Manager",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          {
            content: "The best way to track my learning journey and see my progress over time.",
            name: "Alex R.",
            position: "Full Stack Developer",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg"
          }
        ]
      }
    },
    methods: {
      showAuthModal(mode) {
        this.authMode = mode
        this.showModal = true
        document.body.style.overflow = 'hidden'
      },
      closeModal() {
        this.showModal = false
        document.body.style.overflow = 'auto'
      },
      handleAuthSuccess() {
        this.closeModal()
        this.$router.push('/dash')
      },
      handleAuthError(error) {
        console.error('Authentication error:', error)
      },
      toggleAuthMode() {
        this.authMode = this.authMode === 'login' ? 'signup' : 'login'
      },
      scrollToFeatures() {
        this.$refs.features.scrollIntoView({ behavior: 'smooth' })
      },
      hoverTestimonial(index) {
        gsap.to(this.$refs[`testimonial${index}`], {
          y: -10,
          boxShadow: '0 15px 30px rgba(49, 130, 206, 0.2)',
          duration: 0.3
        })
      },
      unhoverTestimonial(index) {
        gsap.to(this.$refs[`testimonial${index}`], {
          y: 0,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          duration: 0.3
        })
      },
      animateElements() {
        // Hero section animations
        gsap.from(this.$refs.titleWord, {
          duration: 1,
          y: 50,
          opacity: 0,
          ease: "power3.out"
        })
        
        gsap.from(this.$refs.subtitle, {
          duration: 1,
          y: 30,
          opacity: 0,
          delay: 0.3,
          ease: "power3.out"
        })
        
        gsap.from([this.$refs.primaryBtn, this.$refs.secondaryBtn], {
          duration: 0.8,
          y: 30,
          opacity: 0,
          delay: 0.6,
          stagger: 0.1,
          ease: "back.out"
        })
        
        gsap.from(this.$refs.heroImage, {
          duration: 1.2,
          x: 100,
          opacity: 0,
          delay: 0.4,
          ease: "power3.out"
        })
        
        // Stats counter animation
        this.stats.forEach((stat, index) => {
          gsap.from(this.$refs[`stat${index}`], {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.8 + (index * 0.2),
            ease: "back.out"
          })
        })
        
        // Features section animations
        gsap.from([this.$refs.featuresTitle, this.$refs.featuresSubtitle], {
          scrollTrigger: {
            trigger: this.$refs.features,
            start: "top 80%"
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2
        })
        
        this.features.forEach((_, index) => {
          gsap.from(this.$refs[`feature${index}`], {
            scrollTrigger: {
              trigger: this.$refs.features,
              start: "top 70%"
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.15
          })
        })
        
        // Testimonials animations
        gsap.from(this.$refs.testimonialsTitle, {
          scrollTrigger: {
            trigger: '.testimonials',
            start: "top 80%"
          },
          y: 50,
          opacity: 0,
          duration: 0.8
        })
        
        this.testimonials.forEach((_, index) => {
          gsap.from(this.$refs[`testimonial${index}`], {
            scrollTrigger: {
              trigger: '.testimonials',
              start: "top 70%"
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.15
          })
        })
        
        // CTA section animation
        gsap.from(this.$refs.ctaSection, {
          scrollTrigger: {
            trigger: this.$refs.ctaSection,
            start: "top 80%"
          },
          y: 50,
          opacity: 0,
          duration: 0.8
        })
      }
    },
    mounted() {
      this.animateElements()
      
      // Background circles animation
      gsap.to('.bg-elements .circle:nth-child(1)', {
        duration: 20,
        x: 100,
        y: 50,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
      
      gsap.to('.bg-elements .circle:nth-child(2)', {
        duration: 25,
        x: -80,
        y: -30,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
      
      gsap.to('.bg-elements .circle:nth-child(3)', {
        duration: 30,
        x: 50,
        y: -80,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }
  }
  </script>
  
  <style scoped>
  /* Base Styles */
  .home {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #2d3748;
    line-height: 1.6;
    position: relative;
    overflow-x: hidden;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* Background Elements */
  .bg-elements {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }
  
  .bg-elements .circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.15;
  }
  
  .bg-elements .circle:nth-child(1) {
    width: 300px;
    height: 300px;
    background: #3182ce;
    top: 10%;
    left: 10%;
  }
  
  .bg-elements .circle:nth-child(2) {
    width: 400px;
    height: 400px;
    background: #63b3ed;
    bottom: 10%;
    right: 10%;
  }
  
  .bg-elements .circle:nth-child(3) {
    width: 250px;
    height: 250px;
    background: #90cdf4;
    top: 50%;
    left: 30%;
  }
  
  /* Hero Section */
  .hero {
    background: linear-gradient(135deg, #f7fafc 0%, #ebf8ff 100%);
    padding: 120px 0 150px;
    position: relative;
  }
  
  .hero-content {
    max-width: 600px;
    position: relative;
    z-index: 2;
  }
  
  .hero-title {
    font-size: 3.2rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #3182ce 0%, #63b3ed 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
    color: #4a5568;
    margin-bottom: 2.5rem;
    opacity: 0.9;
  }
  
  .hero-cta {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
  }
  
  .cta-button {
    padding: 14px 28px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    transform: translateY(0);
  }
  
  .cta-button.primary {
    background: linear-gradient(90deg, #3182ce 0%, #63b3ed 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);
  }
  
  .cta-button.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(49, 130, 206, 0.3);
  }
  
  .cta-button.secondary {
    background: white;
    color: #3182ce;
    border: 2px solid #bee3f8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .cta-button.secondary:hover {
    border-color: #90cdf4;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(49, 130, 206, 0.1);
  }
  
  .cta-button.large {
    padding: 16px 36px;
    font-size: 1.1rem;
  }
  
  .hero-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .stat-item {
    text-align: center;
    opacity: 0; /* Initial state for animation */
  }
  
  .stat-number {
    font-size: 2.2rem;
    font-weight: 700;
    color: #3182ce;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.95rem;
    color: #718096;
    font-weight: 500;
  }
  
  .hero-image {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 50%;
    max-width: 600px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    opacity: 0; /* Initial state for animation */
  }
  
  .dashboard-image {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
  }
  
  .hero-image:hover .dashboard-image {
    transform: scale(1.03);
  }
  
  /* Features Section */
  .features {
    padding: 120px 0;
    background: white;
    position: relative;
  }
  
  .section-title {
    font-size: 2.5rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 1rem;
    opacity: 0; /* Initial state for animation */
  }
  
  .section-subtitle {
    text-align: center;
    color: #718096;
    max-width: 600px;
    margin: 0 auto 3rem;
    font-size: 1.1rem;
    opacity: 0; /* Initial state for animation */
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    background: white;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    text-align: center;
    transform: translateY(20px);
    opacity: 0; /* Initial state for animation */
  }
  
  .feature-card:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 15px 30px rgba(49, 130, 206, 0.1);
  }
  
  .feature-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
    border-radius: 50%;
    transition: transform 0.3s ease;
  }
  
  .feature-card:hover .feature-icon {
    transform: scale(1.1) rotate(5deg);
  }
  
  .icon {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: transform 0.3s ease;
  }
  
  .feature-card:hover .icon {
    transform: scale(1.1);
  }
  
  .icon-chart {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%233182ce' viewBox='0 0 24 24'%3E%3Cpath d='M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'/%3E%3C/svg%3E");
  }
  
  .icon-project {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%233182ce' viewBox='0 0 24 24'%3E%3Cpath d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'/%3E%3C/svg%3E");
  }
  
  .icon-community {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%233182ce' viewBox='0 0 24 24'%3E%3Cpath d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'/%3E%3C/svg%3E");
  }
  
  .feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2d3748;
  }
  
  .feature-card p {
    color: #718096;
    line-height: 1.6;
  }
  
  /* Testimonials */
  .testimonials {
    padding: 120px 0;
    background: #f7fafc;
  }
  
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    transform: translateY(20px);
    opacity: 0; /* Initial state for animation */
  }
  
  .testimonial-content {
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  .testimonial-content p {
    font-style: italic;
    color: #4a5568;
    position: relative;
    z-index: 1;
  }
  
  .testimonial-content p::before {
    content: '"';
    font-size: 5rem;
    color: #ebf8ff;
    position: absolute;
    left: -15px;
    top: -30px;
    z-index: -1;
    line-height: 1;
    font-family: serif;
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .author-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .testimonial-card:hover .author-avatar {
    transform: scale(1.1);
  }
  
  .author-info h4 {
    color: #2d3748;
    margin-bottom: 0.25rem;
  }
  
  .author-info p {
    color: #718096;
    font-size: 0.9rem;
  }
  
  /* CTA Section */
  .cta-section {
    padding: 120px 0;
    background: linear-gradient(135deg, #3182ce 0%, #63b3ed 100%);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
    transform: translateY(20px);
    opacity: 0; /* Initial state for animation */
  }
  
  .cta-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
  }
  
  .cta-content p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    position: relative;
    z-index: 1;
  }
  
  .pulse {
    animation: pulse 2s infinite;
    position: relative;
    z-index: 1;
  }
  
  /* Auth Modal */
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
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
    border-radius: 12px;
    width: 100%;
    max-width: 450px;
    position: relative;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    transform: scale(1);
    transition: transform 0.3s ease;
  }
  
  .auth-modal-content:hover {
    transform: scale(1.02);
  }
  
  .close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.75rem;
    cursor: pointer;
    color: #718096;
    transition: color 0.3s ease;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .close-modal:hover {
    color: #2d3748;
    background: #f7fafc;
  }
  
  /* Animations */
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .hero-image {
      position: relative;
      width: 100%;
      max-width: none;
      transform: none;
      margin-top: 3rem;
      opacity: 1;
    }
    
    .hero-content {
      max-width: none;
      text-align: center;
    }
    
    .hero-cta {
      justify-content: center;
    }
    
    .hero-stats {
      justify-content: center;
    }
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .hero-cta {
      flex-direction: column;
      align-items: center;
    }
    
    .hero-stats {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .cta-button {
      width: 100%;
      max-width: 300px;
    }
    
    .cta-button.large {
      width: 100%;
      max-width: 300px;
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-subtitle {
      font-size: 1.1rem;
    }
    
    .section-title {
      font-size: 1.8rem;
    }
    
    .feature-card {
      padding: 1.5rem;
    }
  }
  </style>