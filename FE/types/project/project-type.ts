export interface Project {
  id: number;
  isUrgent: boolean;
  name: string;
  description: string;
  containerStatus: "WORKING" | "NOT_WORKING";
  cpuUsage: string;
  memoryUsage: string;
}

export interface ProjectList {
  projects: Project[];
}

export interface ProjectDetail {
  name: string;
  description: string;
  summaryContent: string;
  summaryUpdateDate: string;
  logContent: string;
}

export interface LogMessage {
  name: string;
  description: string;
  fileName: string;
  logMessage: string;
}

export interface LogFileList {
  files: string[];
}

export interface LogFile {
  name: string;
}

export interface LogFiles {
  logFiles: LogFile[];
}

export interface Summary {
  id: number;
  time: string;
  content: string;
  isChecked: boolean;
}

export interface ProjectSummaryList {
  name: string;
  description: string;
  summaries: Summary[];
  isLastPage: boolean;
}

export interface ProjectInfo {
  projectName: string;
  description: string;
  containerName: string;
}

export interface Container {
  containerName: string;
}

export interface ProjectInfo {
  projectName: string;
  usingContainerName: string;
  description: string;
  containers: Container[];
}

export interface TerminalInput {
  type: string;
  value: string;
}
