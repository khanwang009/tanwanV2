import React, { useState } from 'react';
import { Scale, CheckCircle2, XCircle } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function BalanceLabRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [selectedStrategy, setSelectedStrategy] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // MVP: Strategy selector "8个物品找1个次品(较轻)，最少称几次保证找出？"
  // Best strategy is split into 3,3,2
  const correctOption = 2; // "称2次"

  const handleSubmit = () => {
    if (selectedStrategy === 0) return;
    
    setSubmitted(true);
    const correct = selectedStrategy === correctOption;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['strategy_error', 'reverse_reasoning'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  // Determine scale tilt based on selected state
  const getTilt = () => {
    if (!selectedStrategy) return 0;
    return selectedStrategy % 2 === 0 ? 10 : -10; // playful tilt
  };

  return (
    <div className="flex flex-col h-full bg-[#1E293B] text-white rounded-[16px] overflow-hidden border border-[#334155] shadow-2xl relative">
      <div className="bg-[#0F172A] px-6 py-4 flex justify-between items-center border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <div className="bg-[#F5B041]/20 p-2 rounded-lg border border-[#F5B041]/50">
            <Scale className="w-5 h-5 text-[#F5B041]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px]">{level.title}</h3>
            <p className="text-[12px] text-[#94A3B8]">模板 T16：天平实验室</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
         
         <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
             className="bg-[#334155]/50 border border-[#475569] p-6 rounded-2xl mb-12 max-w-xl w-full text-center shadow-lg"
         >
             <p className="text-[20px] font-medium leading-relaxed tracking-wide">
                 有 8 个完全相同的零件，其中一个是次品（质量更且轻一些）。<br/>使用无砝码天平，<span className="text-[#F5B041] font-bold">至少称几次</span>一定能找出这个次品？
             </p>
         </motion.div>

         {/* Visual Scale representation */}
         <div className="mb-12 relative flex flex-col items-center">
             <motion.div 
                 animate={{ rotate: getTilt() }}
                 transition={{ type: "spring", stiffness: 100, damping: 10 }}
                 className="w-48 h-2 bg-[#64748B] rounded-full relative mb-12 origin-center z-10"
             >
                 {/* Left pan line */}
                 <motion.div animate={{ rotate: -getTilt() }} className="absolute left-4 top-2 w-[2px] h-12 bg-[#475569] origin-top">
                    <div className="absolute left-[-22px] top-[48px] w-12 h-2 bg-[#94A3B8] rounded-[50%]"></div>
                 </motion.div>
                 {/* Right pan line */}
                 <motion.div animate={{ rotate: -getTilt() }} className="absolute right-4 top-2 w-[2px] h-12 bg-[#475569] origin-top">
                    <div className="absolute left-[-22px] top-[48px] w-12 h-2 bg-[#94A3B8] rounded-[50%]"></div>
                 </motion.div>
                 
             </motion.div>
             {/* Center pivot */}
             <div className="absolute left-1/2 -ml-2 top-[3px] w-0 h-0 border-b-[20px] border-b-[#F5B041] border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent z-0"></div>
             
             {/* Options */}
             <div className="flex gap-6 mt-8">
                {[1, 2, 3, 4].map(num => (
                    <motion.button
                        key={num}
                        whileHover={!submitted ? { scale: 1.1, y: -5 } : {}}
                        whileTap={!submitted ? { scale: 0.95 } : {}}
                        onClick={() => !submitted && setSelectedStrategy(num)}
                        className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center transition-colors ${
                            selectedStrategy === num
                            ? "bg-[#F5B041]/20 border-[#F5B041] shadow-[0_0_20px_#F5B041]"
                            : "bg-[#0F172A] border-[#334155] hover:border-[#64748B] hover:bg-[#1E293B]"
                        }`}
                    >
                        <span className="text-3xl font-bold font-mono text-white">{num}</span>
                        <span className="text-[12px] text-[#94A3B8]">次</span>
                    </motion.button>
                ))}
             </div>
         </div>
      </div>

      <div className="p-6 bg-[#0F172A] border-t border-[#334155] flex justify-between items-center z-10 relative">
        <div className="text-[14px]">
          {submitted ? (
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#5BB9B0]' : 'text-[#EF7D57]'}`}
             >
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "策略最优！分组逻辑清晰。" : "次数还可以更少，记得分成三组哦。"}
            </motion.div>
          ) : (
            <p className="text-[#94A3B8]">选择你认为的最优策略</p>
          )}
        </div>
        <motion.button
          whileHover={selectedStrategy && !submitted ? { scale: 1.05 } : {}}
          whileTap={selectedStrategy && !submitted ? { scale: 0.95 } : {}}
          onClick={handleSubmit}
          disabled={!selectedStrategy || submitted}
          className={`px-10 py-3 rounded-lg font-bold uppercase tracking-widest border border-[#475569] transition-colors ${
             selectedStrategy && !submitted
              ? "bg-[#F5B041] text-[#1E293B] shadow-[0_0_15px_rgba(245,176,65,0.4)] border-[#F5B041] hover:bg-[#F2CD6A]"
              : "bg-[#1E293B] text-[#64748B] cursor-not-allowed"
          }`}
        >
          确定策略
        </motion.button>
      </div>

       <AnimatePresence>
       {submitted && (
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none"
        >
           <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1.5, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className={`p-6 rounded-full ${isCorrect ? 'bg-[#5BB9B0]/20 text-[#5BB9B0]' : 'bg-[#EF7D57]/20 text-[#EF7D57]'}`}
           >
            {isCorrect ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
