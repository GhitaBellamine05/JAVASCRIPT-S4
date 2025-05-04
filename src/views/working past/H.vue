<template>
    <div class="home">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">Elevate</span> Your Developer Journey
          </h1>
          <p class="hero-subtitle">
            Track, showcase, and grow your technical skills with the ultimate developer portfolio platform
          </p>
          <div class="hero-cta">
            <button @click="showAuthModal('signup')" class="cta-button primary">
              Start For Free
            </button>
            <button @click="scrollToFeatures" class="cta-button secondary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-.53 14.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V8.25a.75.75 0 00-1.5 0v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clip-rule="evenodd" />
              </svg>
              See How It Works
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">10,000+</div>
              <div class="stat-label">Developers</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50,000+</div>
              <div class="stat-label">Projects</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100+</div>
              <div class="stat-label">Tech Skills</div>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
               alt="Developer dashboard" 
               class="dashboard-image">
          <div class="floating-card skill-card">
            <div class="skill-progress">
              <div class="progress-circle" style="--progress: 85">
                <span>85%</span>
              </div>
            </div>
            <div class="skill-info">
              <h4>React.js</h4>
              <p>Advanced Level</p>
            </div>
          </div>
          <div class="floating-card project-card">
            <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                 alt="Project thumbnail" 
                 class="project-thumbnail">
            <div class="project-info">
              <h4>E-commerce Platform</h4>
              <div class="tech-stack">
                <span class="tech-badge">React</span>
                <span class="tech-badge">Node.js</span>
                <span class="tech-badge">MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Trusted By Section -->
      <section class="trusted-by">
        <p class="trusted-by-label">Trusted by developers at</p>
        <div class="companies-grid">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_AWS_logo.svg/1280px-Amazon_AWS_logo.svg.png" alt="AWS">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1280px-Microsoft_logo.svg.png" alt="Microsoft">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png" alt="Samsung">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1280px-IBM_logo.svg.png" alt="IBM">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/SAP-Logo.svg/1280px-SAP-Logo.svg.png" alt="SAP">
        </div>
      </section>
  
      <!-- Features Section -->
      <section ref="features" class="features">
        <h2 class="section-title">
          <span class="highlight">Why</span> DevGate?
        </h2>
        <p class="section-subtitle">Everything you need to showcase your developer journey</p>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3>Skill Analytics</h3>
            <p>Visualize your progress with beautiful charts and track your growth across all technologies.</p>
            <div class="feature-preview">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                   alt="Skill analytics preview">
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
              </svg>
            </div>
            <h3>Project Showcase</h3>
            <p>Display your best work with beautiful project cards, tech stack visualization, and live demos.</p>
            <div class="feature-preview">
              <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                   alt="Project showcase preview">
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3>Community Support</h3>
            <p>Connect with other developers, get feedback, and find collaborators for your next project.</p>
            <div class="feature-preview">
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                   alt="Community preview">
            </div>
          </div>
        </div>
      </section>
  
      <!-- Testimonials -->
      <section class="testimonials">
        <h2 class="section-title">
          What <span class="highlight">Developers</span> Say
        </h2>
        
        <div class="testimonials-slider">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <div class="quote-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z" clip-rule="evenodd" />
                </svg>
              </div>
              <p>DevGate helped me organize my learning path and land my first developer job! The skill tracking kept me motivated and the project showcase was perfect for my portfolio.</p>
            </div>
            <div class="testimonial-author">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                   alt="Sarah K." 
                   class="author-avatar">
              <div class="author-info">
                <h4>Sarah K.</h4>
                <p>Frontend Developer @ TechCorp</p>
                <div class="author-rating">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <div class="quote-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z" clip-rule="evenodd" />
                </svg>
              </div>
              <p>As a hiring manager, I love when candidates share their DevGate profiles. The skill visualization helps me quickly understand their strengths and growth areas.</p>
            </div>
            <div class="testimonial-author">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                   alt="Miguel R." 
                   class="author-avatar">
              <div class="author-info">
                <h4>Miguel R.</h4>
                <p>Engineering Manager @ DevSolutions</p>
                <div class="author-rating">
                  ★★★★★
                </div>
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
          <button @click="showAuthModal('signup')" class="cta-button primary large">
            Get Started - It's Free
          </button>
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
        </svg>
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
  
  export default {
    name: 'HomeView',
    components: {
      AuthForm
    },
    data() {
      return {
        showModal: false,
        authMode: 'login' // 'login' or 'signup'
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
    // Redirect or update UI after successful auth
    this.closeModal();
    this.$router.push('/dash');
  },
  handleAuthError(error) {
    console.error('Authentication error:', error);
  },
  toggleAuthMode() {
    this.authMode = this.authMode === 'login' ? 'signup' : 'login';
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
    position: relative;
  }
  
  .hero-title {
    font-size: 3.5rem;
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
    font-size: 1.5rem;
    margin-bottom: 2.5rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
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
  }
  
  .cta-button svg {
    width: 20px;
    height: 20px;
  }
  
  .cta-button.primary {
    background: linear-gradient(135deg, #38b6ff 0%, #6c63ff 100%);
    color: white;
    border: none;
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
  
  .hero-stats {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .stat-item {
    text-align: center;
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
  }
  
  .skill-card {
    top: -20px;
    right: -30px;
    width: 180px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .progress-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: conic-gradient(#6c63ff calc(var(--progress) * 1%), #f1f1f1 0%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .progress-circle span {
    font-size: 0.75rem;
    font-weight: 600;
    color: #1a1a2e;
  }
  
  .skill-info h4 {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  .skill-info p {
    font-size: 0.75rem;
    color: #64748b;
  }
  
  .project-card {
    bottom: -30px;
    left: -40px;
    width: 220px;
    display: flex;
    gap: 1rem;
  }
  
  .project-thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .project-info h4 {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
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
  }
  
  /* Trusted By Section */
  .trusted-by {
    padding: 3rem 5%;
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
  
  .companies-grid img {
    height: 30px;
    opacity: 0.7;
    filter: grayscale(100%);
    transition: all 0.3s ease;
  }
  
  .companies-grid img:hover {
    opacity: 1;
    filter: grayscale(0%);
  }
  
  /* Features Section */
  .features {
    padding: 100px 5%;
    background: #f8fafc;
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
    transition: transform 0.3s ease, box-shadow 0.3s ease;
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
    margin-bottom: 1.5rem;
  }
  
  .feature-preview {
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 1.5rem;
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
  
  /* Testimonials */
  .testimonials {
    padding: 100px 5%;
    background: white;
  }
  
  .testimonials-slider {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    padding: 2rem 0;
    scroll-snap-type: x mandatory;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .testimonial-card {
    min-width: 400px;
    background: white;
    padding: 2rem;
    border-radius: 16px;
    scroll-snap-align: start;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
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
  
  .quote-icon svg {
    width: 16px;
    height: 16px;
    color: white;
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
    color: #f59e0b;
    font-size: 0.9rem;
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
  
  .cta-button.large {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
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
  
  .close-modal svg {
    width: 24px;
    height: 24px;
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
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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
      min-width: 300px;
    }
    
    .cta-section h2 {
      font-size: 2rem;
    }
    
    .cta-section p {
      font-size: 1rem;
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
  }
  </style>