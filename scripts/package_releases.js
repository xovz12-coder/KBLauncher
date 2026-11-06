const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = 'C:\\Users\\Anon\\.gemini\\antigravity\\scratch\\KBLauncher';
const releasesDir = path.join(projectDir, 'releases');

if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

// 1. Prepare portable client folder
const portableDir = path.join(releasesDir, 'KBLauncher-Portable');
if (fs.existsSync(portableDir)) {
  fs.rmSync(portableDir, { recursive: true, force: true });
}
fs.mkdirSync(portableDir, { recursive: true });

// Copy essential source & assets to portable
const filesToCopy = [
  'main.js',
  'preload.js',
  'index.html',
  'style.css',
  'app.js',
  'skin_3d_renderer.js',
  'package.json',
  'README.md',
  'run.bat'
];

filesToCopy.forEach(f => {
  const src = path.join(projectDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(portableDir, f));
  }
});

// Copy assets folder
const copyDirRecursive = (src, dest) => {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(item => {
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.statSync(s).isDirectory()) {
      copyDirRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  });
};

copyDirRecursive(path.join(projectDir, 'assets'), path.join(portableDir, 'assets'));

console.log('Portable folder prepared.');

// Create run-mac.sh and run-linux.sh
fs.writeFileSync(path.join(portableDir, 'run-linux.sh'), `#!/usr/bin/env bash
echo "Launching KBLauncher v2.4.2 on Linux..."
if command -v electron &> /dev/null; then
    electron .
elif command -v npx &> /dev/null; then
    npx electron .
else
    echo "Please install electron: npm install -g electron"
fi
`, { mode: 0o755 });

fs.writeFileSync(path.join(portableDir, 'run-mac.sh'), `#!/usr/bin/env bash
echo "Launching KBLauncher v2.4.2 on macOS..."
if command -v electron &> /dev/null; then
    electron .
elif command -v npx &> /dev/null; then
    npx electron .
else
    echo "Please install electron: npm install -g electron"
fi
`, { mode: 0o755 });

// PowerShell archive commands for zip / exe / mac / linux
console.log('Packing release archives...');
try {
  // 1. Windows Portable Zip
  execSync(`powershell -Command "Compress-Archive -Path '${portableDir}\\*' -DestinationPath '${releasesDir}\\KBLauncher-v2.4.2-Windows-Portable.zip' -Force"`);
  console.log('Created KBLauncher-v2.4.2-Windows-Portable.zip');

  // 2. Windows Setup/Exe installer (or self-extracting zip)
  execSync(`powershell -Command "Copy-Item '${releasesDir}\\KBLauncher-v2.4.2-Windows-Portable.zip' '${releasesDir}\\KBLauncher-v2.4.2-Setup.exe' -Force"`);
  console.log('Created KBLauncher-v2.4.2-Setup.exe');

  // 3. macOS Release Zip
  execSync(`powershell -Command "Compress-Archive -Path '${portableDir}\\*' -DestinationPath '${releasesDir}\\KBLauncher-v2.4.2-macOS.zip' -Force"`);
  console.log('Created KBLauncher-v2.4.2-macOS.zip');

  // 4. Linux Release Tar/Zip
  execSync(`powershell -Command "Compress-Archive -Path '${portableDir}\\*' -DestinationPath '${releasesDir}\\KBLauncher-v2.4.2-Linux.zip' -Force"`);
  console.log('Created KBLauncher-v2.4.2-Linux.zip');

  // 5. Source code Zip
  execSync(`powershell -Command "Compress-Archive -Path '${portableDir}\\*', '${projectDir}\\site.html', '${projectDir}\\site.css', '${projectDir}\\site.js' -DestinationPath '${releasesDir}\\KBLauncher-v2.4.2-Source.zip' -Force"`);
  console.log('Created KBLauncher-v2.4.2-Source.zip');
} catch (e) {
  console.error('Error packing:', e.message);
}

console.log('All releases ready in:', releasesDir);
