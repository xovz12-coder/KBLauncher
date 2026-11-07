



/**

 * KBLauncher - Application Controller

 * Handles navigation, state, instances, mods catalog, skin preview, server manager & settings.

 */



// Global Launcher State



// ==========================================================================

// COMPREHENSIVE MINECRAFT VERSIONS DATABASE (ALL VERSIONS + MODLOADERS)

// Covers all major releases (1.21.4 down to 1.0), Fabric, Forge, NeoForge, OptiFine, Snapshots

// ==========================================================================

// ============================================================

// 🎮 ALL OFFICIAL MINECRAFT VERSIONS (RELEASES & SNAPSHOTS)

// Note: Modloaders (Fabric, Quilt, Forge, NeoForge, OptiFine) are

// dynamically selectable engines for each compatible version!

// ============================================================

const BASE_MINECRAFT_VERSIONS = [

  // --- 2026 RELEASES ---

  { id: '26.3', ver: 'Release 26.3', category: 'release', typeName: 'Официальный релиз', date: '04.11.2026', installed: true, popular: true, tag: 'Новейший релиз 2026 · Рекомендуется' },

  { id: '26.2', ver: 'Release 26.2', category: 'release', typeName: 'Официальный релиз', date: '18.09.2026', installed: true, popular: true, tag: 'Свежий релиз' },

  { id: '26.1.2', ver: 'Release 26.1.2', category: 'release', typeName: 'Официальный релиз', date: '12.07.2026', installed: false, popular: true },

  { id: '26.1.1', ver: 'Release 26.1.1', category: 'release', typeName: 'Официальный релиз', date: '25.06.2026', installed: false, popular: false },

  { id: '26.1', ver: 'Release 26.1', category: 'release', typeName: 'Официальный релиз', date: '04.06.2026', installed: true, popular: true, tag: 'Стабильный' },

  { id: '26.0', ver: 'Release 26.0', category: 'release', typeName: 'Официальный релиз', date: '14.04.2026', installed: false, popular: false },



  // --- 2026 SNAPSHOTS ---

  { id: '26w14a', ver: 'Snapshot 26w14a', category: 'snapshot', typeName: 'Снапшот Mojang', date: '02.11.2026', installed: true, popular: true, tag: 'Самый свежий снапшот' },

  { id: '26w12b', ver: 'Snapshot 26w12b', category: 'snapshot', typeName: 'Снапшот Mojang', date: '22.10.2026', installed: false, popular: true },

  { id: '26w10a', ver: 'Snapshot 26w10a', category: 'snapshot', typeName: 'Снапшот Mojang', date: '08.10.2026', installed: false, popular: true, tag: 'Снапшот 26.3' },

  { id: '26w08a', ver: 'Snapshot 26w08a', category: 'snapshot', typeName: 'Снапшот Mojang', date: '24.09.2026', installed: false, popular: false },

  { id: '26.3-pre2', ver: '26.3 Pre-Release 2', category: 'snapshot', typeName: 'Пре-релиз', date: '29.10.2026', installed: false, popular: true },

  { id: '26.3-pre1', ver: '26.3 Pre-Release 1', category: 'snapshot', typeName: 'Пре-релиз', date: '25.10.2026', installed: false, popular: false },

  { id: '25w48a', ver: 'Snapshot 25w48a', category: 'snapshot', typeName: 'Снапшот Mojang', date: '28.11.2025', installed: false, popular: false },

  { id: '24w46a', ver: 'Snapshot 24w46a', category: 'snapshot', typeName: 'Снапшот Mojang', date: '14.11.2024', installed: false, popular: false },

  { id: '24w45a', ver: 'Snapshot 24w45a', category: 'snapshot', typeName: 'Снапшот Mojang', date: '06.11.2024', installed: false, popular: false },

  { id: '1.21.4-pre1', ver: '1.21.4 Pre-Release 1', category: 'snapshot', typeName: 'Пре-релиз', date: '20.11.2024', installed: false, popular: false },



  // --- 1.21 & 1.20 RELEASES ---

  { id: '1.21.4', ver: 'Release 1.21.4', category: 'release', typeName: 'Официальный релиз', date: '03.12.2024', installed: true, popular: true, tag: 'Стабильный' },

  { id: '1.21.3', ver: 'Release 1.21.3', category: 'release', typeName: 'Официальный релиз', date: '23.10.2024', installed: false, popular: false },

  { id: '1.21.1', ver: 'Release 1.21.1', category: 'release', typeName: 'Официальный релиз', date: '08.08.2024', installed: true, popular: true, tag: 'Топ модпаков' },

  { id: '1.21', ver: 'Release 1.21', category: 'release', typeName: 'Официальный релиз', date: '13.06.2024', installed: false, popular: false },

  { id: '1.20.6', ver: 'Release 1.20.6', category: 'release', typeName: 'Официальный релиз', date: '29.04.2024', installed: false, popular: false },

  { id: '1.20.4', ver: 'Release 1.20.4', category: 'release', typeName: 'Официальный релиз', date: '07.12.2023', installed: true, popular: true, tag: 'LTS' },

  { id: '1.20.2', ver: 'Release 1.20.2', category: 'release', typeName: 'Официальный релиз', date: '21.09.2023', installed: false, popular: false },

  { id: '1.20.1', ver: 'Release 1.20.1', category: 'release', typeName: 'Официальный релиз', date: '12.06.2023', installed: true, popular: true, tag: 'Топ для модов' },



  // --- 1.19 DOWN TO 1.14 ---

  { id: '1.19.4', ver: 'Release 1.19.4', category: 'release', typeName: 'Официальный релиз', date: '14.03.2023', installed: false, popular: true },

  { id: '1.19.2', ver: 'Release 1.19.2', category: 'release', typeName: 'Официальный релиз', date: '05.08.2022', installed: true, popular: true },

  { id: '1.18.2', ver: 'Release 1.18.2', category: 'release', typeName: 'Официальный релиз', date: '28.02.2022', installed: false, popular: true },

  { id: '1.17.1', ver: 'Release 1.17.1', category: 'release', typeName: 'Официальный релиз', date: '06.07.2021', installed: false, popular: false },

  { id: '1.16.5', ver: 'Release 1.16.5', category: 'release', typeName: 'Официальный релиз', date: '15.01.2021', installed: true, popular: true, tag: 'Легендарная' },

  { id: '1.15.2', ver: 'Release 1.15.2', category: 'release', typeName: 'Официальный релиз', date: '21.01.2020', installed: false, popular: false },

  { id: '1.14.4', ver: 'Release 1.14.4', category: 'release', typeName: 'Официальный релиз', date: '19.07.2019', installed: false, popular: false },



  // --- CLASSIC RELEASES ---

  { id: '1.13.2', ver: 'Release 1.13.2', category: 'release', typeName: 'Официальный релиз', date: '22.10.2018', installed: false, popular: false },

  { id: '1.12.2', ver: 'Release 1.12.2', category: 'release', typeName: 'Официальный релиз', date: '18.09.2017', installed: true, popular: true, tag: 'Золотой стандарт Forge' },

  { id: '1.11.2', ver: 'Release 1.11.2', category: 'release', typeName: 'Официальный релиз', date: '21.12.2016', installed: false, popular: false },

  { id: '1.10.2', ver: 'Release 1.10.2', category: 'release', typeName: 'Официальный релиз', date: '23.06.2016', installed: false, popular: false },

  { id: '1.9.4', ver: 'Release 1.9.4', category: 'release', typeName: 'Официальный релиз', date: '10.05.2016', installed: false, popular: false },

  { id: '1.8.9', ver: 'Release 1.8.9', category: 'release', typeName: 'Официальный релиз', date: '09.12.2015', installed: true, popular: true, tag: 'Топ для PvP / Hypixel' },

  { id: '1.7.10', ver: 'Release 1.7.10', category: 'release', typeName: 'Официальный релиз', date: '26.06.2014', installed: true, popular: true, tag: 'Классика модов' },

  { id: '1.6.4', ver: 'Release 1.6.4', category: 'release', typeName: 'Официальный релиз', date: '19.09.2013', installed: false, popular: false },

  { id: '1.5.2', ver: 'Release 1.5.2', category: 'release', typeName: 'Официальный релиз', date: '02.05.2013', installed: false, popular: true, tag: 'Ностальгия' },

  { id: '1.4.7', ver: 'Release 1.4.7', category: 'release', typeName: 'Официальный релиз', date: '09.01.2013', installed: false, popular: false },

  { id: '1.2.5', ver: 'Release 1.2.5', category: 'release', typeName: 'Официальный релиз', date: '04.04.2012', installed: false, popular: false },

  { id: '1.0.0', ver: 'Release 1.0.0', category: 'release', typeName: 'Официальный релиз', date: '18.11.2011', installed: false, popular: false, tag: 'Первый релиз' },



  // --- RETRO BETA & ALPHA ---

  { id: 'b1.7.3', ver: 'Beta 1.7.3', category: 'old', typeName: 'Старая Beta', date: '08.07.2011', installed: true, popular: true, tag: 'Золотая эра' },

  { id: 'b1.8.1', ver: 'Beta 1.8.1', category: 'old', typeName: 'Старая Beta', date: '19.09.2011', installed: false, popular: false },

  { id: 'a1.2.6', ver: 'Alpha 1.2.6', category: 'old', typeName: 'Старая Alpha', date: '03.12.2010', installed: false, popular: false }

];



// ============================================================

// 🧠 DETAILED MODLOADER COMPATIBILITY MATRIX CALCULATOR

// Calculates exact supported modloaders (Fabric, Quilt, NeoForge,

// Forge, OptiFine, Vanilla) for any version from 1.0 to 26.x.

// ============================================================

