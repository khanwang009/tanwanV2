import React, { useState } from 'react';
import { ChefHat, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function FractionKitchenRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [numerator1, setNumerator1] = useState(1);
  const [denominator1, setDenominator1] = useState(2);
  const [numerator2, setNumerator2] = useState(1);
  const [denominator2, setDenominator2] = useState(4);
  
  const [ansNum, setAnsNum] = useState("");
  const [ansDen, setAnsDen] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // MVP: Fixed problem 1/2 + 1/4 = 3/4
  const expectedNum = 3;
  const expectedDen = 4;

  const handleSubmit = () => {
    if (!ansNum || !ansDen) return;
    
    setSubmitted(true);
    // Simple fraction check (not considering unsimplified forms for this MVP unless strictly matching)
    // For 1/2 + 1/4, 3/4 is the standard. If they put 6/8, we can optionally accept it, but let's be strict for MVP to encourage simplification.
    const correctNum = parseInt(ansNum) === expectedNum;
    const correctDen = parseInt(ansDen) === expectedDen;
    const correct = correctNum && correctDen;
    
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['calculation_error', 'structure_error'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFBF0] text-[#5D4037] rounded-[16px] overflow-hidden border border-[#FFE0B2] shadow-xl relative">
      <div className="bg-[#FFECB3] px-6 py-4 flex justify-between items-center border-b border-[#FFE0B2]">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF9800]/20 p-2 rounded-full border border-[#FF9800]/50">
            <ChefHat className="w-5 h-5 text-[#E65100]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-[#E65100]">{level.title}</h3>
            <p className="text-[12px] text-[#8D6E63]">模板 T13：分数运算厨房</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <p className="text-[18px] text-[#5D4037] mb-8 font-medium">将两杯配料混合，计算最终的比例浓度</p>
        
        {/* Workspace */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-[#FFE0B2] flex items-center gap-8 relative overflow-hidden">
             
             {/* Decorative stripes representing a table */}
             <div className="absolute bottom-0 left-0 w-full h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0wIDIwaDQweiIgc3Ryb2tlPSIjZmZlMGIyIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] opacity-50"></div>

             {/* Fraction 1 */}
             <div className="flex flex-col items-center z-10 relative">
                 <div className="w-16 h-24 border-2 border-b-4 border-[#FFA000] rounded-b-xl rounded-t-sm bg-[#FFF8E1] relative overflow-hidden flex flex-col justify-end">
                     <div className="w-full bg-[#FFB300] transition-all" style={{height: `${(numerator1/denominator1)*100}%`}}></div>
                 </div>
                 <div className="flex flex-col items-center text-xl font-bold font-mono mt-4 text-[#E65100]">
                    <span>{numerator1}</span>
                    <span className="w-6 h-[2px] bg-[#E65100]"></span>
                    <span>{denominator1}</span>
                 </div>
             </div>

             <div className="bg-[#FFE0B2] w-10 h-10 rounded-full flex items-center justify-center text-[#E65100] z-10 flex-shrink-0 shadow-sm border border-[#FFCC80]">
                 <Plus className="w-6 h-6 stroke-[3]" />
             </div>

             {/* Fraction 2 */}
             <div className="flex flex-col items-center z-10">
                 <div className="w-16 h-24 border-2 border-b-4 border-[#F57C00] rounded-b-xl rounded-t-sm bg-[#FFF8E1] relative overflow-hidden flex flex-col justify-end">
                     <div className="w-full bg-[#FF9800] transition-all" style={{height: `${(numerator2/denominator2)*100}%`}}></div>
                 </div>
                 <div className="flex flex-col items-center text-xl font-bold font-mono mt-4 text-[#E65100]">
                    <span>{numerator2}</span>
                    <span className="w-6 h-[2px] bg-[#E65100]"></span>
                    <span>{denominator2}</span>
                 </div>
             </div>

             <div className="text-3xl font-bold text-[#E65100] z-10">=</div>

             {/* Result input */}
             <div className="flex flex-col items-center z-10 p-4 bg-[#FFF3E0] rounded-[16px] border border-[#FFCC80] shadow-inner">
                 <input 
                    type="number"
                    value={ansNum}
                    onChange={(e) => !submitted && setAnsNum(e.target.value)}
                    disabled={submitted}
                    className="w-16 h-12 text-center text-2xl font-bold font-mono bg-white border border-[#FFB300] rounded-lg outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#FFB300]/50"
                 />
                 <span className="w-16 h-[2px] bg-[#E65100] my-2"></span>
                 <input 
                    type="number"
                    value={ansDen}
                    onChange={(e) => !submitted && setAnsDen(e.target.value)}
                    disabled={submitted}
                    className="w-16 h-12 text-center text-2xl font-bold font-mono bg-white border border-[#FFB300] rounded-lg outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#FFB300]/50"
                 />
             </div>
        </div>

      </div>

      <div className="p-6 bg-white border-t border-[#FFE0B2] flex justify-between items-center z-10 relative">
        <div className="text-[14px]">
          {submitted ? (
             <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#FF9800]' : 'text-red-500'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "美味！配料混合得十分精准。" : "味道不对，请检查通分或计算过程。"}
            </div>
          ) : (
            <p className="text-[#8D6E63]">注意：异分母要先通分哦</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!ansNum || !ansDen || submitted}
          className={`px-8 py-3 rounded-full font-bold transition-all shadow-[0_4px_0_rgba(230,81,0,0.3)] ${
             ansNum && ansDen && !submitted
              ? "bg-[#FF9800] text-white hover:bg-[#F57C00] active:translate-y-1 active:shadow-none"
              : "bg-[#FFE0B2] text-[#BCAAA4] cursor-not-allowed shadow-none"
          }`}
        >
          完成料理
        </button>
      </div>

       {submitted && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none">
           <div className={`transform scale-150 p-6 rounded-full ${isCorrect ? 'bg-[#FF9800]/10 text-[#FF9800]' : 'bg-red-100 text-red-500'} animate-bounce`}>
            {isCorrect ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
          </div>
        </div>
      )}
    </div>
  );
}
