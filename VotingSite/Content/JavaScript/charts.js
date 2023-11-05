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
            console.log("Appended")
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

let x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            let y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML === this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    let arr = [];

    let selected = document.querySelectorAll(".select-selected");
    for (let i = 0; i < selected.length; i++) {
        if (elmnt === selected[i]) {
            arr.push(i)
        } else {
            selected[i].classList.remove("select-arrow-active");
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