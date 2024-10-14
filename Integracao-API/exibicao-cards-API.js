const apiUrl = 'https://localhost:7237/api/Usuario';

// Função para criar um novo recurso (Create)
async function createUsuario(data) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Recurso criado:', result);
        readUsuarios(); // Atualiza a lista após criar
    } catch (error) {
        console.error('Erro ao criar recurso:', error);
    }
}

// Função para ler recursos (Read)
async function readUsuarios() {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        console.log('Recursos:', result);
        displayUsuarios(result); // Exibe os recursos no HTML
        return result; // Retorna os usuários para outras funções utilizarem
    } catch (error) {
        console.error('Erro ao ler recursos:', error);
    }
}

function displayUsuarios(Usuarios) {
    const UsuarioList = document.getElementById('Usuario-list');
    if (!UsuarioList) {
        console.error('Elemento "Usuario-list" não encontrado no DOM.');
        return;
    }
    UsuarioList.innerHTML = ''; // Limpa a lista antes de exibir os recursos

    const usuariosFiltrados = Usuarios.filter(usuario => usuario.operacaoCuriosidade !== null);

    usuariosFiltrados.forEach(Usuario => {
        const card = document.createElement('div');
        card.className = 'perfil';
        card.innerHTML = `
            <div class="main-info">
                <img src="../icons/usuario.svg" alt="Foto do usuário" class="perfil-foto">
                <div class="identificadores">
                    <p id="nome-perfil">${Usuario.fatosEDados.nome} | <a id="apelido" href="#">@${Usuario.fatosEDados.user}</a></p>
                    <p id="email">${Usuario.email}</p>
                    <p id="pilares">
                        <a href="#" class="curiosidades"> <strong>${Usuario.operacaoCuriosidade ? Usuario.operacaoCuriosidade.interesses.length : 0}</strong> Interesses <img src="../icons/interesses.svg" alt=""></a>
                        <a href="#" class="curiosidades"> <strong>${Usuario.operacaoCuriosidade ? Usuario.operacaoCuriosidade.sentimentos.length : 0}</strong> Sentimentos <img src="../icons/sentimentos.svg" alt=""></a>
                        <a href="#" class="curiosidades"> <strong>${Usuario.operacaoCuriosidade ? Usuario.operacaoCuriosidade.valores.length : 0}</strong> Valores <img src="../icons/valores.svg" alt=""></a>
                    </p>
                </div>
                <div class="id-situ">
                    <p id="guid-id-usuario">${Usuario.id}</p>
                    <p id="id-usuario">${Usuario.codigo}</p>
                    <p id="${Usuario.status ? 'situacao-ativo' : 'situacao-inativo'}">${Usuario.status ? 'Ativo' : 'Inativo'}</p>
                </div>
            </div>
            <div class="detalhes">
                <div class="perfil-info">
                    <p id="data-criacao"><img src="../icons/agenda.svg" alt="">Data de Criação: ${new Date(Usuario.dataCriacao).toLocaleDateString()}</p>
                    <p id="editado-por"><img src="../icons/editado-recente.svg" alt="">Editado por: @eniof.mig</p>
                </div>
                <div class="perfil-acao">
                <button onclick="abrirModalRemoverUsuario('${Usuario.id}')" data-id="${Usuario.id}"><img src="../icons/delete.svg" alt="Deletar"></button>
                <button id="btn-editar-operacao" onclick="abrirModalEditarUsuario('${Usuario.id}')" data-id="${Usuario.id}"><img src="../icons/editar.svg" alt="Editar"></button>
                <button onclick="abrirModalCompartilharUsuario('${Usuario.id}')" data-id="${Usuario.id}"><img src="../icons/share.svg" alt="Compartilhar"></button>
                </div>
            </div>
        `;
        UsuarioList.appendChild(card);
    });
}

function abrirModalEditarUsuario(usuarioId) {
    console.log('Storing usuarioId in localStorage:', usuarioId); // Log before storing the ID
    localStorage.setItem('usuarioToEdit', usuarioId);
    localStorage.setItem('openEditModal', 'true'); // Sinalizar a necessidade de abrir o modal
    console.log('usuarioId stored in localStorage:', localStorage.getItem('usuarioToEdit')); // Log after storing the ID

    window.parent.postMessage({ action: 'abrirModalEditarUsuario' }, '*');
}

// Função para contar os valores e atualizar o HTML
async function contarUsuarios() {
    try {
        const usuarios = await readUsuarios();
        if (!usuarios) {
            console.error('Nenhum usuário encontrado.');
            return;
        }
        const totalCadastrados = usuarios.length;
        const cadastrosPendentes = usuarios.filter(usuario => usuario.operacaoCuriosidade === null).length;
        const cadastrosAtivos = totalCadastrados - cadastrosPendentes;

        const totalCadastradosElement = document.querySelector('.cadastro-info .numero.total-cadastrados');
        const cadastrosPendentesElement = document.querySelector('.cadastro-info .numero.cadastros-pendentes');
        const cadastrosAtivosElement = document.querySelector('.cadastro-info .numero.cadastros-ativos');

        if (totalCadastradosElement) totalCadastradosElement.textContent = totalCadastrados;
        if (cadastrosPendentesElement) cadastrosPendentesElement.textContent = cadastrosPendentes;
        if (cadastrosAtivosElement) cadastrosAtivosElement.textContent = cadastrosAtivos;
    } catch (error) {
        console.error('Erro ao contar usuários:', error);
    }
}

// Inicializa a leitura dos recursos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    readUsuarios();
    contarUsuarios();
});