const fs = require('fs');
const path = require('path');

// Configuration
const publicDir = 'public';
const requiredDirs = [
    'assets/img/word',
    'assets/img/excel',
    'assets/img/ppoint',
    'assets/img/profile',
    'assets/img/projets',
    'assets/img/bg',
    'assets/img/logo',
    'assets/img/clients'
];

// Check if directory exists
function checkDirectory(dir) {
    const fullPath = path.join(publicDir, dir);
    if (!fs.existsSync(fullPath)) {
        console.error(`❌ Directory missing: ${dir}`);
        return false;
    }
    console.log(`✅ Directory found: ${dir}`);
    return true;
}

// Check if directory has files
function checkDirectoryHasFiles(dir) {
    const fullPath = path.join(publicDir, dir);
    const files = fs.readdirSync(fullPath);
    if (files.length === 0) {
        console.error(`❌ Directory is empty: ${dir}`);
        return false;
    }
    console.log(`✅ Directory has ${files.length} files: ${dir}`);
    return true;
}

// Main check
console.log('Checking required assets...');
let hasErrors = false;

// Check public directory
if (!fs.existsSync(publicDir)) {
    console.error(`❌ Public directory missing: ${publicDir}`);
    process.exit(1);
}

// Check each required directory
requiredDirs.forEach(dir => {
    if (checkDirectory(dir)) {
        if (!checkDirectoryHasFiles(dir)) {
            hasErrors = true;
        }
    } else {
        hasErrors = true;
    }
});

if (hasErrors) {
    console.error('\n❌ Asset check failed. Please ensure all required assets are present.');
    process.exit(1);
} else {
    console.log('\n✅ All assets verified successfully!');
}
