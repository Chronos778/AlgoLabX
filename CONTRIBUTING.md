# Contributing to AlgoLabX

We welcome contributions to AlgoLabX! Whether you're adding a new algorithm, fixing a bug, or improving the documentation, your help is appreciated.

## 🚀 How to Add a New Algorithm

AlgoLabX uses a **Step-Based Architecture**. Algorithms are "generators" that produce a list of "snapshots" (steps), which are then played back by the Visualizer.

### 1. Create the Step Generator
Create a new file in `src/algorithms/` (e.g., `src/algorithms/mySort.js`).
It must export a function that accepts an input array and returns an array of "Step Objects".

**Step Object Structure:**
```javascript
{
  array: [1, 5, 2],       // Current state of the data
  active: [0, 1],         // Indices currently being compared/processed (highlighted)
  swapped: true,          // Boolean flag to trigger swap animation
  sorted: [2],            // Indices that are fully sorted
  message: "Comparing 1 and 5" // Text to display to the user
}
```

### 2. Register the Algorithm
Open `src/algorithms/comprehensiveAlgorithms.js`:
1. Import your step generator.
2. Add it to the `algorithmFunctions` object map.
3. Add its metadata (Name, Complexity, Category) to `algorithmCategories`.

### 3. Add to UI
The `Learn.jsx` page automatically renders algorithms listed in `algorithmCategories`. Ensure your new algorithm's "key" matches the one used in the mapping.

## 🎨 creating Custom Visualizers
If standard Bar Charts or Graphs aren't enough (like our **RecursiveTreeVisualizer**):

1. **Create Component**: Build your React component in `src/components/`. Use `framer-motion` for animations.
2. **Hook into SmartVisualizer**: Open `src/components/SmartVisualizer.jsx`. Add a case for your algorithm type to render your new component instead of the default.

## 🐛 Reporting Bugs
Please open an issue on GitHub with:
- The algorithm name
- Steps to reproduce
- Screenshots (if visual bug)

## 💻 Development
1. Clone repo
2. `npm install`
3. `npm run dev`

Happy Coding! 🚀
