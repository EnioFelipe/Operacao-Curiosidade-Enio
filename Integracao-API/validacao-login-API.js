const apiUrl = 'https://localhost:7237/api/Usuario';
let allUsuarios = []; // Armazena todos os usuários carregados

// Função para ler recursos (Read)
async function readUsuarios() {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        console.log('Recursos:', result);
        allUsuarios = result; // Armazena todos os usuários
    } catch (error) {
        console.error('Erro ao ler recursos:', error);
    }
}

// Função para verificar as credenciais
function verificarCredenciais(email, senha) {
    const user = allUsuarios.find(user => (user.email === email || user.username === email) && user.senha === senha);
    return user !== undefined;
}

// Adiciona evento de submissão ao formulário de login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Verifica se as credenciais são válidas
    if (verificarCredenciais(email, senha)) {
        alert('Login bem-sucedido');
        window.location.href = '../Tela-Home_Opc/home-index.html';
    } else {
        alert('Credenciais inválidas');
    }
});

// Inicializa a leitura dos recursos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    readUsuarios();
    console.log('DOM completamente carregado e analisado');
});