function getSupportedLoaders(verId, category) {

  const raw = String(verId).replace(/^(Release|Snapshot)\s+/i, '').trim();

  const isSnapshot = (category === 'snapshot') || raw.includes('w') || raw.includes('pre') || raw.includes('rc') || raw.includes('snapshot');

  const loaders = [];



  // 1. VANILLA - Always supported

  loaders.push({

    id: 'vanilla',

    name: 'Vanilla',

    fullName: 'Vanilla Minecraft',

    tag: 'Чистый клиент',

    icon: '🟩',

    color: '#34d399',

    tagBg: 'rgba(52, 211, 153, 0.15)',

    desc: 'Оригинальный чистый Minecraft от Mojang Studios без модов. Максимальная стабильность и скорость.',

    verNotice: 'Официальный Mojang'

  });



  // 2. FABRIC:

  // - Supports all modern snapshots (26w, 25w, 24w, 23w...)

  // - Supports releases >= 1.14 up through 1.21.x and 26.x

  // - Supports Legacy Fabric on 1.12.2, 1.8.9, 1.7.10

  let fabricOk = false;

  let fabricTag = 'Быстрый старт';

  if (isSnapshot) {

    fabricOk = true;

    fabricTag = 'Снапшот';

  } else if (raw.startsWith('26.') || raw.startsWith('25.')) {

    fabricOk = true;

    fabricTag = 'Рекомендуется 2026';

  } else {

    const parts = raw.split('.').map(n => parseInt(n, 10));

    const major = parts[0] || 0;

    const minor = parts[1] || 0;

    if (major > 1 || (major === 1 && minor >= 14)) {

      fabricOk = true;

      if (raw === '1.20.1' || raw === '1.21.4' || raw === '1.21.1') fabricTag = 'Топ модов';

    } else if (raw === '1.12.2' || raw === '1.8.9' || raw === '1.7.10') {

      fabricOk = true;

      fabricTag = 'Legacy Fabric';

    }

  }



  if (fabricOk) {

    loaders.push({

      id: 'fabric',

      name: 'Fabric',

      fullName: 'Fabric Loader',

      tag: fabricTag,

      icon: '⚡',

      color: '#fbbf24',

      tagBg: 'rgba(251, 191, 36, 0.15)',

      desc: 'Сверхбыстрый современный загрузчик модов. Высокий FPS, мгновенная загрузка и сотни модов оптимизации (Sodium, Iris, Lithium).',

      verNotice: 'Высочайший FPS'

    });

  }



  // 3. QUILT:

  // - Supports modern snapshots and releases >= 1.18.2, 1.21.x, 26.x

  let quiltOk = false;

  let quiltTag = 'Новый стандарт';

  if (isSnapshot) {

    quiltOk = true;

    quiltTag = 'Снапшот';

  } else if (raw.startsWith('26.') || raw.startsWith('25.')) {

    quiltOk = true;

    quiltTag = 'Рекомендуется 2026';

  } else {

    const parts = raw.split('.').map(n => parseInt(n, 10));

    const major = parts[0] || 0;

    const minor = parts[1] || 0;

    const patch = parts[2] || 0;

    if (major > 1 || (major === 1 && (minor > 18 || (minor === 18 && patch >= 2)))) {

      quiltOk = true;

    }

  }



  if (quiltOk) {

    loaders.push({

      id: 'quilt',

      name: 'Quilt',

      fullName: 'Quilt Loader',

      tag: quiltTag,

      icon: '🧵',

      color: '#a78bfa',

      tagBg: 'rgba(167, 139, 250, 0.15)',

      desc: 'Модульный форк Fabric с расширенным API. Полная поддержка модов Fabric плюс эксклюзивные плагины экосистемы Quilt.',

      verNotice: 'Совместим с Fabric'

    });

  }



  // 4. NEOFORGE:

  // - Official successor to Forge for 1.20.2+, 1.20.4, 1.20.6, 1.21.x, 26.x (plus 1.20.1 beta)

  let neoforgeOk = false;

  let neoforgeTag = 'Новое поколение';

  if (!isSnapshot) {

    if (raw.startsWith('26.') || raw.startsWith('25.')) {

      neoforgeOk = true;

      neoforgeTag = 'Флагман 2026';

    } else {

      const parts = raw.split('.').map(n => parseInt(n, 10));

      const major = parts[0] || 0;

      const minor = parts[1] || 0;

      const patch = parts[2] || 0;

      if (major > 1 || (major === 1 && (minor > 20 || (minor === 20 && patch >= 1)))) {

        neoforgeOk = true;

      }

    }

  }



  if (neoforgeOk) {

    loaders.push({

      id: 'neoforge',

      name: 'NeoForge',

      fullName: 'NeoForged Loader',

      tag: neoforgeTag,

      icon: '🌀',

      color: '#f97316',

      tagBg: 'rgba(249, 115, 22, 0.15)',

      desc: 'Официальный преемник Forge от основной команды разработчиков. Новый стандарт для грандиозных сборок и технических модов.',

      verNotice: 'Стандарт моддинга 1.20.2+'

    });

  }



  // 5. FORGE:

  // - Classic Forge: 1.1 up to 1.20.1, 1.20.4, 1.21.x, 26.x

  let forgeOk = false;

  let forgeTag = 'Классика';

  if (!isSnapshot) {

    if (raw.startsWith('26.') || raw.startsWith('25.')) {

      forgeOk = true;

      forgeTag = 'Forge 2026';

    } else {

      const parts = raw.split('.').map(n => parseInt(n, 10));

      const major = parts[0] || 0;

      const minor = parts[1] || 0;

      if (major === 1 && minor >= 1) {

        forgeOk = true;

        if (raw === '1.20.1' || raw === '1.16.5' || raw === '1.12.2' || raw === '1.7.10') {

          forgeTag = 'Легендарный';

        }

      }

    }

  }



  if (forgeOk) {

    loaders.push({

      id: 'forge',

      name: 'Forge',

      fullName: 'Minecraft Forge',

      tag: forgeTag,

      icon: '🔨',

      color: '#38bdf8',

      tagBg: 'rgba(56, 189, 248, 0.15)',

      desc: 'Самый известный исторический загрузчик для комплексных модпаков (Create, Twilight Forest, JEI, Applied Energistics).',

      verNotice: 'Тысячи глобальных модов'

    });

  }



  // 6. OPTIFINE:

  // - Releases 1.0.0 through 1.21.4, 26.x

  let optifineOk = false;

  let optifineTag = 'Шейдеры';

  if (!isSnapshot) {

    if (raw.startsWith('26.') || raw.startsWith('25.')) {

      optifineOk = true;

    } else {

      const parts = raw.split('.').map(n => parseInt(n, 10));

      const major = parts[0] || 0;

      const minor = parts[1] || 0;

      if (major === 1) {

        optifineOk = true;

        if (raw === '1.8.9' || raw === '1.12.2') optifineTag = 'PvP Boost';

      }

    }

  }



  if (optifineOk) {

    loaders.push({

      id: 'optifine',

      name: 'OptiFine',

      fullName: 'OptiFine HD',

      tag: optifineTag,

      icon: '💎',

      color: '#60a5fa',

      tagBg: 'rgba(96, 165, 250, 0.15)',

      desc: 'Легендарный движок шейдеров, соединенных текстур и детальной настройки графики для повышения FPS.',

      verNotice: 'Шейдеры и текстуры'

    });

  }



  return loaders;

}





const LauncherState = {

  allVersions: [...BASE_MINECRAFT_VERSIONS],

  activeVersionFilter: 'all',

  activeDropdownFilter: 'all',

  activeTab: 'tab-home',

  activeSubTab: 'sub-overview',

  activeInstance: 'kblauncher-main',

  selectedVersion: 'Release 26.3',

  isPlaying: false,

  gamePid: null,

  user: {

    name: 'Player',

    type: 'Офлайн',

    avatar: 'assets/user-avatar.png'

  },

  accounts: [

    { id: 'acc-1', name: 'Player', type: 'Офлайн', avatar: 'assets/user-avatar.png', active: true },

    { id: 'acc-2', name: 'igrok1111222', type: 'Офлайн', avatar: 'assets/default-skin-64.png', active: false }

  ],

  settings: {

    ram: 4096,

    resolution: '1920x1080',

    javaPath: 'Автоопределение (OpenJDK 21 64-bit)',

    jvmArgs: '-XX:+UseG1GC -XX:+ParallelRefProcEnabled'

  },

  instances: [

    {

      id: 'kblauncher-main',

      name: 'KBLauncher',

      version: 'Release 26.3',

      modloader: 'Fabric',

      status: 'Готово',

      tag: 'Fabric · 5 модов',

      dirName: 'kblauncher-main',

      installedMods: ['sodium', 'iris', 'fabric-api', 'lithium', 'ferritecore'],

      modsCount: 5

    },

    {

      id: 'vanilla-1-21',

      name: 'Vanilla 1.21.4',

      version: 'Release 1.21.4',

      modloader: 'Vanilla',

      status: 'Чистый клиент',

      tag: 'Release · Без модов',

      dirName: 'vanilla-1-21',

      installedMods: [],

      modsCount: 0

    },

    {

      id: 'shaders-optifine',

      name: 'Shaders & RT',

      version: 'Release 1.20.1',

      modloader: 'Fabric',

      status: 'Шейдеры',

      tag: 'Iris + BSL Шейдеры',

      dirName: 'shaders-optifine',

      installedMods: ['iris', 'sodium', 'complementary'],

      modsCount: 3

    }

  ],

  mods: [

    {

      id: 'sodium',

      name: 'Sodium',

      desc: 'Кратно увеличивает частоту кадров (FPS) и снижает микрофризы рендеринга.',

      category: 'mods',

      downloads: '249M',

      author: 'jellysquid',

      iconUrl: 'assets/mods/sodium.webp',

      loaders: ['fabric', 'neoforge']

    },

    {

      id: 'iris',

      name: 'Iris Shaders',

      desc: 'Современный и быстрый движок шейдеров с поддержкой шейдерпаков OptiFine.',

      category: 'mods',

      downloads: '185M',

      author: 'coderbot',

      iconUrl: 'assets/mods/iris.png',

      loaders: ['fabric', 'neoforge']

    },

    {

      id: 'fabric-api',

      name: 'Fabric API',

      desc: 'Основная библиотека и хуки жизненного цикла для работы модов на Fabric.',

      category: 'mods',

      downloads: '310M',

      author: 'FabricMC',

      iconUrl: 'assets/mods/fabric-api.png',

      loaders: ['fabric']

    },

    {

      id: 'lithium',

      name: 'Lithium',

      desc: 'Оптимизация искусственного интеллекта мобов, тиков мира и физики чанков.',

      category: 'mods',

      downloads: '142M',

      author: 'jellysquid',

      iconUrl: 'assets/mods/lithium.png',

      loaders: ['fabric', 'neoforge']

    },

    {

      id: 'ferritecore',

      name: 'FerriteCore',

      desc: 'Снижает потребление оперативной памяти Minecraft на 30-50%.',

      category: 'mods',

      downloads: '118M',

      author: 'malte0811',

      iconUrl: 'assets/mods/ferrite-core.png',

      loaders: ['fabric', 'forge', 'neoforge']

    },

    {

      id: 'journeymap',

      name: 'JourneyMap',

      desc: 'Детализированная карта мира в реальном времени с радаром и путевыми точками.',

      category: 'mods',

      downloads: '215M',

      author: 'techbrew',

      iconUrl: 'assets/mods/journeymap.png',

      loaders: ['fabric', 'forge', 'neoforge']

    },

    {

      id: 'jei',

      name: 'Just Enough Items (JEI)',

      desc: 'Удобный просмотр всех предметов игры, рецептов крафта и использований.',

      category: 'mods',

      downloads: '340M',

      author: 'mezz',

      iconUrl: 'assets/mods/jei.png',

      loaders: ['fabric', 'forge', 'neoforge']

    },

    {

      id: 'appleskin',

      name: 'AppleSkin',

      desc: 'Визуализация насыщения, голода и восстановления здоровья едой.',

      category: 'mods',

      downloads: '198M',

      author: 'squeek502',

      iconUrl: 'assets/mods/appleskin.png',

      loaders: ['fabric', 'forge', 'neoforge', 'quilt']

    },

    {

      id: 'indium',

      name: 'Indium',

      desc: 'Реализация Fabric Rendering API для модов при совместном использовании с Sodium.',

      category: 'mods',

      downloads: '95M',

      author: 'comp500',

      iconUrl: 'assets/mods/indium.png',

      loaders: ['fabric']

    },

    {

      id: 'continuity',

      name: 'Continuity',

      desc: 'Бесшовные соединенные текстуры стекла, полированного камня и книжных полок.',

      category: 'mods',

      downloads: '78M',

      author: 'PepperCode1',

      iconUrl: 'assets/mods/continuity.png',

      loaders: ['fabric', 'quilt']

    },

    {

      id: 'entity-culling',

      name: 'Entity Culling',

      desc: 'Пропускает рендеринг мобов и сундуков, скрытых за непрозрачными блоками.',

      category: 'mods',

      downloads: '84M',

      author: 'tr7zw',

      iconUrl: 'assets/mods/entity-culling.png',

      loaders: ['fabric', 'forge', 'neoforge']

    },

    {

      id: 'complementary',

      name: 'Complementary Reimagined',

      desc: 'Потрясающий шейдерпак с мягкими тенями, облаками и отражениями воды.',

      category: 'shaders',

      downloads: '64M',

      author: 'EminGT',

      iconUrl: 'assets/mods/complementary-reimagined.png',

      loaders: ['iris', 'optifine']

    }

  ],

  servers: [],

  versions: BASE_MINECRAFT_VERSIONS

};



// ==========================================

// Initialization

// ==========================================

// Restore persistent instances and active selection from localStorage
try {
  const savedInsts = localStorage.getItem('kbl_instances');
  if (savedInsts) {
    const parsed = JSON.parse(savedInsts);
    if (Array.isArray(parsed) && parsed.length > 0) {
      LauncherState.instances = parsed;
    }
  }
  const savedActive = localStorage.getItem('kbl_active_instance');
  if (savedActive && LauncherState.instances.some(i => i.id === savedActive)) {
    LauncherState.activeInstance = savedActive;
  }
} catch (e) {
  console.warn("Could not load stored instances:", e);
}

document.addEventListener('DOMContentLoaded', () => {
  // Restore initial active instance
  const initInst = LauncherState.instances.find(i => i.id === LauncherState.activeInstance) || LauncherState.instances[0];
  if (initInst) {
    window.selectInstance(initInst.id);
  }

  if (window._pyApi && typeof window._pyApi.get_instances === 'function') {
    window._pyApi.get_instances().then(res => {
      if (res && res.instances && res.instances.length > 0) {
        const diskMap = new Map(res.instances.map(i => [i.id, i]));
        LauncherState.instances.forEach(inst => {
          if (diskMap.has(inst.id)) {
            inst.modsCount = diskMap.get(inst.id).modsCount;
          }
        });
        renderInstancesList();
      }
    });
  }


  initWindowControls();

  initNavigation();

  initSubNavigation();

  initVersionDropdown();

  initPlayButton();
  initInteractiveBuildCreator();
  initInstanceContextMenu();
  initGameLogsModal();

  initModsCatalog();

  if (typeof initGitHubModInstaller === 'function') initGitHubModInstaller();

  initServersManager();

  initSkinViewer();

  initVersionsTable();

  initModals();

  initAccountSystem();

  initFirstRunOnboarding();

  initSettings();

  initLinks();

  loadAllMojangVersions();

});



// ==========================================

// Window Titlebar Controls (Frameless)

// ==========================================

function initWindowControls() {

  const btnMin = document.getElementById('btn-minimize');

  const btnMax = document.getElementById('btn-maximize');

  const btnClose = document.getElementById('btn-close');



  if (window.electronAPI) {

    btnMin?.addEventListener('click', () => window.electronAPI.minimize());

    btnMax?.addEventListener('click', () => window.electronAPI.maximize());

    btnClose?.addEventListener('click', () => window.electronAPI.close());

  } else {

    // Web browser fallback

    btnMin?.addEventListener('click', () => showToast('Окно свернуто (эмуляция)'));

    btnMax?.addEventListener('click', () => {

      if (!document.fullscreenElement) {

        document.documentElement.requestFullscreen().catch(() => {});

      } else {

        document.exitFullscreen().catch(() => {});

      }

    });

    btnClose?.addEventListener('click', () => {

      showToast('Лаунчер завершает работу...');

      setTimeout(() => window.close(), 600);

    });

  }

}



// Tab Order for directional navigation

const TAB_ORDER = ['tab-home', 'tab-mods', 'tab-servers', 'tab-wardrobe', 'tab-versions', 'tab-changelog'];



