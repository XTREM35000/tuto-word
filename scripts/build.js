const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
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

        // List contents of dist/assets to verify
        const files = await fs.readdir(distAssetsDir, { recursive: true });
        console.log('\nContents of dist/assets:');
        console.log(files.join('\n'));

        console.log('\nAssets copied successfully!');
    } catch (err) {
        console.error('Error copying assets:', err);
        process.exit(1);
    }
}

copyAssets();
