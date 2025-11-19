//Variáveis global para armazenar ID da garagem a ser excluída
let garagemIdToDelete = null;

//Cache de clientes
let clientesCache = [];

//Carregar dados ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
  carregarClientes();
  listarTodasGaragens();
  setAnoAtual();
});

//Definir ano atual no filtro
function setAnoAtual(){
  const anoInput = document.getElementById('filterAno');
  const anoForm = document.getElementById('ano');
  
}