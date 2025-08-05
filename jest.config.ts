import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  setupFiles: ['./jest.setup.ts'], // <- Adiciona aqui o setup do chrome
};

export default config;
