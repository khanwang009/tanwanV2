import { diagnosisResult, knowledgeNodes, nodeTemplateMapping, templateRegistry, levels } from '../data';
import { TrainingPack, LevelConfig } from './types';

/**
 * A mock pack generator that transforms a diagnosis result into a training pack.
 * In a real backend, this would dynamically generate varied permutations of levels.
 */
export function generatePackFromDiagnosis(diagnosis: any): TrainingPack {
  const selectedNodes = diagnosis.selectedKnowledgeNodeIds;
  const errCodes = diagnosis.selectedErrorTypeCodes;

  // Step 1: Find primary templates for the nodes
  const primaryNodeId = selectedNodes[0];
  const mapping = nodeTemplateMapping[primaryNodeId];
  
  // Decide primary template based on mapping and fallback
  let chosenTemplateId = mapping?.primaryTemplateId || 'tpl_01';
  
  // Minimal example: if there is a structure error, we might fallback
  if (errCodes.includes('structure_error') && mapping?.fallbackByError?.['structure_error']) {
    chosenTemplateId = mapping.fallbackByError['structure_error'][0];
  }

  // Step 2: Grab pre-defined levels or generate configurations dynamically
  const flow = ['diagnostic', 'understanding', 'transfer', 'review'];
  
  // For MVP, we filter our pre-defined levels matching the flow and nodes
  const selectedLevelIds = [];
  const hydratedLevels: LevelConfig[] = [];

  // Match at least one level for each step in the flow
  flow.forEach(step => {
    const matchingLevel = levels.find(l => 
      l.levelType === step && 
      (selectedNodes.includes(l.knowledgeNodeId) || l.knowledgeNodeId.startsWith(diagnosis.unitId))
    );
    if (matchingLevel) {
      selectedLevelIds.push(matchingLevel.id);
      hydratedLevels.push(matchingLevel as LevelConfig);
    }
  });

  const pack: TrainingPack = {
    id: `pack_gen_${Date.now()}`,
    studentId: diagnosis.studentId,
    themeName: "AI 动态补弱强化包",
    status: 'draft',
    sourceDiagnosisIds: [diagnosis.id],
    knowledgeNodeIds: selectedNodes,
    errorTypeCodes: errCodes,
    primaryTemplateId: chosenTemplateId,
    levelIds: selectedLevelIds,
    suggestedFlow: flow,
    levels: hydratedLevels
  };

  return pack;
}