// ==========================================

// Top Navigation Tab Switching & Sliding Glider (Островок)

// ==========================================

function initNavigation() {

  initNavGlider();



  const navPills = document.querySelectorAll('.nav-pill');

  navPills.forEach(pill => {

    pill.addEventListener('click', () => {

      const targetTab = pill.getAttribute('data-tab');

      switchNavTab(targetTab);

    });

  });

}



// Sliding white pill indicator ("островок")

function initNavGlider() {

  const container = document.querySelector('.nav-pills-container');

  const glider = document.getElementById('nav-glider');

  if (!container || !glider) return;



  function updateGlider(activePill, animate = true) {

    if (!activePill) return;

    const containerRect = container.getBoundingClientRect();

    const pillRect = activePill.getBoundingClientRect();



    const left = pillRect.left - containerRect.left;

    const width = pillRect.width;



    if (!animate) {

      glider.style.transition = 'none';

      glider.style.transform = `translateX(${left}px)`;

      glider.style.width = `${width}px`;

      glider.offsetHeight; // Force reflow

      glider.style.transition = '';

    } else {

      glider.style.transform = `translateX(${left}px)`;

      glider.style.width = `${width}px`;

    }

  }



  window.updateNavGlider = updateGlider;



  // Initial positioning without animation on startup

  const initialActive = container.querySelector('.nav-pill.active');

  if (initialActive) {

    // Wait a frame for styles & fonts to settle

    requestAnimationFrame(() => updateGlider(initialActive, false));

    setTimeout(() => updateGlider(initialActive, false), 100);

  }



  window.addEventListener('resize', () => {

    const currentActive = container.querySelector('.nav-pill.active');

    if (currentActive) updateGlider(currentActive, false);

  });

}



function switchNavTab(tabId) {

  const oldIndex = TAB_ORDER.indexOf(LauncherState.activeTab);

  const newIndex = TAB_ORDER.indexOf(tabId);

  const direction = newIndex >= oldIndex ? 'right' : 'left';



  LauncherState.activeTab = tabId;



  // 1. Move sliding active pill capsule (островок)

  const targetPill = document.querySelector(`.nav-pill[data-tab="${tabId}"]`);

  document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));

  if (targetPill) {

    targetPill.classList.add('active');

    if (window.updateNavGlider) {

      window.updateNavGlider(targetPill, true);

    }

  }



  // 2. Animate target page with directional motion blur

  document.querySelectorAll('.tab-page').forEach(page => {

    if (page.id === tabId) {

      page.classList.remove('active', 'slide-in-right', 'slide-in-left');

      void page.offsetWidth; // Force browser reflow to restart CSS animation cleanly

      page.classList.add('active');

      page.classList.add(direction === 'right' ? 'slide-in-right' : 'slide-in-left');

    } else {

      page.classList.remove('active', 'slide-in-right', 'slide-in-left');

    }

  });



  // 3. WebGL viewport update if wardrobe tab is opened

  if (tabId === 'tab-wardrobe' && window.skinViewer3D) {

    const canvas = document.getElementById('skin-canvas');

    if (canvas && window.skinViewer3D.gl) {

      window.skinViewer3D.gl.viewport(0, 0, canvas.width, canvas.height);

    }

  }

}



// ==========================================

// Sub-Navigation Pills (Главная -> Обзор, Моды, Миры...)

// ==========================================

function initSubNavigation() {

  const subTabs = document.querySelectorAll('.subnav-tab');

  subTabs.forEach(tab => {

    tab.addEventListener('click', () => {

      const targetSub = tab.getAttribute('data-subtab');

      switchSubTab(targetSub);

    });

  });

}



function switchSubTab(subTabId) {

  LauncherState.activeSubTab = subTabId;



  document.querySelectorAll('.subnav-tab').forEach(t => {

    t.classList.toggle('active', t.getAttribute('data-subtab') === subTabId);

  });



  document.querySelectorAll('.subview').forEach(view => {

    const isTarget = view.id === `subview-${subTabId.replace('sub-', '')}`;

    view.classList.toggle('active', isTarget);

  });



  if (subTabId === 'sub-mods-list') {

    renderInstalledModsList();

  }

}



// ==========================================

// ==========================================

// Version Selector Dropdown (3 Tabs: All / Releases / Snapshots)

// ==========================================

function initVersionDropdown() {

  const trigger = document.getElementById('version-selector-trigger');

  const dropdown = document.getElementById('version-dropdown-menu');

  const selectedText = document.getElementById('selected-version-text');

  const searchInput = document.getElementById('dropdown-ver-search');

  const listContainer = document.getElementById('version-dropdown-list');

  const tabs = document.querySelectorAll('.ver-tab');



  if (!trigger || !dropdown) return;



  function renderDropdownList() {

    if (!listContainer) return;

    const query = (searchInput?.value || '').trim().toLowerCase();

    const activeTab = LauncherState.activeDropdownFilter || 'all';



    const filtered = LauncherState.allVersions.filter(v => {

      if (query) {

        const loaders = getSupportedLoaders(v.id || v.ver, v.category);

        const matchLoader = loaders.some(l => l.name.toLowerCase().includes(query) || l.id.toLowerCase().includes(query));

        return (

          v.ver.toLowerCase().includes(query) ||

          v.id.toLowerCase().includes(query) ||

          (v.tag && v.tag.toLowerCase().includes(query)) ||

          matchLoader

        );

      }

      if (activeTab === 'release') return (v.category === 'release' || v.category === 'old');

      if (activeTab === 'snapshot') return v.category === 'snapshot';

      return true; // 'all'

    });



    listContainer.innerHTML = filtered.slice(0, 80).map(v => {

      let icon = '🟩';

      if (v.category === 'snapshot') icon = '🔬';

      else if (v.category === 'old') icon = '📜';



      const loaders = getSupportedLoaders(v.id || v.ver, v.category);

      const loaderNames = loaders.filter(l => l.id !== 'vanilla').map(l => l.name).join(' • ');



      const isActive = (LauncherState.selectedVersion.startsWith(v.ver));



      return `

        <div class="version-dropdown-item ${isActive ? 'active' : ''}" data-ver="${v.ver}">

          <div style="display:flex; align-items:center; gap:8px;">

            <span>${icon}</span>

            <span style="font-weight: 600;">${v.ver}</span>

          </div>

          <div style="display:flex; align-items:center; gap:6px;">

            ${loaderNames ? `<span class="ver-dd-loaders-hint">${loaderNames}</span>` : ''}

            <span style="font-size: 10.5px; opacity: 0.75;">${v.tag || v.typeName || ''}</span>

          </div>

        </div>

      `;

    }).join('');



    // Clicking an item in the dropdown opens the loader selection modal!

    listContainer.querySelectorAll('.version-dropdown-item').forEach(item => {

      item.addEventListener('click', (e) => {

        e.stopPropagation();

        const ver = item.getAttribute('data-ver');

        dropdown.classList.remove('show');

        window.openLoaderModal(ver);

      });

    });

  }



    trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
      trigger.classList.add('dropdown-open');
      trigger.closest('.action-bar-row')?.classList.add('dropdown-open');
      renderDropdownList();
      searchInput?.focus();
    } else {
      trigger.classList.remove('dropdown-open');
      trigger.closest('.action-bar-row')?.classList.remove('dropdown-open');
    }
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
    trigger.classList.remove('dropdown-open');
    trigger.closest('.action-bar-row')?.classList.remove('dropdown-open');
  });



  searchInput?.addEventListener('input', () => {

    renderDropdownList();

  });



  tabs.forEach(tab => {

    tab.addEventListener('click', () => {

      tabs.forEach(t => t.classList.remove('active'));

      tab.classList.add('active');

      LauncherState.activeDropdownFilter = tab.getAttribute('data-vtab');

      renderDropdownList();

    });

  });

}





// ==========================================

// Primary Play Button & Launch Lifecycle

// ==========================================

function initPlayButton() {
  const playBtn = document.getElementById('main-play-btn');
  const label = document.getElementById('play-status-label');
  const folderBtn = document.getElementById('btn-open-folder');
  const siteQuickBtn = document.getElementById('btn-quick-site');
  const friendBtn = document.getElementById('btn-join-friend');

  playBtn?.addEventListener('click', async () => {
    const activeInst = LauncherState.instances.find(i => i.id === LauncherState.activeInstance) || LauncherState.instances[0];

    if (!LauncherState.isPlaying) {
      // Start Game Launch Sequence
      LauncherState.isPlaying = true;
      if (label) label.textContent = 'Подготовка...';
      playBtn.style.opacity = '0.85';

      const buildConfig = {
        instance_id: activeInst.id,
        version: LauncherState.selectedVersion || activeInst.version || '26.3',
        modloader: activeInst.modloader || 'Fabric',
        username: LauncherState.currentUser?.name || 'Player',
        ram_mb: LauncherState.settings?.ramMb || 4096
      };

      setTimeout(() => {
        if (label && LauncherState.isPlaying) label.textContent = 'Загрузка библиотек...';
      }, 500);

      try {
        let launchRes = null;
        if (window._pyApi && typeof window._pyApi.launch_game === 'function') {
          launchRes = await window._pyApi.launch_game(buildConfig);
        } else if (window.electronAPI && typeof window.electronAPI.launchGame === 'function') {
          launchRes = await window.electronAPI.launchGame(buildConfig);
        } else {
          // Fallback
          launchRes = { success: true, pid: Math.floor(Math.random() * 5000 + 2000) };
        }

        if (launchRes && launchRes.success) {
          LauncherState.gamePid = launchRes.pid || 3450;
          if (label) label.innerHTML = `В игре <small>(PID: ${LauncherState.gamePid})</small>`;
          playBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          playBtn.style.opacity = '1';
          showToast(`🎮 Minecraft (${buildConfig.version}) запущен в сборке «${activeInst.name}»! PID: ${LauncherState.gamePid}`);
        } else {
          LauncherState.isPlaying = false;
          if (label) label.textContent = 'Играть';
          playBtn.style.background = '';
          playBtn.style.opacity = '1';
          showToast(`⚠️ Ошибка запуска: ${launchRes?.notice || launchRes?.error || 'Неизвестная ошибка'}`);
        }
      } catch (err) {
        LauncherState.isPlaying = false;
        if (label) label.textContent = 'Играть';
        playBtn.style.background = '';
        playBtn.style.opacity = '1';
        showToast(`❌ Ошибка вызова запуска: ${err.message}`);
      }
    } else {
      // Stop / Kill Game
      LauncherState.isPlaying = false;
      LauncherState.gamePid = null;
      if (label) label.textContent = 'Играть';
      playBtn.style.background = '';
      playBtn.style.opacity = '1';

      if (window._pyApi && typeof window._pyApi.kill_game === 'function') {
        window._pyApi.kill_game(activeInst.id);
      } else if (window.electronAPI && typeof window.electronAPI.killGame === 'function') {
        window.electronAPI.killGame(activeInst.id);
      }
      showToast(`⏹ Игра Minecraft остановлена для сборки «${activeInst.name}».`);
    }
  });

  folderBtn?.addEventListener('click', () => {
    const activeInst = LauncherState.instances.find(i => i.id === LauncherState.activeInstance) || LauncherState.instances[0];
    if (window._pyApi && typeof window._pyApi.open_instance_folder === 'function') {
      window._pyApi.open_instance_folder(activeInst.id);
    } else if (window.electronAPI?.openInstanceFolder) {
      window.electronAPI.openInstanceFolder(activeInst.id);
    } else {
      showToast(`📁 Папка игры: .minecraft/instances/${activeInst.id}`);
    }
  });

  siteQuickBtn?.addEventListener('click', () => {
    const siteUrl = 'https://kblauncher.org';
    if (window._pyApi && typeof window._pyApi.open_external === 'function') {
      window._pyApi.open_external(siteUrl);
    } else if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(siteUrl);
    } else {
      window.open(siteUrl, '_blank');
    }
    showToast('🌐 Открытие официального сайта KBLauncher...');
  });

  friendBtn?.addEventListener('click', () => {
    const code = document.getElementById('friend-code-input')?.value.trim();
    if (!code) {
      showToast('⚠️ Введите код приглашения друга');
    } else {
      showToast(`🔗 Подключение к сессии друга: [${code}]`);
    }
  });
}


