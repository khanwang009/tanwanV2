import React, { useState } from 'react';
import { RendererProps } from '../types';
import { Package, Check, AlertCircle } from 'lucide-react';

export default function PackagingWorkshopRenderer({ level, onComplete }: RendererProps) {
  const faces = [
    { id: 'top', label: '顶面' },
    { id: 'bottom', label: '底面' },
    { id: 'front', label: '前面' },
    { id: 'back', label: '后面' },
    { id: 'left', label: '左面' },
    { id: 'right', label: '右面' }
  ];

  const targetFaces = level.params?.facesToSelect || ['bottom', 'front', 'back', 'left', 'right'];
  const [selectedFaces, setSelectedFaces] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [resultProps, setResultProps] = useState<any>(null);

  const toggleFace = (id: string) => {
    if (submitted) return;
    setSelectedFaces(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    
    const isCorrect = 
      selectedFaces.length === targetFaces.length &&
      selectedFaces.every(f => targetFaces.includes(f));

    setResultProps({ isCorrect });

    setTimeout(() => {
      onComplete({
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackText: isCorrect ? '完美！材料覆盖精准无误。' : '材料覆盖错误，请注意目标是“无盖鱼缸”，不需要顶面材料。',
        matchedErrorType: isCorrect ? undefined : 'structure_error',
        providedData: { selectedFaces }
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A2639] text-[#F5F7FA] p-6 rounded-[16px] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
      <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
        
        {/* Visual Object Area */}
        <div className="flex-1 flex items-center justify-center relative w-full aspect-square md:aspect-auto">
           {/* Abstract 3D box representation using borders and glowing panels */}
           <div className="relative w-64 h-64 transform rotate-x-12 rotate-y-[-10deg] perspective-[1500px] transform-style-3d group">
             {faces.map(face => {
               const isSelected = selectedFaces.includes(face.id);
               let transformStr = "";
               switch(face.id) {
                 case 'front': transformStr = "translateZ(8rem)"; break;
                 case 'back': transformStr = "rotateY(180deg) translateZ(8rem)"; break;
                 case 'left': transformStr = "rotateY(-90deg) translateZ(8rem)"; break;
                 case 'right': transformStr = "rotateY(90deg) translateZ(8rem)"; break;
                 case 'top': transformStr = "rotateX(90deg) translateZ(8rem)"; break;
                 case 'bottom': transformStr = "rotateX(-90deg) translateZ(8rem)"; break;
               }

               return (
                 <div 
                   key={face.id}
                   className={`absolute inset-0 border-2 transition-all duration-300 backdrop-blur-sm flex items-center justify-center
                     ${isSelected ? 'bg-[rgba(76,141,168,0.4)] border-[#4C8DA8] shadow-[0_0_30px_rgba(76,141,168,0.5)]' : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]'}
                     ${submitted && !isSelected && targetFaces.includes(face.id) ? 'border-[#EF7D57] shadow-[0_0_20px_rgba(239,125,87,0.5)]' : ''}
                   `}
                   style={{ transform: transformStr }}
                 >
                   <span className="text-xl font-bold opacity-30">{face.label}</span>
                 </div>
               )
             })}
           </div>
        </div>

        {/* Control Panel */}
        <div className="w-full md:w-80 bg-[#24354F] p-6 rounded-2xl border-t border-l border-[#3D5275] shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-[#3D5275] pb-4">
             <div className="w-10 h-10 rounded-full bg-[#344869] flex items-center justify-center">
               <Package className="w-5 h-5 text-[#4C8DA8]" />
             </div>
             <div>
               <h3 className="font-bold text-lg">分配包装材料</h3>
               <p className="text-xs text-[#8A9EB8]">点击需要贴面材的面</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             {faces.map(face => (
               <button
                 key={face.id}
                 onClick={() => toggleFace(face.id)}
                 disabled={submitted}
                 className={`py-3 px-4 rounded-lg font-bold text-sm transition-all border-b-2
                   ${selectedFaces.includes(face.id) 
                     ? 'bg-[#4C8DA8] border-[#2A657D] text-white shadow-inner translate-y-[1px]' 
                     : 'bg-[#2D3E5A] border-[#1B2A43] text-[#8A9EB8] hover:bg-[#344869]'
                   }
                   ${submitted && !selectedFaces.includes(face.id) && targetFaces.includes(face.id) ? 'ring-2 ring-[#EF7D57] ring-offset-2 ring-offset-[#24354F] bg-[#4A2525]' : ''}
                 `}
               >
                 {face.label}
               </button>
             ))}
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={submitted || selectedFaces.length === 0}
            className={`mt-4 py-4 rounded-xl font-bold text-lg shadow-lg transition-all
              ${submitted 
                 ? resultProps?.isCorrect ? 'bg-[#5BB9B0] text-[#1A2639]' : 'bg-[#EF7D57] text-white'
                 : selectedFaces.length > 0 
                     ? 'bg-[#F5B041] text-[#7A4A00] hover:bg-[#F2CD6A] hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_0_#B8860B]' 
                     : 'bg-[#2D3E5A] text-[#5A6D8C] cursor-not-allowed'
              }
            `}
          >
            {submitted 
              ? (resultProps?.isCorrect ? <span className="flex items-center justify-center gap-2"><Check className="w-5 h-5"/> 成功</span> : <span className="flex items-center justify-center gap-2"><AlertCircle className="w-5 h-5"/> 结构错误</span>)
              : '提交材料'
            }
          </button>
        </div>

      </div>
    </div>
  );
}
