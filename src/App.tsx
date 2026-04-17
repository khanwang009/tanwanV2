/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { LayoutDashboard, Network, Component, Backpack } from 'lucide-react';
import Dashboard from './components/Dashboard';
import KnowledgeGraph from './components/KnowledgeGraph';
import TemplateEngine from './components/TemplateEngine';
import TrainingPack from './components/TrainingPack';
import LevelPlayer from './components/LevelPlayer';
import { currentStudent, currentUser } from './data';

export default function App() {
  const [activePack, setActivePack] = useState<any>(null);

  if (activePack) {
    return <LevelPlayer pack={activePack} onExit={() => setActivePack(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans text-[#333333]">
      <header className="bg-white border-b border-[#E1E5EB] px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-[18px] font-bold text-[#21335B] flex items-center gap-2">
          <Network className="w-5 h-5 text-[#4C8DA8]" />
          五年级数学学习诊断与强化系统
        </h1>
        <div className="flex items-center gap-4 text-[13px] text-[#666666]">
          <span>{currentStudent.name} ({currentStudent.grade})</span>
          <span className="font-semibold text-[#333333]">
            {currentUser.nickname}
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Tabs defaultValue="dashboard" className="w-full focus:outline-none">
          <TabsList className="flex space-x-1 border-b border-[#E1E5EB] mb-6 overflow-x-auto">
            <TabsTrigger 
              value="dashboard" 
              className="px-5 py-3 flex items-center gap-2 text-[13px] text-[#666666] hover:bg-[#F8FAFC] data-[state=active]:bg-[#F0F4F8] data-[state=active]:text-[#21335B] data-[state=active]:border-b-[3px] data-[state=active]:border-[#21335B] data-[state=active]:font-medium transition-colors outline-none whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4" />
              诊断报告
            </TabsTrigger>
            <TabsTrigger 
              value="knowledge" 
              className="px-5 py-3 flex items-center gap-2 text-[13px] text-[#666666] hover:bg-[#F8FAFC] data-[state=active]:bg-[#F0F4F8] data-[state=active]:text-[#21335B] data-[state=active]:border-b-[3px] data-[state=active]:border-[#21335B] data-[state=active]:font-medium transition-colors outline-none whitespace-nowrap"
            >
              <Network className="w-4 h-4" />
              知识图谱
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="px-5 py-3 flex items-center gap-2 text-[13px] text-[#666666] hover:bg-[#F8FAFC] data-[state=active]:bg-[#F0F4F8] data-[state=active]:text-[#21335B] data-[state=active]:border-b-[3px] data-[state=active]:border-[#21335B] data-[state=active]:font-medium transition-colors outline-none whitespace-nowrap"
            >
              <Component className="w-4 h-4" />
              模板引擎
            </TabsTrigger>
            <TabsTrigger 
              value="packs" 
              className="px-5 py-3 flex items-center gap-2 text-[13px] text-[#666666] hover:bg-[#F8FAFC] data-[state=active]:bg-[#F0F4F8] data-[state=active]:text-[#21335B] data-[state=active]:border-b-[3px] data-[state=active]:border-[#21335B] data-[state=active]:font-medium transition-colors outline-none whitespace-nowrap"
            >
              <Backpack className="w-4 h-4" />
              强化练习包
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="outline-none">
            <Dashboard />
          </TabsContent>
          <TabsContent value="knowledge" className="outline-none">
            <KnowledgeGraph />
          </TabsContent>
          <TabsContent value="templates" className="outline-none">
            <TemplateEngine />
          </TabsContent>
          <TabsContent value="packs" className="outline-none">
            <TrainingPack onStartTraining={setActivePack} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