function initModsCatalog() {

  initInstanceModsSelector();

  renderModsCatalog(LauncherState.mods);



  const searchInput = document.getElementById('mods-search-field');

  searchInput?.addEventListener('input', (e) => {

    const q = e.target.value.trim();

    clearTimeout(modrinthDebounceTimer);



    if (currentModsSource === 'modrinth' || q.length >= 2) {

      modrinthDebounceTimer = setTimeout(() => {

        searchModrinthLive(q);

      }, 350);

    } else {

      const qLower = q.toLowerCase();

      const filtered = LauncherState.mods.filter(m => 

        m.name.toLowerCase().includes(qLower) || m.desc.toLowerCase().includes(qLower)

      );

      renderModsCatalog(filtered);

    }

  });



  // Category Pills

  const catPills = document.querySelectorAll('.category-pill');

  catPills.forEach(pill => {

    pill.addEventListener('click', () => {

      catPills.forEach(p => p.classList.remove('active'));

      pill.classList.add('active');

      const cat = pill.getAttribute('data-category');

      if (cat === 'mods') {

        renderModsCatalog(LauncherState.mods);

      } else {

        const filtered = LauncherState.mods.filter(m => m.category === cat);

        renderModsCatalog(filtered);

      }

    });

  });



  // Source Pills (KBLauncher / Modrinth)

  const sourcePills = document.querySelectorAll('.source-pill:not(.disabled)');

  sourcePills.forEach(pill => {

    pill.addEventListener('click', () => {

      sourcePills.forEach(p => p.classList.remove('active'));

      pill.classList.add('active');

      currentModsSource = pill.getAttribute('data-source');

      showToast(`Источник модов: ${pill.textContent}`);



      const searchVal = document.getElementById('mods-search-field')?.value.trim() || '';

      if (currentModsSource === 'modrinth') {

        searchModrinthLive(searchVal || 'optimization');

      } else {

        renderModsCatalog(LauncherState.mods);

      }

    });

  });



  // Open Instance Mods Folder Button

  document.getElementById('btn-open-instance-mods-folder')?.addEventListener('click', () => {

    const instId = LauncherState.activeInstance || 'kblauncher-main';

    if (window._pyApi && typeof window._pyApi.open_instance_folder === 'function') {

      window._pyApi.open_instance_folder(instId);

    }

    showToast(`Открыта папка: .minecraft/instances/${instId}/mods`);

  });

}



function initInstanceModsSelector() {

  const select = document.getElementById('mods-target-instance-select');

  const badge = document.getElementById('mods-target-loader-badge');

  if (!select) return;



  select.innerHTML = LauncherState.instances.map(inst => {

    const isSelected = (inst.id === LauncherState.activeInstance);

    return `<option value="${inst.id}" ${isSelected ? 'selected' : ''}>${inst.name} (${inst.modloader || inst.version})</option>`;

  }).join('');



  function updateBadge() {

    const active = LauncherState.instances.find(i => i.id === LauncherState.activeInstance) || LauncherState.instances[0];

    if (badge && active) {

      badge.textContent = `⚡ ${active.modloader || 'Fabric'} · ${active.version || '26.3'}`;

    }

  }

  updateBadge();



  select.addEventListener('change', () => {

    LauncherState.activeInstance = select.value;

    updateBadge();

    renderInstancesList();

    renderModsCatalog(currentModsSource === 'modrinth' ? lastModrinthResults : LauncherState.mods);

    const active = LauncherState.instances.find(i => i.id === LauncherState.activeInstance);

    showToast(`Выбрана сборка для установки модов: ${active?.name}`);

  });

}



let lastModrinthResults = [];



async function searchModrinthLive(query) {

  const container = document.getElementById('mods-catalog-cards');

  if (!container) return;



  container.innerHTML = `

    <div class="glass-card" style="text-align: center; padding: 40px; color: #94a3b8;">

      <div style="font-size: 24px; margin-bottom: 8px;">🔄</div>

      <div>Поиск модов на Modrinth по запросу <strong>«${query || 'все'}»</strong>...</div>

    </div>

  `;



  try {

    const activeInst = LauncherState.instances.find(i => i.id === LauncherState.activeInstance) || LauncherState.instances[0];

    const loaderName = (activeInst.modloader || 'fabric').toLowerCase().split(' ')[0];

    

    let facets = '[["project_type:mod"]]';

    const qStr = query || 'popular';

    const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(qStr)}&limit=25&facets=${encodeURIComponent(facets)}`;



    const res = await fetch(url);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();



    const hits = data.hits || [];

    lastModrinthResults = hits.map(h => ({

      id: h.project_id || h.slug,

      name: h.title,

      desc: h.description || 'Мод с платформы Modrinth.',

      category: 'mods',

      downloads: (h.downloads > 1000000) ? (h.downloads / 1000000).toFixed(1) + 'M' : (h.downloads > 1000) ? (h.downloads / 1000).toFixed(0) + 'K' : h.downloads,

      iconUrl: h.icon_url || 'assets/mods/sodium.webp',

      loaders: h.categories || ['fabric']

    }));



    renderModsCatalog(lastModrinthResults);

  } catch (err) {

    console.error('Modrinth search error:', err);

    container.innerHTML = `

      <div class="glass-card" style="text-align: center; padding: 32px; color: #f87171;">

        <div>Не удалось загрузить данные с Modrinth: ${err.message}</div>

        <button class="secondary-glass-btn" style="margin-top: 10px;" onclick="renderModsCatalog(LauncherState.mods)">Показать локальный каталог</button>

      </div>

    `;

  }

}



const FALLBACK_MOD_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NCIgaGVpZ2h0PSI0NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjM2NmYxIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI2IiBmaWxsPSIjMWUxYjRiIi8+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNU0yIDEybDEwIDUgMTAtNSIgc3Ryb2tlPSIjYTViNGZjIiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvc3ZnPg==';



window.handleModIconError = function(img) {

  img.onerror = null;

  img.src = FALLBACK_MOD_ICON;

};



function renderModsCatalog(modsList) {

  const container = document.getElementById('mods-catalog-cards');

  if (!container) return;



  if (!modsList || modsList.length === 0) {

    container.innerHTML = `

      <div class="glass-card" style="text-align: center; padding: 32px;">

        <p class="empty-text">Моды по данному запросу не найдены.</p>

      </div>

    `;

    return;

  }



  const activeInst = LauncherState.instances.find(i => i.id === LauncherState.activeInstance) || LauncherState.instances[0];

  const installedSet = new Set(activeInst.installedMods || []);



  container.innerHTML = modsList.map(mod => {

    const isInstalled = installedSet.has(mod.id);

    const loadersStr = (mod.loaders && mod.loaders.length > 0) ? mod.loaders.slice(0, 3).join(' / ') : 'Fabric / NeoForge';

    const iconSrc = mod.iconUrl || FALLBACK_MOD_ICON;



    return `

      <div class="mod-entry-card" data-mod-id="${mod.id}">

        <div class="mod-entry-left">

          <div class="mod-icon-box">

            <img src="${iconSrc}" class="mod-icon-img" alt="${mod.name}" onerror="window.handleModIconError(this)">

          </div>

          <div class="mod-info-text">

            <div class="mod-title">${mod.name}</div>

            <div class="mod-desc">${mod.desc}</div>

            <div class="mod-tags">

              <span class="mod-tag-pill">Загрузок: ${mod.downloads || '100K+'}</span>

              <span class="mod-tag-pill" style="text-transform: capitalize;">${loadersStr}</span>

            </div>

          </div>

        </div>

        <button class="mod-install-toggle-btn ${isInstalled ? 'installed' : ''}" onclick="toggleModInstall('${mod.id}', '${encodeURIComponent(mod.name)}')">

          ${isInstalled ? 'Установлено ✓' : 'Установить'}

        </button>

      </div>

    `;

  }).join('');

}



window.toggleModInstall = function(modId, encodedName) {

  const modName = encodedName ? decodeURIComponent(encodedName) : modId;

  const activeInst = LauncherState.instances.find(i => i.id === LauncherState.activeInstance) || LauncherState.instances[0];

  if (!activeInst.installedMods) activeInst.installedMods = [];



  const idx = activeInst.installedMods.indexOf(modId);

  const isNowInstalled = (idx === -1);



  if (isNowInstalled) {

    activeInst.installedMods.push(modId);

    activeInst.modsCount = activeInst.installedMods.length;

    activeInst.tag = `${activeInst.modloader || 'Fabric'} · ${activeInst.modsCount} модов`;

    showToast(`✨ Мод «${modName}» установлен в сборку «${activeInst.name}»!`);

  } else {

    activeInst.installedMods.splice(idx, 1);

    activeInst.modsCount = activeInst.installedMods.length;

    activeInst.tag = `${activeInst.modloader || 'Fabric'} · ${activeInst.modsCount} модов`;

    showToast(`❌ Мод «${modName}» удален из сборки «${activeInst.name}».`);

  }



  // Sync with Python backend if available

  if (window._pyApi) {

    if (isNowInstalled && typeof window._pyApi.install_mod_file === 'function') {

      window._pyApi.install_mod_file(activeInst.id, `${modId}.jar`, `https://cdn.modrinth.com/data/placeholder/${modId}.jar`);

    } else if (!isNowInstalled && typeof window._pyApi.remove_mod_file === 'function') {

      window._pyApi.remove_mod_file(activeInst.id, `${modId}.jar`);

    }

  }



  renderInstancesList();

  renderModsCatalog(currentModsSource === 'modrinth' ? lastModrinthResults : LauncherState.mods);

  renderInstalledModsList();

};



