<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { useCartStore } from "../../../stores/cartStore";
import { useUsuarioStore } from "../../../stores/UsuarioStore";

import { crearPedido } from "../../../services/pedidoService";

import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  Smartphone,
  ShoppingBag
} from "lucide-vue-next";

const router = useRouter();

const cartStore = useCartStore();
const usuarioStore = useUsuarioStore();

const metodoEntrega = ref("Retiro en el local");
const metodoPago = ref("Tarjeta");

const procesandoPago = ref(false);
const mensajeError = ref("");
const mostrarConfirmacion = ref(false);

const datosTarjeta = reactive({
  nombre: "",
  numero: "",
  vencimiento: "",
  cvv: ""
});

const datosSinpe = reactive({
  telefono: "",
  referencia: ""
});

const restaurante = computed(() => cartStore.restaurante);
const productos = computed(() => cartStore.productos);
const subtotal = computed(() => cartStore.subtotal);

const costoEntrega = computed(() => {
  return metodoEntrega.value === "Express" ? 1500 : 0;
});

const total = computed(() => {
  return subtotal.value + costoEntrega.value;
});

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);

const aumentarCantidad = (producto) => {
  cartStore.aumentarCantidad(producto);
};

const disminuirCantidad = (producto) => {
  cartStore.disminuirCantidad(producto);
};

const validarTarjeta = () => {
  const numeroLimpio =
    datosTarjeta.numero.replace(/\s/g, "");

  if (!datosTarjeta.nombre.trim()) {
    return "Ingresa el nombre del titular.";
  }

  if (!/^\d{16}$/.test(numeroLimpio)) {
    return "El número de tarjeta debe contener 16 dígitos.";
  }

  if (!/^\d{2}\/\d{2}$/.test(datosTarjeta.vencimiento)) {
    return "La fecha de vencimiento debe tener el formato MM/AA.";
  }

  if (!/^\d{3,4}$/.test(datosTarjeta.cvv)) {
    return "El código de seguridad debe contener 3 o 4 dígitos.";
  }

  return "";
};

const validarSinpe = () => {
  const telefonoLimpio =
    datosSinpe.telefono.replace(/\D/g, "");

  if (!/^\d{8}$/.test(telefonoLimpio)) {
    return "El número de SINPE debe contener 8 dígitos.";
  }

  return "";
};

const validarCheckout = () => {
  if (productos.value.length === 0) {
    return "El carrito está vacío.";
  }

  if (!metodoEntrega.value) {
    return "Selecciona un método de entrega.";
  }

  if (!metodoPago.value) {
    return "Selecciona un método de pago.";
  }

  if (metodoPago.value === "Tarjeta") {
    return validarTarjeta();
  }

  if (metodoPago.value === "SINPE") {
    return validarSinpe();
  }

  return "";
};

const confirmarPago = async () => {
  mensajeError.value = validarCheckout();

  if (mensajeError.value) {
    return;
  }

  try {
    procesandoPago.value = true;
    mensajeError.value = "";

    if (!usuarioStore.usuario) {
      throw new Error(
        "Debes iniciar sesión para realizar un pedido."
      );
    }

    if (usuarioStore.usuario.rol !== "CLIENTE") {
      throw new Error(
        "Solo una cuenta de cliente puede realizar pedidos."
      );
    }

    const idCliente =
      usuarioStore.perfil?._id;

    if (!idCliente) {
      throw new Error(
        "No se encontró el perfil de cliente asociado a tu cuenta."
      );
    }

    if (!restaurante.value?._id) {
      throw new Error(
        "No se pudo identificar el restaurante del pedido."
      );
    }

    const datosPedido = {
      id_cliente: idCliente,

      id_restaurante:
        restaurante.value._id,

      productos_comprados:
        productos.value.map(
          (producto) => ({
            id_producto: producto._id,
            nombre: producto.nombre,
            cantidad: producto.quantity,
            precio_unitario: Number(
              producto.precio_descuento
            )
          })
        ),

      descuento: 0,

      tipo_entrega:
        metodoEntrega.value === "Express"
          ? "EXPRESS"
          : "RETIRO_EN_LOCAL",

      metodo_pago:
        metodoPago.value === "Tarjeta"
          ? "TARJETA"
          : metodoPago.value === "SINPE"
            ? "SINPE"
            : "EFECTIVO"
    };

    const pedidoCreado =
      await crearPedido(datosPedido);

    console.log(
      "Pedido creado correctamente:",
      pedidoCreado
    );

    mostrarConfirmacion.value = true;
  } catch (error) {
    console.error(
      "Error al confirmar el pedido:",
      error
    );

    mensajeError.value =
      error.message ||
      "No se pudo procesar el pedido. Inténtalo nuevamente.";
  } finally {
    procesandoPago.value = false;
  }
};

