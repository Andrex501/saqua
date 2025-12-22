async function cargarActividades() {
  const grid = document.getElementById("actividadesGrid");
  if (!grid) return;

  try {
    const response = await fetch("/data/actividades.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("No se pudo cargar actividades.json");
    }

    const data = await response.json();
    const actividades = data.items || [];

    if (actividades.length === 0) {
      grid.innerHTML =
        '<div class="col-12 text-center opacity-75">Aún no hay actividades publicadas.</div>';
      return;
    }

    // Ordenar por fecha (más reciente primero)
    actividades.sort((a, b) =>
      (b.fecha || "").localeCompare(a.fecha || "")
    );

    grid.innerHTML = actividades
      .map(
        (a) => `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          ${
            a.imagen
              ? `<img src="${a.imagen}" class="card-img-top actividad-img" alt="${a.titulo}">`
              : ""
          }
          <div class="card-body">
            <h5 class="card-title">${a.titulo}</h5>
            ${
              a.fecha
                ? `<div class="small opacity-75 mb-2">${a.fecha}</div>`
                : ""
            }
            <p class="card-text">${a.texto}</p>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error(error);
    grid.innerHTML =
      '<div class="col-12 text-center text-danger">Error cargando actividades</div>';
  }
}

document.addEventListener("DOMContentLoaded", cargarActividades);
