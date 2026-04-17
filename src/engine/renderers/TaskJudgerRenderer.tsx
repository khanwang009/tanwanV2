import React, { useState } from 'react';
import { RendererProps } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

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
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackText: isCorrect ? '判断完全正确！无盖代表缺少顶面。' : '思路偏离，请注意由于是“无盖”，所以不能用完整的表面积。',
        matchedErrorType: isCorrect ? undefined : 'concept_error',
        providedData: { selectedIndex: index }
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A2639] text-[#F5F7FA] p-6 rounded-[16px] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <div className="bg-[#2A3B56] p-6 rounded-xl border-t-2 border-l-2 border-[#3D5275] shadow-lg mb-8 w-full transform perspective-1000">
          <h2 className="text-xl font-bold text-center leading-relaxed font-sans tracking-wide">
            {questionText}
            <div className="mt-4 text-sm text-[#4C8DA8] font-normal">请判断以上问题属于哪种数学求值域：</div>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {options.map((opt: string, i: number) => {
            const isSelected = selectedIndex === i;
            const isCorrectOption = i === correctIndex;
            
            let btnClass = "relative overflow-hidden group bg-[#2D3E5A] border-b-4 border-[#1B2A43] hover:bg-[#344869] hover:translate-y-[2px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 transition-all rounded-xl p-5 cursor-pointer flex justify-center items-center text-lg font-bold shadow-md";
            
            let innerContent = <span className="relative z-10">{opt}</span>;

            if (submitted) {
               btnClass = "relative overflow-hidden rounded-xl p-5 flex justify-center items-center text-lg font-bold transition-all ";
               if (isSelected && isCorrectOption) {
                 btnClass += "bg-[#1E4D43] border-2 border-[#5BB9B0] text-[#5BB9B0] shadow-[0_0_20px_rgba(91,185,176,0.3)] transform scale-105 z-10";
                 innerContent = <><span className="relative z-10">{opt}</span><CheckCircle2 className="absolute right-4 w-6 h-6 text-[#5BB9B0]" /></>;
               } else if (isSelected && !isCorrectOption) {
                 btnClass += "bg-[#4A2525] border-2 border-[#EF7D57] text-[#EF7D57] animate-shake opacity-80";
                 innerContent = <><span className="relative z-10">{opt}</span><XCircle className="absolute right-4 w-6 h-6 text-[#EF7D57]" /></>;
               } else if (!isSelected && isCorrectOption) {
                 btnClass += "bg-[#2D3E5A] border-2 border-[#5BB9B0] text-[#5BB9B0] opacity-90";
                 innerContent = <><span className="relative z-10">{opt}</span><CheckCircle2 className="absolute right-4 w-6 h-6 text-[#5BB9B0] opacity-50" /></>;
               } else {
                 btnClass += "bg-[#1B2A43] border-2 border-transparent text-[#666666] opacity-40";
               }
            }

            return (
              <div key={i} className={btnClass} onClick={() => handleSubmit(i)}>
                 {innerContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
