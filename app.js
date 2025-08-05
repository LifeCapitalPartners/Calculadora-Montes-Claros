// Função PMT (mesma usada na calculadora original)
function pmt(rate, nper, pv) {
  return rate === 0 ? -(pv / nper) : -(pv * rate) / (1 - Math.pow(1 + rate, -nper));
}

const taxa = 0.009488; // 0,9488% ao mês

/* ---------- Sliders & bubbles ---------- */
function setBubble(range) {
  const bubble = range.parentNode.querySelector('.bubble');
  const val = range.value;
  const min = range.min || 0;
  const max = range.max || 100;
  const percent = (val - min) * 100 / (max - min);
  bubble.textContent = 'R$ ' + parseFloat(val).toLocaleString('pt-BR');
  bubble.style.left = `calc(${percent}% + (${8 - percent * 0.15}px))`;
}

// Atualiza a cor da barra do slider conforme o valor
function updateSliderFill(slider) {
  const min = Number(slider.min) || 0;
  const max = Number(slider.max) || 100;
  const val = Number(slider.value);
  const percent = ((val - min) * 100) / (max - min);
  slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`;
}

// DOM elements
const terrenoSlider  = document.getElementById('valorTerrenoSlider');
const terrenoInput   = document.getElementById('valorTerreno');
const entradaSlider  = document.getElementById('valorEntradaSlider');
const entradaInput   = document.getElementById('valorEntrada');

// Botões de parcelas da entrada
const parcelButtons = document.querySelectorAll('.parcel-btn');
parcelButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    parcelButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Inicializar bubbles
[terrenoSlider, entradaSlider].forEach(setBubble);

// Inicializar preenchimento azul dos sliders
[terrenoSlider, entradaSlider].forEach(slider => {
  updateSliderFill(slider);
  slider.addEventListener('input', e => updateSliderFill(e.target));
});

// Sincronização slider <-> input
terrenoSlider.addEventListener('input', e => {
  terrenoInput.value = e.target.value;
  setBubble(e.target);
});
terrenoInput.addEventListener('input', e => {
  terrenoSlider.value = e.target.value || 0;
  setBubble(terrenoSlider);
});

entradaSlider.addEventListener('input', e => {
  entradaInput.value = e.target.value;
  setBubble(e.target);
});
entradaInput.addEventListener('input', e => {
  entradaSlider.value = e.target.value || 0;
  setBubble(entradaSlider);
});

// Form submit
document.getElementById('calcForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const valorTerreno   = parseFloat(terrenoInput.value) || 0;
  const valorEntrada   = parseFloat(entradaInput.value) || 0;
  const parcelasEnt    = parseInt(document.querySelector('.btn-option.active')?.dataset.parc || '1', 10);
  const mesesFin       = Math.max(parseInt(document.getElementById('mesesInput').value, 10) || 1, 1);

  const valorFinanciado = Math.max(valorTerreno - valorEntrada, 0);

  if (valorFinanciado <= 0) {
    resultadoBox.textContent = 'Entrada cobre todo o valor do terreno.';
    return;
  }

  const parcelaFinanc  = Math.abs(pmt(taxa, mesesFin, valorFinanciado));
  const parcelaEntrada = valorEntrada / parcelasEnt;
  const parcelaTotal   = parcelaFinanc + parcelaEntrada;

  const resultadoEl = document.getElementById('resultado');
  resultadoEl.innerHTML = `<div class="valor-caption">Parcela mensal (financiamento + entrada)</div><div class="valor-value">R$ ${parcelaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>`;
  resultadoEl.style.display = 'block';
}); 