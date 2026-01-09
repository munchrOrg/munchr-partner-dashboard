const crypto = require("crypto");

/**
 * Generate a secure random string
 * @param {number} length - length of the secret
 * @returns {string}
 */
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// Example usage
const secret = generateSecret(32);
console.log("Generated Secret:", secret);

// Export if you want to reuse it in other files
module.exports = generateSecret;
