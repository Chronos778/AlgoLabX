import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DijkstraVisualizer = ({
    stepData,
    className = ""
}) => {
    const {
        nodes = [],
        edges = [],
        distances = {},
        visited = [],
        current = null,
        activeEdge = null,
        checking = null,
        updating = null,
        shortestPath = [],
        message = ""
    } = stepData || {};

    // Premium styling constants
    const colors = {
        idle: '#2a2a32',
        visited: '#00ff88', // Green
        current: '#ffff00', // Yellow
        checking: '#00ffff', // Blue -> Cyan
        updating: '#ff00ff', // Purple -> Pink
        path: '#00ff88',
        text: '#ffffff',
        mutedText: 'rgba(255, 255, 255, 0.4)'
    };

    const isNodeInPath = (id) => shortestPath.includes(id);
    const isEdgeInPath = (edge) => {
        if (shortestPath.length < 2) return false;
        for (let i = 0; i < shortestPath.length - 1; i++) {
            if ((shortestPath[i] === edge.from && shortestPath[i + 1] === edge.to) ||
                (shortestPath[i] === edge.to && shortestPath[i + 1] === edge.from)) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className={`flex flex-col lg:flex-row items-stretch w-full h-full min-h-[500px] gap-8 p-4 ${className}`}>

            {/* Left: Graph Visualization */}
            <div className="flex-[2] relative bg-[#050505] rounded-[2rem] border border-white overflow-hidden shadow-2xl flex items-center justify-center p-4">
                {/* Cinematic Overlay */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                <svg viewBox="0 0 500 400" className="w-full h-full max-h-[500px]">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Edges */}
                    {edges.map((edge, idx) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        const isActive = activeEdge &&
                            ((activeEdge.from === edge.from && activeEdge.to === edge.to) ||
                                (activeEdge.from === edge.to && activeEdge.to === edge.from));

                        const inPath = isEdgeInPath(edge);

                        return (
                            <g key={`edge-${idx}`}>
                                <motion.line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke={inPath ? colors.path : isActive ? colors.checking : 'rgba(255,255,255,0.1)'}
                                    strokeWidth={inPath ? 4 : isActive ? 3 : 2}
                                    animate={{
                                        stroke: inPath ? colors.path : isActive ? colors.checking : 'rgba(255,255,255,0.1)',
                                        opacity: inPath || isActive ? 1 : 0.4
                                    }}
                                    filter={inPath || isActive ? "url(#glow)" : "none"}
                                />
                                {/* Weight Label */}
                                <rect
                                    x={(fromNode.x + toNode.x) / 2 - 10}
                                    y={(fromNode.y + toNode.y) / 2 - 10}
                                    width="20" height="20" rx="4"
                                    fill="#050505"
                                    className="opacity-80"
                                />
                                <text
                                    x={(fromNode.x + toNode.x) / 2}
                                    y={(fromNode.y + toNode.y) / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isActive ? colors.checking : 'rgba(255,255,255,0.4)'}
                                    fontSize="12"
                                    fontWeight="bold"
                                >
                                    {edge.weight}
                                </text>
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const isVisited = visited.includes(node.id);
                        const isCurrent = current === node.id;
                        const isChecking = checking === node.id;
                        const isUpdating = updating === node.id;
                        const inPath = isNodeInPath(node.id);

                        let nodeColor = colors.idle;
                        let scale = 1;
                        let strokeColor = 'rgba(255,255,255,0.2)';

                        if (inPath) {
                            nodeColor = colors.path;
                            strokeColor = colors.path;
                            scale = 1.1;
                        } else if (isCurrent) {
                            nodeColor = colors.current;
                            strokeColor = colors.current;
                            scale = 1.2;
                        } else if (isChecking) {
                            nodeColor = colors.checking;
                            strokeColor = colors.checking;
                            scale = 1.1;
                        } else if (isUpdating) {
                            nodeColor = colors.updating;
                            strokeColor = colors.updating;
                            scale = 1.15;
                        } else if (isVisited) {
                            nodeColor = colors.visited;
                            strokeColor = colors.visited;
                            scale = 1;
                        }

                        return (
                            <g key={`node-${node.id}`} className="cursor-pointer">
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="22"
                                    fill="#050505"
                                    stroke={strokeColor}
                                    strokeWidth="2"
                                    animate={{ scale }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="18"
                                    fill={nodeColor}
                                    initial={false}
                                    animate={{
                                        fill: nodeColor,
                                        opacity: isVisited || isCurrent || isChecking || isUpdating || inPath ? 0.3 : 0.05
                                    }}
                                />
                                <text
                                    x={node.x}
                                    y={node.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isVisited || isCurrent || inPath ? colors.text : colors.mutedText}
                                    fontSize="14"
                                    fontWeight="black"
                                >
                                    {node.label}
                                </text>
                                {/* Mini distance value above node */}
                                {distances[node.id] !== Infinity && (
                                    <motion.g
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <rect
                                            x={node.x - 15} y={node.y - 38}
                                            width="30" height="14" rx="4"
                                            fill={isUpdating ? colors.updating : "#1a1a1a"}
                                            className="transition-colors duration-300"
                                        />
                                        <text
                                            x={node.x}
                                            y={node.y - 30}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="10"
                                            fontWeight="bold"
                                        >
                                            {distances[node.id]}
                                        </text>
                                    </motion.g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Right: Distance Table */}
            <div className="flex-1 bg-[#050505] rounded-[2rem] border border-white p-6 flex flex-col shadow-2xl relative overflow-hidden">
                {/* Cinematic Overlay */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] z-0" />
                <div className="relative z-10 flex items-center justify-between mb-6">
                    <h3 className="text-white/60 text-xs font-bold uppercase tracking-[0.3em]">Distance Table</h3>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ffff00]" />
                        <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                    </div>
                </div>

                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                    {nodes.map((node) => {
                        const dist = distances[node.id];
                        const isVisited = visited.includes(node.id);
                        const isCurrent = current === node.id;
                        const isUpdating = updating === node.id;

                        // Dynamic styles based on state
                        let rowStyle = "bg-white/5 border-white/5";
                        let badgeStyle = "bg-white/10 text-white/40";
                        let textStyle = "text-white";

                        if (isCurrent) {
                            rowStyle = "bg-[#ffff00]/10 border-[#ffff00]/30";
                            badgeStyle = "bg-[#ffff00] text-black";
                        } else if (isUpdating) {
                            rowStyle = "bg-[#ff00ff]/10 border-[#ff00ff]/30";
                            badgeStyle = "bg-[#ff00ff]/20 text-[#ff00ff]";
                            textStyle = "text-[#ff00ff]";
                        } else if (isVisited) {
                            rowStyle = "bg-[#00ff88]/5 border-[#00ff88]/20 opacity-60";
                            badgeStyle = "bg-[#00ff88]/20 text-[#00ff88]";
                        }

                        return (
                            <motion.div
                                key={`table-row-${node.id}`}
                                layout
                                className={`flex items-center justify-between px-5 py-3 rounded-xl border transition-all duration-300 ${rowStyle}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${badgeStyle}`}>
                                        {node.label}
                                    </div>
                                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Node {node.id}</span>
                                </div>

                                <AnimatePresence mode='wait'>
                                    <motion.div
                                        key={dist}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`text-xl font-black ${dist === Infinity ? 'text-white/10' : textStyle}`}
                                    >
                                        {dist === Infinity ? '∞' : dist}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Legend/Info */}
                <div className="mt-auto pt-6 border-t border-white/5 grid grid-cols-2 gap-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffff00]" />
                        <span className="text-[10px] text-white/30 uppercase font-bold">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                        <span className="text-[10px] text-white/30 uppercase font-bold">Visited</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ffff]" />
                        <span className="text-[10px] text-white/30 uppercase font-bold">Relieving</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff00ff]" />
                        <span className="text-[10px] text-white/30 uppercase font-bold">Updated</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DijkstraVisualizer;
