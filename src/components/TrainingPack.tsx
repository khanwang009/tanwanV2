import React from 'react';
import { PlayCircle, Target } from 'lucide-react';

export default function TrainingPack() {
  const { generatedPack, levels, knowledgeNodes, templateRegistry } = window;
  if (!generatedPack) return null;
  const packLevels = levels.filter((l:any) => generatedPack.levelIds.includes(l.id));

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[18px] font-[700] text-[#21335B]">强化练习包</h1>
      </div>
      
      {/* Theme Card */}
      <div className="bg-[#F8FAFC] border border-[#E1E5EB] rounded-[12px] p-5 flex flex-col gap-3">
         <div className="flex justify-between items-center">
             <div>
                 <div className="font-[600] text-[16px] text-[#21335B]">{generatedPack.themeName}</div>
                 <div className="text-[12px] text-[#666666] mt-1">包含知识点：{generatedPack.knowledgeNodeIds.map((id:string) => {
                     const n = knowledgeNodes.find((kn:any) => kn.id === id);
                     return n ? `${n.code} ${n.name}` : id;
                 }).join('，')}</div>
             </div>
             <div className="flex gap-2">
                 {generatedPack.suggestedFlow.map((f: string) => (
                     <span key={f} className="text-[10px] px-2.5 py-1 rounded-[4px] bg-white border border-[#E2E8F0] text-[#4A5568] uppercase whitespace-nowrap">
                         {f === 'diagnostic' ? '诊断' : f === 'understanding' ? '理解' : f === 'transfer' ? '迁移' : f === 'review' ? '回顾' : f}
                     </span>
                 ))}
             </div>
         </div>
         
         {/* Render flow */}
         <div className="mt-4 pt-4 border-t border-[#E1E5EB] space-y-4">
            {generatedPack.suggestedFlow.map((flowType: string, index: number) => {
              const stageLevels = packLevels.filter((l:any) => l.levelType === flowType);
              if (stageLevels.length === 0) return null;
              
              return (
                <div key={flowType} className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-6 h-6 rounded-full bg-[#F0F4F8] text-[#21335B] flex items-center justify-center font-[700] text-[11px] z-10 border border-[#E2E8F0]">
                      {index + 1}
                    </div>
                    {index < generatedPack.suggestedFlow.length - 1 && (
                      <div className="w-[1px] h-full bg-[#E1E5EB] mt-1"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <h4 className="text-[11px] font-[600] text-[#666666] uppercase tracking-wider mb-2">{flowType}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stageLevels.map((level:any) => {
                        const node = knowledgeNodes.find((n:any) => n.id === level.knowledgeNodeId);
                        const t = templateRegistry.find((x:any) => x.id === level.templateId);
                        
                        return (
                          <div key={level.id} className="bg-white p-3 rounded-[8px] border border-[#E1E5EB] hover:border-[#4C8DA8] transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-1.5">
                              <h5 className="font-[600] text-[13px] text-[#333333]">{level.title}</h5>
                              <span className="text-[9px] px-1.5 py-0.5 border border-[#E1E5EB] rounded bg-[#F8FAFC] text-[#666666]">
                                {level.difficulty.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666666] mb-3 flex items-center gap-1.5">
                              <Target className="w-3 h-3 text-[#4C8DA8]" />
                              {level.goal}
                            </p>
                            <div className="pt-2 border-t border-[#F0F0F0] flex justify-between items-center text-[10px]">
                               <div className="flex gap-1.5">
                                 <span className="text-[#666666]">{node?.code}</span>
                                 <span className="text-[#21335B] font-mono bg-[#F0F4F8] border border-[#E2E8F0] px-1 rounded">{t?.code}</span>
                               </div>
                               <PlayCircle className="w-4 h-4 text-[#E1E5EB] group-hover:text-[#4C8DA8] transition-colors" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
}
