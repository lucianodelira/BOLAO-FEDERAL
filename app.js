const API = "https://script.google.com/macros/s/AKfycbwPXlgv795gYZZIXU8oi56a-yd4iQZ_5BGGYpQP_LK9jJFfBEY83uZ8qluXEDJncBjtKA/exec";
const MAX = 200;

function participar(){
  const nome = nomeInput.value.trim();
  const telefone = telefoneInput.value.trim();
  if(!nome || !telefone){
    statusMsg.innerText = "Preencha nome e telefone";
    return;
  }
  localStorage.setItem("pendente", JSON.stringify({nome, telefone}));
  openPaymentModal();
}

async function carregar(){
  const r = await fetch(API+"?action=infoBolao");
  const d = await r.json();

  livres.innerText = MAX - d.total;
  ocupadas.innerText = d.total;

  lista.innerHTML = "";
  d.participantes.forEach(p=>{
    const li=document.createElement("li");
    li.textContent = `${p.nome} - ${p.telefone}`;
    lista.appendChild(li);
  });

  if(localStorage.getItem("membro")){
    const m = JSON.parse(localStorage.getItem("membro"));
    register.classList.add("hidden");
    areaMembro.classList.remove("hidden");
    mNome.innerText = m.nome;
    mTel.innerText = m.telefone;
  }
}

function verBolao(){
  bolao.classList.toggle("hidden");
}

if(localStorage.getItem("privilegeAccess")==="true"){
  const u = JSON.parse(localStorage.getItem("pendente"));
  fetch(API+"?action=registrar&nome="+encodeURIComponent(u.nome)+"&telefone="+encodeURIComponent(u.telefone))
  .then(r=>r.json())
  .then(d=>{
    if(d.success){
      localStorage.setItem("membro", JSON.stringify(u));
      localStorage.removeItem("pendente");
      localStorage.removeItem("privilegeAccess");
      location.reload();
    }
  });
}

carregar();
