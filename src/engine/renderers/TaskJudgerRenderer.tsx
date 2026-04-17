import React, { useState } from 'react';
import { RendererProps } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TaskJudgerRenderer({ level, onComplete }: RendererProps) {
  const { params } = level;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = params?.options || ['表面积', '体积', '底面积+侧面积', '周长'];
  const correctIndex = params?.correctIndex ?? 2;
  const questionText = params?.text || '一个无盖鱼缸至少需要多少玻璃？';

  const handleSubmit = (index: number) => {
    if (submitted) return;
    setSelectedIndex(index);
    setSubmitted(true);
    
    const isCorrect = index === correctIndex;
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackText: isCorrect ? '判断完全正确！无盖代表缺少顶面。' : '思路偏离，请注意由于是“无盖”，所以不能用完整的表面积。',
        matchedErrorType: isCorrect ? undefined : 'concept_error',
        providedData: { selectedIndex: index },
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A2639] text-[#F5F7FA] p-6 rounded-[16px] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <motion.div 
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ type: "spring", stiffness: 200, damping: 20 }}
           className="bg-[#2A3B56] p-6 rounded-xl border-t-2 border-l-2 border-[#3D5275] shadow-lg mb-8 w-full z-10"
        >
          <h2 className="text-xl font-bold text-center leading-relaxed font-sans tracking-wide">
            {questionText}
            <div className="mt-4 text-sm text-[#4C8DA8] font-normal">请判断以上问题属于哪种数学求值域：</div>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full perspective-1000">
          {options.map((opt: string, i: number) => {
            const isSelected = selectedIndex === i;
            const isCorrectOption = i === correctIndex;
            
            let btnClass = "relative overflow-hidden group bg-[#2D3E5A] border-[#1B2A43] rounded-xl p-5 flex justify-center items-center text-lg font-bold ";
            let colorSettings = { bg: "#2D3E5A", text: "#F5F7FA", border: "transparent", shadow: "0_4px_0_#1B2A43" };
            
            if (submitted) {
               btnClass = "relative overflow-hidden rounded-xl p-5 flex justify-center items-center text-lg font-bold ";
               if (isSelected && isCorrectOption) {
                 btnClass += "shadow-[0_0_20px_rgba(91,185,176,0.3)] z-10";
                 colorSettings = { bg: "#1E4D43", text: "#5BB9B0", border: "#5BB9B0", shadow: "none" };
               } else if (isSelected && !isCorrectOption) {
                 btnClass += "opacity-80";
                 colorSettings = { bg: "#4A2525", text: "#EF7D57", border: "#EF7D57", shadow: "none" };
               } else if (!isSelected && isCorrectOption) {
                 btnClass += "opacity-90";
                 colorSettings = { bg: "#2D3E5A", text: "#5BB9B0", border: "#5BB9B0", shadow: "none" };
               } else {
                 btnClass += "opacity-40";
                 colorSettings = { bg: "#1B2A43", text: "#666666", border: "transparent", shadow: "none" };
               }
            }

            return (
              <motion.button 
                key={i} 
                className={btnClass}
                style={{ 
                  backgroundColor: colorSettings.bg, 
                  color: colorSettings.text,
                  border: `2px solid ${colorSettings.border}`,
                  boxShadow: colorSettings.shadow
                }}
                onClick={() => handleSubmit(i)}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.1 * i, type: "spring", stiffness: 100 }
                }}
                whileHover={!submitted ? { scale: 1.05, y: -2 } : {}}
                whileTap={!submitted ? { scale: 0.95, y: 2, boxShadow: "none" } : {}}
                layout
              >
                 <span className="relative z-10">{opt}</span>
                 <AnimatePresence>
                   {submitted && isSelected && isCorrectOption && (
                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4">
                       <CheckCircle2 className="w-6 h-6 text-[#5BB9B0]" />
                     </motion.div>
                   )}
                   {submitted && isSelected && !isCorrectOption && (
                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4">
                       <XCircle className="w-6 h-6 text-[#EF7D57]" />
                     </motion.div>
                   )}
                   {submitted && !isSelected && isCorrectOption && (
                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 opacity-50">
                       <CheckCircle2 className="w-6 h-6 text-[#5BB9B0]" />
                     </motion.div>
                   )}
                 </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
