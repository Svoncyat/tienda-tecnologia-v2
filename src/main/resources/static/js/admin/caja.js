document.addEventListener('DOMContentLoaded', function() {
    const aperturaForm = document.getElementById('apertura-form');
    const cierreForm = document.getElementById('cierre-form');
    const aperturaDiv = document.getElementById('apertura-div');
    const cierreDiv = document.getElementById('cierre-div');

    // Establecer fecha y hora actual por defecto en el formulario de apertura
    function establecerFechaHoraActual() {
        const ahora = new Date();
        const fechaActual = ahora.toISOString().split('T')[0];
        const horaActual = ahora.toTimeString().slice(0, 5);
        
        document.getElementById('fecha').value = fechaActual;
        document.getElementById('hora').value = horaActual;
        
        // Hacer los campos de fecha y hora de apertura de solo lectura
        document.getElementById('fecha').readOnly = true;
        document.getElementById('hora').readOnly = true;
    }

    // Llamar la función al cargar la página
    establecerFechaHoraActual();

    // Manejar el envío del formulario de apertura
    aperturaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar que todos los campos estén llenos
        const caja = document.getElementById('num-caja').value;
        const montoApertura = document.getElementById('monto-apertura').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;

        if (!caja || !montoApertura || !fecha || !hora) {
            alert('Por favor, complete todos los campos');
            return;
        }

        // Ocultar div de apertura y mostrar div de cierre
        aperturaDiv.style.display = 'none';
        cierreDiv.style.display = 'block';

        // Establecer fecha y hora actual por defecto en el formulario de cierre
        const ahora = new Date();
        const fechaActual = ahora.toISOString().split('T')[0];
        const horaActual = ahora.toTimeString().slice(0, 5);
        
        document.getElementById('fecha-cierre').value = fechaActual;
        document.getElementById('hora-cierre').value = horaActual;
        
        // Hacer los campos de fecha y hora de cierre de solo lectura
        document.getElementById('fecha-cierre').readOnly = true;
        document.getElementById('hora-cierre').readOnly = true;

        // Mostrar mensaje de confirmación
        alert('Caja abierta exitosamente');
    });

    // Manejar el envío del formulario de cierre
    cierreForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar que todos los campos estén llenos
        const montoCierre = document.getElementById('monto-cierre').value;
        const fechaCierre = document.getElementById('fecha-cierre').value;
        const horaCierre = document.getElementById('hora-cierre').value;

        if (!montoCierre || !fechaCierre || !horaCierre) {
            alert('Por favor, complete todos los campos obligatorios');
            return;
        }

        // Aquí puedes agregar la lógica para guardar los datos del cierre
        // Por ejemplo, enviar a una API o guardar en localStorage
        
        // Mostrar mensaje de confirmación
        alert('Caja cerrada exitosamente');
        
        // Resetear formularios y volver a mostrar el de apertura
        aperturaForm.reset();
        cierreForm.reset();
        cierreDiv.style.display = 'none';
        aperturaDiv.style.display = 'block';
        
        // Reestablecer fecha y hora actual en apertura
        establecerFechaHoraActual();
    });
});
