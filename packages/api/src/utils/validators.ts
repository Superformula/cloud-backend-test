export const validateDob = (dob: string): void => {
  if (new Date(dob).getTime() > new Date().getTime()) {
    throw new Error('Malformed Date of birth');
  }
};
