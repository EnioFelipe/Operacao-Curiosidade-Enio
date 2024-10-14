const apiUrl = 'https://localhost:7237/api/Usuario';
let allUsuarios = []; // Armazena todos os usuários carregados
let currentPage = 1;
let pageSize = 99; // Número de itens por página

// Função para ler recursos (Read)
async function readUsuarios() {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        console.log('Recursos:', result);
        allUsuarios = result; // Armazena todos os usuários
        applyFilters(); // Aplica filtros e exibe os recursos no formato de relatório
    } catch (error) {
        console.error('Erro ao ler recursos:', error);
    }
}

// Função para exibir os recursos no formato de relatório
function displayUsuariosRelatorio(Usuarios) {
    const relatorioUsuarios = document.getElementById('relatorio-usuarios');
    relatorioUsuarios.innerHTML = ''; // Limpa a lista antes de exibir os recursos

    const usuariosFiltrados = Usuarios.filter(usuario => usuario.operacaoCuriosidade !== null);

    usuariosFiltrados.forEach(Usuario => {
        const row = document.createElement('div');
        row.className = 'dados';
        row.innerHTML = `
            <p>${Usuario.codigo}</p>
            <p>${Usuario.fatosEDados.nome}</p>
            <p>${Usuario.email}</p>
            <p>${new Date(Usuario.dataCriacao).toLocaleDateString()}</p>
            <p class="${Usuario.status ? 'status-ativo' : 'status-inativo'}">${Usuario.status ? 'Ativo' : 'Inativo'}</p>
        `;
        relatorioUsuarios.appendChild(row);
    });
}

// Função para aplicar filtros
function applyFilters() {
    // Filtra os usuários com operacaoCuriosidade diferente de null
    const usuariosComOperacaoCuriosidade = allUsuarios.filter(usuario => usuario.operacaoCuriosidade !== null);

    // Aplica os filtros adicionais
    const statusFilter = document.getElementById('tipo-status').value;
    const nomeIdFilter = document.getElementById('tipo-nome').value.toLowerCase();
    const dataInicioFilter = document.getElementById('tipo-periodo-inicio').value;
    const dataFimFilter = document.getElementById('tipo-periodo-fim').value;

    const filteredUsuarios = usuariosComOperacaoCuriosidade.filter(usuario => {
        const matchesStatus = !statusFilter || usuario.status === (statusFilter === 'ativo');
        const matchesNomeId = !nomeIdFilter || usuario.fatosEDados.nome.toLowerCase().includes(nomeIdFilter) || usuario.codigo.toLowerCase().includes(nomeIdFilter);
        const matchesPeriodo = (!dataInicioFilter || new Date(usuario.dataCriacao) >= new Date(dataInicioFilter)) &&
                               (!dataFimFilter || new Date(usuario.dataCriacao) <= new Date(dataFimFilter));
        return matchesStatus && matchesNomeId && matchesPeriodo;
    });

    paginate(filteredUsuarios);
}

// Função para paginar os dados
function paginate(items) {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedItems = items.slice(start, end);

    displayUsuariosRelatorio(paginatedItems);
    updatePaginationControls(items.length);
}

// Função para atualizar os controles de paginação
function updatePaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginationContainer = document.querySelector('.pagination-controls');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.disabled = i === currentPage;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            applyFilters();
        });
        paginationContainer.appendChild(pageButton);
    }
}

// Função para resetar todos os filtros
function resetFilters() {
    document.getElementById('tipo-status').value = '';
    document.getElementById('tipo-nome').value = '';
    document.getElementById('tipo-periodo-inicio').value = '';
    document.getElementById('tipo-periodo-fim').value = '';
    currentPage = 1;
    applyFilters();
}

// Inicializa a leitura dos recursos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    readUsuarios();
    console.log('DOM completamente carregado e analisado');

    const itensPorPgInput = document.getElementById('itens-por-pg');
    itensPorPgInput.addEventListener('change', function() {
        let newPageSize = parseInt(itensPorPgInput.value, 10);
        if (newPageSize < 1) {
            newPageSize = 1;
            itensPorPgInput.value = 1;
        }
        pageSize = newPageSize;
        currentPage = 1;
        applyFilters();
    });
});

// Adiciona eventos aos filtros
document.getElementById('tipo-status').addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});
document.getElementById('tipo-nome').addEventListener('input', () => {
    currentPage = 1;
    applyFilters();
});
document.getElementById('tipo-periodo-inicio').addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});
document.getElementById('tipo-periodo-fim').addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});
document.querySelector('.form-actions input[type="reset"]').addEventListener('click', resetFilters);