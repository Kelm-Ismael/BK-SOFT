// Archivo NUEVO — issue #22 (Test Unitario BE)
// Config de Jest + ts-jest para poder testear los casos de uso en TypeScript.
// moduleNameMapper es necesario porque el proyecto usa "module": "nodenext"
// y todos los imports relativos llevan extensión ".js" (ej. "./foo.js"),
// aunque el archivo real sea "foo.ts". Sin este mapeo, Jest no encuentra
// el módulo al correr los tests.
/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/tests/**/*.test.ts"],
  
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }]
  },
  clearMocks: true
};