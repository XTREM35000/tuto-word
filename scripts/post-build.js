const fs = require('fs-extra');
const path = require('path');

// Fonction pour normaliser la casse des noms de fichiers
function normalizeCase(filePath) {
    const parts = filePath.split(path.sep);
    return parts.map(part => part.toLowerCase()).join(path.sep);
}

async function postBuild() {
    try {
        // Ensure public directory exists
        await fs.ensureDir('public');
        await fs.ensureDir(path.join('public', 'assets'));

        // Copy dist contents to public
        if (await fs.pathExists('dist')) {
            await fs.copy('dist', 'public', { overwrite: true });
            console.log('✓ Contenu de dist copié vers public');
        } else {
            console.log('⚠️ Le dossier dist n\'existe pas');
        }

        // Copy assets from src to public
        if (await fs.pathExists(path.join('src', 'assets'))) {
            await fs.copy(path.join('src', 'assets'), path.join('public', 'assets'), { overwrite: true });
            console.log('✓ Assets copiés vers public/assets');
        } else {
            console.log('⚠️ Le dossier src/assets n\'existe pas');
        }

        // Normaliser la casse des noms de fichiers dans public
        const normalizeFiles = async (dir) => {
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
        };

        // Normaliser la casse dans le dossier public
        await normalizeFiles('public');

        console.log('Post-build completed successfully!');
    } catch (err) {
        console.error('Error during post-build:', err);
        process.exit(1);
    }
}

postBuild();
