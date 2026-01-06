const PIN = '1234';

let renda = Number(localStorage.getItem('renda')) || 0;
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

const loginDiv = document.getElementById('login');
const app = document.getElementById('app');

function login() {
  if (pin.value === PIN) {
    loginDiv.style.display = 'none';
    app.classList.remove('hidden');
    render();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

function salvarRenda() {
  renda = Number(document.getElementById('renda').value);
  localStorage.setItem('renda', renda);
  render();
}

function add() {
  if (!desc.value || !valor.value) return;
  gastos.push({
    desc: desc.value,
    valor: Number(valor.value),
    cat: categoria.value
  });
  desc.value = valor.value = '';
  save();
}

function save() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
  render();
}

function resetar() {
  if (!confirm('Deseja apagar tudo?')) return;
  gastos = [];
  renda = 0;
  localStorage.clear();
  render();
}

const desc = document.getElementById('desc');
const valor = document.getElementById('valor');
const categoria = document.getElementById('categoria');

const lista = document.getElementById('lista');
const rendaTxt = document.getElementById('rendaTxt');
const despesasTxt = document.getElementById('despesasTxt');
const saldoTxt = document.getElementById('saldoTxt');
const statusTxt = document.getElementById('status');

let linha, pizza;

function render() {
  lista.innerHTML = '';
  let despesas = 0;

  gastos.forEach(g => {
    despesas += g.valor;
    lista.innerHTML += `<li>${g.cat} - ${g.desc} - R$ ${g.valor}</li>`;
  });

  const saldo = renda - despesas;

  rendaTxt.innerText = `R$ ${renda.toFixed(2)}`;
  despesasTxt.innerText = `R$ ${despesas.toFixed(2)}`;
  saldoTxt.innerText = `R$ ${saldo.toFixed(2)}`;

  if (saldo > renda * 0.3) {
    statusTxt.innerText = '🟢 Situação Financeira Positiva';
    statusTxt.style.color = 'var(--ok)';
  } else if (saldo >= 0) {
    statusTxt.innerText = '🟡 Atenção aos Gastos';
    statusTxt.style.color = 'var(--alert)';
  } else {
    statusTxt.innerText = '🔴 Situação Negativa';
    statusTxt.style.color = 'var(--bad)';
  }

  drawCharts();
}

function drawCharts() {
  linha?.destroy();
  pizza?.destroy();

  linha = new Chart(document.getElementById('linha'), {
    type: 'line',
    data: {
      labels: gastos.map((_, i) => i + 1),
      datasets: [{
        data: gastos.map(g => g.valor),
        borderColor: '#3b82f6',
        fill: true
      }]
    }
  });

  const porCat = {};
  gastos.forEach(g => porCat[g.cat] = (porCat[g.cat] || 0) + g.valor);

  pizza = new Chart(document.getElementById('pizza'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(porCat),
      datasets: [{ data: Object.values(porCat) }]
    }
  });
}

render();