// ************************** \\
// *   Code for bar chart   * \\
// ************************** \\

function addToChart(data) {
    const selectedOptionBtn = getSelectedOption();
    const option = selectedOptionBtn.dataset.option.toString();
    const chartContainer = document.querySelector(".barChart .container");
    const [partyData, maxPercent] = getPartyData(data);
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

        item.append(party, bar, value);
        chartContainer.appendChild(item);
    });

    setWidthForValues();
}

function getPartyData(data) {
    const selected = document.querySelector(".barChart .controls .custom_select .select-selected");
    const selectedValue = (selected) ? selected.dataset.kid : "0";

    const rawPartyData = JSON.parse(data.d);
    const partyData = (selectedValue === "0")
        ? Object.values(mergePartyData(rawPartyData))
        : filterByKommune(rawPartyData, selectedValue);

    const voteCount = partyData.reduce((sum, row) => sum + (parseInt(row.Votes) || 0), 0)
    partyData.forEach(row => {
        const percent = (row.Votes / voteCount) * 100.0;
        row.Percent = percent.toFixed(1)
    });

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

function getSelectedOption() {
    const options = document.querySelectorAll(".barChart .controls .button");
    const selected = () => {
        return document.querySelector(".barChart .controls .button.selected");
    };

    if (!selected()) options[0].classList.add("selected");
    return selected();
}

function changeChartView(e) {
    e.preventDefault();

    document.querySelectorAll(".barChart .controls .button").forEach(btn => {
        btn.classList.remove("selected");
    });

    e.target.classList.add("selected");
    updateChart();
}


function updateChart() {
    $.ajax({
        type: 'POST',
        url: 'Default.aspx/GetChartData',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            addToChart(data);
            addToPieChart(data);

            const delay = randomMinute(8, 4);
            setTimeout(updateChart, delay);
            console.debug("Chart updated, next refresh in " + ((delay / 60) / 1000) + " minutes.");
        },
        error: function (xhr, status, error) {
            console.log('Error fetching data:');
            console.log('Status:', status);
            console.log('Error:', error);
            console.log('Response Text:', xhr.responseText);
        }
    });
}

function randomMinute(max, min) {
    return ((Math.floor(Math.random() * (max - min)) + min) * 60) * 1000;
}

// Make all values elements equal width
function setWidthForValues() {
    const values = document.querySelectorAll(".value");
    let max = 0;

    // get the max width
    values.forEach(value => {
        max = Math.max(max, value.offsetWidth);
    });

    // Add the width to all elements
    values.forEach(value => {
        value.style.width = `${max}px`;
    });
}


// ************************** \\
// *   Code for pie chart   * \\
// ************************** \\

function addToPieChart(data) {
    const pieChart = document.querySelector(".pieChart");
    const pieLabels = pieChart.querySelector(".labels");
    const pie = pieChart.querySelector(".pie");
    const [partyData, _] = getPartyData(data);
    pieLabels.innerHTML = "";
    pie.style = "";

    const conicGradient = [];
    let totalPercent = 0

    partyData.forEach(data => {
        const percent = parseFloat(data.Percent);
        const color = data.Color;

        conicGradient.push(`${color} ${totalPercent}% ${totalPercent + percent}%`);
        totalPercent += percent;


        // Pie labels
        const label = document.createElement("div");
        label.classList.add("label");

        const labelColor = document.createElement("div");
        labelColor.classList.add("color");
        labelColor.style.background = color;

        const labelName = document.createElement("span");
        labelName.classList.add("name");
        labelName.textContent = data.Name;

        label.append(labelColor, labelName);
        pieLabels.append(label);
    });

    pie.style.setProperty("background", `conic-gradient(${conicGradient.join(', ')})`);
}


window.addEventListener("load", () => {
    clickListener(".barChart .controls .button", changeChartView);
    clickListener(".barChart .select-items div", updateChart);
    updateChart();
});