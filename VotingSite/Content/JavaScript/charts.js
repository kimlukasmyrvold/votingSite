function addToChart() {
    const selectedOptionBtn = document.querySelector(".barChart .controls .button.selected");
    const option = (selectedOptionBtn) ? selectedOptionBtn.dataset.option.toString() : "percent";
    const chartContainer = document.querySelector(".barChart .container");
    const [partyData, maxPercent] = getPartyData();
    chartContainer.innerHTML = "";

    partyData.forEach(data => {
        const item = document.createElement("div");
        item.className = "item";

        const bar = document.createElement("span");
        bar.className = "bar";

        const party = document.createElement("div");
        const partyImg = document.createElement("img");
        party.className = "party";
        partyImg.setAttribute("alt", `Parti logo til ${data.Name}`);
        partyImg.setAttribute('src', `/Content/Images/PartyLogos/${data.Short}.png`);
        party.appendChild(partyImg);

        const value = document.createElement("span");
        value.className = "value";
        value.textContent = `${(option === "percent") ? data.Percent + "%" : data.Votes}`;

        const relativeWidth = (parseFloat(data.Percent) / maxPercent) * 100;
        bar.style.width = relativeWidth + "%";

        item.appendChild(party);
        item.appendChild(bar);
        item.appendChild(value);

        chartContainer.appendChild(item);
    });
}

function getPartyData() {
    const selected = document.querySelector(".barChart .controls .custom_select .select-selected");
    const selectedValue = (selected) ? selected.dataset.kid : 0;

    const rawPartyData = JSON.parse(document.querySelector(".barChartValues").value);
    const partyData = (selectedValue === 0 || selectedValue === "0") ? Object.values(mergePartyData(rawPartyData)) : filterByKommune(rawPartyData, selectedValue);

    partyData.sort((a, b) => parseFloat(b.Percent) - parseFloat(a.Percent));
    const maxPercent = Math.max(...partyData.map(party => parseFloat(party.Percent)));

    return [partyData, maxPercent];
}

function mergePartyData(partyData) {
    return partyData.reduce((acc, current) => {
        const key = current.Name;

        if (!acc[key]) {
            acc[key] = {...current};
        } else {
            acc[key].Votes = String(Number(acc[key].Votes) + Number(current.Votes));
            acc[key].Percent = parseFloat((acc[key].Percent + current.Percent).toFixed(1));
        }

        return acc;
    }, {});
}

function filterByKommune(data, kid) {
    return data.filter(item => item.Kid === parseFloat(kid));
}

function changeChartView(e) {
    e.preventDefault();

    document.querySelectorAll(".barChart .controls .button").forEach(btn => {
        btn.classList.remove("selected");
    });

    e.target.classList.add("selected");
    addToChart(e.target.dataset.option);
}

window.addEventListener("load", () => {
    clickListener(document.querySelectorAll(".barChart .controls .button"), changeChartView);
    clickListener(document.querySelectorAll(".barChart .select-items div"), addToChart);
    addToChart();
});