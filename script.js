const BreweryAPI = "https://api.openbrewerydb.org/breweries";
const BreweryRandom = "https://api.openbrewerydb.org/breweries/random?size=20";
const BreweryById = "https://api.openbrewerydb.org/breweries/";
const BrewerySearchName = "https://api.openbrewerydb.org/breweries?by_name=";

const contenido = document.getElementById("contenido");
const comments = document.getElementById("comments");
const selectCountry = document.getElementById("selectCountry");
const selectState = document.getElementById("selectState");


// llenar select DOM
async function fillSelects() {
  let response = await fetch(BreweryAPI);
  let dataShop = await response.json();
  let arrCountry=[];
  let arrState=[];

  const dfultC = document.createElement("option");
  dfultC.value = "";
  dfultC.innerText = "Select..";
  selectCountry.appendChild(dfultC);

  const dfultS = document.createElement("option");
  dfultS.value = "";
  dfultS.innerText = "Select..";
  selectState.appendChild(dfultS);

  dataShop.forEach((shop) => {
    if (arrCountry.indexOf(shop.country)==-1) {
      const selectC = document.createElement("option");
      selectC.value = shop.country;
      selectC.innerText = shop.country;
      selectCountry.appendChild(selectC);
    }
    arrCountry.push(shop.country);
  });

  dataShop.forEach((shop) => {
    if (arrState.indexOf(shop.state)==-1 && shop.state != null) {
      const selectE = document.createElement("option");
      selectE.value = shop.state;
      selectE.innerText = shop.state;
      selectState.appendChild(selectE);
    }
    arrState.push(shop.state);
  });
}

// buscador por nombre 
  async function getShopSearch() {
    let name = document.getElementById("search").value;

    if (name != "") {
      let response = await fetch(`${BrewerySearchName}${name}`);
      let dataShop = await response.json();
      contenido.innerHTML = "";
    
      dataShop.forEach((shop) => {
        drawShop(shop, "normalShop");
      });
    }
  }

// mostrar todas las tiendas favoritas
function getShopFavorites() {
  let shops = []; 
  const favoriteJSON = localStorage.getItem('favorite');

  if (favoriteJSON != null) shops = JSON.parse(favoriteJSON);
  contenido.innerHTML = "";

  for (o in shops) {
    drawShop(shops[o], "favoriteShop");
  };
}


// tienda favorita
async function favoriteStore(id, action) {
  let response = await fetch(`${BreweryById}${id}`);
  let dataShop = await response.json();

  if (action == "add"){
    save_localStorage(dataShop);
  } else if (action == "remove") {
    remove_localStorage(dataShop);
  }

}

// 20 tiendas aleatorias
async function getShopRandom() {
  let response = await fetch(BreweryRandom);
  let dataShop = await response.json();
  contenido.innerHTML = "";

  dataShop.forEach((shop) => {
    drawShop(shop, "normalShop");
  });
}


// filtros
async function getShopFilters(type, country, state) {
  let response;

  switch (type) {
    case "":
      response = await fetch(`https://api.openbrewerydb.org/breweries?by_country=${country}&by_state=${state}`);
    break;
    default:
      response = await fetch(`https://api.openbrewerydb.org/breweries?by_type=${type}&by_country=${country}&by_state=${state}`);
    break;
  }
  let dataShop = await response.json();
  contenido.innerHTML = "";
 
  dataShop.forEach((shop) => {
    drawShop(shop, "normalShop");
  });
}


// pinta una tienda. Recibe un objeto json?
function drawShop(ObjectShop, type) {
  let shopDiv = document.createElement("div");
  shopDiv.classList.add("shop");
  contenido.appendChild(shopDiv);

  let parrafos = document.createElement("div");
  parrafos.classList.add("parrafos");

  let titulo = document.createElement("h3");
  titulo.innerHTML = "<b>" + ObjectShop.name + "</b><br><br>";
  parrafos.appendChild(titulo);

  for (o in ObjectShop) {
    if (ObjectShop[o] != null && o != "name" && o != "id" && o != "longitude" && o != "latitude" && o != "updated_at" && o != "created_at") {
      let parrafo = document.createElement("p");
      parrafo.innerHTML = "<b>" + o + "</b>:  " + ObjectShop[o];
      parrafos.appendChild(parrafo);
    }
  }

  let br = document.createElement("p");
  br.innerHTML = "<br>";
  parrafos.appendChild(br);

  switch(type) {
    case "normalShop":
      let favorite = document.createElement("button");
      favorite.id = ObjectShop.id;
      favorite.classList.add("favoriteShops");
      favorite.innerHTML="Add to Favorites";
      favorite.addEventListener("click", e => {favoriteStore(ObjectShop.id, "add")});
      parrafos.appendChild(favorite);
    
      shopDiv.appendChild(parrafos);
      break;
    case "favoriteShop":
      let removeFavorite = document.createElement("button");
      removeFavorite.id = ObjectShop.id;
      removeFavorite.classList.add("removeFavorite");
      removeFavorite.innerHTML="Remove to Favorites";
      removeFavorite.addEventListener("click", e => {favoriteStore(ObjectShop.id, "remove")});
      parrafos.appendChild(removeFavorite);
    
      shopDiv.appendChild(parrafos);
      break;
    default:
      console.log("default case switch");
  }
};

