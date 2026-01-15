// Bucket Sort, Cocktail Shaker Sort, Comb Sort, Gnome Sort, Odd-Even Sort

// Bucket Sort - Distributes elements into buckets then sorts each bucket
export function getBucketSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const sorted = [];

  if (n <= 0) return [{ array: arr, active: [], swapped: false, sorted: [], message: "Empty array" }];

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Bucket Sort - distributes elements into buckets then sorts each"
  });

  // Find min and max
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketCount = Math.ceil(Math.sqrt(n));
  const bucketSize = Math.ceil((max - min + 1) / bucketCount);

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: `Creating ${bucketCount} buckets, range: ${min}-${max}, bucket size: ${bucketSize}`
  });

  // Create buckets
  const buckets = Array.from({ length: bucketCount }, () => []);

  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    const bucketIdx = Math.min(Math.floor((arr[i] - min) / bucketSize), bucketCount - 1);
    buckets[bucketIdx].push(arr[i]);

    steps.push({
      array: [...arr],
      active: [i],
      swapped: false,
      sorted: [...sorted],
      message: `Placing ${arr[i]} into bucket ${bucketIdx}`
    });
  }

  // Sort each bucket and collect
  let index = 0;
  for (let i = 0; i < bucketCount; i++) {
    if (buckets[i].length > 0) {
      steps.push({
        array: [...arr],
        active: [],
        swapped: false,
        sorted: [...sorted],
        message: `Sorting bucket ${i}: [${buckets[i].join(', ')}]`
      });

      // Sort bucket using insertion sort
      buckets[i].sort((a, b) => a - b);

      steps.push({
        array: [...arr],
        active: [],
        swapped: false,
        sorted: [...sorted],
        message: `Bucket ${i} sorted: [${buckets[i].join(', ')}]`
      });

      // Place back into array and mark as sorted
      for (const val of buckets[i]) {
        arr[index] = val;
        sorted.push(index);
        steps.push({
          array: [...arr],
          active: [index],
          swapped: true,
          sorted: [...sorted],
          message: `Placed ${val} at index ${index} from bucket ${i}`
        });
        index++;
      }
    }
  }

  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Bucket Sort completed! Array is now fully sorted."
  });

  return steps;
}

// Cocktail Shaker Sort (Bidirectional Bubble Sort)
export function getCocktailSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const sorted = [];
  let swapped = true;
  let start = 0;
  let end = n - 1;

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Cocktail Shaker Sort - bidirectional bubble sort"
  });

  while (swapped) {
    swapped = false;

    // Forward pass (left to right)
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Forward pass: scanning from index ${start} to ${end}`
    });

    for (let i = start; i < end; i++) {
      steps.push({
        array: [...arr],
        active: [i, i + 1],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing ${arr[i]} and ${arr[i + 1]}`
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        steps.push({
          array: [...arr],
          active: [i, i + 1],
          swapped: true,
          sorted: [...sorted],
          message: `Swapped ${arr[i]} and ${arr[i + 1]}`
        });
      }
    }

    // Mark end position as sorted after forward pass
    if (!sorted.includes(end)) {
      sorted.push(end);
    }

    if (!swapped) break;

    swapped = false;
    end--;

    // Backward pass (right to left)
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Backward pass: scanning from index ${end} to ${start}`
    });

    for (let i = end - 1; i >= start; i--) {
      steps.push({
        array: [...arr],
        active: [i, i + 1],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing ${arr[i]} and ${arr[i + 1]}`
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        steps.push({
          array: [...arr],
          active: [i, i + 1],
          swapped: true,
          sorted: [...sorted],
          message: `Swapped ${arr[i]} and ${arr[i + 1]}`
        });
      }
    }

    // Mark start position as sorted after backward pass
    if (!sorted.includes(start)) {
      sorted.push(start);
    }
    start++;
  }

  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Cocktail Shaker Sort completed! Array is now fully sorted."
  });

  return steps;
}

