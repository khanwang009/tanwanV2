import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function CommonFactorStationRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [selectedOperation, setSelectedOperation] = useState<'gcd' | 'lcm' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // MVP level config: Word problem deciding between GCD and LCM
  const problemStatement = "用整分米长的正方形地砖铺满一个长24分米、宽18分米的房间（不损坏地砖），地砖的最大边长是多少？";
  const correctOperation = 'gcd';

  const handleSubmit = () => {
    if (!selectedOperation) return;
    
    setSubmitted(true);
    const correct = selectedOperation === correctOperation;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['concept_error', 'transfer_error'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] text-[#333] rounded-[16px] overflow-hidden border border-[#E0E0E0] shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3">
          <div className="bg-[#8A2BE2]/10 p-2 rounded-lg border border-[#8A2BE2]/30">
            <ArrowRightLeft className="w-5 h-5 text-[#8A2BE2]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-[#333]">{level.title}</h3>
            <p className="text-[12px] text-[#888]">模板 T06：公因数分配站</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F4F5F7]">
         <div className="bg-white p-8 rounded-[20px] shadow-sm max-w-2xl w-full border border-[#EAEAEA] mb-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4C8DA8] via-[#8A2BE2] to-[#EF7D57]"></div>
            <div className="mb-4">
               <span className="px-3 py-1 bg-[#8A2BE2]/10 text-[#8A2BE2] rounded-full text-xs font-bold uppercase tracking-widest">Mission Briefing</span>
            </div>
            <p className="text-[18px] leading-relaxed font-medium text-[#444] px-4">
                {problemStatement}
            </p>
         </div>

         <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
            <button
               onClick={() => !submitted && setSelectedOperation('gcd')}
               className={`relative overflow-hidden group flex flex-col items-center justify-center p-8 rounded-[24px] border-2 transition-all transform active:scale-95 ${
                   selectedOperation === 'gcd' 
                   ? 'bg-blue-50 border-blue-500 shadow-[0_10px_30px_rgba(59,130,246,0.2)]' 
                   : 'bg-white border-[#E0E0E0] hover:border-blue-300 hover:shadow-md'
               } ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
               <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl font-black ${selectedOperation==='gcd'?'bg-blue-500 text-white':'bg-blue-100 text-blue-500'}`}>大</div>
               <h4 className="text-xl font-bold text-[#333] mb-2">最大公因数</h4>
               <p className="text-sm text-[#777] text-center">寻找能将两者同时整除的最大单位</p>
            </button>

            <button
               onClick={() => !submitted && setSelectedOperation('lcm')}
               className={`relative overflow-hidden group flex flex-col items-center justify-center p-8 rounded-[24px] border-2 transition-all transform active:scale-95 ${
                   selectedOperation === 'lcm' 
                   ? 'bg-purple-50 border-purple-500 shadow-[0_10px_30px_rgba(168,85,247,0.2)]' 
                   : 'bg-white border-[#E0E0E0] hover:border-purple-300 hover:shadow-md'
               } ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
               <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl font-black ${selectedOperation==='lcm'?'bg-purple-500 text-white':'bg-purple-100 text-purple-500'}`}>小</div>
               <h4 className="text-xl font-bold text-[#333] mb-2">最小公倍数</h4>
               <p className="text-sm text-[#777] text-center">寻找两者能同时到达的最小终点</p>
            </button>
         </div>
      </div>

      <div className="p-6 bg-white border-t border-[#E0E0E0] flex justify-between items-center z-10 relative">
        <div className="text-[14px]">
          {submitted ? (
            <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-blue-600' : 'text-red-500'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "路线选择正确！" : "路线错误，请分析题意。"}
            </div>
          ) : (
            <p className="text-[#888]">请分配最合适的解题路线</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedOperation || submitted}
          className={`px-10 py-3.5 rounded-xl font-bold shadow-sm transition-all text-white ${
            selectedOperation && !submitted
              ? "bg-[#333] hover:bg-[#111] active:translate-y-0.5 active:shadow-none"
              : "bg-[#CCC] cursor-not-allowed"
          }`}
        >
          确认分配
        </button>
      </div>

      {submitted && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none">
           <div className={`transform scale-150 p-6 rounded-full ${isCorrect ? 'bg-blue-100 text-blue-500' : 'bg-red-100 text-red-500'} shadow-xl animate-bounce`}>
            {isCorrect ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
          </div>
        </div>
      )}
    </div>
  );
}