// pinta tienda favorita
function drawShopFavorite(ObjectShop) {
  let shopDiv = document.createElement("div");
  shopDiv.classList.add("shop");
  contenido.appendChild(shopDiv);

  let parrafos = document.createElement("div");
  parrafos.classList.add("parrafos");

  let titulo = document.createElement("h3");
  titulo.innerHTML = "<b>" + ObjectShop.name + "</b><br><br>";
  parrafos.appendChild(titulo);

  for (o in ObjectShop) {
    if (ObjectShop[o] != null && o != "name" && o != "id") {
      let parrafo = document.createElement("p");
      parrafo.innerHTML = "<b>" + o + "</b>:  " + ObjectShop[o];
      parrafos.appendChild(parrafo);
    }
  }

  let br = document.createElement("p");
  br.innerHTML = "<br>";
  parrafos.appendChild(br);

  let removeFavorite = document.createElement("button");
  removeFavorite.id = ObjectShop.id;
  removeFavorite.classList.add("removeFavorite");
  removeFavorite.innerHTML="Remove to Favorites";
  removeFavorite.addEventListener("click", e => {favoriteStore(ObjectShop.id, "remove")});
  parrafos.appendChild(removeFavorite);

  shopDiv.appendChild(parrafos);
}


// Menu lateral evento desplegar
let listElements = document.querySelectorAll(".list_button_click");

listElements.forEach((listElement) => {
  listElement.addEventListener("click", () => {
    let height = 0;
    let menu = listElement.nextElementSibling;
    if (menu.clientHeight == "0") {
      height = menu.scrollHeight;
    }

    menu.style.height = `${height}px`;
  });
});

// Evento click input radio tipos
let listElementsLinks = document.querySelectorAll(".nav_link_inside");

listElementsLinks.forEach(el => {
  el.addEventListener("click", e => { 
    getListShops();
  });
});


// Obtener opciones seleccionadas
function getListShops() {
  let typeRadio = document.querySelector('input[name="type"]:checked').value;
  let selectCountry = document.getElementById("selectCountry").value;
  let selectState = document.getElementById("selectState").value;

  getShopFilters(typeRadio, selectCountry, selectState);
}

//añadir tienda localstorage favoritos
function save_localStorage(shop) {

  let shops = []; 
  const favoriteJSON = localStorage.getItem('favorite');

  if (favoriteJSON != null) shops = JSON.parse(favoriteJSON);
  let AuxShop = shops.filter((s) => s.id == shop.id);
  if (AuxShop.length === 0)   shops.push(shop);

  const carritoToJSON = JSON.stringify(shops);
  localStorage.setItem('favorite', carritoToJSON);
};

//eliminar tienda localstorage favoritos
function remove_localStorage(shop) {

  let shops = []; 
  const favoriteJSON = localStorage.getItem('favorite');
  shops = JSON.parse(favoriteJSON);
  shops = shops.filter((s) => s.id !== shop.id);

  const carritoToJSON = JSON.stringify(shops);
  localStorage.setItem('favorite', carritoToJSON);

  getShopFavorites();
};

// comentarios
const commentsDiv = document.createElement("div");
commentsDiv.setAttribute("id", "commentsDiv");

const commentsSection = document.createElement("textarea");
commentsSection.setAttribute("id", "commentsSection");
commentsSection.innerText = "Write something here";

const sendButton = document.createElement("button");
sendButton.setAttribute("class", "buttonSend");
sendButton.setAttribute("value", "Send");
sendButton.innerText = "Send";
sendButton.addEventListener("click", e => {addCommentLocalStorage(document.getElementById("commentsSection").value)});

commentsDiv.appendChild(commentsSection);
commentsDiv.appendChild(sendButton);
comments.appendChild(commentsDiv);

const commentsDivSon = document.createElement("div");
commentsDivSon.setAttribute("id", "commentsDivSon");
comments.appendChild(commentsDivSon);

// añadir comentario
function addComment(text, position) {

  const DivC = document.createElement("div");
  DivC.setAttribute("class", "DivC");

  const comment = document.createElement("textarea");
  comment.setAttribute("class", "comment");
  comment.setAttribute("id", position);
  comment.innerText = text;

  const deleteComment = document.createElement("button");
  deleteComment.setAttribute("class", "buttonDelete");
  deleteComment.innerText = "Delete";
  deleteComment.addEventListener("click", e => {delComment(comment.id)});

  DivC.appendChild(comment);
  DivC.appendChild(deleteComment);
  commentsDivSon.appendChild(DivC);
  
}

// añadir el comentario
function addCommentLocalStorage(textComment) {
  let comments = []; 
  const commentsJSON = localStorage.getItem('comments');
  if (commentsJSON != null) comments = JSON.parse(commentsJSON);
  
  comments.push(textComment);

  const commentsToJSON = JSON.stringify(comments);
  localStorage.setItem('comments', commentsToJSON);

  let position = comments.length - 1;
  addComment(textComment, position);
}

// eliminar el comentario
function delComment(id) {
  let comments = []; 
  const commentsJSON = localStorage.getItem('comments');
  comments = JSON.parse(commentsJSON);

  delete(comments[id]);

  const commentsToJSON = JSON.stringify(comments);
  localStorage.setItem('comments', commentsToJSON);

  commentsDivSon.innerHTML = "";
  fillComments()
}

// mostrar comentarios
function fillComments() {
  let comments = []; 
  const commentsJSON = localStorage.getItem('comments');
  if (commentsJSON != null) {
    comments = JSON.parse(commentsJSON);
    for (let x = 0; x <= comments.length-1; x++) {
    if(comments[x] != null) addComment(comments[x], x);   
    };
  }
}

// llamada funciones
getShopRandom();
fillSelects();
fillComments();