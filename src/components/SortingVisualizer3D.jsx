import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusing style constants for consistency
const COLORS = {
    active: { bg: 'bg-[#ffff00]/20', border: 'border-[#ffff00]', text: 'text-[#ffff00]', shadow: 'shadow-[#ffff00]/50' },
    swap: { bg: 'bg-[#00ff88]/20', border: 'border-[#00ff88]', text: 'text-[#00ff88]', shadow: 'shadow-[#00ff88]/50' },
    sorted: { bg: 'bg-[#00ffff]/20', border: 'border-[#00ffff]', text: 'text-[#00ffff]', shadow: 'shadow-[#00ffff]/50' },
    default: { bg: 'bg-white/5', border: 'border-white/10', text: 'text-slate-300', shadow: 'shadow-none' },
    special: { bg: 'bg-[#ff00ff]/20', border: 'border-[#ff00ff]', text: 'text-[#ff00ff]', shadow: 'shadow-[#ff00ff]/50' },
};

const SortingVisualizer3D = ({
    array = [],
    activeIndices = [],
    swappedIndices = [],
    sortedIndices = [],
    specialIndices = {}, // { min: idx, pivot: idx, etc. }
    message = "",
    isCompact = false
}) => {

    // Helper to determine status of an index
    const getStatus = (idx) => {
        if (Object.values(specialIndices).includes(idx)) return 'special';
        if (swappedIndices.includes(idx)) return 'swap';
        if (activeIndices.includes(idx)) return 'active';
        if (sortedIndices.includes(idx)) return 'sorted';
        return 'default';
    };

    return (
        <div className={`w-full bg-[#050505] rounded-[2.5rem] border border-white overflow-hidden shadow-2xl ${isCompact ? 'p-4 sm:p-6 min-h-[300px]' : 'p-4 sm:p-8 md:p-12 min-h-[400px]'} relative flex flex-col items-center justify-center`}>
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

            {/* Info Badge */}
            {message && (
                <div className="absolute top-6 left-6 z-10">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={message}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
                        >
                            <p className="text-white/80 text-xs uppercase tracking-wider font-medium">{message}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {/* The Sorting Array */}
            <div className="flex justify-center relative z-10 w-full overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex items-end justify-center px-4 gap-1 sm:gap-2 min-h-[150px] sm:min-h-[200px] w-full max-w-full">
                    <AnimatePresence mode='popLayout'>
                        {array.map((value, idx) => {
                            // If array contains objects with values, handle that, else assume numbers
                            const val = typeof value === 'object' ? value.value : value;
                            const key = typeof value === 'object' ? value.id : idx;

                            const status = getStatus(idx);
                            const style = COLORS[status];
                            const isSpecial = status === 'special';
                            const isActive = status === 'active';
                            const isSwapping = status === 'swap';

                            // Dynamic height based on value (normalize to some range if needed, or just use value directly if small)
                            // Assuming values 0-100 roughly. scaling:
                            const maxVal = Math.max(...array.map(v => typeof v === 'object' ? v.value : v), 100);
                            const heightPercentage = Math.max((val / maxVal) * 100, 10); // min 10% height

                            return (
                                <motion.div
                                    layout
                                    key={key}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: isSpecial || isSwapping ? 1.05 : 1,
                                        y: isSpecial ? -5 : 0,
                                        backgroundColor: style.bg
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25
                                    }}
                                    className={`
                                        relative flex flex-col items-center justify-end
                                        min-w-[0.5rem] w-full max-w-[3rem] font-mono font-bold
                                        rounded-t-sm sm:rounded-t-lg rounded-b-[2px] sm:rounded-b-md border shadow-lg transition-colors duration-300
                                        ${style.bg} ${style.border} ${style.text} ${style.shadow}
                                        flex-1
                                    `}
                                    style={{
                                        height: `${Math.max(heightPercentage * 1.5, 40)}px`, // Ensure minimum height of 40px for text visibility
                                        minHeight: '40px',
                                        maxHeight: '200px'
                                    }}
                                >
                                    <span className="mb-2 sm:mb-2 text-[10px] sm:text-sm drop-shadow-md z-10 truncate w-full text-center px-0.5">{val}</span>

                                    {/* Glass reflection effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-lg" />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Indices (Below) */}
            <div className="flex justify-center w-full px-4 mt-2 sm:mt-4 overflow-x-hidden">
                <div className="flex items-center justify-center gap-1 sm:gap-2 w-full max-w-full">
                    {array.map((_, idx) => (
                        <div key={idx} className="flex-1 w-full max-w-[3rem] text-center text-[8px] sm:text-[10px] text-white/30 font-mono">
                            {idx}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend (Bottom) */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-8 z-10 px-2">
                <LegendItem color={COLORS.active.bg} label="Active" />
                <LegendItem color={COLORS.swap.bg} label="Swap" />
                <LegendItem color={COLORS.sorted.bg} label="Sorted" />
                {Object.keys(specialIndices).length > 0 && <LegendItem color={COLORS.special.bg} label="Pivot" />}
            </div>
        </div>
    );
};

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
        <div className={`w-3 h-3 rounded-full ${color.split(' ')[0]} shadow-[0_0_8px_currentColor] border border-white/20`} />
        <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">{label}</span>
    </div>
);

export default SortingVisualizer3D;
