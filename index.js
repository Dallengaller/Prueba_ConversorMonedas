// Conversor
async function obtenerTasaDeCambio(divisa) {
    const res = await fetch("https://mindicador.cl/api/");
    const data = await res.json();

    if (divisa === "dolar") {
        return data.dolar.valor;
    } else if (divisa === "euro") {
        return data.euro.valor;
    } else {
        throw new Error("Divisa no válida");
    }
}

async function convertir() {
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const divisa = document.getElementById("divisa").value;

    if (!cantidad || !divisa) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    try {
        const tasaDeCambio = await obtenerTasaDeCambio(divisa);
        const resultado = cantidad / tasaDeCambio;
        document.getElementById("resultado").textContent = `Resultado: ${resultado.toFixed(2)} ${divisa.toUpperCase()}`;
    } catch (error) {
        console.error("Error durante la conversión:", error);
        document.getElementById("resultado").textContent = "Error durante la conversión.";
    }
}

// Graficas Dolar
document.addEventListener("DOMContentLoaded", function () {
   
    const apiUrl = "https://mindicador.cl/api/dolar/";

    
    const ctx = document.getElementById("myChart").getContext("2d");

    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
       
            const valoresDolar = data.serie.slice(0, 10);

            
            const fechas = valoresDolar.map(valor => valor.fecha.substr(0, 10));
            const valores = valoresDolar.map(valor => valor.valor);

            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: fechas,
                    datasets: [{
                        label: 'Valor del Dólar',
                        borderColor: 'rgb(75, 192, 192)',
                        data: valores,
                        fill: false,
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            title: {
                                display: true,
                                text: 'Fecha'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Valor del Dólar'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error al obtener datos:", error);
        });
});

// Grafica para EURO
document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://mindicador.cl/api/euro/";

    const ctx = document.getElementById("myChart2").getContext("2d");

    function obtenerDatosEuro() {
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => data.serie.slice(0, 10))
            .catch(error => console.error("Error al obtener datos:", error));
    }

    function configurarGrafico(fechas, valores) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Valor del Euro',
                    borderColor: 'rgb(192, 75, 192)',
                    data: valores,
                    fill: false,
                }]
            },
            options: {
                scales: {
                    x: { type: 'category', title: { display: true, text: 'Fecha' } },
                    y: { title: { display: true, text: 'Valor del Euro' } }
                }
            }
        });
    }

    function actualizarGrafico() {
        obtenerDatosEuro()
            .then(data => {
                const fechas = data.map(valor => valor.fecha.substr(0, 10));
                const valores = data.map(valor => valor.valor);
                configurarGrafico(fechas, valores);
            });
    }

  
    actualizarGrafico();
});
