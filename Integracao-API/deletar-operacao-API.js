document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
document.getElementById('btn-confirmar-remocao').addEventListener('click', function() {
    console.log('Botão de remover usuário clicado');
    console.log('Usuário ID:', window.parent.usuarioIdToRemove);
    const usuarioIdToRemove = window.parent.usuarioIdToRemove;
    if (usuarioIdToRemove) {
        deleteOperacao(usuarioIdToRemove);
    } else {
        console.error('ID do usuário não encontrado');
    }
});

function fecharModal() {
    console.log('Botão de cancelar clicado');
    window.parent.postMessage({ action: 'fechar' }, '*');
}

// Função para deletar o usuário
async function deleteOperacao(id) {
    console.log('ID do usuário para deletar: ', id);
    try {
        const response = await fetch(`https://localhost:7237/api/CriarOperacao/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log('Recurso deletado');
            window.parent.postMessage({ action: 'fechar' }, '*'); // Fecha o modal após deletar
            window.parent.location.reload(); // Recarrega a página principal para atualizar a lista
        } else {
            console.error('Erro ao deletar recurso');
        }
    } catch (error) {
        console.error('Erro ao deletar recurso:', error);
    }
}