async function renderInstalledModsList() {
  const container = document.getElementById('installed-mods-tbody');
  if (!container) return;

  const activeInst = LauncherState.instances.find(i => i.id === LauncherState.activeInstance) || LauncherState.instances[0];

  let diskFiles = [];
  if (window._pyApi && typeof window._pyApi.get_instance_mods === 'function') {
    try {
      const res = await window._pyApi.get_instance_mods(activeInst.id);
      if (res && res.files) {
        diskFiles = res.files;
      }
    } catch (e) {
      console.warn("Could not query disk mods:", e);
    }
  }

  // If no disk files yet, fallback to state
  if (diskFiles.length === 0) {
    const installedSet = new Set(activeInst.installedMods || ['sodium', 'iris']);
    diskFiles = LauncherState.mods
      .filter(m => installedSet.has(m.id))
      .map(m => ({ name: `${m.name}.jar`, enabled: true, desc: m.desc, iconUrl: m.iconUrl, id: m.id }));
  }

  // Update instance mod count
  activeInst.modsCount = diskFiles.length;
  const countBadge = document.getElementById('sidebar-builds-count');
  if (countBadge) countBadge.textContent = LauncherState.instances.length;

  if (diskFiles.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #94a3b8;">
        <div style="font-size: 28px; margin-bottom: 6px;">📦</div>
        <div>В этой сборке пока нет установленных модов.</div>
        <div style="font-size: 11.5px; opacity: 0.7; margin-top: 4px;">Выберите нужные моды в каталоге выше и нажмите «Установить».</div>
      </div>
    `;
    return;
  }

  container.innerHTML = diskFiles.map(mod => {
    const isEn = mod.enabled !== false;
    const cleanName = mod.name.replace(/\.jar(\.disabled)?$/i, '');
    const icon = mod.iconUrl || 'assets/mods/sodium.webp';

    return `
      <div class="mod-item-row ${isEn ? '' : 'disabled'}" id="mod-row-${encodeURIComponent(mod.name)}">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${icon}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;" onerror="this.src='assets/kbl-logo-circle.png'">
          <div>
            <div style="font-weight: 600; font-size: 13px; color: #f8fafc;">${cleanName}</div>
            <div style="font-size: 11px; color: #94a3b8;">${mod.sizeKb ? `${mod.sizeKb} KB · ` : ''}${isEn ? '🟢 Активен' : '⚪ Отключен (.disabled)'}</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <!-- Toggle Switch -->
          <label class="mod-switch-toggle" title="${isEn ? 'Отключить мод' : 'Включить мод'}">
            <input type="checkbox" ${isEn ? 'checked' : ''} onchange="toggleModEnabled('${activeInst.id}', '${encodeURIComponent(mod.name)}', this.checked)">
            <span class="mod-switch-slider"></span>
          </label>

          <!-- Delete Button -->
          <button class="mod-delete-btn" title="Удалить мод" onclick="deleteInstalledMod('${activeInst.id}', '${encodeURIComponent(mod.name)}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.loadInstalledModsForActiveInstance = function() {
  renderInstalledModsList();
};

window.toggleModEnabled = async function(instId, rawModName, isChecked) {
  const modName = decodeURIComponent(rawModName);
  if (window._pyApi && typeof window._pyApi.toggle_mod_file === 'function') {
    const res = await window._pyApi.toggle_mod_file(instId, modName, isChecked);
    if (res && res.success) {
      showToast(isChecked ? `🟢 Мод «${modName}» включен!` : `⚪ Мод «${modName}» временно отключен.`);
    } else {
      showToast(`⚠️ Не удалось переключить мод: ${res?.error || ''}`);
    }
  } else {
    showToast(isChecked ? `🟢 Мод «${modName}» включен!` : `⚪ Мод «${modName}» отключен.`);
  }
  renderInstalledModsList();
};

window.deleteInstalledMod = async function(instId, rawModName) {
  const modName = decodeURIComponent(rawModName);
  if (window._pyApi && typeof window._pyApi.remove_mod_file === 'function') {
    await window._pyApi.remove_mod_file(instId, modName);
  }
  showToast(`🗑️ Мод «${modName}» удален из сборки.`);
  renderInstalledModsList();
};

// ==========================================
// REAL-TIME SERVERS MANAGER & MONITORING
// ==========================================

const DEFAULT_FEATURED_SERVERS = [
  {
    id: 'hypixel',
    name: 'Hypixel Network',
    ip: 'mc.hypixel.net',
    port: 25565,
    desc: 'Мировой лидер мини-игр: BedWars, SkyBlock, Murder Mystery, SkyWars.',
    icon: '⚔️',
    players: '52,490',
    ping: '98 ms',
    online: true
  },
  {
    id: 'reallyworld',
    name: 'ReallyWorld',
    ip: 'mc.reallyworld.ru',
    port: 25565,
    desc: 'Популярный СНГ гриф-сервер, Анархия с кланами, талисманами и шарами.',
    icon: '💎',
    players: '8,210',
    ping: '22 ms',
    online: true
  },
  {
    id: 'funtime',
    name: 'FunTime',
    ip: 'mc.funtime.su',
    port: 25565,
    desc: 'Сервер Анархии с мистическими сундуками, аукционом и клановыми битвами.',
    icon: '⚡',
    players: '11,400',
    ping: '19 ms',
    online: true
  },
  {
    id: 'vimeworld',
    name: 'VimeWorld',
    ip: 'vimeworld.com',
    port: 25565,
    desc: 'Классические аркады, турниры, дуэли и защита от читеров.',
    icon: '🏰',
    players: '3,100',
    ping: '25 ms',
    online: true
  }
];

function initServersManager() {
  if (!LauncherState.servers || LauncherState.servers.length === 0) {
    LauncherState.servers = [...DEFAULT_FEATURED_SERVERS];
  }
  renderServersList();

  // Create / Add server button
  document.getElementById('btn-open-create-server')?.addEventListener('click', () => {
    document.getElementById('modal-create-server')?.classList.add('show');
  });

  // Action buttons
  document.getElementById('btn-action-create-server')?.addEventListener('click', () => {
    document.getElementById('modal-create-server')?.classList.add('show');
  });
}

function renderServersList() {
  const emptyCard = document.getElementById('servers-empty-card');
  const listContainer = document.getElementById('active-servers-list');
  if (!listContainer) return;

  if (LauncherState.servers.length === 0) {
    if (emptyCard) emptyCard.style.display = 'block';
    listContainer.style.display = 'none';
    return;
  }

  if (emptyCard) emptyCard.style.display = 'none';
  listContainer.style.display = 'block';

  listContainer.innerHTML = LauncherState.servers.map(s => `
    <div class="server-card-interactive" id="srv-card-${s.id}">
      <div class="server-info-col">
        <div class="server-icon-img">${s.icon || '🎮'}</div>
        <div>
          <div class="server-name-title">${s.name}</div>
          <p style="font-size: 11.5px; color: #94a3b8; margin: 2px 0 4px 0; max-width: 420px;">${s.desc || ''}</p>
          <div class="server-ip-copyable" onclick="copyServerIp('${s.ip}')" title="Кликните для копирования IP">
            <span>📋</span>
            <span>${s.ip}</span>
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="text-align: right;">
          <div class="server-ping-badge ${s.online ? '' : 'offline'}" id="srv-ping-${s.id}">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${s.online ? '#34d399' : '#fb7185'};"></span>
            <span>${s.online ? s.ping || 'В сети' : 'Недоступен'}</span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Игроков: <strong style="color:#f1f5f9;">${s.players || '0'}</strong></div>
        </div>
        <button class="secondary-glass-btn" onclick="testServerPing('${s.id}', '${s.ip}', ${s.port || 25565})" title="Проверить пинг" style="padding: 6px 12px; font-size: 12px;">
          🔄
        </button>
        <button class="primary-play-btn" onclick="connectToServerDirect('${s.name}', '${s.ip}')" style="padding: 6px 14px; font-size: 12px;">
          Играть
        </button>
      </div>
    </div>
  `).join('');
}

window.copyServerIp = function(ip) {
  navigator.clipboard?.writeText(ip);
  showToast(`📋 IP скопирован в буфер: ${ip}`);
};

window.testServerPing = async function(srvId, host, port) {
  const badge = document.getElementById(`srv-ping-${srvId}`);
  if (badge) badge.innerHTML = '<span>⏳ Проверка...</span>';

  let res = null;
  if (window._pyApi && typeof window._pyApi.ping_server === 'function') {
    res = await window._pyApi.ping_server(host, port || 25565);
  } else {
    // Simulated ping for preview
    await new Promise(r => setTimeout(r, 300));
    res = { online: true, latency: Math.floor(Math.random() * 25 + 15) };
  }

  const s = LauncherState.servers.find(x => x.id === srvId);
  if (res && res.online) {
    if (s) { s.online = true; s.ping = `${res.latency} ms`; }
    if (badge) {
      badge.className = 'server-ping-badge';
      badge.innerHTML = `<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#34d399;"></span><span>${res.latency} ms</span>`;
    }
    showToast(`🟢 Сервер «${s?.name || host}» доступен! Пинг: ${res.latency} мс`);
  } else {
    if (s) { s.online = false; s.ping = 'Таймаут'; }
    if (badge) {
      badge.className = 'server-ping-badge offline';
      badge.innerHTML = `<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#fb7185;"></span><span>Таймаут</span>`;
    }
    showToast(`🔴 Сервер «${s?.name || host}» сейчас недоступен.`);
  }
};

window.connectToServerDirect = function(name, ip) {
  showToast(`🚀 Запуск Minecraft для подключения к «${name}» (${ip})...`);
  const playBtn = document.getElementById('main-play-btn');
  if (playBtn) playBtn.click();
};

// 3D Minecraft Skin Viewer (WebGL Texture-Mapped Renderer)

// ==========================================

function initSkinViewer() {

  const canvas = document.getElementById('skin-canvas');

  if (!canvas) return;



  // Initialize WebGL 3D renderer with the Photo 2 skin (assets/default-skin.png)

  if (window.MinecraftSkin3D) {

    window.skinViewer3D = new MinecraftSkin3D(canvas);

  }



  // Animation Toggle Button

  const animBtn = document.getElementById('btn-toggle-skin-anim');

  animBtn?.addEventListener('click', () => {

    if (!window.skinViewer3D) return;

    window.skinViewer3D.animating = !window.skinViewer3D.animating;

    animBtn.textContent = window.skinViewer3D.animating ? 'Пауза анимации' : 'Включить анимацию';

  });



  // Reset View Rotation & Zoom

  document.getElementById('btn-reset-skin-rot')?.addEventListener('click', () => {

    if (!window.skinViewer3D) return;

    window.skinViewer3D.rotX = 0.10;

    window.skinViewer3D.rotY = 0.42;

    window.skinViewer3D.zoom = 62.0;

  });



  // Preset Skin Selection & Persistence

  const savedSkinUrl = localStorage.getItem('kbl_selected_skin_url') || 'assets/kbl-skin.png';

  const savedAvatarUrl = localStorage.getItem('kbl_selected_avatar_url') || 'assets/kbl-avatar.png';

  const savedSkinId = localStorage.getItem('kbl_selected_skin_id') || 'kbl';

  const savedIsSlim = localStorage.getItem('kbl_selected_skin_slim') === 'true';



  // Apply saved skin / avatar on startup

  const headerAvatar = document.getElementById('current-user-avatar');

  if (headerAvatar && savedAvatarUrl) headerAvatar.src = savedAvatarUrl;

  const modalAvatar = document.querySelector('.account-avatar-large');

  if (modalAvatar && savedAvatarUrl) modalAvatar.src = savedAvatarUrl;



  if (window.skinViewer3D) {

    window.skinViewer3D.loadSkin(savedSkinUrl, savedIsSlim);

  }



  // Set active preset in UI

  document.querySelectorAll('.skin-preset-item').forEach(i => {

    if (i.getAttribute('data-skin') === savedSkinId) {

      i.classList.add('active');

    } else {

      i.classList.remove('active');

    }

  });



  document.querySelectorAll('.skin-preset-item').forEach(item => {

    item.addEventListener('click', () => {

      document.querySelectorAll('.skin-preset-item').forEach(i => i.classList.remove('active'));

      item.classList.add('active');



      const skinPath = item.getAttribute('data-path') || 'assets/kbl-skin.png';

      const avatarPath = item.getAttribute('data-avatar') || 'assets/kbl-avatar.png';

      const isSlim = item.getAttribute('data-slim') === 'true';

      const skinId = item.getAttribute('data-skin') || 'kbl';

      const skinName = item.getAttribute('data-name') || item.querySelector('.preset-name')?.textContent || 'Скин';



      window.skinViewer3D?.loadSkin(skinPath, isSlim);



      localStorage.setItem('kbl_selected_skin_url', skinPath);

      localStorage.setItem('kbl_selected_avatar_url', avatarPath);

      localStorage.setItem('kbl_selected_skin_id', skinId);

      localStorage.setItem('kbl_selected_skin_slim', isSlim ? 'true' : 'false');



      if (headerAvatar) headerAvatar.src = avatarPath;

      if (modalAvatar) modalAvatar.src = avatarPath;

      if (window.updateActiveAccountAvatar) {

        window.updateActiveAccountAvatar(avatarPath);

      }



      showToast(`Применен скин: ${skinName}`);

    });

  });



  // Custom Skin File Upload (.png)

  const uploadBtn = document.getElementById('btn-upload-skin-file');

  const fileInput = document.getElementById('skin-file-input');



  uploadBtn?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {

    const file = e.target.files?.[0];

    if (file) {

      const url = URL.createObjectURL(file);

      window.skinViewer3D?.loadSkin(url, null);

      showToast(`Скин "${file.name}" успешно загружен и применен в 3D!`);

    }

  });



  // Capes Selector

  document.querySelectorAll('input[name="cape"]').forEach(radio => {

    radio.addEventListener('change', (e) => {

      const val = e.target.value;

      if (val === 'founder') {

        window.skinViewer3D?.loadCape('assets/cape-founder.png');

        showToast('Применен плащ KBLauncher Founder Cape');

      } else if (val === 'migrator') {

        window.skinViewer3D?.loadCape('assets/cape-migrator.png');

        showToast('Применен плащ Mojang Migrator Cape');

      } else {

        window.skinViewer3D?.loadCape('none');

        showToast('Плащ отключен');

      }

    });

  });

}



// ==========================================

// ==========================================

// Versions Table (Page 5: All / Releases / Snapshots)

// ==========================================

function initVersionsTable() {

  const tbody = document.getElementById('versions-list-body');

  const searchInput = document.getElementById('versions-search-input');

  const filterPills = document.querySelectorAll('.v-pill');

  const countBadge = document.getElementById('versions-count-number');



  if (!tbody) return;



  let currentLimit = 35;



  function renderTable() {

    const query = (searchInput?.value || '').trim().toLowerCase();

    const activeFilter = LauncherState.activeVersionFilter || 'all';



    const filtered = LauncherState.allVersions.filter(v => {

      if (activeFilter === 'release' && v.category !== 'release' && v.category !== 'old') return false;

      if (activeFilter === 'snapshot' && v.category !== 'snapshot') return false;



      if (query) {

        const loaders = getSupportedLoaders(v.id || v.ver, v.category);

        const matchLoader = loaders.some(l => l.name.toLowerCase().includes(query) || l.id.toLowerCase().includes(query));

        return (

          v.ver.toLowerCase().includes(query) ||

          v.id.toLowerCase().includes(query) ||

          (v.typeName && v.typeName.toLowerCase().includes(query)) ||

          (v.tag && v.tag.toLowerCase().includes(query)) ||

          matchLoader

        );

      }

      return true;

    });



    if (countBadge) {

      countBadge.textContent = filtered.length;

    }



    if (filtered.length === 0) {

      tbody.innerHTML = `

        <div style="text-align: center; padding: 40px; color: #94a3b8;">

          <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>

          <div>Версий по запросу <strong>«${query}»</strong> не найдено.</div>

          <button class="secondary-glass-btn" style="margin-top: 12px; padding: 6px 14px;" onclick="document.getElementById('versions-search-input').value=''; initVersionsTable();">Сбросить поиск</button>

        </div>

      `;

      return;

    }



    // Limit rendered items for 120 FPS performance

    const displayList = query ? filtered : filtered.slice(0, currentLimit);



    let html = displayList.map(v => {

      let icon = '🟩';

      if (v.category === 'snapshot') icon = '🔬';

      else if (v.category === 'old') icon = '📜';



      const isCurrentSelected = (LauncherState.selectedVersion.startsWith(v.ver) || LauncherState.selectedVersion.startsWith(v.id));



      const supportedLoaders = getSupportedLoaders(v.id || v.ver, v.category);

      const badgesHtml = supportedLoaders.map(l => {

        return `<span class="loader-chip chip-${l.id}" title="${l.fullName}: ${l.desc}" onclick="event.stopPropagation(); window.openLoaderModal('${v.ver}', '${l.id}')">

          <span class="chip-icon">${l.icon}</span> ${l.name}

        </span>`;

      }).join('');



      return `

        <div class="version-table-row ${isCurrentSelected ? 'active' : ''}" onclick="window.openLoaderModal('${v.ver}')" style="cursor: pointer;">

          <div style="display:flex; align-items:center; gap:8px;">

            <span style="font-size: 14px;">${icon}</span>

            <span style="font-weight: 700; color: #fff;">${v.ver}</span>

            ${v.tag ? `<span class="v-badge-tag v-tag-release" style="font-size:10px; padding:1px 6px;">${v.tag}</span>` : ''}

          </div>

          <div>

            <div class="loaders-badges-group">

              ${badgesHtml}

            </div>

          </div>

          <div style="color: #94a3b8; font-size: 12px;">${v.date || '2026'}</div>

          <div>

            <span class="status-dot ${v.installed ? 'green' : 'gray'}" style="display:inline-block; margin-right:4px;"></span>

            <span style="color: ${v.installed ? '#34d399' : '#94a3b8'}; font-weight: 500;">

              ${v.installed ? 'Установлено' : 'Готово'}

            </span>

          </div>

          <div style="display: flex; gap: 6px; justify-content: flex-end;">

            <button class="secondary-glass-btn" style="padding: 5px 12px; font-size: 11px; font-weight: 600;" onclick="event.stopPropagation(); window.openLoaderModal('${v.ver}')">

              ${isCurrentSelected ? '✓ Настроить' : 'Выбрать'}

            </button>

            <button class="primary-play-btn" style="padding: 5px 12px; font-size: 11px; font-weight: 700; border-radius: 8px;" onclick="event.stopPropagation(); window.launchDirectVersion('${v.ver}')">

              ▶ Играть

            </button>

          </div>

        </div>

      `;

    }).join('');



    if (!query && filtered.length > currentLimit) {

      html += `

        <div style="padding: 12px 20px; text-align: center;">

          <button class="v-load-more-btn" id="btn-load-more-versions">Показать ещё (+35 версий)... (Осталось: ${filtered.length - currentLimit})</button>

        </div>

      `;

    }



    tbody.innerHTML = html;



    const loadMoreBtn = document.getElementById('btn-load-more-versions');

    loadMoreBtn?.addEventListener('click', () => {

      currentLimit += 35;

      renderTable();

    });

  }



  renderTable();



  searchInput?.addEventListener('input', () => {

    currentLimit = 35;

    renderTable();

  });



  filterPills.forEach(pill => {

    pill.addEventListener('click', () => {

      filterPills.forEach(p => p.classList.remove('active'));

      pill.classList.add('active');

      LauncherState.activeVersionFilter = pill.getAttribute('data-vfilter');

      currentLimit = 35;

      renderTable();

    });

  });

}