const finalizarPedido = () => {
  cartStore.limpiarCarrito();
  mostrarConfirmacion.value = false;

  router.push(
    "/cliente/mis-pedidos"
  );
};

const volverAlRestaurante = () => {
  if (restaurante.value?._id) {
    router.push(
      `/cliente/restaurante/${restaurante.value._id}`
    );

    return;
  }

  router.push("/cliente");
};
</script>

<template>
  <section class="checkout-view">
    <button
      class="back-button"
      type="button"
      @click="volverAlRestaurante"
    >
      <ArrowLeft />
      Volver al restaurante
    </button>

    <div
      v-if="productos.length === 0"
      class="empty-checkout"
    >
      <ShoppingBag />

      <h1>Tu carrito está vacío</h1>

      <p>
        Agrega algunos productos antes de continuar con el pago.
      </p>

      <button
        type="button"
        @click="router.push('/cliente')"
      >
        Explorar restaurantes
      </button>
    </div>

    <template v-else>
      <header class="checkout-header">
        <div>
          <p>Último paso</p>

          <h1>Finalizar compra</h1>

          <span>
            Revisa tu pedido y selecciona cómo deseas pagar.
          </span>
        </div>

        <div class="secure-payment">
          <CheckCircle2 />
          Pago seguro
        </div>
      </header>

      <div class="checkout-layout">
        <main class="checkout-content">
          <section class="checkout-card">
            <div class="section-heading">
              <div class="section-heading__icon">
                <MapPin />
              </div>

              <div>
                <h2>Método de entrega</h2>

                <p>
                  Selecciona cómo deseas recibir tu pedido.
                </p>
              </div>
            </div>

            <div class="option-grid">
              <label
                class="selection-option"
                :class="{
                  'selection-option--active':
                    metodoEntrega ===
                    'Retiro en el local'
                }"
              >
                <input
                  v-model="metodoEntrega"
                  type="radio"
                  value="Retiro en el local"
                />

                <Building2 />

                <div>
                  <strong>
                    Retiro en el local
                  </strong>

                  <span>
                    Recoge el pedido directamente en el restaurante.
                  </span>

                  <small>
                    Sin costo adicional
                  </small>
                </div>
              </label>

              <label
                class="selection-option"
                :class="{
                  'selection-option--active':
                    metodoEntrega ===
                    'Express'
                }"
              >
                <input
                  v-model="metodoEntrega"
                  type="radio"
                  value="Express"
                />

                <MapPin />

                <div>
                  <strong>
                    Entrega express
                  </strong>

                  <span>
                    Recibe el pedido en la dirección registrada.
                  </span>

                  <small>
                    {{ formatCurrency(1500) }}
                  </small>
                </div>
              </label>
            </div>
          </section>

          <section class="checkout-card">
            <div class="section-heading">
              <div class="section-heading__icon">
                <CreditCard />
              </div>

              <div>
                <h2>Método de pago</h2>

                <p>
                  Selecciona una opción para completar la compra.
                </p>
              </div>
            </div>

            <div class="payment-options">
              <label
                class="payment-option"
                :class="{
                  'payment-option--active':
                    metodoPago === 'Tarjeta'
                }"
              >
                <input
                  v-model="metodoPago"
                  type="radio"
                  value="Tarjeta"
                />

                <CreditCard />
                <span>Tarjeta</span>
              </label>

              <label
                class="payment-option"
                :class="{
                  'payment-option--active':
                    metodoPago === 'SINPE'
                }"
              >
                <input
                  v-model="metodoPago"
                  type="radio"
                  value="SINPE"
                />

                <Smartphone />
                <span>SINPE</span>
              </label>

              <label
                class="payment-option"
                :class="{
                  'payment-option--active':
                    metodoPago === 'Efectivo'
                }"
              >
                <input
                  v-model="metodoPago"
                  type="radio"
                  value="Efectivo"
                />

                <Banknote />
                <span>Efectivo</span>
              </label>
            </div>

            <div
              v-if="metodoPago === 'Tarjeta'"
              class="payment-form"
            >
              <div
                class="form-field form-field--full"
              >
                <label for="cardName">
                  Nombre del titular
                </label>

                <input
                  id="cardName"
                  v-model="datosTarjeta.nombre"
                  type="text"
                  placeholder="Nombre como aparece en la tarjeta"
                />
              </div>

              <div
                class="form-field form-field--full"
              >
                <label for="cardNumber">
                  Número de tarjeta
                </label>

                <input
                  id="cardNumber"
                  v-model="datosTarjeta.numero"
                  type="text"
                  inputmode="numeric"
                  maxlength="19"
                  placeholder="0000 0000 0000 0000"
                />
              </div>

              <div class="form-field">
                <label for="cardExpiration">
                  Vencimiento
                </label>

                <input
                  id="cardExpiration"
                  v-model="datosTarjeta.vencimiento"
                  type="text"
                  maxlength="5"
                  placeholder="MM/AA"
                />
              </div>

              <div class="form-field">
                <label for="cardCvv">
                  CVV
                </label>

                <input
                  id="cardCvv"
                  v-model="datosTarjeta.cvv"
                  type="password"
                  inputmode="numeric"
                  maxlength="4"
                  placeholder="123"
                />
              </div>
            </div>

            <div
              v-else-if="metodoPago === 'SINPE'"
              class="payment-form"
            >
              <div class="form-field">
                <label for="sinpePhone">
                  Número telefónico
                </label>

                <input
                  id="sinpePhone"
                  v-model="datosSinpe.telefono"
                  type="text"
                  inputmode="numeric"
                  maxlength="8"
                  placeholder="88888888"
                />
              </div>

              <div class="form-field">
                <label for="sinpeReference">
                  Referencia
                  <span>(opcional)</span>
                </label>

                <input
                  id="sinpeReference"
                  v-model="datosSinpe.referencia"
                  type="text"
                  placeholder="Número de comprobante"
                />
              </div>
            </div>

            <div
              v-else
              class="cash-message"
            >
              <Banknote />

              <div>
                <strong>
                  Pago al retirar o recibir
                </strong>

                <p>
                  El pago se realizará en efectivo cuando recibas tu pedido.
                </p>
              </div>
            </div>
          </section>
        </main>

        <aside class="order-summary">
          <div
            class="order-summary__restaurant"
          >
            <img
              :src="
                restaurante?.url_imagen ||
                'https://placehold.co/160x160?text=BiteUp'
              "
              :alt="
                restaurante?.nombre ||
                'Restaurante'
              "
            />

            <div>
              <p>Pedido de</p>

              <h2>
                {{ restaurante?.nombre }}
              </h2>

              <span>
                {{ restaurante?.direccion }}
              </span>
            </div>
          </div>

          <div
            class="order-summary__products"
          >
            <article
              v-for="producto in productos"
              :key="producto._id"
              class="summary-product"
            >
              <img
                :src="
                  producto.url_imagen ||
                  'https://placehold.co/100x100?text=Producto'
                "
                :alt="producto.nombre"
              />

              <div
                class="summary-product__info"
              >
                <h3>
                  {{ producto.nombre }}
                </h3>

                <span>
                  {{
                    formatCurrency(
                      producto.precio_descuento
                    )
                  }}
                </span>

                <div
                  class="quantity-control"
                >
                  <button
                    type="button"
                    aria-label="Disminuir cantidad"
                    @click="
                      disminuirCantidad(
                        producto
                      )
                    "
                  >
                    <Minus />
                  </button>

                  <strong>
                    {{ producto.quantity }}
                  </strong>

                  <button
                    type="button"
                    aria-label="Aumentar cantidad"
                    :disabled="
                      producto.quantity >=
                      producto.cantidad_disponible
                    "
                    @click="
                      aumentarCantidad(
                        producto
                      )
                    "
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              <strong
                class="summary-product__total"
              >
                {{
                  formatCurrency(
                    producto.precio_descuento *
                    producto.quantity
                  )
                }}
              </strong>
            </article>
          </div>

          <div
            class="order-summary__totals"
          >
            <div>
              <span>Subtotal</span>

              <strong>
                {{ formatCurrency(subtotal) }}
              </strong>
            </div>

            <div>
              <span>Entrega</span>

              <strong>
                {{
                  costoEntrega === 0
                    ? "Gratis"
                    : formatCurrency(
                        costoEntrega
                      )
                }}
              </strong>
            </div>

            <div
              class="order-summary__total"
            >
              <span>Total</span>

              <strong>
                {{ formatCurrency(total) }}
              </strong>
            </div>
          </div>

          <p
            v-if="mensajeError"
            class="error-message"
          >
            {{ mensajeError }}
          </p>

          <button
            class="pay-button"
            type="button"
            :disabled="procesandoPago"
            @click="confirmarPago"
          >
            {{
              procesandoPago
                ? "Procesando..."
                : `Confirmar pago · ${formatCurrency(total)}`
            }}
          </button>

          <small
            class="simulation-message"
          >
            El pago es simulado para fines académicos.
          </small>
        </aside>
      </div>
    </template>

    <div
      v-if="mostrarConfirmacion"
      class="modal-overlay"
    >
      <div
        class="confirmation-modal"
      >
        <div
          class="confirmation-modal__icon"
        >
          <CheckCircle2 />
        </div>

        <p>Pago confirmado</p>

        <h2>
          ¡Tu pedido fue realizado!
        </h2>

        <span>
          El restaurante recibió tu solicitud y pronto comenzará a prepararla.
        </span>

        <div
          class="confirmation-modal__summary"
        >
          <div>
            <span>Restaurante</span>

            <strong>
              {{ restaurante?.nombre }}
            </strong>
          </div>

          <div>
            <span>Total</span>

            <strong>
              {{ formatCurrency(total) }}
            </strong>
          </div>

          <div>
            <span>Pago</span>

            <strong>
              {{ metodoPago }}
            </strong>
          </div>
        </div>

        <button
          type="button"
          @click="finalizarPedido"
        >
          Ver mis pedidos
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.checkout-view {
  width: min(1400px, 100%);
  margin: 0 auto;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
  padding: 0;
  border: none;
  background: transparent;
  color: #183153;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.back-button svg {
  width: 18px;
  height: 18px;
}

