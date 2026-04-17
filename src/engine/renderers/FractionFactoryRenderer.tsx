import React, { useState } from 'react';
import { PieChart, CheckCircle2, XCircle } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function FractionFactoryRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [slices, setSlices] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // MVP goal: How to represent 1/4 (require setting the overall slices to 4)
  const targetNumerator = 1;
  const targetDenominator = 4;

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = slices === targetDenominator;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['concept_error'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFAFA] text-[#333] rounded-[16px] overflow-hidden border border-[#FFE4E1] shadow-xl relative">
      <div className="bg-[#FFF0F5] px-6 py-4 flex justify-between items-center border-b border-[#FFE4E1]">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF69B4]/20 p-2 rounded-full border border-[#FF69B4]/50">
            <PieChart className="w-5 h-5 text-[#FF69B4]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-[#4A148C]">{level.title}</h3>
            <p className="text-[12px] text-[#888]">模板 T11：分数切片工厂</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FFFAFA] to-[#FFF0F5]">
        
        <div className="text-center mb-8">
            <p className="text-[18px] text-[#4A148C] font-medium leading-relaxed">
             要得到一块代表 <span className="font-bold text-[24px] text-[#FF69B4] inline-block px-2 bg-white rounded shadow-sm border border-[#FFE4E1]">{targetNumerator}/{targetDenominator}</span> 的蛋糕，<br/>你应该把这块蛋糕平均分成几块？
            </p>
        </div>

        {/* Visual cake */}
        <div className="relative w-64 h-64 rounded-full bg-[#FFE4E1] border-4 border-[#FFB6C1] shadow-[0_10px_30px_rgba(255,105,180,0.2)] mb-8 overflow-hidden group">
            {/* The cake slices (represented purely via rotated sectors or lines for MVP) */}
            <div className="absolute inset-0 rounded-full bg-[#FFB6C1]"></div>
            
            {Array.from({length: slices}).map((_, i) => (
                <div 
                   key={i}
                   className="absolute w-full h-[2px] bg-white top-1/2 left-0 transform origin-center transition-all duration-500"
                   style={{ transform: `translateY(-50%) rotate(${(360 / slices) * i}deg)` }}
                ></div>
            ))}

            {/* If slices match target, show 1 slice highlighted */}
            {slices === targetDenominator && (
                <div 
                   className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FF69B4] opacity-50 transform origin-bottom-left transition-all mix-blend-multiply"
                ></div>
            )}
            
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.7)] rounded-full pointer-events-none"></div>
        </div>

        <div className="flex bg-white rounded-full p-2 shadow-sm border border-[#FFE4E1] items-center gap-6">
             <button onClick={() => !submitted && setSlices(Math.max(1, slices-1))} className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#FF69B4] font-bold text-xl hover:bg-[#FFE4E1] transition-colors">-</button>
             <div className="text-2xl font-bold text-[#4A148C] font-mono min-w-[3rem] text-center">{slices} 块</div>
             <button onClick={() => !submitted && setSlices(Math.min(12, slices+1))} className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#FF69B4] font-bold text-xl hover:bg-[#FFE4E1] transition-colors">+</button>
        </div>

      </div>

      <div className="p-6 bg-white border-t border-[#FFE4E1] flex justify-between items-center z-10 relative">
        <div className="text-[14px]">
          {submitted ? (
             <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#FF69B4]' : 'text-red-500'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "切片精确！你理解了分母的意义。" : "大小不一致，这样切分不对哦。"}
            </div>
          ) : (
            <p className="text-[#888]">调整切片数量后切下蛋糕</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`px-8 py-3 rounded-full font-bold transition-all shadow-[0_4px_0_rgba(255,105,180,0.3)] ${
             !submitted
              ? "bg-[#FF69B4] text-white hover:bg-[#FF1493] active:translate-y-1 active:shadow-none"
              : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed shadow-none"
          }`}
        >
          切开这块蛋糕
        </button>
      </div>

      {submitted && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none">
           <div className={`transform scale-150 p-6 rounded-full ${isCorrect ? 'bg-[#FF69B4]/10 text-[#FF69B4]' : 'bg-red-100 text-red-500'} animate-bounce`}>
            {isCorrect ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
          </div>
        </div>
      )}
    </div>
  );
}
