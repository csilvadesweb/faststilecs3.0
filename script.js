const PIN = localStorage.getItem('pin') || '1234';
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

const loginDiv = document.getElementById('login');
const app = document.getElementById('app');

function login() {
  if (document.getElementById('pin').value === PIN) {
    loginDiv.style.display = 'none';
    app.classList.remove('hidden');
    render();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

function save() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
  render();
}

function add() {
  const desc = descEl.value;
  const valor = +valorEl.value;
  const cat = categoria.value;
  if (!desc || !valor) return;

  gastos.push({ desc, valor, cat });
  descEl.value = valorEl.value = '';
  save();
}

const descEl = document.getElementById('desc');
const valorEl = document.getElementById('valor');
const categoria = document.getElementById('categoria');
const lista = document.getElementById('lista');
const totalEl = document.getElementById('total');

let linha, pizza;

function render() {
  lista.innerHTML = '';
  let total = 0;

  gastos.forEach(g => {
    total += g.valor;
    lista.innerHTML += `<li>${g.cat} - ${g.desc} - R$ ${g.valor}</li>`;
  });

  totalEl.innerText = `R$ ${total.toFixed(2)}`;
  drawCharts();
}

function drawCharts() {
  const valores = gastos.map(g => g.valor);
  const labels = gastos.map((_, i) => i + 1);

  linha?.destroy();
  linha = new Chart(linhaCtx, {
    type: 'line',
    data: { labels, datasets: [{ data: valores, borderColor:'#3b82f6', fill:true }] }
  });

  const porCat = {};
  gastos.forEach(g => porCat[g.cat] = (porCat[g.cat] || 0) + g.valor);

  pizza?.destroy();
  pizza = new Chart(pizzaCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(porCat),
      datasets: [{ data: Object.values(porCat) }]
    }
  });
}

const linhaCtx = document.getElementById('linha');
const pizzaCtx = document.getElementById('pizza');

function exportCSV() {
  let csv = "Descrição,Valor,Categoria\n";
  gastos.forEach(g => csv += `${g.desc},${g.valor},${g.cat}\n`);
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'faststile.csv';
  a.click();
}