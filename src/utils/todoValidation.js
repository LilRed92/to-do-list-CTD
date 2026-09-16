import { sanitizeText } from './sanitizeText.js';

export function isValidTodoTitle(title) {
    const sanitizedTitle = sanitizeText(title);
    return sanitizedTitle !== '' && sanitizedTitle.length <= 100;
}