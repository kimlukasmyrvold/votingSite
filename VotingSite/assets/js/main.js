

// ************************************
// *         Navbar functions         *
// ************************************

// ======<   Indicating current page on navbar   >======

function setActiveLink() {
    document.querySelectorAll('.navbar__link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.includes(document.documentElement.dataset.pagename)) {
            link.classList.add('active');
        };
    });
}


// ======<   Checking for hover on navbar links   >======

function handleMouseEvents(event) {
    if (event.target.matches('.navbar__link')) {
        document.querySelectorAll('.navbar__link').forEach(link => link.classList.remove('active'));
        event.type === 'mouseout' ? setActiveLink() : event.type === 'mouseover' ? event.target.classList.add('active') : null;
    };
}


// ======<   Handling navbar buttons   >======

function navbarButtons() {
    const buttons = document.querySelectorAll('.navbar__button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.target.id;
            switch (id) {
                case "toggleTheme":
                    toggleTheme();
                    break;
            };
        });
    })
}

// Toggles theme and mode for site
function toggleTheme() {
    let theme = localStorage.getItem('theme');

    if (!theme || theme === "dark") theme = "light";
    else if (theme === "light") theme = "dark";

    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
}

function setTheme() {
    const theme = localStorage.getItem("theme");
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
}



// *************************************
// *         Utility functions         *
// *************************************


// ======<   Removes querystring from URL   >======

function removeQueryString() {
    let cleanURL = window.location.pathname;
    history.replaceState({}, document.title, cleanURL);
}


// ======<   Adds icons to page from svg file   >======

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
        e.innerHTML = `<use xlink:href="/assets/images/icons.svg#${icon}"></use>`;
    });
}



// *************************************
// *       Start Scripts on load       *
// *************************************

window.onload = () => {
    addIcons();
    setActiveLink();
    navbarButtons();
    setTheme();
    document.querySelector('.navbar__links').addEventListener('mouseover', handleMouseEvents);
    document.querySelector('.navbar__links').addEventListener('mouseout', handleMouseEvents);
}