const URL_JSON = "https://carlosreneas.github.io/endpoints/cartas.json";

async function cargarInicial() {
  if (!localStorage.getItem("cartas")) {
    const res = await fetch(URL_JSON);
    const data = await res.json();
    const cartas = data.data.map(c => ({
      numero: c.numero,
      nombre: c.carta,
      cantidad: parseInt(c.valor) || 0
    }));
    localStorage.setItem("cartas", JSON.stringify(cartas));
  }
  mostrarCartas();
}

function obtenerCartas() {
  return JSON.parse(localStorage.getItem("cartas")) || [];
}

function guardarCartas(cartas) {
  localStorage.setItem("cartas", JSON.stringify(cartas));
}

function mostrarCartas() {
  let cartas = obtenerCartas();

  // Ordenar de mayor a menor según cantidad
  cartas.sort((a, b) => b.cantidad - a.cantidad);

  const tbody = document.getElementById("listado");
  tbody.innerHTML = "";

  cartas.forEach(carta => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${carta.numero}</td>
      <td>${carta.nombre}</td>
      <td>${carta.cantidad}</td>
    `;
    tbody.appendChild(tr);
  });
}


// Evento formulario
document.getElementById("formCarta").addEventListener("submit", function(e) {
  e.preventDefault();

  const numero = document.getElementById("numCarta").value;
  const nombre = document.getElementById("nombreCarta").value;

  let cartas = obtenerCartas();

  const existente = cartas.find(c => c.numero == numero);
  if (existente) {
    existente.cantidad++;
  } else {
    cartas.push({ numero, nombre, cantidad: 1 });
  }

  guardarCartas(cartas);
  mostrarCartas();
  this.reset();
});

// Click en imágenes (cartas como botones)
function activarCartasComoBotones() {
  document.querySelectorAll(".carta-btn").forEach(img => {
    img.addEventListener("click", () => {
      const numero = img.dataset.numero;
      let cartas = obtenerCartas();
      const carta = cartas.find(c => c.numero == numero);
      if (carta) {
        carta.cantidad++;
      } else {
        cartas.push({ numero, nombre: "Carta " + numero, cantidad: 1 });
      }
      guardarCartas(cartas);
      mostrarCartas();
    });
  });
}

// Inicializar
cargarInicial().then(() => activarCartasComoBotones());
