function alignPartiHover() {
    function isOverflow(parent, child) {
        var left = 0;
        var op = child;
        while (op && op != parent) {
            left += op.offsetLeft;
            op = op.offsetParent;
        }

        return ((left + child.offsetWidth) > parent.offsetWidth);
    }

    function getHoverHandler(parent, child) {
        return function () {
            if (isOverflow(parent, child)) {
                child.style.marginLeft = 'auto';
                child.style.right = '0px';
                child.style.left = '';
            }
        }
    }

    function attach(o, e, f) {
        if (o.addEventListener) {
            o.addEventListener(e, f, false);
        } else if (o.attachEvent) {
            o.attachEvent('on' + e, f);
        }
    }

    const partierContainer = document.querySelector('.partier__container');
    const partierItem = document.querySelectorAll('.partier__item');
    for (let i = 0; i < partierItem.length; i++) {
        let element = partierItem[i];
        let partierContent = element.querySelector('.partier__content');
        attach(element, 'mouseover', getHoverHandler(partierContainer, partierContent));
    }
}
alignPartiHover();




function getVoted() {
    if (localStorage.getItem('voted') == false) return
    const voteBtn = document.querySelectorAll('.voteBtn');
    voteBtn.forEach(el => {
        el.classList.add('voted');
    });
}

function checkVoteSubmitValues() {
    const fNumInput = document.querySelector('#voteForm .personalInfo #FNum');
    const validationMessage = document.querySelector('#voteForm .personalInfo .validation-message');

    fNumInput.addEventListener('input', () => {
        const fNumValue = fNumInput.value;
        const isValidFormat = /^[0-9]{11}$/.test(fNumValue);

        if (isValidFormat) {
            validationMessage.textContent = '';
        } else {
            validationMessage.textContent = 'Fødselsnummer må være et 11-sifret nummer.';
        }
    });
}


function showModal(parti) {
    const modal = document.querySelector('.modal');
    modal.dataset.visible = true;

    const voteForm = modal.querySelector('#voteForm');
    const partiLogo = voteForm.querySelector('.partiLogo img');
    const votingSelected = voteForm.querySelector('.votingSelected');

    partiLogo.setAttribute('src', `assets/images/parti_logos/${parti}.png`);
    votingSelected.textContent = getPartiName(parti);

    checkVoteSubmitValues();
    addIcons();

    const name = "Steve";
    PageMethods.SayHello(name, onSuccess, onError);
}

function onSuccess(result) {
    alert(result);  // Display the result returned from the server
}

function onError(error) {
    alert("Error: " + error.get_message());
}

function hideModal() {
    const modal = document.querySelector('.modal');
    modal.dataset.visible = false;
}

function cancel() {
    hideModal();
}

function vote(e) {
    e.preventDefault();
    const parti = this.dataset.id;
    showModal(parti);
}


let partierJSON;
try {
    fetch('/assets/json/partier.json')
        .then(response => response.json())
        .then(data => {
            partierJSON = data;
            // getPartierNames();
            // getPartierIDs();
            // Object.entries(partierJSON).forEach(([key, value]) => {
            //     console.log(key)
            // });
        });
} catch (e) {
    console.error('Error:', e)
}

function getPartierNames() {
    Object.entries(partierJSON).forEach(([key, value]) => {
        console.log(partierJSON[key].name)
    });
}

function getPartierIDs() {
    Object.entries(partierJSON).forEach(([key, value]) => {
        console.log(partierJSON[key].id)
    });
}

function getPartiName(key) {
    return partierJSON[key].name;
}

document.querySelectorAll('.voteBtn').forEach(btn => {
    btn.addEventListener('click', vote);
});
document.querySelector('.modal .icon-cross').addEventListener('click', cancel);