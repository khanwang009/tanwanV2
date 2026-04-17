import React, { useState } from 'react';
import { Target, Info, CheckCircle2, XCircle, Crosshair } from 'lucide-react';
import { LevelConfig, LevelResult } from '../types';

export default function FactorRadarRenderer({ 
  level, 
  onComplete 
}: { 
  level: LevelConfig; 
  onComplete: (result: LevelResult) => void;
}) {
  const [selectedNums, setSelectedNums] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // MVP level config: Find multiples of 3 among a list
  const numbers = [12, 14, 21, 25, 33, 40, 42, 51];
  const targetMultiplier = 3;
  const correctNumbers = numbers.filter(n => n % targetMultiplier === 0);

  const toggleSelection = (num: number) => {
    if (submitted) return;
    if (selectedNums.includes(num)) {
      setSelectedNums(selectedNums.filter(n => n !== num));
    } else {
      setSelectedNums([...selectedNums, num]);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Sort and compare arrays
    const sortedSelected = [...selectedNums].sort((a,b)=>a-b);
    const sortedCorrect = [...correctNumbers].sort((a,b)=>a-b);
    
    const correct = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
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
    <div className="flex flex-col h-full bg-[#0A192F] text-white rounded-[16px] overflow-hidden border border-[#233554] shadow-2xl relative">
      {/* Header */}
      <div className="bg-[#112240] px-6 py-4 flex justify-between items-center border-b border-[#233554]">
        <div className="flex items-center gap-3">
          <div className="bg-[#64FFDA]/10 p-2 rounded-full border border-[#64FFDA]/50 shadow-[0_0_10px_rgba(100,255,218,0.2)]">
            <Crosshair className="w-5 h-5 text-[#64FFDA]" />
          </div>
          <div>
            <h3 className="font-bold text-[16px] text-white tracking-wide">{level.title}</h3>
            <p className="text-[12px] text-[#8892B0] font-mono">TEMPLATE://T05.FACTOR_RADAR</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#112240] to-[#0A192F]">
        
        {/* Radar Background grid */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#64FFDA 1px, transparent 1px), linear-gradient(90deg, #64FFDA 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        
        {/* The radar sweep animation (simple CSS spin) */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -mt-[300px] -ml-[300px] border border-[#64FFDA]/20 rounded-full z-0 flex items-center justify-center animate-[spin_10s_linear_infinite]">
            <div className="w-[300px] h-[600px] bg-gradient-to-r from-transparent to-[#64FFDA]/10 absolute right-0 origin-left border-r border-[#64FFDA]/50"></div>
        </div>

        <div className="z-10 relative bg-[#112240] px-8 py-4 rounded-full border border-[#233554] shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-10 flex items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-[#64FFDA] animate-ping"></span>
            <span className="font-mono text-[#64FFDA] text-lg tracking-widest">TARGET : MULTIPLES OF {targetMultiplier}</span>
        </div>

        <div className="z-10 grid grid-cols-4 gap-6 max-w-2xl w-full">
            {numbers.map((num, idx) => (
                <div 
                    key={idx}
                    onClick={() => toggleSelection(num)}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 font-mono text-2xl font-bold border-2 ${
                        selectedNums.includes(num) 
                        ? 'bg-[#64FFDA]/20 border-[#64FFDA] text-[#64FFDA] shadow-[0_0_20px_rgba(100,255,218,0.5)] scale-110' 
                        : 'bg-[#112240] border-[#233554] text-[#8892B0] hover:border-[#64FFDA]/50 hover:text-[#CCD6F6]'
                    }`}
                >
                    {num}
                    {selectedNums.includes(num) && (
                        <div className="absolute -top-1 -right-1">
                            <Target className="w-6 h-6 text-[#64FFDA]" />
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      <div className="p-6 bg-[#0B1528] border-t border-[#233554] flex justify-between items-center z-20 relative">
        <div className="text-[14px]">
          {submitted ? (
            <div className={`flex items-center gap-2 font-bold font-mono ${isCorrect ? 'text-[#64FFDA]' : 'text-[#EF7D57]'}`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? "TARGETS DESTROYED. SUCCESS." : "FALSE POSITIVES DETECTED. FAILED."}
            </div>
          ) : (
            <p className="text-[#8892B0] font-mono">SELECT ALL TARGETS AND INITIATE SEQUENCE</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitted || selectedNums.length === 0}
          className={`px-8 py-3 rounded font-mono font-bold transition-all tracking-wider ${
            (!submitted && selectedNums.length > 0)
              ? "bg-transparent text-[#64FFDA] border-2 border-[#64FFDA] hover:bg-[#64FFDA]/10 active:scale-95 shadow-[0_0_10px_rgba(100,255,218,0.2)]"
              : "bg-[#112240] text-[#495670] border-2 border-[#233554] cursor-not-allowed"
          }`}
        >
          INITIATE
        </button>
      </div>
    </div>
  );
}
