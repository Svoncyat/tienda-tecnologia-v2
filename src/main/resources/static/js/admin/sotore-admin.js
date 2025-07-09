//Carga de componentes header, aside y footer

document.addEventListener("DOMContentLoaded", () => {
    const headerDiv = document.querySelector('[data-component="header"][data-app="store-admin"]');

    fetch("../../components/header.html")
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar header.html");
        return response.text();
    })
    .then(html => {
        headerDiv.innerHTML = html;
    })
    .catch(error => {
        console.error("Error al cargar el header:", error);
        headerDiv.innerHTML = "<p style='color: red;'>Error al cargar el header.</p>";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const asideDiv = document.querySelector('[data-component="aside"][data-app="store-admin"]');

    fetch("/layouts/aside.html")
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar aside.html");
        return response.text();
    })
    .then(html => {
        asideDiv.innerHTML = html;
    })
    .catch(error => {
        console.error("Error al cargar el aside:", error);
        asideDiv.innerHTML = "<p style='color: red;'>Error al cargar el menú lateral.</p>";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const footerDiv = document.querySelector('[data-component="footer"][data-app="store-admin"]');

    fetch("../../components/footer.html")
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar footer.html");
        return response.text();
    })
    .then(html => {
        footerDiv.innerHTML = html;
    })
    .catch(error => {
        console.error("Error al cargar el footer:", error);
        footerDiv.innerHTML = "<p style='color: red;'>Error al cargar el footer.</p>";
    });
});

