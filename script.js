const rendaInput = document.getElementById("rendaInput");
const totalDespesasEl = document.getElementById("totalDespesas");
const sobraEl = document.getElementById("sobra");
const statusEl = document.getElementById("status");

const modal = document.getElementById("modal");
const categoriaSelect = document.getElementById("categoria");
const valorDespesaInput = document.getElementById("valorDespesa");

const categorias = [
  "DZ","Alimentação + Feira","Internet","Telefone","Moradia","INSS",
  "Remédio","Pet","Combustível","Restaurante","Passeios","Férias",
  "Cinema","Imprevistos","Emergências","Outras despesas"
];

categorias.forEach(c => {
  const opt = document.createElement("option");
  opt.value = c;
  opt.textContent = c;
  categoriaSelect.appendChild(opt);
});

let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
rendaInput.value = localStorage.getItem("renda") || 0;

function atualizar() {
  const renda = Number(rendaInput.value) || 0;
  const total = despesas.reduce((s, d) => s + Number(d.valor), 0);
  const sobra = renda - total;

  totalDespesasEl.innerText = `R$ ${total.toFixed(2)}`;
  sobraEl.innerText = `R$ ${sobra.toFixed(2)}`;

  if (sobra >= 0) {
    statusEl.innerText = "Financeiro Exemplar 🏆";
  } else {
    statusEl.innerText = "Atenção: abaixo da meta!";
  }

  localStorage.setItem("renda", renda);
  localStorage.setItem("despesas", JSON.stringify(despesas));
}

rendaInput.addEventListener("input", atualizar);

document.getElementById("addDespesa").onclick = () => modal.style.display = "block";
document.getElementById("fecharModal").onclick = () => modal.style.display = "none";

document.getElementById("salvarDespesa").onclick = () => {
  despesas.push({
    categoria: categoriaSelect.value,
    valor: valorDespesaInput.value
  });
  valorDespesaInput.value = "";
  modal.style.display = "none";
  atualizar();
};

document.getElementById("resetar").onclick = () => {
  localStorage.clear();
  despesas = [];
  rendaInput.value = 0;
  atualizar();
};

document.getElementById("darkToggle").onclick = () =>
  document.body.classList.toggle("dark");

atualizar();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}