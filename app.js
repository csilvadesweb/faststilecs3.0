let dados = JSON.parse(localStorage.getItem("faststile")) || {};

let mesAtual = new Date().toISOString().slice(0,7);

function salvarDados(){
  dados[mesAtual] = dados[mesAtual] || { despesas: [] };
  dados[mesAtual].renda = Number(renda.value);
  dados[mesAtual].meta = Number(meta.value);
  localStorage.setItem("faststile", JSON.stringify(dados));
  atualizar();
}

function addDespesa(){
  dados[mesAtual] = dados[mesAtual] || { despesas: [] };
  dados[mesAtual].despesas.push({
    valor: Number(valorDespesa.value),
    categoria: categoria.value
  });
  salvarDados();
}

function atualizar(){
  let d = dados[mesAtual] || { despesas: [] };
  let total = d.despesas.reduce((s,e)=>s+e.valor,0);
  totalDespesas.innerText = "R$ " + total.toFixed(2);
  sobra.innerText = "R$ " + ((d.renda||0)-total).toFixed(2);
  status.innerText = total <= (d.meta||0) ? "Dentro da meta" : "Estourou a meta";
  desenharGrafico(d.despesas);
}

function desenharGrafico(despesas){
  let mapa = {};
  despesas.forEach(d=>mapa[d.categoria]=(mapa[d.categoria]||0)+d.valor);
  new Chart(grafico,{
    type:'pie',
    data:{labels:Object.keys(mapa),datasets:[{data:Object.values(mapa)}]}
  });
}

function exportarCSV(){
  let csv="Mes,Categoria,Valor\n";
  Object.keys(dados).forEach(m=>{
    dados[m].despesas.forEach(d=>{
      csv+=`${m},${d.categoria},${d.valor}\n`;
    });
  });
  let blob=new Blob([csv]);
  let a=document=Object.assign(document.createElement("a"),{
    href:URL.createObjectURL(blob),
    download:"faststile.csv"
  });
  a.click();
}

function importarCSV(e){
  let file=e.target.files[0];
  let r=new FileReader();
  r.onload=()=>alert("Importação pronta (implementar merge se quiser)");
  r.readAsText(file);
}

function trocarMes(){
  mesAtual = mes.value;
  atualizar();
}

function init(){
  let sel=document.getElementById("mes");
  Object.keys(dados).forEach(m=>{
    let o=document.createElement("option");
    o.value=o.innerText=m;
    sel.appendChild(o);
  });
  atualizar();
}

init();