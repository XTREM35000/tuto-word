import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import shell from 'shelljs';

// Configuration des chemins pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des chemins
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SRC_ASSETS_DIR = path.join(ROOT_DIR, 'src', 'assets');
const DIST_ASSETS_DIR = path.join(DIST_DIR, 'assets');

// Fonction pour normaliser la casse des noms de fichiers
function normalizeCase(filePath) {
    const parts = filePath.split(path.sep);
    return parts.map(part => part.toLowerCase()).join(path.sep);
}

// Fonction pour vérifier les assets
async function verifyAssets() {
    const requiredDirs = [
        path.join(DIST_ASSETS_DIR, 'img'),
        path.join(DIST_ASSETS_DIR, 'img', 'word'),
        path.join(DIST_ASSETS_DIR, 'img', 'excel'),
        path.join(DIST_ASSETS_DIR, 'img', 'ppoint'),
        path.join(DIST_ASSETS_DIR, 'img', 'profile'),
        path.join(DIST_ASSETS_DIR, 'img', 'bg')
    ];

    const missingDirs = [];
    for (const dir of requiredDirs) {
        if (!await fs.pathExists(dir)) {
            missingDirs.push(dir);
        }
    }

    if (missingDirs.length > 0) {
        console.error('❌ Missing required directories:');
        missingDirs.forEach(dir => console.error(`   - ${dir}`));
        return false;
    }

    return true;
}

// Fonction pour normaliser les fichiers
async function normalizeFiles(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
        const oldPath = path.join(dir, file.name);
        const newPath = path.join(dir, file.name.toLowerCase());

        if (oldPath !== newPath) {
            if (file.isDirectory()) {
                await normalizeFiles(oldPath);
                await fs.rename(oldPath, newPath);
            } else {
                await fs.rename(oldPath, newPath);
            }
        }
    }
}

// Fonction principale de build
async function build() {
    try {
        console.log('🚀 Starting build process...');

        // Ensure dist directory exists
        console.log(`📁 Ensuring ${DIST_DIR} directory exists...`);
        await fs.ensureDir(DIST_DIR);

        // Ensure dist/assets directory exists
        console.log(`📁 Ensuring ${DIST_ASSETS_DIR} directory exists...`);
        await fs.ensureDir(DIST_ASSETS_DIR);

        // Copy all assets from src/assets to dist/assets
        console.log(`📦 Copying assets from ${SRC_ASSETS_DIR} to ${DIST_ASSETS_DIR}...`);
        await fs.copy(SRC_ASSETS_DIR, DIST_ASSETS_DIR, {
            filter: (src) => {
                const basename = path.basename(src);
                const shouldCopy = !basename.startsWith('.');
                if (shouldCopy) {
                    console.log(`   ✓ Copying: ${path.relative(ROOT_DIR, src)}`);
                }
                return shouldCopy;
            }
        });

        // Normaliser la casse des noms de fichiers
        console.log('🔄 Normalizing file case...');
        await normalizeFiles(DIST_ASSETS_DIR);

        // Ensure all necessary directories exist
        console.log('📁 Ensuring required directories...');
        const requiredDirs = [
            path.join(DIST_ASSETS_DIR, 'img'),
            path.join(DIST_ASSETS_DIR, 'img', 'word'),
            path.join(DIST_ASSETS_DIR, 'img', 'excel'),
            path.join(DIST_ASSETS_DIR, 'img', 'ppoint'),
            path.join(DIST_ASSETS_DIR, 'img', 'profile'),
            path.join(DIST_ASSETS_DIR, 'img', 'bg')
        ];

        for (const dir of requiredDirs) {
            await fs.ensureDir(dir);
            console.log(`   ✓ Ensured directory: ${path.relative(ROOT_DIR, dir)}`);
        }

        // Vérification des assets
        console.log('🔍 Verifying assets...');
        const verificationResult = await verifyAssets();
        if (!verificationResult) {
            throw new Error('Asset verification failed');
        }

        // List contents of dist/assets to verify
        const files = await fs.readdir(DIST_ASSETS_DIR, { recursive: true });
        console.log('\n📋 Contents of dist/assets:');
        files.forEach(file => console.log(`   - ${file}`));

        console.log('\n✅ Build completed successfully!');
    } catch (err) {
        console.error('❌ Error during build:', err);
        process.exit(1);
    }
}

// Exécution du build
build();
