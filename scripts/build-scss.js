'use strict';

const sass = require('sass');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

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
async function compileSass() {
    try {
        // Compile main styles
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

        // Process with PostCSS (autoprefixer)
        const postCssResult = await postcss([autoprefixer])
            .process(result.css, {
                from: path.join(srcDir, 'styles.scss'),
                to: path.join(destDir, 'styles.css'),
                map: { inline: false }
            });

        // Write processed CSS and source map
        fs.writeFileSync(path.join(destDir, 'styles.css'), postCssResult.css);
        if (postCssResult.map) {
            fs.writeFileSync(path.join(destDir, 'styles.css.map'), postCssResult.map.toString());
        }

        console.log('SCSS compilation completed!');

        // Compile any additional SCSS files in the root of srcDir
        const files = fs.readdirSync(srcDir)
            .filter(file => file.endsWith('.scss') && !file.startsWith('_'));

        for (const file of files) {
            if (file !== 'styles.scss') {
                const result = sass.renderSync({
                    file: path.join(srcDir, file),
                    outputStyle: 'compressed',
                    sourceMap: true,
                    outFile: path.join(destDir, file.replace('.scss', '.css')),
                    includePaths: [
                        srcDir,
                        nodeModules,
                        path.join(nodeModules, 'bootstrap/scss')
                    ]
                });

                const postCssResult = await postcss([autoprefixer])
                    .process(result.css, {
                        from: path.join(srcDir, file),
                        to: path.join(destDir, file.replace('.scss', '.css')),
                        map: { inline: false }
                    });

                fs.writeFileSync(
                    path.join(destDir, file.replace('.scss', '.css')),
                    postCssResult.css
                );
                if (postCssResult.map) {
                    fs.writeFileSync(
                        path.join(destDir, `${file.replace('.scss', '.css')}.map`),
                        postCssResult.map.toString()
                    );
                }
            }
        }
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

// Make compileSass async
(async () => {
    await compileSass();
})();
