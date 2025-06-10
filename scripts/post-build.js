const fs = require('fs-extra');
const path = require('path');

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

        console.log('Post-build completed successfully!');
    } catch (err) {
        console.error('Error during post-build:', err);
        process.exit(1);
    }
}

postBuild();
