import React, { useState } from 'react';
import { RendererProps } from '../types';
import { Droplets, ArrowUpCircle } from 'lucide-react';

export default function ContainerLabRenderer({ level, onComplete }: RendererProps) {
  const { params } = level;
  // Fallback defaults
  const baseArea = params?.baseArea || 100;
  const initialLevel = params?.currentLevel || 5;
  const addedVolume = params?.addVolume || 200;
  const targetLevel = params?.targetLevel || 7;  // 5 + 200/100 = 7

  const [inputLevel, setInputLevel] = useState<number>(initialLevel);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const containerHeight = 15;
  
  // Visual calculation
  const getPercent = (l: number) => Math.min(100, Math.max(0, (l / containerHeight) * 100));

  const handleDrag = (e: any) => {
    if (submitted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentFromTop = y / rect.height;
    const percentFromBottom = 1 - percentFromTop;
    const newVal = Math.round(percentFromBottom * containerHeight * 10) / 10;
    
    if (newVal >= initialLevel && newVal <= containerHeight) {
       setInputLevel(newVal);
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    
    const isCorrect = Math.abs(inputLevel - targetLevel) < 0.2; // slight tolerance for drag

    setResult({ isCorrect });
    
    // Auto-adjust to exact correct if close but wrong, or if wrong just show correct
    if (!isCorrect) {
       setTimeout(() => setInputLevel(targetLevel), 1000);
    }

    setTimeout(() => {
      onComplete({
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackText: isCorrect ? '实验成功！计算非常精确。' : `实验失败。注入${addedVolume}L水，底面积为${baseArea}，水位应上升 ${addedVolume/baseArea}，到达 ${targetLevel}。`,
        matchedErrorType: isCorrect ? undefined : 'calculation_error',
        providedData: { inputLevel }
      });
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A2639] text-[#F5F7FA] p-6 rounded-[16px] shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
      
      <div className="flex-1 flex flex-col items-center justify-center gap-10">
        
        {/* Lab Info */}
        <div className="bg-[#24354F] px-8 py-4 rounded-xl border border-[#3D5275] flex items-center gap-8 shadow-lg">
           <div className="flex flex-col">
             <span className="text-[10px] text-[#8A9EB8] uppercase">底面积</span>
             <span className="text-xl font-mono font-bold text-[#F5B041]">{baseArea} dm²</span>
           </div>
           <div className="w-[1px] h-8 bg-[#3D5275]"></div>
           <div className="flex flex-col">
             <span className="text-[10px] text-[#8A9EB8] uppercase">注入水量</span>
             <span className="text-xl font-mono font-bold text-[#5BB9B0] flex items-center gap-1">
               <Droplets className="w-4 h-4"/> {addedVolume} L
             </span>
           </div>
        </div>

        {/* Interactive Container */}
        <div className="relative group w-48 h-80 bg-[rgba(255,255,255,0.02)] border-x-4 border-b-6 border-[rgba(255,255,255,0.2)] rounded-b-xl overflow-hidden backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           
           {/* Grid markings */}
           {Array.from({length: containerHeight}).map((_, i) => (
             <div key={i} className="absolute w-full h-[1px] bg-[rgba(255,255,255,0.05)]" style={{ bottom: `${(i/containerHeight)*100}%` }}>
                {i % 2 === 0 && <span className="absolute -left-6 bottom-0 text-[10px] text-[#5A6D8C]">{i}</span>}
             </div>
           ))}

           {/* Initial Water */}
           <div 
             className="absolute bottom-0 w-full bg-gradient-to-b from-[#2A657D] to-[#122A38] opacity-80 backdrop-blur-sm"
             style={{ height: `${getPercent(initialLevel)}%` }}
           >
              <div className="absolute top-0 w-full h-[2px] bg-[#4C8DA8] shadow-[0_0_10px_#4C8DA8]"></div>
           </div>

           {/* Interactive Water (Diff) */}
           <div 
             className={`absolute bottom-0 w-full bg-gradient-to-b from-[#4C8DA8] to-[rgba(76,141,168,0.2)] transition-all ${submitted ? 'duration-1000' : 'duration-75'} ease-out`}
             style={{ 
                height: `${getPercent(inputLevel)}%`, 
                clipPath: `inset(calc(100% - ${getPercent(inputLevel)}%) 0 0 0)` // hide overlap
             }}
           >
              {/* Drag handle line */}
              <div className="absolute top-0 w-full h-[4px] bg-[#5BB9B0] shadow-[0_0_15px_#5BB9B0] cursor-ns-resize" 
                   onMouseDown={(e) => {
                     // Basic simulation, in real app add window mousemove listeners
                   }}
              ></div>
           </div>

           {/* Invisible drag overlay */}
           <div 
             className="absolute inset-0 cursor-ns-resize" 
             onMouseMove={e => e.buttons === 1 ? handleDrag(e) : null}
             onClick={handleDrag}
           ></div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
           <div className="px-6 py-3 bg-[#24354F] rounded-lg border border-[#3D5275] font-mono text-xl w-32 justify-center flex">
             <span className={`${inputLevel === initialLevel ? 'text-[#8A9EB8]' : 'text-white'}`}>{inputLevel.toFixed(1)} dm</span>
           </div>
           
           <button 
             onClick={handleSubmit} 
             disabled={submitted || inputLevel === initialLevel}
             className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95
               ${submitted 
                 ? result?.isCorrect ? 'bg-[#5BB9B0] text-[#1A2639]' : 'bg-[#EF7D57] text-white'
                 : inputLevel > initialLevel 
                     ? 'bg-[#F5B041] text-[#7A4A00] hover:bg-[#F2CD6A] hover:-translate-y-1' 
                     : 'bg-[#2D3E5A] text-[#5A6D8C] cursor-not-allowed'
               }
             `}
           >
             <ArrowUpCircle className="w-5 h-5" />
             {submitted ? (result?.isCorrect ? '运算通过' : '运算偏差') : '确认注入量'}
           </button>
        </div>

      </div>
    </div>
  );
}
