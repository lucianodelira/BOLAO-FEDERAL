const API_URL = 'https://script.google.com/macros/s/AKfycbzS32wgwNYZhNQhXQ17OSQUx56NbRuZmrv5l0Hi2cm7k_0WzqZ-BtfQy3BIKzoQZaId/exec';

let paymentId = null;

function participar() {
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !telefone) {
    alert('Preencha nome e telefone');
    return;
  }

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'createPayment',
      nome,
      telefone
    })
  })
  .then(r => r.text())
  .then(t => {
    console.log('Resposta bruta:', t);
    const d = JSON.parse(t);

    if (!d.success) {
      alert(d.message || 'Erro ao gerar PIX');
      return;
    }

    paymentId = d.paymentId;

    document.getElementById('pixQr').src =
      'data:image/png;base64,' + d.qrCodeBase64;

    document.getElementById('pixCopia').value = d.pixKey;
    document.getElementById('pixArea').classList.remove('hidden');

    verificarPagamento();
  })
  .catch(err => {
    console.error(err);
    alert('Erro de conexão com o servidor');
  });
}


  fetch(API_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'createPayment',
    nome,
    telefone
  })
})
    
  .then(r => r.json())
  .then(d => {
    if (!d.success) {
      alert(d.message || 'Erro');
      return;
    }

    paymentId = d.paymentId;

    document.getElementById('pixQr').src =
      'data:image/png;base64,' + d.qrCodeBase64;

    document.getElementById('pixCopia').value = d.pixKey;
    document.getElementById('pixArea').classList.remove('hidden');

    verificarPagamento();
  });
}

function verificarPagamento() {
  const timer = setInterval(() => {
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'checkPayment',
        paymentId
      })
    })
    .then(r => r.json())
    .then(d => {
      if (d.status === 'PAID') {
        clearInterval(timer);
        document.getElementById('pixStatus').innerText =
          'Pagamento confirmado! 🎉';
        location.reload();
      }
    });
  }, 5000);
}


function copiarPix() {
  navigator.clipboard.writeText(
    document.getElementById('pixCopia').value
  );
  alert('PIX copiado');
}
