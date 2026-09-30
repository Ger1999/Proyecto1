//usuarios 
const usuariosPermitidos = [
  { usuario: 'Fernanda@certus.edu.pe', contra: 'admin1995' },
  { usuario: 'Cliente@certus.edu.pe', contra: 'cliente123' }
];

//inicio de sesión
function iniciarSesion(event) {
  event.preventDefault(); // Evita recargue de página

  const correoInput = document.getElementById('username').value;
  const passwordInput = document.getElementById('password').value;

  const usuarioValido = usuariosPermitidos.find(
    u => u.usuario === correoInput && u.contra === passwordInput
  );

  if (usuarioValido) {
    // Guardar la sesión en el navegador del usuario
    localStorage.setItem('usuarioLogueado', usuarioValido.usuario);
    alert('¡Inicio de sesión exitoso!');
    window.location.href = 'bienvenido.html';
  } else {
    alert('Usuario o contraseña incorrectos');
  }
}


//cerrar sesión

function cerrarSesion() {
  localStorage.removeItem('usuarioLogueado');
  window.location.href = 'index.html';
}


//subir documentos (usarBase64)

async function subirDocumentos(event) {
  event.preventDefault();

  const usuario = localStorage.getItem('usuarioLogueado');
  if (!usuario) {
    alert('No has iniciado sesión');
    window.location.href = 'index.html';
    return;
  }

  const dniInput = document.getElementById('dni').files[0];
  const certificadoInput = document.getElementById('certificado').files[0];
  const fotocarnetInput = document.getElementById('fotocarnet').files[0];

  if (!dniInput || !certificadoInput || !fotocarnetInput) {
    alert('Por favor, adjunta los tres archivos.');
    return;
  }

  // Convertir archivos a formato Base64 para guardarlos en localstorage
  const dniBase64 = await convertirABase64(dniInput);
  const certificadoBase64 = await convertirABase64(certificadoInput);
  const fotocarnetBase64 = await convertirABase64(fotocarnetInput);

  const nuevoRegistro = {
    id: Date.now(),
    usuario: usuario,
    dni: dniBase64,
    certificado: certificadoBase64,
    fotocarnet: fotocarnetBase64
  };

  // Obtener documentos existentes o crear un arreglo nuevo
  const documentosExistentes = JSON.parse(localStorage.getItem('documentosUsuarios')) || [];
  documentosExistentes.push(nuevoRegistro);

  // Guardar adentro
  localStorage.setItem('documentosUsuarios', JSON.stringify(documentosExistentes));
  alert('Documentos guardados correctamente en el navegador.');
}

//leer archivos locales
function convertirABase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


//vista para ver los documentos

function cargarDocumentosSubidos() {
  const contenedor = document.getElementById('lista-documentos');
  if (!contenedor) return;

  const documentos = JSON.parse(localStorage.getItem('documentosUsuarios')) || [];

  if (documentos.length === 0) {
    contenedor.innerHTML = '<p>No hay documentos registrados.</p>';
    return;
  }

  let html = '';
  documentos.forEach(doc => {
    html += `
      <div class="doc-card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px;">
        <strong>Usuario:</strong> ${doc.usuario}<br><br>
        <div style="display: flex; gap: 10px;">
          <div>
            <p><strong>DNI:</strong></p>
            <iframe src="${doc.dni}" width="200" height="250"></iframe>
          </div>
          <div>
            <p><strong>Certificado:</strong></p>
            <iframe src="${doc.certificado}" width="200" height="250"></iframe>
          </div>
          <div>
            <p><strong>Foto Carnet:</strong></p>
            <iframe src="${doc.fotocarnet}" width="200" height="250"></iframe>
          </div>
        </div>
      </div>
    `;
  });

  contenedor.innerHTML = html;
}