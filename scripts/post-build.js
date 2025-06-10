const fs = require('fs-extra');
const path = require('path');

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

async function postBuild() {
    try {
        // Ensure public directory exists
        await fs.ensureDir('public');
        await fs.ensureDir(path.join('public', 'assets'));

        // Copy dist contents to public
        if (await fs.pathExists('dist')) {
            // Copy all files recursively with normalized case
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

            await copyRecursive('dist', 'public');
            console.log('✓ Contenu de dist copié vers public');
        } else {
            console.log('⚠️ Le dossier dist n\'existe pas');
        }

        // Copy assets from src to public
        if (await fs.pathExists(path.join('src', 'assets'))) {
            await copyAndNormalize(
                path.join('src', 'assets'),
                path.join('public', 'assets')
            );
            console.log('✓ Assets copiés vers public/assets');
        } else {
            console.log('⚠️ Le dossier src/assets n\'existe pas');
        }

        console.log('Post-build completed successfully!');
    } catch (err) {
        console.error('Error during post-build:', err);
        process.exit(1);
    }
}

postBuild();
