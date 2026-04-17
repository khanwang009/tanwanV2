import React, { useState, useEffect, Suspense } from 'react';
import { TrainingPack, LevelAttempt, LevelResult } from '../engine/types';
import { engineRegistry } from '../engine/registry';
import { updateMastery } from '../engine/mastery';
import { PlayCircle, Target, Award, ArrowRight, XCircle, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LevelPlayer({ pack, onExit }: { pack: TrainingPack, onExit: () => void }) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [attempts, setAttempts] = useState<LevelAttempt[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [levelStartTime, setLevelStartTime] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  const levels = pack.levels || [];
  const level = levels[currentLevelIndex];
  
  useEffect(() => {
    setLevelStartTime(Date.now());
  }, [currentLevelIndex]);

  if (!level && !isFinished) {
    return <div className="p-10 text-white font-mono">加载关卡配置异常...</div>;
  }

  const RendererComponent = !isFinished ? engineRegistry.getRenderer(level.templateId) : null;

  const handleLevelComplete = (result: LevelResult) => {
    const attempt: LevelAttempt = {
      levelId: level.id,
      knowledgeNodeId: level.knowledgeNodeId,
      startTime: levelStartTime,
      endTime: Date.now(),
      timeSpentMs: Date.now() - levelStartTime,
      isCorrect: result.isCorrect,
      score: result.score,
      errorTypesMatched: result.matchedErrorType ? [result.matchedErrorType] : [],
      submittedData: result.providedData
    };

    setAttempts(prev => [...prev, attempt]);
    setSessionScore(prev => prev + result.score);

    // Short delay before advancing
    setTimeout(() => {
      if (currentLevelIndex < levels.length - 1) {
        setCurrentLevelIndex(prev => prev + 1);
      } else {
        // Finish flow
        updateMastery([...attempts, attempt]);
        setIsFinished(true);
      }
    }, 2000); // Give user time to see the renderer's own feedback animation
  };

  const handleSkip = () => {
    if (currentLevelIndex < levels.length - 1) {
        setCurrentLevelIndex(prev => prev + 1);
    } else {
        updateMastery(attempts);
        setIsFinished(true);
    }
  }

  if (isFinished) {
    const maxScore = levels.length * 100;
    const finalScore = Math.round((sessionScore / maxScore) * 100) || 0;
    
    return (
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="flex flex-col items-center justify-center p-10 h-full w-full bg-[#1A2639] fixed inset-0 z-50"
      >
        <motion.div 
           initial={{ scale: 0.8, y: 50, opacity: 0 }}
           animate={{ scale: 1, y: 0, opacity: 1 }}
           transition={{ type: "spring", stiffness: 300, damping: 20 }}
           className="bg-[#24354F] border border-[#3D5275] p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-lg w-full"
        >
          <motion.div
             initial={{ rotate: -180, scale: 0 }}
             animate={{ rotate: 0, scale: 1 }}
             transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
             <Award className="w-24 h-24 text-[#F5B041] mb-2 drop-shadow-[0_0_15px_rgba(245,176,65,0.6)]" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white font-sans tracking-wide">训练完成！</h2>
          <div className="text-center text-[#8A9EB8]">
             <p className="mb-2">本次完成关卡：<span className="text-white font-bold">{levels.length}</span></p>
             <p className="text-lg">综合评分：<span className="text-[#5BB9B0] font-mono text-2xl font-bold ml-2">{finalScore}</span></p>
          </div>
          <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={onExit}
             className="px-8 py-3 bg-[#4C8DA8] hover:bg-[#5BB9B0] text-white rounded-full font-bold shadow-[0_4px_0_#2A657D] active:shadow-none transition-colors w-full mt-4"
          >
            返回控制台
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  const templateConfig = engineRegistry.getTemplate(level.templateId);

  return (
    <div className="fixed inset-0 bg-[#0F172A] z-50 flex flex-col font-sans">
      {/* Header Bar */}
      <div className="h-16 bg-[#1A2639] border-b border-[#2A3B56] flex items-center justify-between px-6 shadow-md shrink-0">
         <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-[#8A9EB8] hover:text-white p-2 rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
            <div className="w-[1px] h-6 bg-[#2A3B56]"></div>
            <div>
               <div className="text-white font-bold text-lg tracking-wide">{pack.themeName}</div>
               <div className="text-[10px] text-[#4C8DA8] uppercase tracking-wider font-mono">Mission Control</div>
            </div>
         </div>
         
         {/* Progress Bar Container */}
         <div className="flex-1 max-w-md mx-8 flex items-center gap-3">
            <span className="text-[#8A9EB8] text-xs font-mono font-bold">LVL {currentLevelIndex + 1}/{levels.length}</span>
            <div className="flex-1 h-3 bg-[#121B27] rounded-full overflow-hidden border border-[#2A3B56]">
               <motion.div 
                 className="h-full bg-gradient-to-r from-[#4C8DA8] to-[#5BB9B0]"
                 initial={{ width: `${(currentLevelIndex / levels.length) * 100}%` }}
                 animate={{ width: `${((currentLevelIndex) / levels.length) * 100}%` }}
                 transition={{ type: "spring", stiffness: 100, damping: 20 }}
               ></motion.div>
            </div>
         </div>

         <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
             <span className="text-[10px] text-[#8A9EB8] uppercase">积分</span>
             <motion.span 
               key={sessionScore}
               initial={{ scale: 1.5, color: "#F5B041" }}
               animate={{ scale: 1, color: "#FFFFFF" }}
               className="font-mono font-bold text-lg leading-none"
             >
               {sessionScore}
             </motion.span>
           </div>
           <Award className="w-8 h-8 text-[#F5B041]" />
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Info Panel (Game HUD) */}
        <div className="w-72 bg-[#162032] border-r border-[#2A3B56] p-6 flex flex-col gap-6 shrink-0 relative z-10 shadow-[5px_0_15px_rgba(0,0,0,0.3)]">
           <div className="bg-[#24354F] border border-[#3D5275] rounded-xl p-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#5BB9B0]"></div>
              <h3 className="text-xs text-[#8A9EB8] uppercase tracking-wider mb-1">当前目标</h3>
              <p className="text-white font-bold text-sm">{level.goal}</p>
           </div>

           <div>
              <h3 className="text-xs text-[#8A9EB8] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target className="w-3 h-3"/> 任务参数</h3>
              <div className="bg-black/20 rounded-lg p-3 border border-[#2A3B56] flex flex-col gap-2">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-[#5A6D8C]">类型:</span>
                   <span className="text-[#4C8DA8] bg-[#1A2639] px-2 py-0.5 rounded uppercase">{level.levelType}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-[#5A6D8C]">难度:</span>
                   <span className={`text-${level.difficulty==='hard'?'#EF7D57':level.difficulty==='medium'?'#F5B041':'#5BB9B0'} bg-[#1A2639] px-2 py-0.5 rounded uppercase font-bold`}>{level.difficulty}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-[#5A6D8C]">知识点:</span>
                   <span className="text-white font-mono">{level.knowledgeNodeId}</span>
                 </div>
              </div>
           </div>

           <div className="mt-auto">
             <div className="flex items-center gap-2 mb-2 text-[#5A6D8C] text-xs">
               <span className="w-2 h-2 rounded-full bg-[#4C8DA8] animate-pulse"></span>
               引擎协议载入中...
             </div>
             <div className="text-[10px] text-[#4A5568] font-mono break-all leading-tight opacity-50">
               SYS.LOAD({templateConfig?.id || level.templateId})<br/>
               RENDERER: {templateConfig?.renderer}<br/>
               CAT: {templateConfig?.category}
             </div>
             <button onClick={handleSkip} className="mt-4 w-full py-2 bg-transparent border border-[#3D5275] text-[#8A9EB8] rounded-[6px] text-xs hover:bg-[#24354F] hover:text-white transition flex items-center justify-center gap-1">
                跳过此关 <SkipForward className="w-3 h-3"/>
             </button>
           </div>
        </div>

        {/* Engine Render Area */}
        <div className="flex-1 bg-[#0F172A] p-8 relative overflow-hidden flex flex-col">
           <AnimatePresence mode="wait">
             <motion.div
               key={level.id}
               initial={{ x: 50, opacity: 0, scale: 0.95 }}
               animate={{ x: 0, opacity: 1, scale: 1 }}
               exit={{ x: -50, opacity: 0, scale: 0.95 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               className="flex-1 flex flex-col h-full"
             >
               {RendererComponent ? (
                 <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#4C8DA8] animate-pulse">初始化引擎模块...</div>}>
                   <RendererComponent level={level} onComplete={handleLevelComplete} />
                 </Suspense>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#2A3B56] rounded-[16px] text-[#5A6D8C]">
                   <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                   <p>模板 {level.templateId} 未实现渲染器</p>
                   <button onClick={handleSkip} className="mt-6 px-6 py-2 bg-[#2D3E5A] text-white rounded hover:bg-[#344869]">强制跳过并得分</button>
                 </div>
               )}
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
