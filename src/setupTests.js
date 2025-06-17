// src/setupTests.js

// 1) jest-dom pour toHaveTextContent(), toBeInTheDocument(), etc.
require('@testing-library/jest-dom');

// 2) polyfill TextEncoder/TextDecoder pour React Router
const { TextEncoder, TextDecoder } = require('util');
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;
