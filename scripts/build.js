const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

// Fonction pour normaliser la casse des noms de fichiers
function normalizeCase(filePath) {
    const parts = filePath.split(path.sep);
    return parts.map(part => part.toLowerCase()).join(path.sep);
}

async function build() {
    try {
        const distDir = 'dist';
        const srcAssetsDir = path.join('src', 'assets');
        const distAssetsDir = path.join(distDir, 'assets');

        // Ensure dist directory exists
        console.log(`Ensuring ${distDir} directory exists...`);
        await fs.ensureDir(distDir);

        // Ensure dist/assets directory exists
        console.log(`Ensuring ${distAssetsDir} directory exists...`);
        await fs.ensureDir(distAssetsDir);

        // Copy all assets from src/assets to dist/assets
        console.log(`Copying assets from ${srcAssetsDir} to ${distAssetsDir}...`);
        await fs.copy(srcAssetsDir, distAssetsDir, {
            filter: (src) => {
                const basename = path.basename(src);
                const shouldCopy = !basename.startsWith('.');
                if (shouldCopy) {
                    console.log(`Copying: ${src}`);
                }
                return shouldCopy;
            }
        });

        // Normaliser la casse des noms de fichiers
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

        // Normaliser la casse dans le dossier assets
        await normalizeFiles(distAssetsDir);

        // Ensure all necessary directories exist
        const requiredDirs = [
            path.join(distAssetsDir, 'img'),
            path.join(distAssetsDir, 'img', 'word'),
            path.join(distAssetsDir, 'img', 'excel'),
            path.join(distAssetsDir, 'img', 'ppoint'),
            path.join(distAssetsDir, 'img', 'profile'),
            path.join(distAssetsDir, 'img', 'bg')
        ];

        for (const dir of requiredDirs) {
            await fs.ensureDir(dir);
            console.log(`Ensured directory exists: ${dir}`);
        }

        // List contents of dist/assets to verify
        const files = await fs.readdir(distAssetsDir, { recursive: true });
        console.log('\nContents of dist/assets:');
        console.log(files.join('\n'));

        console.log('\nBuild completed successfully!');
    } catch (err) {
        console.error('Error during build:', err);
        process.exit(1);
    }
}

build();
