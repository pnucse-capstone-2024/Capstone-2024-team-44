export interface Container {
  containerName: string;
}

export interface CloudInstance {
  cloudName: string;
  sshInfoId: number;
  containers: Container[];
}

export interface CloudInstanceList {
  cloudInstances: CloudInstance[];
}
