'use strict';

import sass from 'sass';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import shell from 'shelljs';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');
const nodeModules = path.join(__dirname, '..', 'node_modules');

// Ensure the destination directory exists
shell.mkdir('-p', path.join(distDir, 'assets', 'css'));

// Copy Bootstrap CSS from node_modules
shell.cp(
    path.join(nodeModules, 'bootstrap/dist/css/bootstrap.min.css'),
    path.join(distDir, 'assets', 'css', 'bootstrap.min.css')
);

// Fonction pour compiler un fichier SCSS
async function compileScssFile(srcFile, destFile) {
    try {
        const result = sass.compile(srcFile, {
            style: 'compressed',
            sourceMap: true,
            loadPaths: [
                path.join(srcDir, 'scss'),
                nodeModules,
                path.join(nodeModules, 'bootstrap/scss')
            ]
        });

        await fs.ensureDir(path.dirname(destFile));
        await fs.writeFile(destFile, result.css.toString());
        if (result.sourceMap) {
            await fs.writeFile(`${destFile}.map`, result.sourceMap.toString());
        }
        console.log(`✓ Compilé: ${srcFile} -> ${destFile}`);
    } catch (err) {
        console.error(`❌ Erreur lors de la compilation de ${srcFile}:`, err);
        process.exit(1);
    }
}

// Fonction pour compiler tous les fichiers SCSS
async function compileAllScssFiles() {
    try {
        const scssDir = path.join(srcDir, 'scss');
        const files = await fs.readdir(scssDir);

        for (const file of files) {
            if (file.endsWith('.scss') && !file.startsWith('_')) {
                const srcFile = path.join(scssDir, file);
                const destFile = path.join(distDir, 'assets', 'css', file.replace('.scss', '.css'));
                await compileScssFile(srcFile, destFile);
            }
        }
        console.log('SCSS compilation completed!');
    } catch (err) {
        console.error('❌ Erreur lors de la compilation des fichiers SCSS:', err);
        process.exit(1);
    }
}

// Copy all other CSS files from src/assets/css if they exist
const assetsCssDir = path.join(srcDir, 'assets', 'css');
if (fs.existsSync(assetsCssDir)) {
    shell.cp('-R', path.join(assetsCssDir, '*.css'), distDir);
}

// Exécuter la compilation
compileAllScssFiles();
