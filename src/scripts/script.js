const form = document.getElementById("converterForm");
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const convertedAmount = document.getElementById("convertedAmount");
const toCurrency = document.getElementById("toCurrency");
const loading = document.querySelector(".loading");
const result = document.querySelector(".result");
const error = document.querySelector(".error-message");
const exchangeRatesTableBody = document.getElementById("exchangeRatesTableBody");

// Lista de moedas
const currencies = ["USD", "EUR", "JPY", "AUD", "CHF", "CNY", "BRL"];

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

async function convertMoney() {

    loading.style.display = "block";
    result.style.display = "none";
    error.style.display = "none";

    try {

        const response = await fetch(API_URL + fromCurrency.value);
        const data = await response.json();

        const rate = data.rates[toCurrency.value];
        const convertedValue = (amount.value * rate).toFixed(2);

        convertedAmount.value = convertedValue;
        result.style.display = "block";

        result.innerHTML = `
            <div style="font-size: 1.4rem;">
                ${amount.value} ${fromCurrency.value} = ${convertedAmount.value} ${toCurrency.value}
            </div>

            <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">
                Taxa de câmbio: 1 ${fromCurrency.value} = ${rate} ${toCurrency.value}
            </div>
        `
        
    } catch (err) {
        error.style.display = "block";
        error.innerHTML = "Erro ao converter moeda. Tente novamente.";
        console.error("Erro ao converter moeda:", err);
    }
    
    loading.style.display = "none";
}

form.addEventListener("submit", function(event){
    event.preventDefault()
    convertMoney()
})

// Atualiza a tabela de taxas de câmbio

function populateCurrencyOptions() {
    exchangeRatesTableBody.innerHTML = "";
    currencies.forEach(currency => {
        if (currency !== fromCurrency.value) {
            const dataPromise = fetch(API_URL + fromCurrency.value).then(res => res.json());
            const row = document.createElement("tr");
            const toCurrencyCell = document.createElement("td");
            const rateCell = document.createElement("td");
            const dateCell = document.createElement("td");
            const rate = document.createElement("td");
            const fromCurrencyCell = document.createElement("td");

            row.appendChild(dateCell);
            dateCell.textContent = new Date().toLocaleDateString("pt-BR");
            toCurrencyCell.textContent = currency;
            row.appendChild(fromCurrencyCell);
            row.appendChild(toCurrencyCell);
            row.appendChild(rateCell);
            fromCurrencyCell.textContent = fromCurrency.value;

            dataPromise.then(data => {
                rateCell.textContent = data.rates[currency].toFixed(2);
                dateCell.textContent = new Date(data.date).toLocaleDateString("pt-BR");
            });
            dataPromise.catch(err => {
                rateCell.textContent = "Erro";
                dateCell.textContent = "-";
                console.error("Erro ao buscar taxa de câmbio:", err);
            });

            exchangeRatesTableBody.appendChild(row);

        }
    });
}

function atualizarTabela() {
    const dados = populateCurrencyOptions();
    return dados;
}

document.querySelector(".update-btn").addEventListener("click", atualizarTabela);

populateCurrencyOptions();
fromCurrency.addEventListener("change", populateCurrencyOptions);

form.addEventListener("submit", function(event){
    event.preventDefault()
    populateCurrencyOptions()
})
