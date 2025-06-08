'use strict';

const sass = require('sass');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

// Configuration
const srcDir = 'src/scss';
const destDir = 'dist/css';

// Ensure the destination directory exists
shell.mkdir('-p', destDir);

// Compile SCSS files
function compileSass() {
    try {
        const result = sass.renderSync({
            file: path.join(srcDir, 'styles.scss'),
            outputStyle: 'compressed',
            sourceMap: true,
            outFile: path.join(destDir, 'styles.css'),
            includePaths: [srcDir]
        });

        fs.writeFileSync(path.join(destDir, 'styles.css'), result.css);
        if (result.map) {
            fs.writeFileSync(path.join(destDir, 'styles.css.map'), result.map);
        }

        console.log('SCSS compilation completed!');
    } catch (error) {
        console.error('Error compiling SCSS:', error);
    }
}

compileSass();
