export interface LogFiles {
  fileName: string;
  redirectURL: string;
}

export interface Insights {
  projectName: string;
  date: string;
  type: "GENERAL" | "ANOMALY";
  content: string;
}

export interface SearchResult {
  logfiles: LogFiles[];
  insights: Insights[];
}
