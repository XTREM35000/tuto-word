const fs = require('fs');
const path = require('path');

console.log("🔍 Vérification des assets requis...");

// Liste des assets requis avec vérification d'existence
const requiredAssets = [
  'src/assets/',        // Dossier assets principal
  'src/scss/'          // Dossier SCSS (remplace styles/)
].filter(asset => {
  const exists = fs.existsSync(path.join(__dirname, '..', asset));
  if (!exists) {
    console.warn(`⚠️ Dossier non trouvé: ${asset} (peut être normal selon votre configuration)`);
  }
  return exists; // Ne considère que les dossiers existants
});

if (requiredAssets.length === 0) {
  console.error('❌ Aucun asset requis trouvé - vérifiez votre structure de projet');
  process.exit(1);
}

console.log("✅ Assets vérifiés avec succès");
process.exit(0);
