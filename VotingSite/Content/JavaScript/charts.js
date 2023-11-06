function addToChart(option = "percent") {
    const isEmpty = (chartContainer.innerHTML === "");

    if (isEmpty) {
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
    } else {
        const values = document.querySelectorAll(".value");
        for (let i = 0; i < values.length; i++) {
            values[i].textContent = `${(option === "percent") ? partyData[i].Percent + "%" : partyData[i].Votes}`;
        }
    }

}

function changeChartView(e) {
    e.preventDefault();

    document.querySelectorAll(".barChart .controls .button").forEach(btn => {
        btn.classList.remove("selected");
    });

    e.target.classList.add("selected");
    addToChart(e.target.dataset.option);
}

const partyData = JSON.parse(document.querySelector(".barChartValues").value);
partyData.sort((a, b) => parseFloat(b.Percent) - parseFloat(a.Percent));

const chartContainer = document.querySelector(".barChart .container");
const maxPercent = Math.max(...partyData.map(party => parseFloat(party.Percent)));

clickListener(document.querySelectorAll(".barChart .controls .button"), changeChartView);
addToChart();


// !!!!!   Experimental code   !!!!! \\
// !!!!!   Experimental code   !!!!! \\
// !!!!!   Experimental code   !!!!! \\

// from  https://www.w3schools.com/howto/tryit.asp?filename=tryhow_custom_select

let customSelect = document.querySelectorAll(".custom_select");

for (let i = 0; i < customSelect.length; i++) {
    let selElmnt = customSelect[i].querySelector("select");
    /*for each element, create a new DIV that will act as the selected item:*/
    let a = document.createElement("div");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    customSelect[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    let b = document.createElement("div");
    b.setAttribute("class", "select-items select-hide");
    for (let j = 0; j < selElmnt.length; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        let c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", (e) => {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            let y, yl;
            let s = e.target.parentNode.parentNode.querySelector("select");
            let sl = s.length;
            let h = e.target.parentNode.previousSibling;
            for (let i = 0; i < sl; i++) {
                if (s.options[i].innerHTML === e.target.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = e.target.innerHTML;
                    y = e.target.parentNode.querySelectorAll(".same-as-selected");
                    yl = y.length;
                    for (let k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    e.target.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    customSelect[i].appendChild(b);
    
    a.addEventListener("click", (e) => {
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