/**
 * Client-side score calculator (mirrors backend logic)
 * Used for real-time preview during assessment
 */

const REVERSED_IDS = [6, 9, 12, 13, 22];

const getAdjustedScore = (questionId, rawAnswer) => {
  return REVERSED_IDS.includes(questionId) ? 6 - rawAnswer : rawAnswer;
};

export const calculateScores = (wellnessResponses) => {
  const physicalIds = [1, 2, 3, 4, 5, 6, 7, 8];
  const mentalIds = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  const emotionalIds = [18, 19, 20, 21, 22, 23, 24, 25];

  const getGroupScore = (ids, max) => {
    let sum = 0;
    ids.forEach((id) => {
      const resp = wellnessResponses.find((r) => r.questionId === id);
      if (resp) sum += getAdjustedScore(id, resp.answer);
    });
    return Math.round((sum / max) * 100);
  };

  const physical = getGroupScore(physicalIds, 40);
  const mental = getGroupScore(mentalIds, 45);
  const emotional = getGroupScore(emotionalIds, 40);
  const overall = Math.round(physical * 0.35 + mental * 0.40 + emotional * 0.25);

  return { physical, mental, emotional, overall };
};

export const getZone = (score) => {
  if (score <= 40) return 'critical';
  if (score <= 70) return 'moderate';
  return 'optimal';
};

export const getZoneLabel = (score) => {
  if (score <= 40) return 'Critical';
  if (score <= 70) return 'Moderate';
  return 'Optimal';
};

export const getZoneColor = (score) => {
  if (score <= 40) return '#ef4444';
  if (score <= 70) return '#f59e0b';
  return '#10b981';
};

export const getPrakritiDescription = (type) => {
  const descriptions = {
    Vata: 'Creative, quick-thinking, and energetic in bursts. You thrive with routine, warm foods, and grounding practices.',
    Pitta: 'Sharp, focused, and driven. You excel under pressure but need cooling practices and downtime to prevent burnout.',
    Kapha: 'Stable, nurturing, and enduring. You need stimulation, light diet, and morning movement to maintain energy and vitality.',
  };
  return descriptions[type] || 'Complete the Prakriti section to discover your Ayurvedic constitution.';
};
