export interface SshInfo {
  id: number;
  remoteHost: string;
  remoteKeyPath: string;
  remoteName: string;
  isWorking: boolean;
}

export interface SshInfoEdit {
  remoteHost: string;
  remoteKeyPath: string;
  remoteName: string;
}

export interface Setting {
  monitoringSshId: number;
  nickName: string;
  receivingAlarm: boolean;
  sshInfos: SshInfo[];
}
