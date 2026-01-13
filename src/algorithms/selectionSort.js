// Selection Sort Step Generator
// Returns an array of steps for visualization
export function* selectionSortSteps(arr) {
  const array = [...arr];
  const n = array.length;
  // Use a Set to track absolute global indices that are sorted
  const sortedIndices = new Set();

  yield {
    array: [...array],
    active: [],
    swapped: false,
    sorted: [...sortedIndices],
    description: "Starting Selection Sort"
  };

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    yield {
      array: [...array],
      active: [i],
      minIdx: minIdx,
      checkIdx: null,
      swapped: false,
      sorted: [...sortedIndices],
      description: `Finding minimum element from position ${i}`
    };

    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...array],
        active: [minIdx, j],
        minIdx: minIdx,
        checkIdx: j,
        swapped: false,
        sorted: [...sortedIndices],
        description: `Comparing elements at positions ${minIdx} and ${j}`
      };

      if (array[j] < array[minIdx]) {
        minIdx = j;
        yield {
          array: [...array],
          active: [minIdx],
          minIdx: minIdx,
          checkIdx: j,
          swapped: false,
          sorted: [...sortedIndices],
          description: `New minimum found at position ${minIdx}`
        };
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];

      yield {
        array: [...array],
        active: [i, minIdx],
        minIdx: minIdx,
        checkIdx: i,
        swapped: true,
        sorted: [...sortedIndices],
        description: `Swapped minimum element to position ${i}`
      };
    }

    sortedIndices.add(i);

    yield {
      array: [...array],
      active: [i],
      swapped: false,
      sorted: [...sortedIndices],
      description: `Element at position ${i} is now sorted`
    };
  }

  // Ensure all indices are marked sorted at the end
  for (let k = 0; k < n; k++) sortedIndices.add(k);

  yield {
    array: [...array],
    active: [],
    swapped: false,
    sorted: [...sortedIndices],
    description: "Selection Sort completed"
  };
}

// Get all steps as an array
export function getSelectionSortSteps(arr) {
  const generator = selectionSortSteps(arr);
  const steps = [];
  let step = generator.next();

  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }

  return steps;
}
