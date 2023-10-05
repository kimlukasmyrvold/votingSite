
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



// ********************************
// *        Main Functions        *
// ********************************


// ======<     Opening     >======

// Function for opening the voting modal.
async function openVoteModal(e, isBtn = true) {
    e.preventDefault();

    // Get the selected parti
    const parti = ((!isBtn) ? e.target.parentElement.querySelector('.voteBtn') : this).dataset.id;
    sessionStorage.setItem('parti', parti);
    sessionStorage.setItem('pid', (await getPartiInfo(parti)).id);

    makeModalVisible();
    setLogoAndName(parti);
    checkInputValues();
}

// Function for opening the voting modal from callback.
function openVoteModalFromCallback(parti) {
    makeModalVisible();
    setLogoAndName(parti);
    checkInputValues();
}


// ======<     Closing     >======

// Function for closing the voting modal
function closeVoteModal(e) {
    e.preventDefault();
    const modal = document.querySelector('.modal');
    modal.dataset.visible = false;
}


// ======<     Calling     >======

// Calling the vote method in c#
function callVoteMethod() {
    document.querySelector('#MainContent_dataPidHiddenField').value = sessionStorage.getItem('pid');
    const aspBtn = document.querySelector('.sendToStemmer');
    aspBtn.click();
}



// ***************************************
// *          Utility Functions          *
// ***************************************

// Function for making modal visible
function makeModalVisible() {
    const modal = document.querySelector('.modal');
    modal.dataset.visible = true;
}

// Gets name and id from partier.json, takes in parti key (mdg, a, sv...)
function getPartiInfo(key) {
    return fetch('/assets/json/partier.json')
        .then(response => response.json())
        .then(data => {
            return {
                name: data[key].name,
                id: data[key].id
            };
        })
        .catch(e => {
            console.error('Error:', e)
        });
}

async function setLogoAndName(parti) {
    // Show the logo for the selected "parti"
    const partiLogo = document.querySelector('#voteForm .partiLogo img');
    partiLogo.setAttribute('src', `assets/images/parti_logos/${parti}.png`);

    // Show the name for the selected "parti"
    const votingSelected = document.querySelector('#voteForm .votingSelected');
    votingSelected.textContent = (await getPartiInfo(parti)).name;
}

// Function for checking if input is valid
function checkInputValues() {
    // Test regex function
    function test(isString, subject) {
        return (isString) ? /^[a-zA-ZæøåÆØÅ\s]+$/.test(subject) : /^[0-9]{11}$/.test(subject);
    }

    // Outputing error to textContent if error
    function ifElse(test, selector, message) {
        selector.textContent = (test) ? '' : message;
    }

    const personalInfo = document.querySelector('#voteForm .personalInfo');
    const validationMessage = personalInfo.querySelector('.validation-message');

    // First name
    const FNavnInput = personalInfo.querySelector('#FNavn');
    FNavnInput.addEventListener('input', () => ifElse(test(true, FNavnInput.value), validationMessage, 'FNavn kan bare være bokstaver'));

    // Last name
    const ENavnInput = personalInfo.querySelector('#ENavn');
    ENavnInput.addEventListener('input', () => ifElse(test(true, ENavnInput.value), validationMessage, 'ENavn kan bare være bokstaver'));

    // National ID Number
    const FNumInput = personalInfo.querySelector('#FNum');
    FNumInput.addEventListener('input', () => ifElse(test(false, FNumInput.value), validationMessage, 'Fødselsnummer må være et 11-sifret nummer.'));
}



// ***************************************
// *          Startup Functions          *
// ***************************************

// Making sure when hovering over vote items that they don't go outside of screen
alignPartiHover();

// Handling queryString in url
function handleQueryString() {
    let querystring = new URLSearchParams(document.location.search);
    if (querystring.get("result") === "modal_open") {
        openVoteModalFromCallback(sessionStorage.getItem('parti'));
    }
    removeQueryString();
};

// Add voted class to all vote buttons if 'voted' is true in localStorage
function getVoted() {
    if (localStorage.getItem('voted') == false) return
    const voteBtn = document.querySelectorAll('.voteBtn');
    voteBtn.forEach(el => {
        el.classList.add('voted');
    });
}



// ****************************************
// *        Functions called by c#        *
// ****************************************

// Adds ready class to kommuner dropdown to make it visible
// Then adds querystring to url with information about "modal open" and which "party" chosen
function getFromKommuner_Callback() {
    document.querySelector('.remains').classList.add("ready");
    history.replaceState({}, document.title, window.location.pathname + `?result=modal_open`);

    // Disable the first value from being selected
    const kommuneDropdown = document.querySelector('#MainContent_DropDownListKommuner')
    const firstKommune = kommuneDropdown.querySelectorAll('option')[0];
    firstKommune.disabled = true;
}



// ****************************************
// *            EventListeners            *
// ****************************************

// Calling handleQueryString function when DOMContent has loaded
document.addEventListener('DOMContentLoaded', handleQueryString);

// Opening voteModal
document.querySelectorAll('.partier__logo').forEach(item => item.addEventListener('click', (e) => { openVoteModal(e, false); }));
document.querySelectorAll('.voteBtn').forEach(btn => btn.addEventListener('click', openVoteModal));

// Closing voteModal
document.querySelector('.modal .cancel').addEventListener('click', closeVoteModal);
document.querySelector('.modal .icon-cross').addEventListener('click', closeVoteModal);

// Sending the vote
document.querySelector('.modal .submit').addEventListener('click', callVoteMethod);