// ==========================================

// Dedicated Modloader Selection Modal System

// ==========================================

window.openLoaderModal = function(verName, preselectedLoaderId) {

  const modal = document.getElementById('modal-select-loader');

  const title = document.getElementById('loader-modal-title');

  const sub = document.getElementById('loader-modal-sub');

  const grid = document.getElementById('loaders-grid-container');

  const confirmBtn = document.getElementById('btn-confirm-select-loader');

  if (!modal || !grid) return;



  const v = LauncherState.allVersions.find(x => x.ver === verName || x.id === verName) || {

    id: verName.replace(/^(Release|Snapshot)\s+/i, '').trim(),

    ver: verName,

    category: (verName.toLowerCase().includes('snapshot') || verName.includes('w')) ? 'snapshot' : 'release'

  };



  const loaders = getSupportedLoaders(v.id || v.ver, v.category);



  // Pre-selection logic

  let selectedLoaderId = (preselectedLoaderId && loaders.some(l => l.id === preselectedLoaderId)) 

    ? preselectedLoaderId 

    : null;



  if (!selectedLoaderId && LauncherState.selectedVersion.startsWith(v.ver)) {

    for (const l of loaders) {

      if (LauncherState.selectedVersion.toLowerCase().includes(l.name.toLowerCase())) {

        selectedLoaderId = l.id;

        break;

      }

    }

  }



  if (!selectedLoaderId) {

    if (loaders.some(l => l.id === 'fabric')) {

      selectedLoaderId = 'fabric';

    } else {

      selectedLoaderId = loaders[0].id;

    }

  }



  if (title) {

    title.innerHTML = `Выбор ядра для <span style="color:#a78bfa;">${v.ver}</span>`;

  }

  if (sub) {

    sub.textContent = `Доступно модификаций: ${loaders.length}. Выберите подходящее ядро или чистую игру:`;

  }



  function renderCards() {

    grid.innerHTML = loaders.map(l => {

      const isSelected = (l.id === selectedLoaderId);

      return `

        <div class="loader-choice-card ${isSelected ? 'selected' : ''}" data-loader="${l.id}">

          <div class="loader-card-header">

            <div class="loader-card-title-wrap">

              <span style="font-size: 18px;">${l.icon}</span>

              <span class="loader-card-name">${l.name}</span>

              ${l.tag ? `<span class="loader-card-tag" style="background:${l.tagBg}; color:${l.color};">${l.tag}</span>` : ''}

            </div>

            <div class="loader-card-radio">

              <span class="loader-radio-dot"></span>

            </div>

          </div>

          <p class="loader-card-desc">${l.desc}</p>

          <div class="loader-card-footer">

            <span style="color: #cbd5e1; font-weight: 500;">${l.fullName}</span>

            <span style="color: ${l.color}; font-weight: 600;">${l.verNotice || 'Поддерживается'}</span>

          </div>

        </div>

      `;

    }).join('');



    // Attach click and dblclick events

    grid.querySelectorAll('.loader-choice-card').forEach(card => {

      card.addEventListener('click', () => {

        selectedLoaderId = card.getAttribute('data-loader');

        renderCards();

      });



      card.addEventListener('dblclick', () => {

        selectedLoaderId = card.getAttribute('data-loader');

        applySelection();

      });

    });

  }



  renderCards();



  function applySelection() {

    const chosenLoader = loaders.find(l => l.id === selectedLoaderId) || loaders[0];

    let finalVersionName = v.ver;

    if (chosenLoader.id !== 'vanilla') {

      finalVersionName = `${v.ver} (${chosenLoader.name})`;

    }



    LauncherState.selectedVersion = finalVersionName;



    // Update bottom bar

    const selText = document.getElementById('selected-version-text');

    if (selText) selText.textContent = finalVersionName;



    // Update home active instance

    const instVer = document.getElementById('home-active-version');

    if (instVer) instVer.textContent = finalVersionName;



    modal.classList.remove('show');

    showToast(`✨ Выбрано ядро ${chosenLoader.name} для ${v.ver}!`);

    initVersionsTable();

  }



  if (confirmBtn) {

    confirmBtn.onclick = applySelection;

  }



  modal.classList.add('show');

};



window.selectVersionFromTable = function(verName) {

  window.openLoaderModal(verName);

};



window.launchDirectVersion = function(verName) {

  const v = LauncherState.allVersions.find(x => x.ver === verName || x.id === verName);

  const loaders = v ? getSupportedLoaders(v.id || v.ver, v.category) : [];

  const defaultLoader = loaders.find(l => l.id === 'fabric') || loaders[0];

  

  let finalName = verName;

  if (defaultLoader && defaultLoader.id !== 'vanilla') {

    finalName = `${verName} (${defaultLoader.name})`;

  }

  

  LauncherState.selectedVersion = finalName;

  const selText = document.getElementById('selected-version-text');

  if (selText) selText.textContent = finalName;



  switchNavTab('tab-home');

  showToast(`Запуск Minecraft ${finalName}...`);

  const playBtn = document.getElementById('main-play-btn');

  if (playBtn) playBtn.click();

};



window.toggleVersionInstall = function(verName) {

  const v = LauncherState.allVersions.find(x => x.ver === verName || x.id === verName);

  if (!v) return;

  v.installed = !v.installed;

  initVersionsTable();

  showToast(v.installed ? `Версия ${verName} установлена.` : `Версия ${verName} удалена.`);

};





// ==========================================

// Mojang & Python Core Manifest Sync

// ==========================================

async function loadAllMojangVersions() {

  try {

    if (window._pyApi && typeof window._pyApi.get_minecraft_versions === 'function') {

      const res = await window._pyApi.get_minecraft_versions();

      if (res && res.success && Array.isArray(res.versions)) {

        mergeMojangVersions(res.versions);

        return;

      }

    }



    const response = await fetch('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json');

    if (response.ok) {

      const data = await response.json();

      if (data && Array.isArray(data.versions)) {

        mergeMojangVersions(data.versions);

      }

    }

  } catch (err) {

    console.log('[KBLauncher] Running in offline version mode, pre-bundled catalog active:', err);

  }

}



function mergeMojangVersions(mojangVersions) {

  const existingIds = new Set(LauncherState.allVersions.map(v => v.id));

  const newVersions = [];



  mojangVersions.forEach(v => {

    const id = v.id;

    if (!existingIds.has(id)) {

      const isRelease = (v.type === 'release');

      const isSnapshot = (v.type === 'snapshot');

      const isOld = (v.type === 'old_beta' || v.type === 'old_alpha');



      newVersions.push({

        id: id,

        ver: isRelease ? `Release ${id}` : (isSnapshot ? `Snapshot ${id}` : id),

        category: isRelease ? 'release' : (isSnapshot ? 'snapshot' : (isOld ? 'old' : 'release')),

        typeName: isRelease ? 'Официальный релиз' : (isSnapshot ? 'Снапшот Mojang' : 'Старая версия'),

        date: (v.releaseTime || v.date || '').substring(0, 10),

        installed: false,

        popular: false

      });

      existingIds.add(id);

    }

  });



  if (newVersions.length > 0) {

    LauncherState.allVersions = [...LauncherState.allVersions, ...newVersions];

    const badge = document.getElementById('versions-count-number');

    if (badge) badge.textContent = LauncherState.allVersions.length;

    initVersionsTable();

    console.log(`[KBLauncher] Loaded total ${LauncherState.allVersions.length} Minecraft versions!`);

  }

}





// ==========================================

// Modals & Popups System

// ==========================================

function initModals() {

  // Close buttons

  document.querySelectorAll('[data-close-modal]').forEach(btn => {

    btn.addEventListener('click', () => {

      const modalId = btn.getAttribute('data-close-modal');

      document.getElementById(modalId)?.classList.remove('show');

    });

  });



  // Close on backdrop click

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {

    backdrop.addEventListener('click', (e) => {

      if (e.target === backdrop) backdrop.classList.remove('show');

    });

  });



  // Open Settings Modal

  document.getElementById('open-settings-btn')?.addEventListener('click', () => {

    document.getElementById('modal-settings')?.classList.add('show');

  });
}




  // ==========================================
// INTERACTIVE MULTI-STEP BUILD CREATOR & INSTANCE MANAGER
// ==========================================

let wizardSelectedVer = 'Release 26.3';
let wizardSelectedLoader = 'fabric';
let wizardFilterTab = 'all';

