/////////////////////////////////////////
/////DICHIARAZIONE VARIABILI GLOBALI/////
/////////////////////////////////////////
const spinner = document.querySelector("#spinner");
const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const containerDetails = document.querySelector("#container-details");

/////////////////////////////////
/////GESTIONE CHIAMATE FETCH/////
/////////////////////////////////
async function fetchDettaglioProdotto(id) {
  try {
    const response = await fetch(API_URL + id, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVhODY0ODRlZjFiYzAwMTVkZjVhZmYiLCJpYXQiOjE3NTA3NjMwODEsImV4cCI6MTc1MTk3MjY4MX0.6HlWZ_oJAV-t9dTDPzSUrX9d0v9csoawLruhltDs-EY",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Response non OK: " + response.status);

    const product = await response.json();
    console.log(product);

    caricaProdotto(product);
  } catch (error) {
    console.warn("Errore nel caricamento del prodotto: ", error);
  }
}

////////////////////////////////////
/////GESTIONE CHIAMATA FUNZIONI/////
////////////////////////////////////
const path = window.location.pathname;

if (path.includes("marketplaceDetails.html")) {
  gestisciSpinner();

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (productId) {
    fetchDettaglioProdotto(productId);
  }
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

//////////////////////////////////////
/////GESTIONE CREAZIONE DETTAGLIO/////
//////////////////////////////////////
function caricaProdotto(product) {
  try {
    const riga = document.createElement("div");
    riga.classList.add(
      "row",
      "rowDetails",
      "align-items-center",
      "d-flex",
      "justify-content-center",
      "bg-dark",
      "text-light",
      "rounded",
    );
    //riga.style.border = "1px solid green"
    containerDetails.appendChild(riga);

    // Colonna immagine
    const colImmagine = document.createElement("div");
    colImmagine.classList.add("col-12", "col-md-4");

    const imgArticolo = document.createElement("img");
    imgArticolo.src = product.imageUrl;
    imgArticolo.classList.add("img-fluid");

    colImmagine.appendChild(imgArticolo);
    riga.appendChild(colImmagine);

    // Colonna titolo + descrizione
    const colTesti = document.createElement("div");
    colTesti.classList.add("col-12", "col-md-4", "text-center");

    const titoloArticolo = document.createElement("h5");
    titoloArticolo.classList.add("title", "card-title", "mb-2", "fs-5");
    titoloArticolo.title = product.name;
    titoloArticolo.innerText = product.name;

    const descrizioneArticolo = document.createElement("p");
    descrizioneArticolo.classList.add("text", "card-text", "mb-2", "fs-6");
    descrizioneArticolo.innerText = product.description;

    colTesti.appendChild(titoloArticolo);
    colTesti.appendChild(descrizioneArticolo);
    riga.appendChild(colTesti);

    // Colonna prezzo
    const colPrezzo = document.createElement("div");
    colPrezzo.classList.add(
      "col-12",
      "col-md-4",
      "d-flex",
      "align-items-center",
      "justify-content-center",
    );

    const prezzoArticolo = document.createElement("p");
    prezzoArticolo.classList.add("prezzo", "mb-0", "fw-bold", "fs-4");
    prezzoArticolo.innerText = `€ ${product.price}`;

    colPrezzo.appendChild(prezzoArticolo);
    riga.appendChild(colPrezzo);

    return riga;
  } catch (error) {
    console.warn("Errore nel caricamento della riga: ", error);
  }
}
