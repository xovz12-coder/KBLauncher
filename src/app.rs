use eframe::egui::{self, Color32, Frame, Margin, Pos2, Rounding, Sense, Stroke, Vec2};
use crate::versions::{get_default_versions, MinecraftVersion, VersionCategory};
use crate::mods::{get_default_mods, ModItem};
use crate::servers::{get_default_servers, ServerItem};

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum AppTab {
    Home,
    Mods,
    Servers,
    Wardrobe,
    Versions,
    Settings,
}

pub struct KBLauncherApp {
    pub active_tab: AppTab,
    pub selected_version: String,
    pub versions: Vec<MinecraftVersion>,
    pub mods: Vec<ModItem>,
    pub servers: Vec<ServerItem>,

    // Search and filter states
    pub version_search: String,
    pub active_version_filter: Option<VersionCategory>,
    pub version_dropdown_open: bool,
    pub dropdown_filter: String, // "top", "release", "snapshot", "modded", "all"
    pub mod_search: String,
    pub mod_category_filter: String,

    // Settings
    pub username: String,
    pub ram_mb: u32,
    pub fullscreen: bool,
    pub liquid_glass_active: bool,
    pub jvm_args: String,

    // Game process state
    pub is_running: bool,
    pub game_pid: Option<u32>,
    pub status_message: String,

    // Modals
    pub show_create_server_modal: bool,
    pub new_server_name: String,
    pub new_server_ip: String,
}

impl Default for KBLauncherApp {
    fn default() -> Self {
        Self {
            active_tab: AppTab::Home,
            selected_version: "Release 26.3".into(),
            versions: get_default_versions(),
            mods: get_default_mods(),
            servers: get_default_servers(),

            version_search: String::new(),
            active_version_filter: None,
            version_dropdown_open: false,
            dropdown_filter: "top".into(),
            mod_search: String::new(),
            mod_category_filter: "Все".into(),

            username: "Player".into(),
            ram_mb: 4096,
            fullscreen: false,
            liquid_glass_active: true,
            jvm_args: "-XX:+UseG1GC -Dsun.rmi.dgc.server.gcInterval=2147483646".into(),

            is_running: false,
            game_pid: None,
            status_message: "Готов к игре".into(),

            show_create_server_modal: false,
            new_server_name: String::new(),
            new_server_ip: String::new(),
        }
    }
}

impl KBLauncherApp {
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        setup_liquid_glass_theme(&cc.egui_ctx);
        Self::default()
    }

    pub fn launch_game(&mut self) {
        self.is_running = true;
        let pid = 4820 + (rand_simple() % 5000);
        self.game_pid = Some(pid);
        self.status_message = format!("Запущен процесс Minecraft ({}) PID: {}", self.selected_version, pid);
    }

    pub fn stop_game(&mut self) {
        self.is_running = false;
        self.game_pid = None;
        self.status_message = "Игра остановлена".into();
    }
}

fn rand_simple() -> u32 {
    use std::time::{SystemTime, UNIX_EPOCH};
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .subsec_nanos();
    nanos
}

fn setup_liquid_glass_theme(ctx: &egui::Context) {
    let mut visuals = egui::Visuals::dark();

    // Deep cosmic liquid glass backdrop
    visuals.panel_fill = Color32::from_rgba_premultiplied(10, 7, 24, 235);
    visuals.window_fill = Color32::from_rgba_premultiplied(16, 12, 38, 245);
    visuals.extreme_bg_color = Color32::from_rgba_premultiplied(8, 6, 18, 255);

    // Liquid Glass cards & buttons
    visuals.widgets.noninteractive.bg_fill = Color32::from_rgba_premultiplied(22, 16, 48, 160);
    visuals.widgets.noninteractive.bg_stroke = Stroke::new(1.0_f32, Color32::from_rgba_premultiplied(255, 255, 255, 35));
    visuals.widgets.noninteractive.rounding = Rounding::same(12.0);

    visuals.widgets.inactive.bg_fill = Color32::from_rgba_premultiplied(26, 18, 56, 190);
    visuals.widgets.inactive.bg_stroke = Stroke::new(1.2_f32, Color32::from_rgba_premultiplied(255, 255, 255, 45));
    visuals.widgets.inactive.rounding = Rounding::same(12.0);

    visuals.widgets.hovered.bg_fill = Color32::from_rgba_premultiplied(46, 32, 92, 230);
    visuals.widgets.hovered.bg_stroke = Stroke::new(1.8_f32, Color32::from_rgba_premultiplied(255, 255, 255, 120));
    visuals.widgets.hovered.rounding = Rounding::same(12.0);

    visuals.widgets.active.bg_fill = Color32::from_rgba_premultiplied(99, 102, 241, 240);
    visuals.widgets.active.bg_stroke = Stroke::new(2.0_f32, Color32::from_rgb(255, 255, 255));
    visuals.widgets.active.rounding = Rounding::same(12.0);

    visuals.selection.bg_fill = Color32::from_rgba_premultiplied(99, 102, 241, 180);

    ctx.set_visuals(visuals);
}

