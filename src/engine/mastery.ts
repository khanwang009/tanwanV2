import { LevelAttempt } from './types';
import { masteryRecords } from '../data';

export function updateMastery(attempts: LevelAttempt[]) {
  // Simple MVP logic: 
  // If user gets multiple corrects, score goes up. If incorrect, score goes down.
  // Updates the global mock data structure in memory.
  
  const updates = new Map();

  attempts.forEach(attempt => {
    const recordIndex = masteryRecords.findIndex(r => r.knowledgeNodeId === attempt.knowledgeNodeId);
    if (recordIndex === -1) return;

    const record = masteryRecords[recordIndex];
    let newScore = record.masteryScore;

    if (attempt.isCorrect) {
      newScore = Math.min(100, newScore + 15);
    } else {
      newScore = Math.max(0, newScore - 10);
      if (attempt.errorTypesMatched && attempt.errorTypesMatched.length > 0) {
        // Record new error type
        const newError = attempt.errorTypesMatched[0];
        if (!record.recentErrorTypeCodes.includes(newError)) {
          record.recentErrorTypeCodes.push(newError);
        }
      }
    }

    let newStatus = "未掌握";
    if (newScore >= 85) newStatus = "稳定掌握";
    else if (newScore >= 70) newStatus = "基本掌握";
    else if (newScore >= 50) newStatus = "训练中";
    else if (newScore >= 35) newStatus = "初步理解";

    masteryRecords[recordIndex] = {
      ...record,
      masteryScore: Math.round(newScore),
      masteryStatus: newStatus
    };
  });

  return masteryRecords;
}
