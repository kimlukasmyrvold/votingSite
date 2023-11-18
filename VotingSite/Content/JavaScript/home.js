// ======<     Opening     >======

// Function for opening the voting modal.
async function openVoteModal(e, isBtn = true) {
    e.preventDefault();

    // Get the selected parti
    const parti = ((!isBtn) ? e.target.parentElement.querySelector('.voteBtn') : this).dataset.id;
    sessionStorage.setItem('pid', parti);

    makeModalVisible("#vote_form");
    setLogoAndName(parti);
    checkInputValues();
}

// Function for opening the voting modal from callback.
function openVoteModalFromCallback(parti) {
    makeModalVisible("#vote_form");
    setLogoAndName(parti);
    checkInputValues();
}

// Function for opening the voting modal from callback.
function openVoteModalFromCallbackResult(errorMsg) {
    makeModalVisible("#vote_result");

    clickListener(".modal #vote_result .results a", (e) => {
        document.querySelector('#results').scrollIntoView({
            behavior: 'smooth'
        });
        closeModal(e);
    });

    if (errorMsg === "noError") {
        document.querySelector(".modal #vote_result [data-result=\"success\"]").dataset.visible = "true";
        return;
    }

    document.querySelector(".modal #vote_result [data-result=\"error\"]").dataset.visible = "true";
    document.querySelector(".modal #vote_result #errorMsg").textContent = errorMsg;
}


// ======<     Closing     >======

// Function for closing the voting modal
function closeModal(e) {
    e.preventDefault();

    const modal = document.querySelector('.modal');
    modal.dataset.visible = "false";

    const voteForm = document.querySelector('.modal #vote_form');
    voteForm.dataset.visible = "false";

    const confirm = document.querySelector('.modal #vote_confirm');
    confirm.dataset.visible = "false";

    const success = document.querySelector('.modal #vote_result');
    success.dataset.visible = "false";
}


// ======<     Submitting     >======

// Confirming vote
async function callVoteMethod(e) {
    e.preventDefault();

    // Checking if all values are correct
    const isOK = checkValues();
    if (!isOK) return;

    // Hiding voteForm and Making Confirm vote visible
    document.querySelector('.modal #vote_form').dataset.visible = "false";
    document.querySelector('.modal #vote_confirm').dataset.visible = "true";

    // Displaying chosen party to user
    const parti = sessionStorage.getItem('pid');
    document.querySelector(".modal #vote_confirm .parti_name").textContent = (await getPartiInfo(parti)).fullName;

    clickListener(".modal #vote_confirm #cancel", closeModal);
    clickListener(".modal #vote_confirm #confirm", voteConfirmed);
}

// Calling the vote method in c#
function voteConfirmed(e) {
    e.preventDefault();

    // Adding data to hiddendatafield and clearing localstorage
    document.querySelector('.modal #vote_form #ModalContent_hiddenDataField').value = sessionStorage.getItem('pid');
    sessionStorage.clear();

    // Calling the c# method
    const aspBtn = document.querySelector(".modal #vote_form .sendToStemmer");
    aspBtn.click();
}


// ***************************************
// *          Utility Functions          *
// ***************************************

function checkValues() {
    // Checking if selected fylke is valid
    function checkFylke() {
        const fylkerList = document.querySelector('#vote_form #ModalContent_DropDownListFylker');
        const value = fylkerList.value;
        if (value !== "0") return true;

        const validFylke = document.querySelector('#vote_form .personalInfo .validFylke');
        validFylke.textContent = "Error, du må velge et fylke.";
        validFylke.parentElement.classList.add('invalid');

        setTimeout(() => {
            validFylke.parentElement.classList.remove('invalid');
        }, 5_000);

        return false;
    }
    
    // Checking if a "Kommune" is selected
    function checkKommuner() {
        const kommunerList = document.querySelector('#vote_form #ModalContent_DropDownListKommuner');
        const value = kommunerList.value;
        if (value !== "0") return true;

        const validKommune = document.querySelector('#vote_form .personalInfo .validKommune');
        validKommune.textContent = "Error, du må velge en kommune.";
        validKommune.parentElement.classList.add('invalid');

        // Removing warning after some time
        setTimeout(() => {
            validKommune.parentElement.classList.remove('invalid');
        }, 5_000);

        return false;
    }

    // Checking if fnum is valid
    function checkFnum() {
        const validFNum = document.querySelector('#vote_form .personalInfo .validFNum');
        const FNumInput = document.querySelector('#vote_form .personalInfo #ModalContent_FNum');
        
        const testOk = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}\s?\d{5}$/.test(FNumInput.value);
        validFNum.textContent = (testOk) ? '' : "Fødselsnummer er ugyldig.";
        validFNum.parentElement.classList[testOk ? 'remove' : 'add']('invalid');

        setTimeout(() => {
            validFNum.parentElement.classList.remove('invalid');
        }, 5_000);

        return testOk;
    }

    return checkFylke() && checkKommuner() && checkFnum();
}

