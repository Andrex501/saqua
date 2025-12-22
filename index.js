async function cargarActividades() {
  const slidesEl = document.getElementById("actividadesSlides");
  if (!slidesEl) return;

  try {
    const response = await fetch("/data/actividades.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar actividades.json");

    const data = await response.json();
    const actividades = data.items || [];

    if (actividades.length === 0) {
      slidesEl.innerHTML = `
        <div class="carousel-item active">
          <div class="text-center opacity-75 py-4">Aún no hay actividades publicadas.</div>
        </div>`;
      return;
    }

    // Ordenar por fecha (más reciente primero)
    actividades.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));

    // Responsive: 3 desktop, 2 tablet, 1 móvil
    const getItemsPerSlide = () => {
      const w = window.innerWidth;
      if (w >= 992) return 3;   // lg+
      if (w >= 768) return 2;   // md
      return 1;                 // sm/xs
    };

    const buildSlides = () => {
      const perSlide = getItemsPerSlide();
      const chunks = [];
      for (let i = 0; i < actividades.length; i += perSlide) {
        chunks.push(actividades.slice(i, i + perSlide));
      }

      slidesEl.innerHTML = chunks.map((chunk, idx) => `
        <div class="carousel-item ${idx === 0 ? "active" : ""}">
          <div class="row g-3 justify-content-center">
            ${chunk.map(a => `
              <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">
                  ${a.imagen ? `<img src="${a.imagen}" class="card-img-top actividad-img" alt="${a.titulo || "Actividad"}">` : ""}
                  <div class="card-body">
                    <h5 class="card-title">${a.titulo || "Actividad"}</h5>
                    ${a.fecha ? `<div class="small opacity-75 mb-2">${a.fecha}</div>` : ""}
                    <p class="card-text">${a.texto || ""}</p>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("");
    };

    buildSlides();

    // Re-armar el carrusel si cambia el tamaño de pantalla (para 1/2/3 items por slide)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildSlides();
      }, 200);
    });

  } catch (error) {
    console.error(error);
    slidesEl.innerHTML = `
      <div class="carousel-item active">
        <div class="text-center text-danger py-4">Error cargando actividades</div>
      </div>`;
  }
}

document.addEventListener("DOMContentLoaded", cargarActividades);
