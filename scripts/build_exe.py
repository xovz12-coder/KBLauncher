import os
import sys
import subprocess

project_dir = r'C:\Users\Anon\.gemini\antigravity\scratch\KBLauncher'
os.chdir(project_dir)

cmd = [
    sys.executable, '-m', 'PyInstaller',
    '--name', 'KBLauncher',
    '--onefile',
    '--noconsole',
    '--icon', os.path.join(project_dir, 'assets', 'app.ico'),
    '--add-data', f'{os.path.join(project_dir, "index.html")};.',
    '--add-data', f'{os.path.join(project_dir, "style.css")};.',
    '--add-data', f'{os.path.join(project_dir, "app.js")};.',
    '--add-data', f'{os.path.join(project_dir, "skin_3d_renderer.js")};.',
    '--add-data', f'{os.path.join(project_dir, "assets")};assets',
    '--add-data', f'{os.path.join(project_dir, "skins_catalog")};skins_catalog',
    '--clean',
    '--distpath', os.path.join(project_dir, 'dist'),
    '--workpath', os.path.join(project_dir, 'build'),
    os.path.join(project_dir, 'main.py')
]

print("Running PyInstaller:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
if res.returncode != 0:
    print("STDOUT:", res.stdout[-2000:])
    print("STDERR:", res.stderr[-2000:])
else:
    exe_path = os.path.join(project_dir, 'dist', 'KBLauncher.exe')
    if os.path.exists(exe_path):
        size_mb = os.path.getsize(exe_path) / (1024 * 1024)
        print(f"SUCCESS! KBLauncher.exe built at: {exe_path} ({size_mb:.2f} MB)")
    else:
        print("Build reported success but exe file not found!")
