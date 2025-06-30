/////////////////////////////////////////
/////DICHIARAZIONE VARIABILI GLOBALI/////
/////////////////////////////////////////
const spinner = document.querySelector("#spinner");
const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const productName = document.querySelector("#name");
const productDescription = document.querySelector("#description");
const productBrand = document.querySelector("#brand");
const productImage = document.querySelector("#imageUrl");
const productPrice = document.querySelector("#price");
const btnSalva = document.querySelector("#btnSalva");

const searchStr = window.location.search;
const searchObj = new URLSearchParams(searchStr);
const productId = searchObj.get("id");

const alertProdottoSalvato = document.querySelector('#alertProdottoSalvato')

/////////////////////////////////
/////GESTIONE CHIAMATE FETCH/////
/////////////////////////////////
async function fetchaProdotto() {
  try {
    const response = await fetch(API_URL + productId, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVhODY0ODRlZjFiYzAwMTVkZjVhZmYiLCJpYXQiOjE3NTA3NjMwODEsImV4cCI6MTc1MTk3MjY4MX0.6HlWZ_oJAV-t9dTDPzSUrX9d0v9csoawLruhltDs-EY",
      },
    });

    if (!response.ok) throw new Error("Errore nel caricamento del prodotto");

    const prodotto = await response.json();

    // form precompilato
    productName.value = prodotto.name;
    productDescription.value = prodotto.description;
    productBrand.value = prodotto.brand;
    productImage.value = prodotto.imageUrl;
    productPrice.value = prodotto.price;

  } catch (error) {
    console.error("Errore nella fetch:", error);
  }
}

////////////////////////////////////
/////GESTIONE CHIAMATA FUNZIONI/////
////////////////////////////////////
const path = window.location.pathname;

if (path.includes("marketplaceUpdateProduct.html")) {
  gestisciSpinner();
  fetchaProdotto();
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

/////////////////////////////////////////
/////GESTIONE AGGIORNAMENTO PRODOTTO/////
/////////////////////////////////////////
async function updateProduct() {
  const prodottoAggiornato = {
    name: productName.value.trim(),
    description: productDescription.value.trim(),
    brand: productBrand.value.trim(),
    imageUrl: productImage.value.trim(),
    price: parseFloat(productPrice.value),
  };

  try {
    const response = await fetch(API_URL + productId, {
      method: "PUT",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVhODY0ODRlZjFiYzAwMTVkZjVhZmYiLCJpYXQiOjE3NTA3NjMwODEsImV4cCI6MTc1MTk3MjY4MX0.6HlWZ_oJAV-t9dTDPzSUrX9d0v9csoawLruhltDs-EY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prodottoAggiornato)
    });

    if (response.ok) {
      alertProdottoSalvato.classList.remove('d-none');

      setTimeout(() => {
        alertProdottoSalvato.classList.add('d-none');
        window.location.href = "marketplaceBackOffice.html";
      }, 500);
    } else {
      const errorData = await response.json();
      throw new Error(`Errore nella richiesta: ${response.status} - ${errorData.message || "Errore generico"}`);
    }

  } catch (error) {
    console.error("Errore nel salvataggio del prodotto:", error);
  }
}

btnSalva.addEventListener('click', updateProduct)
