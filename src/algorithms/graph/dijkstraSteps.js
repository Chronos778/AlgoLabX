// Dijkstra's Algorithm Step Generator
// Returns an array of steps with proper graph visualization data
export function dijkstraSteps(input) {
  // input can be node values, but for Dijkstra we often use a fixed graph for visualization
  // unless the user provides a specific adjacency matrix/list.
  // For this visualizer, let's create a standard educational graph if input is simple.

  const nodeCount = input && input.length > 3 ? input.length : 6;
  const nodes = [];
  const edges = [];

  // Create nodes in a nice circular/hexagonal layout for better visualization
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

  // Create a somewhat dense but readable set of edges if none provided
  // We'll use the input values to influence weights if possible
  const getWeight = (i, j) => {
    const val1 = input[i] || 10;
    const val2 = input[j] || 10;
    return Math.floor(Math.abs(val1 + val2) / 2) || 5;
  };

  // Connect in a way that makes sense for a demo graph
  for (let i = 0; i < nodeCount; i++) {
    // Connect to next node
    edges.push({ from: i, to: (i + 1) % nodeCount, weight: getWeight(i, (i + 1) % nodeCount) });
    // Connect to node after next (skip 1)
    if (nodeCount > 4) {
      edges.push({ from: i, to: (i + 2) % nodeCount, weight: getWeight(i, (i + 2) % nodeCount) + 2 });
    }
    // Add a cross edge
    if (i === 0 && nodeCount > 5) {
      edges.push({ from: 0, to: 3, weight: getWeight(0, 3) + 5 });
    }
  }

  const steps = [];
  const distances = {};
  const visited = new Set();
  const previous = {};
  const unvisited = new Set();

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  });

  const sourceId = 0;
  distances[sourceId] = 0;

  // Initial Step
  steps.push({
    nodes,
    edges,
    distances: { ...distances },
    visited: Array.from(visited),
    current: null,
    activeEdge: null,
    message: "Initializing Dijkstra: Source node dist=0, others=∞",
    shortestPath: []
  });

  while (unvisited.size > 0) {
    // Select unvisited node with smallest distance
    let currentId = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null) break; // Remaining nodes are unreachable

    unvisited.delete(currentId);

    steps.push({
      nodes,
      edges,
      distances: { ...distances },
      visited: Array.from(visited),
      current: currentId,
      activeEdge: null,
      message: `Selected Node ${String.fromCharCode(65 + currentId)} (dist: ${minDistance}) as current work node.`,
      shortestPath: []
    });

    // Relax neighbors
    const neighbors = edges.filter(e => e.from === currentId || e.to === currentId);

    for (const edge of neighbors) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;

      if (!unvisited.has(neighborId)) continue;

      const weight = edge.weight;
      const alt = distances[currentId] + weight;

      steps.push({
        nodes,
        edges,
        distances: { ...distances },
        visited: Array.from(visited),
        current: currentId,
        activeEdge: edge,
        checking: neighborId,
        message: `Checking edge to ${String.fromCharCode(65 + neighborId)}: ${distances[currentId]} + ${weight} = ${alt}`,
        shortestPath: []
      });

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;

        steps.push({
          nodes,
          edges,
          distances: { ...distances },
          visited: Array.from(visited),
          current: currentId,
          activeEdge: edge,
          updating: neighborId,
          message: `Update! New shortest distance to ${String.fromCharCode(65 + neighborId)} is ${alt}`,
          shortestPath: []
        });
      }
    }

    visited.add(currentId);

    steps.push({
      nodes,
      edges,
      distances: { ...distances },
      visited: Array.from(visited),
      current: currentId,
      message: `Node ${String.fromCharCode(65 + currentId)} finalized.`,
      shortestPath: []
    });
  }

  // Final Step: Highlight path to the furthest reachable node for demo
  let targetId = 0;
  let maxD = 0;
  Object.entries(distances).forEach(([id, d]) => {
    if (d !== Infinity && d > maxD) {
      maxD = d;
      targetId = parseInt(id);
    }
  });

  const finalPathNodes = [];
  let curr = targetId;
  while (curr !== null) {
    finalPathNodes.unshift(curr);
    curr = previous[curr];
  }

  steps.push({
    nodes,
    edges,
    distances: { ...distances },
    visited: Array.from(visited),
    current: null,
    message: `Dijkstra complete. Highlighted shortest path to Node ${String.fromCharCode(65 + targetId)}.`,
    shortestPath: finalPathNodes
  });

  return steps;
}
