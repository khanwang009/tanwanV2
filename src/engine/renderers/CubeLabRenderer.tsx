import React, { useState } from 'react';
import { Cuboid, CheckCircle2, XCircle } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function CubeLabRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [cubes, setCubes] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // MVP level: Given a picture of a cube formation, count them.
  const correctAnswer = 7;

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = cubes === correctAnswer;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['spatial_reasoning', 'structure_error'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  // Cube data for animating individually
  const cubeConfig = [
    { bottom: 40, left: 60, z: 0, color: "#D96C4A" },
    { bottom: 60, left: 90, z: 0, color: "#EF7D57" },
    { bottom: 20, left: 90, z: 0, color: "#D96C4A" },
    { bottom: 40, left: 120, z: 0, color: "#EF7D57" },
    { bottom: 0, left: 120, z: 0, color: "#D96C4A" },
    { bottom: 20, left: 90, z: 40, color: "#F2CD6A" },
    { bottom: 40, left: 120, z: 40, color: "#F5B041" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1A2642] text-white rounded-[16px] overflow-hidden border border-[#2C3E5D] shadow-2xl relative">
      <div className="bg-[#2C3E5D] px-6 py-4 flex justify-between items-center border-b border-[#3A4B6E]">
        <div className="flex items-center gap-3">
          <div className="bg-[#E7A93A]/20 p-2 rounded-lg border border-[#E7A93A]/50">
            <Cuboid className="w-5 h-5 text-[#E7A93A]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px]">{level.title}</h3>
            <p className="text-[12px] text-[#A0B0C0]">模板 T09：方块建造实验室</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-8 gap-12 relative overflow-hidden">
        {/* Isometric representation */}
        <div className="relative w-64 h-64 flex items-center justify-center scale-150 drop-shadow-2xl">
            {cubeConfig.map((cube, i) => (
                <motion.div 
                   key={i}
                   initial={{ y: -200, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ 
                     type: "spring", 
                     bounce: 0.5,
                     stiffness: 150, 
                     damping: 10, 
                     delay: i * 0.15 
                   }}
                   className="absolute w-12 h-12 shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]" 
                   style={{
                     backgroundColor: cube.color,
                     transform: `rotateX(60deg) rotateZ(-45deg) translateZ(${cube.z}px)`, 
                     bottom: cube.bottom, 
                     left: cube.left
                   }}
                />
            ))}
        </div>

        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className="bg-[#2C3E5D] p-8 rounded-[20px] shadow-lg border border-[#4A648A] flex flex-col items-center z-10"
        >
            <h4 className="text-[16px] font-bold mb-6 text-white text-center">左侧图形一共由多少个<br/>小正方体组成？</h4>
            <div className="flex gap-4 items-center mb-6">
                <motion.button 
                   whileHover={!submitted ? { scale: 1.1 } : {}}
                   whileTap={!submitted ? { scale: 0.9 } : {}}
                   onClick={() => !submitted && setCubes(Math.max(1, cubes-1))} 
                   disabled={submitted} 
                   className="w-12 h-12 rounded-full bg-[#1A2642] text-xl font-bold flex items-center justify-center hover:bg-[#4A648A] transition-colors disabled:opacity-50"
                >
                  -
                </motion.button>
                <motion.div 
                   key={cubes}
                   initial={{ scale: 1.2, color: "#fff" }}
                   animate={{ scale: 1, color: "#F5B041" }}
                   transition={{ type: "spring", stiffness: 300, damping: 15 }}
                   className="w-24 h-16 bg-[#151F36] rounded-xl flex items-center justify-center text-3xl font-bold shadow-inner font-mono"
                >
                  {cubes}
                </motion.div>
                <motion.button 
                   whileHover={!submitted ? { scale: 1.1 } : {}}
                   whileTap={!submitted ? { scale: 0.9 } : {}}
                   onClick={() => !submitted && setCubes(cubes+1)} 
                   disabled={submitted} 
                   className="w-12 h-12 rounded-full bg-[#1A2642] text-xl font-bold flex items-center justify-center hover:bg-[#4A648A] transition-colors disabled:opacity-50"
                >
                  +
                </motion.button>
            </div>
            <p className="text-[12px] text-[#A0B0C0]">提示：注意被遮挡的底层方块</p>
        </motion.div>
      </div>

      <div className="p-6 bg-[#0F141F] border-t border-[#2C3E5D] flex justify-between items-center z-10 relative">
        <div className="text-[14px]">
          {submitted ? (
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#5BB9B0]' : 'text-[#EF7D57]'}`}
             >
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "透视力满分！计算正确。" : "有方块被遗漏了！再找找。"}
            </motion.div>
          ) : (
            <p className="text-[#A0B0C0]">数出方块数量并提交</p>
          )}
        </div>
        <motion.button
          whileHover={!submitted ? { scale: 1.05 } : {}}
          whileTap={!submitted ? { scale: 0.95 } : {}}
          onClick={handleSubmit}
          disabled={submitted}
          className={`px-8 py-3 rounded-full font-bold transition-colors shadow-[0_4px_0_rgba(0,0,0,0.3)] ${
             !submitted
              ? "bg-[#E7A93A] text-[#553C0C] hover:bg-[#F2CD6A]"
              : "bg-[#2C3E5D] text-[#A0B0C0] cursor-not-allowed border-none shadow-none"
          }`}
        >
          清点完毕
        </motion.button>
      </div>

      <AnimatePresence>
      {submitted && (
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none"
        >
           <motion.div 
              initial={{ scale: 0, rotate: 45 }}
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
