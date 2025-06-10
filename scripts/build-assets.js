'use strict';

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import shell from 'shelljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const publicDir = 'public';
const srcDir = 'src';
const distDir = 'dist';

// Fonction pour normaliser la casse des noms de fichiers
function normalizeCase(filePath) {
    const parts = filePath.split(path.sep);
    return parts.map(part => part.toLowerCase()).join(path.sep);
}

// Fonction pour copier et normaliser la casse
async function copyAndNormalize(src, dest) {
    if (await fs.pathExists(src)) {
        const normalizedDest = normalizeCase(dest);
        await fs.copy(src, normalizedDest);
        console.log(`Copied and normalized: ${src} -> ${normalizedDest}`);
    }
}

// Fonction pour s'assurer qu'un répertoire existe
async function ensureDir(dir) {
    await fs.ensureDir(dir);
    console.log(`✓ Directory ensured: ${dir}`);
}

// Fonction pour copier les images de fond
async function copyBackgroundImages() {
    const srcDir = path.join(__dirname, '..', 'src', 'assets', 'img');
    const publicDir = path.join(__dirname, '..', 'public', 'assets', 'img');
    const distDir = path.join(__dirname, '..', 'dist', 'assets', 'img');

    // Vérifier si le répertoire source existe
    if (!await fs.pathExists(srcDir)) {
        console.log('⚠️ Le répertoire source des images n\'existe pas');
        return;
    }

    // Créer les répertoires nécessaires
    await ensureDir(publicDir);
    await ensureDir(distDir);

    // Copier les images de fond
    const bgImages = [
        { src: 'home-bg.jpg', dest: 'word' },
        { src: 'about-bg.jpg', dest: 'bg' },
        { src: 'contact-bg.jpg', dest: 'bg' }
    ];

    for (const img of bgImages) {
        const srcPath = path.join(srcDir, img.src);
        if (await fs.pathExists(srcPath)) {
            const publicDest = path.join(publicDir, img.dest, img.src.toLowerCase());
            const distDest = path.join(distDir, img.dest, img.src.toLowerCase());

            await ensureDir(path.dirname(publicDest));
            await ensureDir(path.dirname(distDest));

            await fs.copy(srcPath, publicDest);
            await fs.copy(srcPath, distDest);
            console.log(`✓ Image copiée: ${img.src}`);
        }
    }
}

// Fonction pour copier les assets
async function copyAssets() {
    const srcDir = path.join(__dirname, '..', 'src', 'assets');
    const publicDir = path.join(__dirname, '..', 'public', 'assets');
    const distDir = path.join(__dirname, '..', 'dist', 'assets');

    // Copier les assets de src vers public et dist
    if (await fs.pathExists(srcDir)) {
        await copyAndNormalize(srcDir, publicDir);
        await copyAndNormalize(srcDir, distDir);
        console.log('✓ Assets copiés vers public et dist');
    } else {
        console.log('⚠️ Le dossier src/assets n\'existe pas');
    }
}

// Fonction principale
async function buildAssets() {
    try {
        console.log('🚀 Début de la construction des assets...');

        // Créer les répertoires nécessaires
        const dirs = [
            'dist/assets/img/excel',
            'dist/assets/img/ppoint',
            'dist/assets/img/profile',
            'dist/assets/img/bg',
            'dist/assets/img/word',
            'public/assets/img/excel',
            'public/assets/img/ppoint',
            'public/assets/img/profile',
            'public/assets/img/bg',
            'public/assets/img/word'
        ];

        for (const dir of dirs) {
            await ensureDir(path.join(__dirname, '..', dir));
        }

        // Copier les images de fond
        await copyBackgroundImages();

        // Copier les assets
        await copyAssets();

        console.log('✅ Construction des assets terminée avec succès!');
    } catch (err) {
        console.error('❌ Erreur lors de la construction des assets:', err);
        process.exit(1);
    }
}

// Exécuter la fonction principale
buildAssets();
