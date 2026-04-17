import React, { useState } from 'react';
import { BoxSelect, CheckCircle2, XCircle } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function NetFoldingHouseRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // MVP: Select which "net" (unfolded box) can fold into a valid cube
  const options = [
    { id: 1, type: "1-4-1", valid: true },
    { id: 2, type: "2-2-2", valid: false },
    { id: 3, type: "3-3", valid: false },
    { id: 4, type: "2-3-1", valid: true } 
  ];
  
  // Just choosing the first valid one as correct for this specific level
  const correctAnswer = 1;

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setSubmitted(true);
    const correct = selectedOption === correctAnswer;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['structure_error'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  // Helper for rendering a net grid
  const renderNet = (type: string) => {
      if(type === "1-4-1") {
          return (
              <div className="grid grid-cols-4 gap-1 w-24">
                  <div className="col-start-2 w-5 h-5 bg-[#EF7D57] rounded-sm"></div>
                  <div className="col-span-4 grid grid-cols-4 gap-1">
                      <div className="w-5 h-5 bg-[#F5B041] rounded-sm"></div>
                      <div className="w-5 h-5 bg-[#5BB9B0] rounded-sm"></div>
                      <div className="w-5 h-5 bg-[#4C8DA8] rounded-sm"></div>
                      <div className="w-5 h-5 bg-[#E7A93A] rounded-sm"></div>
                  </div>
                  <div className="col-start-3 w-5 h-5 bg-[#8A2BE2] rounded-sm"></div>
              </div>
          )
      }
      if(type === "2-2-2") {
          return (
               <div className="grid grid-cols-3 gap-1 w-[72px]">
                   <div className="col-span-2 grid grid-cols-2 gap-1 mb-1">
                       <div className="w-5 h-5 bg-[#EF7D57] rounded-sm"></div>
                       <div className="w-5 h-5 bg-[#EF7D57] rounded-sm"></div>
                   </div>
                   <div className="col-span-2 grid grid-cols-2 gap-1 mb-1 ml-6">
                       <div className="w-5 h-5 bg-[#5BB9B0] rounded-sm"></div>
                       <div className="w-5 h-5 bg-[#5BB9B0] rounded-sm"></div>
                   </div>
                   <div className="col-span-2 grid grid-cols-2 gap-1 ml-12">
                       <div className="w-5 h-5 bg-[#4C8DA8] rounded-sm"></div>
                       <div className="w-5 h-5 bg-[#4C8DA8] rounded-sm"></div>
                   </div>
               </div>
          )
      }
      if(type === "3-3") {
          return (
              <div className="flex flex-col gap-1 w-20">
                  <div className="flex gap-1">
                       <div className="w-5 h-5 bg-[#EF7D57] rounded-sm"></div>
                       <div className="w-5 h-5 bg-[#F5B041] rounded-sm"></div>
                       <div className="w-5 h-5 bg-[#5BB9B0] rounded-sm"></div>
                  </div>
                  <div className="flex gap-1 ml-6">
                       <div className="w-5 h-5 bg-[#4C8DA8] rounded-sm"></div>
                       <div className="w-5 h-5 bg-[#E7A93A] rounded-sm"></div>
                       <div className="w-5 h-5 bg-[#8A2BE2] rounded-sm"></div>
                  </div>
              </div>
          )
      }
      return (
           <div className="flex flex-col gap-1 w-24">
              <div className="flex gap-1 ml-6">
                   <div className="w-5 h-5 bg-[#EF7D57] rounded-sm"></div>
                   <div className="w-5 h-5 bg-[#F5B041] rounded-sm"></div>
              </div>
              <div className="flex gap-1">
                   <div className="w-5 h-5 bg-[#4C8DA8] rounded-sm"></div>
                   <div className="w-5 h-5 bg-[#E7A93A] rounded-sm"></div>
                   <div className="w-5 h-5 bg-[#8A2BE2] rounded-sm"></div>
              </div>
               <div className="flex gap-1 ml-12">
                   <div className="w-5 h-5 bg-[#5BB9B0] rounded-sm"></div>
              </div>
          </div>
      )
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A24] text-white rounded-[16px] overflow-hidden border-2 border-[#2D2D3F] relative">
      <div className="bg-[#2D2D3F] px-6 py-4 flex justify-between items-center border-b border-[#3E3E55]">
        <div className="flex items-center gap-3">
          <div className="bg-[#5BB9B0]/20 p-2 rounded-lg border border-[#5BB9B0]/50">
            <BoxSelect className="w-5 h-5 text-[#5BB9B0]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-white">{level.title}</h3>
            <p className="text-[12px] text-[#A0A0B0]">模板 T07：展开图折叠屋</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-tr from-[#1A1A24] to-[#252535]">
         <p className="text-[18px] text-[#E0E0EF] mb-10 text-center bg-[#2D2D3F]/50 px-6 py-3 rounded-full border border-[#3E3E55]">以下哪个展开图能折叠成一个完整的无缝疵正方体？（点选正确的图样）</p>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
             {options.map((opt) => (
                 <div
                     key={opt.id}
                     onClick={() => !submitted && setSelectedOption(opt.id)}
                     className={`flex items-center justify-center h-48 rounded-[20px] transition-all cursor-pointer border-4 ${
                         selectedOption === opt.id 
                         ? 'border-[#5BB9B0] bg-[#5BB9B0]/10 shadow-[0_0_30px_rgba(91,185,176,0.3)] scale-105 transform' 
                         : 'border-[#3E3E55] bg-[#1E1E2A] hover:bg-[#2A2A3A] hover:border-[#4C8DA8]'
                     } ${submitted ? 'opacity-50 pointer-events-none' : ''}`}
                 >
                     <div className="scale-150">
                         {renderNet(opt.type)}
                     </div>
                 </div>
             ))}
         </div>
      </div>

      <div className="p-6 bg-[#15151D] border-t border-[#2D2D3F] flex justify-between items-center z-10 relative">
        <div className="text-[14px]">
          {submitted ? (
            <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#5BB9B0]' : 'text-[#EF7D57]'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "空间感极佳！结构成立。" : "折叠失败，面发生了重叠或缺失。"}
            </div>
          ) : (
            <p className="text-[#A0A0B0]">选定图样后开始折叠</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || submitted}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            selectedOption && !submitted
              ? "bg-[#5BB9B0] text-black hover:bg-[#6EE0D5] active:scale-95 shadow-[0_0_15px_rgba(91,185,176,0.4)]"
              : "bg-[#2D2D3F] text-[#555] cursor-not-allowed"
          }`}
        >
          模拟折叠
        </button>
      </div>
      
      {submitted && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none">
           <div className={`transform scale-150 p-6 rounded-full ${isCorrect ? 'bg-[#5BB9B0]/20 text-[#5BB9B0]' : 'bg-[#EF7D57]/20 text-[#EF7D57]'} animate-bounce`}>
            {isCorrect ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
          </div>
        </div>
      )}
    </div>
  );
}
