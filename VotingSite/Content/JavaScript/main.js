// ************************************
// *         Navbar functions         *
// ************************************

// ======<   Indicating current page on navbar   >======
function setActiveLink() {
    document.querySelectorAll('.navbar__link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.includes(document.documentElement.dataset.pagename)) {
            link.classList.add('active');
        }
    });
}


// ======<   Checking for hover on navbar links   >======
function handleMouseEvents(event) {
    if (event.target.matches('.navbar__link')) {
        document.querySelectorAll('.navbar__link').forEach(link => link.classList.remove('active'));
        event.type === 'mouseout' ? setActiveLink() : event.type === 'mouseover' ? event.target.classList.add('active') : null;
    }
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
            }
        });
    })
}

// Toggles theme and mode for site
function toggleTheme() {
    let theme = localStorage.getItem('theme');

    if (!theme || theme === "dark") theme = "light"; else if (theme === "light") theme = "dark";

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


// ======<   Adds eventListeners for click or Enter keypress   >======
function clickListener(elements, functionCall, once = false) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", functionCall, {once: once});
        elements[i].addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;
            functionCall(e);
        }, {once: once});
    }
}


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
            }
        }

        // Adding attributes
        e.setAttribute('focusable', "false");
        e.setAttribute('aria-hidden', "true");
        e.setAttribute('viewBox', '0 0 24 24');
        e.setAttribute('height', '1.4em');

        // Add the svg icon
        e.innerHTML = `<use xlink:href="/Content/Images/icons.svg#${icon}"></use>`;
    });
}

/* Change all select lists that is contained within .custom_select to custom select dropdown.
   Part of the code is from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_custom_select */
function createCustomSelects() {
    let customSelect = document.querySelectorAll(".custom_select");

    for (let i = 0; i < customSelect.length; i++) {
        let oldSelect = customSelect[i].querySelector("select");

        /*for each element, create a new DIV that will act as the selected item:*/
        let selected = document.createElement("div");
        selected.setAttribute("class", "select-selected");
        selected.textContent = oldSelect.options[oldSelect.selectedIndex].textContent;
        selected.dataset.kid = oldSelect.options[oldSelect.selectedIndex].value;
        customSelect[i].appendChild(selected);

        /*for each element, create a new DIV that will contain the option list:*/
        let itemsContainer = document.createElement("div");
        itemsContainer.setAttribute("class", "select-items select-hide");

        for (let j = 0; j < oldSelect.length; j++) {
            /*for each option in the original select element,
            create a new DIV that will act as an option item:*/
            let item = document.createElement("div");
            item.textContent = oldSelect.options[j].textContent;
            item.dataset.kid = oldSelect.options[j].value;

            item.addEventListener("click", (e) => {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                let oldSelect = e.target.parentNode.parentNode.querySelector("select");
                let selected = e.target.parentNode.previousSibling;

                for (let i = 0; i < oldSelect.length; i++) {
                    if (oldSelect.options[i].value === e.target.dataset.kid) {
                        oldSelect.selectedIndex = i;
                        selected.textContent = e.target.textContent;
                        selected.dataset.kid = e.target.dataset.kid;

                        let selectedItem = e.target.parentNode.querySelectorAll(".selected");
                        for (let k = 0; k < selectedItem.length; k++) {
                            selectedItem[k].removeAttribute("class");
                        }
                        e.target.setAttribute("class", "selected");
                        break;
                    }
                }
            });
            itemsContainer.appendChild(item);
        }
        customSelect[i].appendChild(itemsContainer);

        selected.addEventListener("click", (e) => {
            e.stopPropagation();

            closeAllSelect(e.target);
            e.target.nextSibling.classList.toggle("select-hide");
            e.target.classList.toggle("active");
        });
    }

    function closeAllSelect(elmnt) {
        let arr = [];

        let selected = document.querySelectorAll(".select-selected");
        for (let i = 0; i < selected.length; i++) {
            if (elmnt === selected[i]) {
                arr.push(i);
            } else {
                selected[i].classList.remove("active");
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
}


// *************************************
// *       Start Scripts on load       *
// *************************************

window.onload = () => {
    addIcons();
    createCustomSelects();
    setActiveLink();
    navbarButtons();
    setTheme();
    document.querySelector('.navbar__links').addEventListener('mouseover', handleMouseEvents);
    document.querySelector('.navbar__links').addEventListener('mouseout', handleMouseEvents);
    console.log("onload called!")
}

console.log("Main called!")
