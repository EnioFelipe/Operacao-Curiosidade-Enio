const apiUrl = 'https://localhost:7237/api/Usuario';
let allUsuarios = []; // Armazena todos os usuários carregados
let currentPage = 1;
let pageSize = 5; // Número de itens por página

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

    Usuarios.forEach(Usuario => {
        const row = document.createElement('div');
        row.className = 'dados';
        row.innerHTML = `
            <p><input type="checkbox">${Usuario.codigo}</p>
            <p>${Usuario.fatosEDados.nome}</p>
            <p>${Usuario.email}</p>
            <p>${new Date(Usuario.dataCriacao).toLocaleDateString()}</p>
            <p class="${Usuario.tipo ? 'permissao-admin' : 'permissao-operador'}">${Usuario.tipo ? 'Administrador' : 'Operador'}</p>
        `;
        relatorioUsuarios.appendChild(row);
    });
}

// Função para aplicar filtros
function applyFilters() {
    const statusFilter = document.getElementById('tipo-status').value;
    const permissaoFilter = document.getElementById('tipo-permissao').value;
    const nomeIdFilter = document.getElementById('tipo-nome-id').value.toLowerCase();
    const dataInicioFilter = document.getElementById('tipo-data-inicio').value;
    const dataFimFilter = document.getElementById('tipo-data-fim').value;

    const filteredUsuarios = allUsuarios.filter(usuario => {
        const matchesStatus = !statusFilter || usuario.status === (statusFilter === 'ativo');
        const matchesPermissao = !permissaoFilter || usuario.tipo === (permissaoFilter === 'administrador');
        const matchesNomeId = !nomeIdFilter || usuario.fatosEDados.nome.toLowerCase().includes(nomeIdFilter) || usuario.codigo.toLowerCase().includes(nomeIdFilter);
        const matchesPeriodo = (!dataInicioFilter || new Date(usuario.dataCriacao) >= new Date(dataInicioFilter)) &&
                               (!dataFimFilter || new Date(usuario.dataCriacao) <= new Date(dataFimFilter));

        return matchesStatus && matchesPermissao && matchesNomeId && matchesPeriodo;
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
    const paginationContainer = document.getElementById('pagination-controls');
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
    document.getElementById('tipo-permissao').value = '';
    document.getElementById('tipo-nome-id').value = '';
    document.getElementById('tipo-data-inicio').value = '';
    document.getElementById('tipo-data-fim').value = '';
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
document.getElementById('tipo-permissao').addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});
document.getElementById('tipo-nome-id').addEventListener('input', () => {
    currentPage = 1;
    applyFilters();
});
document.getElementById('tipo-data-inicio').addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});
document.getElementById('tipo-data-fim').addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
});
document.getElementById('limpar-filtros').addEventListener('click', resetFilters);