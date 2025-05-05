<template>
    <div class="home">
      <!-- Animated Background -->
      <div class="animated-background">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
  
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Elevate</span> Your Developer Journey
            <span class="typing-cursor">|</span>
          </h1>
          <p class="hero-subtitle">
            Track, showcase, and grow your technical skills with the ultimate developer portfolio platform
          </p>
          <div class="hero-cta">
            <button @click="showAuthModal('signup')" class="cta-button primary pulse">
              <i class="fas fa-rocket"></i> Start For Free
            </button>
            <button @click="scrollToFeatures" class="cta-button secondary">
              <i class="fas fa-play-circle"></i> See How It Works
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat-item" v-for="stat in stats" :key="stat.label">
              <div class="stat-number" v-animate-number="{value: stat.value, duration: 2000}">0</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <div class="dashboard-container">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                 alt="Developer dashboard" 
                 class="dashboard-image">
            <div class="floating-card skill-card" @mouseover="hoverCard('skill')" @mouseleave="resetCard('skill')">
              <div class="skill-progress">
                <div class="progress-circle" style="--progress: 85">
                  <span>85%</span>
                </div>
              </div>
              <div class="skill-info">
                <h4>React.js</h4>
                <p>Advanced Level</p>
                <div class="skill-chart">
                  <div class="chart-bar" style="--progress: 85"></div>
                </div>
              </div>
            </div>
            <div class="floating-card project-card" @mouseover="hoverCard('project')" @mouseleave="resetCard('project')">
              <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                   alt="Project thumbnail" 
                   class="project-thumbnail">
              <div class="project-info">
                <h4>E-commerce Platform</h4>
                <div class="tech-stack">
                  <span class="tech-badge"><i class="fab fa-react"></i> React</span>
                  <span class="tech-badge"><i class="fab fa-node-js"></i> Node.js</span>
                  <span class="tech-badge"><i class="fas fa-database"></i> MongoDB</span>
                </div>
                <div class="project-actions">
                  <button class="action-btn"><i class="fas fa-eye"></i> Preview</button>
                  <button class="action-btn"><i class="fas fa-code"></i> Code</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Trusted By Section -->
      <section class="trusted-by">
        <p class="trusted-by-label">Trusted by developers at</p>
        <div class="companies-grid">
          <div class="company-logo" v-for="(company, index) in companies" :key="index" @mouseover="animateLogo(index)" @mouseleave="resetLogo(index)">
            <i :class="company.icon"></i>
            <span>{{ company.name }}</span>
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
          <div class="feature-card" v-for="(feature, index) in features" :key="index" @mouseover="hoverFeature(index)" @mouseleave="leaveFeature(index)">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <div class="feature-preview">
              <img :src="feature.image" :alt="feature.title + ' preview'">
            </div>
            <div class="feature-badge">{{ feature.badge }}</div>
          </div>
        </div>
      </section>
  
      <!-- Interactive Demo Section -->
      <section class="interactive-demo">
        <div class="demo-container">
          <div class="demo-content">
            <h2>Try Our Interactive Demo</h2>
            <p>Experience DevGate's powerful features without signing up</p>
            <div class="demo-selector">
              <button v-for="(tab, index) in demoTabs" 
                      :key="index" 
                      @click="activeDemoTab = index"
                      :class="{'active': activeDemoTab === index}">
                <i :class="tab.icon"></i> {{ tab.label }}
              </button>
            </div>
            <div class="demo-display">
              <div v-if="activeDemoTab === 0" class="demo-skill-chart">
                <div class="skill-meter" v-for="skill in demoSkills" :key="skill.name">
                  <div class="skill-name">{{ skill.name }}</div>
                  <div class="skill-bar">
                    <div class="skill-progress" :style="{width: skill.level + '%'}"></div>
                    <div class="skill-level">{{ skill.level }}%</div>
                  </div>
                </div>
              </div>
              <div v-else-if="activeDemoTab === 1" class="demo-project-showcase">
                <div class="project-card" v-for="project in demoProjects" :key="project.name">
                  <div class="project-header">
                    <h4>{{ project.name }}</h4>
                    <div class="project-stars">
                      <i class="fas fa-star"></i> {{ project.stars }}
                    </div>
                  </div>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-tech">
                    <span v-for="tech in project.tech" :key="tech"><i :class="techIcons[tech]"></i> {{ tech }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="demo-achievements">
                <div class="badge" v-for="badge in demoBadges" :key="badge.name">
                  <div class="badge-icon">
                    <i :class="badge.icon"></i>
                  </div>
                  <div class="badge-info">
                    <h5>{{ badge.name }}</h5>
                    <p>{{ badge.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <button @click="showAuthModal('signup')" class="cta-button primary">
              <i class="fas fa-user-plus"></i> Create Your Own Profile
            </button>
          </div>
        </div>
      </section>
  
      <!-- Testimonials -->
      <section class="testimonials">
        <h2 class="section-title">
          What <span class="highlight">Developers</span> Say
        </h2>
        
        <div class="testimonials-slider">
          <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index" :style="{transform: `translateX(${(index - activeTestimonial) * 100}%)`}">
            <div class="testimonial-content">
              <div class="quote-icon">
                <i class="fas fa-quote-left"></i>
              </div>
              <p>{{ testimonial.content }}</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" 
                   :alt="testimonial.name" 
                   class="author-avatar">
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.position }}</p>
                <div class="author-rating">
                  <i v-for="star in 5" :key="star" class="fas fa-star" :class="{'filled': star <= testimonial.rating}"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="testimonial-controls">
          <button @click="prevTestimonial" class="control-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="testimonial-dots">
            <span v-for="(t, i) in testimonials" 
                  :key="i" 
                  @click="activeTestimonial = i"
                  :class="{'active': i === activeTestimonial}"></span>
          </div>
          <button @click="nextTestimonial" class="control-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>
  
      <!-- Tech Stack Section -->
      <section class="tech-stack-section">
        <h2 class="section-title">
          <span class="highlight">Supported</span> Technologies
        </h2>
        <p class="section-subtitle">Track and showcase skills across all major technologies</p>
        
        <div class="tech-categories">
          <div class="category" v-for="category in techCategories" :key="category.name">
            <h3 @click="toggleCategory(category.name)">
              <i :class="category.icon"></i> {{ category.name }}
              <i class="fas" :class="{'fa-chevron-down': !expandedCategories.includes(category.name), 'fa-chevron-up': expandedCategories.includes(category.name)}"></i>
            </h3>
            <div class="tech-list" v-if="expandedCategories.includes(category.name)">
              <div class="tech-item" v-for="tech in category.techs" :key="tech.name">
                <i :class="tech.icon"></i>
                <span>{{ tech.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Transform Your Developer Portfolio?</h2>
          <p>Join thousands of developers showcasing their skills and projects with DevGate</p>
          <div class="cta-buttons">
            <button @click="showAuthModal('signup')" class="cta-button primary large pulse">
              <i class="fas fa-rocket"></i> Get Started - It's Free
            </button>
            <button @click="scrollToTop" class="cta-button ghost">
              <i class="fas fa-arrow-up"></i> Back to Top
            </button>
          </div>
        </div>
        <div class="cta-decoration">
          <div class="decoration-circle"></div>
          <div class="decoration-circle"></div>
          <div class="decoration-circle"></div>
        </div>
      </section>
  
      <!-- Auth Modal -->
      <transition name="fade">
        <div v-if="showModal" class="auth-modal">
          <div class="auth-modal-content">
            <button @click="closeModal" class="close-modal">
              <i class="fas fa-times"></i>
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
  
      <!-- Floating Action Button -->
      <button class="fab" @click="showAuthModal('signup')">
        <i class="fas fa-user-plus"></i>
      </button>
  
      <!-- Scroll Progress Indicator -->
      <div class="scroll-progress" :style="{width: scrollProgress + '%'}"></div>
    </div>
  </template>
  
  <script>
  import AuthForm from '@/components/auth/AuthForm.vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { 
    faRocket, faPlayCircle, faEye, faCode, faQuoteLeft, 
    faChevronLeft, faChevronRight, faStar, faTimes,
    faUserPlus, faArrowUp, faChartLine, faLayerGroup,
    faUsers, faCodeBranch, faCertificate, faServer,
    faMobileAlt, faDatabase, faCogs
  } from '@fortawesome/free-solid-svg-icons'
  import { 
    faReact, faNodeJs, faJs, faPython, 
    faJava, faHtml5, faCss3Alt, faAws,
    faMicrosoft, faSass, faVuejs, faAngular,
    faDocker, faGitAlt, faGithub, faNpm
  } from '@fortawesome/free-brands-svg-icons'
  
  library.add(
    faRocket, faPlayCircle, faEye, faCode, faQuoteLeft, 
    faChevronLeft, faChevronRight, faStar, faTimes,
    faUserPlus, faArrowUp, faChartLine, faLayerGroup,
    faUsers, faCodeBranch, faCertificate, faServer,
    faMobileAlt, faDatabase, faCogs, faReact, 
    faNodeJs, faJs, faPython, faJava, faHtml5, 
    faCss3Alt, faAws, faMicrosoft, faSass, faVuejs, 
    faAngular, faDocker, faGitAlt, faGithub, faNpm
  )
  
  export default {
    name: 'HomeView',
    components: {
      AuthForm,
      FontAwesomeIcon
    },
    data() {
      return {
        showModal: false,
        authMode: 'login',
        activeTestimonial: 0,
        activeDemoTab: 0,
        expandedCategories: ['Frontend', 'Backend'],
        scrollProgress: 0,
        stats: [
          { value: 10000, label: 'Developers' },
          { value: 50000, label: 'Projects' },
          { value: 100, label: 'Tech Skills' }
        ],
        companies: [
          { name: 'AWS', icon: 'fab fa-aws' },
          { name: 'Microsoft', icon: 'fab fa-microsoft' },
          { name: 'Google', icon: 'fab fa-google' },
          { name: 'IBM', icon: 'fas fa-server' },
          { name: 'SAP', icon: 'fas fa-database' }
        ],
        features: [
          { 
            title: 'Skill Analytics', 
            description: 'Visualize your progress with beautiful charts and track your growth across all technologies.', 
            icon: 'fas fa-chart-line',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            badge: 'New'
          },
          { 
            title: 'Project Showcase', 
            description: 'Display your best work with beautiful project cards, tech stack visualization, and live demos.', 
            icon: 'fas fa-layer-group',
            image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            badge: 'Popular'
          },
          { 
            title: 'Community Support', 
            description: 'Connect with other developers, get feedback, and find collaborators for your next project.', 
            icon: 'fas fa-users',
            image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
            badge: 'Trending'
          }
        ],
        testimonials: [
          {
            content: "DevGate helped me organize my learning path and land my first developer job! The skill tracking kept me motivated and the project showcase was perfect for my portfolio.",
            name: "Sarah K.",
            position: "Frontend Developer @ TechCorp",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
            rating: 5
          },
          {
            content: "As a hiring manager, I love when candidates share their DevGate profiles. The skill visualization helps me quickly understand their strengths and growth areas.",
            name: "Miguel R.",
            position: "Engineering Manager @ DevSolutions",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
            rating: 5
          },
          {
            content: "The community features on DevGate helped me find collaborators for my open-source project. We now have over 500 stars on GitHub thanks to the exposure!",
            name: "Alex T.",
            position: "Full Stack Developer",
            avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
            rating: 4
          }
        ],
        demoSkills: [
          { name: 'JavaScript', level: 85 },
          { name: 'React', level: 78 },
          { name: 'Node.js', level: 72 },
          { name: 'Python', level: 65 },
          { name: 'Docker', level: 58 }
        ],
        demoProjects: [
          { 
            name: 'E-commerce Platform', 
            description: 'A full-featured online store with payment integration and admin dashboard.', 
            tech: ['React', 'Node.js', 'MongoDB'],
            stars: 42
          },
          { 
            name: 'Task Management App', 
            description: 'Collaborative task management application with real-time updates.', 
            tech: ['Vue.js', 'Firebase'],
            stars: 28
          }
        ],
        demoBadges: [
          { name: 'JavaScript Expert', description: 'Earned by completing all JS challenges', icon: 'fab fa-js' },
          { name: 'Open Source Contributor', description: 'Contributed to 5+ open source projects', icon: 'fas fa-code-branch' },
          { name: 'Full Stack Developer', description: 'Built 3 full stack applications', icon: 'fas fa-certificate' }
        ],
        demoProjects: [
          { 
            name: 'E-commerce Platform', 
            description: 'A full-featured online store with payment integration and admin dashboard.', 
            tech: ['React', 'Node.js', 'MongoDB'],
            stars: 42
          },
          { 
            name: 'Task Management App', 
            description: 'Collaborative task management application with real-time updates.', 
            tech: ['Vue.js', 'Firebase'],
            stars: 28
          }
        ],
        demoBadges: [
          { name: 'JavaScript Expert', description: 'Earned by completing all JS challenges', icon: 'fab fa-js' },
          { name: 'Open Source Contributor', description: 'Contributed to 5+ open source projects', icon: 'fas fa-code-branch' },
          { name: 'Full Stack Developer', description: 'Built 3 full stack applications', icon: 'fas fa-certificate' }
        ],
        demoProjects: [
          { 
            name: 'E-commerce Platform', 
            description: 'A full-featured online store with payment integration and admin dashboard.', 
            tech: ['React', 'Node.js', 'MongoDB'],
            stars: 42
          },
          { 
            name: 'Task Management App', 
            description: 'Collaborative task management application with real-time updates.', 
            tech: ['Vue.js', 'Firebase'],
            stars: 28
          }
        ],
        demoBadges: [
          { name: 'JavaScript Expert', description: 'Earned by completing all JS challenges', icon: 'fab fa-js' },
          { name: 'Open Source Contributor', description: 'Contributed to 5+ open source projects', icon: 'fas fa-code-branch' },
          { name: 'Full Stack Developer', description: 'Built 3 full stack applications', icon: 'fas fa-certificate' }
        ],
        demoTabs: [
          { label: 'Skills', icon: 'fas fa-chart-line' },
          { label: 'Projects', icon: 'fas fa-layer-group' },
          { label: 'Achievements', icon: 'fas fa-trophy' }
        ],
        techIcons: {
          'React': 'fab fa-react',
          'Node.js': 'fab fa-node-js',
          'MongoDB': 'fas fa-database',
          'Vue.js': 'fab fa-vuejs',
          'Firebase': 'fas fa-fire'
        },
        techCategories: [
          {
            name: 'Frontend',
            icon: 'fas fa-desktop',
            techs: [
              { name: 'React', icon: 'fab fa-react' },
              { name: 'Vue.js', icon: 'fab fa-vuejs' },
              { name: 'Angular', icon: 'fab fa-angular' },
              { name: 'HTML5', icon: 'fab fa-html5' },
              { name: 'CSS3', icon: 'fab fa-css3-alt' },
              { name: 'Sass', icon: 'fab fa-sass' }
            ]
          },
          {
            name: 'Backend',
            icon: 'fas fa-server',
            techs: [
              { name: 'Node.js', icon: 'fab fa-node-js' },
              { name: 'Python', icon: 'fab fa-python' },
              { name: 'Java', icon: 'fab fa-java' },
              { name: 'PHP', icon: 'fab fa-php' },
              { name: 'Ruby', icon: 'fas fa-gem' },
              { name: 'Go', icon: 'fab fa-golang' }
            ]
          },
          {
            name: 'Mobile',
            icon: 'fas fa-mobile-alt',
            techs: [
              { name: 'React Native', icon: 'fab fa-react' },
              { name: 'Flutter', icon: 'fas fa-mobile' },
              { name: 'Swift', icon: 'fab fa-swift' },
              { name: 'Kotlin', icon: 'fas fa-mobile' }
            ]
          },
          {
            name: 'DevOps',
            icon: 'fas fa-cogs',
            techs: [
              { name: 'Docker', icon: 'fab fa-docker' },
              { name: 'Kubernetes', icon: 'fas fa-cubes' },
              { name: 'AWS', icon: 'fab fa-aws' },
              { name: 'Azure', icon: 'fab fa-microsoft' },
              { name: 'Git', icon: 'fab fa-git-alt' }
            ]
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
      scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      nextTestimonial() {
        this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length
      },
      prevTestimonial() {
        this.activeTestimonial = (this.activeTestimonial - 1 + this.testimonials.length) % this.testimonials.length
      },
      toggleCategory(category) {
        if (this.expandedCategories.includes(category)) {
          this.expandedCategories = this.expandedCategories.filter(c => c !== category)
        } else {
          this.expandedCategories.push(category)
        }
      },
      animateLogo(index) {
        const logo = document.querySelectorAll('.company-logo')[index]
        if (logo) {
          logo.style.transform = 'scale(1.1) rotate(5deg)'
          logo.style.color = '#38b6ff'
        }
      },
      resetLogo(index) {
        const logo = document.querySelectorAll('.company-logo')[index]
        if (logo) {
          logo.style.transform = 'scale(1) rotate(0)'
          logo.style.color = '#64748b'
        }
      },
      hoverCard(type) {
        const card = document.querySelector(`.${type}-card`)
        if (card) {
          card.style.transform = 'translateY(-10px) scale(1.05)'
          card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
        }
      },
      resetCard(type) {
        const card = document.querySelector(`.${type}-card`)
        if (card) {
          card.style.transform = ''
          card.style.boxShadow = ''
        }
      },
      hoverFeature(index) {
        const feature = document.querySelectorAll('.feature-card')[index]
        if (feature) {
          feature.style.transform = 'translateY(-10px)'
          const icon = feature.querySelector('.feature-icon')
          if (icon) {
            icon.style.transform = 'rotate(10deg) scale(1.1)'
          }
        }
      },
      leaveFeature(index) {
        const feature = document.querySelectorAll('.feature-card')[index]
        if (feature) {
          feature.style.transform = ''
          const icon = feature.querySelector('.feature-icon')
          if (icon) {
            icon.style.transform = ''
          }
        }
      },
      handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
        this.scrollProgress = (scrollTop / height) * 100
      }
    },
    directives: {
      animateNumber: {
        inserted(el, binding) {
          const target = binding.value.value
          const duration = binding.value.duration || 2000
          const increment = target / (duration / 16)
          let current = 0
          const animate = () => {
            current += increment
            if (current < target) {
              el.textContent = Math.floor(current).toLocaleString()
              requestAnimationFrame(animate)
            } else {
              el.textContent = target.toLocaleString()
            }
          }
          animate()
        }
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
      // Start typing animation
      const titles = ['Elevate Your Developer Journey', 'Showcase Your Skills', 'Build Your Portfolio']
      let currentIndex = 0
      let charIndex = 0
      let isDeleting = false
      const type = () => {
        const currentTitle = titles[currentIndex]
        const displayText = isDeleting 
          ? currentTitle.substring(0, charIndex - 1)
          : currentTitle.substring(0, charIndex + 1)
        console.log('Display text value : ', this.displayText)
        //document.querySelector('.hero-title .gradient-text').textContent = displayText
        
        if (!isDeleting && charIndex === currentTitle.length) {
          isDeleting = true
          setTimeout(type, 2000)
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false
          currentIndex = (currentIndex + 1) % titles.length
          setTimeout(type, 500)
        } else {
          const delay = isDeleting ? 100 : 200
          charIndex = isDeleting ? charIndex - 1 : charIndex + 1
          setTimeout(type, delay)
        }
      }
      setTimeout(type, 1000)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
  </script>
  
  <style scoped>
  /* Base Styles */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
  
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
    animation: float 15s infinite linear;
  }
  
  .particle:nth-child(1) {
    width: 20px;
    height: 20px;
    top: 20%;
    left: 10%;
    animation-duration: 20s;
  }
  
  .particle:nth-child(2) {
    width: 30px;
    height: 30px;
    top: 60%;
    left: 80%;
    animation-duration: 25s;
  }
  
  .particle:nth-child(3) {
    width: 15px;
    height: 15px;
    top: 80%;
    left: 30%;
    animation-duration: 15s;
  }
  
  .particle:nth-child(4) {
    width: 25px;
    height: 25px;
    top: 40%;
    left: 50%;
    animation-duration: 30s;
  }
  
  .particle:nth-child(5) {
    width: 10px;
    height: 10px;
    top: 70%;
    left: 20%;
    animation-duration: 18s;
  }
  
  /* Hero Section */
  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 100px 5% 150px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    position: relative;
    overflow: hidden;
    min-height: 90vh;
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
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
  }
  
  .typing-cursor {
    animation: blink 1s infinite;
    color: #38b6ff;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 2.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
    line-height: 1.6;
  }
  
  .hero-cta {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
  }
  
  .cta-button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    outline: none;
  }
  
  .cta-button i {
    font-size: 1rem;
  }
  
  .cta-button.primary {
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    color: white;
  }
  
  .cta-button.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(56, 182, 255, 0.3), 0 4px 6px -2px rgba(108, 99, 255, 0.2);
  }
  
  .cta-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .cta-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .cta-button.ghost {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .cta-button.ghost:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .cta-button.large {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
  
  .hero-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .stat-item {
    text-align: center;
    flex: 1;
  }
  
  .stat-number {
    font-size: 2rem;
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
    transition: transform 0.5s ease;
  }
  
  .hero-image:hover .dashboard-image {
    transform: perspective(1000px) rotateY(-5deg);
  }
  
  .floating-card {
    position: absolute;
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    animation: float 6s ease-in-out infinite;
    transition: all 0.3s ease;
    z-index: 2;
  }
  
  .skill-card {
    top: -20px;
    right: -30px;
    width: 220px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .progress-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: conic-gradient(#6c63ff calc(var(--progress) * 1%), #f1f1f1 0%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .progress-circle span {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a1a2e;
  }
  
  .skill-info {
    flex: 1;
  }
  
  .skill-info h4 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .skill-info p {
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 0.5rem;
  }
  
  .skill-chart {
    height: 4px;
    background: #f1f5f9;
    border-radius: 2px;
    overflow: hidden;
  }
  
  .chart-bar {
    height: 100%;
    width: var(--progress);
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    border-radius: 2px;
  }
  
  .project-card {
    bottom: -30px;
    left: -40px;
    width: 280px;
    display: flex;
    gap: 1rem;
  }
  
  .project-thumbnail {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .project-info {
    flex: 1;
  }
  
  .project-info h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }
  
  .tech-badge {
    background: #f1f5f9;
    color: #334155;
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .tech-badge i {
    font-size: 0.8rem;
  }
  
  .project-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .action-btn {
    background: #f1f5f9;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .action-btn:hover {
    background: #e2e8f0;
  }
  
  .action-btn i {
    font-size: 0.7rem;
  }
  
  /* Trusted By Section */
  .trusted-by {
    padding: 4rem 5%;
    background: white;
    text-align: center;
  }
  
  .trusted-by-label {
    color: #64748b;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .companies-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .company-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 2.5rem;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .company-logo span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #334155;
  }
  
  /* Features Section */
  .features {
    padding: 100px 5%;
    background: #f8fafc;
    position: relative;
  }
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  .highlight {
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .section-subtitle {
    text-align: center;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto 3rem;
    font-size: 1.1rem;
    line-height: 1.6;
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
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  
  .feature-icon i {
    font-size: 1.5rem;
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
    margin-bottom: 1.5rem;
  }
  
  .feature-preview {
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 1.5rem;
    position: relative;
  }
  
  .feature-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .feature-card:hover .feature-preview img {
    transform: scale(1.05);
  }
  
  .feature-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #38b6ff;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  /* Interactive Demo Section */
  .interactive-demo {
    padding: 100px 5%;
    background: white;
    position: relative;
    overflow: hidden;
  }
  
  .demo-container {
    max-width: 1200px;
    margin: 0 auto;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px;
    padding: 3rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  }
  
  .demo-content {
    text-align: center;
  }
  
  .demo-content h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .demo-content p {
    color: #64748b;
    max-width: 600px;
    margin: 0 auto 2rem;
  }
  
  .demo-selector {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .demo-selector button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    background: white;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }
  
  .demo-selector button:hover {
    border-color: #cbd5e1;
  }
  
  .demo-selector button.active {
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    color: white;
    border-color: transparent;
  }
  
  .demo-selector button i {
    font-size: 1rem;
  }
  
  .demo-display {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
    min-height: 300px;
  }
  
  .demo-skill-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .skill-meter {
    width: 100%;
  }
  
  .skill-name {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }
  
  .skill-bar {
    height: 10px;
    background: #f1f5f9;
    border-radius: 5px;
    position: relative;
    margin-bottom: 0.5rem;
  }
  
  .skill-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    border-radius: 5px;
    transition: width 1s ease;
  }
  
  .skill-level {
    font-size: 0.8rem;
    color: #64748b;
    text-align: right;
  }
  
  .demo-project-showcase {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .project-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .project-header h4 {
    font-size: 1.1rem;
    color: #1e293b;
  }
  
  .project-stars {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #64748b;
    font-size: 0.9rem;
  }
  
  .project-stars i {
    color: #f59e0b;
  }
  
  .project-description {
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .project-tech span {
    background: #f1f5f9;
    color: #334155;
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .project-tech i {
    font-size: 0.8rem;
  }
  
  .demo-achievements {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .badge {
    display: flex;
    gap: 1rem;
    align-items: center;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .badge:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .badge-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .badge-icon i {
    font-size: 1.5rem;
    color: white;
  }
  
  .badge-info h5 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
    color: #1e293b;
  }
  
  .badge-info p {
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.4;
  }
  
  /* Testimonials */
  .testimonials {
    padding: 100px 5%;
    background: #f8fafc;
    position: relative;
    overflow: hidden;
  }
  
  .testimonials-slider {
    display: flex;
    gap: 2rem;
    padding: 2rem 0;
    max-width: 1200px;
    margin: 0 auto;
    overflow-x: hidden;
    position: relative;
    scroll-behavior: smooth;
  }
  
  .testimonial-card {
    min-width: 400px;
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: transform 0.5s ease;
    flex-shrink: 0;
  }
  
  .testimonial-content {
    position: relative;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 12px;
    margin-bottom: 1.5rem;
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
  
  .quote-icon i {
    color: white;
    font-size: 0.8rem;
  }
  
  .testimonial-content p {
    font-style: italic;
    color: #334155;
    line-height: 1.6;
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
    flex-shrink: 0;
  }
  
  .author-info h4 {
    color: #1e293b;
    margin-bottom: 0.25rem;
  }
  
  .author-info p {
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  .author-rating {
    display: flex;
    gap: 0.1rem;
  }
  
  .author-rating i {
    font-size: 0.9rem;
    color: #cbd5e1;
  }
  
  .author-rating i.filled {
    color: #f59e0b;
  }
  
  .testimonial-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .control-btn:hover {
    background: #f1f5f9;
  }
  
  .testimonial-dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .testimonial-dots span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #cbd5e1;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .testimonial-dots span.active {
    background: #38b6ff;
    transform: scale(1.2);
  }
  
  /* Tech Stack Section */
  .tech-stack-section {
    padding: 100px 5%;
    background: white;
  }
  
  .tech-categories {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .category {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  
  .category h3 {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    color: #1e293b;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0;
  }
  
  .category h3:hover {
    background: #f8fafc;
  }
  
  .category h3 i:first-child {
    margin-right: 0.5rem;
    color: #38b6ff;
  }
  
  .tech-list {
    padding: 0 1.5rem 1.5rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .tech-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .tech-item:hover {
    background: #f8fafc;
  }
  
  .tech-item i {
    width: 30px;
    height: 30px;
    background: #f1f5f9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #38b6ff;
    font-size: 1rem;
  }
  
  .tech-item span {
    font-size: 0.9rem;
    color: #334155;
  }
  
  /* CTA Section */
  .cta-section {
    padding: 100px 5%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .cta-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .cta-section p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .cta-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(56, 182, 255, 0.1);
  }
  
  .decoration-circle:nth-child(1) {
    width: 300px;
    height: 300px;
    top: -100px;
    left: -100px;
  }
  
  .decoration-circle:nth-child(2) {
    width: 200px;
    height: 200px;
    bottom: -50px;
    right: -50px;
  }
  
  .decoration-circle:nth-child(3) {
    width: 150px;
    height: 150px;
    top: 50%;
    right: 20%;
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
    border-radius: 16px;
    width: 100%;
    max-width: 450px;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: modalFadeIn 0.3s ease-out;
  }
  
  .close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    transition: color 0.3s ease;
  }
  
  .close-modal:hover {
    color: #1e293b;
  }
  
  .close-modal i {
    font-size: 1.25rem;
  }
  
  /* Floating Action Button */
  .fab {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    z-index: 100;
    transition: all 0.3s ease;
  }
  
  .fab:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 20px -3px rgba(0, 0, 0, 0.4);
  }
  
  .fab i {
    font-size: 1.5rem;
  }
  
  /* Scroll Progress Indicator */
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, #38b6ff 0%, #6c63ff 100%);
    z-index: 100;
    transition: width 0.1s ease;
  }
  
  /* Animations */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(56, 182, 255, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(56, 182, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(56, 182, 255, 0); }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .hero {
      flex-direction: column;
      text-align: center;
      padding-bottom: 80px;
    }
    
    .hero-content {
      margin-bottom: 3rem;
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
    
    .testimonial-card {
      min-width: 350px;
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
    
    .demo-selector {
      flex-direction: column;
      align-items: center;
    }
    
    .demo-selector button {
      width: 100%;
      max-width: 300px;
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
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
    
    .hero-cta {
      flex-direction: column;
      gap: 1rem;
    }
    
    .hero-stats {
      flex-direction: column;
      gap: 1rem;
    }
    
    .testimonial-card {
      min-width: 280px;
    }
    
    .tech-categories {
      grid-template-columns: 1fr;
    }
  }
  </style>