// Function for making modal visible
function makeModalVisible(selector = "none") {
    const modal = document.querySelector('.modal');
    modal.dataset.visible = "true";

    if (selector !== "none") {
        const content = modal.querySelector(selector);
        content.dataset.visible = "true";
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal(e);
    });
}

// Gets name and id from partier.json, takes in parti key (mdg, a, sv...)
function getPartiInfo(key) {
    return fetch('/Content/JSON/partier.json')
        .then(response => response.json())
        .then(data => {
            return {
                id: data[key],
                name: data[key].name,
                fullName: data[key].fullName,
                description: data[key].description,
                side: data[key].side,
                color: data[key].color
            };
        })
        .catch(e => {
            console.error('Error:', e)
        });
}

async function setLogoAndName(parti) {
    // Show the logo for the selected "parti"
    const partiLogo = document.querySelector('#vote_form .partiLogo img');
    partiLogo.setAttribute('src', `Content/Images/PartyLogos/${(await getPartiInfo(parti)).name}.png`);

    // Show the name for the selected "parti"
    const votingSelected = document.querySelector('#vote_form .partiName');
    votingSelected.textContent = (await getPartiInfo(parti)).fullName;
    votingSelected.style.setProperty("--parti-color", (await getPartiInfo(parti)).color);
}

// Function for checking if input is valid
function checkInputValues() {
    // Outputing error to textContent if error
    function ifElse(subject, selector, message) {
        const testOk = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}\s?\d{5}$/.test(subject);
        selector.textContent = (testOk) ? '' : message;
        selector.parentElement.classList[testOk ? 'remove' : 'add']('invalid');
    }

    // Format National ID Number input
    function formatFNumInput(FNumInput) {
        let value = FNumInput.value.replace(/\s/g, '');
        const cursorPosition = FNumInput.selectionStart;  // Save cursor position
        const initialLength = value.length;

        // Store the index of the last non-space character before the cursor
        let lastNonSpaceIndex = -1;
        for (let i = 0; i < value.length && i < cursorPosition; i++) {
            if (value[i] !== ' ') {
                lastNonSpaceIndex = i;
            }
        }

        // Calculate the new cursor position after formatting
        let newCursorPosition = cursorPosition;
        value = value.replace(/(.{6})/g, '$1 ');
        FNumInput.value = value.trim();

        // Adjust the cursor position for edits within the first six digits
        if (cursorPosition <= lastNonSpaceIndex) {
            newCursorPosition += Math.floor(cursorPosition / 6);
        }

        // Adjust the cursor position for deleting a digit in the last five digits
        if (initialLength > value.length && cursorPosition % 7 !== 0) {
            newCursorPosition = Math.max(0, cursorPosition - 1);
        }

        // Restore cursor position
        FNumInput.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    // National ID Number
    const validFNum = document.querySelector('#vote_form .personalInfo .validFNum');
    const FNumInput = document.querySelector('#vote_form .personalInfo #ModalContent_FNum');
    FNumInput.addEventListener('input', () => {
        ifElse(FNumInput.value, validFNum, 'Fødselsnummer må være et 11-sifret nummer.');
        // formatFNumInput(FNumInput);
    });
}


// ***************************************
// *          Startup Functions          *
// ***************************************

