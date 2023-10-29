function getValues() {
    return JSON.parse(document.querySelector("#MainContent_chartValues").value);
}

console.log(getValues())

const partyData = [
    {name: "r", percent: 43},
    {name: "krf", percent: 14},
    {name: "v", percent: 14},
];

const chartContainer = document.querySelector(".chart__container");
const maxPercent = Math.max(...partyData.map(party => party.percent));

partyData.forEach(party => {
    const bar = document.createElement("div");
    bar.className = "chart__bar";
    bar.textContent = `${party.name} (${party.percent}%)`;

    // Calculate and set the width relative to the maximum
    const relativeWidth = (party.percent / maxPercent) * 100;
    bar.style.width = relativeWidth + "%";

    chartContainer.appendChild(bar);
});
