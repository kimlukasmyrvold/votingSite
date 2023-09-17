function removeQueryString() {
    let cleanURL = window.location.pathname;
    history.replaceState({}, document.title, cleanURL);
}