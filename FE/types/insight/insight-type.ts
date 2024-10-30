export interface Insight {
  performanceSummary: string;
  performanceUpdateTime: string;
  dailySummary: string;
  dailyUpdateTime: string;
  trendSummary: string;
  trendUpdateTime: string;
  recommendation: string;
  recommendUpdateTime: string;
}

export interface Summary {
  id: number;
  time: string;
  content: string;
  isChecked: boolean;
}

export interface InsightSummary {
  summaries: Summary[];
}
