

/**
 * KBLauncher - Application Controller
 * Handles navigation, state, instances, mods catalog, skin preview, server manager & settings.
 */

// Global Launcher State

// ==========================================================================
// COMPREHENSIVE MINECRAFT VERSIONS DATABASE (ALL VERSIONS + MODLOADERS)
// Covers all major releases (1.21.4 down to 1.0), Fabric, Forge, NeoForge, OptiFine, Snapshots
// ==========================================================================
const BASE_MINECRAFT_VERSIONS = [
  // ============================================================
  // 🔥 LATEST RELEASES 2026 (26.3, 26.2, 26.1, 26.0)
  // ============================================================
  { id: '26.3', ver: 'Release 26.3', category: 'release', typeName: 'Официальный релиз', date: '04.11.2026', installed: true, popular: true, tag: 'Новейший релиз 2026 · Рекомендуется' },
  { id: '26.2', ver: 'Release 26.2', category: 'release', typeName: 'Официальный релиз', date: '18.09.2026', installed: true, popular: true, tag: 'Свежий релиз' },
  { id: '26.1.2', ver: 'Release 26.1.2', category: 'release', typeName: 'Официальный релиз', date: '12.07.2026', installed: false, popular: true },
  { id: '26.1.1', ver: 'Release 26.1.1', category: 'release', typeName: 'Официальный релиз', date: '25.06.2026', installed: false, popular: false },
  { id: '26.1', ver: 'Release 26.1', category: 'release', typeName: 'Официальный релиз', date: '04.06.2026', installed: true, popular: true, tag: 'Стабильный' },
  { id: '26.0', ver: 'Release 26.0', category: 'release', typeName: 'Официальный релиз', date: '14.04.2026', installed: false, popular: false },

  // ============================================================
  // 🔬 LATEST SNAPSHOTS (26w14a, 26w12b, 26w10a, 25w48a...)
  // ============================================================
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

  // ============================================================
  // ⚡ MODDED LOADERS (Fabric 26.3, NeoForge 26.3, Forge 26.1...)
  // ============================================================
  { id: 'fabric-26.3', ver: 'Fabric 26.3', category: 'fabric', typeName: 'Fabric Loader', date: '05.11.2026', installed: true, popular: true, tag: 'KBL Оптимизация 2026' },
  { id: 'fabric-26.1', ver: 'Fabric 26.1', category: 'fabric', typeName: 'Fabric Loader', date: '06.06.2026', installed: true, popular: true },
  { id: 'neoforge-26.3', ver: 'NeoForge 26.3', category: 'neoforge', typeName: 'NeoForged Loader', date: '05.11.2026', installed: true, popular: true, tag: 'Новое ядро' },
  { id: 'neoforge-26.1', ver: 'NeoForge 26.1', category: 'neoforge', typeName: 'NeoForged Loader', date: '08.06.2026', installed: false, popular: false },
  { id: 'forge-26.1', ver: 'Forge 26.1', category: 'forge', typeName: 'Minecraft Forge', date: '10.06.2026', installed: false, popular: true },
  { id: 'optifine-26.1', ver: 'OptiFine 26.1', category: 'optifine', typeName: 'OptiFine HD', date: '15.06.2026', installed: true, popular: true, tag: 'Шейдеры' },

  // ============================================================
  // 🟩 PREVIOUS MAJOR RELEASES (1.21.4 down to 1.0)
  // ============================================================
  { id: '1.21.4', ver: 'Release 1.21.4', category: 'release', typeName: 'Официальный релиз', date: '03.12.2024', installed: true, popular: true, tag: 'Стабильный' },
  { id: '1.21.3', ver: 'Release 1.21.3', category: 'release', typeName: 'Официальный релиз', date: '23.10.2024', installed: false, popular: false },
  { id: '1.21.1', ver: 'Release 1.21.1', category: 'release', typeName: 'Официальный релиз', date: '08.08.2024', installed: true, popular: true },
  { id: '1.21', ver: 'Release 1.21', category: 'release', typeName: 'Официальный релиз', date: '13.06.2024', installed: false, popular: false },
  { id: '1.20.6', ver: 'Release 1.20.6', category: 'release', typeName: 'Официальный релиз', date: '29.04.2024', installed: false, popular: false },
  { id: '1.20.4', ver: 'Release 1.20.4', category: 'release', typeName: 'Официальный релиз', date: '07.12.2023', installed: true, popular: true },
  { id: '1.20.1', ver: 'Release 1.20.1', category: 'release', typeName: 'Официальный релиз', date: '12.06.2023', installed: true, popular: true, tag: 'Топ для модов' },
  { id: '1.19.4', ver: 'Release 1.19.4', category: 'release', typeName: 'Официальный релиз', date: '14.03.2023', installed: false, popular: true },
  { id: '1.19.2', ver: 'Release 1.19.2', category: 'release', typeName: 'Официальный релиз', date: '05.08.2022', installed: true, popular: true },
  { id: '1.18.2', ver: 'Release 1.18.2', category: 'release', typeName: 'Официальный релиз', date: '28.02.2022', installed: false, popular: true },
  { id: '1.17.1', ver: 'Release 1.17.1', category: 'release', typeName: 'Официальный релиз', date: '06.07.2021', installed: false, popular: false },
  { id: '1.16.5', ver: 'Release 1.16.5', category: 'release', typeName: 'Официальный релиз', date: '15.01.2021', installed: true, popular: true, tag: 'Легендарная' },
  { id: '1.15.2', ver: 'Release 1.15.2', category: 'release', typeName: 'Официальный релиз', date: '21.01.2020', installed: false, popular: false },
  { id: '1.14.4', ver: 'Release 1.14.4', category: 'release', typeName: 'Официальный релиз', date: '19.07.2019', installed: false, popular: false },
  { id: '1.13.2', ver: 'Release 1.13.2', category: 'release', typeName: 'Официальный релиз', date: '22.10.2018', installed: false, popular: false },
  { id: '1.12.2', ver: 'Release 1.12.2', category: 'release', typeName: 'Официальный релиз', date: '18.09.2017', installed: true, popular: true, tag: 'Золотой стандарт Forge' },
  { id: '1.11.2', ver: 'Release 1.11.2', category: 'release', typeName: 'Официальный релиз', date: '21.12.2016', installed: false, popular: false },
  { id: '1.10.2', ver: 'Release 1.10.2', category: 'release', typeName: 'Официальный релиз', date: '23.06.2016', installed: false, popular: false },
  { id: '1.9.4', ver: 'Release 1.9.4', category: 'release', typeName: 'Официальный релиз', date: '10.05.2016', installed: false, popular: false },
  { id: '1.8.9', ver: 'Release 1.8.9', category: 'release', typeName: 'Официальный релиз', date: '09.12.2015', installed: true, popular: true, tag: 'Топ для PvP / Hypixel' },
  { id: '1.7.10', ver: 'Release 1.7.10', category: 'release', typeName: 'Официальный релиз', date: '26.06.2014', installed: true, popular: true, tag: 'Классика модов' },
  { id: '1.6.4', ver: 'Release 1.6.4', category: 'release', typeName: 'Официальный релиз', date: '19.09.2013', installed: false, popular: false },
  { id: '1.5.2', ver: 'Release 1.5.2', category: 'release', typeName: 'Официальный релиз', date: '02.05.2013', installed: false, popular: true, tag: 'Ностальгия' },
  { id: '1.0.0', ver: 'Release 1.0.0', category: 'release', typeName: 'Официальный релиз', date: '18.11.2011', installed: false, popular: false, tag: 'Первый релиз' },

  // ============================================================
  // ⚡ POPULAR PREVIOUS MOD LOADERS
  // ============================================================
  { id: 'fabric-1.21.4', ver: 'Fabric 1.21.4', category: 'fabric', typeName: 'Fabric Loader', date: '05.12.2024', installed: true, popular: true },
  { id: 'fabric-1.20.1', ver: 'Fabric 1.20.1', category: 'fabric', typeName: 'Fabric Loader', date: '15.06.2023', installed: true, popular: true, tag: 'Топ сборка' },
  { id: 'fabric-1.16.5', ver: 'Fabric 1.16.5', category: 'fabric', typeName: 'Fabric Loader', date: '20.01.2021', installed: false, popular: true },
  { id: 'forge-1.20.1', ver: 'Forge 1.20.1', category: 'forge', typeName: 'Minecraft Forge', date: '18.06.2023', installed: true, popular: true, tag: 'Топ модпаков' },
  { id: 'forge-1.16.5', ver: 'Forge 1.16.5', category: 'forge', typeName: 'Minecraft Forge', date: '22.01.2021', installed: true, popular: true },
  { id: 'forge-1.12.2', ver: 'Forge 1.12.2', category: 'forge', typeName: 'Minecraft Forge', date: '25.09.2017', installed: true, popular: true, tag: 'Тяжёлые модпаки' },
  { id: 'optifine-1.20.1', ver: 'OptiFine 1.20.1', category: 'optifine', typeName: 'OptiFine HD', date: '25.06.2023', installed: true, popular: true },
  { id: 'optifine-1.16.5', ver: 'OptiFine 1.16.5', category: 'optifine', typeName: 'OptiFine HD', date: '02.02.2021', installed: true, popular: true },
  { id: 'optifine-1.8.9', ver: 'OptiFine 1.8.9', category: 'optifine', typeName: 'OptiFine HD', date: '15.12.2015', installed: true, popular: true, tag: 'PvP буст' },

  // ============================================================
  // 📜 RETRO BETA & ALPHA
  // ============================================================
  { id: 'b1.7.3', ver: 'Beta 1.7.3', category: 'old', typeName: 'Старая Beta', date: '08.07.2011', installed: true, popular: true, tag: 'Золотая эра' },
  { id: 'b1.8.1', ver: 'Beta 1.8.1', category: 'old', typeName: 'Старая Beta', date: '19.09.2011', installed: false, popular: false },
  { id: 'a1.2.6', ver: 'Alpha 1.2.6', category: 'old', typeName: 'Старая Alpha', date: '03.12.2010', installed: false, popular: false }
];

