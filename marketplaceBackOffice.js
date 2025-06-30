/////////////////////////////////////////
/////DICHIARAZIONE VARIABILI GLOBALI/////
/////////////////////////////////////////
const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const tbody = document.querySelector("#tbody");
const productName = document.querySelector("#name");
const productDescription = document.querySelector("#description");
const productBrand = document.querySelector("#brand");
const productImage = document.querySelector("#imageUrl");
const productPrice = document.querySelector("#price");
const btnSalva = document.querySelector("#btnSalva");
const btnCaricaProdotto = document.querySelector('#btnCaricaProdotto')
const formCaricaProdotto = document.querySelector("#formCaricaProdotto")
const alertProdottoSalvato = document.querySelector('#alertProdottoSalvato')
const alertProductDeleted = document.querySelector('#alertProductDeleted')
const alertConfermaUpdate = document.querySelector('#alertConfermaUpdate')
const alertConfermaDelete = document.querySelector('#alertConfermaDelete')
const confirmUpdateBtn = document.querySelector('.confirmUpdateBtn');
const cancelUpdateBtn = document.querySelector('.cancelUpdateBtn');
const confirmDeleteBtn = document.querySelector('.confirmDeleteBtn');
const cancelDeleteBtn = document.querySelector('.cancelDeleteBtn');

/////////////////////////////////
/////GESTIONE CHIAMATE FETCH/////
/////////////////////////////////
async function fetchaProdotti() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVhODY0ODRlZjFiYzAwMTVkZjVhZmYiLCJpYXQiOjE3NTA3NjMwODEsImV4cCI6MTc1MTk3MjY4MX0.6HlWZ_oJAV-t9dTDPzSUrX9d0v9csoawLruhltDs-EY",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    mostraProdotti(data);
  } catch (error) {
    console.log("Errore nella fetch:", error);
  }
}

////////////////////////////////////
/////GESTIONE CHIAMATA FUNZIONI/////
////////////////////////////////////
const path = window.location.pathname;

if (path.includes("marketplaceBackOffice.html")) {
  gestisciSpinner();
  fetchaProdotti();
}

//////////////////////////
/////GESTIONE SPINNER/////
//////////////////////////
function gestisciSpinner() {
  // Verifico se il caricamento della pagina è già terminato
  if (document.readyState === "complete") {
    // Se sì, nascondo lo spinner
    spinner.classList.add("d-none");
  } else {
    // Se la pagina non è ancora completamente caricata,
    // allora aspetta l'evento "load" (il completamento del caricamento)
    window.addEventListener("load", () => {
      // Quando il caricamento è finito, si nasconde lo spinner
      spinner.classList.add("d-none");
    });
  }
}

///////////////////////////////
/////GESTIONE RENDER FETCH/////
///////////////////////////////
function mostraProdotti(products) {
  tbody.innerHTML = "";

  const tabellaProdotti = products.map((product) => caricaRiga(product));
  tbody.append(...tabellaProdotti);
}

