// ===============================
// FASTSTILE 4.0 - SCRIPT PRINCIPAL
// ===============================

const storageKey = "faststile_data_v4";

const defaultData = {
  renda: 0,
  meta: 0,
  mesAtual: new Date().getMonth(),
  historico: {}
};

let data = JSON.parse(localStorage.getItem(storageKey)) || defaultData;

// -------------------------------
// UTILIDADES
// -------------------------------
function salvar() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function obterMes() {
  const meses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];
  return meses[data.mesAtual];
}

function getMesData() {
  if (!data.historico[data.mesAtual]) {
    data.historico[data.mesAtual] = [];
  }
  return data.historico[data.mesAtual];
}

// -------------------------------
// RENDER PRINCIPAL
// -------------------------------
function render() {
  document.getElementById("mesAtual").innerText = obterMes();
  document.getElementById("renda").value = data.renda;
  document.getElementById("meta").value = data.meta;

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;
  const categorias = {};

  getMesData().forEach((item, index) => {
    total += item.valor;
    categorias[item.categoria] = (categorias[item.categoria] || 0) + item.valor;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} - R$ ${item.valor.toFixed(2)} (${item.categoria})
      <button onclick="remover(${index})">❌</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("saldo").innerText = (data.renda - total).toFixed(2);

  atualizarStatus(total);
  atualizarGrafico(categorias);
  salvar();
}

// -------------------------------
// STATUS / META
// -------------------------------
function atualizarStatus(total) {
  const status = document.getElementById("status");
  if (!data.meta) {
    status.innerText = "Meta não definida";
    status.style.color = "gray";
    return;
  }

  const percentual = (total / data.meta) * 100;

  if (percentual < 70) {
    status.innerText = "Dentro da meta ✅";
    status.style.color = "green";
  } else if (percentual < 100) {
    status.innerText = "Atenção ⚠️";
    status.style.color = "orange";
  } else {
    status.innerText = "Meta ultrapassada ❌";
    status.style.color = "red";
  }
}

// -------------------------------
// AÇÕES
// -------------------------------
function adicionar() {
  const nome = document.getElementById("nome").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;

  if (!nome || !valor) return alert("Preencha tudo");

  getMesData().push({ nome, valor, categoria });

  document.getElementById("nome").value = "";
  document.getElementById("valor").value = "";

  render();
}

function remover(index) {
  getMesData().splice(index, 1);
  render();
}

function limparMes() {
  if (confirm("Deseja apagar todos os dados deste mês?")) {
    data.historico[data.mesAtual] = [];
    render();
  }
}

// -------------------------------
// RENDA / META
// -------------------------------
function atualizarRenda(valor) {
  data.renda = parseFloat(valor) || 0;
  render();
}

function atualizarMeta(valor) {
  data.meta = parseFloat(valor) || 0;
  render();
}

// -------------------------------
// HISTÓRICO MENSAL
// -------------------------------
function mudarMes(delta) {
  data.mesAtual += delta;

  if (data.mesAtual < 0) data.mesAtual = 11;
  if (data.mesAtual > 11) data.mesAtual = 0;

  render();
}

// -------------------------------
// EXPORTAR CSV
// -------------------------------
function exportarCSV() {
  let csv = "Nome,Valor,Categoria\n";
  getMesData().forEach(i => {
    csv += `${i.nome},${i.valor},${i.categoria}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `faststile-${obterMes()}.csv`;
  a.click();
}

// -------------------------------
// GRÁFICO
// -------------------------------
let chart;

function atualizarGrafico(dados) {
  const ctx = document.getElementById("grafico");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(dados),
      datasets: [{
        data: Object.values(dados)
      }]
    }
  });
}

// -------------------------------
// INIT
// -------------------------------
render();