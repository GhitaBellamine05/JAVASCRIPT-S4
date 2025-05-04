<template>
  <div class="home-container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-logo">
          <span class="gradient-text"><i class="fas fa-code mr-2"></i>DevGate</span>
        </div>
        <div class="navbar-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/features" class="nav-link">Features</router-link>
          <router-link to="/community" class="nav-link">Community</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
        </div>
        <div class="navbar-auth">
          <router-link to="/login" class="btn btn-login">Log In</router-link>
          <router-link to="/signup" class="btn btn-signup">Sign Up</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="animated-bg bg-1"></div>
      <div class="animated-bg bg-2"></div>
      
      <div class="hero-content">
        <h1 class="hero-title">
          <span>Track Your Growth as a</span>
          <span class="gradient-text">Developer</span>
        </h1>
        <p class="hero-subtitle">
          Showcase your skills, track your progress, and connect with other developers 
          in a social network designed specifically for technical growth.
        </p>
        <div class="hero-buttons">
          <router-link to="/signup" class="btn btn-primary">Get Started</router-link>
          <a href="#" class="btn btn-secondary" @click.prevent="showDemo">
            <i class="fas fa-play-circle"></i> Watch Demo
          </a>
        </div>
      </div>
    </section>

    <!-- Dashboard Preview -->
    <section class="preview-section">
      <div class="dashboard-preview">
        <img src="@/assets/logo.png" alt="DevGate Dashboard Preview" class="preview-image">
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="gradient-text">Track Your Journey</h2>
        <p>Everything you need to showcase your growth as a developer.</p>
      </div>
      
      <div class="features-grid">
        <!-- Feature Cards -->
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="section-header">
        <h2 class="gradient-text">What Developers Say</h2>
        <p>Join thousands of developers tracking their professional growth</p>
      </div>
      
      <div class="testimonials-carousel">
        <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
          <div class="testimonial-content">
            <p>"{{ testimonial.content }}"</p>
          </div>
          <div class="testimonial-author">
            <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar">
            <div class="author-info">
              <h4>{{ testimonial.name }}</h4>
              <p>{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="gradient-text">Ready to track your developer journey?</h2>
        <p>Join DevGate today and start showcasing your skills and projects.</p>
        <router-link to="/signup" class="btn btn-primary">Sign Up Now</router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span class="gradient-text">DevGate</span>
          <p>Where developers grow together.</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h3>Product</h3>
            <router-link to="/features">Features</router-link>
            <router-link to="/pricing">Pricing</router-link>
            <router-link to="/faq">FAQ</router-link>
          </div>
          <div class="footer-column">
            <h3>Company</h3>
            <router-link to="/about">About Us</router-link>
            <router-link to="/contact">Contact</router-link>
            <router-link to="/careers">Careers</router-link>
          </div>
          <div class="footer-column">
            <h3>Resources</h3>
            <router-link to="/blog">Blog</router-link>
            <router-link to="/documentation">Documentation</router-link>
            <router-link to="/community">Community</router-link>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} DevGate. All rights reserved.</p>
        <div class="social-links">
          <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
          <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      features: [
        {
          icon: 'fas fa-chart-line',
          title: 'Skill Tracking',
          description: 'Track your skills progress over time with detailed analytics and visualization tools.'
        },
        {
          icon: 'fas fa-project-diagram',
          title: 'Project Showcase',
          description: 'Create a stunning portfolio of your projects with images, descriptions, and technologies used.'
        },
        {
          icon: 'fas fa-code-branch',
          title: 'GitHub Integration',
          description: 'Connect your GitHub account to automatically import and showcase your repositories.'
        },
        {
          icon: 'fas fa-tasks',
          title: 'Learning Objectives',
          description: 'Set and track learning goals with progress indicators and achievement milestones.'
        },
        {
          icon: 'fas fa-history',
          title: 'Timeline Activity',
          description: 'Visualize your development journey with an interactive timeline of your progress.'
        },
        {
          icon: 'fas fa-users',
          title: 'Developer Community',
          description: 'Connect with other developers, share knowledge, and collaborate on projects.'
        }
      ],
      testimonials: [
        {
          content: 'DevGate has completely transformed how I track my progress as a developer. The skill visualization tools give me clear insights into my growth areas.',
          name: 'Sarah Chen',
          role: 'Full Stack Developer',
          avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Sarah'
        },
        {
          content: 'As a self-taught developer, DevGate helps me organize my learning path and showcase my projects in a professional way. It\'s the perfect platform for career growth.',
          name: 'Marcus Johnson',
          role: 'Frontend Developer',
          avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Marcus'
        },
        {
          content: 'The project showcase feature has helped me land freelance gigs by providing a centralized portfolio that highlights my technical skills.',
          name: 'Priya Sharma',
          role: 'Software Engineer',
          avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Priya'
        }
      ]
    }
  },
  methods: {
    showDemo() {
      // Implement demo modal or video playback
      alert('Demo feature will be implemented soon!');
    }
  }
}
</script>

