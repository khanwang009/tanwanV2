import React from 'react';

export default function Dashboard() {
  const { uploadedQuestion, diagnosisResult, reportData, masteryRecords, knowledgeNodes, errorTypeMap } = window;
  
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Uploaded Question Card */}
        <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E1E5EB] p-4 flex flex-col gap-3">
          <h2 className="text-[14px] font-[700] text-[#21335B] mb-2">OCR & 题目识别</h2>
          <div className="aspect-[3/4] bg-[#000] rounded-[8px] overflow-hidden border border-[#E1E5EB] relative group">
            <img 
              src={uploadedQuestion.imageUrl} 
              alt="Uploaded Question" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="bg-[#000]/70 px-3 py-1 rounded text-[10px] text-white backdrop-blur-sm">
                 {uploadedQuestion.filename}
               </span>
            </div>
          </div>
          <div className="bg-[#000] text-white p-3 rounded-[8px] text-[10px] text-center leading-relaxed italic">
            "{uploadedQuestion.questionText}"
          </div>
          <div className="flex gap-2">
            <span className="bg-[#FFF5F5] text-[#C53030] px-2 py-0.5 rounded-[10px] font-[600] text-[11px]">
              状态: {uploadedQuestion.ocrStatus}
            </span>
          </div>
        </div>

        {/* Diagnosis Result */}
        <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E1E5EB] p-4 flex flex-col gap-3">
          <h2 className="text-[14px] font-[700] text-[#21335B] mb-2 flex items-center gap-2">
            错题诊断溯源
            <span className="bg-[#FFF5F5] text-[#C53030] px-2 py-0.5 rounded-[10px] font-[600] text-[11px] font-sans">
              置信度: {(diagnosisResult.confidenceScore * 100).toFixed(0)}%
            </span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-[13px] font-[600] text-[#666666] mb-2">涉及知识点</h3>
              <div className="flex flex-col gap-2">
                {diagnosisResult.knowledgeCandidates.map((c: any, i: number) => {
                  const node = knowledgeNodes.find((n:any) => n.id === c.knowledgeNodeId);
                  return (
                    <div key={i} className={`flex items-center justify-between p-2 rounded-[8px] border ${c.isSelected ? 'bg-[#F0F4F8] border-[#21335B] text-[#21335B]' : 'bg-white border-[#E1E5EB] text-[#666666] opacity-70'}`}>
                      <div className="flex items-center gap-2">
                        {c.isSelected ? <span className="w-1.5 h-1.5 rounded-full bg-[#21335B]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#E1E5EB]" />}
                        <span className="text-[12px] font-[500]">{node?.code} {node?.name}</span>
                      </div>
                      <span className="text-[11px] font-mono">{(c.confidenceScore * 100).toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-[13px] font-[600] text-[#666666] mb-2">错误归因</h3>
              <div className="flex flex-wrap gap-2">
                {diagnosisResult.errorTypeCandidates.map((e: any, i: number) => {
                  const errInfo = errorTypeMap[e.errorTypeCode];
                  return (
                    <div key={i} className={`flex items-center gap-1.5 px-2 py-1 rounded-[4px] border text-[11px] ${e.isSelected ? 'border-[#E2E8F0] bg-[#F0F4F8] text-[#4A5568]' : 'border-[#E1E5EB] bg-white text-[#666666] opacity-50'}`}>
                      {errInfo?.name || e.errorTypeCode}
                      <span className="font-mono opacity-60">{(e.confidenceScore * 100).toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Actionable Report Summary */}
        <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E1E5EB] p-4 flex flex-col gap-3">
          <h2 className="text-[14px] font-[700] text-[#21335B] mb-2">学习建议</h2>
          <div className="bg-white border border-[#E1E5EB] rounded-[8px] p-3 mb-2">
             <h3 className="text-[12px] font-[600] text-[#C53030] mb-2 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[#C53030]" />
               薄弱知识点提示
             </h3>
             <ul className="list-disc pl-5 text-[12px] text-[#666666] space-y-1">
               {reportData.weakKnowledgeNodeIds.map((nodeId: string) => {
                 const node = knowledgeNodes.find((n:any) => n.id === nodeId);
                 return <li key={nodeId}>{node?.code} {node?.name}</li>
               })}
             </ul>
          </div>

          <div>
             <ul className="list-none text-[12px] leading-[1.6]">
               {reportData.suggestions.map((sug: string, i: number) => (
                 <li key={i} className="mb-2 pl-3 relative text-[#333333] before:content-['•'] before:absolute before:left-0 before:text-[#4C8DA8]">
                   {sug}
                 </li>
               ))}
             </ul>
          </div>
        </div>

      </div>

      {/* Mastery List */}
      <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E1E5EB] p-4">
        <h2 className="text-[14px] font-[700] text-[#21335B] mb-3">掌握情况分析</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody className="text-[12px]">
              {masteryRecords.map((record: any, i: number) => {
                return (
                  <tr key={i} className="border-b border-[#E1E5EB] last:border-0 hover:bg-white transition-colors">
                    <td className="py-2.5 font-[500] text-[#333333]">{record.knowledgeName} <span className="text-[10px] text-[#666666] font-mono ml-1">({record.knowledgeNodeId})</span></td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-[500] bg-[#F0F4F8] text-[#4A5568] border border-[#E2E8F0]">
                        {record.masteryStatus}
                      </span>
                    </td>
                    <td className="py-2.5 w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="w-[60px] h-[6px] bg-[#EDF2F7] rounded-[3px] overflow-hidden">
                          <div className="h-full bg-[#4C8DA8]" style={{ width: `${record.masteryScore}%` }} />
                        </div>
                        <span className="text-[12px] font-mono w-6 text-right" style={{color: record.masteryScore > 60 ? '#4C8DA8' : '#C53030'}}>{record.masteryScore}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right flex justify-end gap-1">
                        {record.recentErrorTypeCodes.map((errCode: string) => {
                           const errInfo = errorTypeMap[errCode];
                           return (
                             <span key={errCode} className="text-[10px] px-1.5 py-0.5 rounded-[4px] border border-[#E2E8F0] bg-white text-[#666666]">
                               {errInfo?.name || errCode}
                             </span>
                           )
                        })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
