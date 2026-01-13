// Insertion Sort Step Generator
// Returns an array of steps for visualization
export function* insertionSortSteps(arr) {
  const array = [...arr];
  const n = array.length;

  // For insertion sort, the "sorted" region grows from left to right.
  // Although elements inside it might shift, it's visually helpful to verify the "processed" part.
  const getSortedUntil = (index) => {
    return Array.from({ length: index + 1 }, (_, i) => i);
  };

  yield {
    array: [...array],
    active: [],
    swapped: false,
    sorted: [0], // First element is arguably trivially sorted
    description: "Starting Insertion Sort"
  };

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    yield {
      array: [...array],
      active: [i],
      keyIdx: i,
      checkIdx: null,
      swapped: false,
      sorted: getSortedUntil(i - 1),
      description: `Inserting element at position ${i}`
    };

    while (j >= 0 && array[j] > key) {
      yield {
        array: [...array],
        active: [j, j + 1],
        keyIdx: i, // The element originally from i is being inserted
        checkIdx: j,
        swapped: false,
        sorted: getSortedUntil(i), // During shift, we consider up to i as the working area
        description: `Comparing elements at positions ${j} and ${j + 1}`
      };

      array[j + 1] = array[j];
      j--;

      yield {
        array: [...array],
        active: [j + 1, j + 2],
        keyIdx: i,
        checkIdx: j + 1,
        swapped: true,
        sorted: getSortedUntil(i),
        description: `Shifting element to the right`
      };
    }

    array[j + 1] = key;

    yield {
      array: [...array],
      active: [j + 1],
      keyIdx: j + 1, // Final position of key
      checkIdx: null,
      swapped: true,
      sorted: getSortedUntil(i),
      description: `Placed element at position ${j + 1}`
    };
  }

  // All sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);

  yield {
    array: [...array],
    active: [],
    swapped: false,
    sorted: allSorted,
    description: "Insertion Sort completed"
  };
}

// Get all steps as an array
export function getInsertionSortSteps(arr) {
  const generator = insertionSortSteps(arr);
  const steps = [];
  let step = generator.next();

  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }

  return steps;
}
