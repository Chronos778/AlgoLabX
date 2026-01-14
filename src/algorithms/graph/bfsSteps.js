// BFS Traversal Step Generator
// Returns an array of steps with proper graph visualization data
export function bfsSteps(input) {
  const nodeCount = input && input.length > 3 ? input.length : 6;
  const nodes = [];
  const edges = [];

  // Create nodes in a nice circular layout
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * 2 * Math.PI;
    const radius = 150;
    nodes.push({
      id: i,
      label: String.fromCharCode(65 + i), // A, B, C...
      x: 250 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    });
  }

  // Connect nodes to form a graph
  for (let i = 0; i < nodeCount; i++) {
    edges.push({ from: i, to: (i + 1) % nodeCount });
    if (nodeCount > 4) {
      edges.push({ from: i, to: (i + 2) % nodeCount });
    }
  }

  const steps = [];
  const visited = new Set();
  const inQueue = new Set();
  const queue = [];
  const traversalOrder = [];

  // Initial state
  steps.push({
    nodes,
    edges,
    visited: Array.from(visited),
    inQueue: Array.from(inQueue),
    queue: [...queue],
    current: null,
    activeEdge: null,
    message: "Starting BFS Traversal. Source: Node A"
  });

  // Start BFS from node 0
  const sourceId = 0;
  queue.push(sourceId);
  inQueue.add(sourceId);

  steps.push({
    nodes,
    edges,
    visited: Array.from(visited),
    inQueue: Array.from(inQueue),
    queue: [...queue],
    current: null,
    activeEdge: null,
    message: `Added source Node ${String.fromCharCode(65 + sourceId)} to queue.`
  });

  while (queue.length > 0) {
    const currentId = queue.shift();
    inQueue.delete(currentId);
    traversalOrder.push(currentId);

    steps.push({
      nodes,
      edges,
      visited: Array.from(visited),
      inQueue: Array.from(inQueue),
      queue: [...queue],
      current: currentId,
      activeEdge: null,
      message: `Dequeued Node ${String.fromCharCode(65 + currentId)}. Identifying neighbors...`
    });

    // Visit all neighbors (it's an undirected graph here for simplicity of visualization)
    const neighbors = edges.filter(e => e.from === currentId || e.to === currentId);

    for (const edge of neighbors) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;

      if (!visited.has(neighborId) && !inQueue.has(neighborId)) {
        steps.push({
          nodes,
          edges,
          visited: Array.from(visited),
          inQueue: Array.from(inQueue),
          queue: [...queue],
          current: currentId,
          activeEdge: edge,
          message: `Neighbor ${String.fromCharCode(65 + neighborId)} is unvisited. Adding to queue.`
        });

        inQueue.add(neighborId);
        queue.push(neighborId);

        steps.push({
          nodes,
          edges,
          visited: Array.from(visited),
          inQueue: Array.from(inQueue),
          queue: [...queue],
          current: currentId,
          activeEdge: edge,
          message: `Added Node ${String.fromCharCode(65 + neighborId)} to queue.`
        });
      } else if (neighborId !== currentId) {
        steps.push({
          nodes,
          edges,
          visited: Array.from(visited),
          inQueue: Array.from(inQueue),
          queue: [...queue],
          current: currentId,
          activeEdge: edge,
          message: `Neighbor ${String.fromCharCode(65 + neighborId)} is already seen.`
        });
      }
    }

    visited.add(currentId);

    steps.push({
      nodes,
      edges,
      visited: Array.from(visited),
      inQueue: Array.from(inQueue),
      queue: [...queue],
      current: currentId,
      activeEdge: null,
      message: `Finished Node ${String.fromCharCode(65 + currentId)}. Order: [${traversalOrder.map(id => String.fromCharCode(65 + id)).join(', ')}]`
    });
  }

  // Final state
  steps.push({
    nodes,
    edges,
    visited: Array.from(visited),
    inQueue: Array.from(inQueue),
    queue: [...queue],
    current: null,
    activeEdge: null,
    message: `BFS completed. Total order: [${traversalOrder.map(id => String.fromCharCode(65 + id)).join(', ')}]`
  });

  return steps;
}
