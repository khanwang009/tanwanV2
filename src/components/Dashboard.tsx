import React, { useState, useEffect, useCallback } from 'react';
import { uploadedQuestion, diagnosisResult, reportData, masteryRecords, knowledgeNodes, errorTypeMap } from '../data';
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface UploadTask {
  id: string;
  imageUrl: string;
  filename: string;
  status: 'pending' | 'uploading' | 'ocr' | 'diagnosing' | 'completed' | 'error';
  progress: number;
  questionText?: string;
  mockDiagnosis?: any;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<UploadTask[]>([
    {
      id: 'mock_1',
      imageUrl: uploadedQuestion.imageUrl,
      filename: uploadedQuestion.filename,
      status: 'completed',
      progress: 100,
      questionText: uploadedQuestion.questionText,
      mockDiagnosis: diagnosisResult
    }
  ]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('mock_1');

  const addAndRunTasks = useCallback((newTasks: UploadTask[]) => {
    setTasks(prev => [...newTasks, ...prev]);
    if (newTasks.length > 0) {
      setSelectedTaskId(newTasks[0].id);
    }
    
    newTasks.forEach(task => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setTasks(prev => prev.map(t => t.id === task.id ? { 
            ...t, 
            status: 'completed', 
            progress: 100, 
            questionText: "这是一道由OCR新识别出的测试题目内容...",
            mockDiagnosis: {
              ...diagnosisResult,
              confidenceScore: 0.8 + Math.random() * 0.15 // slightly randomize score for fake dynamics
            }
          } : t));
        } else {
          let status: UploadTask['status'] = 'uploading';
          if (currentProgress > 30) status = 'ocr';
          if (currentProgress > 70) status = 'diagnosing';
          
          setTasks(prev => prev.map(t => t.id === task.id ? { 
            ...t, 
            status, 
            progress: currentProgress 
          } : t));
        }
      }, 500);
    });
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const newTasks: UploadTask[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
             const objectUrl = URL.createObjectURL(file);
             newTasks.push({
               id: `task_${Date.now()}_${i}`,
               imageUrl: objectUrl,
               filename: `pasted-image-${Date.now()}-${i}.png`,
               status: 'pending',
               progress: 0
             });
          }
        }
      }
      if (newTasks.length > 0) {
        addAndRunTasks(newTasks);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addAndRunTasks]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newTasks: UploadTask[] = Array.from(e.target.files).map((file, i) => ({
        id: `task_${Date.now()}_${i}`,
        imageUrl: URL.createObjectURL(file),
        filename: file.name,
        status: 'pending',
        progress: 0
      }));
      if (newTasks.length > 0) {
        addAndRunTasks(newTasks);
      }
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { label: '等待', color: 'bg-gray-100 text-gray-500', icon: null };
      case 'uploading': return { label: '上传中', color: 'bg-blue-50 text-blue-600', icon: <Loader2 className="w-3 h-3 animate-spin"/> };
      case 'ocr': return { label: 'OCR识别...', color: 'bg-yellow-50 text-yellow-600', icon: <Loader2 className="w-3 h-3 animate-spin"/> };
      case 'diagnosing': return { label: '诊断中...', color: 'bg-indigo-50 text-indigo-600', icon: <Loader2 className="w-3 h-3 animate-spin"/> };
      case 'completed': return { label: '完成', color: 'bg-green-50 text-green-600', icon: <CheckCircle className="w-3 h-3"/> };
      case 'error': return { label: '失败', color: 'bg-red-50 text-red-600', icon: <AlertCircle className="w-3 h-3"/> };
      default: return { label: '未知', color: 'bg-gray-100 text-gray-500', icon: null };
    }
  };

  const activeTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];
  const activeDiagnosis = activeTask?.mockDiagnosis || diagnosisResult;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Upload Column */}
        <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E1E5EB] p-4 flex flex-col gap-3 lg:h-[600px]">
          <h2 className="text-[14px] font-[700] text-[#21335B] mb-2 flex items-center justify-between">
            <span>批量识别任务 ({tasks.length})</span>
            <span className="text-[11px] font-normal text-[#666] bg-[#E1E5EB] px-2 py-0.5 rounded-full">
              已完成 {tasks.filter(t => t.status === 'completed').length}
            </span>
          </h2>
          
          <label className="border-2 border-dashed border-[#A2B4CC] bg-white rounded-[8px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F0F4F8] transition-colors group shrink-0">
             <UploadCloud className="w-8 h-8 text-[#4C8DA8] mb-2 group-hover:scale-110 transition-transform" />
             <span className="text-[13px] font-[600] text-[#21335B]">点击、拖拽或Ctrl+V粘贴多图</span>
             <span className="text-[11px] text-[#666666] mt-1">批量极速识别</span>
             <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
          </label>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mt-1 pr-2">
            {tasks.map(task => {
               const statusInfo = getStatusDisplay(task.status);
               const isSelected = selectedTaskId === task.id;
               return (
                 <div 
                   key={task.id} 
                   onClick={() => setSelectedTaskId(task.id)}
                   className={`bg-white border rounded-[8px] p-3 flex gap-3 relative overflow-hidden group cursor-pointer transition-all ${isSelected ? 'border-[#21335B] shadow-sm ring-1 ring-[#21335B]' : 'border-[#E1E5EB] hover:border-[#4C8DA8]'}`}
                 >
                    {/* Progress Background */}
                    {task.status !== 'completed' && task.status !== 'error' && (
                       <div className="absolute inset-0 bg-[#F0F4F8] opacity-30 origin-left transition-transform duration-300 pointer-events-none" style={{ transform: `scaleX(${task.progress / 100})` }} />
                    )}

                    <div className="w-12 h-16 shrink-0 bg-[#E1E5EB] rounded-[4px] overflow-hidden relative z-10">
                       <img src={task.imageUrl} alt={task.filename} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                       <div className="truncate text-[12px] font-[600] text-[#21335B]">{task.filename}</div>
                       <div className="flex items-center gap-2 mt-1">
                          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-medium ${statusInfo.color}`}>
                             {statusInfo.icon}
                             {statusInfo.label}
                          </span>
                          {task.status !== 'completed' && task.status !== 'error' && (
                             <span className="text-[10px] text-[#666] font-mono">{Math.round(task.progress)}%</span>
                          )}
                       </div>
                       {task.questionText && (
                         <div className="truncate text-[10px] text-[#666] mt-1 pr-4 italic">
                            "{task.questionText}"
                         </div>
                       )}
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); setTasks(prev => prev.filter(t => t.id !== task.id)); }}
                      className="absolute top-2 right-2 text-[#A2B4CC] hover:text-[#C53030] bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                 </div>
               )
            })}
          </div>
        </div>

        {/* Diagnosis Result (Reflects Active Task) */}
        <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E1E5EB] p-4 flex flex-col gap-3 lg:h-[600px] overflow-y-auto custom-scrollbar">
          <h2 className="text-[14px] font-[700] text-[#21335B] mb-2 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-2">
            错题诊断溯源
            <span className="bg-[#FFF5F5] text-[#C53030] px-2 py-0.5 rounded-[10px] font-[600] text-[11px] font-sans">
              置信度: {(activeDiagnosis.confidenceScore * 100).toFixed(0)}%
            </span>
          </h2>
          
          <div className="aspect-[3/2] bg-[#000] rounded-[8px] overflow-hidden border border-[#E1E5EB] relative">
             {activeTask ? (
               <img src={activeTask.imageUrl} className="w-full h-full object-contain opacity-90" alt="Preview"/>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-[#666]">无选中的任务</div>
             )}
          </div>
          
          {activeTask?.status === 'completed' ? (
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="text-[13px] font-[600] text-[#666666] mb-2">涉及知识点</h3>
                <div className="flex flex-col gap-2">
                  {activeDiagnosis.knowledgeCandidates.map((c: any, i: number) => {
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
                  {activeDiagnosis.errorTypeCandidates.map((e: any, i: number) => {
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
          ) : (
            <div className="flex-1 flex items-center justify-center text-[13px] text-[#666] italic mt-4">
               等待诊断完成...
            </div>
          )}
        </div>

        {/* Actionable Report Summary */}
        <div className="bg-[#F8FAFC] rounded-[12px] border border-[#E1E5EB] p-4 flex flex-col gap-3 lg:h-[600px] overflow-y-auto custom-scrollbar">
          <h2 className="text-[14px] font-[700] text-[#21335B] mb-2">学习建议汇总</h2>
          <div className="bg-white border border-[#E1E5EB] rounded-[8px] p-3 mb-2">
             <h3 className="text-[12px] font-[600] text-[#C53030] mb-2 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-[#C53030]" />
               薄弱知识点概览
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
        <h2 className="text-[14px] font-[700] text-[#21335B] mb-3">长期掌握情况分析</h2>
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
