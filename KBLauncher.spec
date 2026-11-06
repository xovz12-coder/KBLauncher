# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/main.py'],
    pathex=[],
    binaries=[],
    datas=[('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/index.html', '.'), ('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/style.css', '.'), ('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/app.js', '.'), ('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/skin_3d_renderer.js', '.'), ('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/assets', 'assets'), ('C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/skins_catalog', 'skins_catalog')],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='KBLauncher',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['C:/Users/Anon/.gemini/antigravity/scratch/KBLauncher/assets/app.ico'],
)