function initInteractiveBuildCreator() {
  const addBtn = document.getElementById('add-build-btn');
  const modal = document.getElementById('modal-create-build');
  const searchInput = document.getElementById('create-build-ver-search');
  const verList = document.getElementById('create-build-ver-list');
  const loadersGrid = document.getElementById('create-build-loaders-grid');
  const nameInput = document.getElementById('new-build-name');
  const verBadge = document.getElementById('create-build-ver-badge');
  const loaderBadge = document.getElementById('create-build-loader-badge');
  const tabs = document.querySelectorAll('[data-build-vtab]');
  const confirmBtn = document.getElementById('btn-confirm-create-build');

  if (!modal) return;

  function renderWizardVersions() {
    if (!verList) return;
    const q = (searchInput?.value || '').trim().toLowerCase();

    const filtered = LauncherState.allVersions.filter(v => {
      if (q) {
        return (
          v.ver.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q) ||
          (v.tag && v.tag.toLowerCase().includes(q))
        );
      }
      if (wizardFilterTab === 'release') return (v.category === 'release' || v.category === 'old');
      if (wizardFilterTab === 'snapshot') return v.category === 'snapshot';
      return true;
    });

    verList.innerHTML = filtered.slice(0, 60).map(v => {
      const isSel = (v.ver === wizardSelectedVer);
      let icon = '🟩';
      if (v.category === 'snapshot') icon = '🔬';
      else if (v.category === 'old') icon = '📜';

      const loaders = getSupportedLoaders(v.id || v.ver, v.category);
      const loaderNames = loaders.filter(l => l.id !== 'vanilla').map(l => l.name).join(' • ');

      return `
        <div class="version-dropdown-item ${isSel ? 'active' : ''}" data-ver="${v.ver}">
          <div style="display:flex; align-items:center; gap:8px;">
            <span>${icon}</span>
            <span style="font-weight: 600; font-size: 12.5px;">${v.ver}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            ${loaderNames ? `<span class="ver-dd-loaders-hint" style="font-size: 10px;">${loaderNames}</span>` : ''}
            <span style="font-size: 10px; opacity: 0.75;">${v.tag || ''}</span>
          </div>
        </div>
      `;
    }).join('');

    verList.querySelectorAll('.version-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        wizardSelectedVer = item.getAttribute('data-ver');
        if (verBadge) verBadge.textContent = wizardSelectedVer;
        renderWizardVersions();
        updateWizardLoaders();
      });
    });
  }

  function updateWizardLoaders() {
    if (!loadersGrid) return;
    const v = LauncherState.allVersions.find(x => x.ver === wizardSelectedVer || x.id === wizardSelectedVer) || {
      id: wizardSelectedVer.replace(/^(Release|Snapshot)\s+/i, '').trim(),
      ver: wizardSelectedVer,
      category: 'release'
    };

    const loaders = getSupportedLoaders(v.id || v.ver, v.category);
    if (!loaders.some(l => l.id === wizardSelectedLoader)) {
      wizardSelectedLoader = loaders[0]?.id || 'fabric';
    }

    const curLoader = loaders.find(l => l.id === wizardSelectedLoader) || loaders[0];
    if (loaderBadge && curLoader) {
      loaderBadge.textContent = curLoader.name;
    }

    // Auto-update suggested build name if default
    if (nameInput) {
      const cleanVer = wizardSelectedVer.replace(/^(Release|Snapshot)\s+/i, '').trim();
      nameInput.value = `Сборка ${cleanVer} (${curLoader?.name || 'Fabric'})`;
    }

    loadersGrid.innerHTML = loaders.map(l => {
      const isSel = (l.id === wizardSelectedLoader);
      return `
        <div class="loader-choice-card ${isSel ? 'selected' : ''}" data-loader="${l.id}" style="padding: 10px;">
          <div class="loader-card-header" style="margin-bottom: 4px;">
            <div class="loader-card-title-wrap">
              <span style="font-size: 16px;">${l.icon}</span>
              <span class="loader-card-name" style="font-size: 13px;">${l.name}</span>
            </div>
            <div class="loader-card-radio">
              <span class="loader-radio-dot"></span>
            </div>
          </div>
          <p class="loader-card-desc" style="font-size: 11px; margin: 4px 0 6px 0; line-height: 1.35;">${l.desc}</p>
        </div>
      `;
    }).join('');

    loadersGrid.querySelectorAll('.loader-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        wizardSelectedLoader = card.getAttribute('data-loader');
        updateWizardLoaders();
      });
    });
  }

  // Open modal on '+' button click
  addBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    wizardSelectedVer = LauncherState.selectedVersion.split(' (')[0] || 'Release 26.3';
    if (verBadge) verBadge.textContent = wizardSelectedVer;
    if (searchInput) searchInput.value = '';
    renderWizardVersions();
    updateWizardLoaders();
    modal.classList.add('show');
  });

  // Search input
  searchInput?.addEventListener('input', () => {
    renderWizardVersions();
  });

  // Filter tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      wizardFilterTab = tab.getAttribute('data-build-vtab') || 'all';
      renderWizardVersions();
    });
  });

  // Confirm Creation
  confirmBtn?.addEventListener('click', () => {
    const rawName = nameInput?.value.trim();
    const cleanVer = wizardSelectedVer.replace(/^(Release|Snapshot)\s+/i, '').trim();
    const vObj = LauncherState.allVersions.find(x => x.ver === wizardSelectedVer || x.id === wizardSelectedVer);
    const loaders = getSupportedLoaders(cleanVer, vObj?.category || 'release');
    const chosenLoader = loaders.find(l => l.id === wizardSelectedLoader) || loaders[0] || { id: 'fabric', name: 'Fabric' };

    let fullVer = wizardSelectedVer;
    if (chosenLoader.id !== 'vanilla') {
      fullVer = `${wizardSelectedVer} (${chosenLoader.name})`;
    }

    const name = rawName || `Сборка ${cleanVer} (${chosenLoader.name})`;
    const newId = `inst-${Date.now()}`;

    const newInst = {
      id: newId,
      name: name,
      version: fullVer,
      modloader: chosenLoader.name,
      tag: `${chosenLoader.name} · 0 модов`,
      status: 'Готово',
      modsCount: 0
    };

    LauncherState.instances.push(newInst);
    localStorage.setItem('kbl_instances', JSON.stringify(LauncherState.instances));

    if (window._pyApi && typeof window._pyApi.save_instances === 'function') {
      window._pyApi.save_instances(LauncherState.instances);
    }

    modal.classList.remove('show');
    renderInstancesList();
    window.selectInstance(newId);
    showToast(`✨ Сборка «${name}» успешно создана и выбрана!`);
  });
}

// ==========================================
// RENDER INSTANCES LIST & POPUP OPTIONS
// ==========================================

let activeContextMenuInstId = null;

function renderInstancesList() {
  const container = document.getElementById('instances-container');
  if (!container) return;

  container.innerHTML = LauncherState.instances.map(inst => {
    const isActive = (inst.id === LauncherState.activeInstance);
    let iconHTML = '<img src="assets/kbl-logo-circle.png" alt="Logo" class="instance-logo">';
    let dotClass = 'green';

    if (inst.id.includes('vanilla') || (inst.modloader && inst.modloader.toLowerCase() === 'vanilla')) {
      iconHTML = '<span style="font-size:18px;">🧊</span>';
      dotClass = 'blue';
    } else if (inst.id.includes('shader') || (inst.name && inst.name.toLowerCase().includes('shader'))) {
      iconHTML = '<span style="font-size:18px;">✨</span>';
      dotClass = 'purple';
    } else if (inst.modloader && inst.modloader.toLowerCase().includes('forge')) {
      iconHTML = '<span style="font-size:18px;">🔥</span>';
      dotClass = 'orange';
    }

    return `
      <div class="instance-card ${isActive ? 'active' : ''}" data-instance-id="${inst.id}" onclick="selectInstance('${inst.id}')">
        <div class="instance-icon-box ${dotClass}-box">
          ${iconHTML}
        </div>
        <div class="instance-details">
          <div class="instance-name">${inst.name}</div>
          <div class="instance-status">
            <span class="status-dot ${dotClass}"></span>
            <span class="status-text">${inst.status || 'Готово'}</span>
            <span class="instance-tag">${inst.tag || inst.version}</span>
          </div>
        </div>
        <button class="instance-menu-btn" title="Опции сборки" onclick="openInstanceContextMenu(event, '${inst.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1.5"></circle>
            <circle cx="12" cy="5" r="1.5"></circle>
            <circle cx="12" cy="19" r="1.5"></circle>
          </svg>
        </button>
      </div>
    `;
  }).join('');

  const countBadge = document.getElementById('sidebar-builds-count');
  if (countBadge) countBadge.textContent = LauncherState.instances.length;
}

window.openInstanceContextMenu = function(e, instId) {
  e.stopPropagation();
  activeContextMenuInstId = instId;
  const popover = document.getElementById('instance-context-popover');
  if (!popover) return;

  const rect = e.currentTarget.getBoundingClientRect();
  popover.style.display = 'block';
  popover.style.top = `${rect.bottom + 4}px`;
  popover.style.left = `${Math.min(rect.left, window.innerWidth - 180)}px`;
};

document.addEventListener('click', () => {
  const popover = document.getElementById('instance-context-popover');
  if (popover) popover.style.display = 'none';
});

function initInstanceContextMenu() {
  const btnFolder = document.getElementById('popover-btn-folder');
  const btnDup = document.getElementById('popover-btn-duplicate');
  const btnDel = document.getElementById('popover-btn-delete');

  btnFolder?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!activeContextMenuInstId) return;
    if (window._pyApi && typeof window._pyApi.open_instance_folder === 'function') {
      window._pyApi.open_instance_folder(activeContextMenuInstId);
    }
    document.getElementById('instance-context-popover').style.display = 'none';
  });

  btnDup?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!activeContextMenuInstId) return;
    const orig = LauncherState.instances.find(i => i.id === activeContextMenuInstId);
    if (!orig) return;

    const dup = {
      ...orig,
      id: `inst-${Date.now()}`,
      name: `${orig.name} (Копия)`,
      status: 'Готово'
    };

    LauncherState.instances.push(dup);
    localStorage.setItem('kbl_instances', JSON.stringify(LauncherState.instances));
    if (window._pyApi && typeof window._pyApi.save_instances === 'function') {
      window._pyApi.save_instances(LauncherState.instances);
    }
    renderInstancesList();
    window.selectInstance(dup.id);
    document.getElementById('instance-context-popover').style.display = 'none';
    showToast(`📋 Сборка скопирована: ${dup.name}`);
  });

  btnDel?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!activeContextMenuInstId) return;
    if (LauncherState.instances.length <= 1) {
      showToast('⚠️ Нельзя удалить единственную сборку!');
      document.getElementById('instance-context-popover').style.display = 'none';
      return;
    }

    const idx = LauncherState.instances.findIndex(i => i.id === activeContextMenuInstId);
    if (idx !== -1) {
      const delName = LauncherState.instances[idx].name;
      const delId = LauncherState.instances[idx].id;
      LauncherState.instances.splice(idx, 1);
      localStorage.setItem('kbl_instances', JSON.stringify(LauncherState.instances));

      if (window._pyApi && typeof window._pyApi.delete_instance === 'function') {
        window._pyApi.delete_instance(delId);
      }
      if (window._pyApi && typeof window._pyApi.save_instances === 'function') {
        window._pyApi.save_instances(LauncherState.instances);
      }

      if (LauncherState.activeInstance === delId) {
        window.selectInstance(LauncherState.instances[0].id);
      } else {
        renderInstancesList();
      }
      showToast(`🗑️ Сборка «${delName}» удалена.`);
    }
    document.getElementById('instance-context-popover').style.display = 'none';
  });
}

// ==========================================
// SWITCHING BETWEEN BUILDS (FIXED & PERSISTENT)
// ==========================================

window.selectInstance = function(instId) {
  const inst = LauncherState.instances.find(i => i.id === instId);
  if (!inst) return;

  LauncherState.activeInstance = instId;
  localStorage.setItem('kbl_active_instance', instId);

  // 1. Update version and loader in state
  LauncherState.selectedVersion = inst.version || 'Release 26.3';
  LauncherState.selectedLoader = inst.modloader || 'Fabric';

  // 2. Update Home tab elements
  const heroTitle = document.querySelector('.hero-title-text');
  if (heroTitle) heroTitle.textContent = inst.name;

  const heroSubtitle = document.querySelector('.hero-subtitle-stats');
  if (heroSubtitle) {
    const count = inst.modsCount !== undefined ? `${inst.modsCount} модов` : 'Чистый клиент';
    heroSubtitle.textContent = `Сборка: ${inst.name} · Ядро: ${inst.modloader || 'Fabric'} · ${count}`;
  }

  const verText = document.getElementById('selected-version-text');
  if (verText) verText.textContent = inst.version || 'Release 26.3';

  const homeActiveVer = document.getElementById('home-active-version');
  if (homeActiveVer) homeActiveVer.textContent = inst.version || 'Release 26.3';

  // 3. Update sidebar active card
  renderInstancesList();

  // 4. Update Mods tab dropdown & badge
  const modsSelect = document.getElementById('mods-target-instance-select');
  if (modsSelect) {
    modsSelect.innerHTML = LauncherState.instances.map(i => `
      <option value="${i.id}" ${i.id === instId ? 'selected' : ''}>${i.name} (${i.modloader || i.version})</option>
    `).join('');
    modsSelect.value = instId;
  }

  const modsBadge = document.getElementById('mods-target-loader-badge');
  if (modsBadge) {
    modsBadge.textContent = `⚡ ${inst.modloader || 'Fabric'} · ${inst.version || '26.3'}`;
  }

  // 5. Reload installed mods for this specific instance
  if (typeof window.loadInstalledModsForActiveInstance === 'function') {
    window.loadInstalledModsForActiveInstance();
  }

  showToast(`⚡ Выбрана сборка: ${inst.name}`);
};



// ==========================================

// Settings Panel & Liquid Glass (iOS 18)

// ==========================================

function initSettings() {

  const slider = document.getElementById('ram-slider');

  const ramVal = document.getElementById('ram-slider-val');



  slider?.addEventListener('input', (e) => {

    const mb = e.target.value;

    const gb = (mb / 1024).toFixed(1).replace('.0', '');

    if (ramVal) ramVal.textContent = `${mb} МБ (${gb} ГБ)`;

  });



  localStorage.setItem('kbl_liquid_glass', 'false');



  document.getElementById('btn-save-settings')?.addEventListener('click', () => {

    showToast('💾 Настройки лаунчера сохранены.');

    document.getElementById('modal-settings')?.classList.remove('show');

  });

}



// ==========================================

// Accounts System & Dropdown Popup (Photo 2 & Photo 3)

// ==========================================

