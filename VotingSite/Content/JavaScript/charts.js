// ======<   Get Party Data   >====== \\
function getPartyData(data) {
    const selected = document.querySelector(".chart .chart__settings__region .custom_select .select-selected");
    const selectedValue = (selected) ? selected.dataset.value : "0";

    const rawPartyData = JSON.parse(data.d);
    const partyData = (selectedValue === "0")
        ? Object.values(mergePartyData(rawPartyData))
        : rawPartyData.filter(item => item.Kid === parseFloat(selectedValue));

    const voteCount = partyData.reduce((sum, row) => sum + (parseInt(row.Votes) || 0), 0)
    partyData.forEach(row => {
        const percent = (row.Votes / voteCount) * 100.0;
        row.Percent = percent.toFixed(1);
    });

    partyData.sort((a, b) => parseFloat(b.Votes) - parseFloat(a.Votes));
    return partyData;
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


// ======<   Do stuff with chart types   >====== \\
function changeChartType(e) {
    e.preventDefault();

    document.querySelectorAll(".chart .chart__settings__type .button").forEach(btn => {
        btn.classList.remove("selected");
    });

    e.target.classList.add("selected");
    updateChart();
}

function getSelectedType() {
    const types = document.querySelectorAll(".chart .chart__settings__type .button");
    const selected = () => {
        return document.querySelector(".chart .chart__settings__type .button.selected");
    };

    if (!selected()) types[0].classList.add("selected");
    return selected();
}


// ======<   Do stuff with chart options   >====== \\
function changeChartOption(e) {
    e.preventDefault();

    document.querySelectorAll(".chart .chart__settings__options .button").forEach(btn => {
        btn.classList.remove("selected");
    });

    e.target.classList.add("selected");
    updateChart();
}

function getSelectedOption() {
    const options = document.querySelectorAll(".chart .chart__settings__options .button");
    const selected = () => {
        return document.querySelector(".chart .chart__settings__options .button.selected");
    };

    if (!selected()) options[0].classList.add("selected");
    return selected();
}


// ======<   Bar Chart   >====== \\
function barChart(chartContent, partyData, option) {
    const maxPercent = Math.max(...partyData.map(party => parseFloat(party.Percent)));

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
        bar.style.width = `${relativeWidth}%`;

        item.append(party, bar, value);
        chartContent.appendChild(item);
    });
}


// ======<   Pie Chart   >====== \\
function pieChart(chartContent, partyData, option) {
    let totalPercent = 0;
    const conicGradient = [];

    const pieContainer = document.createElement("div");
    pieContainer.classList.add("pieContainer");
    const pie = document.createElement("div");
    pie.classList.add("pie");

    const pieLabels = document.createElement("div");
    pieLabels.classList.add("labels")

    // Pie labels
    partyData.forEach(data => {
        const percent = parseFloat(data.Percent);
        const color = data.Color;

        conicGradient.push(`${color} ${totalPercent}% ${totalPercent + percent}%`);
        totalPercent += percent;

        const label = document.createElement("div");
        label.classList.add("label");

        const labelColor = document.createElement("div");
        labelColor.classList.add("color");
        labelColor.style.background = color;

        const labelName = document.createElement("span");
        labelName.classList.add("name");
        labelName.textContent = data.Name;

        const value = document.createElement("span");
        value.classList.add("value");
        value.textContent = `${(option === "percent") ? data.Percent + "%" : data.Votes}`;

        label.append(labelColor, labelName, value);
        pieLabels.append(label);
    });

    pie.style.setProperty("background", `conic-gradient(${conicGradient.join(', ')})`);
    pieContainer.append(pie);
    chartContent.append(pieContainer, pieLabels);
}


// ======<   Updates Chart   >====== \\
function updateChart() {
    ajax("Default.aspx/GetChartData", null, (data) => {
        const selectedType = getSelectedType().dataset.option.toString();
        const selectedOption = getSelectedOption().dataset.option.toString();

        const chartContent = document.querySelector(".chart .chart__container .chart__container__content");
        const partyData = getPartyData(data);

        chartContent.dataset.charttype = selectedType;
        chartContent.innerHTML = "";

        const functionParams = [chartContent, partyData, selectedOption];
        const functionCall = window[`${selectedType}Chart`];
        if (typeof functionCall !== "function") throw new Error(`Invalid chart function! ${selectedType}Chart`);
        functionCall.apply(window, functionParams);

        // Updates chart every random minute (ranges from 8 to 4 minutes)
        const randomMinute = (max, min) => ((Math.floor(Math.random() * (max - min)) + min) * 60) * 1000;
        const delay = randomMinute(8, 4);
        setTimeout(updateChart, delay);
        console.debug("Chart updated, next refresh in " + ((delay / 60) / 1000) + " minutes.");
    });
}


window.addEventListener("load", () => {
    clickListener(".chart .chart__settings__type .button", changeChartType);
    clickListener(".chart .chart__settings__options .button", changeChartOption);
    clickListener(".chart .chart__settings__region .custom_select .select-items div", updateChart);
    updateChart();
});