#!/usr/bin/env node

import { build } from 'esbuild';
import * as sass from 'sass';
import { writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWatch = process.argv.includes('--watch');

// Ensure dist directory exists
function ensureDir(dir) {
  try {
    mkdirSync(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Copy directory recursively
function copyDir(src, dest) {
  ensureDir(dest);
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Build CSS with Sass
async function buildCSS() {
  try {
    console.log('Building CSS...');
    
    // Compile Sass
    const result = sass.compile('main1.css', {
      style: 'compressed',
      loadPaths: ['css']
    });
    
    // Process with PostCSS
    const postcssResult = await postcss([
      autoprefixer(),
      cssnano()
    ]).process(result.css, {
      from: undefined
    });
    
    ensureDir('dist');
    writeFileSync('dist/main1.css', postcssResult.css);
    console.log('✅ CSS built successfully');
  } catch (error) {
    console.error('❌ CSS build failed:', error.message);
  }
}

// Build JavaScript with esbuild
async function buildJS() {
  try {
    console.log('Building JavaScript...');
    
    const buildOptions = {
      entryPoints: ['js/main.js'],
      bundle: true,
      minify: true,
      outdir: 'dist',
      format: 'iife',
      target: ['es2020'],
      sourcemap: !isWatch
    };
    
    if (isWatch) {
      const context = await build.context(buildOptions);
      await context.watch();
      context.rebuild().then(() => {
        console.log('✅ JavaScript built successfully');
      }).catch((error) => {
        console.error('❌ JS rebuild failed:', error);
      });
    } else {
      await build(buildOptions);
      console.log('✅ JavaScript built successfully');
    }
  } catch (error) {
    console.error('❌ JavaScript build failed:', error.message);
  }
}

// Copy static assets
function copyAssets() {
  console.log('Copying assets...');
  
  // Copy HTML files
  ['index.html', 'prebis.html', 'bis.html'].forEach(file => {
    copyFileSync(file, `dist/${file}`);
  });
  
  // Copy directories
  ['assets', 'css', 'js'].forEach(dir => {
    if (statSync(dir).isDirectory()) {
      copyDir(dir, `dist/${dir}`);
    }
  });
  
  console.log('✅ Assets copied successfully');
}

// Main build function
async function main() {
  console.log('🚀 Starting build...');
  
  // Clean dist directory
  try {
    const { rmSync } = await import('fs');
    rmSync('dist', { recursive: true, force: true });
  } catch (err) {
    // Directory doesn't exist, that's fine
  }
  
  // Build assets
  await buildCSS();
  await buildJS();
  copyAssets();
  
  if (!isWatch) {
    console.log('🎉 Build completed successfully!');
    process.exit(0);
  } else {
    console.log('👀 Watching for changes...');
    
    // Watch for file changes
    const { watch } = await import('fs');
    
    // Watch CSS file
    watch('main1.css', { recursive: false }, (eventType, filename) => {
      if (eventType === 'change') {
        console.log('📝 CSS file changed, rebuilding...');
        buildCSS();
      }
    });
    
    // Watch for asset changes
    watch('.', { recursive: true, ignored: ['dist', 'node_modules', '.git', 'main1.css'] }, (eventType, filename) => {
      if (filename && eventType === 'change' && !filename.includes('dist') && !filename.includes('node_modules')) {
        console.log(`📝 File changed: ${filename}, copying assets...`);
        copyAssets();
      }
    });
    
    // Keep the process running
    process.stdin.resume();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Build stopped');
  process.exit(0);
});

// Run the build
main().catch(error => {
  console.error('💥 Build failed:', error);
  process.exit(1);
});
