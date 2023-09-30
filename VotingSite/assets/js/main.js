// remove querystring from url (www.example.com/?IamQueryString)
function removeQueryString() {
    let cleanURL = window.location.pathname;
    history.replaceState({}, document.title, cleanURL);
}

// Indicating current page on navbar
function setActiveLink() {
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.includes(document.documentElement.dataset.pagename)) {
            link.classList.add('active');
        };
    });
}

// Checking for hover on navbar links
function handleMouseEvents(event) {
    if (event.target.matches('.navbar-link')) {
        document.querySelectorAll('.navbar-link').forEach(link => link.classList.remove('active'));
        event.type === 'mouseout' ? setActiveLink() : event.type === 'mouseover' ? event.target.classList.add('active') : null;
    };
}

function AddReadyClassToSelectKommuner() {
    const selectKommuner = document.querySelector('.selectKommuner')
    selectKommuner.classList.add("ready");
}

function addIcons() {
    // Loop trough every element with 'icon-' class
    document.querySelectorAll('[class^="icon-"], [class*=" icon-"]').forEach((e) => {
        let icon = '';

        // Get the className of the icon name
        for (let i = 0; i < e.classList.length; i++) {
            if (e.classList[i].startsWith('icon-')) {
                icon = e.classList[i];
                break;
            };
        };

        // Adding attributes
        e.setAttribute('focusable', false);
        e.setAttribute('aria-hidden', true);
        e.setAttribute('viewBox', '0 0 24 24');
        e.setAttribute('height', '1.4em');

        // Add the svg icon
        e.innerHTML = `<use xlink:href="../assets/images/icons.svg#${icon}"></use>`;
    });
}

window.onload = () => {
    addIcons();
    setActiveLink();
    document.querySelector('.navbar-links').addEventListener('mouseover', handleMouseEvents);
    document.querySelector('.navbar-links').addEventListener('mouseout', handleMouseEvents);
}