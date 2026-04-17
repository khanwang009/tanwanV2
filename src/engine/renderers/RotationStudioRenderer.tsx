import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function RotationStudioRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [rotation, setRotation] = useState(0); // in degrees
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // MVP goal: Rotate a flag 90 degrees clockwise (which means 90deg total rotation)
  const targetRotation = 90;

  const handleRotate = (amount: number) => {
      if(submitted) return;
      // keep it bounded 0 to 270 just for simple snapping
      setRotation(prev => (prev + amount + 360) % 360);
  }

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = rotation === targetRotation;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['spatial_reasoning', 'concept_error'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1C23] text-white rounded-[16px] overflow-hidden border border-[#2D313A] shadow-2xl relative">
      <div className="bg-[#21242D] px-6 py-4 flex justify-between items-center border-b border-[#2D313A]">
        <div className="flex items-center gap-3">
          <div className="bg-[#4C8DA8]/20 p-2 rounded-lg border border-[#4C8DA8]/50">
            <RefreshCw className="w-5 h-5 text-[#4C8DA8]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px]">{level.title}</h3>
            <p className="text-[12px] text-[#A0A5B2]">模板 T14：旋转画室</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwIi8+PHBhdGggZD0iTTAgMjBoNDB6IiBzdHJva2U9IiMyZDMxM2EiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yMCAwdjQwIiBzdHJva2U9IiMyZDMxM2EiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] overflow-hidden">
        
        <div className="bg-[#21242D]/80 backdrop-blur-sm px-6 py-3 rounded-full border border-[#2D313A] mb-12 shadow-lg z-10 text-[18px]">
            请将中心的图形顺时针旋转 90°
        </div>

        {/* The artboard */}
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Origin indicator */}
            <div className="absolute w-4 h-4 bg-[#EF7D57] rounded-full z-20 shadow-[0_0_10px_#EF7D57]"></div>

            {/* The shape */}
            <div 
               className="absolute w-48 h-48 border-2 border-dashed border-[#4C8DA8]/40 rounded-full flex items-center justify-center transition-transform duration-500 ease-in-out"
               style={{transform: `rotate(${rotation}deg)`}}
            >
                {/* Visual shape: A flag sticking out to the right */}
                <div className="absolute w-24 h-2 bg-[#5BB9B0] right-0 rounded-r-full flex items-center pr-2">
                    {/* The flag banner */}
                    <div className="absolute bottom-2 right-4 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-[#F5B041] border-r-[30px] border-r-transparent transform -rotate-45"></div>
                </div>
            </div>

            {/* Target ghost (optional, hide for difficulty) */}
        </div>

        {/* Controls */}
        <div className="flex gap-6 mt-16 z-10 bg-[#21242D] p-4 rounded-full border border-[#2D313A] shadow-xl">
             <button onClick={() => handleRotate(-90)} className="flex items-center gap-2 px-4 py-2 bg-[#1A1C23] hover:bg-[#2A2D35] rounded-full text-[#A0A5B2] transition-colors border border-[#2D313A]">
                <RefreshCw className="w-4 h-4 transform -scale-x-100" />
                逆时针 90°
             </button>
             <button onClick={() => handleRotate(90)} className="flex items-center gap-2 px-4 py-2 bg-[#4C8DA8] hover:bg-[#5BB9B0] rounded-full text-white transition-colors shadow-[0_0_15px_rgba(76,141,168,0.3)]">
                顺时针 90°
                <RefreshCw className="w-4 h-4" />
             </button>
        </div>
      </div>

      <div className="p-6 bg-[#1A1C23] border-t border-[#2D313A] flex justify-between items-center z-10 relative">
        <div className="text-[14px]">
          {submitted ? (
             <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#5BB9B0]' : 'text-[#EF7D57]'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "完美变换！旋转角度完全匹配。" : "落点不对，请注意观察旋转中心和方向。"}
            </div>
          ) : (
            <p className="text-[#A0A5B2]">当前角度: {rotation}°</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitted || rotation === 0}
          className={`px-8 py-3 rounded-md font-bold transition-all shadow-[0_4px_0_rgba(0,0,0,0.5)] ${
             !submitted && rotation !== 0
              ? "bg-[#EF7D57] text-black hover:bg-[#F09477] active:translate-y-1 active:shadow-none"
              : "bg-[#21242D] text-[#555] cursor-not-allowed shadow-none border border-[#2D313A]"
          }`}
        >
          提交作品
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
