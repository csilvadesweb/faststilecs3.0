let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

const totalEl = document.getElementById('total');
const listaEl = document.getElementById('lista');

function salvar() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
  atualizar();
}

function adicionarGasto() {
  const desc = document.getElementById('descricao').value;
  const valor = Number(document.getElementById('valor').value);

  if (!desc || !valor) return;

  gastos.push({
    desc,
    valor,
    data: new Date().toLocaleDateString()
  });

  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';

  salvar();
}

function atualizar() {
  listaEl.innerHTML = '';
  let total = 0;

  gastos.forEach(g => {
    total += g.valor;
    listaEl.innerHTML += `<li>${g.data} - ${g.desc} - R$ ${g.valor}</li>`;
  });

  totalEl.innerText = `R$ ${total.toFixed(2)}`;
  atualizarGrafico();
}

const ctx = document.getElementById('grafico');
let grafico;

function atualizarGrafico() {
  const valores = gastos.map(g => g.valor);
  const labels = gastos.map((_, i) => i + 1);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Gastos',
        data: valores,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

atualizar();