////////////////////////////////////
/////GESTIONE CREAZIONE TABELLA/////
////////////////////////////////////
function caricaRiga(product) {
  try {
    //riga
    const tr = document.createElement("tr");

    //CELLA NOME
    const tdName = document.createElement("td");
    tdName.innerText = product.name;

    //CELLA MARCHIO
    const tdBrand = document.createElement("td");
    tdBrand.innerText = product.brand;

    //CELLA IMG
    const tdImage = document.createElement("td");
    tdImage.innerText = product.imageUrl;
    tdImage.style.whiteSpace = 'nowrap';
    tdImage.style.overflow = 'hidden';
    tdImage.style.textOverflow = 'ellipsis';
    tdImage.style.maxWidth = '200px';

    //CELLA PREZZO
    const tdPrice = document.createElement("td");
    tdPrice.innerText = "€ " + product.price;

    //CELLA AZIONI
    const tdActions = document.createElement("td");
    tdActions.classList.add('d-flex', 'justify-content-between')

    //BTN UPDATE
    const btnUpdate = document.createElement('a');
    btnUpdate.classList.add('btn', 'btn-warning', 'btn-sm', 'me-1', 'mb-only-sm');
    btnUpdate.innerText = 'Update';

    btnUpdate.addEventListener('click', (event) => {
      event.preventDefault();
      //mostro alert
      alertConfermaUpdate.classList.remove('d-none');
      //in caso di click su 'confirm'
      const gestioneUpdateConfirm = () => {
        window.location.href = `marketplaceUpdateProduct.html?id=${product._id}`;
        alertConfermaUpdate.classList.add('d-none');
        confirmUpdateBtn.removeEventListener('click', gestioneUpdateConfirm);
        cancelUpdateBtn.removeEventListener('click', gestioneUpdateCancel);
      };
      //in caso di click su 'cancel'
      const gestioneUpdateCancel = () => {
        alertConfermaUpdate.classList.add('d-none');
        confirmUpdateBtn.removeEventListener('click', gestioneUpdateConfirm);
        cancelUpdateBtn.removeEventListener('click', gestioneUpdateCancel);
      };
      //evento in base al click
      confirmUpdateBtn.addEventListener('click', gestioneUpdateConfirm);
      cancelUpdateBtn.addEventListener('click', gestioneUpdateCancel);
    });

    tdActions.appendChild(btnUpdate);

    //BTN DELETE
    const btnDelete = document.createElement('a');
    btnDelete.classList.add('btn', 'btn-danger', 'btn-sm', 'me-1', 'mb-only-sm');
    btnDelete.innerText = 'Delete';

    btnDelete.addEventListener('click', () => {
      //mostro alert
      alertConfermaDelete.classList.remove('d-none');
      //in caso di click su 'confirm'
      const gestioneConfirm = () => {
        eliminaProdotto(product._id);
        alertConfermaDelete.classList.add('d-none');
        confirmDeleteBtn.removeEventListener('click', gestioneConfirm);
        cancelDeleteBtn.removeEventListener('click', gestioneCancel);
      };
      //in caso di click su 'cancel'
      const gestioneCancel = () => {
        alertConfermaDelete.classList.add('d-none');
        confirmDeleteBtn.removeEventListener('click', gestioneConfirm);
        cancelDeleteBtn.removeEventListener('click', gestioneCancel);
      };
      //evento in base al click
      confirmDeleteBtn.addEventListener('click', gestioneConfirm);
      cancelDeleteBtn.addEventListener('click', gestioneCancel);
    });

    tdActions.appendChild(btnDelete)

    tr.append(tdName, tdBrand, tdImage, tdPrice, tdActions);
    return tr;
  } catch (error) {
    console.warn("Errore nel caricamento della riga: ", error);
  }
}

////////////////////////////////////
/////GESTIONE AGGIUNTA PRODOTTO/////
////////////////////////////////////
async function saveProduct() {
  console.log("btnSalva funziona");

  // prodotto da aggiungere
  const nuovoProdotto = {
    name: productName.value,
    description: productDescription.value,
    brand: productBrand.value,
    imageUrl: productImage.value,
    price: parseFloat(productPrice.value),
  };
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVhODY0ODRlZjFiYzAwMTVkZjVhZmYiLCJpYXQiOjE3NTA3NjMwODEsImV4cCI6MTc1MTk3MjY4MX0.6HlWZ_oJAV-t9dTDPzSUrX9d0v9csoawLruhltDs-EY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuovoProdotto),
    });
    console.log(nuovoProdotto);
    if (!response.ok) throw new Error("Errore nel salvataggio prodotto");

    alertProdottoSalvato.classList.remove('d-none');

    setTimeout(() => {
      alertProdottoSalvato.classList.add('d-none');
    }, 3000);

    fetchaProdotti(); // ricarica la tabella
    clearForm();

  } catch (error) {
    console.log("Errore nel salvataggio: ", error);
  }
}

function clearForm() {
  productName.value = "";
  productDescription.value = "";
  productBrand.value = "";
  productImage.value = "";
  productPrice.value = "";
}

btnSalva.addEventListener("click", saveProduct);

////////////////////////////////////////////////
/////GESTIONE APERTURA FORM CARICA PRODOTTO/////
////////////////////////////////////////////////
function CaricaNuovoProdotto() {
  console.log("btnCaricaNuovoProdotto funziona")
  formCaricaProdotto.classList.toggle("d-none")

  const icon = btnCaricaProdotto.querySelector("i");
  icon.classList.toggle("bi-plus-square");
  icon.classList.toggle("bi-dash-square");
}

btnCaricaProdotto.addEventListener('click', CaricaNuovoProdotto)

///////////////////////////////////
/////GESTIONE ELIMINA PRODOTTO/////
///////////////////////////////////
async function eliminaProdotto(productId) {
  try {
    const response = await fetch(API_URL + productId, {
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVhODY0ODRlZjFiYzAwMTVkZjVhZmYiLCJpYXQiOjE3NTA3NjMwODEsImV4cCI6MTc1MTk3MjY4MX0.6HlWZ_oJAV-t9dTDPzSUrX9d0v9csoawLruhltDs-EY",
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error('Errore durante la cancellazione');
    }

    alertProductDeleted.classList.remove('d-none')
    setTimeout(() => {
      alertProductDeleted.classList.add('d-none')
    }, 3000);

    fetchaProdotti();
  } catch (error) {
    alert('Errore nella cancellazione del prodotto: ' + error);
  }
}

