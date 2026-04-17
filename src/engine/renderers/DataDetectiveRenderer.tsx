import React, { useState } from 'react';
import { RendererProps } from '../types';
import { LineChart, Search, Crosshair } from 'lucide-react';

export default function DataDetectiveRenderer({ level, onComplete }: RendererProps) {
  const { params } = level;
  // Default data if params are missing
  const data = params?.data || [
    { x: '1月', y: 10 },
    { x: '2月', y: 15 },
    { x: '3月', y: 30 },
    { x: '4月', y: 32 }
  ];
  const question = params?.question || '哪两个月之间增长最快？';
  const correctIndex = params?.correctIndex ?? 1; // 1 means from 2月 to 3月 (index 1 to 2)

  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const maxVal = Math.max(...data.map((d:any) => d.y));

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedSegment(idx);
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const isCorrect = selectedSegment === correctIndex;
    setResult({ isCorrect });

    setTimeout(() => {
      onComplete({
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackText: isCorrect ? '侦探眼光锐利！这段折线最陡峭。' : '线索找错了。请看哪一段的倾斜度（斜率）最大。',
        providedData: { selectedSegment }
      });
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A2639] text-[#F5F7FA] p-6 rounded-[16px] shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
      
      <div className="flex items-center gap-3 mb-6 bg-[#24354F] w-fit px-5 py-3 rounded-full border border-[#3D5275] shadow-lg">
         <Search className="w-5 h-5 text-[#5BB9B0]" />
         <h2 className="font-bold text-[#E1E5EB]">{question}</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
         
         {/* Chart Area */}
         <div className="relative w-full max-w-2xl h-64 bg-[#121B27] border-l-2 border-b-2 border-[#3D5275] rounded-bl-lg mb-12 p-4 pt-10 pr-10">
            
            {/* Grid Lines */}
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t border-[rgba(255,255,255,0.05)]" style={{ bottom: `${(i/4)*100}%` }}>
                <span className="absolute -left-8 -top-3 text-[10px] text-[#5A6D8C]">{(maxVal * (i/4)).toFixed(0)}</span>
              </div>
            ))}

            {/* Drawing the points and lines */}
            <div className="absolute inset-0 pl-4 pb-4">
               {data.map((point: any, i: number) => {
                 const xPos = (i / (data.length - 1)) * 100;
                 const yPos = (point.y / maxVal) * 100;
                 
                 // If not last point, draw segment to next
                 let segment = null;
                 if (i < data.length - 1) {
                    const nextXPos = ((i + 1) / (data.length - 1)) * 100;
                    const nextYPos = (data[i+1].y / maxVal) * 100;
                    
                    const isSelected = selectedSegment === i;
                    const isCorrectAnswer = i === correctIndex;

                    const activeClass = isSelected ? 'stroke-[#F5B041] stroke-[4px] filter drop-shadow-[0_0_8px_#F5B041]' : 'stroke-[#4C8DA8] stroke-[3px]';
                    const hoverClass = !submitted ? 'hover:stroke-[#F5B041] hover:stroke-[5px] cursor-pointer' : '';
                    let finalClass = activeClass;

                    if (submitted) {
                       if (isSelected && isCorrectAnswer) finalClass = 'stroke-[#5BB9B0] stroke-[5px] filter drop-shadow-[0_0_10px_#5BB9B0]';
                       else if (isSelected && !isCorrectAnswer) finalClass = 'stroke-[#EF7D57] stroke-[4px] filter drop-shadow-[0_0_10px_#EF7D57]';
                       else if (!isSelected && isCorrectAnswer) finalClass = 'stroke-[#5BB9B0] stroke-[4px] opacity-70';
                       else finalClass = 'stroke-[#3D5275] stroke-[2px] opacity-30';
                    }

                    segment = (
                      <svg key={`line-${i}`} className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                         <line 
                           x1={`${xPos}%`} 
                           y1={`${100 - yPos}%`} 
                           x2={`${nextXPos}%`} 
                           y2={`${100 - nextYPos}%`} 
                           className={`${finalClass} ${hoverClass} pointer-events-auto transition-all`}
                           onClick={() => handleSelect(i)}
                           strokeLinecap="round"
                         />
                         {/* Invisible thicker line for easier clicking */}
                         <line 
                           x1={`${xPos}%`} 
                           y1={`${100 - yPos}%`} 
                           x2={`${nextXPos}%`} 
                           y2={`${100 - nextYPos}%`} 
                           className="stroke-transparent stroke-[20px] pointer-events-auto cursor-pointer"
                           onClick={() => handleSelect(i)}
                         />
                      </svg>
                    );
                 }

                 return (
                   <React.Fragment key={`point-${i}`}>
                     {segment}
                     <div 
                       className="absolute w-3 h-3 bg-[#E1E5EB] rounded-full border-2 border-[#1A2639] transform -translate-x-1/2 translate-y-1/2 z-10 shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                       style={{ left: `${xPos}%`, bottom: `${yPos}%` }}
                     >
                       <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-[#E1E5EB] bg-[#24354F] px-1 rounded">
                         {point.y}
                       </span>
                     </div>
                     <span 
                       className="absolute text-[12px] text-[#8A9EB8] transform -translate-x-1/2 whitespace-nowrap"
                       style={{ left: `${xPos}%`, bottom: '-30px' }}
                     >
                       {point.x}
                     </span>
                   </React.Fragment>
                 )
               })}
            </div>
         </div>

         {/* Controls */}
         <button 
           onClick={handleSubmit} 
           disabled={submitted || selectedSegment === null}
           className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2 transition-all
             ${submitted 
               ? result?.isCorrect ? 'bg-[#5BB9B0] text-[#1A2639]' : 'bg-[#EF7D57] text-white'
               : selectedSegment !== null 
                   ? 'bg-[#F5B041] text-[#7A4A00] hover:bg-[#F2CD6A] hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_0_#B8860B]' 
                   : 'bg-[#2D3E5A] text-[#5A6D8C] cursor-not-allowed'
             }
           `}
         >
           <Crosshair className="w-5 h-5" />
           {submitted ? (result?.isCorrect ? '锁定嫌疑犯 (正确)' : '线索中断 (错误)') : '提取数据'}
         </button>

      </div>
    </div>
  );
}
