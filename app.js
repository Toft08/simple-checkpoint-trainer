// Java Trainer App - Minimal Working Version
console.log('🚀 Loading Java Trainer...');

// App state
let currentExerciseIndex = 0;
let userAnswers = [];
let loadedExercises = []; 
let exerciseGenerator = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM loaded, initializing...');
    
    try {
        // Get config
        const config = getStoredConfig();
        console.log('✅ Config loaded:', config);
        
        // Initialize exercise generator
        exerciseGenerator = new DynamicExerciseGenerator(config);
        console.log('✅ Exercise generator created');
        
        // Setup buttons
        setupEventListeners();
        
        // Load first exercise
        loadDynamicExercise(0);
        
        console.log('✅ App initialized');
        
    } catch (error) {
        console.error('❌ Error:', error);
        showError(error.message);
    }
});

// Get stored configuration
function getStoredConfig() {
    const stored = localStorage.getItem('trainingConfig');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        tasks: 5,
        levels: ['g1', 'g2'],
        difficulty: 0.5
    };
}

// Setup event listeners
function setupEventListeners() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const checkBtn = document.getElementById('check-btn');
    const readmeBtn = document.getElementById('readme-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const closeReadmeBtn = document.getElementById('close-readme');
    const restartBtn = document.getElementById('restart-btn');
    const homeBtn = document.getElementById('home-btn');
    
    if (prevBtn) prevBtn.addEventListener('click', showPreviousExercise);
    if (nextBtn) nextBtn.addEventListener('click', showNextExercise);
    if (checkBtn) checkBtn.addEventListener('click', checkAnswer);
    if (readmeBtn) readmeBtn.addEventListener('click', showReadme);
    if (regenerateBtn) regenerateBtn.addEventListener('click', regenerateExercise);
    if (closeReadmeBtn) closeReadmeBtn.addEventListener('click', hideReadme);
    if (restartBtn) restartBtn.addEventListener('click', restartTraining);
    if (homeBtn) homeBtn.addEventListener('click', goHome);
    
    // Close modal on overlay click
    const readmeModal = document.getElementById('readme-modal');
    if (readmeModal) {
        readmeModal.addEventListener('click', function(e) {
            if (e.target === readmeModal) {
                hideReadme();
            }
        });
    }
    
    console.log('✅ Event listeners setup');
}

// Load exercise dynamically
async function loadDynamicExercise(index) {
    console.log('📖 Loading exercise', index);
    
    try {
        if (!exerciseGenerator) return;
        
        const exerciseList = exerciseGenerator.getExerciseList();
        if (index >= exerciseList.length) return;
        
        // Load exercise if not cached
        if (!loadedExercises[index]) {
            const exerciseId = exerciseList[index].id;
            loadedExercises[index] = await exerciseGenerator.loadExercise(exerciseId);
            console.log('✅ Loaded:', loadedExercises[index].title);
        }
        
        // Display exercise
        displayExercise(loadedExercises[index], index);
        
    } catch (error) {
        console.error('❌ Load error:', error);
        showError('Failed to load exercise: ' + error.message);
    }
}

// Display exercise content
function displayExercise(exercise, index) {
    if (!exercise) return;
    
    currentExerciseIndex = index;
    const container = document.getElementById('exercise-container');
    if (!container) return;
    
    console.log('🎨 Displaying:', exercise.title);
    
    // Create HTML
    const html = 
        '<div class="level-badge ' + exercise.level + '">' + exercise.level.toUpperCase() + '</div>' +
        '<h2 class="exercise-title">' + exercise.title + '</h2>' +
        '<p class="exercise-description">' + exercise.description + '</p>' +
        createExerciseContentHTML(exercise);
    
    container.innerHTML = html;
    
    // Setup exercise-specific listeners
    if (exercise.type === 'fill-blank') {
        setupFillBlankListeners();
    }
    
    // Update UI
    updateProgress();
    updateNavigationButtons();
    hideResult();
    
    console.log('✅ Exercise displayed');
}

// Create exercise content HTML
function createExerciseContentHTML(exercise) {
    if (exercise.type === 'fill-blank') {
        let codeWithBlanks = exercise.code;
        let blankIndex = 0;
        
        codeWithBlanks = codeWithBlanks.replace(/_____/g, function() {
            return '<input type="text" class="blank" data-blank-index="' + blankIndex++ + '" autocomplete="off" spellcheck="false">';
        });
        
        return '<div class="code-snippet"><pre><code>' + codeWithBlanks + '</code></pre></div>';
    }
    
    // For other types, show placeholder
    return '<div class="code-snippet"><pre><code>Exercise content will appear here...</code></pre></div>';
}

// Setup fill-blank listeners
function setupFillBlankListeners() {
    const blanks = document.querySelectorAll('.blank');
    blanks.forEach(function(blank, index) {
        blank.addEventListener('input', function() {
            this.classList.remove('correct', 'incorrect');
        });
        
        blank.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    });
}

