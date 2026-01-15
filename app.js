const API_URL = "https://script.google.com/macros/s/AKfycbwPXlgv795gYZZIXU8oi56a-yd4iQZ_5BGGYpQP_LK9jJFfBEY83uZ8qluXEDJncBjtKA/exec";

let paymentIdGlobal = null;

function participar() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !telefone) {
    alert("Preencha nome e telefone");
    return;
  }

  // Salva temporariamente
  localStorage.setItem("bolao_user", JSON.stringify({ nome, telefone }));

  criarPix();
}

/* =========================
   CRIAR PIX
========================= */
function criarPix() {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "createPayment",
      amount: 18
    })
  })
  .then(r => r.json())
  .then(d => {
    if (!d.success) {
      alert("Erro ao gerar Pix");
      return;
    }

    paymentIdGlobal = d.paymentId;

    mostrarPix(d.pixKey, d.qrCodeBase64);
    iniciarVerificacao();
  });
}

/* =========================
   MOSTRAR PIX NA TELA
========================= */
function mostrarPix(copiaCola, qrBase64) {
  document.getElementById("pixArea").style.display = "block";
  document.getElementById("pixCopia").value = copiaCola;
  document.getElementById("pixQr").src = `data:image/png;base64,${qrBase64}`;
}

/* =========================
   VERIFICAR PAGAMENTO
========================= */
function iniciarVerificacao() {
  const interval = setInterval(() => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkPayment",
        paymentId: paymentIdGlobal
      })
    })
    .then(r => r.json())
    .then(d => {
      if (d.status === "approved" || d.status === "PAID") {
        clearInterval(interval);
        liberarAcesso();
      }
    });
  }, 5000);
}

/* =========================
   LIBERAR BOLÃO
========================= */
function liberarAcesso() {
  const user = JSON.parse(localStorage.getItem("bolao_user"));

  fetch(`${API_URL}?action=registrar&nome=${encodeURIComponent(user.nome)}&telefone=${encodeURIComponent(user.telefone)}`)
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        alert("Pagamento confirmado! Você entrou no bolão 🎉");
        location.reload();
      }
    });
}
