document.addEventListener('DOMContentLoaded', function() {
    const btnSalvar = document.getElementById('btn-salvar');

    btnSalvar.addEventListener('click', async function(event) {
        event.preventDefault(); // Previne o comportamento padrão do botão

        // Coleta os dados do formulário
        const form = document.getElementById('form-cadastro-usuario');
        const formData = new FormData(form);

        const nome = formData.get('nome');
        const nomeUsuario = formData.get('nome-usuario');
        const email = formData.get('email');
        const dataNasc = formData.get('data-nasc');
        const estadoCivil = formData.get('estado-civil');
        const endereco = formData.get('endereco');
        const complemento = formData.get('complemento');
        const ocupacao = formData.get('ocupacao');
        const formacao = formData.get('formacao');
        const telefone = formData.get('telefone');
        const codigo = formData.get('codigo'); // Variável global definida ao buscar o usuário
        const status = document.getElementById('status').checked;
        const tipo = document.getElementById('tipo').checked;
        const senha = formData.get('senha');
        const confirmarSenha = formData.get('confirmar-senha');

        // Validações básicas
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        // Calcula a idade se dataNasc estiver preenchida
        let idade = null;
        if (dataNasc) {
            const birthDate = new Date(dataNasc);
            const ageDifMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifMs);
            idade = Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        // Cria o objeto de dados do usuário
        const usuario = {
            operacaoCuriosidade: null,
            fatosEDados: {
                dataCriacao: new Date().toISOString(),
                nome: nome,
                idade: idade,
                user: nomeUsuario,
                dataNasc: dataNasc,
                estadoCivil: estadoCivil,
                endereco: endereco,
                complemento: complemento,
                profissao: ocupacao,
                formacao: formacao,
                telefone: telefone
            },
            dataCriacao: new Date().toISOString(),
            codigo: codigo,
            status: status,
            tipo: tipo,
            email: email,
            senha: senha
        };

        console.log('Usuário:', usuario);

        try {
            // Envia a requisição POST para a API
            const response = await fetch('https://localhost:7237/api/Usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario) // Envia o objeto `usuario` diretamente
            });

            if (response.ok) {
                alert('Usuário criado com sucesso!');
                // Fecha o modal ou redireciona para outra página, se necessário
                window.parent.document.getElementById('modal-criar-usuario').style.display = 'none';
            } else {
                const errorText = await response.text();
                console.error('Erro ao criar usuário:', errorText);
                alert('Erro ao criar usuário.');
            }
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            alert('Erro ao criar usuário.');
        }
    });
});