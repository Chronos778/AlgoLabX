// Bubble Sort Step Generator
// Returns an array of steps for visualization
export function* bubbleSortSteps(arr) {
  const array = [...arr];
  const n = array.length;
  // Use a Set to track absolute global indices that are sorted
  const sortedIndices = new Set();

  yield {
    array: [...array],
    active: [],
    swapped: false,
    sorted: [...sortedIndices],
    description: "Starting Bubble Sort"
  };

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...array],
        active: [j, j + 1],
        swapped: false,
        sorted: [...sortedIndices],
        description: `Comparing elements at positions ${j} and ${j + 1}`
      };

      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;

        yield {
          array: [...array],
          active: [j, j + 1],
          swapped: true,
          sorted: [...sortedIndices],
          description: `Swapped elements at positions ${j} and ${j + 1}`
        };
      }
    }

    // The element at n-i-1 is now in its final position
    sortedIndices.add(n - i - 1);

    if (!swapped) {
      // If no swaps occurred, the entire remaining array is sorted
      for (let k = 0; k <= n - i - 1; k++) {
        sortedIndices.add(k);
      }

      yield {
        array: [...array],
        active: [],
        swapped: false,
        sorted: [...sortedIndices],
        description: "Array is already sorted"
      };
      break;
    }

    yield {
      array: [...array],
      active: [],
      swapped: false,
      sorted: [...sortedIndices],
      description: `Element at position ${n - i - 1} is now in correct position`
    };
  }

  // Ensure all indices are marked sorted at the end
  for (let k = 0; k < n; k++) sortedIndices.add(k);

  yield {
    array: [...array],
    active: [],
    swapped: false,
    sorted: [...sortedIndices],
    description: "Bubble Sort completed"
  };
}

// Get all steps as an array
export function getBubbleSortSteps(arr) {
  const generator = bubbleSortSteps(arr);
  const steps = [];
  let step = generator.next();

  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }

  return steps;
}
