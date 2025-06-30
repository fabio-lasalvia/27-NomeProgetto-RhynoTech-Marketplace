/////////////////////////////////////
/////GESTIONE CARICAMENTO PAGINE/////
/////////////////////////////////////
const PATH_PAGINA_HOME = "marketplaceHome.html";

function caricaMarketplaceHome() {
  console.log("Funzione marketplaceHome eseguita!");
  caricaPagina(PATH_PAGINA_HOME);
}

function caricaPagina(pagina) {
  console.log("Caricamento pagina:", pagina);
  window.location.replace(pagina);
}

/////////////////////////////////////////
/////DICHIARAZIONE VARIABILI GLOBALI/////
/////////////////////////////////////////
const spinner = document.querySelector("#spinner");
const API_URL = "https://striveschool-api.herokuapp.com/api/product/";
const rigaProdotti = document.querySelector("#productsRow");

/////////////////////////////////
/////GESTIONE CHIAMATE FETCH/////
/////////////////////////////////
async function fetchaMarketplace() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVhODY0ODRlZjFiYzAwMTVkZjVhZmYiLCJpYXQiOjE3NTA3NjMwODEsImV4cCI6MTc1MTk3MjY4MX0.6HlWZ_oJAV-t9dTDPzSUrX9d0v9csoawLruhltDs-EY",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Response non OK: " + response.status);

    const data = await response.json();
    console.log(data);
    console.log("Numero prodotti:", data.length);
    mostraProdotti(data)

    // let card = "";
    // data.forEach((product) => {
    //   card += `
    //   <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    //     <div class="card p-3">
    //       <img src="${product.imageUrl}" class="card-img-top img-fluid" alt="${product.name}">
    //       <div class="card-body">
    //         <h5 class="card-title">${product.name}</h5>
    //         <p class="card-text">${product.description}</p>
    //         <a href="productDetail.html?id=${product._id}" class="btn btn-primary d-flex justify-content-center text-center mb-2">Dettagli</a>
    //         <div class="d-flex justify-content-between">
    //         <a href="#" class="btn btn-primary d-flex justify-content-center text-center w-100 mb-2 me-1">Add</a>
    //         <a href="#" class="btn btn-danger d-flex justify-content-center text-center w-100 mb-2">Delete</a>
    //         </div>
    //       </div>
    //     </div>
    //   </div>`;
    // });
    // document.querySelector("#productsRow").innerHTML = card;
  } catch (error) {
    console.warn("Errore nella fetch: ", error);
  }
}

////////////////////////////////////
/////GESTIONE CHIAMATA FUNZIONI/////
////////////////////////////////////
const path = window.location.pathname;

if (path.includes("marketplaceHome.html")) {
  gestisciSpinner();
  fetchaMarketplace();
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
  rigaProdotti.innerHTML = "";

  const tabellaProdotti = products.map((product) => caricaProdotto(product));
  rigaProdotti.append(...tabellaProdotti);
}

////////////////////////////////////
/////GESTIONE CREAZIONE TABELLA/////
////////////////////////////////////
function caricaProdotto(product) {
  try {
    //col
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";
    //se creassi un attributo category per filtrare i prodotti
    //col.setAttribute("data-category", product.category);

    //card
    const card = document.createElement("div");
    card.className = "card cardProduct p-3 bg-dark text-light h-100";

    //img card
    const imgCard = document.createElement("img");
    imgCard.className = "card-img-top img-fluid";
    imgCard.src = product.imageUrl;
    imgCard.alt = product.name;

    //container testi card
    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column p-3";

    //titolo card
    const titoloCard = document.createElement("h5");
    titoloCard.className = "card-title mb-2 fw-bold";
    titoloCard.style.color = '#ffa500';
    titoloCard.textContent = product.name;

    //testo card
    const testoCard = document.createElement("p");
    testoCard.className = "card-text mb-3";
    testoCard.textContent = product.description
    testoCard.title = product.description;

    //btn dettaglio
    const linkDettaglio = document.createElement("a");
    linkDettaglio.className = "btn btn-light d-flex justify-content-center text-center mt-auto mb-2";
    linkDettaglio.href = `marketplaceDetails.html?id=${product._id}`;
    // linkDettaglio.href = `marketplaceDetails.html`;
    linkDettaglio.textContent = "Details"

    //container btn
    const btnContainer = document.createElement("div");
    btnContainer.className = "d-flex justify-content-between flex-column flex-md-row gap-2";

    //btn aggiungi
    const btnAggiungi = document.createElement("a");
    btnAggiungi.className = "btn btn-success d-flex justify-content-center text-center w-100 w-md-auto mb-2 me-1";
    btnAggiungi.href = "#";
    btnAggiungi.textContent = "Add"

    //btn rimuovi
    const btnElimina = document.createElement("button");
    btnElimina.className = "btn btn-danger d-flex justify-content-center text-center w-100 w-md-auto mb-2";
    btnElimina.href = "#";
    btnElimina.textContent = "Remove";

    btnContainer.append(btnAggiungi, btnElimina);

    cardBody.append(titoloCard, testoCard, linkDettaglio, btnContainer);

    card.append(imgCard, cardBody);

    col.append(card);

    return col;

  } catch (error) {
    console.warn("Errore nel caricamento della riga: ", error);
  }
}