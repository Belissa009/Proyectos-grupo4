/**
 * =============================================================================
 * PROYECTO: Liceo Técnico Profesional Fe y Alegría
 * ARCHIVO: app.js
 * DESCRIPCIÓN: Lógica interactiva en JavaScript Vanilla (Sin librerías pesadas).
 * DOCENCIA: Código 100% comentado y estructurado pedagógicamente para explicar:
 *           1. Inicialización y Ciclo de Vida del DOM (DOMContentLoaded).
 *           2. Manejo de Eventos (Event Listeners & Event Delegation).
 *           3. Manipulación Dinámica de Clases CSS y Atributos ARIA (Accesibilidad).
 *           4. Sistema de Pestañas Interactivas (Tabs System).
 *           5. Ventanas Modales Accesibles (Manejo de Foco y Tecla Escape).
 *           6. Validación de Formularios con Expresiones Regulares (RegExp).
 * =============================================================================
 */

// 'use strict' activa el modo estricto de JavaScript para prevenir errores comunes
// y garantizar buenas prácticas de programación en desarrollo frontend.
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------------------------------
       PASO 01: INICIALIZACIÓN DE ICONOS LUCIDE
       Lucide Icons busca elementos con el atributo 'data-lucide' y los
       reemplaza por vectores SVG nítidos y escalables.
       ------------------------------------------------------------------------- */
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    /* -------------------------------------------------------------------------
       PASO 02: MENÚ DE NAVEGACIÓN MÓVIL (HAMBURGUESA)
       Control de apertura y cierre del menú para pantallas pequeñas,
       actualizando el atributo ARIA 'aria-expanded' para lectores de pantalla.
       ------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isMenuOpen = navMenu.classList.toggle('open');
            // Informamos a las tecnologías de asistencia el estado del menú
            mobileToggle.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');

            // Cambiamos el icono entre 'menu' y 'x' según el estado
            const menuIcon = mobileToggle.querySelector('svg') || mobileToggle.querySelector('i');
            if (menuIcon && typeof lucide !== 'undefined') {
                mobileToggle.innerHTML = isMenuOpen
                    ? '<i data-lucide="x"></i>'
                    : '<i data-lucide="menu"></i>';
                lucide.createIcons();
            }
        });

        // Al hacer clic en un enlace del menú móvil, cerramos el menú automáticamente
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            });
        });
    }

    /* -------------------------------------------------------------------------
       PASO 03: EFECTO NAVBAR SCROLL (SOMBRA DINÁMICA)
       Agrega una sombra más pronunciada al menú cuando el usuario baja en la página.
       ------------------------------------------------------------------------- */
    const headerNavbar = document.getElementById('headerNavbar');
    window.addEventListener('scroll', () => {
        if (!headerNavbar) return;
        if (window.scrollY > 40) {
            headerNavbar.classList.add('scrolled');
        } else {
            headerNavbar.classList.remove('scrolled');
        }
    });

    /* -------------------------------------------------------------------------
       PASO 04: SISTEMA DE PESTAÑAS DE CARRERAS TÉCNICAS
       Permite alternar entre los perfiles de Informática, Contabilidad,
       Ebanistería, Confección y Patronaje, Enfermería y Mercadeo.
       ------------------------------------------------------------------------- */
    const tabButtons = document.querySelectorAll('.career-tab-btn');
    const careerPanels = document.querySelectorAll('.career-panel');

    function switchCareerTab(targetCareerId) {
        // 1. Desactivamos todos los botones de pestañas
        tabButtons.forEach(btn => {
            const isMatch = btn.getAttribute('data-career') === targetCareerId;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        // 2. Ocultamos todos los paneles y mostramos el correspondiente
        careerPanels.forEach(panel => {
            const panelId = panel.id;
            const isTargetPanel = panelId === `panel-${targetCareerId}`;

            if (isTargetPanel) {
                panel.classList.add('active');
                panel.removeAttribute('hidden');
            } else {
                panel.classList.remove('active');
                panel.setAttribute('hidden', 'true');
            }
        });

        // Volvemos a renderizar los iconos si hay nuevos elementos visuales
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    // Agregamos el detector de eventos 'click' a cada botón de carrera
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const careerId = button.getAttribute('data-career');
            switchCareerTab(careerId);
        });
    });

    // Enlaces rápidos (por ejemplo, desde el Footer) que abren una pestaña específica
    const tabQuickLinks = document.querySelectorAll('.tab-quick-link');
    tabQuickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetTab = link.getAttribute('data-target-tab');
            if (targetTab) {
                switchCareerTab(targetTab);
            }
        });
    });

    /* -------------------------------------------------------------------------
       PASO 05: CONTROL DE LA VENTANA MODAL DE PRE-INSCRIPCIÓN
       Gestión accesible de apertura, cierre, foco y bloqueo de scroll de fondo.
       ------------------------------------------------------------------------- */
    const modalBackdrop = document.getElementById('preinscripcionModal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const successCloseBtn = document.getElementById('successCloseBtn');
    const carreraInteresSelect = document.getElementById('carreraInteres');

    // Contenedores internos del modal (Formulario vs Mensaje de Éxito)
    const formFieldsContainer = document.getElementById('formFieldsContainer');
    const formSuccessContainer = document.getElementById('formSuccessContainer');
    const preinscripcionForm = document.getElementById('preinscripcionForm');

    // Elemento que tenía el foco antes de abrir el modal para restaurarlo al cerrar
    let lastActiveElement = null;

    function openPreinscripcionModal(preselectedCareer = null) {
        if (!modalBackdrop) return;

        lastActiveElement = document.activeElement;

        // Si se envió una carrera para preseleccionar (ej. desde el botón de cada carrera)
        if (preselectedCareer && carreraInteresSelect) {
            carreraInteresSelect.value = preselectedCareer;
        }

        // Mostramos el modal
        modalBackdrop.classList.add('active');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Evita scroll de la página de fondo

        // Enfocar el primer input para accesibilidad
        const firstInput = document.getElementById('postulanteNombre');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 150);
        }
    }

    function closePreinscripcionModal() {
        if (!modalBackdrop) return;

        modalBackdrop.classList.remove('active');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restaurar scroll del body

        // Restaurar foco al elemento que disparó la apertura
        if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
            lastActiveElement.focus();
        }

        // Si el usuario ya había terminado y cerró, reiniciamos el formulario a su estado inicial
        if (formSuccessContainer && !formSuccessContainer.hidden) {
            resetModalFormState();
        }
    }

    function resetModalFormState() {
        if (preinscripcionForm) preinscripcionForm.reset();
        if (formFieldsContainer) formFieldsContainer.hidden = false;
        if (formSuccessContainer) formSuccessContainer.hidden = true;
        clearValidationErrors();
    }

    // Escuchador para todos los botones que abren el modal (Navbar, Hero, Pestañas, FAB)
    openModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const preselect = btn.getAttribute('data-preselect');
            openPreinscripcionModal(preselect);
        });
    });

    // Botones de cierre explícito
    if (closeModalBtn) closeModalBtn.addEventListener('click', closePreinscripcionModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closePreinscripcionModal);
    if (successCloseBtn) successCloseBtn.addEventListener('click', closePreinscripcionModal);

    // Cerrar al hacer clic en el fondo oscuro (backdrop)
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (event) => {
            if (event.target === modalBackdrop) {
                closePreinscripcionModal();
            }
        });
    }

    // Cerrar al presionar la tecla 'Escape' (Estándar de Accesibilidad WCAG)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closePreinscripcionModal();
        }
    });

    /* -------------------------------------------------------------------------
       PASO 06: VALIDACIÓN DIDÁCTICA DEL FORMULARIO DE ADMISIONES
       Verificación en tiempo real de campos obligatorios, expresiones regulares
       y despliegue claro de mensajes de error amigables.
       ------------------------------------------------------------------------- */
    const inputNombre = document.getElementById('postulanteNombre');
    const inputDoc = document.getElementById('postulanteDoc');
    const inputTelefono = document.getElementById('postulanteTelefono');
    const inputEmail = document.getElementById('postulanteEmail');
    const selectCarrera = document.getElementById('carreraInteres');

    // Mapa de errores asociados a cada campo
    const errors = {
        nombre: document.getElementById('errorNombre'),
        documento: document.getElementById('errorDoc'),
        telefono: document.getElementById('errorTelefono'),
        email: document.getElementById('errorEmail'),
        carrera: document.getElementById('errorCarrera')
    };

    function clearValidationErrors() {
        // Remover clases inválidas de inputs
        document.querySelectorAll('.form-control.is-invalid').forEach(input => {
            input.classList.remove('is-invalid');
        });
        // Ocultar mensajes de error
        document.querySelectorAll('.field-error.show').forEach(msg => {
            msg.classList.remove('show');
        });
    }

    function showFieldError(inputElement, errorElement) {
        if (inputElement) inputElement.classList.add('is-invalid');
        if (errorElement) errorElement.classList.add('show');
    }

    function removeFieldError(inputElement, errorElement) {
        if (inputElement) inputElement.classList.remove('is-invalid');
        if (errorElement) errorElement.classList.remove('show');
    }

    // Validación interactiva mientras la usuaria escribe (evento 'input')
    if (inputNombre) {
        inputNombre.addEventListener('input', () => {
            if (inputNombre.value.trim().length >= 5) {
                removeFieldError(inputNombre, errors.nombre);
            }
        });
    }

    if (inputEmail) {
        inputEmail.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(inputEmail.value.trim())) {
                removeFieldError(inputEmail, errors.email);
            }
        });
    }

    if (inputTelefono) {
        inputTelefono.addEventListener('input', () => {
            // Permitimos números, guiones y paréntesis
            const cleanDigits = inputTelefono.value.replace(/\D/g, '');
            if (cleanDigits.length >= 8) {
                removeFieldError(inputTelefono, errors.telefono);
            }
        });
    }

    if (inputDoc) {
        inputDoc.addEventListener('input', () => {
            if (inputDoc.value.trim().length >= 7) {
                removeFieldError(inputDoc, errors.documento);
            }
        });
    }

    if (selectCarrera) {
        selectCarrera.addEventListener('change', () => {
            if (selectCarrera.value !== '') {
                removeFieldError(selectCarrera, errors.carrera);
            }
        });
    }

    // Manejador del evento 'submit' del formulario
    if (preinscripcionForm) {
        preinscripcionForm.addEventListener('submit', (event) => {
            // e.preventDefault() previene el envío tradicional y la recarga de página,
            // permitiéndonos controlar el flujo mediante JavaScript (SPA / Interactivo).
            event.preventDefault();

            let isValid = true;
            let firstInvalidField = null;

            // 1. Validar Nombre Completo (mínimo 5 letras y al menos dos palabras)
            const nombreVal = inputNombre ? inputNombre.value.trim() : '';
            if (nombreVal.length < 5 || !nombreVal.includes(' ')) {
                showFieldError(inputNombre, errors.nombre);
                isValid = false;
                if (!firstInvalidField) firstInvalidField = inputNombre;
            } else {
                removeFieldError(inputNombre, errors.nombre);
            }

            // 2. Validar Documento de Identidad (Cédula / DNI)
            const docVal = inputDoc ? inputDoc.value.trim() : '';
            if (docVal.length < 7) {
                showFieldError(inputDoc, errors.documento);
                isValid = false;
                if (!firstInvalidField) firstInvalidField = inputDoc;
            } else {
                removeFieldError(inputDoc, errors.documento);
            }

            // 3. Validar Teléfono (mínimo 8 dígitos numéricos)
            const telVal = inputTelefono ? inputTelefono.value.replace(/\D/g, '') : '';
            if (telVal.length < 8) {
                showFieldError(inputTelefono, errors.telefono);
                isValid = false;
                if (!firstInvalidField) firstInvalidField = inputTelefono;
            } else {
                removeFieldError(inputTelefono, errors.telefono);
            }

            // 4. Validar Correo Electrónico
            const emailVal = inputEmail ? inputEmail.value.trim() : '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                showFieldError(inputEmail, errors.email);
                isValid = false;
                if (!firstInvalidField) firstInvalidField = inputEmail;
            } else {
                removeFieldError(inputEmail, errors.email);
            }

            // 5. Validar Carrera Técnica Seleccionada
            const carreraVal = selectCarrera ? selectCarrera.value : '';
            if (!carreraVal) {
                showFieldError(selectCarrera, errors.carrera);
                isValid = false;
                if (!firstInvalidField) firstInvalidField = selectCarrera;
            } else {
                removeFieldError(selectCarrera, errors.carrera);
            }

            // Si hay errores, hacemos foco en el primer campo inválido para mejorar la experiencia
            if (!isValid) {
                if (firstInvalidField) firstInvalidField.focus();
                return;
            }

            // =================================================================
            // PROCESAMIENTO EXITOSO
            // Generamos un código de folio preliminar y mostramos el comprobante
            // =================================================================
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const folioNumber = `FYAL-2026-${randomCode}`;
            const careerSelectedText = selectCarrera.options[selectCarrera.selectedIndex].text;

            const folioCodeDisplay = document.getElementById('folioCodeDisplay');
            const folioDetailsDisplay = document.getElementById('folioDetailsDisplay');

            if (folioCodeDisplay) {
                folioCodeDisplay.textContent = folioNumber;
            }

            if (folioDetailsDisplay) {
                folioDetailsDisplay.innerHTML = `
                    <p><strong>Postulante:</strong> ${escapeHtml(nombreVal)}</p>
                    <p><strong>Cédula / ID:</strong> ${escapeHtml(docVal)}</p>
                    <p><strong>Carrera Técnica:</strong> ${escapeHtml(careerSelectedText)}</p>
                    <p><strong>Contacto:</strong> ${escapeHtml(emailVal)} · ${escapeHtml(inputTelefono.value)}</p>
                `;
            }

            // Intercambiamos vistas dentro del modal
            if (formFieldsContainer) formFieldsContainer.hidden = true;
            if (formSuccessContainer) {
                formSuccessContainer.hidden = false;
                // Inicializar iconos de la vista de éxito
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
            }
        });
    }

    /**
     * Función utilitaria de sanitización para prevenir vulnerabilidades XSS
     * (Cross-Site Scripting) al imprimir cadenas en el HTML.
     */
    function escapeHtml(string) {
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    }

    /* -------------------------------------------------------------------------
       PASO 07: DESPLAZAMIENTO SUAVE PARA NAVEGACIÓN
       Mejora el scroll suave ajustando la altura de la barra fija superior.
       ------------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#inicio') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            // Si es un modal o un enlace interno que no es una sección, dejamos pasar
            if (targetId.startsWith('#preinscripcion')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = headerNavbar ? headerNavbar.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - 15;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('✅ [Liceo Técnico Fe y Alegría] Sistema inicializado exitosamente.');
});
