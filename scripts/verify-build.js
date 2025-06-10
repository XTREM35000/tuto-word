import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

async function verifyAssets() {
    console.log('🔍 Vérification des assets...');

    // Vérifier les dossiers requis
    const requiredDirs = [
        'assets/img',
        'assets/img/word',
        'assets/img/excel',
        'assets/img/ppoint',
        'assets/img/profile',
        'assets/img/bg'
    ];

    const missingDirs = [];
    for (const dir of requiredDirs) {
        const publicPath = path.join(PUBLIC_DIR, dir);
        const distPath = path.join(DIST_DIR, dir);

        if (!await fs.pathExists(publicPath)) {
            missingDirs.push(`public/${dir}`);
        }
        if (!await fs.pathExists(distPath)) {
            missingDirs.push(`dist/${dir}`);
        }
    }

    if (missingDirs.length > 0) {
        console.error('❌ Dossiers manquants :');
        missingDirs.forEach(dir => console.error(`   - ${dir}`));
        return false;
    }

    // Vérifier les images dans les fichiers HTML
    const htmlFiles = await fs.readdir(DIST_DIR);
    const imageErrors = [];

    for (const file of htmlFiles) {
        if (file.endsWith('.html')) {
            const content = await fs.readFile(path.join(DIST_DIR, file), 'utf-8');
            const dom = new JSDOM(content);
            const images = dom.window.document.querySelectorAll('img');

            for (const img of images) {
                const src = img.getAttribute('src');
                if (src && src.startsWith('assets/')) {
                    const imagePath = path.join(PUBLIC_DIR, src);
                    if (!await fs.pathExists(imagePath)) {
                        imageErrors.push({
                            file,
                            image: src
                        });
                    }
                }
            }
        }
    }

    if (imageErrors.length > 0) {
        console.error('❌ Images manquantes :');
        imageErrors.forEach(({ file, image }) => {
            console.error(`   - ${image} (référencée dans ${file})`);
        });
        return false;
    }

    console.log('✅ Vérification des assets terminée avec succès !');
    return true;
}

// Exécution de la vérification
verifyAssets().then(success => {
    if (!success) {
        process.exit(1);
    }
});
