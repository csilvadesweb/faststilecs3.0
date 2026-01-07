/* 🔒 FASTSTILE CS – PROTEÇÃO COMERCIAL */
(function(){
  document.addEventListener("contextmenu",e=>e.preventDefault());
  document.onkeydown=e=>{
    if(e.key==="F12"||(e.ctrlKey&&e.shiftKey)||(e.ctrlKey&&e.key==="u")) return false;
  };
})();

const rendaInput = document.getElementById("renda");
const lista = document.getElementById("lista");

let dados = JSON.parse(localStorage.getItem("faststile")) || {
  renda:0,
  despesas:[]
};

function atualizar(){
  let total = dados.despesas.reduce((s,d)=>s+d.valor,0);
  rResumo.textContent = `R$ ${dados.renda.toFixed(2)}`;
  dResumo.textContent = `R$ ${total.toFixed(2)}`;
  sResumo.textContent = `R$ ${(dados.renda-total).toFixed(2)}`;

  lista.innerHTML="";
  dados.despesas.forEach(d=>{
    lista.innerHTML += `<li>${d.desc}<span>R$ ${d.valor.toFixed(2)}</span></li>`;
  });

  localStorage.setItem("faststile",JSON.stringify(dados));
}

function salvar(){
  dados.renda = Number(rendaInput.value);
  const desc = document.getElementById("desc").value;
  const valor = Number(document.getElementById("valor").value);
  if(desc && valor){
    dados.despesas.push({desc,valor});
    document.getElementById("desc").value="";
    document.getElementById("valor").value="";
  }
  atualizar();
}

function backup(){
  const blob = new Blob([JSON.stringify(dados)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="faststile-backup.json";
  a.click();
}

function exportarPDF(){
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let y=10;

  pdf.text("FastStile CS - Relatório",10,y); y+=10;
  pdf.text(`Renda: R$ ${dados.renda.toFixed(2)}`,10,y); y+=8;

  dados.despesas.forEach(d=>{
    pdf.text(`${d.desc} - R$ ${d.valor.toFixed(2)}`,10,y);
    y+=7;
  });

  pdf.save("faststile.pdf");
}

function limpar(){
  if(confirm("Deseja apagar tudo?")){
    localStorage.removeItem("faststile");
    location.reload();
  }
}

/* 🌗 Tema */
toggleTheme.onclick=()=>{
  document.documentElement.dataset.theme =
  document.documentElement.dataset.theme==="dark"?"light":"dark";
};

atualizar();