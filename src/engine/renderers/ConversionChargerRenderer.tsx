import React, { useState } from 'react';
import { Beaker, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function ConversionChargerRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Hardcode conversion logic for MVP
  const sourceValue = 3.5;
  const sourceUnit = "dm³";
  const targetUnit = "cm³";
  const correctAnswer = "3500";

  const handleSubmit = () => {
    if (!inputValue) return;
    
    setSubmitted(true);
    const correct = inputValue.trim() === correctAnswer;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['calculation_error', 'unit_error'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] text-white rounded-[16px] overflow-hidden border-2 border-[#374151] shadow-2xl relative">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1F2937] to-[#111827] px-6 py-4 flex justify-between items-center border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <div className="bg-[#4C8DA8]/20 p-2 rounded-[12px] border border-[#4C8DA8]/50 shadow-[0_0_15px_rgba(76,141,168,0.3)]">
            <Beaker className="w-5 h-5 text-[#4C8DA8]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-white">{level.title}</h3>
            <p className="text-[12px] text-[#A0B0C0]">模板 T03：转换充能器</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2937] to-[#111827]">
        <div className="bg-[#1F2937] border-2 border-[#374151] rounded-[24px] p-8 w-full max-w-xl relative flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Charger UI */}
            <div className="flex items-center justify-between gap-8 mb-8">
                <div className="text-center font-mono">
                    <div className="text-[48px] font-bold text-white bg-[#111827] px-4 py-2 rounded-[12px] border border-[#4B5563] shadow-inner inline-block">
                        {sourceValue}
                    </div>
                    <div className="text-[18px] text-[#A0B0C0] mt-2 bg-[#374151] px-3 py-1 rounded-full">{sourceUnit}</div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-2 bg-[#374151] rounded-full overflow-hidden relative">
                       <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#4C8DA8] to-[#5BB9B0] animate-pulse"></div>
                    </div>
                    <ArrowRight className="w-8 h-8 text-[#5BB9B0] mt-2 mb-2"/>
                    <div className="text-[12px] text-[#A0B0C0] bg-[#111827] border border-[#374151] px-2 py-0.5 rounded uppercase tracking-wider">Charge</div>
                </div>

                <div className="text-center font-mono">
                    <input 
                       type="number"
                       value={inputValue}
                       onChange={(e) => !submitted && setInputValue(e.target.value)}
                       disabled={submitted}
                       className="text-[48px] w-48 font-bold text-[#F5B041] bg-[#111827] px-4 py-2 rounded-[12px] border border-[#4C8DA8] focus:border-[#F5B041] outline-none shadow-inner text-center placeholder-[#374151] transition-all"
                       placeholder="?"
                    />
                    <div className="text-[18px] text-[#A0B0C0] mt-2 bg-[#374151] px-3 py-1 rounded-full">{targetUnit}</div>
                </div>
            </div>
            
        </div>
      </div>

      <div className="p-6 bg-[#0F141F] border-t border-[#374151] flex justify-between items-center relative z-10">
        <div className="text-[14px]">
          {submitted ? (
            <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#5BB9B0]' : 'text-[#EF7D57]'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "充能完成！换算正确。" : "能量溢出！换算数额错误。"}
            </div>
          ) : (
            <p className="text-[#A0B0C0]">输入换算结果以启动充能</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!inputValue || submitted}
          className={`px-8 py-3 rounded-[12px] font-bold shadow-[0_4px_0_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${
            inputValue && !submitted
              ? "bg-[#4C8DA8] text-white hover:bg-[#5BB9B0] active:translate-y-1 active:shadow-none"
              : "bg-[#1F2937] text-[#4B5563] cursor-not-allowed border border-[#374151]"
          }`}
        >
          启动充能 (Submit)
        </button>
      </div>

      {/* Overlay when submitted */}
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
