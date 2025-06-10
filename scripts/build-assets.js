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

// Function to copy background images to all necessary directories
function copyBackgroundImages() {
    const bgImages = ['home-bg.jpg', 'tutoriels-bg.jpg', 'about-bg.jpg', 'contact-bg.jpg', 'post-bg.jpg'];

    // Ensure img directories exist
    shell.mkdir('-p', path.join(publicDir, 'assets', 'img'));
    shell.mkdir('-p', path.join(distDir, 'assets', 'img'));
    shell.mkdir('-p', path.join(distDir, 'assets', 'img', 'word'));
    shell.mkdir('-p', path.join(distDir, 'assets', 'img', 'excel'));
    shell.mkdir('-p', path.join(distDir, 'assets', 'img', 'ppoint'));
    shell.mkdir('-p', path.join(distDir, 'assets', 'img', 'profile'));
    shell.mkdir('-p', path.join(distDir, 'assets', 'img', 'bg'));

    // Copy all images from src/assets/img to public and dist
    if (fs.existsSync(path.join(srcDir, 'assets', 'img'))) {
        shell.cp('-R', path.join(srcDir, 'assets', 'img', '*'), path.join(publicDir, 'assets', 'img'));
        shell.cp('-R', path.join(srcDir, 'assets', 'img', '*'), path.join(distDir, 'assets', 'img'));
    }

    // Copy specific background images
    bgImages.forEach(image => {
        if (fs.existsSync(path.join(srcDir, 'assets', 'img', image))) {
            shell.cp(
                path.join(srcDir, 'assets', 'img', image),
                path.join(publicDir, 'assets', 'img', image)
            );
            shell.cp(
                path.join(srcDir, 'assets', 'img', image),
                path.join(distDir, 'assets', 'img', image)
            );
            // Also copy header-bg.jpg to word directory
            if (image === 'home-bg.jpg') {
                shell.cp(
                    path.join(srcDir, 'assets', 'img', image),
                    path.join(distDir, 'assets', 'img', 'word', image)
                );
            }
        }
    });
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

// Copy background images to all necessary locations
console.log('Copying background images...');
copyBackgroundImages();

// Copy other public files (HTML, etc.)
const publicFiles = fs.readdirSync(publicDir)
    .filter(file => fs.statSync(path.join(publicDir, file)).isFile());

publicFiles.forEach(file => {
    shell.cp(path.join(publicDir, file), path.join(distDir, file));
});

console.log('Assets copied successfully!');
