#!/usr/bin/env node
/**
 * SignalCheck Dev Runner
 * Concurrently spawns the Backend (port 5001) and Frontend (port 3000)
 * with colored terminal prefixes and clean shutdown handling.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cyan = '\x1b[36m';
const magenta = '\x1b[35m';
const green = '\x1b[32m';
const reset = '\x1b[0m';
const bold = '\x1b[1m';

console.log(`${bold}${green}======================================================${reset}`);
console.log(`${bold}${green}  Starting SignalCheck Platform (Backend + Frontend)  ${reset}`);
console.log(`${bold}${green}======================================================${reset}\n`);

// Start Backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'backend'),
  shell: true,
  env: { ...process.env, FORCE_COLOR: 'true' },
});

backend.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(Boolean);
  lines.forEach((l) => console.log(`${cyan}[backend]${reset} ${l}`));
});

backend.stderr.on('data', (data) => {
  const lines = data.toString().split('\n').filter(Boolean);
  lines.forEach((l) => console.error(`${cyan}[backend]${reset} ${l}`));
});

// Start Frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'frontend'),
  shell: true,
  env: { ...process.env, FORCE_COLOR: 'true' },
});

frontend.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(Boolean);
  lines.forEach((l) => console.log(`${magenta}[frontend]${reset} ${l}`));
});

frontend.stderr.on('data', (data) => {
  const lines = data.toString().split('\n').filter(Boolean);
  lines.forEach((l) => console.error(`${magenta}[frontend]${reset} ${l}`));
});

const cleanup = () => {
  console.log(`\n${bold}Shutting down SignalCheck services...${reset}`);
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
