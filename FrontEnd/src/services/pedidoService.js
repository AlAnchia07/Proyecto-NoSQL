const API_URL = "http://localhost:5000/api/pedidos";

export async function crearPedido(datosPedido) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datosPedido)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al crear el pedido.");
  }

  return await response.json();
}

export async function getPedidosCliente(idCliente) {
  const response = await fetch(`${API_URL}/cliente/${idCliente}`);

  if (!response.ok) {
    throw new Error("Error al obtener los pedidos.");
  }

  return await response.json();
}

export async function getPedidosRestaurante(idRestaurante) {
  const response = await fetch(`${API_URL}/restaurante/${idRestaurante}`);

  if (!response.ok) {
    throw new Error("Error al obtener los pedidos.");
  }

  return await response.json();
}

export async function cambiarEstadoPedido(idPedido, estado) {
  const response = await fetch(`${API_URL}/${idPedido}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ estado })
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el estado del pedido.");
  }

  return await response.json();
}