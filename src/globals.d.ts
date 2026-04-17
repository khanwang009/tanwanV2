export {};

declare global {
  interface Window {
    currentUser: any;
    currentStudent: any;
    unitMap: Record<string, any>;
    knowledgeNodes: any[];
    templateRegistry: any[];
    nodeTemplateMapping: Record<string, any>;
    uploadedQuestion: any;
    diagnosisResult: any;
    levels: any[];
    generatedPack: any;
    masteryRecords: any[];
    reportData: any;
    errorTypeMap: Record<string, any>;
    masteryStatusMap: Record<string, any>;
  }
}
