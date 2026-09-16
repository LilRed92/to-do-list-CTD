import { sanitizeText } from './sanitizeText.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  const trimmed = sanitizeText(email);
  if (!trimmed) return 'Email is required';
  if (trimmed.length > 100) return 'Email must be 100 characters or fewer';
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password) {
  const trimmed = password || '';
  if (!trimmed) return 'Password is required';
  if (trimmed.length > 100) return 'Password must be 100 characters or fewer';
  return '';
}
