function addToChart(option = "percent") {
    const chartContainer = document.querySelector(".barChart .container");
    const [partyData, maxPercent] = getPartyData();
    const isEmpty = (chartContainer.innerHTML === "");

    // if (!isEmpty) {
    //     const values = document.querySelectorAll(".barChart .value");
    //     for (let i = 0; i < values.length; i++) {
    //         values[i].textContent = `${(option === "percent") ? partyData[0].Percent + "%" : partyData[0].Votes}`;
    //     }
    //     return;
    // }
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

clickListener(document.querySelectorAll(".barChart .controls .button"), changeChartView);
addToChart();


// !!!!!   Experimental code   !!!!! \\
// !!!!!   Experimental code   !!!!! \\
// !!!!!   Experimental code   !!!!! \\

// from  https://www.w3schools.com/howto/tryit.asp?filename=tryhow_custom_select

let customSelect = document.querySelectorAll(".custom_select");

for (let i = 0; i < customSelect.length; i++) {
    let oldSelect = customSelect[i].querySelector("select");

    /*for each element, create a new DIV that will act as the selected item:*/
    let selected = document.createElement("div");
    selected.setAttribute("class", "select-selected");
    selected.textContent = oldSelect.options[oldSelect.selectedIndex].textContent;
    selected.dataset.kid = oldSelect.options[oldSelect.selectedIndex].value;
    customSelect[i].appendChild(selected);

    /*for each element, create a new DIV that will contain the option list:*/
    let itemsContainer = document.createElement("div");
    itemsContainer.setAttribute("class", "select-items select-hide");

    for (let j = 0; j < oldSelect.length; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        let item = document.createElement("div");
        item.textContent = oldSelect.options[j].textContent;
        item.dataset.kid = oldSelect.options[j].value;

        item.addEventListener("click", (e) => {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            let oldSelect = e.target.parentNode.parentNode.querySelector("select");
            let selected = e.target.parentNode.previousSibling;

            for (let i = 0; i < oldSelect.length; i++) {
                if (oldSelect.options[i].textContent === e.target.textContent) {
                    oldSelect.selectedIndex = i;
                    selected.textContent = e.target.textContent;
                    selected.dataset.kid = e.target.dataset.kid;
                    // console.log(oldSelect.selectedIndex)
                    // console.log(oldSelect.selectedOptions[0].value)
                    // console.log(oldSelect.selectedOptions[0].textContent)

                    let selectedItem = e.target.parentNode.querySelectorAll(".selected");
                    for (let k = 0; k < selectedItem.length; k++) {
                        selectedItem[k].removeAttribute("class");
                    }
                    e.target.setAttribute("class", "selected");
                    break;
                }
            }

            selected.click();
            
            // Calling addToChart on click
            addToChart(document.querySelector(".barChart .controls .button.selected").dataset.option);
        });
        itemsContainer.appendChild(item);
    }
    customSelect[i].appendChild(itemsContainer);

    selected.addEventListener("click", (e) => {
        e.stopPropagation();

        closeAllSelect(e.target);
        e.target.nextSibling.classList.toggle("select-hide");
        e.target.classList.toggle("active");
    });
}

function closeAllSelect(elmnt) {
    let arr = [];

    let selected = document.querySelectorAll(".select-selected");
    for (let i = 0; i < selected.length; i++) {
        if (elmnt === selected[i]) {
            arr.push(i);
        } else {
            selected[i].classList.remove("active");
        }
    }

    let items = document.querySelectorAll(".select-items");
    for (let i = 0; i < items.length; i++) {
        if (arr.indexOf(i)) {
            items[i].classList.add("select-hide");
        }
    }
}

document.addEventListener("click", closeAllSelect);