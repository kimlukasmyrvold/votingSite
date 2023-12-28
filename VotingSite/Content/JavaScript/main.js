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

function getTheme() {
    const local = localStorage.getItem("theme");
    return (local) ? local : (window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
}

function setTheme(theme = getTheme()) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
}

function toggleTheme(e) {
    if (e) e.preventDefault();

    let theme = getTheme();
    switch (theme) {
        case "dark":
            theme = "light";
            break;
        case "light":
            theme = "dark";
            break;
        default:
            theme = "dark";
            break;
    }

    setTheme(theme);
}


// *************************************
// *         Utility functions         *
// *************************************

// ======<   Adds eventListeners for click or Enter keypress   >======
function clickListener(selector, functionCall, once = false) {
    const elements = (typeof selector === "string")
        ? document.querySelectorAll(selector)
        : [selector];

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


// ======<    Custom AJAX function    >====== \\
function ajax(url, data, functionCall) {
    let retryAttempts = 0;

    const defaultOptions = {
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            functionCall(response);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching data:');
            console.error('Status:', status);
            console.error('Error:', error);
            console.error('Response Text:', xhr.responseText);

            if (retryAttempts < 5) {
                retryAttempts++;
                console.log("Retrying AJAX request. Attemp:", retryAttempts);
                $.ajax(ajaxOptions);
            } else {
                console.error("Maximum number of attempts reacher. Unable to complete AJAX request.");
            }
        }
    }

    const ajaxOptions = Object.assign({}, defaultOptions, {
        url: url,
        data: data !== null ? JSON.stringify(data) : undefined,
    });

    $.ajax(ajaxOptions);
}


// ======<   Looks for changes in attributes   >====== \\
function observeAttributeChange(selector, attribute, functionCall) {
    const target = document.querySelector(selector);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (!(mutation.type === "attributes" && mutation.attributeName === attribute)) return;
            functionCall(target);
        });
    });

    observer.observe(target, {attributes: true});
}


// ======<   Opens modal   >====== \\
function openModal(selector) {
    const modal = document.querySelector(".modal")
    modal.dataset.visible = "true";
    modal.focus();

    modal.querySelectorAll(".modal__container .content > div").forEach(el => {
        el.dataset.visible = "false";
    });

    modal.querySelector(selector).dataset.visible = "true";
    disableScroll(document.documentElement);
}

// ======<   Closes modal   >====== \\
function closeModal(e) {
    e.preventDefault();

    const modal = document.querySelector(".modal")
    modal.dataset.visible = "false";

    document.querySelectorAll("[data-visible]").forEach(content => {
        content.dataset.visible = "false";
    });

    document.querySelectorAll(".modal input").forEach(el => el.value = "");
    enableScroll(document.documentElement);
    createCustomSelects(".modal");
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
        e.setAttribute("focusable", "false");
        e.setAttribute("aria-hidden", "true");
        e.setAttribute("viewBox", "0 0 24 24");
        e.setAttribute("height", "1.4em");

        // Add the svg icon
        e.innerHTML = `<use xlink:href="/Content/Images/icons.svg#${icon}"></use>`;
    });
}


// ======<      Add option to select list      >====== \\     
function addOption(select, value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.text = text;
    select.add(option);
}


function disableScroll(selector) {
    selector.classList.add("scrollDisabled");
}

function enableScroll(selector) {
    selector.classList.remove("scrollDisabled");
}


/**
 * Change all select lists that is contained within .custom_select to custom select dropdown.
 * Part of the code is from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_custom_select
 **/
function createCustomSelects(selector = null) {
    const customSelect = (null === selector)
        ? document.querySelectorAll(".custom_select")
        : document.querySelectorAll(`${selector} .custom_select`);

    if (null !== selector) {
        customSelect.forEach(select => {
            const selectSelected = select.querySelector(".select-selected");
            if (selectSelected) selectSelected.remove();

            const selectItems = select.querySelector(".select-items");
            if (selectItems) selectItems.remove();
        });
    }


    for (let i = 0; i < customSelect.length; i++) {
        const oldSelect = customSelect[i].querySelector("select");

        // create a new DIV that will act as the selected item
        const selected = document.createElement("div");
        selected.setAttribute("class", "select-selected");
        selected.textContent = oldSelect.options[0].textContent;
        selected.dataset.value = oldSelect.options[0].value;
        selected.tabIndex = 0;
        customSelect[i].appendChild(selected);

        // create a new DIV that will contain the option list
        let itemsContainer = document.createElement("div");
        itemsContainer.setAttribute("class", "select-items select-hide");

        for (let j = 0; j < oldSelect.length; j++) {
            // Skipping if option is disabled
            if (oldSelect.options[j].disabled) continue;

            /* for each option in the original select element,
            create a new DIV that will act as an option item: */
            let item = document.createElement("div");
            item.textContent = oldSelect.options[j].textContent;
            item.dataset.value = oldSelect.options[j].value;
            if (0 === j) item.classList.add("selected");
            item.tabIndex = 0;

            clickListener(item, (e) => {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                let oldSelect = e.target.parentNode.parentNode.querySelector("select");
                let selected = e.target.parentNode.previousSibling;

                for (let i = 0; i < oldSelect.length; i++) {
                    if (oldSelect.options[i].value === e.target.dataset.value) {
                        oldSelect.selectedIndex = i;
                        selected.textContent = e.target.textContent;
                        selected.dataset.value = e.target.dataset.value;

                        let selectedItem = e.target.parentNode.querySelectorAll(".selected");
                        selectedItem.forEach(item => item.removeAttribute("class"));
                        e.target.setAttribute("class", "selected");
                        break;
                    }
                }
            });
            itemsContainer.appendChild(item);
        }
        customSelect[i].appendChild(itemsContainer);

        clickListener(selected, (e) => {
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

    clickListener(".modal .close", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal(e);
        if (e.key.toLowerCase() === "t" && e.altKey) toggleTheme(e);
    });
}
