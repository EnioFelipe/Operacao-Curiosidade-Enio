document.addEventListener('DOMContentLoaded', function() {
    var modalOpacidade = document.getElementById('opacidade');
    var btnNotificacoes = document.getElementById('btn-notificacoes');
    var modalNotificacoes = document.getElementById('modal-notificacoes');
    var btnShare = document.getElementById('btn-share');
    var modalShare = document.getElementById('modal-share');
    var btnPerfil = document.getElementById('btn-perfil');
    var modalPerfil = document.getElementById('modal-perfil');
    var btnExcluir = document.getElementById('btn-excluir');
    var modalExcluir = document.getElementById('modal-excluir');
    var btnCancelar = document.getElementById('btn-cancelar');
    var btnConfirmar = document.getElementById('btn-confirmar-remocao');

    if (btnPerfil) {
        btnPerfil.addEventListener('click', function() {
            modalPerfil.classList.toggle('show');
        });
    }

    if (btnNotificacoes) {
        btnNotificacoes.addEventListener('click', function() {
            modalOpacidade.classList.toggle('show');
            modalNotificacoes.classList.toggle('show');
        });
    }

    if (btnShare) {
        btnShare.addEventListener('click', function() {
            modalOpacidade.classList.toggle('show');
            modalShare.classList.toggle('show');
        });
    }

    if (btnExcluir) {
        btnExcluir.addEventListener('click', function() {
            modalOpacidade.classList.toggle('show');
            modalExcluir.classList.toggle('show');
        });
    }

    if (modalOpacidade) {
        modalOpacidade.addEventListener('click', function() {
            modalOpacidade.classList.remove('show');
            if (modalNotificacoes) modalNotificacoes.classList.remove('show');
            if (modalShare) modalShare.classList.remove('show');
            if (modalPerfil) modalPerfil.classList.remove('show');
            if (modalExcluir) modalExcluir.classList.remove('show');
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            modalOpacidade.classList.remove('show');
            modalExcluir.classList.remove('show');
        });
    }
});