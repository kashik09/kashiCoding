// ===========================
// DOM Elements
// ===========================

const paletteContainer = document.getElementById('paletteContainer');
const modeBtns = document.querySelectorAll('.mode-btn');
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const exportBtn = document.getElementById('exportBtn');
const exportMenu = document.getElementById('exportMenu');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeModal = document.getElementById('closeModal');
const toast = document.getElementById('toast');

// ===========================
// State
// ===========================

let currentMode = 'random';
let currentPalette = [];
const lockedColors = new Set();

// ===========================
// Color Theory Functions
// ===========================

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {object} - {h: 0-360, s: 0-100, l: 0-100}
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {object} - {r: 0-255, g: 0-255, b: 0-255}
 */
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert RGB to HEX
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert HEX to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Generate random color
 */
function randomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 60; // 60-100% saturation
  const l = Math.floor(Math.random() * 30) + 40; // 40-70% lightness
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
function generateAnalogous(baseHue) {
  const colors = [];
  const steps = [-60, -30, 0, 30, 60]; // 30° apart

  steps.forEach(step => {
    const h = (baseHue + step + 360) % 360;
    const s = Math.floor(Math.random() * 20) + 70; // 70-90%
    const l = Math.floor(Math.random() * 30) + 40; // 40-70%
    const rgb = hslToRgb(h, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  return colors;
}

/**
 * Generate complementary colors (opposite on color wheel)
 */
function generateComplementary(baseHue) {
  const colors = [];

  // Base color and variations
  [0, 15, -15].forEach(offset => {
    const h = (baseHue + offset + 360) % 360;
    const s = Math.floor(Math.random() * 20) + 70;
    const l = Math.floor(Math.random() * 30) + 40;
    const rgb = hslToRgb(h, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  // Complementary color and variations
  [180, 165].forEach(offset => {
    const h = (baseHue + offset + 360) % 360;
    const s = Math.floor(Math.random() * 20) + 70;
    const l = Math.floor(Math.random() * 30) + 40;
    const rgb = hslToRgb(h, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  return colors;
}

/**
 * Generate triadic colors (evenly spaced on color wheel)
 */
function generateTriadic(baseHue) {
  const colors = [];
  const steps = [0, 120, 240]; // 120° apart

  steps.forEach(step => {
    const h = (baseHue + step) % 360;
    const s = Math.floor(Math.random() * 20) + 70;
    const l = Math.floor(Math.random() * 30) + 40;
    const rgb = hslToRgb(h, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  // Add two more variations
  [60, 180].forEach(step => {
    const h = (baseHue + step) % 360;
    const s = Math.floor(Math.random() * 20) + 60;
    const l = Math.floor(Math.random() * 30) + 45;
    const rgb = hslToRgb(h, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  return colors;
}

/**
 * Generate monochromatic colors (same hue, different saturation/lightness)
 */
function generateMonochromatic(baseHue) {
  const colors = [];
  const lightnesses = [25, 40, 55, 70, 85];

  lightnesses.forEach(l => {
    const s = Math.floor(Math.random() * 30) + 60; // 60-90%
    const rgb = hslToRgb(baseHue, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  });

  return colors;
}

/**
 * Generate palette based on current mode
 */
function generatePalette() {
  const baseHue = Math.floor(Math.random() * 360);
  let newColors = [];

  switch (currentMode) {
    case 'analogous':
      newColors = generateAnalogous(baseHue);
      break;
    case 'complementary':
      newColors = generateComplementary(baseHue);
      break;
    case 'triadic':
      newColors = generateTriadic(baseHue);
      break;
    case 'monochromatic':
      newColors = generateMonochromatic(baseHue);
      break;
    default: // random
      newColors = Array(5).fill(null).map(() => randomColor());
  }

  // Keep locked colors
  currentPalette = newColors.map((color, index) => {
    return lockedColors.has(index) ? currentPalette[index] : color;
  });

  renderPalette();
}

// ===========================
// Render Functions
// ===========================

/**
 * Render color palette
 */
function renderPalette() {
  paletteContainer.innerHTML = '';

  currentPalette.forEach((hex, index) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const isLocked = lockedColors.has(index);

    const card = document.createElement('div');
    card.className = `color-card ${isLocked ? 'locked' : ''}`;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="color-swatch" style="background: ${hex};">
        <div class="lock-indicator" data-index="${index}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${isLocked
              ? '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
              : '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>'
            }
          </svg>
        </div>
      </div>
      <div class="color-info">
        <div class="color-name">Color ${index + 1}</div>
        <div class="color-values">
          <div class="color-value">
            <span class="value-label">HEX</span>
            <input type="text" class="value-text editable" data-index="${index}" data-format="hex" value="${hex.toUpperCase()}" />
            <button class="copy-btn" data-value="${hex}">Copy</button>
          </div>
          <div class="color-value">
            <span class="value-label">RGB</span>
            <input type="text" class="value-text editable" data-index="${index}" data-format="rgb" value="${rgb.r}, ${rgb.g}, ${rgb.b}" />
            <button class="copy-btn" data-value="rgb(${rgb.r}, ${rgb.g}, ${rgb.b})">Copy</button>
          </div>
          <div class="color-value">
            <span class="value-label">HSL</span>
            <input type="text" class="value-text editable" data-index="${index}" data-format="hsl" value="${hsl.h}°, ${hsl.s}%, ${hsl.l}%" />
            <button class="copy-btn" data-value="hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)">Copy</button>
          </div>
        </div>
      </div>
    `;

    paletteContainer.appendChild(card);
  });

  attachCardEventListeners();
}

/**
 * Handle manual color editing
 */
function handleColorEdit(input) {
  const index = parseInt(input.dataset.index);
  const format = input.dataset.format;
  const value = input.value.trim();
  let newColor = null;

  try {
    if (format === 'hex') {
      // Validate HEX format
      if (/^#?[0-9A-F]{6}$/i.test(value)) {
        newColor = value.startsWith('#') ? value : '#' + value;
      }
    } else if (format === 'rgb') {
      // Parse RGB: "255, 128, 64" or "rgb(255, 128, 64)"
      const match = value.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
          newColor = rgbToHex(r, g, b);
        }
      }
    } else if (format === 'hsl') {
      // Parse HSL: "180°, 50%, 50%" or "hsl(180, 50%, 50%)"
      const match = value.match(/(\d+)°?[,\s]+(\d+)%?[,\s]+(\d+)%?/);
      if (match) {
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);
        if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
          const rgb = hslToRgb(h, s, l);
          newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
        }
      }
    }

    if (newColor) {
      currentPalette[index] = newColor;
      renderPalette();
      showToast(`Color ${index + 1} updated!`);
    } else {
      showToast('Invalid color format');
      renderPalette(); // Reset to original value
    }
  } catch (err) {
    showToast('Invalid color format');
    renderPalette(); // Reset to original value
  }
}

/**
 * Attach event listeners to color cards
 */
function attachCardEventListeners() {
  // Lock buttons
  document.querySelectorAll('.lock-indicator').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      toggleLock(index);
    });
  });

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(btn.dataset.value);
    });
  });

  // Editable color values
  document.querySelectorAll('.value-text.editable').forEach(input => {
    input.addEventListener('change', (e) => {
      e.stopPropagation();
      handleColorEdit(input);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        input.blur();
      }
      e.stopPropagation();
    });

    input.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
}

/**
 * Toggle lock on a color
 */
function toggleLock(index) {
  if (lockedColors.has(index)) {
    lockedColors.delete(index);
  } else {
    lockedColors.add(index);
  }
  renderPalette();
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text}`);
  } catch (err) {
    showToast('Failed to copy');
  }
}

/**
 * Show toast notification
 */
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// ===========================
// Save & Export Functions
// ===========================

/**
 * Save current palette to localStorage
 */
function savePalette() {
  const saved = JSON.parse(localStorage.getItem('palettePlay_saved') || '[]');
  const paletteData = {
    colors: currentPalette,
    mode: currentMode,
    timestamp: Date.now()
  };

  saved.unshift(paletteData);
  localStorage.setItem('palettePlay_saved', JSON.stringify(saved.slice(0, 20))); // Keep last 20

  showToast('Palette saved!');
}

/**
 * Export palette as CSS
 */
function exportAsCSS() {
  const css = `:root {\n${currentPalette.map((color, i) =>
    `  --color-${i + 1}: ${color};`
  ).join('\n')}\n}`;

  copyToClipboard(css);
  showToast('Exported as CSS variables');
}

/**
 * Export palette as JSON
 */
function exportAsJSON() {
  const json = JSON.stringify({
    colors: currentPalette,
    mode: currentMode,
    timestamp: new Date().toISOString()
  }, null, 2);

  copyToClipboard(json);
  showToast('Exported as JSON');
}

/**
 * Share palette via URL
 */
function shareViaURL() {
  const colors = currentPalette.map(c => c.replace('#', '')).join('-');
  const url = `${window.location.origin}${window.location.pathname}?palette=${colors}`;

  copyToClipboard(url);
  showToast('Share URL copied!');
}

/**
 * Load palette from URL
 */
function loadPaletteFromURL() {
  const params = new URLSearchParams(window.location.search);
  const paletteParam = params.get('palette');

  if (paletteParam) {
    const colors = paletteParam.split('-').map(c => '#' + c);
    if (colors.length === 5 && colors.every(c => /^#[0-9A-F]{6}$/i.test(c))) {
      currentPalette = colors;
      renderPalette();
      return true;
    }
  }
  return false;
}

// ===========================
// Event Listeners
// ===========================

// Mode selector
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    generatePalette();
  });
});

// Generate button
generateBtn.addEventListener('click', generatePalette);

// Save button
saveBtn.addEventListener('click', savePalette);

// Export button
exportBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  exportMenu.classList.toggle('active');
});

// Export menu items
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    const exportType = item.dataset.export;

    switch (exportType) {
      case 'css':
        exportAsCSS();
        break;
      case 'json':
        exportAsJSON();
        break;
      case 'url':
        shareViaURL();
        break;
    }

    exportMenu.classList.remove('active');
  });
});

// Close export menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.export-dropdown')) {
    exportMenu.classList.remove('active');
  }
});

// Help button
helpBtn.addEventListener('click', () => {
  helpModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  helpModal.classList.remove('active');
});

helpModal.addEventListener('click', (e) => {
  if (e.target === helpModal) {
    helpModal.classList.remove('active');
  }
});

// Click anywhere to generate
document.body.addEventListener('click', (e) => {
  // Don't generate if clicking on controls or cards
  if (e.target.closest('.controls') ||
      e.target.closest('.color-card') ||
      e.target.closest('.header') ||
      e.target.closest('.modal')) {
    return;
  }
  generatePalette();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Don't trigger if modal is open
  if (helpModal.classList.contains('active') && e.key !== 'Escape') {
    return;
  }

  switch (e.key.toLowerCase()) {
    case ' ':
      e.preventDefault();
      generatePalette();
      break;
    case 's':
      e.preventDefault();
      savePalette();
      break;
    case 'l':
      e.preventDefault();
      // Lock first unlocked color
      const firstUnlocked = currentPalette.findIndex((_, i) => !lockedColors.has(i));
      if (firstUnlocked !== -1) {
        toggleLock(firstUnlocked);
      }
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
      e.preventDefault();
      const modes = ['random', 'analogous', 'complementary', 'triadic', 'monochromatic'];
      const modeIndex = parseInt(e.key) - 1;
      if (modes[modeIndex]) {
        currentMode = modes[modeIndex];
        modeBtns.forEach(btn => btn.classList.remove('active'));
        modeBtns[modeIndex].classList.add('active');
        generatePalette();
      }
      break;
    case '?':
      e.preventDefault();
      helpModal.classList.toggle('active');
      break;
    case 'escape':
      helpModal.classList.remove('active');
      exportMenu.classList.remove('active');
      break;
  }
});

// ===========================
// Initialize
// ===========================

function init() {
  // Try to load palette from URL, otherwise generate new one
  if (!loadPaletteFromURL()) {
    generatePalette();
  }
}

init();
