
const currencies = {
    AED: "AE",
    AFN: "AF",
    XCD: "AG",
    ALL: "AL",
    AMD: "AM",
    ANG: "AN",
    AOA: "AO",
    AQD: "AQ",
    ARS: "AR",
    AUD: "AU",
    AZN: "AZ",
    BAM: "BA",
    BBD: "BB",
    BDT: "BD",
    XOF: "BE",
    BGN: "BG",
    BHD: "BH",
    BIF: "BI",
    BMD: "BM",
    BND: "BN",
    BOB: "BO",
    BRL: "BR",
    BSD: "BS",
    NOK: "BV",
    BWP: "BW",
    BYR: "BY",
    BZD: "BZ",
    CAD: "CA",
    CDF: "CD",
    XAF: "CF",
    CHF: "CH",
    CLP: "CL",
    CNY: "CN",
    COP: "CO",
    CRC: "CR",
    CUP: "CU",
    CVE: "CV",
    CYP: "CY",
    CZK: "CZ",
    DJF: "DJ",
    DKK: "DK",
    DOP: "DO",
    DZD: "DZ",
    ECS: "EC",
    EEK: "EE",
    EGP: "EG",
    ETB: "ET",
    EUR: "FR",
    FJD: "FJ",
    FKP: "FK",
    GBP: "GB",
    GEL: "GE",
    GGP: "GG",
    GHS: "GH",
    GIP: "GI",
    GMD: "GM",
    GNF: "GN",
    GTQ: "GT",
    GYD: "GY",
    HKD: "HK",
    HNL: "HN",
    HRK: "HR",
    HTG: "HT",
    HUF: "HU",
    IDR: "ID",
    ILS: "IL",
    INR: "IN",
    IQD: "IQ",
    IRR: "IR",
    ISK: "IS",
    JMD: "JM",
    JOD: "JO",
    JPY: "JP",
    KES: "KE",
    KGS: "KG",
    KHR: "KH",
    KMF: "KM",
    KPW: "KP",
    KRW: "KR",
    KWD: "KW",
    KYD: "KY",
    KZT: "KZ",
    LAK: "LA",
    LBP: "LB",
    LKR: "LK",
    LRD: "LR",
    LSL: "LS",
    LTL: "LT",
    LVL: "LV",
    LYD: "LY",
    MAD: "MA",
    MDL: "MD",
    MGA: "MG",
    MKD: "MK",
    MMK: "MM",
    MNT: "MN",
    MOP: "MO",
    MRO: "MR",
    MTL: "MT",
    MUR: "MU",
    MVR: "MV",
    MWK: "MW",
    MXN: "MX",
    MYR: "MY",
    MZN: "MZ",
    NAD: "NA",
    XPF: "NC",
    NGN: "NG",
    NIO: "NI",
    NPR: "NP",
    NZD: "NZ",
    OMR: "OM",
    PAB: "PA",
    PEN: "PE",
    PGK: "PG",
    PHP: "PH",
    PKR: "PK",
    PLN: "PL",
    PYG: "PY",
    QAR: "QA",
    RON: "RO",
    RSD: "RS",
    RUB: "RU",
    RWF: "RW",
    SAR: "SA",
    SBD: "SB",
    SCR: "SC",
    SDG: "SD",
    SEK: "SE",
    SGD: "SG",
    SKK: "SK",
    SLL: "SL",
    SOS: "SO",
    SRD: "SR",
    STD: "ST",
    SVC: "SV",
    SYP: "SY",
    SZL: "SZ",
    THB: "TH",
    TJS: "TJ",
    TMT: "TM",
    TND: "TN",
    TOP: "TO",
    TRY: "TR",
    TTD: "TT",
    TWD: "TW",
    TZS: "TZ",
    UAH: "UA",
    UGX: "UG",
    USD: "US",
    UYU: "UY",
    UZS: "UZ",
    VEF: "VE",
    VND: "VN",
    VUV: "VU",
    YER: "YE",
    ZAR: "ZA",
    ZMK: "ZM",
    ZWD: "ZW",
  };


const BASE_URL = "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=425c2d788c52496a9914d9bd6b330575";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const invertBtn = document.getElementById("invert-btn");

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // 🚫 Prevent form refresh on Enter
  updateExchangeRate();
});


for (let select of dropdowns) {
  for (let code in currencies) {
    const flag = currencies[code];
    const option = document.createElement("option");
    option.value = code;
    option.innerText = code;
    option.dataset.flag = flag;

    // Set default
    if (select.name === "from" && code === "USD") option.selected = true;
    if (select.name === "to" && code === "INR") option.selected = true;

    select.appendChild(option);
  }

  // Update flag on change
  select.addEventListener("change", (e) => updateFlag(e.target));
}


// Flag updater
function updateFlag(selectElement) {
  const img = selectElement.parentElement.querySelector("img");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const flagCode = selectedOption.dataset.flag;
  if (img && flagCode) {
    img.src = `https://flagsapi.com/${flagCode}/flat/64.png`;
  }
}

// Convert currency
async function updateExchangeRate() {
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    msg.innerText = "Please enter a valid amount greater than 0.";
    return;
  }

  const response = await fetch(BASE_URL);
  if (!response.ok) {
    msg.innerText = "Error fetching exchange rates.";
    return;
  }

  const data = await response.json();

  const fromRate = parseFloat(data.rates[fromCurr.value]);
  const toRate = parseFloat(data.rates[toCurr.value]);

  if (!fromRate || !toRate) {
    msg.innerText = "Currency not supported.";
    return;
  }

  const converted = ((toRate / fromRate) * amount).toFixed(2);
  msg.innerText = `${amount} ${fromCurr.value} = ${converted} ${toCurr.value}`;
}

// Invert currencies
invertBtn.addEventListener("click", () => {
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// Handle button
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// On page load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
