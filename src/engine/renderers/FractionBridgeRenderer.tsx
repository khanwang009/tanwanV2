import React, { useState } from 'react';
import { RendererProps } from '../types';
import { ArrowRight, Merge, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function FractionBridgeRenderer({ level, onComplete }: RendererProps) {
  const { params } = level;
  const fracA = params?.fracA || [2, 3];
  const fracB = params?.fracB || [3, 5];
  const expectedA = params?.expectedA || [10, 15];
  const expectedB = params?.expectedB || [9, 15];
  const targetDenom = params?.targetDenom || 15;

  const [inputDenom, setInputDenom] = useState<string>("");
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: input denom, 2: visualize bridge, 3: result
  const [result, setResult] = useState<any>(null);

  const handleSubmit = () => {
    const denom = parseInt(inputDenom);
    if (isNaN(denom)) return;

    if (denom === targetDenom || (denom % fracA[1] === 0 && denom % fracB[1] === 0)) {
       setPhase(2);
       // Animation delay then evaluate
       setTimeout(() => {
          setPhase(3);
          const isOptimal = denom === targetDenom;
          setResult({ isCorrect: true, isOptimal });
          
          setTimeout(() => {
            onComplete({
              isCorrect: true,
              score: isOptimal ? 100 : 80, // penalty for not using LCM
              feedbackText: isOptimal ? '完美的公分母！桥梁成功连接。' : '桥梁已连接，但公分母还可以更小哦。',
              providedData: { inputDenom: denom }
            });
          }, 2500);
       }, 1500);
    } else {
       setPhase(3);
       setResult({ isCorrect: false });
       setTimeout(() => {
         onComplete({
           isCorrect: false,
           score: 0,
           feedbackText: '桥梁未能合拢，这不是他们的公倍数。',
           matchedErrorType: 'calculation_error', // or concept error
           providedData: { inputDenom: denom }
         });
       }, 2500);
    }
  };

  const renderFraction = (num: number, den: number, color: string) => (
    <div className={`flex flex-col items-center justify-center bg-[${color}] text-[#1A2639] rounded-lg w-16 h-20 shadow-[0_4px_0_rgba(0,0,0,0.3)] font-mono font-bold text-xl relative group`}>
       <div className="absolute top-1/2 left-2 right-2 h-[2px] bg-[rgba(0,0,0,0.5)] -translate-y-1/2"></div>
       <div className="mb-2">{num}</div>
       <div className="mt-2">{den}</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#1A2639] text-[#F5F7FA] p-6 rounded-[16px] overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4C8DA8] via-[#1A2639] to-[#162032] z-0"></div>

      <div className="z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-12 text-[#E1E5EB] tracking-wide flex items-center gap-3">
          搭建通分桥
          <Merge className="w-6 h-6 text-[#5BB9B0]" />
        </h2>

        {/* Bridge Area */}
        <div className="w-full flex items-center justify-between px-10 relative">
          
          {/* Left Block */}
          {renderFraction(
            phase === 1 ? fracA[0] : (phase >= 2 && result?.isCorrect !== false ? inputDenom/fracA[1]*fracA[0] : fracA[0]), 
            phase === 1 ? fracA[1] : (phase >= 2 && result?.isCorrect !== false ? Number(inputDenom) : fracA[1]), 
            "#5BB9B0"
          )}

          {/* The Bridge (Central area) */}
          <div className="flex-1 px-8 relative h-16 flex items-center justify-center">
             {/* Gap */}
             <div className="absolute w-full h-8 bg-[#121B27] rounded-full border border-[rgba(255,255,255,0.05)] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]"></div>
             
             {/* Bridge construction visual */}
             {phase >= 2 && result?.isCorrect !== false && (
                <div className="absolute bg-[#F5B041] h-4 rounded shadow-[0_0_20px_#F5B041] transition-all duration-1000 ease-out w-full border-t border-[#FFF]">
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBMMjAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-50"></div>
                </div>
             )}

             {/* Input Denom overlay */}
             {phase === 1 && (
                <div className="absolute z-20 flex flex-col items-center">
                  <span className="text-[10px] text-[#8A9EB8] mb-1">输入统一分母：</span>
                  <input 
                    type="number"
                    value={inputDenom}
                    onChange={(e) => setInputDenom(e.target.value)}
                    className="w-24 h-12 bg-[#2D3E5A] border-2 border-[#4C8DA8] rounded-xl text-center font-mono font-bold text-xl focus:outline-none focus:ring-2 ring-[#5BB9B0] transition-shadow shadow-[0_0_15px_rgba(76,141,168,0.3)] text-white"
                  />
                </div>
             )}
          </div>

          {/* Right Block */}
          {renderFraction(
            phase === 1 ? fracB[0] : (phase >= 2 && result?.isCorrect !== false ? inputDenom/fracB[1]*fracB[0] : fracB[0]), 
            phase === 1 ? fracB[1] : (phase >= 2 && result?.isCorrect !== false ? Number(inputDenom) : fracB[1]), 
            "#EF7D57"
          )}
        </div>

        {/* Action / Result */}
        <div className="mt-16 h-16 flex items-center justify-center">
           {phase === 1 ? (
             <button 
                onClick={handleSubmit}
                disabled={!inputDenom}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all 
                  ${inputDenom ? 'bg-[#4C8DA8] text-white hover:bg-[#5BB9B0] hover:scale-105 shadow-[0_4px_0_#2A657D] active:translate-y-1 active:shadow-none' : 'bg-[#2D3E5A] text-[#5A6D8C] opacity-50 cursor-not-allowed'}
                `}
             >
                架桥连接 <ArrowRight className="w-5 h-5"/>
             </button>
           ) : phase === 3 ? (
             <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border ${result?.isCorrect ? 'bg-[rgba(91,185,176,0.1)] border-[#5BB9B0] text-[#5BB9B0]' : 'bg-[rgba(239,125,87,0.1)] border-[#EF7D57] text-[#EF7D57]'}`}>
                {result?.isCorrect ? <CheckCircle2 className="w-6 h-6"/> : <AlertTriangle className="w-6 h-6"/>}
                <span className="font-bold text-lg">
                  {result?.isCorrect ? (result.isOptimal ? '完美连接' : '连接成功 (非最简分母)') : '分母错误，桥梁坍塌'}
                </span>
             </div>
           ) : (
             <div className="text-[#8A9EB8] font-mono animate-pulse">正在推演架构变形...</div>
           )}
        </div>
      </div>
    </div>
  );
}
