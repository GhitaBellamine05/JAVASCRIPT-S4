<template>
    <div class="skills-chart-container">
      <h3>My Skills Distribution</h3>
      
      <div v-if="loading" class="loading-message">
        <div class="spinner"></div>
        Loading skills data...
      </div>
      
      <div v-else-if="error" class="error-message">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>
      
      <div v-else-if="skills.length === 0" class="no-data-message">
        <span class="info-icon">ℹ️</span>
        No skills data available to display
      </div>
      
      <div v-else class="chart-content">
        <div class="chart-wrapper">
          <canvas ref="skillsChart"></canvas>
        </div>
        <div class="chart-legend">
          <div v-for="(skill, index) in skills" :key="skill.id" class="legend-item">
            <span class="legend-color" :style="{ backgroundColor: colors[index % colors.length] }"></span>
            <span>{{ skill.name }} ({{ getSkillLevel(skill.level) }}%)</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Chart, PolarAreaController, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  // Register required Chart.js components
  Chart.register(PolarAreaController, RadialLinearScale, ArcElement, Tooltip, Legend);
  
  export default {
    name: 'SkillsPolarChart',
    data() {
      return {
        skills: [],
        chart: null,
        loading: true,
        error: null,
        colors: [
          '#3498db', '#2ecc71', '#9b59b6', '#f1c40f',
          '#e67e22', '#e74c3c', '#1abc9c', '#2980b9'
        ]
      };
    },
    async mounted() {
      await this.initializeChart();
    },
    beforeUnmount() {
      if (this.chart) this.chart.destroy();
    },
    methods: {
      async initializeChart() {
        this.loading = true;
        this.error = null;
        
        try {
          await this.loadSkills();
          if (this.skills.length > 0) {
            this.initChart();
          } else {
            this.error = 'No skills data available';
          }
        } catch (e) {
          console.error('Chart error:', e);
          this.error = 'Failed to load skills data';
        } finally {
          this.loading = false;
        }
      },
      
      async loadSkills() {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required');
        
        const db = getFirestore();
        const skillsCol = collection(db, 'users', user.uid, 'skills');
        const snapshot = await getDocs(skillsCol);
        this.skills = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      },
      
      getSkillLevel(level) {
        const levels = {
          'Beginner': 25,
          'Intermediate': 50,
          'Advanced': 75,
          'Expert': 100
        };
        return levels[level] || parseInt(level) || 50;
      },
      
      initChart() {
        const canvas = this.$refs.skillsChart;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        if (this.chart) this.chart.destroy();
        
        this.chart = new Chart(ctx, {
          type: 'polarArea',
          data: {
            labels: this.skills.map(s => s.name),
            datasets: [{
              data: this.skills.map(s => this.getSkillLevel(s.level)),
              backgroundColor: this.colors,
              borderColor: '#fff',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  display: false
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw}%`
                }
              }
            },
            animation: {
              animateRotate: true,
              animateScale: true
            }
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Keep all your existing CSS styles from previous implementations */
  .skills-chart-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0ecff;
    min-height: 400px;
    display: flex;
    flex-direction: column;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 1.2rem;
    text-align: center;
  }
  
  .chart-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .chart-wrapper {
    position: relative;
    height: 300px;
    margin: 0 auto;
    width: 100%;
    max-width: 400px;
  }
  
  .chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background-color: #f8fafc;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
  }
  
  .loading-message,
  .error-message,
  .no-data-message {
    text-align: center;
    padding: 40px;
    color: #666;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    gap: 15px;
  }
  
  .error-message {
    color: #e74c3c;
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #3498db;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  
  .error-icon,
  .info-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .chart-wrapper {
      height: 250px;
    }
    
    .skills-chart-container {
      min-height: 350px;
    }
  }
  </style>