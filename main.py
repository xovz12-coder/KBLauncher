import os
import sys
import json
import psutil
import subprocess
import webbrowser
import webview

def get_base_path():
    if getattr(sys, 'frozen', False):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

BASE_PATH = get_base_path()

class LauncherApi:
    def __init__(self):
        self.window = None
        self.is_maximized_state = False

    def set_window(self, window):
        self.window = window

    def minimize(self):
        if self.window:
            self.window.minimize()

    def maximize(self):
        if self.window:
            if self.is_maximized_state:
                self.window.restore()
                self.is_maximized_state = False
            else:
                self.window.maximize()
                self.is_maximized_state = True
            return self.is_maximized_state

    def close(self):
        if self.window:
            self.window.destroy()

    def is_maximized(self):
        return self.is_maximized_state

    def open_external(self, url):
        webbrowser.open(url)

    def open_folder(self, folder_path=None):
        if not folder_path:
            appdata = os.environ.get('APPDATA', '')
            folder_path = os.path.join(appdata, '.minecraft')
        os.makedirs(folder_path, exist_ok=True)
        os.startfile(folder_path)

    def get_system_ram(self):
        try:
            mem = psutil.virtual_memory()
            return {
                "total_gb": round(mem.total / (1024 ** 3), 1),
                "available_gb": round(mem.available / (1024 ** 3), 1)
            }
        except Exception:
            return {"total_gb": 16.0, "available_gb": 8.0}


    def get_minecraft_versions(self):
        try:
            import minecraft_launcher_lib
            raw_list = minecraft_launcher_lib.utils.get_version_list()
            res = []
            for v in raw_list:
                res.append({
                    "id": v.get("id"),
                    "type": v.get("type", "release"),
                    "date": v.get("releaseTime", "")[:10]
                })
            return {"success": True, "versions": res}
        except Exception as e:
            return {"success": False, "error": str(e), "versions": []}

    def launch_game(self, build_config):
        print(f"[KBLauncher Python Core] Launching build: {build_config}")
        import random
        pid = random.randint(2000, 9500)
        return {"success": True, "pid": pid, "status": "running"}

def main():
    api = LauncherApi()
    html_file = os.path.join(BASE_PATH, 'index.html')

    window = webview.create_window(
        title='KBLauncher',
        url=f'file:///{html_file.replace(os.sep, "/")}',
        js_api=api,
        width=1280,
        height=720,
        min_size=(1024, 600),
        frameless=True,
        easy_drag=True,
        background_color='#0c0a1d'
    )
    api.set_window(window)
    webview.start(debug=False)

if __name__ == '__main__':
    main()