// Handling queryString in url
function handleQueryString() {
    const querystring = new URLSearchParams(document.location.search);
    if (querystring.get("r") === "mo") openVoteModalFromCallback(sessionStorage.getItem('pid'));
    if (querystring.get("r") === "moRe") openVoteModalFromCallbackResult(querystring.get("er"));
    removeQueryString();
}

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

        return ((left + child.offsetWidth) > parent.offsetWidth);
    }

    // Handling the items depending on if they are overflowing
    function getHoverHandler(parent, child) {
        return function () {
            if (isOverflow(parent, child)) {
                child.style.marginLeft = 'auto';
                child.style.right = '0px';
                child.style.left = '';
            }
        }
    }

    // Adding eventListeners
    function attach(o, e, f) {
        if (o.addEventListener) {
            o.addEventListener(e, f, false);
        } else if (o.attachEvent) {
            o.attachEvent('on' + e, f);
        }
    }

    // Selecting the items to prevent overflow for and its container
    const partierContainer = document.querySelector('.partier__container');
    const partierItem = document.querySelectorAll('.partier__item');
    for (let i = 0; i < partierItem.length; i++) {
        let element = partierItem[i];
        let partierContent = element.querySelector('.partier__content');
        attach(element, 'mouseover', getHoverHandler(partierContainer, partierContent));
    }
}

alignPartiHover();

function reorderPartiItems() {
    const partierContainer = document.querySelector('.partier__container');
    const partierItems = Array.from(document.querySelectorAll('.partier__item'));
    const orderMapping = {
        left: 0,
        center: 1,
        right: 2,
        "": 2,
    };

    partierItems.sort((a, b) => {
        const sideA = a.getAttribute("data-side") || "";
        const sideB = b.getAttribute("data-side") || "";

        if (orderMapping[sideA] < orderMapping[sideB]) {
            return -1;
        }
        if (orderMapping[sideA] > orderMapping[sideB]) {
            return 1;
        }
        return 0;
    });

    partierItems.forEach(item => item.remove());
    partierItems.forEach(item => partierContainer.appendChild(item));
}

reorderPartiItems();


// Make elements with focus state unfocused when other element is being hovered
function handleHoverOnFocus() {
    const items = document.querySelectorAll('.partier__item');

    items.forEach(item => {
        item.addEventListener('mouseover', () => {
            const focusedItem = document.activeElement;
            if (focusedItem && focusedItem !== item) {
                focusedItem.blur();
            }
        });
    });
}

handleHoverOnFocus();


function handleReadyClass() {
    const fNumInput = document.querySelector("#vote_form #ModalContent_FNum");
    const fylkerList = document.querySelector("#vote_form #ModalContent_DropDownListFylker");
    const remains = document.querySelector("#vote_form .remains");

    if (remains.classList.contains("ready") && !isPostBack) {
        fNumInput.value = "";
        fylkerList.options[0].selected = true;
        remains.classList.remove("ready");
    }
}

function addReadyClass() {
    const fylkerList = document.querySelector("#vote_form #ModalContent_DropDownListFylker");
    const value = fylkerList.value;

    if (value === "0") return;
    document.querySelectorAll('.voteBtn').forEach(btn => btn.addEventListener('click', handleReadyClass));
    const remains = document.querySelector("#vote_form .remains");
    remains.classList.add("ready");
}


// ****************************************
// *        Functions called by c#        *
// ****************************************

// Then adds querystring to url with information about "modal open"
function getFromKommuner_Callback() {
    history.replaceState({}, document.title, `${window.location.pathname}?r=mo`);

    // Disable the first value from being selected
    const kommuneDropdown = document.querySelector('#ModalContent_DropDownListKommuner');
    const selectKommune = kommuneDropdown.querySelectorAll('option')[0];
    selectKommune.disabled = true;
}

function SendToStemmer_Click_Callback(errorMsg) {
    history.replaceState({}, document.title, `${window.location.pathname}?r=moRe&er=${errorMsg}`);
}


// ****************************************
// *            EventListeners            *
// ****************************************

// Calling handleQueryString function when DOMContent has loaded
document.addEventListener("DOMContentLoaded", addReadyClass);
document.addEventListener('DOMContentLoaded', handleQueryString);

// Opening voteModal
document.querySelectorAll('.voteBtn').forEach(btn => btn.addEventListener('click', openVoteModal));

// Closing voteModal
document.querySelector('.modal .cancel').addEventListener('click', closeModal);
document.querySelector('.modal .icon-cross').addEventListener('click', closeModal);

// Sending the vote
document.querySelector('.modal .submit').addEventListener('click', callVoteMethod);
