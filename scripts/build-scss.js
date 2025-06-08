'use strict';

const sass = require('sass');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

// Configuration
const srcDir = 'src/scss';
const destDir = 'dist/css';
const nodeModules = 'node_modules';

// Ensure the destination directory exists
shell.mkdir('-p', destDir);

// Copy Bootstrap CSS from node_modules
shell.cp(
    path.join(nodeModules, 'bootstrap/dist/css/bootstrap.min.css'),
    path.join(destDir, 'bootstrap.min.css')
);

// Compile SCSS files
function compileSass() {
    try {
        const result = sass.renderSync({
            file: path.join(srcDir, 'styles.scss'),
            outputStyle: 'compressed',
            sourceMap: true,
            outFile: path.join(destDir, 'styles.css'),
            includePaths: [
                srcDir,
                nodeModules,
                path.join(nodeModules, 'bootstrap/scss')
            ]
        });

        fs.writeFileSync(path.join(destDir, 'styles.css'), result.css);
        if (result.map) {
            fs.writeFileSync(path.join(destDir, 'styles.css.map'), result.map);
        }

        console.log('SCSS compilation completed!');
    } catch (error) {
        console.error('Error compiling SCSS:', error);
        process.exit(1);
    }
}

// Copy all other CSS files from src/assets/css if they exist
const assetsCssDir = 'src/assets/css';
if (fs.existsSync(assetsCssDir)) {
    shell.cp('-R', path.join(assetsCssDir, '*.css'), destDir);
}

compileSass();
