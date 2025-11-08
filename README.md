# Java Checkpoint Trainer

An interactive, mobile-friendly Java learning platform with fill-in-the-blank exercises. Perfect for studying Java fundamentals anywhere, anytime!

## Features

- **Mobile-First Design** - Study on your phone while commuting
- **Fill-in-the-Blanks** - Complete Java code snippets
- **Dark Mode Support** - Easy on the eyes during late-night coding
- **No Backend Required** - Pure client-side for fast loading
- **Progress Tracking** - See your advancement through exercises

## Live Demo

Visit: [https://toft08.github.io/simple-checkpoint-trainer/](https://toft08.github.io/simple-checkpoint-trainer/)

## Important Note About Solutions

**Please note:** The Java solutions provided in this trainer are my own implementations and may not represent the most optimal or efficient approaches. Programming problems often have multiple valid solutions, and there might be simpler, more elegant, or more performant ways to solve these exercises.

If you have a better solution or a simpler approach to any of these problems, I'd love to hear from you! Feel free to contact me or open an issue/pull request to share your improvements.

## Exercises Included

### **G1 - Fundamentals**
1. **AgeFinder** - Calculate age from date with error handling
2. **DayOfWeek** - Find the day of the week for a given date  
3. **MonthlyPeriod** - Calculate monthly period between dates
4. **MultiplicationTable** - Generate multiplication tables
5. **TimeTracker** - Track project time between dates
6. **TodoList** - Manage tasks with status tracking

### **G2 - Intermediate**
7. **AlmostPalindrome** - Check if string is almost a palindrome
8. **BreakdownURL** - Parse URL components using Java URL class
9. **ConfigProtector** - Protect configuration data
10. **FactorialMaster** - Calculate factorial with optimization
11. **Flexisort** - Flexible sorting algorithms
12. **HTMLValidator** - Validate HTML tag structure
13. **NextPrime** - Find the next prime number

### **G3 - Advanced**  
14. **BuilderBlueprint** - Implement Builder design pattern
15. **CircularLinkedList** - Circular linked list implementation
16. **DoubleLinkedList** - Double linked list with bidirectional traversal
17. **FactoryBlueprint** - Factory design pattern implementation
18. **SingleLinkedList** - Basic linked list operations
19. **SingletonBlueprint** - Singleton design pattern

### **G4 - Expert**
20. **DistinctSubstringLength** - Complex string algorithm
21. **FirstUnique** - Find first unique character
22. **HarmoniousFusion** - Array harmonious subsequence
23. **IsAnagram** - Anagram detection algorithm
24. **LongestCommonPrefix** - String prefix algorithm
25. **TopFrequents** - Find most frequent elements

## Technologies Used

- **Vanilla JavaScript** - No frameworks for maximum compatibility
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **HTML5** - Semantic structure for accessibility
- **Google Fonts** - JetBrains Mono for code, Inter for UI

## Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/simple-checkpoint-trainer.git

# Navigate to the project
cd simple-checkpoint-trainer

# Open index.html in your browser
open index.html
```

Or use a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if you have npx)
npx serve .

# Then open http://localhost:8000
```

## Deploy to GitHub Pages

1. **Create a new repository** on GitHub named `simple-checkpoint-trainer`

2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/simple-checkpoint-trainer.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings  
   - Scroll to "Pages" section
   - Select source: "Deploy from a branch"
   - Choose branch: "main" and folder: "/ (root)"
   - Click Save

4. **Access your site** at: `https://toft08.github.io/simple-checkpoint-trainer/`

## GitHub Pages Deployment Notes

- **No build process required** - Pure static files
- **Mobile-first responsive** - Works great on all devices  
- **Fast loading** - All resources are client-side
- **CORS Considerations** - Exercise files load via fetch API
- **File Structure** - Maintains relative paths for GitHub Pages

## Mobile Usage

- **Touch & Drag** - Use finger to drag code elements
- **Tap to Focus** - Touch input fields to enter answers
- **Swipe Navigation** - Use arrow keys or buttons to navigate
- **Portrait Mode** - Optimized for phone screens

## Customization

### Adding New Exercises

Edit `exercises.js` to add new exercises:

```javascript
{
  id: 11,
  type: 'fill-blank', // or 'drag-drop'
  title: 'Your Exercise Title',
  description: 'Exercise description',
  code: `Your code with _____ blanks`,
  blanks: [
    { answer: 'correct-answer', hint: 'Helpful hint' }
  ],
  explanation: 'Why this is the correct answer'
}
```

### Styling Changes

Modify CSS variables in `styles.css`:

```css
:root {
  --primary-color: #your-color;
  --bg-color: #your-background;
  /* ... other variables */
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by W3Schools interactive code examples
- Built for Java checkpoint training at 01 School
- Designed for mobile-first learning experiences

---

**Happy Learning!**