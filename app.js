// ===== App Color RGB: sliders + inputs numéricos + color picker =====

// Utilidades
function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }
function toHex(n) {
  const v = clamp(parseInt(n, 10) || 0, 0, 255);
  return v.toString(16).padStart(2, '0').toUpperCase();
}
function hexToRgb(hex) {
  // Admite "#RRGGBB" o "RRGGBB"
  const s = hex.startsWith('#') ? hex.slice(1) : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16)
  };
}

// Render principal
function updateUI(r, g, b) {
  const hex = `${toHex(r)}${toHex(g)}${toHex(b)}`;
  const rgbStr = `rgb(${r}, ${g}, ${b})`;

  // Vista previa y textos
  document.getElementById('swatch').style.background = rgbStr;
  document.getElementById('hexText').textContent = `#${hex}`;
  document.getElementById('rgbText').textContent = rgbStr;
  document.getElementById('hexOut').value = hex;

  // Badges
  document.getElementById('redBadge').textContent = r;
  document.getElementById('greenBadge').textContent = g;
  document.getElementById('blueBadge').textContent = b;

  // Sliders, inputs numéricos y color picker sincronizados
  document.getElementById('red').value = r;
  document.getElementById('green').value = g;
  document.getElementById('blue').value = b;
  document.getElementById('redNum').value = r;
  document.getElementById('greenNum').value = g;
  document.getElementById('blueNum').value = b;

  const picker = document.getElementById('colorPicker');
  if (picker) picker.value = `#${hex}`;
}

// Estado
const state = { r: 128, g: 128, b: 128 };

// Elementos
const elR = document.getElementById('red');
const elG = document.getElementById('green');
const elB = document.getElementById('blue');
const nrR = document.getElementById('redNum');
const nrG = document.getElementById('greenNum');
const nrB = document.getElementById('blueNum');
const btnCopy = document.getElementById('btnCopy');
const btnReset = document.getElementById('btnReset');
const colorPicker = document.getElementById('colorPicker');

// Sliders (1 listener por elemento)
const onSlidersInput = () => {
  state.r = clamp(parseInt(elR.value, 10) || 0, 0, 255);
  state.g = clamp(parseInt(elG.value, 10) || 0, 0, 255);
  state.b = clamp(parseInt(elB.value, 10) || 0, 0, 255);
  updateUI(state.r, state.g, state.b);
};
[elR, elG, elB].forEach(el => el.addEventListener('input', onSlidersInput));

// Inputs numéricos
const onNumbersChange = () => {
  const r = clamp(parseInt(nrR.value, 10) || 0, 0, 255);
  const g = clamp(parseInt(nrG.value, 10) || 0, 0, 255);
  const b = clamp(parseInt(nrB.value, 10) || 0, 0, 255);
  state.r = r; state.g = g; state.b = b;
  updateUI(state.r, state.g, state.b);
};
[nrR, nrG, nrB].forEach(el => {
  el.addEventListener('input', onNumbersChange);
  el.addEventListener('change', onNumbersChange);
});

// Color picker
colorPicker.addEventListener('input', () => {
  const rgb = hexToRgb(colorPicker.value);
  if (!rgb) return;
  state.r = rgb.r; state.g = rgb.g; state.b = rgb.b;
  updateUI(state.r, state.g, state.b);
});

// Copiar HEX
btnCopy.addEventListener('click', async () => {
  const hex = document.getElementById('hexOut').value; // sin '#'
  try {
    await navigator.clipboard.writeText(`#${hex}`);
    btnCopy.textContent = '¡Copiado!';
    setTimeout(() => (btnCopy.textContent = 'Copiar'), 1200);
  } catch (e) {
    const input = document.getElementById('hexOut');
    input.select();
    document.execCommand('copy');
    btnCopy.textContent = '¡Copiado!';
    setTimeout(() => (btnCopy.textContent = 'Copiar'), 1200);
  }
});

// Reset
btnReset.addEventListener('click', () => {
  state.r = 128; state.g = 128; state.b = 128;
  updateUI(state.r, state.g, state.b);
});

// Init
updateUI(state.r, state.g, state.b);
