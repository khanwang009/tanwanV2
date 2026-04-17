import React, { useState } from 'react';
import { knowledgeNodes, templateRegistry, levels } from '../data';
import { LevelConfig, TrainingPack } from '../engine/types';
import { Play, Code, Copy, Settings, Plus, Save } from 'lucide-react';
import LevelPlayer from './LevelPlayer';

export default function AdminConfigurator() {
  const [editingLevel, setEditingLevel] = useState<Partial<LevelConfig>>({
    id: `level_custom_${Date.now()}`,
    title: '新建关卡',
    goal: '填写教研目标',
    difficulty: 'medium',
    levelType: 'understanding',
    templateId: 'tpl_01',
    knowledgeNodeId: 'u1_k01',
    params: {}
  });

  const [paramsJson, setParamsJson] = useState('{}');
  const [jsonError, setJsonError] = useState('');
  const [generatedPack, setGeneratedPack] = useState<TrainingPack | null>(null);

  const handleLevelChange = (field: keyof LevelConfig, value: any) => {
    setEditingLevel(prev => ({ ...prev, [field]: value }));
  };

  const handleParamsChange = (value: string) => {
    setParamsJson(value);
    try {
      const parsed = JSON.parse(value);
      setEditingLevel(prev => ({ ...prev, params: parsed }));
      setJsonError('');
    } catch (e) {
      setJsonError('JSON格式错误：' + (e as Error).message);
    }
  };

  const loadTemplateDefaults = (templateId: string) => {
    // Some rough defaults for params based on templates to help authors
    let defaultParams = {};
    if (templateId === 'tpl_01') defaultParams = { type: 'area_vs_volume', text: '填入题干...', options: ['A', 'B', 'C', 'D'], correctIndex: 0 };
    if (templateId === 'tpl_08') defaultParams = { length: 50, width: 40, height: 30, facesToSelect: ['bottom', 'front', 'back', 'left', 'right'] };
    if (templateId === 'tpl_12') defaultParams = { fracA: [2, 3], fracB: [3, 5], targetDenom: 15, expectedA: [10, 15], expectedB: [9, 15] };
    if (templateId === 'tpl_15') defaultParams = { data: [{x:'1月',y:10}, {x:'2月',y:15}], question: '题目文本', correctIndex: 1 };
    
    setParamsJson(JSON.stringify(defaultParams, null, 2));
    setEditingLevel(prev => ({ ...prev, templateId, params: defaultParams }));
  };

  const startTestPlay = () => {
    if (jsonError) {
      alert('请先修复JSON配置错误');
      return;
    }
    const pack: TrainingPack = {
      id: `pack_test_${Date.now()}`,
      studentId: 'admin_tester',
      themeName: `测试游玩：${editingLevel.title}`,
      status: 'published',
      sourceDiagnosisIds: [],
      knowledgeNodeIds: [editingLevel.knowledgeNodeId || ''],
      errorTypeCodes: [],
      primaryTemplateId: editingLevel.templateId || '',
      fallbackTemplateIds: [],
      levelIds: [editingLevel.id || ''],
      suggestedFlow: [editingLevel.levelType || 'understanding']
    };
    
    // Patch levels for the sake of the player (normally fetched from data/index.json, but here we inject it locally)
    const activeLevel = editingLevel as LevelConfig;
    // We can't globally update `levels` array since it's a module export that might be read-only or not triggering react renders.
    // We'll pass the level data into a custom state that LevelPlayer can handle, OR we just modify the Player to accept an array of LevelConfigs directly.
    // Wait, the current LevelPlayer expects `pack.levelIds` and fetches `levels.find()`. 
    // Let's monkey-patch for the test:
    const existingIndex = levels.findIndex(l => l.id === activeLevel.id);
    if (existingIndex >= 0) {
      levels[existingIndex] = activeLevel;
    } else {
      levels.push(activeLevel);
    }
    
    setGeneratedPack(pack);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(editingLevel, null, 2));
    alert('已复制关卡配置的JSON！可将其粘贴到 src/data/index.ts 的 levels 数组中。');
  };

  if (generatedPack) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F5F7FA]">
         <div className="absolute top-4 left-4 z-50">
           <button onClick={() => setGeneratedPack(null)} className="px-4 py-2 bg-[#21335B] text-white rounded-lg shadow-md hover:bg-[#344869]">
              退出测试游玩
           </button>
         </div>
         <LevelPlayer pack={generatedPack} onExit={() => setGeneratedPack(null)} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      
      {/* Editor Form */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E1E5EB] p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-[#21335B] mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#4C8DA8]" />
          教研关卡配置台
        </h2>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[13px] font-bold text-[#666666] mb-1">关卡ID (Level ID)</label>
                <input 
                  type="text" 
                  value={editingLevel.id} 
                  onChange={e => handleLevelChange('id', e.target.value)}
                  className="w-full border border-[#E1E5EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4C8DA8] focus:border-[#4C8DA8] outline-none"
                />
             </div>
             <div>
                <label className="block text-[13px] font-bold text-[#666666] mb-1">难度 (Difficulty)</label>
                <select 
                  value={editingLevel.difficulty} 
                  onChange={e => handleLevelChange('difficulty', e.target.value)}
                  className="w-full border border-[#E1E5EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4C8DA8] focus:border-[#4C8DA8] outline-none"
                >
                  <option value="easy">简单 (Easy)</option>
                  <option value="medium">中等 (Medium)</option>
                  <option value="hard">困难 (Hard)</option>
                </select>
             </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#666666] mb-1">关卡标题 (Title)</label>
            <input 
              type="text" 
              value={editingLevel.title} 
              onChange={e => handleLevelChange('title', e.target.value)}
              className="w-full border border-[#E1E5EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4C8DA8] focus:border-[#4C8DA8] outline-none"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#666666] mb-1">训练目标 (Goal)</label>
            <input 
              type="text" 
              value={editingLevel.goal} 
              onChange={e => handleLevelChange('goal', e.target.value)}
              className="w-full border border-[#E1E5EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4C8DA8] focus:border-[#4C8DA8] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[13px] font-bold text-[#666666] mb-1">绑定知识点 (Knowledge Node)</label>
                <select 
                  value={editingLevel.knowledgeNodeId} 
                  onChange={e => handleLevelChange('knowledgeNodeId', e.target.value)}
                  className="w-full border border-[#E1E5EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4C8DA8] focus:border-[#4C8DA8] outline-none"
                >
                  {knowledgeNodes.map(kn => (
                    <option key={kn.id} value={kn.id}>{kn.code} - {kn.name}</option>
                  ))}
                </select>
             </div>
             <div>
                <label className="block text-[13px] font-bold text-[#666666] mb-1">关卡类型 (Level Type)</label>
                <select 
                  value={editingLevel.levelType} 
                  onChange={e => handleLevelChange('levelType', e.target.value)}
                  className="w-full border border-[#E1E5EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4C8DA8] focus:border-[#4C8DA8] outline-none"
                >
                  <option value="diagnostic">诊断 (Diagnostic)</option>
                  <option value="understanding">理解 (Understanding)</option>
                  <option value="transfer">迁移 (Transfer)</option>
                  <option value="review">复习复打 (Review)</option>
                </select>
             </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#666666] mb-1">选择引擎模板 (Template)</label>
            <select 
              value={editingLevel.templateId} 
              onChange={e => loadTemplateDefaults(e.target.value)}
              className="w-full border border-[#E1E5EB] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#4C8DA8] focus:border-[#4C8DA8] outline-none"
            >
              {templateRegistry.map(tpl => (
                 <option key={tpl.id} value={tpl.id}>{tpl.code} - {tpl.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-[13px] font-bold text-[#666666] mb-1 flex justify-between">
              <span>自定义参数 (Params JSON)</span>
              {jsonError && <span className="text-[#EF7D57] font-normal">{jsonError}</span>}
            </label>
            <textarea 
              value={paramsJson}
              onChange={e => handleParamsChange(e.target.value)}
              className={`w-full flex-1 min-h-[250px] border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-[#4C8DA8] focus:border-[#4C8DA8] outline-none resize-y ${jsonError ? 'border-[#EF7D57]' : 'border-[#E1E5EB]'}`}
              placeholder="{}"
            />
          </div>
        </div>
      </div>

      {/* Preview / Export */}
      <div className="bg-[#1A2639] rounded-xl shadow-lg border border-[#3D5275] p-6 flex flex-col h-full text-[#F5F7FA]">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <Code className="w-6 h-6 text-[#5BB9B0]" />
             配置生成器
           </h2>
           <div className="flex items-center gap-3">
             <button onClick={copyJson} className="flex items-center gap-2 bg-[#2D3E5A] hover:bg-[#344869] px-4 py-2 rounded-lg text-sm transition-colors border border-[#3D5275]">
               <Copy className="w-4 h-4" /> 拷贝配置
             </button>
             <button onClick={startTestPlay} className="flex items-center gap-2 bg-[#5BB9B0] hover:bg-[#4CA39B] text-[#1A2639] px-6 py-2 rounded-lg text-sm font-bold transition-colors">
               <Play className="w-4 h-4" /> 试玩此关卡
             </button>
           </div>
        </div>

        <div className="flex-1 bg-[#121B27] rounded-lg p-4 font-mono text-sm overflow-y-auto custom-scrollbar border border-black shadow-inner">
           <pre className="text-[#A2B4CC] leading-relaxed">
{JSON.stringify({
  id: editingLevel.id,
  templateId: editingLevel.templateId,
  title: editingLevel.title,
  goal: editingLevel.goal,
  difficulty: editingLevel.difficulty,
  levelType: editingLevel.levelType,
  knowledgeNodeId: editingLevel.knowledgeNodeId,
  params: editingLevel.params
}, null, 2)}
           </pre>
        </div>

        <div className="mt-6 bg-[rgba(91,185,176,0.1)] border border-[rgba(91,185,176,0.2)] rounded-lg p-4 text-sm text-[#8A9EB8] leading-relaxed">
          <strong className="text-[#5BB9B0]">教研人员提示：</strong><br />
          使用此工具可以无限生成不同参数的新关卡。配置完成后点击“试玩”可在引擎中直接体验。<br />
          确认无误后点击“拷贝配置”，将其粘贴进 <code className="bg-[#2D3E5A] px-1 rounded text-[#E1E5EB]">src/data/index.ts</code> 的 <code className="bg-[#2D3E5A] px-1 rounded text-[#E1E5EB]">levels</code> 数组中即可生效。
        </div>

      </div>

    </div>
  );
}
