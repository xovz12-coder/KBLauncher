#![windows_subsystem = "windows"]

mod app;
mod mods;
mod servers;
mod versions;

use app::KBLauncherApp;
use eframe::egui::{IconData, Vec2};

fn main() -> eframe::Result<()> {
    let mut native_options = eframe::NativeOptions::default();
    native_options.viewport = native_options.viewport
        .with_inner_size(Vec2::new(1280.0, 800.0))
        .with_min_inner_size(Vec2::new(1024.0, 680.0))
        .with_title("KBLauncher v2.4.2 · Liquid Glass (100% Rust)")
        .with_transparent(false);

    // Try loading application icon if assets/app.ico or assets/kbl-logo-circle.png exists
    if let Ok(icon_bytes) = std::fs::read("assets/kbl-logo-circle.png") {
        if let Ok(img) = image::load_from_memory(&icon_bytes) {
            let rgba = img.to_rgba8();
            let (w, h) = (rgba.width(), rgba.height());
            native_options.viewport = native_options.viewport.with_icon(IconData {
                rgba: rgba.into_raw(),
                width: w,
                height: h,
            });
        }
    }

    eframe::run_native(
        "KBLauncher v2.4.2",
        native_options,
        Box::new(|cc| Ok(Box::new(KBLauncherApp::new(cc)))),
    )
}
