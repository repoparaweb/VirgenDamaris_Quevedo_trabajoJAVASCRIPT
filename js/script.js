// ===== CARGAR NOTICIAS DE IA DESDE MIT TECHNOLOGY REVIEW =====
document.addEventListener('DOMContentLoaded', cargarNoticias);

async function cargarNoticias() {
  const container = document.getElementById("noticias-container");
  if (!container) {
    console.log("No se encontró el contenedor 'noticias-container'.");
    return;
  }

  try {
    // Fuente: MIT Technology Review - AI
    const apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.xataka.com%2Ffeedburner.xml';
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Error al cargar las noticias');
    
    const data = await response.json();
    if (data.status !== 'ok') throw new Error('Error en la respuesta de la API');

    container.innerHTML = '';

    const todasNoticias = data.items || [];

    const noticiasIA = todasNoticias.filter(item => {
      const titulo = (item.title || '').toLowerCase();
      const descripcion = (item.description || '').toLowerCase();
      const contenido = (item.content || '').toLowerCase();
      const texto = `${titulo} ${descripcion} ${contenido}`;

      
      // Excluir temas no relacionados
      const excluidos = ['ucrania', 'guerra', 'ejército', 'arma', 'conflicto', 'shein'];
      const esExcluido = excluidos.some(e => texto.includes(e));

      return !esExcluido;
    });

    const noticias = noticiasIA.slice(0, 6);
    if (noticias.length === 0) {
      container.innerHTML = '<p>No hay noticias disponibles en este momento.</p>';
      return;
    }

    noticias.forEach(item => {
      // 🔍 EXTRAER IMAGEN DE <content:encoded> (item.content)
      let imagen = item.thumbnail || ''; // Usar thumbnail si está disponible
      if (item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          imagen = imgMatch[1].split('?')[0]; // Eliminar parámetros como ?resize=...
        }
      }

      // Fallback por si no se encontró imagen en el contenido
      if (!imagen) {
        const titulo = item.title.toLowerCase();
        if (titulo.includes('robot') || titulo.includes('hardware') || titulo.includes('chip')) {
          imagen = 'images/robot-news.jpg';
        } else if (titulo.includes('chat') || titulo.includes('gpt') || titulo.includes('llm') || titulo.includes('model')) {
          imagen = 'images/chatbot-news.jpg';
        } else if (titulo.includes('medical') || titulo.includes('health') || titulo.includes('salud')) {
          imagen = 'images/medical-ai-news.jpg';
        } else if (titulo.includes('ethic') || titulo.includes('ética') || titulo.includes('regulat')) {
          imagen = 'images/ethics-news.jpg';
        } else {
          imagen = 'images/placeholder-news.jpg';
        }
      }

      const card = document.createElement('div');
      card.className = 'noticia-card';
      card.innerHTML = `
        <img src="${imagen}" alt="${item.title}" onerror="this.src='images/placeholder-news.jpg'">
        <div class="noticia-content">
          <h3>${item.title}</h3>
          <p class="meta">MIT Tech Review • ${new Date(item.pubDate).toLocaleDateString('es-ES')}</p>
          <a href="${item.link}" target="_blank" rel="noopener">Leer más</a>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error al cargar noticias:', error);
    container.innerHTML = '<p>Hubo un problema al cargar las noticias. Inténtalo más tarde.</p>';
  }
}

//======== MODAL DE SUSCRIPCIÓN ========
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('abrir-modal-suscripcion');
  const modal = document.getElementById('modal-suscripcion');
  const cerrar = document.getElementById('cerrar-modal');
  const formulario = document.getElementById('formulario-suscripcion');
  const mensajeExito = document.getElementById('mensaje-exito');

  if (!btn || !modal) return;

  btn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  cerrar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-suscripcion').value.trim();

    if (email) {
      console.log('Email suscrito:', email);
      // Aquí iría la lógica para enviar a tu backend o servicio de email

      mensajeExito.style.display = 'block';
      formulario.style.display = 'none';

      setTimeout(() => {
        modal.style.display = 'none';
        formulario.reset();
        formulario.style.display = 'block';
        mensajeExito.style.display = 'none';
      }, 2000);
    }
  });
});

// ===== IDENTIFICANDO MENU ACTIVO =====
document.addEventListener("DOMContentLoaded", function() {
  const currentLocation = window.location.pathname.split("/").pop(); // Obtiene "inicio.html", "galeria.html",etc.
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentLocation) {
      link.classList.add("active");
    }
  });
});

 
//===== TRADUCIENDO TEXTO DE LA NUMERACION DE LAS IMÁGENES =====
document.addEventListener('DOMContentLoaded', function () {
      lightbox.option({
        'albumLabel': 'Imagen %1 de %2',
        'alwaysShowNavOnTouchDevices': true,
        'wrapAround': true
      });
    });


// ===== PRESUPUESTO DINÁMICO Y VALIDACIÓN =====
if (document.getElementById('form-presupuesto')) {
  const form = document.getElementById('form-presupuesto');
  const nombreInput = document.getElementById('nombre');
  const apellidosInput = document.getElementById('apellidos');
  const telefonoInput = document.getElementById('telefono');
  const emailInput = document.getElementById('email');
  const productoSelect = document.getElementById('producto');
  const plazoInput = document.getElementById('plazo');
  const extrasCheckboxes = document.querySelectorAll('input[type="checkbox"][value]');
  const totalSpan = document.getElementById('total');
  const condicionesCheckbox = document.getElementById('condiciones');

  // Validar en tiempo real
  nombreInput.addEventListener('blur', validarNombre);
  apellidosInput.addEventListener('blur', validarApellidos);
  telefonoInput.addEventListener('blur', validarTelefono);
  emailInput.addEventListener('blur', validarEmail);

  // Calcular total cuando algo cambie
  productoSelect.addEventListener('change', calcularTotal);
  plazoInput.addEventListener('input', calcularTotal);
  extrasCheckboxes.forEach(cb => cb.addEventListener('change', calcularTotal));
  condicionesCheckbox.addEventListener('change', () => {
    document.getElementById('error-condiciones').textContent = '';
  });

  // Validar al enviar
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valido = true;

    if (!validarNombre() || !validarApellidos() || !validarTelefono() || !validarEmail()) {
      valido = false;
    }

    if (!condicionesCheckbox.checked) {
      document.getElementById('error-condiciones').textContent = 'Debes aceptar las condiciones.';
      valido = false;
    }

    if (valido) {
      alert('¡Presupuesto enviado correctamente!\nTe contactaremos pronto.');
      form.reset();
      totalSpan.textContent = '0.00';
    }
  });

  // Funciones de validación
  function validarNombre() {
    const valor = nombreInput.value.trim();
    const errorSpan = document.getElementById('error-nombre');
    if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,15}$/.test(valor)) {
      errorSpan.textContent = 'Solo letras, máximo 15 caracteres.';
      return false;
    } else {
      errorSpan.textContent = '';
      return true;
    }
  }

  function validarApellidos() {
    const valor = apellidosInput.value.trim();
    const errorSpan = document.getElementById('error-apellidos');
    if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{1,40}$/.test(valor)) {
      errorSpan.textContent = 'Solo letras, máximo 40 caracteres.';
      return false;
    } else {
      errorSpan.textContent = '';
      return true;
    }
  }

  function validarTelefono() {
    const valor = telefonoInput.value.trim();
    const errorSpan = document.getElementById('error-telefono');
    if (!/^\d{1,9}$/.test(valor)) {
      errorSpan.textContent = 'Solo números, máximo 9 dígitos.';
      return false;
    } else {
      errorSpan.textContent = '';
      return true;
    }
  }

  function validarEmail() {
    const valor = emailInput.value.trim();
    const errorSpan = document.getElementById('error-email');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(valor)) {
      errorSpan.textContent = 'Formato de correo inválido.';
      return false;
    } else {
      errorSpan.textContent = '';
      return true;
    }
  }

  // Calcular presupuesto
  function calcularTotal() {
    const producto = parseFloat(productoSelect.value) || 0;
    const plazo = parseInt(plazoInput.value) || 1;
    let extras = 0;

    extrasCheckboxes.forEach(cb => {
      if (cb.checked) {
        extras += parseFloat(cb.value);
      }
    });

    // Descuento por plazo: 5% por mes adicional (máx 50%)
    const descuento = Math.min((plazo - 1) * 0.05, 0.5); // Máx 50%
    const subtotal = producto + extras;
    const total = subtotal * (1 - descuento);

    totalSpan.textContent = total.toFixed(2);
  }

  // Inicializar total
  calcularTotal();
}



// ===== MAPA DE CONTACTO (Leaflet + OpenStreetMap) =====
if (document.getElementById('map')) {
  // Inicializar mapa
  const map = L.map('map').setView([40.4168, -3.7038], 13); // Madrid

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Marcador de la empresa
  const empresa = L.marker([40.4168, -3.7038]).addTo(map)
    .bindPopup('Oficinas de IA o Yo<br>Calle de la IA, 123, Madrid')
    .openPopup();

  // Variables globales
  let userMarker = null;
  let rutaLayer = null;

  // Función para calcular y mostrar ruta
  function calcularRuta(lat, lng) {
    if (userMarker) map.removeLayer(userMarker);
    if (rutaLayer) map.removeLayer(rutaLayer);

    userMarker = L.marker([lat, lng]).addTo(map)
      .bindPopup('Tu ubicación')
      .openPopup();

    const bounds = L.latLngBounds([[lat, lng], [40.4168, -3.7038]]);
    map.fitBounds(bounds, { padding: [50, 50] });

    const url = `https://router.project-osrm.org/route/v1/driving/${lng},${lat};-3.7038,40.4168?overview=full&geometries=geojson`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distancia = (route.distance / 1000).toFixed(2);
          const duracion = (route.duration / 60).toFixed(0);

          rutaLayer = L.geoJSON(route.geometry, {
            style: { color: '#007BFF', weight: 5, opacity: 0.8 }
          }).addTo(map);

          alert(`Ruta calculada:\nDistancia: ${distancia} km\nDuración: ${duracion} min`);
        } else {
          alert('No se pudo calcular la ruta.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al calcular la ruta.');
      });
  }

  // Evento: Usar mi ubicación
  document.getElementById('btn-mi-ubicacion')?.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          calcularRuta(latitude, longitude);
        },
        (error) => {
          alert('No se pudo obtener tu ubicación: ' + error.message);
        }
      );
    } else {
      alert('Geolocalización no soportada en este navegador.');
    }
  });

  // Evento: Calcular ruta desde dirección
  document.getElementById('btn-calcular-ruta')?.addEventListener('click', () => {
    const direccion = document.getElementById('origen')?.value.trim();
    if (!direccion) {
      alert('Por favor, introduce una dirección.');
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          calcularRuta(parseFloat(lat), parseFloat(lon));
        } else {
          alert('Dirección no encontrada. Intenta con otra.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al buscar la dirección.');
      });
  });
}