function getPartiInfo(key) {
    return new Promise((resolve, reject) => {
        ajax("Default.aspx/GetPartiData", null, (e) => {
            const data = JSON.parse(e.d);
            for (let i = 0; i < Object.keys(data).length; i++) {
                if (data[i].Pid !== parseInt(key)) continue;
                resolve(data[i]);
                return;
            }

            reject("No parti found with key:" + key);
        });
    });
}


function openVoteForm(e) {
    e.preventDefault();
    observeAttributeChange(".modal #vote_form .selectFylke .select-selected", "data-value", showRemains);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submit(e);
    });

    getPartiInfo(e.target.dataset.id).then((partyData) => {
        const partiLogo = document.querySelector("#vote_form .partiLogo img");
        partiLogo.setAttribute("src", `Content/Images/PartyLogos/${partyData.Short}.png`);

        const partiName = document.querySelector("#vote_form .partiName");
        partiName.style.setProperty("--_parti-color", partyData.Color);
        partiName.textContent = partyData.Parti;
        partiName.dataset.parti = partyData.Parti;
        partiName.dataset.pid = partyData.Pid;

        showRemains();
        openModal("#vote_form");
    }).catch((error) => {
        console.error("There was error getting partyinfo:", error);
    });
}

function showRemains() {
    const selectedFylke = document.querySelector("#vote_form .selectFylke .select-selected");
    if (selectedFylke.getAttribute("data-value") === "0") return;

    document.querySelector("#vote_form .selectKommune").dataset.visible = "true";

    ajax("Default.aspx/GetFromKommuner", {
        selectedFid: parseInt(selectedFylke.dataset.value)
    }, (response) => {
        const select = document.querySelector("#vote_form .selectKommune select");
        while (select.options.length > 1) select.options[1].remove();

        JSON.parse(response.d).forEach(kommune => {
            addOption(select, kommune.Kid, kommune.Kommune);
        });

        createCustomSelects("#vote_form .selectKommune");
        clickListener("#vote_form .selectKommune .custom_select .select-items div", (e) => {
            document.querySelector("#vote_form .enterFnum").dataset.visible = "true";
        }, true);
    });
}


function submit(e) {
    e.preventDefault();
    if (!checkValues()) return;

    openModal("#vote_confirm");
    document.querySelector("#vote_confirm .title .parti_name").textContent = document.querySelector("#vote_form .partiName").dataset.parti;
}

function commitVote() {
    const values = {
        Pid: document.querySelector("#vote_form .partiName").dataset.pid,
        Fylke: document.querySelector("#vote_form .selectFylke .inputField .custom_select .select-selected").dataset.value,
        Kommune: document.querySelector("#vote_form .selectKommune .inputField .custom_select .select-selected").dataset.value,
        Fnum: document.querySelector("#vote_form .enterFnum .inputField input").value
    };

    ajax("Default.aspx/Vote", {
        data: JSON.stringify(values)
    }, (response) => {
        const [ok, msg] = [response.d.Item1, response.d.Item2];
        if (!ok) {
            const title = document.querySelector(".modal #vote_result .title");
            title.classList.add("error");
            title.textContent = msg;
        }

        openModal("#vote_result");
        clickListener(".modal #vote_result .results a", (e) => {
            document.querySelector('#results').scrollIntoView({
                behavior: "smooth"
            });
            closeModal(e);
        });
    });
}


function checkValues() {
    const check = (checker, validBox, errorMessage) => {
        if (checker) return true;

        const parent = validBox.parentElement;
        const offset = parent.parentElement.firstElementChild;

        validBox.textContent = errorMessage;
        parent.classList.add('invalid');
        parent.style.setProperty("--_offset", `${offset.offsetHeight}px`)

        setTimeout(() => {
            parent.classList.remove('invalid');
        }, 2_500);

        return false;
    }

    const fylke = document.querySelector("#vote_form .selectFylke .inputField .custom_select .select-selected");
    const kommune = document.querySelector("#vote_form .selectKommune .inputField .custom_select .select-selected");
    const fnum = document.querySelector("#vote_form .enterFnum .inputField input");

    const fylkeOk = check("0" !== fylke.dataset.value, document.querySelector("#vote_form .personalInfo .validFylke"), "Du må velge et fylke først!");
    const kommuneOk = check("0" !== kommune.dataset.value, document.querySelector("#vote_form .personalInfo .validKommune"), "Du må velge en kommune først!");
    const fnumOk = check(/^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}\s?\d{5}$/.test(fnum.value), document.querySelector("#vote_form .personalInfo .validFNum"), "Ugyldig fødselsnummer!");

    return fylkeOk && kommuneOk && fnumOk;
}


// ======<   Code to run on startup   >====== \\

// Aligning partier dropdown acording to window space
function alignPartiHover() {
    // Checking for overflow
    function isOverflow(parent, child) {
        let left = 0;
        let op = child;
        while (op && op !== parent) {
            left += op.offsetLeft;
            op = op.offsetParent;
        }

        return left + child.offsetWidth > parent.offsetWidth;
    }

    // Handling the items depending on if they are overflowing
    function getHoverHandler(parent, child) {
        return function () {
            if (!isOverflow(parent, child)) return;
            child.style.marginLeft = "auto";
            child.style.right = "0px";
            child.style.left = "";
        }
    }

    // Selecting the items to prevent overflow for and its container
    const partierContainer = document.querySelector('.partier__container');
    const partierItems = document.querySelectorAll('.partier__item');
    for (let i = 0; i < partierItems.length; i++) {
        const partierItem = partierItems[i];
        const partierContent = partierItem.querySelector('.partier__content');
        partierItem.addEventListener("mouseover", getHoverHandler(partierContainer, partierContent), false);
    }
}

// Re-order the party elements so that they align from their political standing (left, right)
function reorderPartiItems() {
    const partierContainer = document.querySelector('.partier__container');
    const partierItems = Array.from(document.querySelectorAll('.partier__item'));

    partierItems.sort((a, b) => {
        const sideA = a.getAttribute("data-side");
        const sideB = b.getAttribute("data-side");

        if (sideA < sideB) return -1;
        if (sideA > sideB) return 1;
        return 0;
    });

    partierItems.forEach(item => item.remove());
    partierItems.forEach(item => partierContainer.appendChild(item));
}

// Make elements with focus state unfocused when other element is being hovered
function handleHoverOnFocus() {
    const items = document.querySelectorAll('.partier__item');

    items.forEach(item => {
        item.addEventListener('mouseover', () => {
            if (!document.activeElement && document.activeElement === item) return;
            document.activeElement.blur();
        });
    });
}


// Starting the startup codes
window.addEventListener("load", () => {
    alignPartiHover();
    reorderPartiItems();
    handleHoverOnFocus();

    clickListener(".voteBtn", openVoteForm);
    clickListener(".modal #vote_form .submit", submit);
    clickListener(".modal #vote_confirm .button[data-action='confirm']", commitVote, true);

    function listener(e) {
        if (document.querySelector(".modal #vote_confirm").dataset.visible === "true" && e.key === "Enter") {
            document.removeEventListener("keydown", listener);
            commitVote();
        }
    }

    document.addEventListener("keydown", listener);
});