import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NodeRenderer = memo(({ node, nodes }) => {
  if (!node || node.status === 'merged-done' || node.status === 'hidden') return null;

  const childrenIds = node.children || [];
  const isLeaf = childrenIds.length === 0;

  // Determine visuals based on status
  let containerClass = "bg-white/5 border-white/10 text-slate-300 shadow-none";
  let opacity = 1.0;
  let scale = 1.0;

  switch (node.status) {
    case 'active-split':
      containerClass = "bg-[#ff00ff]/20 border-[#ff00ff] text-[#ff00ff] font-bold shadow-[0_0_15px_rgba(255,0,255,0.3)]";
      scale = 1.05;
      break;
    case 'active-merge':
      containerClass = "bg-[#ffff00]/20 border-[#ffff00] text-[#ffff00] font-bold shadow-[0_0_15px_rgba(255,255,0,0.3)]";
      scale = 1.05;
      break;
    case 'sorted':
      containerClass = "bg-[#00ffff]/20 border-[#00ffff] text-[#00ffff] font-medium shadow-[0_0_15px_rgba(0,255,255,0.3)]";
      break;
    default:
      break;
  }

  return (
    <div className="flex flex-col items-center mx-2 my-3">
      {/* Node Content (The Box) */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity, scale }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          relative z-10 flex items-center justify-center gap-1.5
          px-4 py-2.5 rounded-xl border
          min-w-[60px]
          ${containerClass}
          transition-colors duration-300
        `}
      >
        {node.array.map((val, idx) => (
          <div
            key={`${node.id}-${idx}`}
            className={`
              w-8 h-8 flex items-center justify-center rounded-lg
              bg-dark-900/40 border border-white/5
              text-base
            `}
          >
            {val}
          </div>
        ))}
      </motion.div>

      {/* Children Rows */}
      <AnimatePresence>
        {!isLeaf && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-6 mt-6"
          >
            {childrenIds.map((childId) => (
              <NodeRenderer key={childId} node={nodes[childId]} nodes={nodes} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

NodeRenderer.displayName = 'NodeRenderer';

const MergeTree = ({ currentStep }) => {
  const nodes = currentStep?.nodes || {};
  const rootId = currentStep?.rootId;

  // Calculate current max level, scale factor and completion state
  const { maxLevel, scaleFactor, isDone } = useMemo(() => {
    if (!rootId || Object.keys(nodes).length === 0) {
      return { maxLevel: 0, scaleFactor: 1, isDone: false };
    }

    let currentMaxLevel = 0;
    let anyActive = false;

    Object.values(nodes).forEach(node => {
      if (node.status !== 'hidden' && node.status !== 'merged-done') {
        if (node.level > currentMaxLevel) currentMaxLevel = node.level;
        if (node.status.includes('active')) anyActive = true;
      }
    });

    const rootNode = nodes[rootId];
    // Algorithm is done when the root is sorted and no other nodes are active split/merge
    const finished = rootNode?.status === 'sorted' && !anyActive;

    // Scale factor adjustment
    const factor = Math.max(0.6, 1.1 - currentMaxLevel * 0.12);

    return { maxLevel: currentMaxLevel, scaleFactor: factor, isDone: finished };
  }, [nodes, rootId]);

  if (!currentStep) return null;

  return (
    <div className="w-full bg-[#050505] rounded-[2.5rem] border border-white overflow-hidden shadow-2xl p-8 relative flex flex-col items-center justify-center min-h-[400px]">
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      <motion.div
        animate={{
          minHeight: isDone ? '250px' : '400px'
        }}
        className="w-full overflow-auto flex flex-col items-center justify-center p-4 relative z-10"
      >
        <motion.div
          layout
          animate={{ scale: scaleFactor }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="w-fit flex justify-center origin-center"
        >
          <NodeRenderer node={nodes[rootId]} nodes={nodes} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(MergeTree);
