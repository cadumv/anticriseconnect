
/**
 * Username validation utilities
 */

/**
 * Validates a username format
 * - Must start with a letter
 * - Can contain lowercase letters, numbers, underscores and dots
 * - No special characters, spaces, uppercase letters, or accents
 * - Length between 3 and 20 characters
 */
export const isValidUsernameFormat = (username: string): boolean => {
  // Must start with a letter and contain only lowercase letters, numbers, dots or underscores
  // Length between 3 and 20 characters
  return /^[a-z][a-z0-9._]{2,19}$/.test(username);
};

/**
 * Checks if username looks like a phone number, CPF, or sequence of numbers
 */
export const looksLikeInvalidContent = (username: string): boolean => {
  return /^\d{3,}$/.test(username) || // Sequence of 3+ digits
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(username) || // CPF pattern
    /^\(\d{2}\)\s*\d{4,5}-\d{4}$/.test(username); // Phone pattern
};

export const getInvalidUsernameMessage = (reason: 'format' | 'content'): string => {
  if (reason === 'format') {
    return "Nome de usuário deve conter entre 3 e 20 caracteres, iniciando com uma letra minúscula, seguido por letras minúsculas, números, pontos ou underscores. Sem espaços, acentos ou caracteres especiais.";
  }
  
  return "Nome de usuário não pode ser um número de telefone, CPF ou sequência de números.";
};
