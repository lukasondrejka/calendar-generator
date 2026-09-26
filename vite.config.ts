import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

const git = (command: string): string => {
  try {
    return execSync(`git ${command}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
};

// Date and hash of the built commit, shown in About
const commitHash = git('rev-parse --short HEAD') || process.env.GITHUB_SHA?.slice(0, 7) || '';
const commitDate = git('log -1 --format=%cI') || new Date().toISOString();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __COMMIT_DATE__: JSON.stringify(commitDate),
  },
});
