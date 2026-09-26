export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  // at least 8 chars, 1 letter, 1 number
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateTeamForm(team) {
  const errors = {};
  if (!isNotEmpty(team.name)) errors.name = 'Team name cannot be empty';
  if (!isNotEmpty(team.description)) errors.description = 'Description is required';
  if (!team.maxMembers || team.maxMembers < 1) errors.maxMembers = 'Team must allow at least 1 member';
  return errors;
}

export function validateRegisterForm(form) {
  const errors = {};
  if (!isNotEmpty(form.name)) errors.name = 'Name is required';
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email';
  if (!isValidPassword(form.password))
    errors.password = 'Password must be 8+ chars with a letter and a number';
  return errors;
}
