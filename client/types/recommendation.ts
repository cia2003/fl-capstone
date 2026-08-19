export type Recommendation = { 
    filmId: string; 
    score: number; 
    reasoning: string };

export type RecommendationResponse = { 
    recommendations: Recommendation[] };
