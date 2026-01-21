import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DPVisualizer = ({ currentStep }) => {
    if (!currentStep || !currentStep.dpTable) {
        return (
            <div className="flex items-center justify-center h-full text-white/30 text-sm">
                Waiting for DP data...
            </div>
        );
    }

    const { dpTable, currentItem, currentCapacity, message } = currentStep;

    // Dimensions
    const rows = dpTable.length;
    const cols = dpTable[0].length;

    // Premium Colors
    const COLORS = {
        current: "bg-[#ff00ff]/30 text-[#ff00ff] border-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.4)]", // Pink
        activeRC: "bg-[#ffff00]/10 text-[#ffff00] border-[#ffff00]/30", // Yellow
        processed: "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20", // Green
        default: "bg-white/5 text-slate-400 border-white/5"
    };

    const getCellClass = (r, c) => {
        if (r === currentItem && c === currentCapacity) return COLORS.current;
        if (r === currentItem || c === currentCapacity) return COLORS.activeRC;
        if (r < currentItem || (r === currentItem && c < currentCapacity)) return COLORS.processed;
        return COLORS.default;
    };

    return (
        <div className="w-full h-full flex flex-col items-center">
            {/* Message Banner */}
            {message && (
                <div className="mb-6 z-20">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={message}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
                        >
                            <p className="text-white/80 text-xs uppercase tracking-wider font-medium font-mono">{message}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {/* Table Container */}
            <div className="w-full overflow-auto max-h-[400px] border border-white/10 rounded-xl bg-black/20 backdrop-blur-sm p-4 custom-scrollbar">
                <table className="border-collapse mx-auto">
                    <thead>
                        <tr>
                            <th className="p-2 text-xs font-bold text-white/40 border border-white/5 bg-white/5">I \ C</th>
                            {/* Column Headers */}
                            {Array.from({ length: cols }).map((_, i) => (
                                <th key={i} className={`p-2 text-xs font-mono font-medium border border-white/5 w-10 min-w-[2.5rem] ${i === currentCapacity ? 'text-[#ffff00] bg-[#ffff00]/10' : 'text-white/30'}`}>
                                    {i}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dpTable.map((row, r) => (
                            <tr key={r}>
                                {/* Row Header */}
                                <th className={`p-2 text-xs font-mono font-medium border border-white/5 min-w-[3rem] ${r === currentItem ? 'text-[#ffff00] bg-[#ffff00]/10' : 'text-white/30'}`}>
                                    {r === 0 ? 'Ø' : `#${r}`}
                                </th>
                                {/* Cells */}
                                {row.map((val, c) => (
                                    <td key={`${r}-${c}`} className="p-0 border border-white/5">
                                        <motion.div
                                            layout
                                            initial={false}
                                            animate={{
                                                scale: r === currentItem && c === currentCapacity ? 1.1 : 1,
                                            }}
                                            className={`w-10 h-10 flex items-center justify-center text-xs font-bold font-mono transition-colors duration-200 border border-transparent ${getCellClass(r, c)}`}
                                        >
                                            {val}
                                        </motion.div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-6 flex-wrap justify-center">
                <div className="flex items-center gap-2 text-xs text-white/50 uppercase font-bold tracking-wider">
                    <div className="w-3 h-3 bg-[#ff00ff]/30 border border-[#ff00ff] rounded"></div> Current
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 uppercase font-bold tracking-wider">
                    <div className="w-3 h-3 bg-[#ffff00]/10 border border-[#ffff00]/30 rounded"></div> Row/Col
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 uppercase font-bold tracking-wider">
                    <div className="w-3 h-3 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded"></div> Processed
                </div>
            </div>
        </div>
    );
};

export default memo(DPVisualizer);
