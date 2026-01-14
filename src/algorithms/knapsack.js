// 0/1 Knapsack Problem Step Generator
// Returns an array of steps for visualization
export function* knapsackSteps(arr) {
  if (arr.length < 2) {
    yield { array: [], active: [], swapped: false, description: "Need at least weights and values arrays" };
    return;
  }
  
  // Split array into weights and values (simplified)
  const half = Math.floor(arr.length / 2);
  const weights = arr.slice(0, half);
  const values = arr.slice(half);
  const capacity = Math.min(15, Math.max(...weights) * 2); // Dynamic capacity based on weights
  const n = weights.length;
  
  // DP table
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  
  yield { 
    array: [dp[0][capacity]], 
    active: [], 
    swapped: false,
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: 0,
    currentCapacity: 0,
    itemWeights: weights,
    itemValues: values,
    message: `Starting 0/1 Knapsack with capacity ${capacity}. Items: ${n}`
  };
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w], 
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
      
      yield { 
        array: [dp[i][capacity]], 
        active: [i, w], 
        swapped: true,
        dpTable: JSON.parse(JSON.stringify(dp)),
        currentItem: i,
        currentCapacity: w,
        itemWeights: weights,
        itemValues: values,
        message: `Item ${i}: w=${weights[i - 1]}, v=${values[i - 1]} | Capacity ${w} → Best: ${dp[i][w]}`
      };
    }
    
    yield { 
      array: [dp[i][capacity]], 
      active: [], 
      swapped: false,
      dpTable: JSON.parse(JSON.stringify(dp)),
      currentItem: i,
      currentCapacity: capacity,
      itemWeights: weights,
      itemValues: values,
      message: `✅ Item ${i} done. Best value at capacity ${capacity}: ${dp[i][capacity]}`
    };
  }
  
  yield { 
    array: [dp[n][capacity]], 
    active: [], 
    swapped: false,
    dpTable: JSON.parse(JSON.stringify(dp)),
    currentItem: n,
    currentCapacity: capacity,
    itemWeights: weights,
    itemValues: values,
    message: `🎉 Knapsack complete! Maximum value: ${dp[n][capacity]}`
  };
}

// Get all steps as an array
export function getKnapsackSteps(arr) {
  const generator = knapsackSteps(arr);
  const steps = [];
  let step = generator.next();
  
  while (!step.done) {
    steps.push(step.value);
    step = generator.next();
  }
  
  return steps;
}
