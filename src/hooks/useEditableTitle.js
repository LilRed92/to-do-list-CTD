import { useState } from 'react';
import { sanitizeText } from '../utils/sanitizeText.js';

export function useEditableTitle(initialTitle) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(initialTitle);

  const startEditing = () => {
    setWorkingTitle(initialTitle);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setWorkingTitle(initialTitle);
    setIsEditing(false);
  };

  const updateTitle = (newTitle) => {
    setWorkingTitle(newTitle);
  };

  const finishEdit = () => {
    setIsEditing(false);
    return sanitizeText(workingTitle);
  };

  return {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
  };
}