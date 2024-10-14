document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
document.getElementById('btn-confirmar-remocao').addEventListener('click', function() {
    console.log('Botão de remover usuário clicado');
    const usuarioIdToRemove = localStorage.getItem('usuarioIdToRemove');
    window.parent.postMessage({ action: 'remover', usuarioId: usuarioIdToRemove }, '*');
});

function fecharModal() {
    console.log('Botão de cancelar clicado');
    window.parent.postMessage({ action: 'fechar' }, '*');
}

// Recebe a mensagem do pai com o ID do usuário
window.addEventListener('message', function(event) {
    if (event.data.action === 'remover') {
        console.log('Recebido ID do usuário para remover:', event.data.usuarioId);
        window.usuarioIdToRemove = event.data.usuarioId;
    }
});