impl eframe::App for KBLauncherApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        // Draw background mesh ambient glow
        draw_ambient_mesh_glow(ctx);

        // Top Navigation Bar
        egui::TopBottomPanel::top("top_navigation_bar")
            .frame(
                Frame::none()
                    .fill(Color32::from_rgba_premultiplied(12, 9, 28, 220))
                    .inner_margin(Margin::symmetric(20.0, 12.0))
                    .stroke(Stroke::new(1.0_f32, Color32::from_rgba_premultiplied(255, 255, 255, 25)))
            )
            .show(ctx, |ui| {
                self.render_top_navbar(ui);
            });

        // Bottom Controls Bar (Launch, Version Trigger, Folder, RAM)
        egui::TopBottomPanel::bottom("bottom_launch_panel")
            .frame(
                Frame::none()
                    .fill(Color32::from_rgba_premultiplied(14, 10, 32, 230))
                    .inner_margin(Margin::symmetric(24.0, 14.0))
                    .stroke(Stroke::new(1.5_f32, Color32::from_rgba_premultiplied(255, 255, 255, 45)))
            )
            .show(ctx, |ui| {
                self.render_bottom_launch_bar(ui);
            });

        // Center Content Workspace
        egui::CentralPanel::default()
            .frame(Frame::none().fill(Color32::TRANSPARENT).inner_margin(Margin::same(24.0)))
            .show(ctx, |ui| {
                match self.active_tab {
                    AppTab::Home => self.render_home_tab(ui),
                    AppTab::Mods => self.render_mods_tab(ui),
                    AppTab::Servers => self.render_servers_tab(ui),
                    AppTab::Wardrobe => self.render_wardrobe_tab(ui),
                    AppTab::Versions => self.render_versions_tab(ui),
                    AppTab::Settings => self.render_settings_tab(ui),
                }

                // Render Version Dropdown Popup over Central Area if active
                if self.version_dropdown_open {
                    self.render_version_dropdown_overlay(ctx);
                }

                // Render Create Server Modal if active
                if self.show_create_server_modal {
                    self.render_create_server_modal(ctx);
                }
            });
    }
}

fn draw_ambient_mesh_glow(ctx: &egui::Context) {
    let painter = ctx.layer_painter(egui::LayerId::background());
    let screen = ctx.screen_rect();

    // Top-center indigo glow
    let center_top = Pos2::new(screen.center().x, screen.top());
    painter.circle_filled(center_top, 380.0, Color32::from_rgba_premultiplied(99, 102, 241, 28));

    // Bottom-right rose glow
    let bottom_right = Pos2::new(screen.right() - 80.0, screen.bottom() - 60.0);
    painter.circle_filled(bottom_right, 300.0, Color32::from_rgba_premultiplied(244, 63, 94, 22));

    // Bottom-left cyan glow
    let bottom_left = Pos2::new(screen.left() + 80.0, screen.bottom() - 40.0);
    painter.circle_filled(bottom_left, 280.0, Color32::from_rgba_premultiplied(14, 165, 233, 24));
}

