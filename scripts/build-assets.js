'use strict';

const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

// Configuration
const publicDir = 'public';
const srcDir = 'src';
const distDir = 'dist';

// Function to normalize case
function normalizeCase(filePath) {
    const parts = filePath.split(path.sep);
    return parts.map(part => part.toLowerCase()).join(path.sep);
}

// Function to ensure directory exists
function ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
}

// Function to copy and normalize case
async function copyAndNormalize(src, dest) {
    if (fs.existsSync(src)) {
        const normalizedDest = normalizeCase(dest);
        await fs.copy(src, normalizedDest);
        console.log(`Copied and normalized: ${src} -> ${normalizedDest}`);
    }
}

// Function to copy background images to all necessary directories
async function copyBackgroundImages() {
    const bgImages = ['home-bg.jpg', 'tutoriels-bg.jpg', 'about-bg.jpg', 'contact-bg.jpg', 'post-bg.jpg'];

    // Ensure img directories exist with normalized case
    const dirs = [
        path.join(publicDir, 'assets', 'img'),
        path.join(distDir, 'assets', 'img'),
        path.join(distDir, 'assets', 'img', 'word'),
        path.join(distDir, 'assets', 'img', 'excel'),
        path.join(distDir, 'assets', 'img', 'ppoint'),
        path.join(distDir, 'assets', 'img', 'profile'),
        path.join(distDir, 'assets', 'img', 'bg')
    ];

    for (const dir of dirs) {
        await fs.ensureDir(normalizeCase(dir));
    }

    // Copy all images from src/assets/img to public and dist
    if (fs.existsSync(path.join(srcDir, 'assets', 'img'))) {
        const srcImgDir = path.join(srcDir, 'assets', 'img');
        const destImgDir = path.join(distDir, 'assets', 'img');
        const publicImgDir = path.join(publicDir, 'assets', 'img');

        // Copy all files recursively
        const copyRecursive = async (src, dest) => {
            const files = await fs.readdir(src, { withFileTypes: true });
            for (const file of files) {
                const srcPath = path.join(src, file.name);
                const destPath = path.join(dest, file.name.toLowerCase());

                if (file.isDirectory()) {
                    await fs.ensureDir(destPath);
                    await copyRecursive(srcPath, destPath);
                } else {
                    await fs.copy(srcPath, destPath);
                }
            }
        };

        await copyRecursive(srcImgDir, destImgDir);
        await copyRecursive(srcImgDir, publicImgDir);
    }

    // Copy specific background images
    for (const image of bgImages) {
        const srcPath = path.join(srcDir, 'assets', 'img', image);
        if (fs.existsSync(srcPath)) {
            await copyAndNormalize(
                srcPath,
                path.join(publicDir, 'assets', 'img', image)
            );
            await copyAndNormalize(
                srcPath,
                path.join(distDir, 'assets', 'img', image)
            );
            // Also copy header-bg.jpg to word directory
            if (image === 'home-bg.jpg') {
                await copyAndNormalize(
                    srcPath,
                    path.join(distDir, 'assets', 'img', 'word', image)
                );
            }
        }
    }
}

// Clean dist directory
console.log('Cleaning dist directory...');
shell.rm('-rf', path.join(distDir, '*'));

// Copy all assets from src to dist
console.log('Copying assets from src to dist...');
if (fs.existsSync(path.join(srcDir, 'assets'))) {
    await fs.ensureDir(path.join(distDir, 'assets'));
    await copyAndNormalize(
        path.join(srcDir, 'assets'),
        path.join(distDir, 'assets')
    );
}

// Copy all assets from public to dist (overwriting if necessary)
console.log('Copying assets from public to dist...');
if (fs.existsSync(path.join(publicDir, 'assets'))) {
    await fs.ensureDir(path.join(distDir, 'assets'));
    await copyAndNormalize(
        path.join(publicDir, 'assets'),
        path.join(distDir, 'assets')
    );
}

// Ensure critical directories exist
const criticalDirs = ['css', 'js', 'img', 'fonts'].map(dir => path.join(distDir, 'assets', dir));
for (const dir of criticalDirs) {
    await fs.ensureDir(normalizeCase(dir));
}

// Copy background images to all necessary locations
console.log('Copying background images...');
copyBackgroundImages();

// Copy other public files (HTML, etc.)
const publicFiles = fs.readdirSync(publicDir)
    .filter(file => fs.statSync(path.join(publicDir, file)).isFile());

for (const file of publicFiles) {
    await copyAndNormalize(
        path.join(publicDir, file),
        path.join(distDir, file)
    );
}

console.log('Assets copied successfully!');
