import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function UnitGuardianRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Define some mock unit items for the MVP based on the level knowledge
  const unitOptions = [
    { id: 'cm3', label: '立方厘米 (cm³)', type: 'volume' },
    { id: 'dm3', label: '立方分米 (dm³)', type: 'volume' },
    { id: 'm3', label: '立方米 (m³)', type: 'volume' },
    { id: 'ml', label: '毫升 (mL)', type: 'capacity' },
    { id: 'l', label: '升 (L)', type: 'capacity' }
  ];

  // Specific question logic: 
  const objectName = "一个普通矿泉水瓶的容积大约是 500 ___";
  const correctAnswer = "ml";

  const handleSubmit = () => {
    if (!selectedUnit) return;
    
    setSubmitted(true);
    const correct = selectedUnit === correctAnswer;
    setIsCorrect(correct);
    
    setTimeout(() => {
      onComplete({
        levelId: level.id,
        isCorrect: correct,
        score: correct ? 100 : 0,
        errorTypeCodes: correct ? [] : ['unit_error'],
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A2642] text-white rounded-[16px] overflow-hidden border-2 border-[#2C3E5D] relative shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#2C3E5D] to-[#1A2642] px-6 py-4 flex justify-between items-center border-b border-[#3A4B6E]">
        <div className="flex items-center gap-3">
          <div className="bg-[#5BB9B0]/20 p-2 rounded-[12px] border border-[#5BB9B0]/50 shadow-[0_0_15px_rgba(91,185,176,0.3)]">
            <Target className="w-5 h-5 text-[#5BB9B0]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-white">{level.title}</h3>
            <p className="text-[12px] text-[#A0B0C0]">模板 T02：单位守门员</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="bg-[#2C3E5D] px-8 py-6 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-t border-[#4A648A] mb-8 text-center max-w-lg w-full">
            <p className="text-[20px] font-medium leading-relaxed">
             一个普通矿泉水瓶的容积大约是
             <br />
             <span className="text-[32px] font-bold text-[#F5B041] mt-2 block">500 <span className="inline-block w-24 border-b-2 border-dashed border-[#F5B041] ml-2 pb-1">?</span></span>
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {unitOptions.map(option => (
            <button
              key={option.id}
              onClick={() => !submitted && setSelectedUnit(option.id)}
              className={`p-4 rounded-[16px] font-bold text-[16px] transition-all transform active:scale-95 ${
                selectedUnit === option.id 
                  ? "bg-[#5BB9B0] text-white shadow-[0_0_20px_rgba(91,185,176,0.6)] border-2 border-white translate-y-[-4px]" 
                  : "bg-[#1A2642] text-[#A0B0C0] border-2 border-[#3A4B6E] hover:border-[#5BB9B0] hover:text-white"
              } ${submitted ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-[#151F36] border-t border-[#2C3E5D] flex justify-between items-center relative z-10">
        <div className="text-[14px]">
          {submitted ? (
            <div className={`flex items-center gap-2 font-bold ${isCorrect ? 'text-[#5BB9B0]' : 'text-[#EF7D57]'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "防御成功！单位匹配正确。" : "防御失败！请检查单位是否合适。"}
            </div>
          ) : (
            <p className="text-[#A0B0C0]">请选择最合适的单位</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedUnit || submitted}
          className={`px-8 py-3 rounded-full font-bold shadow-[0_4px_0_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-2 ${
            selectedUnit && !submitted
              ? "bg-[#F5B041] text-[#7A4A00] hover:bg-[#F2CD6A] active:translate-y-1 active:shadow-none"
              : "bg-[#2C3E5D] text-[#A0B0C0] cursor-not-allowed"
          }`}
        >
          确定提交
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