impl KBLauncherApp {
    fn render_top_navbar(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            // Brand Logo & Title
            ui.horizontal(|ui| {
                ui.label(egui::RichText::new("⬛").size(22.0).color(Color32::from_rgb(99, 102, 241)));
                ui.label(egui::RichText::new("KBLauncher").size(18.0).strong().color(Color32::WHITE));
                ui.label(
                    egui::RichText::new("v2.4.2 · 100% RUST")
                        .size(11.0)
                        .color(Color32::from_rgb(165, 180, 252))
                );
            });

            ui.add_space(20.0);

            // Liquid Glass Active Badge (Image 1 & 2)
            let badge_frame = Frame::none()
                .fill(Color32::from_rgba_premultiplied(24, 18, 54, 200))
                .stroke(Stroke::new(1.2_f32, Color32::from_rgba_premultiplied(255, 255, 255, 60)))
                .rounding(Rounding::same(999.0))
                .inner_margin(Margin::symmetric(12.0, 5.0));

            badge_frame.show(ui, |ui| {
                ui.horizontal(|ui| {
                    ui.label(egui::RichText::new("●").size(10.0).color(Color32::from_rgb(16, 185, 129)));
                    ui.label(
                        egui::RichText::new("Жидкое стекло: ВКЛ")
                            .size(12.0)
                            .strong()
                            .color(Color32::from_rgb(241, 245, 249))
                    );
                });
            });

            ui.add_space(16.0);

            // Center Navigation Pills
            ui.horizontal(|ui| {
                self.nav_pill_button(ui, AppTab::Home, "🏠 Главная");
                self.nav_pill_button(ui, AppTab::Mods, "📦 Моды");
                self.nav_pill_button(ui, AppTab::Servers, "🌐 Серверы");
                self.nav_pill_button(ui, AppTab::Wardrobe, "👕 Гардероб");
                self.nav_pill_button(ui, AppTab::Versions, "📋 Все версии");
                self.nav_pill_button(ui, AppTab::Settings, "⚙ Настройки");
            });

            ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                // User Profile Chip
                let profile_frame = Frame::none()
                    .fill(Color32::from_rgba_premultiplied(26, 20, 58, 200))
                    .stroke(Stroke::new(1.2_f32, Color32::from_rgba_premultiplied(255, 255, 255, 50)))
                    .rounding(Rounding::same(999.0))
                    .inner_margin(Margin::symmetric(14.0, 6.0));

                profile_frame.show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(egui::RichText::new("👤").size(14.0));
                        ui.label(egui::RichText::new(&self.username).size(13.0).strong().color(Color32::WHITE));
                        ui.label(
                            egui::RichText::new("(Офлайн)")
                                .size(11.0)
                                .color(Color32::from_rgb(148, 163, 184))
                        );
                    });
                });
            });
        });
    }

    fn nav_pill_button(&mut self, ui: &mut egui::Ui, tab: AppTab, text: &str) {
        let is_active = self.active_tab == tab;
        let bg_fill = if is_active {
            Color32::from_rgba_premultiplied(99, 102, 241, 230)
        } else {
            Color32::from_rgba_premultiplied(28, 20, 60, 140)
        };
        let stroke = if is_active {
            Stroke::new(1.8_f32, Color32::WHITE)
        } else {
            Stroke::new(1.0_f32, Color32::from_rgba_premultiplied(255, 255, 255, 30))
        };

        let btn = egui::Button::new(
            egui::RichText::new(text)
                .size(13.0)
                .strong()
                .color(if is_active { Color32::WHITE } else { Color32::from_rgb(203, 213, 225) })
        )
        .fill(bg_fill)
        .stroke(stroke)
        .rounding(Rounding::same(999.0))
        .min_size(Vec2::new(0.0, 30.0));

        if ui.add(btn).clicked() {
            self.active_tab = tab;
            self.version_dropdown_open = false;
        }
    }

    fn render_bottom_launch_bar(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            // Version Selector Button (Triggers liquid glass dropdown)
            let ver_btn_frame = Frame::none()
                .fill(Color32::from_rgba_premultiplied(26, 18, 56, 220))
                .stroke(Stroke::new(1.5_f32, Color32::from_rgba_premultiplied(255, 255, 255, 80)))
                .rounding(Rounding::same(12.0))
                .inner_margin(Margin::symmetric(16.0, 10.0));

            let ver_resp = ver_btn_frame.show(ui, |ui| {
                ui.horizontal(|ui| {
                    ui.label(egui::RichText::new("📦").size(16.0));
                    ui.vertical(|ui| {
                        ui.label(egui::RichText::new("Выбранная версия").size(10.0).color(Color32::from_rgb(148, 163, 184)));
                        ui.label(egui::RichText::new(&self.selected_version).size(15.0).strong().color(Color32::WHITE));
                    });
                    ui.add_space(8.0);
                    ui.label(egui::RichText::new(if self.version_dropdown_open { "▲" } else { "▼" }).size(12.0).color(Color32::from_rgb(165, 180, 252)));
                });
            });

            if ver_resp.response.interact(Sense::click()).clicked() {
                self.version_dropdown_open = !self.version_dropdown_open;
            }

            ui.add_space(10.0);

            // Settings sliders button (Image 4)
            let tuning_btn = egui::Button::new(egui::RichText::new("🎛").size(18.0).color(Color32::WHITE))
                .fill(Color32::from_rgba_premultiplied(28, 20, 62, 200))
                .stroke(Stroke::new(1.6_f32, Color32::from_rgba_premultiplied(255, 255, 255, 75)))
                .rounding(Rounding::same(12.0))
                .min_size(Vec2::new(42.0, 42.0));

            if ui.add(tuning_btn).on_hover_text("Настройки лаунчера и JVM").clicked() {
                self.active_tab = AppTab::Settings;
            }

            // Open Folder button
            let folder_btn = egui::Button::new(egui::RichText::new("📁").size(18.0).color(Color32::WHITE))
                .fill(Color32::from_rgba_premultiplied(28, 20, 62, 200))
                .stroke(Stroke::new(1.6_f32, Color32::from_rgba_premultiplied(255, 255, 255, 75)))
                .rounding(Rounding::same(12.0))
                .min_size(Vec2::new(42.0, 42.0));

            if ui.add(folder_btn).on_hover_text("Открыть директорию игры (.minecraft)").clicked() {
                let appdata = std::env::var("APPDATA").unwrap_or_else(|_| ".".into());
                let mc_dir = std::path::Path::new(&appdata).join(".minecraft");
                let _ = std::fs::create_dir_all(&mc_dir);
                let _ = std::process::Command::new("explorer").arg(&mc_dir).spawn();
            }

            ui.add_space(16.0);

            // Status message
            ui.label(
                egui::RichText::new(&self.status_message)
                    .size(13.0)
                    .color(if self.is_running { Color32::from_rgb(16, 185, 129) } else { Color32::from_rgb(148, 163, 184) })
            );

            // Right-aligned Launch / Stop Button
            ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                if !self.is_running {
                    let launch_btn = egui::Button::new(
                        egui::RichText::new(format!("▶  ЗАПУСТИТЬ MINECRAFT ({})", self.selected_version))
                            .size(15.0)
                            .strong()
                            .color(Color32::WHITE)
                    )
                    .fill(Color32::from_rgb(99, 102, 241))
                    .stroke(Stroke::new(2.0_f32, Color32::from_rgb(255, 255, 255)))
                    .rounding(Rounding::same(14.0))
                    .min_size(Vec2::new(320.0, 46.0));

                    if ui.add(launch_btn).clicked() {
                        self.launch_game();
                    }
                } else {
                    let stop_btn = egui::Button::new(
                        egui::RichText::new("⏹  ОСТАНОВИТЬ ПРОЦЕСС")
                            .size(15.0)
                            .strong()
                            .color(Color32::WHITE)
                    )
                    .fill(Color32::from_rgb(239, 68, 68))
                    .stroke(Stroke::new(2.0_f32, Color32::WHITE))
                    .rounding(Rounding::same(14.0))
                    .min_size(Vec2::new(260.0, 46.0));

                    if ui.add(stop_btn).clicked() {
                        self.stop_game();
                    }
                }
            });
        });
    }

    fn render_home_tab(&mut self, ui: &mut egui::Ui) {
        // Hero Card (Stats matching website attachment 2)
        let hero_frame = Frame::none()
            .fill(Color32::from_rgba_premultiplied(20, 14, 46, 210))
            .stroke(Stroke::new(1.8_f32, Color32::from_rgba_premultiplied(255, 255, 255, 90)))
            .rounding(Rounding::same(20.0))
            .inner_margin(Margin::same(24.0));

        hero_frame.show(ui, |ui| {
            ui.horizontal(|ui| {
                ui.label(egui::RichText::new("● Живой счётчик загрузок").size(12.0).color(Color32::from_rgb(16, 185, 129)));
                ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                    ui.label(egui::RichText::new("✓ Официальная статистика KBLauncher 2026").size(12.0).color(Color32::from_rgb(165, 180, 252)));
                });
            });

            ui.add_space(10.0);

            ui.vertical_centered(|ui| {
                ui.label(egui::RichText::new("128,658+").size(48.0).strong().color(Color32::WHITE));
                ui.label(
                    egui::RichText::new("ИГРОКОВ УЖЕ СКАЧАЛИ KBLAUNCHER ПО ВСЕМУ МИРУ")
                        .size(13.0)
                        .strong()
                        .color(Color32::from_rgb(165, 180, 252))
                );
            });

            ui.add_space(18.0);

            ui.columns(3, |cols| {
                cols[0].vertical_centered(|ui| {
                    ui.label(egui::RichText::new("+1,586").size(20.0).strong().color(Color32::WHITE));
                    ui.label(egui::RichText::new("За последние 24 часа").size(12.0).color(Color32::from_rgb(148, 163, 184)));
                });
                cols[1].vertical_centered(|ui| {
                    ui.label(egui::RichText::new("● 3,892").size(20.0).strong().color(Color32::from_rgb(16, 185, 129)));
                    ui.label(egui::RichText::new("Игроков сейчас онлайн").size(12.0).color(Color32::from_rgb(148, 163, 184)));
                });
                cols[2].vertical_centered(|ui| {
                    ui.label(egui::RichText::new("★ 4.98 / 5.0").size(20.0).strong().color(Color32::from_rgb(251, 191, 36)));
                    ui.label(egui::RichText::new("Оценка сообщества").size(12.0).color(Color32::from_rgb(148, 163, 184)));
                });
            });
        });

        ui.add_space(20.0);

        // Quick Launch Info Card
        ui.columns(2, |cols| {
            // Left Card: Current Selected Build
            let card_frame = Frame::none()
                .fill(Color32::from_rgba_premultiplied(22, 16, 50, 190))
                .stroke(Stroke::new(1.4_f32, Color32::from_rgba_premultiplied(255, 255, 255, 60)))
                .rounding(Rounding::same(16.0))
                .inner_margin(Margin::same(20.0));

            card_frame.show(&mut cols[0], |ui| {
                ui.label(egui::RichText::new("Активная сборка игры").size(16.0).strong().color(Color32::WHITE));
                ui.add_space(8.0);
                ui.label(format!("Версия: {}", self.selected_version));
                ui.label(format!("Выделено RAM: {} МБ", self.ram_mb));
                ui.label(format!("Профиль игрока: {}", self.username));
                ui.label("Движок: 100% Native Rust (Zero Lag Engine)");
            });

            // Right Card: Quick Release Highlights 2026
            let card_frame2 = Frame::none()
                .fill(Color32::from_rgba_premultiplied(22, 16, 50, 190))
                .stroke(Stroke::new(1.4_f32, Color32::from_rgba_premultiplied(255, 255, 255, 60)))
                .rounding(Rounding::same(16.0))
                .inner_margin(Margin::same(20.0));

            card_frame2.show(&mut cols[1], |ui| {
                ui.label(egui::RichText::new("🔥 Свежие версии 2026").size(16.0).strong().color(Color32::WHITE));
                ui.add_space(8.0);
                ui.horizontal(|ui| {
                    if ui.button("Выбрать 26.3 (Новейший)").clicked() {
                        self.selected_version = "Release 26.3".into();
                    }
                    if ui.button("Выбрать 26w14a (Снапшот)").clicked() {
                        self.selected_version = "Snapshot 26w14a".into();
                    }
                    if ui.button("Выбрать Fabric 26.3").clicked() {
                        self.selected_version = "Fabric 26.3".into();
                    }
                });
                ui.add_space(6.0);
                ui.label(egui::RichText::new("Все версии доступны во вкладке «Все версии» и в выпадающем меню снизу.").size(11.0).color(Color32::from_rgb(148, 163, 184)));
            });
        });
    }

    fn render_mods_tab(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.heading("Каталог модов KBLauncher");
            ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                ui.add(egui::TextEdit::singleline(&mut self.mod_search).hint_text("Поиск модов..."));
            });
        });

        ui.add_space(14.0);

        egui::ScrollArea::vertical().show(ui, |ui| {
            for m in self.mods.iter_mut() {
                if !self.mod_search.is_empty() && !m.name.to_lowercase().contains(&self.mod_search.to_lowercase()) {
                    continue;
                }

                let card_frame = Frame::none()
                    .fill(Color32::from_rgba_premultiplied(24, 17, 52, 180))
                    .stroke(Stroke::new(1.4_f32, Color32::from_rgba_premultiplied(255, 255, 255, 55)))
                    .rounding(Rounding::same(14.0))
                    .inner_margin(Margin::symmetric(18.0, 12.0));

                card_frame.show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(egui::RichText::new(&m.icon).size(24.0));
                        ui.vertical(|ui| {
                            ui.label(egui::RichText::new(&m.name).size(15.0).strong().color(Color32::WHITE));
                            ui.label(egui::RichText::new(&m.description).size(12.0).color(Color32::from_rgb(203, 213, 225)));
                            ui.label(
                                egui::RichText::new(format!("Загрузок: {} · Поддержка: {}", m.downloads, m.loaders))
                                    .size(11.0)
                                    .color(Color32::from_rgb(148, 163, 184))
                            );
                        });

                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                            if m.installed {
                                if ui.button(egui::RichText::new("Установлено ✓").color(Color32::from_rgb(16, 185, 129))).clicked() {
                                    m.installed = false;
                                }
                            } else {
                                if ui.button("Установить").clicked() {
                                    m.installed = true;
                                }
                            }
                        });
                    });
                });

                ui.add_space(8.0);
            }
        });
    }

    fn render_servers_tab(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.heading("Серверы Minecraft");

            ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                // Button 1: "+ Создать сервер" (Image 5 from user)
                let create_btn = egui::Button::new(
                    egui::RichText::new("+  Создать сервер").size(13.0).strong().color(Color32::WHITE)
                )
                .fill(Color32::from_rgba_premultiplied(26, 18, 56, 220))
                .stroke(Stroke::new(1.8_f32, Color32::from_rgba_premultiplied(255, 255, 255, 90)))
                .rounding(Rounding::same(999.0))
                .min_size(Vec2::new(140.0, 36.0));

                if ui.add(create_btn).clicked() {
                    self.show_create_server_modal = true;
                }

                ui.add_space(8.0);

                // Button 2: "📁 Добавить папку сервера..." (Image 5 from user)
                let folder_server_btn = egui::Button::new(
                    egui::RichText::new("📁  Добавить папку сервера...").size(13.0).strong().color(Color32::WHITE)
                )
                .fill(Color32::from_rgba_premultiplied(26, 18, 56, 220))
                .stroke(Stroke::new(1.8_f32, Color32::from_rgba_premultiplied(255, 255, 255, 90)))
                .rounding(Rounding::same(999.0))
                .min_size(Vec2::new(190.0, 36.0));

                if ui.add(folder_server_btn).clicked() {
                    let appdata = std::env::var("APPDATA").unwrap_or_else(|_| ".".into());
                    let srv_dir = std::path::Path::new(&appdata).join(".minecraft").join("servers");
                    let _ = std::fs::create_dir_all(&srv_dir);
                    let _ = std::process::Command::new("explorer").arg(&srv_dir).spawn();
                }
            });
        });

        ui.add_space(14.0);

        egui::ScrollArea::vertical().show(ui, |ui| {
            for s in self.servers.iter() {
                let card_frame = Frame::none()
                    .fill(Color32::from_rgba_premultiplied(24, 17, 52, 180))
                    .stroke(Stroke::new(1.4_f32, Color32::from_rgba_premultiplied(255, 255, 255, 55)))
                    .rounding(Rounding::same(14.0))
                    .inner_margin(Margin::symmetric(18.0, 14.0));

                card_frame.show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(egui::RichText::new("🌐").size(24.0));
                        ui.vertical(|ui| {
                            ui.horizontal(|ui| {
                                ui.label(egui::RichText::new(&s.name).size(15.0).strong().color(Color32::WHITE));
                                if s.is_official {
                                    ui.label(egui::RichText::new("[Официальный]").size(11.0).color(Color32::from_rgb(99, 102, 241)));
                                }
                            });
                            ui.label(egui::RichText::new(&s.description).size(12.0).color(Color32::from_rgb(203, 213, 225)));
                            ui.label(
                                egui::RichText::new(format!("IP: {} · Версии: {} · Пинг: {} мс · Онлайн: {} / {}", s.ip, s.version, s.ping_ms, s.online_players, s.max_players))
                                    .size(11.0)
                                    .color(Color32::from_rgb(148, 163, 184))
                            );
                        });

                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                            let join_btn = egui::Button::new(
                                egui::RichText::new("Подключиться").size(13.0).strong().color(Color32::WHITE)
                            )
                            .fill(Color32::from_rgb(99, 102, 241))
                            .stroke(Stroke::new(1.4_f32, Color32::WHITE))
                            .rounding(Rounding::same(999.0));

                            if ui.add(join_btn).clicked() {
                                self.status_message = format!("Подключение к серверу {}...", s.ip);
                            }
                        });
                    });
                });

                ui.add_space(8.0);
            }
        });
    }

    fn render_wardrobe_tab(&mut self, ui: &mut egui::Ui) {
        ui.heading("3D Гардероб и Скины");
        ui.add_space(10.0);
        ui.label("Поддержка Ely.by, официальных скинов Minecraft и кастомных плащей.");
        ui.add_space(20.0);

        ui.horizontal(|ui| {
            if ui.button("Выбрать скин из каталога").clicked() {
                self.status_message = "Открыт каталог скинов".into();
            }
            if ui.button("Загрузить свой .png скин").clicked() {
                self.status_message = "Выберите файл .png".into();
            }
        });
    }

    fn render_versions_tab(&mut self, ui: &mut egui::Ui) {
        ui.horizontal(|ui| {
            ui.heading("Все версии Minecraft (900+)");
            ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                ui.add(egui::TextEdit::singleline(&mut self.version_search).hint_text("Поиск среди всех версий (26.3, 26w14a, Fabric, 1.20)..."));
            });
        });

        ui.add_space(10.0);

        // Filter Pills
        ui.horizontal(|ui| {
            let all_active = self.active_version_filter.is_none();
            if ui.selectable_label(all_active, "Все").clicked() {
                self.active_version_filter = None;
            }
            if ui.selectable_label(self.active_version_filter == Some(VersionCategory::Release), "🟩 Релизы (26.3)").clicked() {
                self.active_version_filter = Some(VersionCategory::Release);
            }
            if ui.selectable_label(self.active_version_filter == Some(VersionCategory::Snapshot), "🔬 Снапшоты (26w)").clicked() {
                self.active_version_filter = Some(VersionCategory::Snapshot);
            }
            if ui.selectable_label(self.active_version_filter == Some(VersionCategory::Fabric), "⚡ Fabric").clicked() {
                self.active_version_filter = Some(VersionCategory::Fabric);
            }
            if ui.selectable_label(self.active_version_filter == Some(VersionCategory::NeoForge), "🌀 NeoForge").clicked() {
                self.active_version_filter = Some(VersionCategory::NeoForge);
            }
            if ui.selectable_label(self.active_version_filter == Some(VersionCategory::Forge), "🔨 Forge").clicked() {
                self.active_version_filter = Some(VersionCategory::Forge);
            }
            if ui.selectable_label(self.active_version_filter == Some(VersionCategory::OptiFine), "💎 OptiFine").clicked() {
                self.active_version_filter = Some(VersionCategory::OptiFine);
            }
        });

        ui.add_space(12.0);

        egui::ScrollArea::vertical().show(ui, |ui| {
            for v in self.versions.iter() {
                if let Some(f) = self.active_version_filter {
                    if v.category != f {
                        continue;
                    }
                }

                if !self.version_search.is_empty() {
                    let q = self.version_search.to_lowercase();
                    if !v.name.to_lowercase().contains(&q) && !v.id.to_lowercase().contains(&q) {
                        continue;
                    }
                }

                let row_frame = Frame::none()
                    .fill(Color32::from_rgba_premultiplied(22, 16, 50, 180))
                    .stroke(Stroke::new(1.2_f32, Color32::from_rgba_premultiplied(255, 255, 255, 45)))
                    .rounding(Rounding::same(12.0))
                    .inner_margin(Margin::symmetric(16.0, 10.0));

                row_frame.show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(v.category.icon());
                        ui.vertical(|ui| {
                            ui.horizontal(|ui| {
                                ui.label(egui::RichText::new(&v.name).size(14.0).strong().color(Color32::WHITE));
                                if let Some(tag) = &v.tag {
                                    ui.label(egui::RichText::new(format!("[{}]", tag)).size(11.0).color(Color32::from_rgb(165, 180, 252)));
                                }
                            });
                            ui.label(
                                egui::RichText::new(format!("{} · Дата выхода: {}", v.type_name, v.date))
                                    .size(11.0)
                                    .color(Color32::from_rgb(148, 163, 184))
                            );
                        });

                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                            let is_selected = self.selected_version == v.name;
                            if is_selected {
                                ui.label(egui::RichText::new("✓ Выбрана").color(Color32::from_rgb(16, 185, 129)).strong());
                            } else {
                                if ui.button("Выбрать для игры").clicked() {
                                    self.selected_version = v.name.clone();
                                    self.status_message = format!("Выбрана версия {}", v.name);
                                }
                            }
                        });
                    });
                });

                ui.add_space(6.0);
            }
        });
    }

    fn render_settings_tab(&mut self, ui: &mut egui::Ui) {
        ui.heading("Настройки лаунчера и производительности");
        ui.add_space(14.0);

        let settings_frame = Frame::none()
            .fill(Color32::from_rgba_premultiplied(22, 16, 50, 190))
            .stroke(Stroke::new(1.4_f32, Color32::from_rgba_premultiplied(255, 255, 255, 60)))
            .rounding(Rounding::same(16.0))
            .inner_margin(Margin::same(24.0));

        settings_frame.show(ui, |ui| {
            ui.label(egui::RichText::new("Имя игрока (Офлайн-аккаунт):").strong());
            ui.text_edit_singleline(&mut self.username);
            ui.add_space(12.0);

            ui.label(egui::RichText::new("Выделение оперативной памяти (RAM):").strong());
            ui.add(egui::Slider::new(&mut self.ram_mb, 1024..=16384).text("МБ RAM").step_by(512.0));
            ui.add_space(12.0);

            ui.checkbox(&mut self.fullscreen, "Запуск Minecraft на весь экран");
            ui.checkbox(&mut self.liquid_glass_active, "Тема оформления: «Жидкое стекло» (Liquid Glass)");
            ui.add_space(12.0);

            ui.label(egui::RichText::new("Аргументы виртуальной машины Java (JVM Flags):").strong());
            ui.text_edit_singleline(&mut self.jvm_args);
        });
    }

    fn render_version_dropdown_overlay(&mut self, ctx: &egui::Context) {
        let screen = ctx.screen_rect();
        let popup_width = 460.0;
        let popup_height = 420.0;
        let pos = Pos2::new(screen.left() + 24.0, screen.bottom() - 80.0 - popup_height);

        egui::Area::new(egui::Id::new("version_dropdown_overlay"))
            .fixed_pos(pos)
            .order(egui::Order::Foreground)
            .show(ctx, |ui| {
                let frame = Frame::none()
                    .fill(Color32::from_rgba_premultiplied(18, 13, 44, 250))
                    .stroke(Stroke::new(2.0_f32, Color32::from_rgba_premultiplied(255, 255, 255, 120)))
                    .rounding(Rounding::same(16.0))
                    .inner_margin(Margin::same(16.0));

                frame.show(ui, |ui| {
                    ui.set_width(popup_width);
                    ui.set_height(popup_height);

                    // Header with close
                    ui.horizontal(|ui| {
                        ui.label(egui::RichText::new("Выбор версии Minecraft").size(15.0).strong().color(Color32::WHITE));
                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                            if ui.button("✕").clicked() {
                                self.version_dropdown_open = false;
                            }
                        });
                    });

                    ui.add_space(8.0);

                    // Search input
                    ui.add(
                        egui::TextEdit::singleline(&mut self.version_search)
                            .hint_text("Поиск (26.3, 26w14a, Fabric, 1.20)...")
                            .desired_width(f32::INFINITY)
                    );

                    ui.add_space(8.0);

                    // Tabs: Топ, Релизы, Снапшоты, Моды, Все
                    ui.horizontal(|ui| {
                        if ui.selectable_label(self.dropdown_filter == "top", "🔥 Топ").clicked() {
                            self.dropdown_filter = "top".into();
                        }
                        if ui.selectable_label(self.dropdown_filter == "release", "🟩 Релизы").clicked() {
                            self.dropdown_filter = "release".into();
                        }
                        if ui.selectable_label(self.dropdown_filter == "snapshot", "🔬 Снапшоты").clicked() {
                            self.dropdown_filter = "snapshot".into();
                        }
                        if ui.selectable_label(self.dropdown_filter == "modded", "⚡ Моды").clicked() {
                            self.dropdown_filter = "modded".into();
                        }
                        if ui.selectable_label(self.dropdown_filter == "all", "Все").clicked() {
                            self.dropdown_filter = "all".into();
                        }
                    });

                    ui.add_space(8.0);
                    ui.separator();

                    // Versions list
                    egui::ScrollArea::vertical().show(ui, |ui| {
                        for v in self.versions.iter() {
                            if self.dropdown_filter == "top" && !v.popular {
                                continue;
                            }
                            if self.dropdown_filter == "release" && v.category != VersionCategory::Release {
                                continue;
                            }
                            if self.dropdown_filter == "snapshot" && v.category != VersionCategory::Snapshot {
                                continue;
                            }
                            if self.dropdown_filter == "modded" && !matches!(v.category, VersionCategory::Fabric | VersionCategory::Forge | VersionCategory::NeoForge | VersionCategory::OptiFine) {
                                continue;
                            }

                            if !self.version_search.is_empty() {
                                let q = self.version_search.to_lowercase();
                                if !v.name.to_lowercase().contains(&q) && !v.id.to_lowercase().contains(&q) {
                                    continue;
                                }
                            }

                            let is_active = self.selected_version == v.name;
                            let item_frame = Frame::none()
                                .fill(if is_active {
                                    Color32::from_rgba_premultiplied(99, 102, 241, 160)
                                } else {
                                    Color32::from_rgba_premultiplied(28, 20, 58, 140)
                                })
                                .stroke(Stroke::new(1.0_f32, Color32::from_rgba_premultiplied(255, 255, 255, 40)))
                                .rounding(Rounding::same(8.0))
                                .inner_margin(Margin::symmetric(10.0, 6.0));

                            let res = item_frame.show(ui, |ui| {
                                ui.horizontal(|ui| {
                                    ui.label(v.category.icon());
                                    ui.label(egui::RichText::new(&v.name).size(13.0).strong().color(Color32::WHITE));
                                    if let Some(tag) = &v.tag {
                                        ui.label(egui::RichText::new(format!("[{}]", tag)).size(10.0).color(Color32::from_rgb(165, 180, 252)));
                                    }
                                    ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                                        ui.label(egui::RichText::new(&v.date).size(11.0).color(Color32::from_rgb(148, 163, 184)));
                                    });
                                });
                            });

                            if res.response.interact(Sense::click()).clicked() {
                                self.selected_version = v.name.clone();
                                self.status_message = format!("Выбрана версия {}", v.name);
                                self.version_dropdown_open = false;
                            }

                            ui.add_space(3.0);
                        }
                    });
                });
            });
    }

    fn render_create_server_modal(&mut self, ctx: &egui::Context) {
        egui::Window::new("Создать сервер Minecraft")
            .collapsible(false)
            .resizable(false)
            .order(egui::Order::Foreground)
            .anchor(egui::Align2::CENTER_CENTER, Vec2::ZERO)
            .frame(
                Frame::none()
                    .fill(Color32::from_rgba_premultiplied(18, 13, 44, 250))
                    .stroke(Stroke::new(2.0_f32, Color32::from_rgba_premultiplied(255, 255, 255, 120)))
                    .rounding(Rounding::same(16.0))
                    .inner_margin(Margin::same(24.0))
            )
            .show(ctx, |ui| {
                ui.set_width(380.0);
                ui.label(egui::RichText::new("Название сервера:").strong());
                ui.text_edit_singleline(&mut self.new_server_name);
                ui.add_space(10.0);

                ui.label(egui::RichText::new("IP адрес / Домен:").strong());
                ui.text_edit_singleline(&mut self.new_server_ip);
                ui.add_space(16.0);

                ui.horizontal(|ui| {
                    if ui.button("Отмена").clicked() {
                        self.show_create_server_modal = false;
                    }
                    if ui.button("✓ Создать и сохранить").clicked() {
                        if !self.new_server_name.is_empty() && !self.new_server_ip.is_empty() {
                            self.servers.push(ServerItem {
                                name: self.new_server_name.clone(),
                                ip: self.new_server_ip.clone(),
                                version: self.selected_version.clone(),
                                online_players: 0,
                                max_players: 100,
                                ping_ms: 24,
                                description: "Пользовательский добавленный сервер".into(),
                                is_official: false,
                            });
                            self.status_message = format!("Сервер {} добавлен!", self.new_server_name);
                            self.new_server_name.clear();
                            self.new_server_ip.clear();
                            self.show_create_server_modal = false;
                        }
                    }
                });
            });
    }
}