<style scoped>
/* Importing Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Base Styles */
.home-container {
  font-family: 'Poppins', sans-serif;
  background-color: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  overflow-x: hidden;
}

.gradient-text {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navbar Styles */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
}

.navbar-links {
  display: none;
}

.nav-link {
  margin: 0 1rem;
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-login {
  background-color: #1e293b;
  color: #e2e8f0;
  margin-right: 0.5rem;
}

.btn-signup,
.btn-primary {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  color: white;
}

.btn-secondary {
  background-color: #1e293b;
  color: #3b82f6;
  display: flex;
  align-items: center;
}

.btn-secondary i {
  margin-right: 0.5rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 8rem 1rem 4rem;
  text-align: center;
  overflow: hidden;
}

.animated-bg {
  position: absolute;
  width: 40rem;
  height: 40rem;
  border-radius: 50%;
  z-index: -1;
  opacity: 0.6;
}

.bg-1 {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(0, 0, 0, 0) 70%);
  top: 0;
  left: -10rem;
  animation: pulse 8s infinite alternate;
}

.bg-2 {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(0, 0, 0, 0) 70%);
  bottom: -20rem;
  right: -10rem;
  animation: pulse 8s infinite alternate-reverse;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 0.8; }
}

.hero-content {
  max-width: 48rem;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-title span {
  display: block;
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #94a3b8;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Preview Section */
.preview-section {
  padding: 2rem 1rem 4rem;
}

.dashboard-preview {
  max-width: 64rem;
  margin: 0 auto;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.preview-image {
  width: 100%;
  display: block;
}

/* Features Section */
.features-section {
  background-color: rgba(15, 23, 42, 0.5);
  padding: 4rem 1rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.section-header p {
  font-size: 1.125rem;
  color: #94a3b8;
  max-width: 36rem;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 64rem;
  margin: 0 auto;
}

.feature-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #94a3b8;
  line-height: 1.5;
}

/* Testimonials Section */
.testimonials-section {
  padding: 4rem 1rem;
}

.testimonials-carousel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 64rem;
  margin: 0 auto;
}

.testimonial-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
}

.testimonial-content {
  margin-bottom: 1.5rem;
  font-style: italic;
  color: #cbd5e1;
}

.testimonial-author {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.author-info h4 {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.author-info p {
  color: #94a3b8;
  font-size: 0.875rem;
}

/* CTA Section */
.cta-section {
  padding: 4rem 1rem;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(30, 41, 59, 0.6) 100%);
}

.cta-content {
  text-align: center;
  max-width: 36rem;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  color: #94a3b8;
  margin-bottom: 2rem;
}

/* Footer */
.footer {
  background-color: #0f172a;
  border-top: 1px solid rgba(100, 116, 139, 0.2);
  padding: 4rem 1rem 2rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 64rem;
  margin: 0 auto;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.footer-logo p {
  font-size: 0.875rem;
  color: #94a3b8;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 2rem;
}

.footer-column h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-column a {
  display: block;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #3b82f6;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  max-width: 64rem;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(100, 116, 139, 0.2);
  color: #64748b;
  font-size: 0.875rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #1e293b;
  color: #94a3b8;
  font-size: 1.125rem;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background-color: #3b82f6;
  color: white;
}

/* Responsive Styles */
@media (min-width: 640px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

@media (min-width: 768px) {
  .navbar-links {
    display: flex;
  }
  
  .hero-title {
    font-size: 3.5rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .testimonials-carousel {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .testimonial-card {
    flex: 0 0 calc(50% - 1rem);
  }
  
  .footer-bottom {
    flex-direction: row;
  }
  
  .social-links {
    margin-top: 0;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 4rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>