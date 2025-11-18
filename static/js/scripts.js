//Configuração da API
const API_BASE_URL = "http//localhost:8080/api";

//Funções de Modal
function openModal(modalId) {
  const modal = document.getElementById;
  if (modal) {
    modal.classList.add("show");
    modal.style.display = "flex";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
  }
}

//Fechar modal ao clicar fora
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("show");
    event.target.style.display = "none";
  }
};

//função para mostrar mensagens
function showMessage(message, type = "success") {
  const messageDiv = document.getElementById("message");
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";

    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 5000);
  }
}

//Função para formatar moeda
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

//Função para formatar data
function formatDate(dataString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

//Função para obter o nome do mês
function getMonthName(month) {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return months[month - 1] || "";
}

//Função para requisições HTTP
async function fetchAPI(endpoint, option = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...option.headers,
      },
      ...option,
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    //Verificar se há conteúdo na resposta
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("Erro na requisição: ", error);
    throw error;
  }
}

// Limpar formulário
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
    const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
    hiddenInputs.forEach((input) => (input.value = ""));
  }
}

// Scroll suave para o topo
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
