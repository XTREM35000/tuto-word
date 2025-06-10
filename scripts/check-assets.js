const fs = require('fs');
const path = require('path');

// Configuration
const publicDir = 'public';

// Define required and optional directories
const assetConfig = {
    required: [
        'assets/img/word',
        'assets/img/profile',
        'assets/img/bg'
    ],
    optional: [
        'assets/img/excel',
    ]
};

// Check if directory exists
function checkDirectory(dir, isRequired = true) {
    const fullPath = path.join(publicDir, dir);
    if (!fs.existsSync(fullPath)) {
        if (isRequired) {
            console.error(`❌ Required directory missing: ${dir}`);
            return false;
        } else {
            console.warn(`⚠️ Optional directory missing: ${dir}`);
            return true;
        }
    }
    console.log(`✅ Directory found: ${dir}`);
    return true;
}

// Check if directory has files
function checkDirectoryHasFiles(dir, isRequired = true) {
    const fullPath = path.join(publicDir, dir);
    if (!fs.existsSync(fullPath)) return true; // Skip if directory doesn't exist

    const files = fs.readdirSync(fullPath).filter(file => {
        const filePath = path.join(fullPath, file);
        return fs.statSync(filePath).isFile();
    });

    if (files.length === 0) {
        if (isRequired) {
            console.error(`❌ Required directory is empty: ${dir}`);
            return false;
        } else {
            console.warn(`⚠️ Optional directory is empty: ${dir}`);
            return true;
        }
    }
    console.log(`✅ Directory has ${files.length} files: ${dir}`);
    return true;
}

// Create placeholder for empty required directories
function createPlaceholder(dir) {
    const fullPath = path.join(publicDir, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
    const placeholderPath = path.join(fullPath, 'placeholder.txt');
    fs.writeFileSync(placeholderPath, `Placeholder for ${dir}\nCreated: ${new Date().toISOString()}`);
    console.log(`✅ Created placeholder in: ${dir}`);
}

// Main check
console.log('\nChecking assets...\n');
let hasErrors = false;

// Check public directory
if (!fs.existsSync(publicDir)) {
    console.error(`❌ Public directory missing: ${publicDir}`);
    process.exit(1);
}

// Check required directories
console.log('Checking required directories:');
assetConfig.required.forEach(dir => {
    const dirExists = checkDirectory(dir, true);
    if (!dirExists || !checkDirectoryHasFiles(dir, true)) {
        hasErrors = true;
        createPlaceholder(dir);
    }
});

// Check optional directories
console.log('\nChecking optional directories:');
assetConfig.optional.forEach(dir => {
    if (checkDirectory(dir, false)) {
        checkDirectoryHasFiles(dir, false);
    }
});

if (hasErrors) {
    console.error('\n❌ Asset check failed. Placeholders have been created for missing required directories.');
    process.exit(1);
} else {
    console.log('\n✅ All required assets verified successfully!');
}
