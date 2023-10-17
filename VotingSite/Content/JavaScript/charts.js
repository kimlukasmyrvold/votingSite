function getValues() {
    return JSON.parse(document.querySelector("#MainContent_chartValues").value);
}

console.log(getValues())