document.addEventListener('DOMContentLoaded', function() {
    var modalOpacidade = document.getElementById('opacidade');
    var btnNotificacoes = document.getElementById('btn-notificacoes');
    var modalNotificacoes = document.getElementById('modal-notificacoes');
    var btnShare = document.getElementById('btn-share');
    var modalShare = document.getElementById('modal-share');

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

    if (modalOpacidade) {
        modalOpacidade.addEventListener('click', function() {
            modalOpacidade.classList.remove('show');
            if (modalNotificacoes) modalNotificacoes.classList.remove('show');
            if (modalShare) modalShare.classList.remove('show');
        });
    }
});