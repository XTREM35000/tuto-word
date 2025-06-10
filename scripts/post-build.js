import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des chemins
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_ASSETS_DIR = path.join(ROOT_DIR, 'src', 'assets');

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
        console.log(`✓ Copied and normalized: ${path.relative(ROOT_DIR, src)} -> ${path.relative(ROOT_DIR, normalizedDest)}`);
    }
}

// Fonction pour copier récursivement avec normalisation de casse
async function copyRecursive(src, dest) {
    const files = await fs.readdir(src, { withFileTypes: true });
    for (const file of files) {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name.toLowerCase());

        if (file.isDirectory()) {
            await fs.ensureDir(destPath);
            await copyRecursive(srcPath, destPath);
        } else {
            await fs.copy(srcPath, destPath);
            console.log(`✓ Copied: ${path.relative(ROOT_DIR, srcPath)} -> ${path.relative(ROOT_DIR, destPath)}`);
        }
    }
}

async function postBuild() {
    try {
        console.log('🚀 Starting post-build process...');

        // Ensure public directory exists
        console.log('📁 Ensuring public directory exists...');
        await fs.ensureDir(PUBLIC_DIR);
        await fs.ensureDir(path.join(PUBLIC_DIR, 'assets'));

        // Copy dist contents to public
        if (await fs.pathExists(DIST_DIR)) {
            console.log('📦 Copying dist contents to public...');
            await copyRecursive(DIST_DIR, PUBLIC_DIR);
            console.log('✓ Dist contents copied to public');
        } else {
            console.error('❌ Dist directory does not exist');
            process.exit(1);
        }

        // Copy assets from src to public
        if (await fs.pathExists(SRC_ASSETS_DIR)) {
            console.log('📦 Copying assets from src to public...');
            await copyAndNormalize(SRC_ASSETS_DIR, path.join(PUBLIC_DIR, 'assets'));
            console.log('✓ Assets copied to public/assets');
        } else {
            console.error('❌ Src/assets directory does not exist');
            process.exit(1);
        }

        // Add favicon
        const faviconPath = path.join(PUBLIC_DIR, 'favicon.ico');
        if (!await fs.pathExists(faviconPath)) {
            console.log('📝 Creating default favicon...');
            // Créer un favicon vide pour éviter l'erreur 404
            await fs.writeFile(faviconPath, '');
        }

        console.log('✅ Post-build completed successfully!');
    } catch (err) {
        console.error('❌ Error during post-build:', err);
        process.exit(1);
    }
}

// Exécution du post-build
postBuild();