.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 28px;
}

.checkout-header p {
  margin: 0 0 5px;
  color: #208b3a;
  font-size: 14px;
  font-weight: 700;
}

.checkout-header h1 {
  margin: 0;
  color: #092650;
  font-size: 34px;
}

.checkout-header span {
  display: block;
  margin-top: 7px;
  color: #697386;
}

.secure-payment {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 15px;
  border-radius: 30px;
  background: #eaf7ed;
  color: #208b3a;
  font-size: 14px;
  font-weight: 700;
}

.secure-payment svg {
  width: 18px;
  height: 18px;
}

.checkout-layout {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    390px;
  gap: 26px;
  align-items: start;
}

.checkout-content {
  display: grid;
  gap: 22px;
}

.checkout-card,
.order-summary {
  border: 1px solid #e0e6e2;
  border-radius: 18px;
  background: #fff;
  box-shadow:
    0 10px 28px
    rgba(16, 24, 40, 0.06);
}

.checkout-card {
  padding: 25px;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-bottom: 22px;
}

.section-heading__icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 12px;
  background: #eaf7ed;
  color: #208b3a;
}

.section-heading__icon svg {
  width: 21px;
  height: 21px;
}

.section-heading h2 {
  margin: 0;
  color: #102a43;
  font-size: 21px;
}

