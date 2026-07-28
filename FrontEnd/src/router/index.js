import { createRouter, createWebHistory } from "vue-router";

import ClientLayout from "../layouts/ClientLayout.vue";
import RestaurantLayout from "../layouts/RestaurantLayout.vue";

import MyOrdersView from "../views/client/MyOrdersView.vue";
import RestaurantOrdersView from "../views/restaurant/RestaurantOrdersView.vue";
import NotificacionesView from "../views/NotificacionesView.vue";
import RestaurantProductsView from "../views/restaurant/RestaurantProductsView.vue";
import RestaurantEditView from "../views/restaurant/RestaurantEditView.vue";
import RestaurantListView from "../views/restaurant/RestaurantListView.vue";
import AdminProfileView from "../views/restaurant/AdminProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      redirect: "/cliente/mis-pedidos"
    },

    {
      path: "/cliente",
      component: ClientLayout,
      children: [
        {
          path: "",
          redirect: "/cliente/mis-pedidos"
        },
        {
          path: "mis-pedidos",
          name: "client-orders",
          component: MyOrdersView
        }
      ]
    },

    {
      path: "/restaurante",
      component: RestaurantLayout,
      children: [
        {
          path: "",
          redirect: "/restaurante/restaurantes"
        },
        {
          path: "restaurantes",
          name: "restaurant-list",
          component: RestaurantListView
        },
        {
          path: "restaurantes/:id/editar",
          name: "restaurant-edit",
          component: RestaurantEditView
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
        }
      ]
    },

    {
      path: "/notificaciones",
      name: "notificaciones",
      component: NotificacionesView
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/cliente/mis-pedidos"
    }
  ]
});

export default router;