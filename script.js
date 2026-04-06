// Espera o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    const medidorForm = document.getElementById('medidor-form');
    const listaMedidores = document.getElementById('lista-medidores');

    // Função para buscar as leituras salvas no armazenamento local do navegador
    const getLeituras = () => {
        return JSON.parse(localStorage.getItem('leituras')) || [];
    };

    // Função para salvar as leituras no armazenamento local
    const saveLeituras = (leituras) => {
        localStorage.setItem('leituras', JSON.stringify(leituras));
    };

    // Função para renderizar (exibir) as leituras na tela
    const renderLeituras = () => {
        const leituras = getLeituras();
        listaMedidores.innerHTML = ''; // Limpa a lista antes de adicionar os itens

        if (leituras.length === 0) {
            listaMedidores.innerHTML = '<p class="empty-state">Nenhuma leitura registrada ainda.</p>';
            return;
        }

        leituras.forEach((leitura, index) => {
            const item = document.createElement('div');
            item.classList.add('leitura-item');

            // Formata a data para o padrão brasileiro (dd/mm/aaaa)
            const dataObj = new Date(leitura.data);
            const dataFormatada = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(dataObj);

            item.innerHTML = `
                <div class="leitura-info">
                    <p class="medidor-numero">Medidor: ${leitura.numero}</p>
                    <p class="medidor-leitura">Leitura: ${leitura.leitura} kWh</p>
                    <p class="medidor-data">Data: ${dataFormatada}</p>
                </div>
                <div class="leitura-actions">
                    <button class="delete-btn" data-index="${index}" title="Excluir leitura">&times;</button>
                </div>
            `;
            listaMedidores.appendChild(item);
        });
    };

    // Evento de envio do formulário
    medidorForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const numero = document.getElementById('numero-medidor').value;
        const leitura = document.getElementById('leitura-atual').value;
        const data = document.getElementById('data-leitura').value;

        const novaLeitura = { numero, leitura, data };

        const leituras = getLeituras();
        leituras.push(novaLeitura);
        saveLeituras(leituras);

        renderLeituras(); // Atualiza a lista na tela
        medidorForm.reset(); // Limpa os campos do formulário
    });

    // Evento de clique na lista para deletar um item
    listaMedidores.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            
            if (confirm('Tem certeza que deseja excluir esta leitura?')) {
                const leituras = getLeituras();
                leituras.splice(index, 1); // Remove o item do array
                saveLeituras(leituras);
                renderLeituras(); // Atualiza a lista na tela
            }
        }
    });

    // Renderiza as leituras salvas ao carregar a página pela primeira vez
    renderLeituras();
});