const LauncherState = {
  allVersions: [...BASE_MINECRAFT_VERSIONS],
  activeVersionFilter: 'all',
  activeDropdownFilter: 'popular',
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
      version: 'Nightly · 38609b7',
      modloader: 'Fabric 1.20.1',
      status: 'Готово',
      tag: 'Fabric · 42 мода',
      modsCount: 42
    },
    {
      id: 'vanilla-1-21',
      name: 'Vanilla 1.21.4',
      version: 'Release 1.21.4',
      modloader: 'Vanilla',
      status: 'Чистый клиент',
      tag: 'Release · Без модов',
      modsCount: 0
    },
    {
      id: 'shaders-optifine',
      name: 'Shaders & RT',
      version: 'OptiFine 1.16.5',
      modloader: 'OptiFine',
      status: 'Шейдеры',
      tag: 'Iris + BSL Shaders',
      modsCount: 18
    }
  ],
  mods: [
    { id: 'sodium', name: 'Sodium', desc: 'Кратно увеличивает частоту кадров (FPS) и снижает микрофризы рендеринга.', category: 'mods', downloads: '45.2M', installed: true, icon: '⚡' },
    { id: 'iris', name: 'Iris Shaders', desc: 'Современный и быстрый движок шейдеров с поддержкой шейдерпаков OptiFine.', category: 'mods', downloads: '38.6M', installed: true, icon: '✨' },
    { id: 'fabric-api', name: 'Fabric API', desc: 'Основная библиотека и хуки жизненного цикла для работы модов на Fabric.', category: 'mods', downloads: '92.1M', installed: true, icon: '🧩' },
    { id: 'lithium', name: 'Lithium', desc: 'Оптимизация искусственного интеллекта мобов, тиков мира и физики чанков.', category: 'mods', downloads: '32.4M', installed: true, icon: '🔋' },
    { id: 'ferritecore', name: 'FerriteCore', desc: 'Снижает потребление оперативной памяти Minecraft на 30-50%.', category: 'mods', downloads: '28.9M', installed: true, icon: '💾' },
    { id: 'journeymap', name: 'JourneyMap', desc: 'Детализированная карта мира в реальном времени с радаром и путевыми точками.', category: 'mods', downloads: '68.0M', installed: true, icon: '🗺️' },
    { id: 'jei', name: 'Just Enough Items (JEI)', desc: 'Удобный просмотр всех предметов игры, рецептов крафта и использований.', category: 'mods', downloads: '115M', installed: true, icon: '📖' },
    { id: 'appleskin', name: 'AppleSkin', desc: 'Визуализация насыщения, голода и восстановления здоровья едой.', category: 'mods', downloads: '74.2M', installed: true, icon: '🍎' },
    { id: 'indium', name: 'Indium', desc: 'Реализация Fabric Rendering API для модов при использовании Sodium.', category: 'mods', downloads: '22.3M', installed: true, icon: '💎' },
    { id: 'continuity', name: 'Continuity', desc: 'Бесшовные соединенные текстуры стекла, полированного камня и книжных полок.', category: 'mods', downloads: '19.4M', installed: false, icon: '🪟' },
    { id: 'entity-culling', name: 'Entity Culling', desc: 'Пропускает рендеринг мобов и сундуков, скрытых за стенами.', category: 'mods', downloads: '17.8M', installed: true, icon: '👁️' },
    { id: 'complementary', name: 'Complementary Reimagined', desc: 'Потрясающий шейдерпак с мягкими тенями, облаками и отражениями воды.', category: 'shaders', downloads: '14.5M', installed: true, icon: '🌅' }
  ],
  servers: [],
  versions: BASE_MINECRAFT_VERSIONS
};

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initWindowControls();
  initNavigation();
  initSubNavigation();
  initVersionDropdown();
  initPlayButton();
  initModsCatalog();
  initGitHubModInstaller();
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
// Version Selector Dropdown
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
    const activeTab = LauncherState.activeDropdownFilter || 'popular';

    const filtered = LauncherState.allVersions.filter(v => {
      if (query) {
        return v.ver.toLowerCase().includes(query) || v.id.toLowerCase().includes(query) || (v.tag && v.tag.toLowerCase().includes(query));
      }
      if (activeTab === 'popular') return Boolean(v.popular);
      if (activeTab === 'release') return v.category === 'release';
      if (activeTab === 'snapshot') return v.category === 'snapshot';
      if (activeTab === 'modded') return ['fabric', 'forge', 'neoforge', 'optifine'].includes(v.category);
      return true;
    });

    listContainer.innerHTML = filtered.slice(0, 80).map(v => {
      let icon = '🟩';
      if (v.category === 'fabric') icon = '⚡';
      else if (v.category === 'forge') icon = '🔨';
      else if (v.category === 'neoforge') icon = '🌀';
      else if (v.category === 'optifine') icon = '💎';
      else if (v.category === 'snapshot') icon = '🔬';
      else if (v.category === 'old') icon = '📜';

      const isActive = (LauncherState.selectedVersion === v.ver);

      return `
        <div class="version-dropdown-item ${isActive ? 'active' : ''}" data-ver="${v.ver}">
          <div style="display:flex; align-items:center; gap:8px;">
            <span>${icon}</span>
            <span>${v.ver}</span>
          </div>
          <span style="font-size: 10.5px; opacity: 0.75;">${v.tag || v.typeName || ''}</span>
        </div>
      `;
    }).join('');

    // Attach click events to items
    listContainer.querySelectorAll('.version-dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const ver = item.getAttribute('data-ver');
        LauncherState.selectedVersion = ver;
        if (selectedText) selectedText.textContent = ver;
        dropdown.classList.remove('show');
        showToast(`Выбрана версия: ${ver}`);
        initVersionsTable();
      });
    });
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
      renderDropdownList();
      searchInput?.focus();
    }
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
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

  playBtn?.addEventListener('click', () => {
    if (!LauncherState.isPlaying) {
      // Start Game Launch Sequence
      LauncherState.isPlaying = true;
      if (label) label.textContent = 'Подготовка...';
      playBtn.style.opacity = '0.85';

      setTimeout(() => {
        if (label) label.textContent = 'Загрузка ассетов (100%)...';
      }, 700);

      setTimeout(() => {
        if (label) label.textContent = 'Запуск игры...';
      }, 1500);

      setTimeout(() => {
        LauncherState.gamePid = Math.floor(Math.random() * 5000 + 2000);
        if (label) label.innerHTML = `В игре <small>(PID: ${LauncherState.gamePid})</small>`;
        playBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        playBtn.style.opacity = '1';
        showToast(`🎮 Minecraft (${LauncherState.selectedVersion}) успешно запущен!`);
      }, 2300);

    } else {
      // Stop / Kill Game
      LauncherState.isPlaying = false;
      LauncherState.gamePid = null;
      if (label) label.textContent = 'Играть';
      playBtn.style.background = '';
      showToast('⏹ Игра Minecraft остановлена.');
    }
  });

  folderBtn?.addEventListener('click', () => {
    if (window.electronAPI) {
      window.electronAPI.openFolder();
    } else {
      showToast('📁 Папка игры: %APPDATA%\\.minecraft\\kblauncher');
    }
  });

  siteQuickBtn?.addEventListener('click', () => {
    if (window.electronAPI) {
      window.electronAPI.openExternal('http://localhost:3000/site.html');
    } else {
      window.open('/site.html', '_blank');
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

// ==========================================
// Mods Catalog & Filtering (Image 1)
// ==========================================
function initModsCatalog() {
  renderModsCatalog(LauncherState.mods);

  const searchInput = document.getElementById('mods-search-field');
  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = LauncherState.mods.filter(m => 
      m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
    );
    renderModsCatalog(filtered);
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

  // Source Pills
  const sourcePills = document.querySelectorAll('.source-pill:not(.disabled)');
  sourcePills.forEach(pill => {
    pill.addEventListener('click', () => {
      sourcePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      showToast(`Источник модов: ${pill.textContent}`);
    });
  });
}

function renderModsCatalog(modsList) {
  const container = document.getElementById('mods-catalog-cards');
  if (!container) return;

  if (modsList.length === 0) {
    container.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 32px;">
        <p class="empty-text">Моды по данному запросу не найдены.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = modsList.map(mod => `
    <div class="mod-entry-card" data-mod-id="${mod.id}">
      <div class="mod-entry-left">
        <div class="mod-icon-box">${mod.icon}</div>
        <div class="mod-info-text">
          <div class="mod-title">${mod.name}</div>
          <div class="mod-desc">${mod.desc}</div>
          <div class="mod-tags">
            <span class="mod-tag-pill">Загрузок: ${mod.downloads}</span>
            <span class="mod-tag-pill">Fabric / NeoForge</span>
          </div>
        </div>
      </div>
      <button class="mod-install-toggle-btn ${mod.installed ? 'installed' : ''}" onclick="toggleModInstall('${mod.id}')">
        ${mod.installed ? 'Установлено ✓' : 'Установить'}
      </button>
    </div>
  `).join('');
}

window.toggleModInstall = function(modId) {
  const mod = LauncherState.mods.find(m => m.id === modId);
  if (!mod) return;

  mod.installed = !mod.installed;
  renderModsCatalog(LauncherState.mods);
  renderInstalledModsList();

  const count = LauncherState.mods.filter(m => m.installed).length;
  const modsTabLabel = document.querySelector('[data-subtab="sub-mods-list"] span');
  if (modsTabLabel) modsTabLabel.textContent = `Моды (${count})`;

  showToast(mod.installed ? `Мод ${mod.name} успешно установлен!` : `Мод ${mod.name} удален из сборки.`);
};

function renderInstalledModsList() {
  const container = document.getElementById('installed-mods-tbody');
  if (!container) return;

  const installed = LauncherState.mods.filter(m => m.installed);
  container.innerHTML = installed.map(mod => `
    <div class="mod-entry-card" style="margin-bottom: 8px;">
      <div class="mod-entry-left">
        <div class="mod-icon-box">${mod.icon}</div>
        <div class="mod-info-text">
          <div class="mod-title">${mod.name}</div>
          <div class="mod-desc">${mod.desc}</div>
        </div>
      </div>
      <button class="secondary-glass-btn" onclick="toggleModInstall('${mod.id}')">Удалить</button>
    </div>
  `).join('');
}

// ==========================================
// GitHub Native Mod Installer (Image 1)
// ==========================================
function initGitHubModInstaller() {
  const btn = document.getElementById('btn-add-github-mod');
  const input = document.getElementById('github-url-input');

  btn?.addEventListener('click', () => {
    const url = input?.value.trim();
    if (!url) {
      showToast('⚠️ Введите ссылку на репозиторий GitHub');
      return;
    }

    if (!url.includes('github.com')) {
      showToast('❌ Ошибка: Укажите корректный URL GitHub');
      return;
    }

    btn.textContent = 'Загрузка релиза...';
    btn.disabled = true;

    const repoParts = url.replace('https://github.com/', '').split('/');
    const repoName = repoParts[1] || 'custom-native-mod';

    setTimeout(() => {
      LauncherState.mods.unshift({
        id: `gh-${Date.now()}`,
        name: repoName,
        desc: `Нативный мод загружен с GitHub (${url})`,
        category: 'mods',
        downloads: 'GitHub Release',
        installed: true,
        icon: '🐙'
      });

      renderModsCatalog(LauncherState.mods);
      showToast(`✅ Нативный мод "${repoName}" установлен в KBLauncher!`);
      if (input) input.value = '';
      btn.textContent = 'Добавить с GitHub';
      btn.disabled = false;
    }, 1200);
  });
}

// ==========================================
// Servers Manager (Photo 1 Server Creation & VPS Runner)
// ==========================================
function initServersManager() {
  const openCreateBtn1 = document.getElementById('btn-open-create-server');
  const openCreateBtn2 = document.getElementById('btn-action-create-server');
  const addFolderBtn = document.getElementById('btn-action-add-folder');

  const serverCreationState = {
    name: 'Мой сервер',
    worldType: 'new',
    seed: '',
    gamemode: 'survival',
    difficulty: 'normal',
    players: 10,
    ram: 4096,
    core: 'paper',
    port: 25565,
    onlineMode: true,
    upnp: true,
    pvp: true,
    autoRestart: true,
    whitelist: false,
    ops: ['Player']
  };

  function updateServerPreview() {
    const previewName = document.getElementById('preview-server-name');
    const previewDesc = document.getElementById('preview-server-desc');
    const nameInput = document.getElementById('server-name-input');
    const name = nameInput?.value.trim() || 'Мой сервер';
    if (previewName) previewName.textContent = name;

    const modeLabels = { survival: 'Выживание', creative: 'Творчество', adventure: 'Приключение' };
    const diffLabels = { peaceful: 'Мирный', easy: 'Легкий', normal: 'Нормальный', hard: 'Сложный' };
    const coreLabels = { paper: 'Paper 1.21.4', fabric: 'Fabric 1.20.1', purpur: 'Purpur 1.21', vanilla: 'Vanilla 1.21.4' };
    const ramGb = (serverCreationState.ram / 1024).toFixed(1).replace('.0', '');
    const worldDesc = serverCreationState.worldType === 'copy' 
      ? 'Скопированный мир' 
      : (serverCreationState.seed ? `Зерно: ${serverCreationState.seed}` : 'Новый мир');

    if (previewDesc) {
      previewDesc.textContent = `${modeLabels[serverCreationState.gamemode] || 'Выживание'} · ${diffLabels[serverCreationState.difficulty] || 'Нормальный'} · до ${serverCreationState.players} игроков · ${ramGb} ГБ ОЗУ · ${coreLabels[serverCreationState.core] || 'Paper'} · :${serverCreationState.port} · ${serverCreationState.ops.length} OP · ${serverCreationState.onlineMode ? 'Лицензия' : 'Офлайн'}`;
    }
  }

  function renderOpsChips() {
    const container = document.getElementById('server-ops-chips');
    if (!container) return;
    container.innerHTML = serverCreationState.ops.map(op => `
      <span class="op-chip" data-op="${op}">
        👑 <span class="op-name">${op}</span>${op === LauncherState.user.name ? ' (Вы)' : ''}
        <button type="button" class="remove-op-btn" data-remove-op="${op}" title="Удалить">&times;</button>
      </span>
    `).join('');

    container.querySelectorAll('.remove-op-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const opToRemove = btn.getAttribute('data-remove-op');
        serverCreationState.ops = serverCreationState.ops.filter(o => o !== opToRemove);
        renderOpsChips();
        updateServerPreview();
      });
    });
  }

  const openServerModal = () => {
    if (serverCreationState.ops.length === 0 && LauncherState.user?.name) {
      serverCreationState.ops = [LauncherState.user.name];
    }
    renderOpsChips();
    updateServerPreview();
    document.getElementById('modal-create-server')?.classList.add('show');
  };

  openCreateBtn1?.addEventListener('click', openServerModal);
  openCreateBtn2?.addEventListener('click', openServerModal);

  // Name & Seed input live preview
  document.getElementById('server-name-input')?.addEventListener('input', updateServerPreview);
  document.getElementById('server-seed-input')?.addEventListener('input', (e) => {
    serverCreationState.seed = e.target.value.trim();
    updateServerPreview();
  });

  // World Type Selector
  document.querySelectorAll('.server-opt-card[data-world-type]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.server-opt-card[data-world-type]').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      serverCreationState.worldType = card.getAttribute('data-world-type') || 'new';
      updateServerPreview();
    });
  });

  // Gamemode Selector
  document.querySelectorAll('.server-opt-card[data-gamemode]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.server-opt-card[data-gamemode]').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      serverCreationState.gamemode = card.getAttribute('data-gamemode') || 'survival';
      updateServerPreview();
    });
  });

  // Difficulty Pills
  document.querySelectorAll('.diff-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.diff-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      serverCreationState.difficulty = pill.getAttribute('data-diff') || 'normal';
      updateServerPreview();
    });
  });

  // Players Stepper [-] count [+]
  const valEl = document.getElementById('server-players-val');
  document.getElementById('btn-player-dec')?.addEventListener('click', () => {
    if (serverCreationState.players > 1) {
      serverCreationState.players--;
      if (valEl) valEl.textContent = serverCreationState.players;
      updateServerPreview();
    }
  });
  document.getElementById('btn-player-inc')?.addEventListener('click', () => {
    if (serverCreationState.players < 100) {
      serverCreationState.players++;
      if (valEl) valEl.textContent = serverCreationState.players;
      updateServerPreview();
    }
  });

  // RAM Allocation Slider & Presets
  const ramSlider = document.getElementById('server-ram-slider');
  const ramValEl = document.getElementById('server-ram-val');
  const ramHint = document.getElementById('server-ram-hint');

  function updateRamUI(mb) {
    serverCreationState.ram = mb;
    const gb = (mb / 1024).toFixed(1).replace('.0', '');
    if (ramValEl) ramValEl.textContent = `${mb} МБ (${gb} ГБ)`;
    if (ramSlider) ramSlider.value = mb;

    document.querySelectorAll('.ram-preset-pill').forEach(pill => {
      const pMb = parseInt(pill.getAttribute('data-ram') || '0', 10);
      pill.classList.toggle('active', pMb === mb);
    });

    if (ramHint) {
      if (mb <= 2048) {
        ramHint.textContent = '⚡ Легкий режим: для 1-3 игроков без тяжелых плагинов.';
      } else if (mb <= 4096) {
        ramHint.textContent = '💡 Рекомендуемый баланс: для 10 игроков с плагинами и модами.';
      } else if (mb <= 8192) {
        ramHint.textContent = '🚀 Высокая производительность: для больших построек, миров и 20+ игроков.';
      } else {
        ramHint.textContent = '🔥 Ультра-выделение: для масштабных серверов с высокой дальностью прорисовки.';
      }
    }
    updateServerPreview();
  }

  ramSlider?.addEventListener('input', (e) => {
    updateRamUI(parseInt(e.target.value, 10));
  });

  document.querySelectorAll('.ram-preset-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const mb = parseInt(pill.getAttribute('data-ram') || '4096', 10);
      updateRamUI(mb);
    });
  });

  // Server Core Selector
  document.querySelectorAll('.server-opt-card[data-core]').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.server-opt-card[data-core]').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      serverCreationState.core = card.getAttribute('data-core') || 'paper';
      const badge = document.getElementById('server-core-badge');
      const coreNames = { paper: 'Paper 1.21.4', fabric: 'Fabric 1.20.1', purpur: 'Purpur 1.21', vanilla: 'Vanilla 1.21.4' };
      if (badge) badge.textContent = coreNames[serverCreationState.core] || 'Paper 1.21.4';
      updateServerPreview();
    });
  });

  // Server Port & Randomizer
  const portInput = document.getElementById('server-port-input');
  portInput?.addEventListener('input', (e) => {
    serverCreationState.port = parseInt(e.target.value, 10) || 25565;
    updateServerPreview();
  });

  document.getElementById('btn-rand-port')?.addEventListener('click', () => {
    const randPort = Math.floor(Math.random() * (29999 - 25500 + 1)) + 25500;
    serverCreationState.port = randPort;
    if (portInput) portInput.value = randPort;
    updateServerPreview();
    showToast(`🎲 Сгенерирован порт сервера: ${randPort}`);
  });

  // Online Mode Toggle
  const onlineModeToggle = document.getElementById('server-online-mode');
  const onlineModeLabel = document.getElementById('server-online-mode-label');
  onlineModeToggle?.addEventListener('change', (e) => {
    serverCreationState.onlineMode = e.target.checked;
    if (onlineModeLabel) {
      onlineModeLabel.textContent = e.target.checked ? 'Лицензия (Online Mode)' : 'Офлайн (Любые ники)';
    }
    updateServerPreview();
  });

  // Additional Toggles
  document.getElementById('toggle-server-upnp')?.addEventListener('change', (e) => {
    serverCreationState.upnp = e.target.checked;
  });
  document.getElementById('toggle-server-pvp')?.addEventListener('change', (e) => {
    serverCreationState.pvp = e.target.checked;
  });
  document.getElementById('toggle-server-restart')?.addEventListener('change', (e) => {
    serverCreationState.autoRestart = e.target.checked;
  });
  document.getElementById('toggle-server-whitelist')?.addEventListener('change', (e) => {
    serverCreationState.whitelist = e.target.checked;
  });

  // Add Server Operator (Admin) function
  document.getElementById('btn-add-server-op')?.addEventListener('click', () => {
    const opInput = document.getElementById('server-op-input');
    const nick = opInput?.value.trim() || LauncherState.user.name || 'Player';
    if (!serverCreationState.ops.includes(nick)) {
      serverCreationState.ops.push(nick);
      renderOpsChips();
      updateServerPreview();
      if (opInput) opInput.value = '';
      showToast(`👑 Игрок "${nick}" назначен оператором сервера`);
    } else {
      showToast(`Игрок "${nick}" уже в списке операторов`);
    }
  });

  // Folder open button
  addFolderBtn?.addEventListener('click', () => {
    if (window.electronAPI) {
      window.electronAPI.openFolder();
    } else {
      showToast('📁 Выберите папку сервера (эмуляция диалога)');
    }
  });

  // Confirm Create Server
  const confirmCreateBtn = document.getElementById('btn-confirm-create-server');
  confirmCreateBtn?.addEventListener('click', () => {
    const name = document.getElementById('server-name-input')?.value.trim() || 'Мой сервер';
    const coreNames = { paper: 'Paper 1.21.4', fabric: 'Fabric 1.20.1', purpur: 'Purpur 1.21', vanilla: 'Vanilla 1.21.4' };

    const newServer = {
      id: `srv-${Date.now()}`,
      name,
      core: coreNames[serverCreationState.core] || 'Paper 1.21.4',
      status: 'В сети',
      online: true,
      playersCurrent: 1,
      playersMax: serverCreationState.players,
      ram: `${(serverCreationState.ram / 1024).toFixed(1)} ГБ`,
      port: serverCreationState.port,
      ip: `localhost:${serverCreationState.port}`,
      world: serverCreationState.worldType === 'copy' ? 'Скопированный' : 'Новый мир'
    };

    LauncherState.servers.push(newServer);
    renderServersList();
    document.getElementById('modal-create-server')?.classList.remove('show');
    showToast(`🚀 Сервер "${name}" (${newServer.core}, ${newServer.ram} ОЗУ, порт ${newServer.port}) запущен!`);
  });
}

