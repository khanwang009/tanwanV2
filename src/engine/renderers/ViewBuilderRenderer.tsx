import React, { useState } from 'react';
import { Box, Target, CheckCircle2, XCircle } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function ViewBuilderRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // A simplistic grid for building the view (3x3 front view)
  const [gridState, setGridState] = useState(Array(9).fill(false));

  const correctAnswer = [
      false, true, false,
      true, true, true,
      false, false, false
  ]; // Looks like an upside-down T or podium

  const toggleCell = (index: number) => {
    if (submitted) return;
    const newGrid = [...gridState];
    newGrid[index] = !newGrid[index];
    setGridState(newGrid);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = JSON.stringify(gridState) === JSON.stringify(correctAnswer);
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['structure_error', 'spatial_reasoning'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#18181A] text-white rounded-[16px] overflow-hidden border-2 border-[#2A2A2E] relative border-b-8 border-b-[#2A2A2E]">
      <div className="bg-[#2A2A2E] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#EF7D57]/20 p-2 rounded-lg border border-[#EF7D57]/50 shadow-[0_0_10px_rgba(239,125,87,0.3)]">
            <Box className="w-5 h-5 text-[#EF7D57]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px]">{level.title}</h3>
            <p className="text-[12px] text-[#A0A0A0]">模板 T04：三视图拼搭台</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-8 gap-12 bg-gradient-to-br from-[#18181A] to-[#121214]">
        
        {/* Source Views */}
        <div className="bg-[#212124] rounded-2xl p-6 border border-[#333] shadow-lg">
           <h4 className="text-[14px] font-bold text-[#A0A0A0] text-center mb-6 uppercase tracking-wider border-b border-[#333] pb-2">Target Views</h4>
           <div className="flex gap-6">
              <div className="flex flex-col items-center">
                 <span className="text-[12px] mb-2 text-[#EF7D57] font-bold">正面</span>
                 <div className="grid grid-cols-3 gap-1 bg-[#18181A] p-2 rounded">
                    {[false, true, false, true, true, true, false, false, false].map((v, i) => (
                        <div key={i} className={`w-6 h-6 rounded-sm ${v ? 'bg-[#EF7D57] shadow-[0_0_5px_#EF7D57]' : 'bg-[#2A2A2E]'}`}></div>
                    ))}
                 </div>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[12px] mb-2 text-[#A0A0A0] font-bold">上面</span>
                 <div className="grid grid-cols-3 gap-1 bg-[#18181A] p-2 rounded opacity-50">
                    {[false, true, false, false, true, false, false, false, false].map((v, i) => (
                        <div key={i} className={`w-6 h-6 rounded-sm ${v ? 'bg-[#A0A0A0]' : 'bg-[#2A2A2E]'}`}></div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Builder Area */}
        <div className="flex flex-col items-center">
           <div className="mb-4 text-[#A0A0A0] text-[14px]">点击网格，在正面拼出对应的图形</div>
           <div className="bg-[#2A2A2E] p-4 rounded-[16px] shadow-[0_15px_30px_rgba(0,0,0,0.6)] border-b-4 border-[#1A1A1E]">
             <div className="grid grid-cols-3 gap-2">
                 {gridState.map((isActive, i) => (
                     <div 
                         key={i} 
                         onClick={() => toggleCell(i)}
                         className={`w-16 h-16 rounded-[8px] cursor-pointer transition-all transform hover:scale-105 active:scale-95 border border-[#333] ${
                             isActive 
                             ? "bg-gradient-to-t from-[#D96C4A] to-[#EF7D57] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_5px_15px_rgba(239,125,87,0.4)] border-none" 
                             : "bg-[#1F1F22] hover:bg-[#252529]"
                         }`}
                     ></div>
                 ))}
             </div>
           </div>
        </div>

      </div>

      <div className="p-6 bg-[#121214] border-t border-[#2A2A2E] flex justify-between items-center z-10 relative">
        <div className="text-[14px]">
          {submitted ? (
            <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#5BB9B0]' : 'text-[#EF7D57]'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "拼搭成功！完全吻合。" : "结构错误！请重新观察视图。"}
            </div>
          ) : (
            <p className="text-[#A0A0A0]">完成拼搭后提交</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitted || !gridState.some(v => v)}
          className={`px-8 py-3 rounded font-bold shadow-[0_4px_0_rgba(0,0,0,0.3)] transition-all ${
            (!submitted && gridState.some(v => v))
              ? "bg-[#EF7D57] text-[#3A1406] hover:bg-[#F09477] active:translate-y-1 active:shadow-none"
              : "bg-[#2A2A2E] text-[#555] cursor-not-allowed"
          }`}
        >
          生成验证
        </button>
      </div>

       {submitted && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none">
           <div className={`transform scale-150 p-6 rounded-full ${isCorrect ? 'bg-[#5BB9B0]/20 text-[#5BB9B0]' : 'bg-[#EF7D57]/20 text-[#EF7D57]'} animate-bounce`}>
            {isCorrect ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
          </div>
        </div>
      )}
    </div>
  );
}
