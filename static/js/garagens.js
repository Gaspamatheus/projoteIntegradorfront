//Variáveis global para armazenar ID da garagem a ser excluída
let garagemIdToDelete = null;

//Cache de clientes
let clientesCache = [];

//Carregar dados ao iniciar a página
document.addEventListener("DOMContentLoaded", function () {
  carregarClientes();
  listarTodasGaragens();
  setAnoAtual();
});

//Definir ano atual no filtro
function setAnoAtual() {
  const anoInput = document.getElementById("filterAno");
  const anoForm = document.getElementById("ano");
  const currentYear = new Date().getFullYear();

  if (anoInput) anoInput.value = currentYear;
  if (anoForm) anoForm.value = currentYear;
}

//Carregar lista de clientes
async function carregarClientes() {
  try {
    clientesCache = await fetchAPI("/clientes");
    preencherSelectClientes();
  } catch (error) {
    console.error("Erro ao carregar clientes: ", error);
    showMessage();
  }
}

// Preencher selects de clientes
function preencherSelectClientes() {
  const selectModal = document.getElementById("clienteId");
  const selectFilter = document.getElementById("filterCliente");

  const options = clientesCache
    .map((cliente) => `<option value="${cliente.id}">${cliente.nome}</option>`)
    .join("");

  if (selectModal) {
    selectModal.innerHTML =
      '<option value="">Selecione um cliente</option>' + options;
  }

  if (selectFilter) {
    selectFilter.innerHTML = '<option value="">Todos</option>' + options;
  }
}

// Listar todas as garagens
async function listarTodasGaragens() {
  try {
    const garagens = await fetchAPI("/garagens");
    renderizarGaragens(garagens);
  } catch (error) {
    showMessage("Erro ao carregar garagens: " + error.message, "error");
  }
}

// Filtrar garagens
async function filtrarGaragens() {
  const ano = document.getElementById("filterAno").value;
  const mes = document.getElementById("filterMes").value;
  const clienteId = document.getElementById("filterCliente").value;

  try {
    let garagens;
    if (clienteId) {
      //Filtar por cliente
      garagens = await fetchAPI(`/garagens/cliente/${clienteId}`);
    } else if (ano && mes) {
      //Filtrar por ano e mês
      garagens = await fetchAPI(`/garagens/perioso?ano=${ano}&mes=${mes}`);
    } else if (ano) {
      //Filtra apenas por ano
      garagens = await fetchAPI(`/garagens/ano/${ano}`);
    } else {
      //Listar todas
      garagens = await fetchAPI(`/garagens`);
    }

    renderizarGaragens(garagens);

    if (garagens.length === 0) {
      showMessage(
        "Nenhuma garagem encontrada com os filtros aplicados",
        "error"
      );
    }
  } catch (error) {
    showMessage("Erro ao filtrar garagens: " + error.message, "erro");
  }
}

//Renderizar tabela de garagens
function renderizarGaragens(garagens) {
  const tbody = document.getElementById("garagensTableBody");

  if (!garagens || garagens.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="loading">Nenhuma garagem encontrada</td></tr>';
    return;
  }

  tbody,
    innerHTML -
      garagens
        .map((garagem) => {
          const cliente = getClienteNome(garagem.clienteId);
          const status = garagem.garagemFechada ? "Fechada" : "Aberta";
          const statusClass = garagem.garagemFechada
            ? "status-fechada"
            : "status-aberta";

          return `
              <tr>
                <td>${garagem.id}</td>
                <td>${cliente}</td>
                <td>${garagem.ano}</td>
                <td>${getMonthName(garagem.mesPago)}</td>
                <td>${formatCurrency(garagem.valorGaragem)}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-small" onclick="editarGaragem(${
                      garagem.id
                    })">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger btn-small" onclick="prepararExclusao(${
                      garagem.id
                    })">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
    `;
        })
        .join("");
}

//Obter nome do cliente pelo ID
function getClienteNome(clienteId) {
  const cliente = clientesCache.find((c) => c.id === clienteId);
  return cliente ? cliente.nome : "Cliente não encontrado";
}

//Abrir modal para nova garagem
function novaGaragem() {
  clearForm("garagemForm");
  document.getElementById("modalTitle").textContent = "Nova Garagem";
  setAnoAtual();
  openModal("garagemModal");
}

//Editar garagem
async function editarGaragem(id) {
  try {
    const garagem = await fetchAPI(`/garagem/${id}`);

    document.getElementById("garagemId").value = garagem.id;
    document.getElementById("clienteId").value = garagem.clienteId;
    document.getElementById("ano").value = garagem.ano;
    document.getElementById("mesPago").value = garagem.mesPago;
    document.getElementById("valorGaragem").value = garagem.valorGaragem;
    document.getElementById("garagemFechada").checked =
      garagem.garagemFechada || false;

    document.getElementById("modalTitle").textContent = "Editar Garagem";
    openModel("garagemModel");
  } catch (error) {
    showMessage("Erro ao carregar dados da garagem: " + error.message, "error");
  }
}

//Salvar garagem (criar ou atualizar)
async function salvarGaragem(event) {
  event.preventDefault();

  const id = documente.getElementById("garagemId").value;
  const garagemData = {
    clienteId: parseInt(document.getElementById("garagemId").value),
    ano: parseInt(document.getElementById("ano").value),
    mesPago: parseInt(document.getElementById("mesPago").value),
    valorGaragem: parseFloat(document.getElementById("valirGaragem").value),
    garagemFechada: document.getElementById("garagemFechada").checked,
  };

  //Validação
  if (!garagemData.clienteId) {
    showMessage("Selecione um cliente", "error");
  }
  try {
    if (id) {
      //atualiza garagem existente
      await fetchAPI(`/garagem/${id}`, {
        method: "PUT",
        body: JSON.stringify(garagemData),
      });
      showMessage("Garagem criada com sucesso!", "success");
    }

    closeModal('garagemModal');
    clearForm('garagemForm');
    listarTodasGaragens();
    scrollToTop();
  } catch (error) {
    showMessage('Erro ao salvar garagem: ' +error.message, 'error');
  }
}

// Preparar exclusão (abrir modal de confirmação)
function prepararExclusao(id) {
    garagemIdToDelete = id;
    openModal('deleteModal');
}

// Confirmar exclusão
async function confirmarExclusao() {
    if (!garagemIdToDelete) return;

    try {
        await fetchAPI(`/garagens/${garagemIdToDelete}`, {
            method: 'DELETE'
        });
        
        showMessage('Garagem excluída com sucesso!', 'success');
        closeModal('deleteModal');
        garagemIdToDelete = null;
        listarTodasGaragens();
        scrollToTop();
    } catch (error) {
        showMessage('Erro ao excluir garagem: ' + error.message, 'error');
    }
}