export const validateIPv4 = (value: string) => {
  const pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return pattern.test(value);
};

export const validateIPv6 = (value: string) => {
  const pattern = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})$/;
  return pattern.test(value);
};

export const filterInput = (value: string, isIPv6: boolean): string => {
  if (isIPv6) {
    return value.replace(/[^0-9a-fA-F:]/g, "");
  } else {
    return value.replace(/[^0-9.]/g, "");
  }
};
