/* 🔒 FASTSTILE CS – PROTEÇÃO COMERCIAL */
(function(){
  document.addEventListener("contextmenu",e=>e.preventDefault());
  document.onkeydown=e=>{
    if(
      e.key==="F12" ||
      (e.ctrlKey && e.shiftKey) ||
      (e.ctrlKey && e.key.toLowerCase()==="u")
    ) return false;
  };
})();

/* ===================== DADOS ===================== */
const rendaInput = document.getElementById("renda");
const lista = document.getElementById("lista");

let dados = JSON.parse(localStorage.getItem("faststile")) || {
  renda: 0,
  despesas: []
};

/* ===================== ATUALIZAR UI ===================== */
function atualizar(){
  const totalDespesas = dados.despesas.reduce((s,d)=>s+d.valor,0);
  const sobra = dados.renda - totalDespesas;

  rResumo.textContent = formatar(dados.renda);
  dResumo.textContent = formatar(totalDespesas);
  sResumo.textContent = formatar(sobra);
  sResumo.style.color = sobra < 0 ? "#ef4444" : "#22c55e";

  lista.innerHTML="";
  dados.despesas.forEach((d,i)=>{
    lista.innerHTML += `
      <li>${i+1}. ${d.desc}
        <span>${formatar(d.valor)}</span>
      </li>
    `;
  });

  localStorage.setItem("faststile",JSON.stringify(dados));
}

/* ===================== AÇÕES ===================== */
function salvar(){
  dados.renda = Number(rendaInput.value || dados.renda);

  const desc = document.getElementById("desc").value;
  const valor = Number(document.getElementById("valor").value);

  if(desc && valor){
    dados.despesas.push({
      desc,
      valor,
      data: new Date().toLocaleDateString("pt-BR")
    });
    document.getElementById("desc").value="";
    document.getElementById("valor").value="";
  }
  atualizar();
}

function backup(){
  const blob = new Blob([JSON.stringify(dados,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="faststile-backup.json";
  a.click();
}

function limpar(){
  if(confirm("Deseja apagar todos os dados?")){
    localStorage.removeItem("faststile");
    location.reload();
  }
}

/* ===================== PDF COM GRÁFICO ===================== */
function exportarPDF(){
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const totalDespesas = dados.despesas.reduce((s,d)=>s+d.valor,0);
  const sobra = dados.renda - totalDespesas;

  let y = 15;
  const pageHeight = 280;

  /* TÍTULO */
  pdf.setFontSize(16);
  pdf.text("FastStile CS – Relatório Financeiro", 10, y);
  y += 10;

  pdf.setFontSize(11);
  pdf.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`,10,y);
  y += 12;

  /* RESUMO */
  pdf.setFontSize(13);
  pdf.text("Resumo Financeiro",10,y);
  y += 8;

  pdf.setFontSize(11);
  pdf.text(`Renda Mensal: ${formatar(dados.renda)}`,10,y); y+=7;
  pdf.text(`Total de Despesas: ${formatar(totalDespesas)}`,10,y); y+=7;
  pdf.text(
    sobra >= 0
      ? `Sobra: ${formatar(sobra)}`
      : `Déficit: ${formatar(sobra)}`,
    10,
    y
  );
  y += 12;

  /* ===== GRÁFICO ===== */
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");

  const total = dados.renda || 1;
  const despPerc = totalDespesas / total;
  const sobraPerc = Math.max(sobra,0) / total;

  // Despesas
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(50, 180 - (despPerc * 150), 80, despPerc * 150);
  ctx.fillText("Despesas", 55, 195);

  // Sobra
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(180, 180 - (sobraPerc * 150), 80, sobraPerc * 150);
  ctx.fillText("Sobra", 205, 195);

  const img = canvas.toDataURL("image/png");
  pdf.addImage(img,"PNG",10,y,180,90);
  y += 100;

  /* HISTÓRICO */
  pdf.setFontSize(13);
  pdf.text("Histórico de Despesas",10,y);
  y += 8;

  pdf.setFontSize(10);

  if(dados.despesas.length === 0){
    pdf.text("Nenhuma despesa registrada.",10,y);
  } else {
    dados.despesas.forEach((d,i)=>{
      if(y > pageHeight){
        pdf.addPage();
        y = 15;
      }
      pdf.text(
        `${i+1}. ${d.desc} – ${formatar(d.valor)} – ${d.data}`,
        10,
        y
      );
      y += 6;
    });
  }

  /* RODAPÉ */
  pdf.setFontSize(9);
  pdf.text(
    "© 2026 FastStile CS • Desenvolvido por C.Silva • Uso protegido",
    10,
    290
  );

  pdf.save("faststile-relatorio-completo-com-grafico.pdf");
}

/* ===================== TEMA ===================== */
toggleTheme.onclick = ()=>{
  document.documentElement.dataset.theme =
    document.documentElement.dataset.theme==="dark" ? "light" : "dark";
};

/* ===================== UTIL ===================== */
function formatar(v){
  return `R$ ${Number(v).toFixed(2)}`;
}

/* ===================== INIT ===================== */
atualizar();

console.log(
  "%cFastStile CS © C.Silva",
  "color:#0d6efd;font-size:14px;font-weight:bold"
);