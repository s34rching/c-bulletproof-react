import path from 'path';

const buildEslintCommand = (filenames) => {
  return `next lint --fix --file ${filenames
    .filter((f) => f.includes('/src/') )
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;
};

const config = {
  'src/**/*.{ts,tsx}': ['prettier --write', buildEslintCommand, "bash -c 'yarn check-types'"],
  'testing/**/*.{ts,tsx}': ['prettier --write'],
  '{src,testing}/**/*.{js,jsx,json,css,md}': ['prettier --write'],
};

export default config;
