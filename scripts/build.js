const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
    try {
        // Ensure dist directory exists
        await fs.ensureDir('dist');

        // Copy all assets from src/assets to dist/assets
        console.log('Copying assets from src/assets to dist/assets...');
        await fs.copy('src/assets', 'dist/assets', {
            filter: (src) => {
                // Copy all files except hidden files
                const basename = path.basename(src);
                return !basename.startsWith('.');
            }
        });

        console.log('Assets copied successfully!');
    } catch (err) {
        console.error('Error copying assets:', err);
        process.exit(1);
    }
}

copyAssets();
