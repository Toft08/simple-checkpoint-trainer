// Dynamic Exercise Generator
// Generates fill-in-the-blank exercises from complete Java source files

class DynamicExerciseGenerator {
    constructor(config = null) {
        // Get config from homepage or use defaults
        this.config = config || this.getStoredConfig();
        
        this.exerciseMetadata = [
            // G1 Exercises
            { id: 1, level: 'g1', folder: 'AgeFinder', title: 'Age Finder', description: 'Calculate age from date with error handling' },
            { id: 2, level: 'g1', folder: 'DayOfWeek', title: 'Day of Week Finder', description: 'Find the day of the week for a given date' },
            { id: 3, level: 'g1', folder: 'MonthlyPeriod', title: 'Monthly Period', description: 'Calculate monthly period between dates' },
            { id: 4, level: 'g1', folder: 'MultiplicationTable', title: 'Multiplication Table', description: 'Generate multiplication tables' },
            { id: 5, level: 'g1', folder: 'TimeTracker', title: 'Time Tracker', description: 'Track project time between dates' },
            { id: 6, level: 'g1', folder: 'TodoList', title: 'Todo List', description: 'Manage tasks with status tracking' },
            
            // G2 Exercises  
            { id: 7, level: 'g2', folder: 'AlmostPalindrome', title: 'Almost Palindrome', description: 'Check if string is almost a palindrome' },
            { id: 8, level: 'g2', folder: 'BreakdownURL', title: 'Breakdown URL', description: 'Parse URL components using Java URL class' },
            { id: 9, level: 'g2', folder: 'ConfigProtector', title: 'Config Protector', description: 'Protect configuration data' },
            { id: 10, level: 'g2', folder: 'FactorialMaster', title: 'Factorial Master', description: 'Calculate factorial numbers' },
            { id: 11, level: 'g2', folder: 'Flexisort', title: 'Flexible Sorting', description: 'Multiple sorting algorithms implementation' },
            { id: 12, level: 'g2', folder: 'HTMLValidator', title: 'HTML Validator', description: 'Validate HTML tag structure' },
            { id: 13, level: 'g2', folder: 'NextPrime', title: 'Next Prime', description: 'Find the next prime number' },
            
            // G3 Exercises
            { id: 14, level: 'g3', folder: 'BuilderBlueprint', title: 'Builder Pattern', description: 'Implement builder design pattern' },
            { id: 15, level: 'g3', folder: 'CircularLinkedList', title: 'Circular Linked List', description: 'Implement circular linked list structure' },
            { id: 16, level: 'g3', folder: 'DoubleLinkedList', title: 'Double Linked List', description: 'Implement doubly linked list structure' },
            { id: 17, level: 'g3', folder: 'FactoryBlueprint', title: 'Factory Pattern', description: 'Implement factory design pattern' },
            { id: 18, level: 'g3', folder: 'SingleLinkedList', title: 'Single Linked List', description: 'Implement singly linked list structure' },
            { id: 19, level: 'g3', folder: 'SingletonBlueprint', title: 'Singleton Pattern', description: 'Implement singleton design pattern' },
            
            // G4 Exercises
            { id: 20, level: 'g4', folder: 'DistinctSubstringLength', title: 'Distinct Substring Length', description: 'Find distinct substring length' },
            { id: 21, level: 'g4', folder: 'FirstUnique', title: 'First Unique', description: 'Find first unique character in string' },
            { id: 22, level: 'g4', folder: 'HarmoniousFusion', title: 'Harmonious Fusion', description: 'Merge and harmonize data structures' },
            { id: 23, level: 'g4', folder: 'IsAnagram', title: 'Anagram Checker', description: 'Check if two strings are anagrams' },
            { id: 24, level: 'g4', folder: 'LongestCommonPrefix', title: 'Longest Common Prefix', description: 'Find longest common prefix in strings' },
            { id: 25, level: 'g4', folder: 'TopFrequents', title: 'Top Frequents', description: 'Find most frequent elements' }
        ];
        
        // Filter and randomly select exercises based on selected levels
        this.availableExercises = this.selectExercises(
            this.config.levels, 
            this.config.tasks
        );
        
        // Patterns to identify important code elements to potentially blank out
        this.blankablePatterns = [
            // Data types (only when they are standalone, not part of method signatures)
            { pattern: /\b(String|int|boolean|double|float|long|char|byte|short)\s+(\w+)\s*[=;]/g, category: 'dataType', weight: 0.9, extractGroup: 1 },
            // Class names after 'new'
            { pattern: /new\s+(\w+)\s*\(/g, category: 'constructor', weight: 0.9, extractGroup: 1 },
            // Method calls (specific method names)
            { pattern: /\.(\w+)\(/g, category: 'methodCall', weight: 0.7, extractGroup: 1 },
            // Import statements (just the last part)
            { pattern: /import\s+[\w.]+\.(\w+);/g, category: 'import', weight: 0.6, extractGroup: 1 },
            // Variables in assignments (left side)
            { pattern: /(\w+)\s*=\s*[^=]/g, category: 'variable', weight: 0.5, extractGroup: 1 },
            // String literals (DISABLED - causes position issues)
            // { pattern: /"([^"]{2,})"/g, category: 'stringLiteral', weight: 0.3, extractGroup: 1 },
            // Number literals (but avoid -1 which is often important)
            { pattern: /\b(?!-1\b)(\d+)\b/g, category: 'numberLiteral', weight: 0.4, extractGroup: 1 },
            // Exception types in catch blocks
            { pattern: /catch\s*\(\s*(\w+)\s+\w+\)/g, category: 'exceptionType', weight: 0.8, extractGroup: 1 }
        ];
    }

    async loadExercise(exerciseId) {
        const metadata = this.exerciseMetadata.find(ex => ex.id === exerciseId);
        if (!metadata) {
            throw new Error(`Exercise ${exerciseId} not found`);
        }

        try {
            // Determine the main Java file name
            const mainFileName = this.getMainFileName(metadata.level, metadata.folder);
            
            // Load the Java source file and README
            const [javaSource, readme] = await Promise.all([
                fetch(`exercises/${metadata.level}/${metadata.folder}/${mainFileName}.java`).then(r => r.text()),
                fetch(`exercises/${metadata.level}/${metadata.folder}/README.md`).then(r => r.text())
            ]);

            // Generate dynamic exercise with random blanks
            const exercise = this.generateExercise(metadata, javaSource, readme);
            return exercise;
        } catch (error) {
            console.error('Failed to load exercise:', error);
            throw error;
        }
    }

    getMainFileName(level, folder) {
        // Special cases where the main file doesn't match the folder name
        const specialCases = {
            'TimeTracker': 'ProjectTime',
            'TodoList': 'TodoList', // Could be Task, TaskStatus, or TodoList - using TodoList as main
            'Flexisort': 'Sorter', // Main interface/abstract class
            'IsAnagram': 'AnagramChecker',
            'BuilderBlueprint': 'BuilderBlueprint', // Now consolidated into single file
            'FactoryBlueprint': 'Factory', // Main factory class
            'SingletonBlueprint': 'Singleton', // Main singleton class
            'DayOfWeek': 'DayOfWeekFinder' // Main file is DayOfWeekFinder.java
        };

        return specialCases[folder] || folder;
    }

    generateExercise(metadata, javaSource, readme, customDifficulty = null) {
        // Skip blanking for problematic exercises (currently empty - for testing)
        const skipBlankingExercises = [];
        
        if (skipBlankingExercises.includes(metadata.folder)) {
            // Return the complete code without blanks for now
            return {
                id: metadata.id,
                level: metadata.level,
                folder: metadata.folder,
                type: 'fill-blank',
                title: metadata.title,
                description: metadata.description,
                code: javaSource,
                blanks: [], // No blanks for this exercise
                readme: readme,
                explanation: `Complete the ${metadata.folder} implementation with the missing code elements.`
            };
        }
        
        // Use custom difficulty or config difficulty
        const difficulty = customDifficulty || this.config.difficulty;
        
        // Extract protected patterns from README
        const protectedPatterns = this.extractProtectedPatterns(readme);
        
        // Find all potential blank positions
        const candidates = this.findBlankCandidates(javaSource, protectedPatterns);
        
        // Randomly select blanks based on difficulty (percentage of total candidates)
        const numBlanks = Math.max(3, Math.floor(candidates.length * difficulty));
        const selectedBlanks = this.selectRandomBlanks(candidates, numBlanks);
        
        // Generate the exercise code with blanks
        const { code, blanks } = this.createBlankedCode(javaSource, selectedBlanks);
        
        return {
            id: metadata.id,
            level: metadata.level,
            folder: metadata.folder,
            type: 'fill-blank',
            title: metadata.title,
            description: metadata.description,
            code: code,
            blanks: blanks, // Simple array of {answer: "exactText"} objects
            readme: readme,
            explanation: `Complete the ${metadata.folder} implementation with the missing code elements.`
        };
    }

    // Extract protected patterns from README Expected sections
    extractProtectedPatterns(readme) {
        const protectedPatterns = [];
        
        // Match "Expected Class", "Expected Classes", "Expected Functions" sections
        const expectedSectionRegex = /###\s+Expected\s+(Class|Classes|Functions)\s*\n```java\n([\s\S]*?)\n```/gi;
        
        let match;
        while ((match = expectedSectionRegex.exec(readme)) !== null) {
            const codeBlock = match[2];
            
            // Extract imports: import java.time.LocalDate; -> LocalDate
            const imports = codeBlock.match(/import\s+[\w.]+\.(\w+);/g);
            if (imports) {
                imports.forEach(imp => {
                    const className = imp.match(/\.(\w+);/);
                    if (className && className[1]) {
                        protectedPatterns.push(className[1]);
                    }
                });
            }
            
            // Extract method signatures, class names, and important identifiers
            // Method signatures: public/private/protected ... methodName(...)
            const methodSignatures = codeBlock.match(/(public|private|protected)\s+[\w<>,\[\]\s]+\s+(\w+)\s*\([^)]*\)/g);
            if (methodSignatures) {
                methodSignatures.forEach(sig => {
                    // Extract the method name
                    const methodName = sig.match(/\s+(\w+)\s*\(/);
                    if (methodName && methodName[1]) {
                        protectedPatterns.push(methodName[1]);
                    }
                });
            }
            
            // Extract class names: public/private class ClassName
            const classNames = codeBlock.match(/(public|private)?\s*class\s+(\w+)/g);
            if (classNames) {
                classNames.forEach(cls => {
                    const className = cls.match(/class\s+(\w+)/);
                    if (className && className[1]) {
                        protectedPatterns.push(className[1]);
                    }
                });
            }
        }
        
        return protectedPatterns;
    }

    findBlankCandidates(javaSource, protectedPatterns = []) {
        const candidates = [];
        
        this.blankablePatterns.forEach(pattern => {
            let match;
            const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
            
            while ((match = regex.exec(javaSource)) !== null) {
                // Skip if it's inside a comment
                const beforeMatch = javaSource.substring(0, match.index);
                const lineStart = beforeMatch.lastIndexOf('\n');
                const line = javaSource.substring(lineStart, javaSource.indexOf('\n', match.index));
                
                if (line.trim().startsWith('//') || line.includes('/*')) {
                    continue;
                }
                
                // Use specified extract group or default to group 1 or full match
                const extractGroup = pattern.extractGroup || 1;
                const extractedText = match[extractGroup] || match[0];
                
                // Skip if extracted text is too short or is a keyword that would break syntax
                if (extractedText.length < 2 || ['public', 'private', 'class', '{', '}'].includes(extractedText)) {
                    continue;
                }
                
                // Skip if this text is in the protected patterns from README
                if (protectedPatterns.includes(extractedText)) {
                    continue;
                }
                
                candidates.push({
                    start: match.index + (match[0].indexOf(extractedText)),
                    end: match.index + (match[0].indexOf(extractedText)) + extractedText.length,
                    text: extractedText,
                    fullMatch: match[0],
                    category: pattern.category,
                    weight: pattern.weight,
                    hint: this.generateHint(extractedText, pattern.category)
                });
            }
        });
        
        // Sort by position to avoid overlap issues
        return candidates.sort((a, b) => a.start - b.start);
    }

    selectRandomBlanks(candidates, numBlanks) {
        // Remove overlapping candidates
        const nonOverlapping = this.removeOverlaps(candidates);
        
        // Weight the selection based on importance
        const weightedCandidates = nonOverlapping.map(candidate => ({
            ...candidate,
            score: Math.random() * candidate.weight
        }));
        
        // Select top candidates by score
        return weightedCandidates
            .sort((a, b) => b.score - a.score)
            .slice(0, Math.min(numBlanks, weightedCandidates.length));
    }

    removeOverlaps(candidates) {
        const result = [];
        for (let i = 0; i < candidates.length; i++) {
            const current = candidates[i];
            const hasOverlap = result.some(existing => 
                (current.start >= existing.start && current.start < existing.end) ||
                (current.end > existing.start && current.end <= existing.end)
            );
            
            if (!hasOverlap) {
                result.push(current);
            }
        }
        return result;
    }

    createBlankedCode(javaSource, selectedBlanks) {
        // Sort blanks by position (descending) to replace from end to start
        const sortedBlanks = selectedBlanks.sort((a, b) => b.start - a.start);
        
        let blankedCode = javaSource;
        const blanks = [];
        
        sortedBlanks.forEach(blank => {
            // Verify the text at this position matches what we expect
            const actualText = blankedCode.substring(blank.start, blank.end);
            if (actualText !== blank.text) {
                console.warn(`Skipping blank - expected "${blank.text}" but found "${actualText}" at position ${blank.start}-${blank.end}`);
                return; // Skip this blank if text doesn't match
            }
            
            // Create underscore placeholder that matches the length of the text
            // Use minimum of 3 underscores, maximum of 20, and roughly match the text length
            const textLength = blank.text.length;
            const underscoreCount = Math.min(20, Math.max(3, textLength));
            const placeholder = '_'.repeat(underscoreCount);
            
            // Replace the text with sized underscore placeholder
            const before = blankedCode.substring(0, blank.start);
            const after = blankedCode.substring(blank.end);
            blankedCode = before + placeholder + after;
            
            // Add to blanks array (reverse order since we're going backwards)
            // Remove hints - just exact answer validation as requested
            blanks.unshift({
                answer: blank.text
            });
        });
        
        // Style file separators for better visual distinction
        blankedCode = blankedCode.replace(
            /\/\/ ={40,}\n\/\/ FILE: (.+?)\n\/\/ ={40,}/g,
            '<span class="file-separator">// ============================================\n// FILE: $1\n// ============================================</span>'
        );
        
        return { code: blankedCode, blanks };
    }

    generateHint(text, category) {
        const hints = {
            'dataType': `Data type for storing ${text.toLowerCase()} values`,
            'import': `Class name: ${text}`,
            'methodCall': `Method that ${this.getMethodDescription(text)}`,
            'variable': `Variable name: ${text}`,
            'constructor': `Constructor for ${text} objects`,
            'exceptionType': `Exception type: ${text}`,
            'stringLiteral': `String pattern: "${text}"`,
            'numberLiteral': `Numeric value: ${text}`
        };
        
        return hints[category] || `Complete with: ${text}`;
    }
    
    getMethodDescription(methodName) {
        const descriptions = {
            'parse': 'parses text into an object',
            'ofPattern': 'creates a pattern formatter', 
            'now': 'gets the current time',
            'isAfter': 'checks if date is after another',
            'between': 'calculates difference between dates',
            'getYears': 'extracts years from period',
            'getProtocol': 'gets URL protocol (http/https)',
            'getHost': 'gets domain name from URL',
            'getPort': 'gets port number from URL',
            'getPath': 'gets path part of URL',
            'getQuery': 'gets query parameters from URL',
            'put': 'adds key-value pair to map',
            'valueOf': 'converts string to number'
        };
        
        return descriptions[methodName] || `performs ${methodName} operation`;
    }

    // Select exercises evenly distributed across levels and randomized
    selectExercises(selectedLevels, totalTasks) {
        // Group exercises by level
        const exercisesByLevel = {};
        selectedLevels.forEach(level => {
            exercisesByLevel[level] = this.exerciseMetadata.filter(ex => ex.level === level);
        });
        
        // Calculate how many exercises per level
        const tasksPerLevel = Math.floor(totalTasks / selectedLevels.length);
        const remainder = totalTasks % selectedLevels.length;
        
        const selected = [];
        
        // Select exercises from each level
        selectedLevels.forEach((level, index) => {
            const levelExercises = exercisesByLevel[level];
            
            // Some levels get one extra exercise to account for remainder
            const count = tasksPerLevel + (index < remainder ? 1 : 0);
            
            // Shuffle exercises for this level
            const shuffled = this.shuffleArray([...levelExercises]);
            
            // Take the required number
            selected.push(...shuffled.slice(0, Math.min(count, shuffled.length)));
        });
        
        // Shuffle the final selection so levels are mixed
        return this.shuffleArray(selected);
    }
    
    // Fisher-Yates shuffle algorithm
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Get all available exercises (filtered by config)
    getExerciseList() {
        return this.availableExercises.map(meta => ({
            id: meta.id,
            level: meta.level,
            title: meta.title,
            description: meta.description
        }));
    }
    
    // Get configuration from homepage
    getStoredConfig() {
        const stored = localStorage.getItem('trainingConfig');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default configuration if no homepage config
        return {
            tasks: 5,
            levels: ['g1', 'g2'],
            difficulty: 0.5
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicExerciseGenerator;
}