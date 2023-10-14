
// ********************************
// *        Main Functions        *
// ********************************

// ======<     Opening     >======

// Function for opening the voting modal.
async function openVoteModal(e, isBtn = true) {
    e.preventDefault();

    // Get the selected parti
    const parti = ((!isBtn) ? e.target.parentElement.querySelector('.voteBtn') : this).dataset.id;
    sessionStorage.setItem('pid', parti);

    makeModalVisible("#voteForm");
    setLogoAndName(parti);
    checkInputValues();
}

// Function for opening the voting modal from callback.
function openVoteModalFromCallback(parti) {
    makeModalVisible("#voteForm");
    setLogoAndName(parti);
    checkInputValues();
}


// ======<     Closing     >======

// Function for closing the voting modal
function closeVoteModal(e) {
    e.preventDefault();
    
    const modal = document.querySelector('.modal');
    modal.dataset.visible = false;
    
    const voteForm = document.querySelector('.modal #voteForm');
    voteForm.dataset.visible = false;
    
    const voted = document.querySelector('.modal #voted');
    voted.dataset.visible = false;
}


// ======<     Calling     >======

// Calling the vote method in c#
function callVoteMethod(e) {
    e.preventDefault();

    // Checking if all values are correct
    const isOK = checkValues();
    if (!isOK) return;

    // Adding data to hiddendatafield and clearing localstorage
    document.querySelector('#ModalContent_hiddenDataField').value = sessionStorage.getItem('pid');
    sessionStorage.clear();

    // Calling the c# method
    const aspBtn = document.querySelector('.sendToStemmer');
    aspBtn.click();
}



// ***************************************
// *          Utility Functions          *
// ***************************************

function checkValues() {

    // Checking if a "Kommune" is selected
    function checkKommuner() {
        const kommunerList = document.querySelector('#voteForm #ModalContent_DropDownListKommuner');
        const value = kommunerList.value;
        if (value === "0") {
            const validKommune = document.querySelector('#voteForm .personalInfo .validKommune');
            validKommune.textContent = "Error, du må velge kommune.";
            validKommune.parentElement.classList.add('invalid');

            // Removing warning after some time
            setTimeout(() => {
                validKommune.parentElement.classList.remove('invalid');
            }, 5_000);

            return false
        }

        return true;
    }

    function checkFNavn() {
        return true;
    }

    let isOK = () => {
        if (checkKommuner() && checkFNavn()) return true;
        return false;
    };

    return isOK();
}

// Function for making modal visible
function makeModalVisible(selector = "none") {
    const modal = document.querySelector('.modal');
    modal.dataset.visible = true;

    if (selector !== "none") {
        const content = modal.querySelector(selector);
        content.dataset.visible = true;
    }
}

// Gets name and id from partier.json, takes in parti key (mdg, a, sv...)
function getPartiInfo(key) {
    return fetch('/assets/json/partier.json')
        .then(response => response.json())
        .then(data => {
            return {
                id: data[key],
                name: data[key].name,
                fullName: data[key].fullName,
                description: data[key].description
            };
        })
        .catch(e => {
            console.error('Error:', e)
        });
}

async function setLogoAndName(parti) {
    // Show the logo for the selected "parti"
    const partiLogo = document.querySelector('#voteForm .partiLogo img');
    partiLogo.setAttribute('src', `assets/images/parti_logos/${(await getPartiInfo(parti)).name}.png`);

    // Show the name for the selected "parti"
    const votingSelected = document.querySelector('#voteForm .partiName');
    votingSelected.textContent = (await getPartiInfo(parti)).fullName;
}

// Function for checking if input is valid
function checkInputValues() {
    // Test regex function
    function test(isString, subject) {
        return (isString) ? /^(?![\s]+$)[a-zA-Z\u00C0-\u02AF\s]+$/.test(subject) : /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}\s?\d{5}$/.test(subject);
    }


    // Outputing error to textContent if error
    function ifElse(test, selector, message) {
        selector.textContent = (test) ? '' : message;
        selector.parentElement.classList[test ? 'remove' : 'add']('invalid');
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
    const validFNum = document.querySelector('#voteForm .personalInfo .validFNum');
    const FNumInput = document.querySelector('#voteForm .personalInfo #ModalContent_FNum');
    FNumInput.addEventListener('input', () => {
        ifElse(test(false, FNumInput.value), validFNum, 'Fødselsnummer må være et 11-sifret nummer.');
        // formatFNumInput(FNumInput);
    });

    // // First name
    // const validFNavn = document.querySelector('#voteForm .personalInfo .validFNavn');
    // const FNavnInput = document.querySelector('#voteForm .personalInfo #ModalContent_FNavn');
    // FNavnInput.addEventListener('input', () => ifElse(test(true, FNavnInput.value), validFNavn, 'Fornavn kan bare være bokstaver'));

    // // Last name
    // const validENavn = document.querySelector('#voteForm .personalInfo .validENavn');
    // const ENavnInput = document.querySelector('#voteForm .personalInfo #ModalContent_ENavn');
    // ENavnInput.addEventListener('input', () => ifElse(test(true, ENavnInput.value), validENavn, 'Etternavn kan bare være bokstaver'));
}



// ***************************************
// *          Startup Functions          *
// ***************************************

// Handling queryString in url
function handleQueryString() {
    const querystring = new URLSearchParams(document.location.search);
    if (querystring.get("r") === "mo") openVoteModalFromCallback(sessionStorage.getItem('pid'));
    removeQueryString();
};

/*  Unused
    // Add voted class to all vote buttons if 'voted' is true in localStorage
    function getVoted() {
        if (localStorage.getItem('voted') == false) return
        const voteBtn = document.querySelectorAll('.voteBtn');
        voteBtn.forEach(el => {
            el.classList.add('voted');
        });
    }
*/

// Aligning partier dropdown acording to window space
function alignPartiHover() {
    // Checking for overflow
    function isOverflow(parent, child) {
        var left = 0;
        var op = child;
        while (op && op != parent) {
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

function addReadyClass() {
    const fylkerList = document.querySelector('#voteForm #ModalContent_DropDownListFylker');
    const value = fylkerList.value;
    if (value === "0") return;
    document.querySelector('#voteForm .remains').classList.add("ready");
}
addReadyClass();



// ****************************************
// *        Functions called by c#        *
// ****************************************

// Adds ready class to kommuner dropdown to make it visible
// Then adds querystring to url with information about "modal open" and which "party" chosen
function getFromKommuner_Callback() {
    history.replaceState({}, document.title, `${window.location.pathname}?r=mo`);

    // Disable the first value from being selected
    const kommuneDropdown = document.querySelector('#ModalContent_DropDownListKommuner')
    const firstKommune = kommuneDropdown.querySelectorAll('option')[0];
    firstKommune.disabled = true;
}



// ****************************************
// *            EventListeners            *
// ****************************************

// Calling handleQueryString function when DOMContent has loaded
document.addEventListener('DOMContentLoaded', handleQueryString);

// Opening voteModal
document.querySelectorAll('.voteBtn').forEach(btn => btn.addEventListener('click', openVoteModal));

// Closing voteModal
document.querySelector('.modal .cancel').addEventListener('click', closeVoteModal);
document.querySelector('.modal .icon-cross').addEventListener('click', closeVoteModal);

// Sending the vote
document.querySelector('.modal .submit').addEventListener('click', callVoteMethod);