function renderServersList() {
  const emptyCard = document.getElementById('servers-empty-card');
  const listContainer = document.getElementById('active-servers-list');
  if (!emptyCard || !listContainer) return;

  if (LauncherState.servers.length === 0) {
    emptyCard.style.display = 'flex';
    listContainer.style.display = 'none';
  } else {
    emptyCard.style.display = 'none';
    listContainer.style.display = 'block';

    listContainer.innerHTML = LauncherState.servers.map(srv => `
      <div class="server-item-row" data-server-id="${srv.id}">
        <div style="display:flex; align-items:center; gap: 14px;">
          <div class="server-status-led ${srv.online ? 'online' : 'offline'}"></div>
          <div>
            <div style="font-weight:600; font-size:14px; color:#f8fafc;">${srv.name}</div>
            <div style="font-size:12px; color:#94a3b8; display:flex; align-items:center; gap:8px;">
              <span>IP: <code style="color:#c7d2fe;">${srv.ip}</code></span>
              <button class="secondary-glass-btn" style="padding:2px 8px; font-size:10px;" onclick="copyToClipboard('${srv.ip}')">Копировать</button>
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap: 12px;">
          <span style="font-size:12px; color:#cbd5e1;">${srv.online ? `Игроков: ${srv.players}/${srv.maxPlayers}` : 'Остановлен'}</span>
          <button class="primary-play-btn" style="padding:6px 16px; font-size:12px; background:${srv.online ? '#ef4444' : 'var(--color-brand)'}" onclick="toggleServerRun('${srv.id}')">
            ${srv.online ? 'Остановить' : 'Запустить'}
          </button>
          <button class="secondary-glass-btn" style="padding:6px 10px;" onclick="deleteServer('${srv.id}')">✕</button>
        </div>
      </div>
    `).join('');
  }
}

