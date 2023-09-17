function removeQueryString() {
    let cleanURL = window.location.pathname;
    history.replaceState({}, document.title, cleanURL);
}
function setActiveLink() {
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.includes(document.documentElement.dataset.pagename)) {
            link.classList.add('active');
        };
    });
}
setActiveLink();
function handleMouseEvents(event) {
    if (event.target.matches('.navbar-link')) {
        document.querySelectorAll('.navbar-link').forEach(link => link.classList.remove('active'));
        event.type === 'mouseout' ? setActiveLink() : event.type === 'mouseover' ? event.target.classList.add('active') : null;
    };
}
document.querySelector('.navbar-links').addEventListener('mouseover', handleMouseEvents);
document.querySelector('.navbar-links').addEventListener('mouseout', handleMouseEvents);