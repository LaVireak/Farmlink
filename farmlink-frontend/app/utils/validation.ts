export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  // Simple but practical email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export default isValidEmail;
