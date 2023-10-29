// Test regex function
function test(isString, subject) {
    return (isString) ? /^(?![\s]+$)[a-zA-Z\u00C0-\u02AF\s]+$/.test(subject) : /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}\s?\d{5}$/.test(subject);
}

// Outputing error to textContent if error
function ifElse(test, selector, message) {
    selector.textContent = (test) ? '' : message;
    selector.parentElement.classList[test ? 'remove' : 'add']('invalid');
}

// First name
const validFNavn = document.querySelector('#vote_form .personalInfo .validFNavn');
const FNavnInput = document.querySelector('#vote_form .personalInfo #ModalContent_FNavn');
FNavnInput.addEventListener('input', () => ifElse(test(true, FNavnInput.value), validFNavn, 'Fornavn kan bare være bokstaver'));

// Last name
const validENavn = document.querySelector('#vote_form .personalInfo .validENavn');
const ENavnInput = document.querySelector('#vote_form .personalInfo #ModalContent_ENavn');
ENavnInput.addEventListener('input', () => ifElse(test(true, ENavnInput.value), validENavn, 'Etternavn kan bare være bokstaver'));

// National ID Number
const validFNum = document.querySelector('#vote_form .personalInfo .validFNum');
const FNumInput = document.querySelector('#vote_form .personalInfo #ModalContent_FNum');
FNumInput.addEventListener('input', () => {
    ifElse(test(false, FNumInput.value), validFNum, 'Fødselsnummer må være et 11-sifret nummer.');
});