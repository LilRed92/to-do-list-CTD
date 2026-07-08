module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      // This defines the exact scopes the AI is allowed to choose from
      'scope-enum': [2, 'always', ['client', 'server', 'fullstack', 'root']],
      // This forces the AI to always include a scope in the message
      'scope-empty': [2, 'never'] 
    },
  };