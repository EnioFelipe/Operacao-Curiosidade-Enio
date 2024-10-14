document.addEventListener('DOMContentLoaded', function() {
    let senha; // Definir a variável senha no escopo global
    let status; // Definir a variável status no escopo global
    let interesseCount = 1;
    let valorCount = 1;
    let sentimentoCount = 1;

    // Função para carregar os dados do usuário e abrir o modal
    async function carregarDadosUsuario() {
        const usuarioId = localStorage.getItem('usuarioToEdit');
        console.log('Recuperado usuarioId do localStorage:', usuarioId); // Log de depuração

        if (!usuarioId) {
            console.error('ID do usuário não fornecido.');
            return;
        }

        try {
            const apiUrl = `https://localhost:7237/api/Usuario/${usuarioId}`;
            console.log('URL da API:', apiUrl); // Log de depuração
        
            const response = await fetch(apiUrl);
            if (response.ok) {
                const usuario = await response.json();
                console.log('Dados do usuário:', usuario); // Log de depuração

                // Armazenar a senha em uma variável global
                senha = usuario.senha;
                console.log('Senha:', senha); // Log de depuração

                // Armazenar o status em uma variável global
                status = usuario.status;
                console.log('Status:', status); // Log de depuração

                document.getElementById('guid-id-usuario').value = usuario.id;
                document.getElementById('nome').value = usuario.fatosEDados.nome;
                document.getElementById('nome-usuario').value = usuario.fatosEDados.user;
                document.getElementById('email').value = usuario.email;
                if (usuario.fatosEDados.dataNasc) {
                    document.getElementById('data-nasc').value = usuario.fatosEDados.dataNasc.split('T')[0]; // Corrigir a formatação da data
                }
                document.getElementById('estado-civil').value = usuario.fatosEDados.estadoCivil;
                document.getElementById('endereco').value = usuario.fatosEDados.endereco;
                document.getElementById('complemento').value = usuario.fatosEDados.complemento;
                document.getElementById('ocupacao').value = usuario.fatosEDados.profissao;
                document.getElementById('formacao').value = usuario.fatosEDados.formacao;

                // Atualizar o status visualmente
                if (status) {
                    document.getElementById('status-ativo').style.display = 'block';
                    document.getElementById('status-inativo').style.display = 'none';
                    document.getElementById('lateral-ativo').style.display = 'flex';
                    document.getElementById('lateral-inativo').style.display = 'none';
                } else {
                    document.getElementById('status-ativo').style.display = 'none';
                    document.getElementById('status-inativo').style.display = 'block';
                    document.getElementById('lateral-ativo').style.display = 'none';
                    document.getElementById('lateral-inativo').style.display = 'flex';
                }
        
                // Exibir interesses
                const interessesContainer = document.getElementById('interesses-container');
                interessesContainer.innerHTML = '';
                usuario.operacaoCuriosidade.interesses.forEach((interesse, index) => {
                    const div = document.createElement('div');
                    div.className = 'interesse';
                    div.innerHTML = `
                        <input type="text" name="interesse${index + 1}" placeholder="Digite um interesse" value="${interesse.descricao}">
                        <button type="button" onclick="this.parentElement.remove()">X</button>
                    `;
                    interessesContainer.appendChild(div);
                });

                // Exibir valores
                const valoresContainer = document.getElementById('valores-container');
                valoresContainer.innerHTML = '';
                usuario.operacaoCuriosidade.valores.forEach((valor, index) => {
                    const div = document.createElement('div');
                    div.className = 'valor';
                    div.innerHTML = `
                        <input type="text" name="valor${index + 1}" placeholder="Digite um valor" value="${valor.descricao}">
                        <button type="button" onclick="this.parentElement.remove()">X</button>
                    `;
                    valoresContainer.appendChild(div);
                });

                // Exibir sentimentos
                const sentimentosContainer = document.getElementById('sentimentos-container');
                sentimentosContainer.innerHTML = '';
                usuario.operacaoCuriosidade.sentimentos.forEach((sentimento, index) => {
                    const div = document.createElement('div');
                    div.className = 'sentimento';
                    div.innerHTML = `
                        <input type="text" name="sentimento${index + 1}" placeholder="Digite um sentimento" value="${sentimento.descricao}">
                        <button type="button" onclick="this.parentElement.remove()">X</button>
                    `;
                    sentimentosContainer.appendChild(div);
                });

                // Limpar o ID do localStorage após a edição
                localStorage.removeItem('usuarioToEdit');
                localStorage.removeItem('openEditModal'); // Limpar o sinalizador
                console.log('usuarioId removido do localStorage'); // Log de depuração
            } else {
                alert('Erro ao buscar detalhes do usuário.');
                console.error('Erro ao buscar detalhes do usuário:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            alert('Erro ao buscar usuário.');
        }
    }

    // Monitorar mudanças no localStorage
    window.addEventListener('storage', function(event) {
        if (event.key === 'openEditModal' && event.newValue === 'true') {
            carregarDadosUsuario();
        }
    });

    // Verificar se o sinalizador já está definido ao carregar a página
    if (localStorage.getItem('openEditModal') === 'true') {
        carregarDadosUsuario();
    }

    // Adicionar evento de clique para salvar os dados
    document.getElementById('btn-salvar').addEventListener('click', async function() {
        const usuarioId = document.getElementById('guid-id-usuario').value; // Supondo que você tenha um campo oculto com o ID do usuário

        const usuarioData = {
            operacaoCuriosidade: {
                interesses: Array.from(document.querySelectorAll('#interesses-container input[type="text"]')).map(input => ({ descricao: input.value })),
                valores: Array.from(document.querySelectorAll('#valores-container input[type="text"]')).map(input => ({ descricao: input.value })),
                sentimentos: Array.from(document.querySelectorAll('#sentimentos-container input[type="text"]')).map(input => ({ descricao: input.value }))
            },
            fatosEDados: {
                nome: document.getElementById('nome').value,
                idade: 0, // Adicione a lógica para obter a idade se necessário
                user: document.getElementById('nome-usuario').value,
                dataNasc: document.getElementById('data-nasc').value,
                estadoCivil: document.getElementById('estado-civil').value,
                endereco: document.getElementById('endereco').value,
                complemento: document.getElementById('complemento').value,
                profissao: document.getElementById('ocupacao').value,
                formacao: document.getElementById('formacao').value,
                telefone: "" // Adicione a lógica para obter o telefone se necessário
            },
            codigo: "", // Adicione a lógica para obter o código se necessário
            status: status, // Usar o status armazenado
            email: document.getElementById('email').value,
            senha: senha // Usar a senha armazenada
        };

        try {
            const response = await fetch(`https://localhost:7237/api/Usuario/${usuarioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioData)
            });
            if (response.ok) {
                alert('Usuário atualizado com sucesso.');
                window.parent.postMessage({ action: 'fechar' }, '*');
                recarregarPagina()
            } else {
                alert('Erro ao atualizar usuário.');
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar usuário.');
        }
    });

    // Adicionar evento de clique para alternar o status
    document.getElementById('status-ativo').addEventListener('click', function() {
        status = false; // Definir status como inativo
        document.getElementById('status-ativo').style.display = 'none';
        document.getElementById('status-inativo').style.display = 'block';
        document.getElementById('lateral-ativo').style.display = 'none';
        document.getElementById('lateral-inativo').style.display = 'flex';
    });

    document.getElementById('status-inativo').addEventListener('click', function() {
        status = true; // Definir status como ativo
        document.getElementById('status-inativo').style.display = 'none';
        document.getElementById('status-ativo').style.display = 'block';
        document.getElementById('lateral-inativo').style.display = 'none';
        document.getElementById('lateral-ativo').style.display = 'flex';
    });

    // Função para adicionar um item com botão de excluir
    function addItem(containerId, className, placeholder) {
        const container = document.getElementById(containerId);
        const item = document.createElement('div');
        item.className = className;
        item.innerHTML = `
            <input type="text" placeholder="${placeholder}">
            <button type="button" onclick="this.parentElement.remove()">X</button>
        `;
        container.appendChild(item);
    }

    document.getElementById('add-interesse').addEventListener('click', function() {
        addItem('interesses-container', 'interesse', 'Digite um interesse');
    });

    document.getElementById('add-valor').addEventListener('click', function() {
        addItem('valores-container', 'valor', 'Digite um valor');
    });

    document.getElementById('add-sentimento').addEventListener('click', function() {
        addItem('sentimentos-container', 'sentimento', 'Digite um sentimento');
    });

    function recarregarPagina() {
        window.top.location.href = '../Tela-Home_Opc/home-index.html';
    }
});