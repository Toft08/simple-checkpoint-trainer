// Simple but powerful state manager for Java Checkpoint Trainer
// Inspired by Redux/NgRx but lightweight and framework-agnostic

class StateManager {
    constructor(initialState = {}) {
        this.state = { ...initialState };
        this.listeners = new Map(); // Component ID -> callback functions
        this.history = []; // For debugging and time travel
        this.maxHistory = 50;
        
        // Enable debugging in development
        this.debug = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (this.debug) {
            window.__STATE_MANAGER__ = this; // Global access for debugging
            console.log('🚀 StateManager initialized:', this.state);
        }
    }

    // Subscribe to state changes
    subscribe(componentId, callback) {
        if (!this.listeners.has(componentId)) {
            this.listeners.set(componentId, []);
        }
        this.listeners.get(componentId).push(callback);
        
        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(componentId) || [];
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }

    // Get current state or specific slice
    getState(path = null) {
        if (!path) return { ...this.state };
        
        // Support dot notation: 'user.preferences.theme'
        return path.split('.').reduce((obj, key) => obj?.[key], this.state);
    }

    // Update state with automatic notifications
    setState(updates, actionName = 'setState') {
        const prevState = { ...this.state };
        
        // Merge updates (supports nested updates)
        this.state = this.deepMerge(this.state, updates);
        
        // Add to history for debugging
        this.addToHistory(actionName, updates, prevState);
        
        // Notify all subscribers
        this.notifyListeners(prevState, this.state);
        
        if (this.debug) {
            console.log(`📡 ${actionName}:`, { updates, newState: this.state });
        }
    }

    // Dispatch actions (Redux-style)
    dispatch(action) {
        const { type, payload } = action;
        
        switch (type) {
            case 'SET_CONFIG':
                this.setState({ config: payload }, type);
                // Persist to localStorage
                localStorage.setItem('trainingConfig', JSON.stringify(payload));
                break;
                
            case 'SET_CURRENT_EXERCISE':
                this.setState({ 
                    currentExerciseIndex: payload.index,
                    currentExercise: payload.exercise 
                }, type);
                break;
                
            case 'UPDATE_PROGRESS':
                this.setState({ 
                    progress: {
                        current: payload.current,
                        total: payload.total,
                        percentage: (payload.current / payload.total) * 100
                    }
                }, type);
                break;
                
            case 'SET_USER_ANSWER':
                const answers = [...(this.state.userAnswers || [])];
                answers[payload.index] = payload.isCorrect;
                this.setState({ userAnswers: answers }, type);
                break;
                
            case 'CACHE_EXERCISE':
                const cache = [...(this.state.exerciseCache || [])];
                cache[payload.index] = payload.exercise;
                this.setState({ exerciseCache: cache }, type);
                break;
                
            case 'NEXT_EXERCISE':
                const currentNext = this.state.currentExerciseIndex;
                const totalNext = this.state.config?.tasks || 0;
                if (currentNext < totalNext - 1) {
                    this.setState({ currentExerciseIndex: currentNext + 1 }, type);
                }
                break;
                
            case 'PREV_EXERCISE':
                const currentPrev = this.state.currentExerciseIndex;
                if (currentPrev > 0) {
                    this.setState({ currentExerciseIndex: currentPrev - 1 }, type);
                }
                break;
                
            case 'SET_LOADING':
                this.setState({ ui: { ...this.state.ui, loading: payload } }, type);
                break;
                
            case 'SET_ERROR':
                this.setState({ ui: { ...this.state.ui, error: payload } }, type);
                break;
                
            case 'SHOW_README':
                this.setState({ ui: { ...this.state.ui, showReadme: true } }, type);
                break;
                
            case 'HIDE_README':
                this.setState({ ui: { ...this.state.ui, showReadme: false } }, type);
                break;
                
            case 'SET_STATE':
                this.setState(payload, type);
                break;
                
            case 'RESET_SESSION':
                this.setState({
                    currentExerciseIndex: 0,
                    userAnswers: [],
                    exerciseCache: [],
                    currentExercise: null
                }, type);
                break;
                
            default:
                console.warn(`Unknown action type: ${type}`);
        }
    }

    // Computed properties (like getters in Vuex)
    computed = {
        isFirstExercise: () => this.getState('currentExerciseIndex') === 0,
        isLastExercise: () => {
            const current = this.getState('currentExerciseIndex');
            const total = this.getState('config.tasks') || 0;
            return current >= total - 1;
        },
        canProceed: () => {
            const current = this.getState('currentExerciseIndex');
            const answers = this.getState('userAnswers') || [];
            return answers[current] === true;
        },
        sessionComplete: () => {
            const answers = this.getState('userAnswers') || [];
            const total = this.getState('config.tasks') || 0;
            return answers.filter(a => a === true).length === total;
        }
    };

    // Helper methods
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    notifyListeners(prevState, newState) {
        this.listeners.forEach((callbacks, componentId) => {
            callbacks.forEach(callback => {
                try {
                    callback(newState, prevState);
                } catch (error) {
                    console.error(`Error in ${componentId} state listener:`, error);
                }
            });
        });
    }

    addToHistory(action, updates, prevState) {
        this.history.push({
            timestamp: new Date().toISOString(),
            action,
            updates,
            prevState: { ...prevState },
            newState: { ...this.state }
        });
        
        // Keep history manageable
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    // Development helpers
    getHistory() {
        return this.history;
    }

    timeTravel(historyIndex) {
        if (historyIndex >= 0 && historyIndex < this.history.length) {
            this.state = { ...this.history[historyIndex].newState };
            this.notifyListeners({}, this.state);
        }
    }

    // Persistence helpers
    saveToStorage(key = 'appState') {
        try {
            localStorage.setItem(key, JSON.stringify(this.state));
        } catch (error) {
            console.error('Failed to save state to localStorage:', error);
        }
    }

    loadFromStorage(key = 'appState') {
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsedState = JSON.parse(stored);
                this.setState(parsedState, 'LOAD_FROM_STORAGE');
                return true;
            }
        } catch (error) {
            console.error('Failed to load state from localStorage:', error);
        }
        return false;
    }
}

// Global state manager instance
const state = new StateManager({
    // Initial state
    config: {
        tasks: 5,
        levels: ['g1', 'g2'],
        difficulty: 0.5
    },
    currentExerciseIndex: 0,
    currentExercise: null,
    exerciseCache: [],
    userAnswers: [],
    progress: {
        current: 1,
        total: 5,
        percentage: 20
    },
    ui: {
        showReadme: false,
        loading: false,
        error: null
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}