// Comb Sort - Improved bubble sort with shrinking gap
export function getCombSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const shrinkFactor = 1.3;
  let gap = n;
  let isSorted = false;
  const sorted = [];

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Comb Sort - bubble sort with shrinking gap to eliminate 'turtles'"
  });

  while (!isSorted) {
    // Update gap
    gap = Math.floor(gap / shrinkFactor);
    if (gap <= 1) {
      gap = 1;
      isSorted = true;
    }

    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: `Using gap: ${gap} - comparing elements ${gap} positions apart`
    });

    // Compare elements with current gap
    for (let i = 0; i + gap < n; i++) {
      steps.push({
        array: [...arr],
        active: [i, i + gap],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing ${arr[i]} and ${arr[i + gap]} (gap: ${gap})`
      });

      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        isSorted = false;
        steps.push({
          array: [...arr],
          active: [i, i + gap],
          swapped: true,
          sorted: [...sorted],
          message: `Swapped ${arr[i]} and ${arr[i + gap]}`
        });
      }
    }
  }

  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Comb Sort completed! Array is now fully sorted."
  });

  return steps;
}

// Gnome Sort - Simple sorting similar to insertion sort
export function getGnomeSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const sorted = [];
  let index = 0;

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Gnome Sort - like a garden gnome sorting flower pots"
  });

  while (index < n) {
    if (index === 0) {
      index++;
    }

    if (index >= n) break;

    steps.push({
      array: [...arr],
      active: [index - 1, index],
      swapped: false,
      sorted: [...sorted],
      message: `At position ${index}, comparing ${arr[index - 1]} and ${arr[index]}`
    });

    if (arr[index] >= arr[index - 1]) {
      // Update sorted portion - elements from 0 to index are in relative order
      sorted.length = 0;
      for (let k = 0; k <= index; k++) sorted.push(k);

      steps.push({
        array: [...arr],
        active: [],
        swapped: false,
        sorted: [...sorted],
        message: `${arr[index]} >= ${arr[index - 1]}, moving forward. Sorted portion: 0 to ${index}`
      });
      index++;
    } else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      steps.push({
        array: [...arr],
        active: [index - 1, index],
        swapped: true,
        sorted: [...sorted],
        message: `Swapped ${arr[index - 1]} and ${arr[index]}, stepping back`
      });
      index--;
    }
  }

  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Gnome Sort completed! Array is now fully sorted."
  });

  return steps;
}

// Odd-Even Sort (Brick Sort) - Parallel sorting algorithm
export function getOddEvenSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const sorted = [];
  let isSorted = false;

  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: [...sorted],
    message: "Starting Odd-Even Sort - parallel-friendly brick sort"
  });

  while (!isSorted) {
    isSorted = true;

    // Odd phase - compare (1,2), (3,4), (5,6)...
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: "Odd phase: comparing pairs at odd indices (1-2, 3-4, 5-6...)"
    });

    for (let i = 1; i < n - 1; i += 2) {
      steps.push({
        array: [...arr],
        active: [i, i + 1],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing ${arr[i]} and ${arr[i + 1]}`
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        isSorted = false;
        steps.push({
          array: [...arr],
          active: [i, i + 1],
          swapped: true,
          sorted: [...sorted],
          message: `Swapped ${arr[i]} and ${arr[i + 1]}`
        });
      }
    }

    // Even phase - compare (0,1), (2,3), (4,5)...
    steps.push({
      array: [...arr],
      active: [],
      swapped: false,
      sorted: [...sorted],
      message: "Even phase: comparing pairs at even indices (0-1, 2-3, 4-5...)"
    });

    for (let i = 0; i < n - 1; i += 2) {
      steps.push({
        array: [...arr],
        active: [i, i + 1],
        swapped: false,
        sorted: [...sorted],
        message: `Comparing ${arr[i]} and ${arr[i + 1]}`
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        isSorted = false;
        steps.push({
          array: [...arr],
          active: [i, i + 1],
          swapped: true,
          sorted: [...sorted],
          message: `Swapped ${arr[i]} and ${arr[i + 1]}`
        });
      }
    }
  }

  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    active: [],
    swapped: false,
    sorted: allSorted,
    message: "Odd-Even Sort completed! Array is now fully sorted."
  });

  return steps;
}