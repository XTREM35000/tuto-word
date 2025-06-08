'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

// Configuration
const publicDir = 'public';
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

// Copy all assets from public to dist
console.log('Copying assets from public to dist...');

// First, create the assets directory structure in dist
shell.mkdir('-p', path.join(distDir, 'assets', 'img'));

// Copy all image directories
const imgDirs = [
    'word',
    'excel',
    'ppoint',
    'profile',
    'projets',
    'bg',
    'logo',
    'clients'
];

imgDirs.forEach(dir => {
    const srcPath = path.join(publicDir, 'assets', 'img', dir);
    const destPath = path.join(distDir, 'assets', 'img', dir);

    if (fs.existsSync(srcPath)) {
        console.log(`Copying ${dir} images...`);
        shell.mkdir('-p', destPath);
        shell.cp('-R', `${srcPath}/*`, destPath);
    }
});

// Copy individual images from the root of img directory
const imgRoot = path.join(publicDir, 'assets', 'img');
if (fs.existsSync(imgRoot)) {
    const files = fs.readdirSync(imgRoot).filter(file =>
        fs.statSync(path.join(imgRoot, file)).isFile()
    );

    files.forEach(file => {
        shell.cp(
            path.join(imgRoot, file),
            path.join(distDir, 'assets', 'img', file)
        );
    });
}

// Copy other assets if they exist
const otherAssetDirs = ['css', 'js', 'fonts'];
otherAssetDirs.forEach(dir => {
    const srcPath = path.join(publicDir, 'assets', dir);
    const destPath = path.join(distDir, 'assets', dir);

    if (fs.existsSync(srcPath)) {
        console.log(`Copying ${dir} assets...`);
        shell.mkdir('-p', destPath);
        shell.cp('-R', `${srcPath}/*`, destPath);
    }
});

console.log('Assets copied successfully!');
