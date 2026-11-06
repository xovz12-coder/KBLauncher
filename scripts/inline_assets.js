const fs = require('fs');
const path = require('path');

const projectDir = 'C:\\Users\\Anon\\.gemini\\antigravity\\scratch\\KBLauncher';
const desktopDir = 'C:\\Users\\Anon\\Desktop\\KBLauncher-Website';
const assetsDir = path.join(projectDir, 'assets');

function getBase64(filename, mime = 'image/png') {
  const filePath = path.join(assetsDir, filename);
  if (!fs.existsSync(filePath)) return '';
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const logoCircle = getBase64('kbl-logo-circle.png');
const bgSunset = getBase64('bg-sunset.png');
const kblAvatar = getBase64('kbl-avatar.png');
const kblWhiteAvatar = getBase64('kbl-white-avatar.png');
const alexAvatar = getBase64('alex-avatar.png');

const kblSkin = getBase64('kbl-skin.png');
const kblWhiteSkin = getBase64('kbl-white-skin.png');
const alexSkin = getBase64('alex-skin.png');
const capeFounder = getBase64('cape-founder.png');
const capeMigrator = getBase64('cape-migrator.png');

console.log('Read all assets successfully');

// 1. Update site.css with inlined bg-sunset
let cssContent = fs.readFileSync(path.join(projectDir, 'site.css'), 'utf8');
cssContent = cssContent.replace(
  /url\(['"]assets\/bg-sunset\.png['"]\)/g,
  `url("${bgSunset}"), url("assets/bg-sunset.png")`
);
fs.writeFileSync(path.join(projectDir, 'site.css'), cssContent, 'utf8');
fs.writeFileSync(path.join(desktopDir, 'site.css'), cssContent, 'utf8');
console.log('Updated site.css');

// 2. Update site.html & index.html with inlined logo and avatars
let htmlContent = fs.readFileSync(path.join(projectDir, 'site.html'), 'utf8');
htmlContent = htmlContent.replace(/src="assets\/kbl-logo-circle\.png"/g, `src="${logoCircle}"`);
htmlContent = htmlContent.replace(/src="assets\/kbl-avatar\.png"/g, `src="${kblAvatar}"`);
htmlContent = htmlContent.replace(/src="assets\/kbl-white-avatar\.png"/g, `src="${kblWhiteAvatar}"`);
htmlContent = htmlContent.replace(/src="assets\/alex-avatar\.png"/g, `src="${alexAvatar}"`);

fs.writeFileSync(path.join(projectDir, 'site.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(desktopDir, 'index.html'), htmlContent, 'utf8');
console.log('Updated site.html and index.html');

// 3. Update site.js to map skin assets to data URIs
let jsContent = fs.readFileSync(path.join(projectDir, 'site.js'), 'utf8');
const assetMapCode = `
// Embedded Fallback Assets for 100% Offline & CDN Reliability
const EMBEDDED_SKIN_ASSETS = {
  'assets/kbl-skin.png': '${kblSkin}',
  'assets/kbl-white-skin.png': '${kblWhiteSkin}',
  'assets/alex-skin.png': '${alexSkin}',
  'assets/cape-founder.png': '${capeFounder}',
  'assets/cape-migrator.png': '${capeMigrator}'
};

function resolveSkinAsset(url) {
  return EMBEDDED_SKIN_ASSETS[url] || url;
}
`;

if (!jsContent.includes('EMBEDDED_SKIN_ASSETS')) {
  jsContent = assetMapCode + '\n' + jsContent;
  // Replace calls in site.js
  jsContent = jsContent.replace(/siteSkinRenderer\.loadSkin\(([^,]+),\s*([^)]+)\)/g, 'siteSkinRenderer.loadSkin(resolveSkinAsset($1), $2)');
  jsContent = jsContent.replace(/siteSkinRenderer\.loadCape\(([^)]+)\)/g, 'siteSkinRenderer.loadCape(resolveSkinAsset($1))');
  
  fs.writeFileSync(path.join(projectDir, 'site.js'), jsContent, 'utf8');
  fs.writeFileSync(path.join(desktopDir, 'site.js'), jsContent, 'utf8');
  console.log('Updated site.js with embedded skin assets');
}
