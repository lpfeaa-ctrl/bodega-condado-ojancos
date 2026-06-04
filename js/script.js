/* ==========================================================================
   BODEGA CONDADO DE OJANCOS - JAVASCRIPT CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navigation & Sticky Header ---
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const handleScroll = () => {
        // Sticky class toggle
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active link highlighting on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially
    
    
    // --- 2. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navNav = document.querySelector('.nav-nav');
    
    if (menuToggle && navNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navNav.classList.toggle('mobile-active');
            
            // Prevent scrolling when mobile menu is open
            if (navNav.classList.contains('mobile-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navNav.classList.remove('mobile-active');
                document.body.style.overflow = '';
            });
        });
    }
    
    
    // --- 3. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    
    // --- 4. Wine Catalogue Filter ---
    const filterButtons = document.querySelectorAll('.btn-filter');
    const wineCards = document.querySelectorAll('.wine-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            wineCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // If filter is "edicion", match cards that contain "edicion" in data-category
                const categories = category.split(' ');
                const isMatch = filterValue === 'all' || 
                                categories.includes(filterValue) || 
                                (filterValue === 'edicion' && categories.includes('edicion'));
                
                if (isMatch) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) both';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    
    // --- 5. Enoturismo Auto-Booking Integration ---
    const expCtaButtons = document.querySelectorAll('.btn-exp-cta');
    const contactSubject = document.getElementById('subject');
    const contactMessage = document.getElementById('message');
    
    expCtaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const subjectValue = btn.getAttribute('data-subject');
            const expTitle = btn.parentElement.querySelector('h3').innerText;
            
            if (contactSubject && contactMessage) {
                contactSubject.value = 'Enoturismo - Visita Viñedos';
                contactMessage.value = `Hola, me gustaría solicitar una reserva para la experiencia "${expTitle}". Por favor, indíquenme disponibilidad para un grupo de [número] personas para la fecha [fecha deseada].\n\nSaludos cordiales.`;
            }
        });
    });
    
    // Club Join Button integration
    const clubBtn = document.getElementById('btn-club-join');
    if (clubBtn && contactSubject && contactMessage) {
        clubBtn.addEventListener('click', () => {
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
            contactSubject.value = 'Inscripción Club de Vinos';
            contactMessage.value = `Deseo unirme al Círculo Condado de Ojancos para recibir invitaciones a catas privadas, lanzamientos exclusivos de cosechas limitadas y novedades de la bodega.`;
        });
    }
    
    
    // --- 6. Contact Form Submission Simulation ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');
    
    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Procesando...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                formStatus.className = 'form-status success';
                formStatus.innerHTML = `<strong>¡Solicitud enviada con éxito, ${name}!</strong><br>Hemos registrado tu mensaje correctamente. Nuestro bodeguero Antonio Martín o un asesor de Condado de Ojancos te responderá al correo ${email} lo antes posible.`;
                
                contactForm.reset();
                
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 8000);
                
            }, 1500);
        });
    }
});


// --- 7. Wine Tasting Notes Modal System (Full Catalogue of 9 Wines) ---
const wineData = {
    syrah: {
        name: "Syrah Triana",
        grape: "100% Syrah",
        award: "Vino Natural Joven (Sin Barrica)",
        image: "assets/images/bottle_triana.png",
        desc: "Vino tinto joven criado en la Alpujarra Almeriense a una altitud de 1000 metros sin barrica y con fermentación tradicional. Al no tener paso por madera, ofrece la expresión más directa, fresca y afrutada de la variedad.",
        tasting: {
            appearance: "Color rojo intenso, sumamente brillante y limpio en copa.",
            nose: "Notas intensas de frutas rojas y negras, como ciruelas, moras y arándanos, con un toque especiado sutil y matices de regaliz silvestre.",
            mouth: "Sabor de gran frescura con una acidez muy equilibrada y taninos suaves y amables. Regusto frutal de mora y zarzamora con recuerdos herbáceos."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "Vino joven sin barrica, fermentado en depósitos de acero",
            pairing: "Pastas con salsa boloñesa, embutidos de la Alpujarra, tapas y carnes blancas"
        }
    },
    blanco: {
        name: "Blanco Macabeo",
        grape: "Macabeo, Albariño",
        award: "Fresco y Frutal de Altura",
        image: "assets/images/bottle_blanco_macabeo.png",
        desc: "Nuestra propuesta blanca combina la frescura frutal de la uva Macabeo y la elegancia aromática de la uva Albariño, cultivadas a 1000 metros de altitud bajo las excelentes condiciones de la Alpujarra Almeriense.",
        tasting: {
            appearance: "Atractivo color amarillo pajizo con sutiles ribetes verdosos limpios.",
            nose: "Se perciben marcadas notas cítricas y florales acompañadas de frutas tropicales como la piña y el mango fresco.",
            mouth: "Fresco, sumamente equilibrado y con una acidez agradable. Brinda una deliciosa sensación de frescura frutal al final de la degustación."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "Fermentación a temperatura controlada, embotellado joven",
            pairing: "Pescados blancos, mariscos, arroces marineros, quesos frescos y aperitivos ligeros"
        }
    },
    pasiones: {
        name: "Pasiones",
        grape: "100% Syrah",
        award: "6 Meses de Crianza en Roble",
        image: "assets/images/bottle_pasiones.png",
        desc: "Vino tinto varietal de uva Syrah criada a 1000 metros, envejecido durante 6 meses en barricas de roble seleccionadas para dotarlo de finura y notas tostadas.",
        tasting: {
            appearance: "Rojo picota intenso de capa media-alta con elegantes reflejos violáceos.",
            nose: "Notas intensas de frutos rojos y negros maduros (mora, arándano, cereza) con toques especiados y un ligero y agradable ahumado de madera.",
            mouth: "Equilibrado y muy sedoso en boca. Presenta taninos suaves, acidez fresca, notas nítidas de regaliz y pimienta negra sobre un delicado fondo tostado aportado por la barrica."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "Crianza de 6 meses en barricas de roble seleccionadas",
            pairing: "Carnes a la brasa, asados, guisos tradicionales de cuchara y quesos de cabra curados"
        }
    },
    almendro: {
        name: "El Almendro",
        grape: "100% Syrah",
        award: "12 Meses de Crianza en Roble",
        image: "assets/images/bottle_el_almendro.png",
        desc: "Vino de uva Syrah de viñedos de altura. Criado durante 12 meses en barrica, lo que le aporta redondez en boca y una excelente integración de la fruta con la madera.",
        tasting: {
            appearance: "Color rojo intenso con atractivos tonos violáceos.",
            nose: "Aromas a frutas negras maduras como moras y ciruelas, combinadas con notas especiadas y tostadas de la barrica de roble.",
            mouth: "Estructurado, con taninos suaves y perfectamente redondos. En boca se perciben frutos negros y especias con un final persistente y largo."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "12 meses de crianza en barricas de roble y redondeado en botella",
            pairing: "Caza, asados castellanos, rabo de toro y guisados potentes"
        }
    },
    tempranillo: {
        name: "Tempranillo",
        grape: "100% Tempranillo",
        award: "12 Meses de Crianza en Roble",
        image: "assets/images/bottle_tempranillo.png",
        desc: "Un clásico tinto de Tempranillo criado en altitud. Su paso de 12 meses por madera suaviza los taninos naturales de la variedad y potencia su complejidad aromática.",
        tasting: {
            appearance: "Rojo rubí intenso con reflejos violáceos en juventud y tonos teja en madurez.",
            nose: "Intenso y complejo, notas claras de frutas rojas maduras como la cereza, frutos secos y especias (vainilla, canela) de la madera.",
            mouth: "En boca es seco, de buena acidez y taninos presentes pero aterciopelados. Mezcla de frutas rojas y vainilla con final agradable."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "12 meses en barricas de roble francés y americano",
            pairing: "Carnes rojas asadas, embutidos curados, paella de carne y tapas"
        }
    },
    cabmerlot: {
        name: "Cabernet Merlot",
        grape: "Cabernet Sauvignon, Merlot",
        award: "12 Meses de Crianza en Roble",
        image: "assets/images/bottle_cabernet_merlot.png",
        desc: "Elegante coupage criado en altitud. La potencia del Cabernet se suaviza con la redondez del Merlot, madurando conjuntamente en barrica durante un año.",
        tasting: {
            appearance: "Color rojo intenso con hermosas tonalidades violáceas.",
            nose: "Destacan frutos rojos y negros maduros (cereza, ciruela, grosella) con notas especiadas de canela, vainilla, clavo y un sutil fondo tostado.",
            mouth: "Equilibrado y muy estructurado. Taninos firmes pero sedosos, notas de cacao, regaliz y tabaco que acompañan a la fruta en un final largo."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "12 meses en barricas de roble seleccionadas",
            pairing: "Carnes rojas, guisos potentes de legumbres y quesos fuertes"
        }
    },
    carum: {
        name: "Carum 3 Cepas",
        grape: "Syrah, Cabernet, Merlot",
        award: "18 Meses de Crianza en Roble",
        image: "assets/images/bottle_carum_tres_cepas.png",
        desc: "Nuestra creación más compleja y profunda. Un ensamblaje clásico de tres variedades criado pacientemente durante 18 meses. Un vino complejo, estructurado y de gran elegancia para paladares exigentes.",
        tasting: {
            appearance: "Color rojo oscuro y profundo con tonos granate e irisaciones atejadas.",
            nose: "Gran complejidad aromática. Notas a frutas negras muy maduras (mora, cereza negra) mezcladas con aromas a vainilla, pimienta negra, clavo, cuero fino y tabaco.",
            mouth: "Con mucho cuerpo y taninos firmes pero pulidos. Estructura bien definida sustentada por una acidez equilibrada. Final largo y tostado."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "18 meses en barricas de roble y posterior afinado en botella",
            pairing: "Carnes de caza mayor, estofados potentes, solomillo de ternera y quesos muy curados"
        }
    },
    sesenton: {
        name: "Sesentón",
        grape: "100% Syrah de Autor",
        award: "60 Meses de Envejecimiento Especial",
        image: "assets/images/bottle_sesenton.png",
        desc: "Vino excepcional de autor. Criado durante 60 meses en barricas de roble en las cavas de la Alpujarra, lo que le confiere una complejidad y riqueza únicas en el mundo.",
        tasting: {
            appearance: "Capa muy alta, color rojo teja y ribetes granate de gran persistencia.",
            nose: "Complejidad majestuosa. Notas intensas y elegantes de frutos negros y rojos secos, con matices de vainilla y especias exóticas de larga crianza.",
            mouth: "Potente, estructurado y aterciopelado. Estructura tánica firme que se equilibra con su acidez natural y deja una persistencia imborrable."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "60 meses (5 años) de crianza en barricas de roble seleccionadas",
            pairing: "Ocasiones especiales, carnes de caza, quesos muy curados y platos intensos y elaborados"
        }
    },
    mendigante: {
        name: "El Mendigante",
        grape: "100% Tempranillo",
        award: "Fermentado en Barrica sin Macerar",
        image: "assets/images/bottle_el_mendigante.png",
        desc: "Vino tinto singular de uva Tempranillo fermentado directamente en barrica sin maceración previa de los hollejos, lo que reduce la carga tánica y destaca la suavidad de la madera.",
        tasting: {
            appearance: "Color rojo rubí de intensidad suave y translúcida.",
            nose: "Marcados aromas de la madera de roble nueva, destacando vainilla dulce, toques de coco y madera tostada fina.",
            mouth: "Suave, de cuerpo medio, con textura sedosa y una acidez perfectamente equilibrada. Sabores a frutos rojos frescos y especias."
        },
        technical: {
            vineyard: "Laujar de Andarax - Altitud 1.000m",
            aging: "Fermentación directa en barrica de roble sin maceración de pieles",
            pairing: "Aperitivos de embutidos suaves, pescados grasos, carnes blancas y quesos tiernos o semicurados"
        }
    }
};

const openWineModal = (wineId) => {
    const wine = wineData[wineId];
    if (!wine) return;
    
    const modal = document.getElementById('wine-modal');
    const content = document.getElementById('modal-wine-content');
    
    content.innerHTML = `
        <div class="modal-wine-grid">
            <div class="modal-wine-image-column">
                <img src="${wine.image}" alt="${wine.name}">
            </div>
            <div>
                <span class="wine-award" style="font-size: 0.9rem;"><i class="fa-solid fa-wine-glass"></i> ${wine.award}</span>
                <h3 class="modal-wine-title">${wine.name}</h3>
                <p class="modal-wine-grape">${wine.grape}</p>
                
                <p class="modal-wine-section-desc" style="margin-bottom: 1.5rem;">${wine.desc}</p>
                
                <h4 class="modal-wine-section-title">Notas de Cata</h4>
                <div class="tasting-notes-grid">
                    <div class="tasting-note-box">
                        <h5>Vista</h5>
                        <p>${wine.tasting.appearance.split('.')[0]}.</p>
                    </div>
                    <div class="tasting-note-box">
                        <h5>Nariz</h5>
                        <p>${wine.tasting.nose.split('.')[0]}.</p>
                    </div>
                    <div class="tasting-note-box">
                        <h5>Boca</h5>
                        <p>${wine.tasting.mouth.split('.')[0]}.</p>
                    </div>
                </div>
                
                <h4 class="modal-wine-section-title" style="margin-top: 2rem;">Ficha Técnica</h4>
                <ul style="font-size: 0.9rem; color: var(--color-text-muted); display: flex; flex-direction: column; gap: 0.5rem; font-weight: 300;">
                    <li><strong>Viñedo:</strong> ${wine.technical.vineyard}</li>
                    <li><strong>Crianza:</strong> ${wine.technical.aging}</li>
                    <li><strong>Maridaje sugerido:</strong> ${wine.technical.pairing}</li>
                </ul>
                
                <div style="margin-top: 2.5rem;">
                    <a href="#contacto" class="btn-primary" style="width: 100%;" onclick="closeWineModal(); selectWineForPurchase('${wine.name}');">Solicitar Información / Compra</a>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeWineModal = () => {
    const modal = document.getElementById('wine-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

const selectWineForPurchase = (wineName) => {
    const contactSubject = document.getElementById('subject');
    const contactMessage = document.getElementById('message');
    
    if (contactSubject && contactMessage) {
        contactSubject.value = 'Adquisición de Vinos Especiales';
        contactMessage.value = `Hola, estoy interesado en adquirir o recibir información sobre su vino "${wineName}". Por favor, indíquenme disponibilidad de cajas y formas de envío.\n\nSaludos.`;
        
        setTimeout(() => {
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWineModal();
    }
});