// Check answer
function checkAnswer() {
    const exercise = loadedExercises[currentExerciseIndex];
    if (!exercise) return;
    
    console.log('🔍 Checking answer...');
    
    if (exercise.type === 'fill-blank') {
        const blanks = document.querySelectorAll('.blank');
        let allCorrect = true;
        
        blanks.forEach(function(blank, index) {
            const userAnswer = blank.value.trim();
            const correctAnswer = exercise.blanks[index].answer.trim();
            const isCorrect = userAnswer === correctAnswer;
            
            blank.classList.remove('correct', 'incorrect');
            blank.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            if (!isCorrect) allCorrect = false;
        });
        
        // Show result
        showResult(allCorrect, allCorrect ? 'Correct!' : 'Try again', exercise.explanation);
        
        // Update buttons
        const checkBtn = document.getElementById('check-btn');
        const nextBtn = document.getElementById('next-btn');
        const totalExercises = exerciseGenerator ? exerciseGenerator.getExerciseList().length : 0;
        
        if (checkBtn) {
            checkBtn.textContent = allCorrect ? 'Correct! ✓' : 'Try Again';
            checkBtn.disabled = allCorrect;
        }
        
        if (nextBtn) {
            // Update next button text based on position
            if (currentExerciseIndex >= totalExercises - 1) {
                nextBtn.textContent = 'Finish';
            } else {
                nextBtn.textContent = 'Next';
            }
            nextBtn.disabled = false;
        }
        
        // Store result
        userAnswers[currentExerciseIndex] = allCorrect;
    }
}

// Show result
function showResult(isCorrect, feedback, explanation) {
    const resultContainer = document.getElementById('result-container');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const resultExplanation = document.getElementById('result-explanation');

    if (resultIcon) resultIcon.textContent = isCorrect ? '✅' : '❌';
    if (resultText) resultText.textContent = feedback;
    if (resultExplanation) resultExplanation.textContent = explanation || '';

    if (resultContainer) {
        resultContainer.className = 'result ' + (isCorrect ? 'success' : 'error');
        resultContainer.style.display = 'block';
    }
}

// Hide result
function hideResult() {
    const resultContainer = document.getElementById('result-container');
    if (resultContainer) {
        resultContainer.style.display = 'none';
    }
}

// Navigation functions
function showPreviousExercise() {
    if (currentExerciseIndex > 0) {
        loadDynamicExercise(currentExerciseIndex - 1);
    }
}

function showNextExercise() {
    const totalExercises = exerciseGenerator ? exerciseGenerator.getExerciseList().length : 0;
    if (currentExerciseIndex < totalExercises - 1) {
        loadDynamicExercise(currentExerciseIndex + 1);
    } else {
        // Last exercise completed, show completion page
        showCompletionPage();
    }
}

