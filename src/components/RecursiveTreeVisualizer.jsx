import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NodeRenderer = memo(({ node, nodes, algorithmType }) => {
    if (!node || node.status === 'merged-done' || node.status === 'hidden') return null;

    const childrenIds = node.children || [];
    const isLeaf = childrenIds.length === 0;

    // Determine visuals based on status
    let containerClass = "bg-white/5 border-white/10 text-slate-300 shadow-none";
    let opacity = 1.0;
    let scale = 1.0;

    // Merge Sort Status Handling
    if (algorithmType === 'merge') {
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
    }
    // Quick Sort Status Handling
    else if (algorithmType === 'quick') {
        if (node.status === 'active-partition') {
            containerClass = "bg-[#ff00ff]/20 border-[#ff00ff] text-[#ff00ff] font-bold shadow-[0_0_15px_rgba(255,0,255,0.3)]";
            scale = 1.05;
        }
    }

    return (
        <div className="flex flex-col items-center mx-2 my-4 relative">

            {/* Node Content (The Box) */}
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8, rotateX: -45 }}
                animate={{ opacity, scale, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
                className={`
          relative z-10 flex items-center justify-center gap-2
          px-5 py-3.5 rounded-2xl border-2
          min-w-[80px]
          backdrop-blur-md
          ${containerClass}
          transition-colors duration-300
        `}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {node.array.map((val, idx) => {
                    // Normalize value and state
                    let value = val;
                    let itemState = 'default';

                    if (typeof val === 'object' && val !== null) {
                        value = val.value;
                        // Check if node has arrayStates for visual state
                        if (node.arrayStates && node.arrayStates[idx]) {
                            itemState = node.arrayStates[idx];
                        }
                    }

                    // Item Colors
                    let itemClass = "bg-dark-900/40 border-white/5 text-slate-300";
                    if (itemState === 'pivot') itemClass = "bg-[#ff00ff]/40 border-[#ff00ff] text-white shadow-[0_0_10px_rgba(255,0,255,0.5)]";
                    else if (itemState === 'swapping') itemClass = "bg-[#ffff00]/40 border-[#ffff00] text-white shadow-[0_0_10px_rgba(255,255,0,0.5)]";
                    else if (itemState === 'comparing') itemClass = "bg-[#00ffff]/40 border-[#00ffff] text-white shadow-[0_0_10px_rgba(0,255,255,0.5)]";
                    else if (itemState === 'locked') itemClass = "bg-[#00ff88]/40 border-[#00ff88] text-white";

                    return (
                        <div
                            key={`${node.id}-${idx}`}
                            className={`
                    w-10 h-10 flex items-center justify-center rounded-lg
                    border
                    text-base font-bold
                    ${itemClass}
                    transition-colors duration-200
                    `}
                        >
                            {value}
                        </div>
                    );
                })}
            </motion.div>

            {/* Connection Lines (CSS-based Tree Branches) */}
            {!isLeaf && (
                <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-px h-6 bg-white/20"></div>
            )}

            {/* Children Rows */}
            <AnimatePresence>
                {!isLeaf && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-4 mt-8 relative"
                    >
                        {/* Horizontal Connector Line */}
                        {childrenIds.length > 1 && (
                            <div className="absolute -top-4 left-[20%] right-[20%] h-px bg-white/20"></div>
                        )}

                        {childrenIds.map((childId, index) => (
                            <div key={childId} className="relative">
                                {/* Vertical line up to connector */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-white/20"></div>
                                <NodeRenderer node={nodes[childId]} nodes={nodes} algorithmType={algorithmType} />
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

NodeRenderer.displayName = 'NodeRenderer';

const RecursiveTreeVisualizer = ({ currentStep, algorithmType = 'merge' }) => {
    const nodes = currentStep?.nodes || {};
    const rootId = currentStep?.rootId;
    const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    // Handle window resize
    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate current max level, scale factor and completion state
    const { maxLevel, scaleFactor, isDone } = useMemo(() => {
        if (!rootId || Object.keys(nodes).length === 0) {
            return { maxLevel: 0, scaleFactor: 1, isDone: false };
        }

        let currentMaxLevel = 0;

        // Calculate level
        const traverse = (id, lvl) => {
            if (!nodes[id]) return;
            currentMaxLevel = Math.max(currentMaxLevel, lvl);
            if (nodes[id].children) {
                nodes[id].children.forEach(c => traverse(c, lvl + 1));
            }
        };
        traverse(rootId, 0);

        const rootNode = nodes[rootId];
        // Check completion
        let finished = false;
        if (algorithmType === 'merge') {
            finished = rootNode?.status === 'sorted';
            // Check if any splits active
            const anyActive = Object.values(nodes).some(n => n.status.includes('active'));
            if (anyActive) finished = false;
        } else {
            finished = currentStep.isDone;
        }

        // Scale factor adjustment
        // Start larger (1.1) and shrink less aggressively (0.08 per level), with a much higher floor (0.65)
        let baseScale = 1.1;
        let shrinkRate = 0.08;
        let minScale = 0.65;

        // Mobile adjustments
        if (windowWidth < 768) {
            baseScale = 0.8; // Start smaller on mobile
            shrinkRate = 0.12; // Shrink faster
            minScale = 0.4; // Allow smaller minimum
        }

        const factor = Math.max(minScale, baseScale - currentMaxLevel * shrinkRate);

        return { maxLevel: currentMaxLevel, scaleFactor: factor, isDone: finished };
    }, [nodes, rootId, algorithmType, currentStep, windowWidth]);

    if (!currentStep) return null;

    return (
        <div className="w-full bg-[#050505] rounded-[2.5rem] border border-white overflow-hidden shadow-2xl p-4 sm:p-8 relative flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px]">
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] z-0" />

            {/* 3D Container Wrapper */}
            <motion.div
                animate={{
                    minHeight: isDone ? '300px' : '500px'
                }}
                className="w-full overflow-auto flex flex-col items-center justify-start p-4 relative z-10 custom-scrollbar"
                style={{ perspective: '1000px' }}
            >
                <motion.div
                    layout
                    animate={{ scale: scaleFactor, rotateX: 10 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                    className="w-fit flex justify-center origin-top pt-8"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <NodeRenderer node={nodes[rootId]} nodes={nodes} algorithmType={algorithmType} />
                </motion.div>
            </motion.div>

            {/* Legend */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 text-[10px] uppercase font-bold tracking-widest text-white/40 pointer-events-none">
                {algorithmType === 'merge' ? (
                    <>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ff00ff]"></span> Split</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ffff00]"></span> Merge</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#00ffff]"></span> Sorted</span>
                    </>
                ) : (
                    <>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ff00ff]"></span> Pivot</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ffff00]"></span> Swapping</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#00ff88]"></span> Locked</span>
                    </>
                )}

            </div>
        </div>
    );
};

export default memo(RecursiveTreeVisualizer);
