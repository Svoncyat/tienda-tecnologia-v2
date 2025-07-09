// login.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const btnIngresar = document.getElementById('ingresar');

    btnIngresar.addEventListener('click', function(event) {
        event.preventDefault();
        const username = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;

        fetch('/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Credenciales inválidas');
            }
        })
        .then(data => {
            // Redirigir al dashboard
            window.location.href = '/admin/inventario';
        })
        .catch(error => {
            alert(error.message);
        });
    });
}); 