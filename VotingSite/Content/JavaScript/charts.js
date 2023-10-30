function getValues() {
    return JSON.parse(document.querySelector("#MainContent_chartValues").value);
}

const partyData = getValues();

partyData.sort((a, b) => parseFloat(b.Percent) - parseFloat(a.Percent));

const chartContainer = document.querySelector(".chart__container");
const maxPercent = Math.max(...partyData.map(party => parseFloat(party.Percent)));

partyData.forEach(party => {
    const bar = document.createElement("div");
    bar.className = "chart__bar";
    bar.textContent = `${party.Name} (${party.Percent}%)`;

    const relativeWidth = (parseFloat(party.Percent) / maxPercent) * 100;
    bar.style.width = relativeWidth + "%";

    chartContainer.appendChild(bar);
});