.section-heading p {
  margin: 5px 0 0;
  color: #697386;
  font-size: 14px;
}

.option-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 15px;
}

.selection-option {
  position: relative;
  display: grid;
  grid-template-columns:
    28px minmax(0, 1fr);
  gap: 13px;
  padding: 18px;
  border: 1px solid #dfe5e1;
  border-radius: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.selection-option > input {
  position: absolute;
  opacity: 0;
}

.selection-option > svg {
  width: 25px;
  height: 25px;
  color: #697386;
}

.selection-option strong,
.selection-option span,
.selection-option small {
  display: block;
}

.selection-option strong {
  color: #102a43;
}

.selection-option span {
  margin-top: 5px;
  color: #697386;
  font-size: 13px;
  line-height: 1.45;
}

.selection-option small {
  margin-top: 10px;
  color: #208b3a;
  font-weight: 700;
}

.selection-option--active {
  border-color: #208b3a;
  background: #f3fbf5;
  box-shadow:
    0 0 0 1px #208b3a;
}

.selection-option--active > svg {
  color: #208b3a;
}

.payment-options {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 12px;
}

.payment-option {
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid #dfe5e1;
  border-radius: 13px;
  color: #526173;
  font-weight: 700;
  cursor: pointer;
}

.payment-option input {
  position: absolute;
  opacity: 0;
}

.payment-option svg {
  width: 21px;
  height: 21px;
}

.payment-option--active {
  border-color: #208b3a;
  background: #f3fbf5;
  color: #208b3a;
  box-shadow:
    0 0 0 1px #208b3a;
}

.payment-form {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 16px;
  margin-top: 22px;
  padding-top: 22px;
  border-top: 1px solid #e6ebe8;
}

.form-field {
  display: grid;
  gap: 7px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field label {
  color: #344054;
  font-size: 13px;
  font-weight: 700;
}

.form-field label span {
  color: #8993a1;
  font-weight: 400;
}

.form-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 13px;
  border: 1px solid #d5ddd8;
  border-radius: 9px;
  outline: none;
  font: inherit;
}

.form-field input:focus {
  border-color: #208b3a;
  box-shadow:
    0 0 0 3px
    rgba(32, 139, 58, 0.1);
}

.cash-message {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-top: 22px;
  padding: 18px;
  border-radius: 13px;
  background: #f5f8f6;
}

.cash-message svg {
  width: 24px;
  height: 24px;
  color: #208b3a;
}

.cash-message strong {
  color: #102a43;
}

.cash-message p {
  margin: 5px 0 0;
  color: #697386;
  font-size: 14px;
}

.order-summary {
  position: sticky;
  top: 100px;
  padding: 22px;
}

.order-summary__restaurant {
  display: flex;
  align-items: center;
  gap: 13px;
  padding-bottom: 18px;
  border-bottom: 1px solid #e4e9e6;
}

.order-summary__restaurant img {
  width: 65px;
  height: 65px;
  border-radius: 12px;
  object-fit: cover;
}

.order-summary__restaurant p {
  margin: 0 0 3px;
  color: #697386;
  font-size: 12px;
}

.order-summary__restaurant h2 {
  margin: 0;
  color: #102a43;
  font-size: 18px;
}

.order-summary__restaurant span {
  display: block;
  margin-top: 4px;
  color: #7b8492;
  font-size: 12px;
}

.order-summary__products {
  display: grid;
  gap: 16px;
  max-height: 360px;
  margin: 20px 0;
  overflow-y: auto;
}

.summary-product {
  display: grid;
  grid-template-columns:
    55px
    minmax(0, 1fr)
    auto;
  gap: 11px;
  align-items: start;
}

.summary-product > img {
  width: 55px;
  height: 55px;
  border-radius: 9px;
  object-fit: cover;
}

.summary-product__info h3 {
  margin: 0;
  color: #102a43;
  font-size: 14px;
}

.summary-product__info > span {
  display: block;
  margin-top: 3px;
  color: #697386;
  font-size: 12px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 9px;
}

.quantity-control button {
  display: grid;
  width: 25px;
  height: 25px;
  padding: 0;
  place-items: center;
  border: 1px solid #d8dfdb;
  border-radius: 7px;
  background: #fff;
  cursor: pointer;
}

.quantity-control button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.quantity-control svg {
  width: 13px;
  height: 13px;
}

.quantity-control strong {
  min-width: 16px;
  text-align: center;
}

.summary-product__total {
  color: #102a43;
  font-size: 13px;
  white-space: nowrap;
}

.order-summary__totals {
  display: grid;
  gap: 13px;
  padding-top: 18px;
  border-top: 1px solid #e4e9e6;
}

.order-summary__totals > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  color: #697386;
  font-size: 14px;
}

