// DFS Traversal Step Generator
// Returns an array of steps with proper graph visualization data
export function dfsSteps(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;

  // Create graph with nodes and edges
  const nodes = arr.map((value, index) => ({
    id: index,
    value: value,
    label: `Node ${index}`,
    x: 0, // Will be calculated by visualizer
    y: 0  // Will be calculated by visualizer
  }));

  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < Math.min(i + 3, n); j++) {
      edges.push({
        from: i,
        to: j,
        weight: Math.abs(arr[j] - arr[i]),
        label: `${Math.abs(arr[j] - arr[i])}`
      });
    }
  }

  const visitedIDs = [];
  const traversalOrder = [];

  // Initial state
  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [],
    current: -1,
    active: [],
    message: "Starting DFS Traversal from node 0"
  });

  // Recursive DFS function
  function dfs(node) {
    if (visitedIDs.includes(node)) return;

    visitedIDs.push(node);
    traversalOrder.push(node);

    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visitedIDs],
      current: node,
      active: [node],
      message: `Visiting node ${node}`
    });

    // Visit all neighbors
    const neighbors = edges.filter(e => e.from === node).map(e => e.to);
    for (const neighbor of neighbors) {
      if (!visitedIDs.includes(neighbor)) {
        steps.push({
          nodes: [...nodes],
          edges: [...edges],
          visited: [...visitedIDs],
          current: node,
          active: [node, neighbor],
          message: `Exploring neighbor ${neighbor} from node ${node}`
        });

        dfs(neighbor); // Recursive call
      }
    }

    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      visited: [...visitedIDs],
      current: node,
      active: [node],
      message: `Backtracking from node ${node}. Current path: [${traversalOrder.join(', ')}]`
    });
  }

  dfs(0);

  // Final state
  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visited: [...visitedIDs],
    current: -1,
    active: [],
    message: `DFS completed. Traversal order: [${traversalOrder.join(', ')}]`
  });

  return steps;
}
