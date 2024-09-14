document.addEventListener('DOMContentLoaded', function() {
    let modalOpacidade = document.getElementById('opacidade');
    let btnNotificacoes = document.getElementById('btn-notificacoes');
    let modalNotificacoes = document.getElementById('modal-notificacoes');
    let btnShare = document.getElementById('btn-share');
    let modalShare = document.getElementById('modal-share');
    let btnPerfil = document.getElementById('btn-perfil');
    let modalPerfil = document.getElementById('modal-perfil');
    let btnExcluir = document.getElementById('btn-excluir');
    let modalExcluir = document.getElementById('modal-excluir');
    let btnEditaropc = document.getElementById('btn-editar-opc');
    let modalEditaropc = document.getElementById('modal-editar-opc');

    if (btnPerfil) {
        btnPerfil.addEventListener('click', function() {
            modalPerfil.classList.toggle('show');
        });
    }

    if (btnNotificacoes) {
        btnNotificacoes.addEventListener('click', function() {
            modalNotificacoes.classList.toggle('show');
        });
    }

    if (btnShare) {
        btnShare.addEventListener('click', function() {
            if (modalOpacidade) {
                modalOpacidade.classList.toggle('show');
            }
            if (modalShare) {
                modalShare.classList.toggle('show');
            }
        });
    }

    if (btnExcluir) {
        btnExcluir.addEventListener('click', function() {
            modalOpacidade.classList.toggle('show');
            modalExcluir.classList.toggle('show');
        });
    }

    // if (btnEditaropc) {
    //     btnEditaropc.addEventListener('click', function() {
    //         modalOpacidade.classList.toggle('show');
    //         modalEditaropc.classList.toggle('show');
    //     });
    // }

    if (modalOpacidade) {
        modalOpacidade.addEventListener('click', function() {
            modalOpacidade.classList.remove('show');
            if (modalNotificacoes) modalNotificacoes.classList.remove('show');
            if (modalShare) modalShare.classList.remove('show');
            if (modalPerfil) modalPerfil.classList.remove('show');
            if (modalExcluir) modalExcluir.classList.remove('show');
            if (modalEditaropc) modalEditaropc.classList.remove('show');
        });
    }

    window.addEventListener('message', function(event) {
        if (event.data.action === 'cancelar') {
            if (modalOpacidade) {
                modalOpacidade.classList.remove('show');
            }
            if (modalExcluir) {
                modalExcluir.classList.remove('show');
            }
        } else if (event.data.action === 'remover') {
            if (modalOpacidade) {
                modalOpacidade.classList.remove('show');
            }
            if (modalExcluir) {
                modalExcluir.classList.remove('show');
            }
        } else if (event.data.action === 'ativarOpacidadeTotal') {
            if (modalOpacidade) {
                modalOpacidade.classList.toggle('show');
            }
        } else if (event.data.action === 'fechar') {
            if (modalOpacidade) {
                modalOpacidade.classList.remove('show');
            }
            if (modalShare) {
                modalShare.classList.remove('show');
            }
        } else if (event.data.action === 'abrirModalEditaropc') {
            if (modalOpacidade) {
                modalOpacidade.classList.toggle('show');
            }
            if (modalEditaropc) {
                modalEditaropc.classList.toggle('show');
            }
        }
    });
});