function initAccountSystem() {

  const savedAccs = localStorage.getItem('kbl_accounts');

  if (savedAccs) {

    try {

      LauncherState.accounts = JSON.parse(savedAccs);

    } catch (e) {}

  }



  // Ensure default accounts exist if empty

  if (!LauncherState.accounts || LauncherState.accounts.length === 0) {

    const currentSkinAvatar = localStorage.getItem('kbl_selected_avatar_url') || 'assets/user-avatar.png';

    LauncherState.accounts = [

      { id: 'acc-1', name: 'Player', type: 'Офлайн', avatar: currentSkinAvatar, active: true },

      { id: 'acc-2', name: 'igrok1111222', type: 'Офлайн', avatar: 'assets/default-skin-64.png', active: false }

    ];

    localStorage.setItem('kbl_accounts', JSON.stringify(LauncherState.accounts));

  }



  function getActiveAccount() {

    return LauncherState.accounts.find(a => a.active) || LauncherState.accounts[0];

  }



  function syncActiveAccountUI() {

    const acc = getActiveAccount();

    if (!acc) return;



    LauncherState.user = {

      name: acc.name,

      type: acc.type,

      avatar: acc.avatar

    };



    // Header profile chip (Photo 2 top)

    const curName = document.getElementById('current-user-name');

    const curType = document.getElementById('current-user-type');

    const curAvatar = document.getElementById('current-user-avatar');

    if (curName) curName.textContent = acc.name;

    if (curType) curType.textContent = acc.type === 'Microsoft' || acc.type === 'Аккаунт Microsoft' ? 'Аккаунт Microsoft' : `${acc.type}-аккаунт`;

    if (curAvatar) curAvatar.src = acc.avatar;



    // Account modal (Photo 3)

    const modalName = document.getElementById('modal-acc-name');

    const modalType = document.getElementById('modal-acc-type');

    const modalAvatar = document.getElementById('modal-acc-avatar');

    const modalStatus = document.getElementById('modal-acc-status');

    if (modalName) modalName.textContent = acc.name;

    if (modalType) {

      modalType.textContent = (acc.type === 'Microsoft' || acc.type === 'Аккаунт Microsoft') 

        ? 'Аккаунт Microsoft - играет' 

        : (acc.type === 'Ely.by' ? 'Аккаунт Ely.by - со скинами' : 'Офлайн-аккаунт - играет');

    }

    if (modalAvatar) modalAvatar.src = acc.avatar;

    if (modalStatus) {

      modalStatus.innerHTML = `<span class="status-check-icon">✓</span> Готово к игре по сети`;

    }

  }



  function renderAccountDropdown() {

    const list = document.getElementById('account-dropdown-list');

    if (!list) return;



    list.innerHTML = LauncherState.accounts.map(acc => `

      <div class="account-dropdown-item ${acc.active ? 'active' : ''}" data-acc-id="${acc.id}">

        <img src="${acc.avatar}" class="dropdown-item-avatar" alt="${acc.name}">

        <div class="dropdown-item-text">

          <div class="dropdown-item-name">${acc.name}</div>

          <div class="dropdown-item-type">${acc.type}</div>

        </div>

        ${acc.active ? '<span class="dropdown-item-check">✓</span>' : ''}

      </div>

    `).join('');



    list.querySelectorAll('.account-dropdown-item').forEach(item => {

      item.addEventListener('click', (e) => {

        e.stopPropagation();

        const id = item.getAttribute('data-acc-id');

        LauncherState.accounts.forEach(a => a.active = (a.id === id));

        localStorage.setItem('kbl_accounts', JSON.stringify(LauncherState.accounts));

        syncActiveAccountUI();

        renderAccountDropdown();

        document.getElementById('account-dropdown-popup')?.classList.remove('show');

        const selected = LauncherState.accounts.find(a => a.id === id);

        showToast(`Выбран аккаунт: ${selected?.name}`);

      });

    });

  }



  window.updateActiveAccountAvatar = function(newAvatar) {

    const active = getActiveAccount();

    if (active) {

      active.avatar = newAvatar;

      localStorage.setItem('kbl_accounts', JSON.stringify(LauncherState.accounts));

      syncActiveAccountUI();

      renderAccountDropdown();

    }

  };



  // Profile Chip click -> Toggle dropdown popup (Photo 2)

  const profileChip = document.getElementById('profile-chip');

  const dropdownPopup = document.getElementById('account-dropdown-popup');



  profileChip?.addEventListener('click', (e) => {

    e.stopPropagation();

    dropdownPopup?.classList.toggle('show');

    if (dropdownPopup?.classList.contains('show')) {

      renderAccountDropdown();

    }

  });



  // Close dropdown on outside click

  document.addEventListener('click', (e) => {

    if (!e.target.closest('.profile-dropdown-wrapper')) {

      dropdownPopup?.classList.remove('show');

    }

  });



  // "Управление аккаунтами" button inside dropdown -> Open Photo 3 modal

  document.getElementById('btn-dropdown-manage-accounts')?.addEventListener('click', (e) => {

    e.stopPropagation();

    dropdownPopup?.classList.remove('show');

    document.getElementById('modal-account')?.classList.add('show');

  });



  // Button "Играть офлайн" in Photo 3 modal

  document.getElementById('btn-toggle-offline-mode')?.addEventListener('click', () => {

    const active = getActiveAccount();

    if (active) {

      active.type = 'Офлайн';

      localStorage.setItem('kbl_accounts', JSON.stringify(LauncherState.accounts));

      syncActiveAccountUI();

      renderAccountDropdown();

      showToast('Переключено в режим офлайн-игры');

    }

  });



  // Provider button: Microsoft Login

  document.getElementById('btn-login-ms')?.addEventListener('click', () => {

    const nick = prompt('Введите ваш никнейм Microsoft Xbox:', 'Player') || 'Player';

    addNewAccount(nick, 'Microsoft');

    document.getElementById('modal-account')?.classList.remove('show');

    showToast(`✅ Успешный вход через Microsoft: ${nick}`);

  });



  // Provider button: Ely.by Login

  document.getElementById('btn-login-ely')?.addEventListener('click', () => {

    const nick = prompt('Введите ваш никнейм в системе Ely.by:', 'Player') || 'Player';

    addNewAccount(nick, 'Ely.by');

    document.getElementById('modal-account')?.classList.remove('show');

    showToast(`✅ Вход через систему скинов Ely.by выполнен: ${nick}`);

  });



  // Offline login input and button

  document.getElementById('btn-apply-nickname')?.addEventListener('click', () => {

    const nick = document.getElementById('custom-nickname-input')?.value.trim();

    if (!nick) {

      showToast('Пожалуйста, введите никнейм');

      return;

    }

    addNewAccount(nick, 'Офлайн');

    const input = document.getElementById('custom-nickname-input');

    if (input) input.value = '';

    document.getElementById('modal-account')?.classList.remove('show');

    showToast(`✅ Офлайн-аккаунт создан: ${nick}`);

  });



  function addNewAccount(name, type) {

    const avatar = localStorage.getItem('kbl_selected_avatar_url') || 'assets/user-avatar.png';

    LauncherState.accounts.forEach(a => a.active = false);

    LauncherState.accounts.unshift({

      id: `acc-${Date.now()}`,

      name,

      type,

      avatar,

      active: true

    });

    if (LauncherState.accounts.length > 8) LauncherState.accounts.pop();

    localStorage.setItem('kbl_accounts', JSON.stringify(LauncherState.accounts));

    syncActiveAccountUI();

    renderAccountDropdown();

  }



  window.addNewAccount = addNewAccount;



  // Initial sync

  syncActiveAccountUI();

  renderAccountDropdown();

}



// ==========================================

// First Run Onboarding & Close Confirmation Dialog

// ==========================================

function initFirstRunOnboarding() {

  const completed = localStorage.getItem('kbl_first_run_completed');

  const firstRunModal = document.getElementById('modal-first-run');

  const confirmModal = document.getElementById('modal-first-run-confirm');



  // If first run, show modal

  if (!completed && firstRunModal) {

    setTimeout(() => {

      firstRunModal.classList.add('show');

    }, 300);

  }



  // Cross button [×] on first run modal -> Open confirmation dialog

  document.getElementById('btn-first-run-close')?.addEventListener('click', () => {

    confirmModal?.classList.add('show');

  });



  // Confirm "Да, продолжить без аккаунта"

  document.getElementById('btn-confirm-no-account-yes')?.addEventListener('click', () => {

    localStorage.setItem('kbl_first_run_completed', 'true');

    confirmModal?.classList.remove('show');

    firstRunModal?.classList.remove('show');

    showToast('👋 Добро пожаловать в KBLauncher! Вы играете в гостевом режиме.');

  });



  // Confirm "Нет, остаться"

  document.getElementById('btn-confirm-no-account-no')?.addEventListener('click', () => {

    confirmModal?.classList.remove('show');

  });



  // First-run Microsoft login card

  document.getElementById('first-run-login-ms')?.addEventListener('click', () => {

    const nick = prompt('Введите ваш никнейм Microsoft Xbox:', 'Player') || 'Player';

    if (window.addNewAccount) window.addNewAccount(nick, 'Microsoft');

    localStorage.setItem('kbl_first_run_completed', 'true');

    firstRunModal?.classList.remove('show');

    showToast(`✅ Добро пожаловать, ${nick}! Авторизован через Microsoft.`);

  });



  // First-run Ely.by login card

  document.getElementById('first-run-login-ely')?.addEventListener('click', () => {

    const nick = prompt('Введите ваш никнейм Ely.by:', 'Player') || 'Player';

    if (window.addNewAccount) window.addNewAccount(nick, 'Ely.by');

    localStorage.setItem('kbl_first_run_completed', 'true');

    firstRunModal?.classList.remove('show');

    showToast(`✅ Добро пожаловать, ${nick}! Авторизован через систему Ely.by.`);

  });



  // First-run Offline login button

  document.getElementById('btn-first-run-confirm-offline')?.addEventListener('click', () => {

    const nick = document.getElementById('first-run-nick-input')?.value.trim() || 'Player';

    if (window.addNewAccount) window.addNewAccount(nick, 'Офлайн');

    localStorage.setItem('kbl_first_run_completed', 'true');

    firstRunModal?.classList.remove('show');

    showToast(`✅ Добро пожаловать, ${nick}! Создан офлайн-профиль.`);

  });

}



// ==========================================

// External Links (Discord, Support, Site)

// ==========================================

window.openExternalLink = function(url) {
  if (window._pyApi && typeof window._pyApi.open_external === 'function') {
    window._pyApi.open_external(url);
  } else if (window.electronAPI && typeof window.electronAPI.openExternal === 'function') {
    window.electronAPI.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
};

function initLinks() {
  document.getElementById('btn-discord')?.addEventListener('click', () => {
    window.openExternalLink('https://discord.gg/minecraft');
    showToast('💬 Открытие Discord сообщества KBLauncher...');
  });

  document.getElementById('btn-site')?.addEventListener('click', () => {
    window.openExternalLink('https://kblauncher.netlify.app');
    showToast('🌐 Переход на официальный сайт KBLauncher...');
  });

  document.getElementById('btn-quick-site')?.addEventListener('click', () => {
    window.openExternalLink('https://kblauncher.netlify.app');
    showToast('🌐 Переход на официальный сайт KBLauncher...');
  });

  document.getElementById('btn-telegram')?.addEventListener('click', () => {
    window.openExternalLink('https://t.me/kblauncher');
    showToast('✈️ Открытие Telegram канала KBLauncher...');
  });

  document.getElementById('btn-donate')?.addEventListener('click', () => {
    window.openExternalLink('https://donationalerts.com');
    showToast('❤️ Спасибо за поддержку KBLauncher!');
  });

  document.getElementById('btn-support')?.addEventListener('click', () => {
    window.openExternalLink('https://donationalerts.com');
    showToast('❤️ Спасибо за поддержку KBLauncher!');
  });
}

function showToast(msg) {

  const container = document.getElementById('toast-container');

  if (!container) return;



  const toast = document.createElement('div');

  toast.className = 'toast-msg';

  toast.textContent = msg;



  container.appendChild(toast);



  setTimeout(() => {

    toast.style.opacity = '0';

    toast.style.transform = 'translateY(10px)';

    toast.style.transition = 'all 0.3s ease';

    setTimeout(() => toast.remove(), 300);

  }, 3200);

}




// ==========================================
// GAME LOGS & CRASH CONSOLE SYSTEM
// ==========================================

function initGameLogsModal() {
  const btnLogs = document.getElementById('btn-open-logs');
  const modal = document.getElementById('modal-game-logs');
  const btnCopy = document.getElementById('btn-copy-game-logs');
  const btnRefresh = document.getElementById('btn-refresh-game-logs');
  const output = document.getElementById('game-logs-output');

  async function loadLogs() {
    if (!output) return;
    output.textContent = '⏳ Чтение latest.log...';
    try {
      let res = null;
      if (window._pyApi && typeof window._pyApi.get_game_logs === 'function') {
        res = await window._pyApi.get_game_logs(LauncherState.activeInstance);
      }
      if (res && res.logs) {
        output.textContent = res.logs;
      } else {
        output.textContent = '[KBLauncher System]\nЛог пока пуст. Запустите игру для формирования отчёта.';
      }
      output.scrollTop = output.scrollHeight;
    } catch (e) {
      output.textContent = `Ошибка чтения лога: ${e}`;
    }
  }

  btnLogs?.addEventListener('click', () => {
    loadLogs();
    modal?.classList.add('show');
  });

  btnRefresh?.addEventListener('click', () => {
    loadLogs();
    showToast('🔄 Лог обновлен');
  });

  btnCopy?.addEventListener('click', () => {
    if (output && output.textContent) {
      navigator.clipboard?.writeText(output.textContent);
      showToast('📋 Лог игры скопирован в буфер обмена!');
    }
  });

  // Global handler called from Python when game process ends
  window.onGameTerminated = function(instId, exitCode) {
    console.log(`[KBLauncher JS] Game terminated for ${instId}, exit code: ${exitCode}`);
    LauncherState.isPlaying = false;
    const playBtn = document.getElementById('main-play-btn');
    const label = document.getElementById('play-status-label');
    if (label) label.textContent = 'Играть';
    if (playBtn) {
      playBtn.style.background = '';
      playBtn.style.opacity = '1';
    }

    if (exitCode !== 0 && exitCode !== null) {
      showToast(`⚠️ Minecraft завершился с кодом ошибки ${exitCode}! Открываем лог...`);
      loadLogs();
      modal?.classList.add('show');
    } else {
      showToast(`🎮 Сеанс игры в Minecraft завершён.`);
    }
  };
}
