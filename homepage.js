// Homepage Configuration Logic
class ConfigManager {
    constructor() {
        this.config = {
            tasks: 5,
            levels: ['g1', 'g2'],
            difficulty: 0.5
        };
        
        this.init();
    }
    
    init() {
        this.setupTaskToggle();
        this.setupLevelCheckboxes();
        this.setupDifficultySelector();
        this.setupStartButton();
        this.updateSummary();
    }
    
    setupTaskToggle() {
        const taskButtons = document.querySelectorAll('[data-tasks]');
        taskButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all
                taskButtons.forEach(b => b.classList.remove('active'));
                // Add active to clicked
                btn.classList.add('active');
                // Update config
                this.config.tasks = parseInt(btn.dataset.tasks);
                this.updateSummary();
            });
        });
    }
    
    setupLevelCheckboxes() {
        const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.config.levels = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                this.updateSummary();
            });
        });
    }
    
    setupDifficultySelector() {
        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        difficultyOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active from all
                difficultyOptions.forEach(o => o.classList.remove('active'));
                // Add active to clicked
                option.classList.add('active');
                // Update config
                this.config.difficulty = parseFloat(option.dataset.difficulty);
                this.updateSummary();
            });
        });
    }
    
    setupStartButton() {
        const startBtn = document.getElementById('start-training');
        startBtn.addEventListener('click', () => {
            this.startTrainingSession();
        });
    }
    
    updateSummary() {
        const summary = document.getElementById('session-summary');
        const levelNames = this.config.levels.map(level => level.toUpperCase()).join(', ');
        const difficultyName = this.getDifficultyName(this.config.difficulty);
        
        if (this.config.levels.length === 0) {
            summary.textContent = 'Please select at least one level';
            summary.style.color = '#e53e3e';
            document.getElementById('start-training').disabled = true;
        } else {
            summary.textContent = `${this.config.tasks} tasks • ${levelNames} levels • ${difficultyName} difficulty`;
            summary.style.color = '';
            document.getElementById('start-training').disabled = false;
        }
    }
    
    getDifficultyName(difficulty) {
        switch (difficulty) {
            case 0.25: return 'Easy';
            case 0.5: return 'Medium';
            case 0.75: return 'Hard';
            default: return 'Medium';
        }
    }
    
    startTrainingSession() {
        if (this.config.levels.length === 0) {
            alert('Please select at least one level!');
            return;
        }
        
        // Store configuration in localStorage
        localStorage.setItem('trainingConfig', JSON.stringify(this.config));
        
        // Add some visual feedback
        const startBtn = document.getElementById('start-training');
        const originalText = startBtn.textContent;
        startBtn.textContent = '🚀 Loading...';
        startBtn.disabled = true;
        
        // Simulate loading and redirect
        setTimeout(() => {
            window.location.href = 'trainer.html';
        }, 800);
    }
    
    // Method to get configuration (used by main app)
    static getStoredConfig() {
        const stored = localStorage.getItem('trainingConfig');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default configuration
        return {
            tasks: 5,
            levels: ['g1', 'g2'],
            difficulty: 0.5
        };
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ConfigManager();
    
    // Add some fun animations
    addLoadAnimations();
});

function addLoadAnimations() {
    // Animate hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroStats = document.querySelector('.hero-stats');
    const configCard = document.querySelector('.config-card');
    
    // Stagger animations
    setTimeout(() => {
        if (heroTitle) heroTitle.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        if (heroSubtitle) heroSubtitle.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
        if (heroStats) heroStats.style.opacity = '1';
    }, 500);
    
    setTimeout(() => {
        if (configCard) {
            configCard.style.opacity = '1';
            configCard.style.transform = 'translateY(0)';
        }
    }, 700);
    
    // Animate feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 900 + (index * 100));
    });
}

// Add some initial styles for animations
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .hero-title, .hero-subtitle, .hero-stats {
            opacity: 0;
            transition: opacity 0.6s ease;
        }
        
        .config-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .feature-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
    `;
    document.head.appendChild(style);
});