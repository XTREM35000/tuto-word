'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

// Configuration
const publicDir = 'public';
const srcDir = 'src';
const distDir = 'dist';

// Ensure the dist directory exists
shell.mkdir('-p', distDir);

// Function to ensure directory exists
function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
}

// Clean dist directory
console.log('Cleaning dist directory...');
shell.rm('-rf', path.join(distDir, '*'));

// Copy all assets from src to dist
console.log('Copying assets from src to dist...');
if (fs.existsSync(path.join(srcDir, 'assets'))) {
    shell.mkdir('-p', path.join(distDir, 'assets'));
    shell.cp('-R', path.join(srcDir, 'assets', '*'), path.join(distDir, 'assets'));
}

// Copy all assets from public to dist (overwriting if necessary)
console.log('Copying assets from public to dist...');
if (fs.existsSync(path.join(publicDir, 'assets'))) {
    shell.mkdir('-p', path.join(distDir, 'assets'));
    shell.cp('-R', path.join(publicDir, 'assets', '*'), path.join(distDir, 'assets'));
}

// Ensure critical directories exist
const criticalDirs = ['css', 'js', 'img', 'fonts'].map(dir => path.join(distDir, 'assets', dir));
criticalDirs.forEach(dir => shell.mkdir('-p', dir));

// Copy other public files (HTML, etc.)
const publicFiles = fs.readdirSync(publicDir)
    .filter(file => fs.statSync(path.join(publicDir, file)).isFile());

publicFiles.forEach(file => {
    shell.cp(path.join(publicDir, file), path.join(distDir, file));
});

console.log('Assets copied successfully!');
