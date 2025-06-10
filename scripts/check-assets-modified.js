import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const srcDir = path.join(__dirname, '..', 'src');
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// Fonction pour vérifier si un répertoire existe
function directoryExists(dir) {
    return fs.existsSync(dir);
}

// Fonction pour créer un répertoire s'il n'existe pas
async function ensureDirectory(dir) {
    if (!directoryExists(dir)) {
        try {
            await fs.ensureDir(dir);
            console.log(`✓ Répertoire créé: ${dir}`);
        } catch (err) {
            console.warn(`⚠️ Impossible de créer le répertoire ${dir}: ${err.message}`);
        }
    }
}

// Fonction pour vérifier les assets requis
async function checkRequiredAssets() {
    console.log('🔍 Vérification des assets requis...');

    // Vérifier les répertoires source
    const requiredSrcDirs = [
        'assets',
        'assets/img',
        'assets/img/word',
        'assets/img/excel',
        'assets/img/ppoint',
        'assets/img/profile',
        'assets/img/bg'
    ];

    for (const dir of requiredSrcDirs) {
        const fullPath = path.join(srcDir, dir);
        await ensureDirectory(fullPath);
    }

    // Vérifier les images de fond requises
    const requiredBgImages = [
        'home-bg.jpg',
        'about-bg.jpg',
        'contact-bg.jpg'
    ];

    for (const image of requiredBgImages) {
        const fullPath = path.join(srcDir, 'assets', 'img', image);
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ Image de fond manquante: ${fullPath}`);
        }
    }

    console.log('✅ Assets vérifiés avec succès');
}

// Exécuter la vérification
checkRequiredAssets();
