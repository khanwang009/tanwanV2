import React, { useState } from 'react';
import { Component, Terminal } from 'lucide-react';

export default function TemplateEngine() {
  const { templateRegistry, knowledgeNodes, nodeTemplateMapping } = window;
  const [activeTab, setActiveTab] = useState<'registry' | 'mapping'>('registry');
  
  const categories = Array.from(new Set(templateRegistry.map((t:any) => t.category)));

  const renderRegistry = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map(category => (
        <div key={category as string} className="col-span-full mt-2 first:mt-0">
          <h3 className="text-[12px] font-[700] text-[#666666] uppercase tracking-wider mb-2 border-b border-[#E1E5EB] pb-1">
            {category as string}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {templateRegistry.filter((t:any) => t.category === category).map((tpl:any) => {
               const usedByNodes = knowledgeNodes.filter((n:any) => nodeTemplateMapping[n.id]?.primaryTemplateId === tpl.id);
               return (
                 <div key={tpl.id} className="bg-white rounded-[8px] border border-[#E1E5EB] p-3 flex flex-col gap-2 hover:bg-[#F8FAFC]">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-mono font-[600] text-[#21335B] bg-[#F0F4F8] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                       {tpl.code}
                     </span>
                     <span className="text-[10px] text-[#666666] font-mono">
                       {tpl.id}
                     </span>
                   </div>
                   <h4 className="font-[600] text-[#333333] text-[13px] flex items-center gap-1.5">
                     <Component className="w-3.5 h-3.5 text-[#4C8DA8]" />
                     {tpl.name}
                   </h4>
                   <div className="text-[11px] text-[#666666] flex items-center gap-1.5">
                     <Terminal className="w-3 h-3 text-[#E1E5EB]" />
                     <span className="font-mono">{tpl.renderer}</span>
                   </div>
                   <div className="mt-auto pt-2 border-t border-[#F0F0F0]">
                     <div className="text-[10px] text-[#666666] mb-1">挂载节点 ({usedByNodes.length})</div>
                     <div className="flex flex-wrap gap-1">
                       {usedByNodes.map((n:any) => (
                         <span key={n.id} className="text-[9px] bg-[#F8FAFC] text-[#666666] px-1 rounded border border-[#E1E5EB]">
                           {n.code}
                         </span>
                       ))}
                       {usedByNodes.length === 0 && <span className="text-[9px] text-[#C53030]">仅降级使用</span>}
                     </div>
                   </div>
                 </div>
               );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMapping = () => (
    <div className="bg-white rounded-[8px] border border-[#E1E5EB] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] whitespace-nowrap">
          <thead className="bg-[#F5F7FA] text-[#666666]">
            <tr>
              <th className="px-4 py-2 font-[600] border-b border-[#E1E5EB]">知识点节点</th>
              <th className="px-4 py-2 font-[600] border-b border-[#E1E5EB]">主渲染模板</th>
              <th className="px-4 py-2 font-[600] border-b border-[#E1E5EB]">备选模板</th>
              <th className="px-4 py-2 font-[600] border-b border-[#E1E5EB]">错因降级</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E5EB]">
            {knowledgeNodes.map((node:any) => {
              const mapping = nodeTemplateMapping[node.id];
              if (!mapping) return null;
              const pTpl = templateRegistry.find((t:any) => t.id === mapping.primaryTemplateId);
              
              return (
                <tr key={node.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-2.5">
                    <div className="font-[500] text-[#333333]">{node.code} {node.name}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    {pTpl && (
                      <div className="inline-flex items-center gap-1.5 text-[#21335B]">
                        <span className="font-mono text-[10px] bg-[#F0F4F8] border border-[#E2E8F0] px-1 rounded">{pTpl.code}</span>
                        <span>{pTpl.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 flex-wrap">
                      {mapping.alternateTemplateIds?.map((tid: string) => {
                        const t = templateRegistry.find((x:any) => x.id === tid);
                        return t ? <span key={tid} className="text-[10px] bg-[#F8FAFC] text-[#666666] px-1 rounded border border-[#E1E5EB]">{t.code}</span> : null;
                      })}
                      {(!mapping.alternateTemplateIds || mapping.alternateTemplateIds.length === 0) && <span className="text-[#E1E5EB]">-</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-col gap-1">
                      {mapping.fallbackByError && Object.entries(mapping.fallbackByError).map(([errType, tIds]: [string, any]) => (
                        <div key={errType} className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono bg-[#FFF5F5] text-[#C53030] px-1 rounded border border-[#FEE2E2]">{errType}</span>
                          <span className="text-[#666666] text-[10px]">→</span>
                          {tIds.map((tid: string) => {
                              const t = templateRegistry.find((x:any) => x.id === tid);
                              return t ? <span key={tid} className="text-[9px] bg-white text-[#666666] px-1 rounded border border-[#E1E5EB]">{t.code}</span> : null;
                          })}
                        </div>
                      ))}
                      {(!mapping.fallbackByError || Object.keys(mapping.fallbackByError).length === 0) && <span className="text-[#E1E5EB]">-</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-[700] text-[#21335B]">动态模板引擎库</h1>
        
        <div className="flex bg-[#E1E5EB] p-0.5 rounded-[6px]">
          <button 
            onClick={() => setActiveTab('registry')}
            className={`px-3 py-1 text-[12px] font-[500] rounded-[4px] transition-colors ${activeTab === 'registry' ? 'bg-white text-[#21335B] shadow-sm' : 'text-[#666666] hover:text-[#333333]'}`}
          >
            模板图鉴
          </button>
          <button 
            onClick={() => setActiveTab('mapping')}
            className={`px-3 py-1 text-[12px] font-[500] rounded-[4px] transition-colors ${activeTab === 'mapping' ? 'bg-white text-[#21335B] shadow-sm' : 'text-[#666666] hover:text-[#333333]'}`}
          >
            映射关系全表
          </button>
        </div>
      </div>
      {activeTab === 'registry' ? renderRegistry() : renderMapping()}
    </div>
  );
}