// Update progress
function updateProgress() {
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const totalExercises = exerciseGenerator ? exerciseGenerator.getExerciseList().length : 0;
    
    if (progressText && totalExercises > 0) {
        progressText.textContent = 'Exercise ' + (currentExerciseIndex + 1) + ' of ' + totalExercises;
    }
    
    if (progressFill && totalExercises > 0) {
        const progress = ((currentExerciseIndex + 1) / totalExercises) * 100;
        progressFill.style.width = progress + '%';
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const checkBtn = document.getElementById('check-btn');
    const totalExercises = exerciseGenerator ? exerciseGenerator.getExerciseList().length : 0;
    
    if (prevBtn) prevBtn.disabled = (currentExerciseIndex === 0);
    
    if (nextBtn) {
        if (currentExerciseIndex >= totalExercises - 1) {
            // On last exercise, show "Finish" button
            nextBtn.textContent = 'Finish';
            nextBtn.disabled = false;
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.disabled = false;
        }
    }
    
    if (checkBtn) {
        checkBtn.textContent = 'Check Answer';
        checkBtn.disabled = false;
    }
}

// Show error message
function showError(message) {
    const exerciseContainer = document.getElementById('exercise-container');
    const errorContainer = document.getElementById('error-container');
    const errorText = document.getElementById('error-text');
    const errorReloadBtn = document.getElementById('error-reload-btn');
    const controls = document.querySelector('.controls');
    
    // Hide exercise and controls
    if (exerciseContainer) exerciseContainer.style.display = 'none';
    if (controls) controls.style.display = 'none';
    
    // Show error
    if (errorText) errorText.textContent = message;
    if (errorContainer) errorContainer.style.display = 'block';
    
    // Setup reload button
    if (errorReloadBtn) {
        errorReloadBtn.addEventListener('click', function() {
            location.reload();
        });
    }
}

// Show README modal
async function showReadme() {
    const exercise = loadedExercises[currentExerciseIndex];
    if (!exercise) return;
    
    console.log('📖 Loading README for:', exercise.title);
    
    const modal = document.getElementById('readme-modal');
    const content = document.getElementById('readme-content');
    
    if (!modal || !content) return;
    
    // Show loading state
    content.innerHTML = '<div class="loading">📖 Loading README...</div>';
    modal.style.display = 'flex';
    
    try {
        // Load README from the exercise directory
        const readmePath = `exercises/${exercise.level}/${exercise.folder}/README.md`;
        const response = await fetch(readmePath);
        
        if (response.ok) {
            const readmeText = await response.text();
            
            // Convert basic markdown to HTML
            const htmlContent = markdownToHtml(readmeText);
            content.innerHTML = htmlContent;
        } else {
            // README not found
            content.innerHTML = 
                '<div class="readme-error">' +
                '<h3>README Not Found</h3>' +
                '<p>No README file available for this exercise.</p>' +
                '<p><strong>Exercise:</strong> ' + exercise.title + '</p>' +
                '<p><strong>Level:</strong> ' + exercise.level.toUpperCase() + '</p>' +
                '</div>';
        }
        
    } catch (error) {
        console.error('❌ README load error:', error);
        content.innerHTML = 
            '<div class="readme-error">' +
            '<h3>Error Loading README</h3>' +
            '<p>Failed to load README file: ' + error.message + '</p>' +
            '</div>';
    }
}

// Hide README modal
function hideReadme() {
    const modal = document.getElementById('readme-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Regenerate exercise with new variation
async function regenerateExercise() {
    const exercise = loadedExercises[currentExerciseIndex];
    if (!exercise || !exerciseGenerator) return;
    
    console.log('🎲 Regenerating exercise variation...');
    
    try {
        // Clear the cached exercise to force reload
        loadedExercises[currentExerciseIndex] = null;
        
        // Reload with new variation
        await loadDynamicExercise(currentExerciseIndex);
        
    } catch (error) {
        console.error('❌ Regenerate error:', error);
        showError('Failed to regenerate exercise: ' + error.message);
    }
}

// Show completion page
function showCompletionPage() {
    console.log('🎉 All exercises completed!');
    
    const exerciseContainer = document.getElementById('exercise-container');
    const completionContainer = document.getElementById('completion-container');
    const controls = document.querySelector('.controls');
    const resultContainer = document.getElementById('result-container');
    
    // Hide exercise, controls and result
    if (exerciseContainer) exerciseContainer.style.display = 'none';
    if (controls) controls.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'none';
    
    // Calculate results
    const totalExercises = exerciseGenerator ? exerciseGenerator.getExerciseList().length : 0;
    const correctAnswers = userAnswers.filter(answer => answer === true).length;
    const score = totalExercises > 0 ? Math.round((correctAnswers / totalExercises) * 100) : 0;
    
    // Determine message and emoji based on score
    let message = '';
    let emoji = '';
    if (score >= 90) {
        emoji = '🏆';
        message = 'Outstanding! You\'re a Java master!';
    } else if (score >= 70) {
        emoji = '🌟';
        message = 'Great job! You\'re doing really well!';
    } else if (score >= 50) {
        emoji = '👍';
        message = 'Good effort! Keep practicing!';
    } else {
        emoji = '💪';
        message = 'Nice try! Practice makes perfect!';
    }
    
    // Update completion page content
    const completionEmoji = document.getElementById('completion-emoji');
    const completionMessage = document.getElementById('completion-message');
    const statTotal = document.getElementById('stat-total');
    const statCorrect = document.getElementById('stat-correct');
    const statScore = document.getElementById('stat-score');
    
    if (completionEmoji) completionEmoji.textContent = emoji;
    if (completionMessage) completionMessage.textContent = message;
    if (statTotal) statTotal.textContent = totalExercises;
    if (statCorrect) statCorrect.textContent = correctAnswers;
    if (statScore) statScore.textContent = score + '%';
    
    // Show completion page
    if (completionContainer) completionContainer.style.display = 'block';
    
    // Update progress to 100%
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    if (progressFill) progressFill.style.width = '100%';
    if (progressText) progressText.textContent = 'Completed!';
}

// Restart training session
function restartTraining() {
    console.log('🔄 Restarting training...');
    currentExerciseIndex = 0;
    userAnswers = [];
    loadedExercises = [];
    
    // Hide completion page
    const completionContainer = document.getElementById('completion-container');
    if (completionContainer) completionContainer.style.display = 'none';
    
    // Show exercise container and controls again
    const exerciseContainer = document.getElementById('exercise-container');
    const controls = document.querySelector('.controls');
    if (exerciseContainer) exerciseContainer.style.display = 'block';
    if (controls) controls.style.display = 'flex';
    
    // Reload first exercise
    loadDynamicExercise(0);
}

// Go back to home page
function goHome() {
    console.log('🏠 Going home...');
    window.location.href = 'index.html';
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Code blocks
        .replace(/```java\n([\s\S]*?)\n```/g, '<pre><code class="java">$1</code></pre>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Bold and italic
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    return '<p>' + html + '</p>';
}
