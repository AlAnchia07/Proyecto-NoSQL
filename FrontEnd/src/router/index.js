import {
  createRouter,
  createWebHistory
} from "vue-router";

import ClientLayout from "../layouts/ClientLayout.vue";
import RestaurantLayout from "../layouts/RestaurantLayout.vue";

import HomeView from "../views/client/home/HomeView.vue";
import MyOrdersView from "../views/client/orders/MyOrdersView.vue";
import RestaurantDetailView from "../views/client/restaurants/RestaurantDetailView.vue";
import CheckoutView from "../views/client/checkout/CheckoutView.vue";

import RestaurantOrdersView from "../views/restaurant/RestaurantOrdersView.vue";
import RestaurantProductsView from "../views/restaurant/RestaurantProductsView.vue";
import RestaurantEditView from "../views/restaurant/RestaurantEditView.vue";
import RestaurantListView from "../views/restaurant/RestaurantListView.vue";
import AdminProfileView from "../views/restaurant/AdminProfileView.vue";
import AdminGestionView from "../views/restaurant/AdminGestionView.vue";

import NotificationsList from "@/components/notifications/NotificationsList.vue";
import RestaurantReviewsView from "@/views/restaurant/RestaurantReviewsView.vue";

import LoginView from "../views/client/auth/LoginView.vue";
import RegisterView from "../views/client/auth/RegisterView.vue";
import FavoritesClient from "@/views/client/favorites/FavoritesClient.vue";
import ClienteProfileView from "@/views/client/user/ClienteProfileView.vue";

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes: [
    {
      path: "/",
      redirect: "/login"
    },

    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        publica: true
      }
    },

    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: {
        publica: true
      }
    },

    {
      path: "/cliente",
      component: ClientLayout,
      meta: {
        requiereAuth: true,
        roles: ["CLIENTE"]
      },
      children: [
        {
          path: "",
          name: "client-home",
          component: HomeView
        },

        {
          path: "restaurante/:id",
          name: "client-restaurant-detail",
          component: RestaurantDetailView
        },

        {
          path: "checkout",
          name: "client-checkout",
          component: CheckoutView
        },

        {
          path: "mis-pedidos",
          name: "client-orders",
          component: MyOrdersView
        },

        {
          path: "notificaciones",
          name: "cliente-notificaciones",
          component: NotificationsList
        },

        {
          path: "favoritos",
          name: "favoritos",
          component: FavoritesClient
        },

        {
          path: "perfil",
          name: "client-profile",
          component: ClienteProfileView
        }
      ]
    },

    {
      path: "/restaurante",
      component: RestaurantLayout,
      meta: {
        requiereAuth: true,
        roles: [
          "RESTAURANTE",
          "EMPLEADO"
        ]
      },

      children: [
        {
          path: "",
          redirect: "/restaurante/productos"
        },

        {
          path: "restaurantes",
          name: "restaurant-list",
          component: RestaurantListView,
          meta: {
            roles: ["RESTAURANTE"]
          }
        },

        {
          path: "restaurantes/:id/editar",
          name: "restaurant-edit",
          component: RestaurantEditView,
          meta: {
            roles: ["RESTAURANTE"]
          }
        },

        {
          path: "productos",
          name: "restaurant-products",
          component: RestaurantProductsView
        },

        {
          path: "pedidos",
          name: "restaurant-orders",
          component: RestaurantOrdersView
        },

        {
          path: "perfil",
          name: "admin-profile",
          component: AdminProfileView
        },

        {
          path: "usuarios",
          name: "admin-gestion-usuarios",
          component: AdminGestionView,
          meta: {
            roles: ["RESTAURANTE"]
          }
        },

        {
          path: "notificaciones",
          name: "notificaciones",
          component: NotificationsList
        },

        {
          path: "reviews",
          name: "reviews",
          component: RestaurantReviewsView
        }
      ]
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/login"
    }
  ]
});

function obtenerUsuarioSesion() {
  try {
    const sesionGuardada =
      localStorage.getItem("usuario");

    if (!sesionGuardada) {
      return null;
    }

    const sesion =
      JSON.parse(sesionGuardada);

    return sesion?.usuario || null;
  } catch (error) {
    console.error(
      "Error al recuperar la sesión:",
      error
    );

    return null;
  }
}

router.beforeEach((to) => {
  const usuario =
    obtenerUsuarioSesion();

  const requiereAuth =
    to.matched.some(
      (route) =>
        route.meta.requiereAuth
    );

  const esRutaPublica =
    to.matched.some(
      (route) =>
        route.meta.publica
    );

  const rutasConRoles =
    to.matched.filter(
      (route) =>
        route.meta.roles
    );

  const rolesPermitidos =
    rutasConRoles.length > 0
      ? rutasConRoles[
          rutasConRoles.length - 1
        ].meta.roles
      : null;

  // Sin sesión
  if (
    requiereAuth &&
    !usuario
  ) {
    return {
      name: "login"
    };
  }

  // Ya tiene sesión e intenta ir a login/register
  if (
    esRutaPublica &&
    usuario
  ) {
    if (
      usuario.rol === "CLIENTE"
    ) {
      return {
        name: "client-home"
      };
    }

    if (
      usuario.rol === "RESTAURANTE"
    ) {
      return {
        name: "restaurant-list"
      };
    }

    if (
      usuario.rol === "EMPLEADO"
    ) {
      return {
        name: "restaurant-products"
      };
    }
  }

  // Protección según rol
  if (
    requiereAuth &&
    rolesPermitidos &&
    !rolesPermitidos.includes(
      usuario?.rol
    )
  ) {
    if (
      usuario?.rol === "CLIENTE"
    ) {
      return {
        name: "client-home"
      };
    }

    if (
      usuario?.rol === "RESTAURANTE"
    ) {
      return {
        name: "restaurant-list"
      };
    }

    if (
      usuario?.rol === "EMPLEADO"
    ) {
      return {
        name: "restaurant-products"
      };
    }

    return {
      name: "login"
    };
  }

  return true;
});

export default router;