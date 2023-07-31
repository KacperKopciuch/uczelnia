const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '92cafd2032msh75252a91a66893ap1128bdjsn75fcdc8c70ba',
		'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
	}
};

fetch('https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0', options)
	.then(response => response.json())
	.then(response => getDataFromApi(response.data))
	.catch(err => console.error(err));

function getDataFromApi(data){
    createNavigationBar(data.stats);
    createCoinsTable(data.coins);
}
function createNavigationBar(data){
    let statsElement = document.getElementById("stats");
    stats.innerHTML = `
        <span class="statsSpan">Wszystkie coiny: </span>${data.totalCoins}
        <span class="statsSpan">Kapitalizacja rynku: </span> ${parseFloat(data.totalMarketCap).toLocaleString("en-US", {style:"currency", currency:"USD"})}
        <span class="statsSpan">Kapitalizacja rynku: </span> ${parseFloat(data.total24hVolume).toLocaleString("en-US", {style:"currency", currency:"USD"})}
    `;
}
function createCoinsTable(data){
    const coinsTableBodyElement = document.getElementById("coinsTableBody");
    data.forEach(element => {
        let isCoinInFavorite = favoritesList.includes(element.uuid);
        
        let priceFormatted = parseFloat(element.price).toLocaleString("en-US", {style:"currency", currency:"USD"});
        let marketCapFormatted = parseInt(element.marketCap).toLocaleString("en-US", {style:"currency", currency:"USD"});
        //const coinsTableRowElement = document.createElement("tr");
        //coinsTableRowElement.id = element.uuid;
        //coinsTableRowElement.innerHTML = `
        let id = element.uuid;
        let priceColor = "text-danger";
        if(element.change > 0){
            priceColor = "text-success";
        }
        coinsTableBodyElement.innerHTML += `
        <tr id="${element.uuid}">
            <td>${element.rank}</td>
            <td onClick="displayCoinModal(this.parentNode.id)"><img src="${element.iconUrl}" alt="${element.name} icon" > ${element.name}</td>
            <td onClick="displayCoinModal(this.parentNode.id)">${element.symbol}</td>
            <td onClick="displayCoinModal(this.parentNode.id)" class="${priceColor}">${priceFormatted}</td>
            <td onClick="displayCoinModal(this.parentNode.id)" class="${priceColor}">${element.change}</td>
            <td>${marketCapFormatted}</td>
            <td><i id="icon${element.uuid}" class="fa-solid fa-star ${isCoinInFavorite ? 'text-warning' : ''}" onClick="addCoinToFavorites(this.id)"></i></td>
        </tr>
        `;

        //coinsTableBodyElement.appendChild(coinsTableRowElement);
    });
}

function addCoinToFavorites(coinId){
    let iconElement = document.getElementById(coinId);
    let coinUuid = coinId.replace("icon","");

    
    if(iconElement.classList.contains("text-warning")){
        let coinIndex = favoritesList.indexOf(coinUuid);
        favoritesList.splice(coinIndex, 1);
        localStorage.favorites = JSON.stringify(favoritesList);
        iconElement.classList.remove("text-warning");
    }
    else{
        favoritesList.push(coinUuid);
        console.log(favoritesList);
        localStorage.favorites = JSON.stringify(favoritesList);
        iconElement.classList.add("text-warning");
        
    }
}

function displayCoinModal(coinId){
    console.log(coinId);
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '92cafd2032msh75252a91a66893ap1128bdjsn75fcdc8c70ba',
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
    };
    const url = 'https://coinranking1.p.rapidapi.com/coin/' + coinId + '?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h';
    fetch(url, options)
        .then(response => response.json())
        .then(response => changeCoinModalData(response.data.coin))
        .catch(err => console.error(err));


    const coinModal = new bootstrap.Modal("#coinModal", {
        keyboard: false
      });
    coinModal.show();
}

function changeCoinModalData(coinData){
    const modalHeader = document.getElementById("coinModalTitle");
    modalHeader.innerHTML = coinData.name;
    const modalBody = document.getElementById("coinModalBody");
    modalBody.innerHTML = `
        <img src="${coinData.iconUrl}" />
        <p>${coinData.description}</p>
    `;
}

let favoritesList = new Array();
if(localStorage.favorites == undefined){
    localStorage.favorites = JSON.stringify(favoritesList);
} else{
    console.log(localStorage.favorites);
    favoritesList = JSON.parse(localStorage.favorites);
}
