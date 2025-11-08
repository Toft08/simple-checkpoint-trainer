/**
 * Essential State Management Utilities
 * Core helper functions for working with the StateManager
 */

/**
 * Base component class that provides state management capabilities
 * Extend this class to automatically get state subscription methods
 */
class StateComponent {
    constructor(componentName = 'component') {
        this.componentName = componentName;
        this.subscriptions = [];
    }

    /**
     * Subscribe to state changes with automatic cleanup
     */
    onStateChange(callback, path = null) {
        const subscription = state.subscribe(callback, path);
        this.subscriptions.push(subscription);
        return subscription;
    }

    /**
     * Dispatch an action to update state
     */
    dispatch(action) {
        return state.dispatch(action);
    }

    /**
     * Get current state or specific path
     */
    getState(path = null) {
        return state.getState(path);
    }

    /**
     * Clean up subscriptions when component is destroyed
     */
    unmount() {
        this.subscriptions.forEach(unsubscribe => unsubscribe());
        this.subscriptions = [];
    }

    /**
     * Override in subclasses to define mounting behavior
     */
    mount() {
        // Override in subclasses
    }
}

/**
 * Pre-built actions for common operations
 */
const Actions = {
    // Configuration
    setConfig: (config) => ({ type: 'SET_CONFIG', payload: config }),

    // Exercise navigation
    setCurrentExercise: (index, exercise) => ({ 
        type: 'SET_CURRENT_EXERCISE', 
        payload: { index, exercise } 
    }),
    nextExercise: () => ({ type: 'NEXT_EXERCISE' }),
    prevExercise: () => ({ type: 'PREV_EXERCISE' }),

    // Exercise caching
    cacheExercise: (index, exercise) => ({ 
        type: 'CACHE_EXERCISE', 
        payload: { index, exercise } 
    }),

    // User answers
    setUserAnswer: (index, isCorrect) => ({ 
        type: 'SET_USER_ANSWER', 
        payload: { index, isCorrect } 
    }),

    // Progress tracking
    updateProgress: (current, total) => ({ 
        type: 'UPDATE_PROGRESS', 
        payload: { current, total } 
    }),

    // UI state
    setLoading: (loading) => ({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => ({ type: 'SET_ERROR', payload: error }),
    showReadme: () => ({ type: 'SHOW_README' }),
    hideReadme: () => ({ type: 'HIDE_README' }),

    // Generic state update
    setState: (updates, type = 'SET_STATE') => ({ type, payload: updates })
};

/**
 * Selectors for common state queries
 */
const Selectors = {
    // Config
    getConfig: () => state.getState('config'),
    getTasks: () => state.getState('config.tasks'),

    // Current exercise
    getCurrentExercise: () => state.getState('currentExercise'),
    getCurrentExerciseIndex: () => state.getState('currentExerciseIndex'),
    
    // Cache
    getExerciseCache: () => state.getState('exerciseCache'),
    getCachedExercise: (index) => {
        const cache = state.getState('exerciseCache');
        return cache ? cache[index] : null;
    },

    // Progress
    getProgress: () => state.getState('progress'),
    getUserAnswers: () => state.getState('userAnswers'),

    // Navigation helpers
    canGoNext: () => {
        const currentIndex = state.getState('currentExerciseIndex');
        const totalTasks = state.getState('config.tasks');
        const userAnswers = state.getState('userAnswers');
        return currentIndex < totalTasks - 1 && userAnswers && userAnswers[currentIndex];
    },

    canGoPrev: () => {
        const currentIndex = state.getState('currentExerciseIndex');
        return currentIndex > 0;
    }
};

/**
 * Simple development tools
 */
const DevTools = {
    logState() {
        console.log('🔍 Current State:', state.getState());
        return state.getState();
    },

    getHistory() {
        return state.history || [];
    },

    reset() {
        console.log('🔄 Resetting state');
        state.setState(state.initialState, 'DEV_RESET');
    }
};