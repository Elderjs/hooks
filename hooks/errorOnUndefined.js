/**
 * How to Use:
 * 1. Add this hook into your hooks.js.
 * 2. During build if an 'undefined' is encountered it will error. This is useful for detecting missing data on large site.
 */

const hooks = [
  {
    hook: 'html',
    name: 'errorOnUndefined',
    description: 'Adds an error to the error array if it finds an undefined in the htm string.',
    priority: 2,
    run: async ({ errors, htmlString, request }) => {
      const matches = htmlString.match(/(undefined)/gim);
      if (matches && matches.length > 0) {
        return {
          errors: [...errors, new Error(`Undefined(s) found ${JSON.stringify(matches)} on ${request.permalink}`)],
        };
      }
    },
  },
];

module.exports = hooks;
