import { createRouter, createWebHistory } from "vue-router";

import ClientLayout from "../layouts/ClientLayout.vue";
import RestaurantLayout from "../layouts/RestaurantLayout.vue";

import MyOrdersView from "../views/client/MyOrdersView.vue";
import RestaurantOrdersView from "../views/restaurant/RestaurantOrdersView.vue";

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
          redirect: "/restaurante/pedidos"
        },
        {
          path: "pedidos",
          name: "restaurant-orders",
          component: RestaurantOrdersView,
          meta: {
            title: "Pedidos"
          }
        }
      ]
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/cliente/mis-pedidos"
    }
  ]
});

export default router;