.order-summary__totals strong {
  color: #102a43;
}

.order-summary__total {
  margin-top: 2px;
  padding-top: 15px;
  border-top: 1px solid #e4e9e6;
  font-size: 17px !important;
  font-weight: 700;
}

.order-summary__total strong {
  color: #208b3a;
  font-size: 20px;
}

.error-message {
  margin: 16px 0 0;
  padding: 11px 12px;
  border-radius: 8px;
  background: #fff1f0;
  color: #b42318;
  font-size: 13px;
}

.pay-button,
.empty-checkout button,
.confirmation-modal button {
  width: 100%;
  padding: 13px 16px;
  border: none;
  border-radius: 10px;
  background: #208b3a;
  color: #fff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.pay-button {
  margin-top: 19px;
}

.pay-button:disabled {
  background: #91b69a;
  cursor: wait;
}

.simulation-message {
  display: block;
  margin-top: 11px;
  color: #8b95a2;
  font-size: 11px;
  text-align: center;
}

.empty-checkout {
  display: grid;
  min-height: 520px;
  place-items: center;
  align-content: center;
  text-align: center;
}

.empty-checkout > svg {
  width: 55px;
  height: 55px;
  color: #208b3a;
}

.empty-checkout h1 {
  margin: 16px 0 7px;
  color: #102a43;
}

