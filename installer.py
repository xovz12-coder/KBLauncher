import os
import sys
import shutil
import subprocess
import threading
import time
import customtkinter as ctk
from PIL import Image

def get_bundle_dir():
    if getattr(sys, 'frozen', False):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

BUNDLE_DIR = get_bundle_dir()

# Target installation directory
DEFAULT_INSTALL_DIR = os.path.join(
    os.environ.get('LOCALAPPDATA', os.path.expanduser('~')),
    'Programs',
    'KBLauncher'
)

def create_windows_shortcut(target_exe, shortcut_path, icon_path=None):
    """Creates a Windows .lnk shortcut using PowerShell COM object"""
    ps_script = f"""
    $WshShell = New-Object -comObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut('{shortcut_path}')
    $Shortcut.TargetPath = '{target_exe}'
    $Shortcut.WorkingDirectory = '{os.path.dirname(target_exe)}'
    """
    if icon_path and os.path.exists(icon_path):
        ps_script += f"\n$Shortcut.IconLocation = '{icon_path},0'"
    else:
        ps_script += f"\n$Shortcut.IconLocation = '{target_exe},0'"
    ps_script += "\n$Shortcut.Save()"

    try:
        subprocess.run(['powershell', '-NoProfile', '-Command', ps_script], capture_output=True, check=True)
        return True
    except Exception as e:
        print(f"Error creating shortcut {shortcut_path}: {e}")
        return False

class InstallerApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Установка KBLauncher v2.4.2")
        self.geometry("540x420")
        self.resizable(False, False)

        # Set theme
        ctk.set_appearance_mode("Dark")
        ctk.set_default_color_theme("blue")
        self.configure(fg_color="#0c0a1d")

        # Set window icon if available
        icon_file = os.path.join(BUNDLE_DIR, "app.ico")
        if os.path.exists(icon_file):
            try:
                self.iconbitmap(icon_file)
            except Exception:
                pass

        self.install_dir = DEFAULT_INSTALL_DIR
        self.is_installed = False

        self._build_ui()

    def _build_ui(self):
        # Header banner frame
        header_frame = ctk.CTkFrame(self, fg_color="#14112c", corner_radius=12)
        header_frame.pack(fill="x", padx=20, pady=(20, 15))

        # Title & Subtitle inside header
        title_label = ctk.CTkLabel(
            header_frame,
            text="KBLauncher v2.4.2",
            font=ctk.CTkFont(family="Segoe UI", size=22, weight="bold"),
            text_color="#ffffff"
        )
        title_label.pack(anchor="w", padx=20, pady=(15, 2))

        sub_label = ctk.CTkLabel(
            header_frame,
            text="Ультра-современный Minecraft лаунчер (Все версии 26.3 — 1.0)",
            font=ctk.CTkFont(family="Segoe UI", size=13),
            text_color="#a5b4fc"
        )
        sub_label.pack(anchor="w", padx=20, pady=(0, 15))

        # Content frame
        content_frame = ctk.CTkFrame(self, fg_color="transparent")
        content_frame.pack(fill="both", expand=True, padx=24, pady=5)

        # Path display
        path_title = ctk.CTkLabel(
            content_frame,
            text="Папка установки:",
            font=ctk.CTkFont(family="Segoe UI", size=12, weight="bold"),
            text_color="#cbd5e1"
        )
        path_title.pack(anchor="w", pady=(0, 4))

        self.path_entry = ctk.CTkEntry(
            content_frame,
            fg_color="#181534",
            border_color="#312e81",
            text_color="#f1f5f9",
            height=34
        )
        self.path_entry.insert(0, self.install_dir)
        self.path_entry.configure(state="readonly")
        self.path_entry.pack(fill="x", pady=(0, 15))

        # Progress bar
        self.progress_bar = ctk.CTkProgressBar(
            content_frame,
            height=8,
            fg_color="#1e1b4b",
            progress_color="#6366f1"
        )
        self.progress_bar.set(0.0)
        self.progress_bar.pack(fill="x", pady=(5, 8))

        # Status text
        self.status_label = ctk.CTkLabel(
            content_frame,
            text="Нажмите «Установить» для начала распаковки файлов.",
            font=ctk.CTkFont(family="Segoe UI", size=12),
            text_color="#94a3b8"
        )
        self.status_label.pack(anchor="w")

        # Checkbox for launch
        self.launch_check = ctk.CTkCheckBox(
            content_frame,
            text="Запустить KBLauncher после установки",
            fg_color="#6366f1",
            hover_color="#4f46e5",
            border_color="#4338ca",
            text_color="#e2e8f0"
        )
        self.launch_check.select()
        self.launch_check.pack(anchor="w", pady=(15, 0))

        # Bottom Button
        self.action_btn = ctk.CTkButton(
            self,
            text="Установить KBLauncher",
            font=ctk.CTkFont(family="Segoe UI", size=14, weight="bold"),
            fg_color="#6366f1",
            hover_color="#4f46e5",
            height=42,
            corner_radius=10,
            command=self._on_action_click
        )
        self.action_btn.pack(fill="x", padx=24, pady=(10, 20))

    def _on_action_click(self):
        if not self.is_installed:
            self.action_btn.configure(state="disabled", text="Установка...")
            threading.Thread(target=self._run_installation, daemon=True).start()
        else:
            self._finish_and_launch()

    def _kill_running_instances(self):
        """Forcefully kills running KBLauncher and any processes in install directory"""
        try:
            subprocess.run(['taskkill', '/F', '/T', '/IM', 'KBLauncher.exe'], capture_output=True)
        except Exception:
            pass
        try:
            escaped_dir = self.install_dir.replace("'", "''")
            ps_kill = f"Get-Process | Where-Object {{ $_.Path -like '{escaped_dir}*' }} | Stop-Process -Force -ErrorAction SilentlyContinue"
            subprocess.run(['powershell', '-NoProfile', '-Command', ps_kill], capture_output=True)
        except Exception:
            pass

    def _safe_copy_file(self, src, dst, max_wait_sec=12):
        """Copies a file with retries, killing any locks if necessary"""
        start_time = time.time()
        while time.time() - start_time < max_wait_sec:
            try:
                if os.path.exists(dst):
                    try:
                        with open(dst, 'a+b'):
                            pass
                    except (PermissionError, OSError):
                        self._kill_running_instances()
                        time.sleep(0.6)
                        continue
                shutil.copy2(src, dst)
                return True
            except (PermissionError, OSError):
                self._kill_running_instances()
                time.sleep(0.6)
        
        raise RuntimeError("Файл KBLauncher.exe занят запущенным приложением. Пожалуйста, закройте лаунчер (или снимите задачу в Диспетчере задач) и нажмите «Повторить».")

    def _run_installation(self):
        try:
            self._update_progress(0.1, "Подготовка к установке...")
            os.makedirs(self.install_dir, exist_ok=True)
            time.sleep(0.2)

            # 1. Close any running instances of KBLauncher before copying
            self._update_progress(0.2, "Остановка предыдущей версии KBLauncher...")
            self._kill_running_instances()
            time.sleep(0.5)

            self._update_progress(0.4, "Распаковка KBLauncher.exe...")
            src_exe = os.path.join(BUNDLE_DIR, "KBLauncher.exe")
            target_exe = os.path.join(self.install_dir, "KBLauncher.exe")

            self._safe_copy_file(src_exe, target_exe)
            time.sleep(0.3)

            self._update_progress(0.6, "Копирование ресурсов и иконок...")
            src_ico = os.path.join(BUNDLE_DIR, "app.ico")
            target_ico = os.path.join(self.install_dir, "app.ico")
            if os.path.exists(src_ico):
                try:
                    shutil.copy2(src_ico, target_ico)
                except Exception:
                    pass
            time.sleep(0.3)

            self._update_progress(0.8, "Создание ярлыка на Рабочем столе...")
            desktop = os.path.join(os.environ.get('USERPROFILE', os.path.expanduser('~')), 'Desktop')
            desktop_shortcut = os.path.join(desktop, "KBLauncher.lnk")
            create_windows_shortcut(target_exe, desktop_shortcut, target_ico)

            # Start menu shortcut
            start_menu = os.path.join(
                os.environ.get('APPDATA', ''),
                r'Microsoft\Windows\Start Menu\Programs'
            )
            start_shortcut = os.path.join(start_menu, "KBLauncher.lnk")
            create_windows_shortcut(target_exe, start_shortcut, target_ico)

            time.sleep(0.3)
            self._update_progress(1.0, "Готово! KBLauncher успешно установлен.")

            self.is_installed = True
            self.after(0, lambda: self.action_btn.configure(
                state="normal",
                text="Запустить KBLauncher",
                fg_color="#10b981",
                hover_color="#059669"
            ))

        except Exception as e:
            self._update_progress(0.0, f"{e}")
            self.after(0, lambda: self.action_btn.configure(state="normal", text="Повторить"))

    def _update_progress(self, val, msg):
        self.after(0, lambda: self._apply_progress(val, msg))

    def _apply_progress(self, val, msg):
        self.progress_bar.set(val)
        self.status_label.configure(text=msg)

    def _finish_and_launch(self):
        if self.launch_check.get() == 1:
            target_exe = os.path.join(self.install_dir, "KBLauncher.exe")
            if os.path.exists(target_exe):
                subprocess.Popen([target_exe])
        self.destroy()

if __name__ == '__main__':
    app = InstallerApp()
    app.mainloop()