window.toggleServerRun = function(serverId) {
  const s = LauncherState.servers.find(x => x.id === serverId);
  if (!s) return;
  s.online = !s.online;
  s.players = s.online ? 1 : 0;
  renderServersList();
  showToast(s.online ? `🟢 Сервер "${s.name}" запущен на порту ${s.port}!` : `⚪ Сервер "${s.name}" остановлен.`);
};

window.deleteServer = function(serverId) {
  LauncherState.servers = LauncherState.servers.filter(x => x.id !== serverId);
  renderServersList();
  showToast('Сервер удален.');
};

window.copyToClipboard = function(text) {
  navigator.clipboard?.writeText(text);
  showToast(`📋 IP скопирован в буфер: ${text}`);
};

// ==========================================
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
// Versions Table (Page 5)
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
      if (activeFilter !== 'all') {
        if (activeFilter === 'release' && v.category !== 'release') return false;
        if (activeFilter === 'fabric' && v.category !== 'fabric') return false;
        if (activeFilter === 'forge' && v.category !== 'forge') return false;
        if (activeFilter === 'neoforge' && v.category !== 'neoforge') return false;
        if (activeFilter === 'optifine' && v.category !== 'optifine') return false;
        if (activeFilter === 'snapshot' && v.category !== 'snapshot') return false;
        if (activeFilter === 'old' && v.category !== 'old') return false;
      }
      if (query) {
        return (
          v.ver.toLowerCase().includes(query) ||
          v.id.toLowerCase().includes(query) ||
          (v.typeName && v.typeName.toLowerCase().includes(query)) ||
          (v.tag && v.tag.toLowerCase().includes(query))
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

    // Limit rendered items for 120 FPS performance (zero lag)
    const displayList = query ? filtered : filtered.slice(0, currentLimit);

    let html = displayList.map(v => {
      let tagClass = 'v-tag-release';
      let icon = '🟩';
      if (v.category === 'fabric') { tagClass = 'v-tag-fabric'; icon = '⚡'; }
      else if (v.category === 'forge') { tagClass = 'v-tag-forge'; icon = '🔨'; }
      else if (v.category === 'neoforge') { tagClass = 'v-tag-neoforge'; icon = '🌀'; }
      else if (v.category === 'optifine') { tagClass = 'v-tag-optifine'; icon = '💎'; }
      else if (v.category === 'snapshot') { tagClass = 'v-tag-snapshot'; icon = '🔬'; }
      else if (v.category === 'old') { tagClass = 'v-tag-old'; icon = '📜'; }

      const isCurrentSelected = (LauncherState.selectedVersion === v.ver || LauncherState.selectedVersion === v.id);

      return `
        <div class="version-table-row ${isCurrentSelected ? 'active' : ''}">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size: 14px;">${icon}</span>
            <span style="font-weight: 700; color: #fff;">${v.ver}</span>
            ${v.tag ? `<span class="v-badge-tag ${tagClass}" style="font-size:10px; padding:1px 6px;">${v.tag}</span>` : ''}
          </div>
          <div>
            <span class="v-badge-tag ${tagClass}">${v.typeName || v.type || 'Релиз'}</span>
          </div>
          <div style="color: #94a3b8; font-size: 12px;">${v.date || '2026'}</div>
          <div>
            <span class="status-dot ${v.installed ? 'green' : 'gray'}" style="display:inline-block; margin-right:4px;"></span>
            <span style="color: ${v.installed ? '#34d399' : '#94a3b8'}; font-weight: 500;">
              ${v.installed ? 'Установлено' : 'Готово'}
            </span>
          </div>
          <div style="display: flex; gap: 6px; justify-content: flex-end;">
            <button class="secondary-glass-btn" style="padding: 5px 12px; font-size: 11px; font-weight: 600;" onclick="selectVersionFromTable('${v.ver}')">
              ${isCurrentSelected ? '✓ Выбрано' : 'Выбрать'}
            </button>
            <button class="primary-play-btn" style="padding: 5px 12px; font-size: 11px; font-weight: 700; border-radius: 8px;" onclick="launchDirectVersion('${v.ver}')">
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

window.selectVersionFromTable = function(verName) {
  LauncherState.selectedVersion = verName;
  const selText = document.getElementById('selected-version-text');
  if (selText) selText.textContent = verName;
  initVersionsTable();
  showToast(`✨ Версия ${verName} выбрана для запуска!`);
};

window.launchDirectVersion = function(verName) {
  LauncherState.selectedVersion = verName;
  const selText = document.getElementById('selected-version-text');
  if (selText) selText.textContent = verName;
  switchNavTab('tab-home');
  showToast(`Запуск Minecraft ${verName}...`);
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

  // Open Add Build Modal
  document.getElementById('add-build-btn')?.addEventListener('click', () => {
    document.getElementById('modal-create-build')?.classList.add('show');
  });

  // Confirm Create Build
  document.getElementById('btn-confirm-create-build')?.addEventListener('click', () => {
    const name = document.getElementById('new-build-name')?.value.trim() || 'Новая сборка';
    const version = document.getElementById('new-build-version')?.value || '1.20.1';
    const loader = document.querySelector('input[name="modloader"]:checked')?.value || 'fabric';

    const newInst = {
      id: `inst-${Date.now()}`,
      name,
      version: `${loader.toUpperCase()} · ${version}`,
      modloader: loader,
      status: 'Готово',
      modsCount: 0
    };

    LauncherState.instances.push(newInst);
    renderInstancesList();
    document.getElementById('modal-create-build')?.classList.remove('show');
    showToast(`✨ Сборка "${name}" успешно создана!`);
  });
}

function renderInstancesList() {
  const container = document.getElementById('instances-container');
  if (!container) return;

  container.innerHTML = LauncherState.instances.map(inst => {
    const isActive = inst.id === LauncherState.activeInstance;
    let iconHTML = '<img src="assets/kbl-logo-circle.png" alt="Logo" class="instance-logo">';
    let dotClass = 'green';
    if (inst.id === 'vanilla-1-21') {
      iconHTML = '<span style="font-size:18px;">🧊</span>';
      dotClass = 'blue';
    } else if (inst.id === 'shaders-optifine') {
      iconHTML = '<span style="font-size:18px;">✨</span>';
      dotClass = 'purple';
    }

    return `
      <div class="instance-card ${isActive ? 'active' : ''}" data-instance-id="${inst.id}" onclick="selectInstance('${inst.id}')">
        <div class="instance-icon-box ${inst.id === 'vanilla-1-21' ? 'vanilla-box' : (inst.id === 'shaders-optifine' ? 'shaders-box' : '')}">
          ${iconHTML}
        </div>
        <div class="instance-details">
          <div class="instance-name">${inst.name}</div>
          <div class="instance-status">
            <span class="status-dot ${dotClass}"></span>
            <span class="status-text">${inst.status}</span>
            <span class="instance-tag">${inst.tag || inst.version}</span>
          </div>
        </div>
        <button class="instance-menu-btn" title="Опции сборки" onclick="event.stopPropagation(); showToast('Параметры сборки: ${inst.name}')">
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

window.selectInstance = function(instId) {
  LauncherState.activeInstance = instId;
  const inst = LauncherState.instances.find(i => i.id === instId);
  if (inst) {
    document.querySelector('.hero-title-text').textContent = inst.name;
    document.getElementById('selected-version-text').textContent = inst.version;
    showToast(`Выбрана сборка: ${inst.name}`);
  }
  renderInstancesList();
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
function initLinks() {
  document.getElementById('btn-discord')?.addEventListener('click', () => {
    const url = 'https://discord.gg/minecraft';
    if (window.electronAPI) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
    showToast('💬 Открытие Discord сообщества KBLauncher...');
  });

  document.getElementById('btn-site')?.addEventListener('click', () => {
    if (window.electronAPI) {
      window.electronAPI.openExternal('http://localhost:3000/site.html');
    } else {
      window.open('/site.html', '_blank');
    }
    showToast('🌐 Переход на официальный сайт KBLauncher...');
  });

  document.getElementById('btn-support')?.addEventListener('click', () => {
    showToast('❤️ Спасибо за поддержку KBLauncher!');
  });
}

// ==========================================
// Toast Notification System
// ==========================================
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
