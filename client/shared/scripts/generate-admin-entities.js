const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, '../features');
const outputFile = path.join(featuresDir, 'admin-entities.ts');

function findAdminConfigs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findAdminConfigs(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.admin-config.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const adminConfigFiles = findAdminConfigs(featuresDir)
  .map(f => f.replace(/\\/g, '/'));

const importLines = adminConfigFiles.map(f => {
  // Génère un import absolu compatible Next.js
  const rel = path.relative(featuresDir, f).replace(/\\/g, '/');
  return `import '@/features/${rel.replace(/\.ts$/, '')}';`;
});

const header = `// Ce fichier est généré automatiquement. Ne pas éditer manuellement.\n// Il force l'import de tous les fichiers *.admin-config.ts pour garantir l'enregistrement de toutes les entités admin\n`;

// Extraction fiable du nom d'entité (features/[entity]/[entity].admin-config.ts)
const entityNames = adminConfigFiles.map(f => {
  const match = f.match(/features\/([^/]+)\/[^/]+\.admin-config\.ts$/);
  return match ? match[1] : null;
})
  .filter(Boolean);

// Suppression des doublons éventuels
const uniqueEntityNames = Array.from(new Set(entityNames));

const entitiesExport = `\nexport const ADMIN_ENTITIES = [\n  ${uniqueEntityNames.map(e => `'${e}'`).join(',\n  ')}\n];\n`;

const content = header + importLines.join('\n') + entitiesExport;

fs.writeFileSync(outputFile, content);
console.log(`✅ Fichier généré: features/admin-entities.ts (${uniqueEntityNames.length} entités)`);
