export const validateEmailLocalPart = (emailLocalPart: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+$/;
  return regex.test(emailLocalPart);
};

export const validateEmailDomainPart = (emailDomainPart: string): boolean => {
  const regex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(emailDomainPart);
};

export const validateNickname = (nickname: string): boolean => {
  const regex = /^[가-힣a-zA-Z0-9]{2,8}$/;
  return regex.test(nickname);
};

export const validatePassword = (password: string): boolean => {
  const regex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!~`<>,./?;:'"[\]{}\\()|_-])\S*$/;
  return regex.test(password);
};

export const validateRemoteName = (remoteName: string): boolean => {
  const regex = /^[a-zA-Z0-9-_]{3,32}$/;
  return regex.test(remoteName);
};

export const validateProjectName = (projectName: string): boolean => {
  const regex = /^[a-zA-Z가-힣0-9-_]{2,20}$/;
  return regex.test(projectName);
};