.empty-checkout p {
  margin: 0 0 21px;
  color: #697386;
}

.empty-checkout button {
  width: auto;
}

.modal-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  padding: 20px;
  place-items: center;
  background:
    rgba(10, 24, 38, 0.6);
}

.confirmation-modal {
  width: min(440px, 100%);
  box-sizing: border-box;
  padding: 31px;
  border-radius: 20px;
  background: #fff;
  box-shadow:
    0 25px 65px
    rgba(0, 0, 0, 0.2);
  text-align: center;
}

.confirmation-modal__icon {
  display: grid;
  width: 68px;
  height: 68px;
  margin: 0 auto 15px;
  place-items: center;
  border-radius: 50%;
  background: #eaf7ed;
  color: #208b3a;
}

.confirmation-modal__icon svg {
  width: 36px;
  height: 36px;
}

.confirmation-modal > p {
  margin: 0 0 4px;
  color: #208b3a;
  font-size: 13px;
  font-weight: 800;
}

.confirmation-modal h2 {
  margin: 0;
  color: #102a43;
}

.confirmation-modal > span {
  display: block;
  margin: 10px 0 21px;
  color: #697386;
  font-size: 14px;
  line-height: 1.5;
}

.confirmation-modal__summary {
  display: grid;
  gap: 11px;
  margin-bottom: 22px;
  padding: 16px;
  border-radius: 12px;
  background: #f6f8f7;
}

.confirmation-modal__summary > div {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  font-size: 13px;
}

.confirmation-modal__summary span {
  color: #697386;
}

.confirmation-modal__summary strong {
  color: #102a43;
  text-align: right;
}

@media (max-width: 1050px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 700px) {
  .checkout-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .checkout-header h1 {
    font-size: 28px;
  }

  .option-grid,
  .payment-options,
  .payment-form {
    grid-template-columns: 1fr;
  }

  .form-field--full {
    grid-column: auto;
  }

  .checkout-card,
  .order-summary {
    padding: 18px;
  }

  .summary-product {
    grid-template-columns:
      50px
      minmax(0, 1fr);
  }

  .summary-product__total {
    grid-column: 2;
  }
}
</style>