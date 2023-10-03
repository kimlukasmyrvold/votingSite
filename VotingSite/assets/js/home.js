
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



// **************************
// *     Input checking     *
// **************************

function checkInputValues() {
    // Test regex function
    function test(isString, subject) {
        if (isString == true) return /^[a-zA-ZæøåÆØÅ\s]+$/.test(subject);
        return /^[0-9]{11}$/.test(subject);
    }

    // Outputing error to textContent if error
    function ifElse(test, selector, message) {
        if (test) selector.textContent = '';
        else selector.textContent = message;
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

async function showModal(parti) {
    const modal = document.querySelector('.modal');
    modal.dataset.visible = true;

    const partiLogo = modal.querySelector('#voteForm .partiLogo img');
    partiLogo.setAttribute('src', `assets/images/parti_logos/${parti}.png`);

    const votingSelected = modal.querySelector('#voteForm .votingSelected');
    votingSelected.textContent = (await getPartiInfo(parti)).name;

    checkInputValues();
}

function cancel(e) {
    e.preventDefault();
    const modal = document.querySelector('.modal');
    modal.dataset.visible = false;
}


async function callVoteMethod(parti) {
    const aspBtn = document.querySelector('.sendToStemmer');
    aspBtn.dataset.pid = (await getPartiInfo(parti)).id;
    aspBtn.click();
}

function triggerVoteMethod(e) {
    e.preventDefault();
    const parti = sessionStorage.getItem('parti');
    callVoteMethod(parti)
}

// Prevents default behavior of button to stop form submit
// Adds the selected "party" to sessionStorage
// Then calls showModal to show vote screen
function vote(e) {
    e.preventDefault();
    const parti = this.dataset.id;
    sessionStorage.setItem('parti', parti);
    showModal(parti);
}

// Add voted class to all vote buttons if 'voted' is true in localStorage
function getVoted() {
    if (localStorage.getItem('voted') == false) return
    const voteBtn = document.querySelectorAll('.voteBtn');
    voteBtn.forEach(el => {
        el.classList.add('voted');
    });
}



// ***************************************
// *          Utility Functions          *
// ***************************************

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



// ***************************************
// *          Startup Functions          *
// ***************************************

function handleQueryString() {
    let querystring = new URLSearchParams(document.location.search);
    if (querystring.get("result") === "modal_open") {
        showModal(querystring.get("parti"));
    }
    removeQueryString();
};

alignPartiHover();



// ****************************************
// *        Functions called by c#        *
// ****************************************

// Adds ready class to kommuner dropdown to make it visible
// Then adds querystring to url with information about "modal open" and which "party" chosen
function getFromKommuner_Callback() {
    document.querySelector('.selectKommuner').classList.add("ready");
    history.replaceState({}, document.title, window.location.pathname + `?result=modal_open&parti=${sessionStorage.getItem('parti')}`);
}



// ****************************************
// *            EventListeners            *
// ****************************************

document.addEventListener('DOMContentLoaded', handleQueryString);

document.querySelectorAll('.voteBtn').forEach(btn => btn.addEventListener('click', vote));
document.querySelector('.modal .submit').addEventListener('click', triggerVoteMethod);
document.querySelector('.modal .cancel').addEventListener('click', cancel);
document.querySelector('.modal .icon-cross').addEventListener('click', cancel);
