document.addEventListener('DOMContentLoaded', function() {
    let interesseCount = 1;
    let valorCount = 1;
    let sentimentoCount = 1;
    let usuarioId = null; // Variável para armazenar o ID do usuário

    document.getElementById('add-interesse').addEventListener('click', function() {
        interesseCount++;
        const container = document.getElementById('interesses-container');
        const newInteresse = document.createElement('div');
        newInteresse.className = 'interesse';
        newInteresse.innerHTML = `
            <input type="text" name="interesse${interesseCount}" placeholder="Digite um interesse">
            <button type="button" onclick="this.parentElement.remove()">X</button>
        `;
        container.appendChild(newInteresse);
    });

    document.getElementById('remover-interesse').addEventListener('click', function() {
        const container = document.getElementById('interesses-container');
        if (container.children.length > 0) {
            container.removeChild(container.lastChild);
            interesseCount--;
        }
    });

    document.getElementById('add-valor').addEventListener('click', function() {
        valorCount++;
        const container = document.getElementById('valores-container');
        const newValor = document.createElement('div');
        newValor.className = 'interesse';
        newValor.innerHTML = `
            <input type="text" name="valor${valorCount}" placeholder="Digite um valor">
            <button type="button" onclick="this.parentElement.remove()">X</button>
        `;
        container.appendChild(newValor);
    });

    document.getElementById('remover-valor').addEventListener('click', function() {
        const container = document.getElementById('valores-container');
        if (container.children.length > 0) {
            container.removeChild(container.lastChild);
            valorCount--;
        }
    });

    document.getElementById('add-sentimento').addEventListener('click', function() {
        sentimentoCount++;
        const container = document.getElementById('sentimentos-container');
        const newSentimento = document.createElement('div');
        newSentimento.className = 'interesse';
        newSentimento.innerHTML = `
            <input type="text" name="sentimento${sentimentoCount}" placeholder="Digite um sentimento">
            <button type="button" onclick="this.parentElement.remove()">X</button>
        `;
        container.appendChild(newSentimento);
    });

    document.getElementById('remover-sentimento').addEventListener('click', function() {
        const container = document.getElementById('sentimentos-container');
        if (container.children.length > 0) {
            container.removeChild(container.lastChild);
            sentimentoCount--;
        }
    });

    document.getElementById('buscar-usuario').addEventListener('click', async function() {
        const codigoUsuario = document.getElementById('codigo-usuario').value;
        console.log('Código do usuário:', codigoUsuario);
        if (!codigoUsuario) {
            alert('Por favor, insira o código do usuário.');
            return;
        }

        try {
            // Primeiro, buscar todos os usuários
            const response = await fetch('https://localhost:7237/api/Usuario');
            if (response.ok) {
                const usuarios = await response.json();
                // Encontrar o usuário com o código fornecido
                const usuarioEncontrado = usuarios.find(usuario => usuario.codigo === codigoUsuario);
                if (usuarioEncontrado) {
                    usuarioId = usuarioEncontrado.id; // Armazena o ID do usuário
                    // Usar o ID do usuário encontrado para buscar os detalhes do usuário
                    const responseDetalhes = await fetch(`https://localhost:7237/api/Usuario/${usuarioId}`);
                    if (responseDetalhes.ok) {
                        const usuario = await responseDetalhes.json();
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

                        // Mostrar os campos de entrada após o usuário ser encontrado
                        document.getElementById('user-details').classList.remove('hidden');
                    } else {
                        alert('Erro ao buscar detalhes do usuário.');
                    }
                } else {
                    alert('Usuário não encontrado.');
                }
            } else {
                alert('Erro ao buscar usuários.');
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            alert('Erro ao buscar usuário.');
        }
    });

    document.getElementById('cadastro-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Previne o comportamento padrão do formulário

        if (!usuarioId) {
            alert('Por favor, busque um usuário antes de enviar o formulário.');
            return;
        }

        // Coleta os dados do formulário
        const formData = new FormData(this);
        const operacaoCuriosidade = {
            interesses: [],
            valores: [],
            sentimentos: []
        };

        formData.forEach((value, key) => {
            if (key.startsWith('interesse')) {
                operacaoCuriosidade.interesses.push({ descricao: value });
            } else if (key.startsWith('valor')) {
                operacaoCuriosidade.valores.push({ descricao: value });
            } else if (key.startsWith('sentimento')) {
                operacaoCuriosidade.sentimentos.push({ descricao: value });
            }
        });

        try {
            // Criar a operação de curiosidade
            const response = await fetch(`https://localhost:7237/api/CriarOperacao?Id=${usuarioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ operacaoCuriosidade })
            });

            if (response.ok) {
                alert('Operação de curiosidade criada com sucesso!');

                // Enviar interesses
                if (operacaoCuriosidade.interesses.length > 0) {
                    for (const interesse of operacaoCuriosidade.interesses) {
                        const interessesResponse = await fetch(`https://localhost:7237/api/OperacaoCuriosidade/${usuarioId}/interesses`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(interesse)
                        });

                        if (!interessesResponse.ok) {
                            const errorText = await interessesResponse.text();
                            console.error('Erro ao enviar interesses:', errorText);
                            alert('Erro ao enviar interesses.');
                        }
                    }
                }

                // Enviar valores
                if (operacaoCuriosidade.valores.length > 0) {
                    for (const valor of operacaoCuriosidade.valores) {
                        const valoresResponse = await fetch(`https://localhost:7237/api/OperacaoCuriosidade/${usuarioId}/valores`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(valor)
                        });

                        if (!valoresResponse.ok) {
                            const errorText = await valoresResponse.text();
                            console.error('Erro ao enviar valores:', errorText);
                            alert('Erro ao enviar valores.');
                        }
                    }
                }

                // Enviar sentimentos
                if (operacaoCuriosidade.sentimentos.length > 0) {
                    for (const sentimento of operacaoCuriosidade.sentimentos) {
                        const sentimentosResponse = await fetch(`https://localhost:7237/api/OperacaoCuriosidade/${usuarioId}/sentimentos`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sentimento)
                        });

                        if (!sentimentosResponse.ok) {
                            const errorText = await sentimentosResponse.text();
                            console.error('Erro ao enviar sentimentos:', errorText);
                            alert('Erro ao enviar sentimentos.');
                        }
                    }
                }

                alert('Cadastro realizado com sucesso!');
            } else {
                const errorText = await response.text();
                console.error('Erro ao realizar o cadastro:', errorText);
                alert('Erro ao realizar o cadastro.');
            }
        } catch (error) {
            console.error('Erro ao realizar o cadastro:', error);
            alert('Erro ao realizar o cadastro.');
        }
    });
});