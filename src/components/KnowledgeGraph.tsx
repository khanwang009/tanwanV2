import React from 'react';

export default function KnowledgeGraph() {
  const { unitMap, knowledgeNodes, templateRegistry, nodeTemplateMapping } = window;
  
  const units = Object.values(unitMap).sort((a: any, b: any) => a.orderIndex - b.orderIndex);

  return (
    <div className="space-y-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[18px] font-[700] text-[#21335B]">知识谱系全景</h1>
        <span className="text-[12px] text-[#666666]">学期：{window.currentStudent.schoolTerm}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
        {units.map((unit: any) => {
          const unitNodes = knowledgeNodes.filter((n:any) => n.unitId === unit.id);
          
          return (
            <div key={unit.id} className="bg-white rounded-[8px] border border-[#E1E5EB] p-3 flex flex-col">
              <div className="font-[700] text-[12px] text-[#666666] uppercase mb-2 border-b border-[#F0F0F0] pb-1">
                {unit.code} {unit.name}
              </div>
              
              <div className="flex flex-wrap gap-1 relative">
                {unitNodes.map((node: any) => {
                  const mapping = nodeTemplateMapping[node.id] || {};
                  const primaryTpl = templateRegistry.find((t:any) => t.id === mapping.primaryTemplateId);
                  
                  return (
                    <div key={node.id} className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#F0F4F8] text-[#4A5568] border border-[#E2E8F0] whitespace-nowrap cursor-help relative group">
                      {node.name}
                      
                      {/* Hover Details to preserve functionality info */}
                      <div className="hidden group-hover:flex absolute left-0 top-full mt-1 z-20 bg-white border border-[#E1E5EB] p-2 rounded shadow-sm flex-col gap-1 w-[180px]">
                         <div className="text-[10px] font-bold text-[#21335B]">{node.code}</div>
                         <div className="text-[10px] text-[#666666]">
                           主模板: {primaryTpl ? primaryTpl.code : '无'}
                         </div>
                         {mapping.fallbackByError && Object.keys(mapping.fallbackByError).length > 0 && (
                           <div className="text-[9px] text-[#C53030] mt-1 border-t border-[#E1E5EB] pt-1">包含错误降级</div>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
