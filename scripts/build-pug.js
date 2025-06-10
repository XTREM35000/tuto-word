'use strict';
import upath from 'upath';
import fs from 'fs-extra';
import pug from 'pug';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Fonction pour compiler un fichier Pug
async function compilePugFile(srcFile, destFile) {
    try {
        const html = pug.renderFile(srcFile, {
            pretty: true,
            basedir: path.join(srcDir, 'pug')
        });

        await fs.ensureDir(path.dirname(destFile));
        await fs.writeFile(destFile, html);
        console.log(`### INFO: Rendering ${srcFile} to ${destFile}`);
    } catch (err) {
        console.error(`❌ Erreur lors de la compilation de ${srcFile}:`, err);
        process.exit(1);
    }
}

// Fonction pour compiler tous les fichiers Pug
async function compileAllPugFiles() {
    try {
        const pugDir = path.join(srcDir, 'pug');
        const files = await fs.readdir(pugDir);

        for (const file of files) {
            if (file.endsWith('.pug')) {
                const srcFile = path.join(pugDir, file);
                const destFile = path.join(distDir, file.replace('.pug', '.html'));
                await compilePugFile(srcFile, destFile);
            }
        }
    } catch (err) {
        console.error('❌ Erreur lors de la compilation des fichiers Pug:', err);
        process.exit(1);
    }
}

// Exécuter la compilation
compileAllPugFiles();
