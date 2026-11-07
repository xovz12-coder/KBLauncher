use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ServerItem {
    pub name: String,
    pub ip: String,
    pub version: String,
    pub online_players: u32,
    pub max_players: u32,
    pub ping_ms: u32,
    pub description: String,
    pub is_official: bool,
}

pub fn get_default_servers() -> Vec<ServerItem> {
    vec![
        ServerItem {
            name: "KBLauncher Survival 2026".into(),
            ip: "play.kblauncher.net".into(),
            version: "26.3 / 26.1 / 1.21.4".into(),
            online_players: 284,
            max_players: 500,
            ping_ms: 18,
            description: "Классическое выживание с экономикой, кланами и защитой приватов.".into(),
            is_official: true,
        },
        ServerItem {
            name: "Hypixel Network".into(),
            ip: "mc.hypixel.net".into(),
            version: "1.8.9 — 26.3".into(),
            online_players: 48920,
            max_players: 80000,
            ping_ms: 42,
            description: "Крупнейшая сеть мини-игр: BedWars, SkyWars, SkyBlock.".into(),
            is_official: false,
        },
        ServerItem {
            name: "2b2t Anarchy".into(),
            ip: "2b2t.org".into(),
            version: "1.20.4 — 26.3".into(),
            online_players: 780,
            max_players: 1000,
            ping_ms: 65,
            description: "Старейший сервер анархии в Minecraft без правил и ограничений.".into(),
            is_official: false,
        },
    ]
}
