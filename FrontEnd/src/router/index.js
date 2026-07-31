import { createRouter, createWebHistory } from "vue-router";

import ClientLayout from "../layouts/ClientLayout.vue";
import RestaurantLayout from "../layouts/RestaurantLayout.vue";

import HomeView from "../views/client/home/HomeView.vue";
import MyOrdersView from "../views/client/orders/MyOrdersView.vue";
import RestaurantDetailView from "../views/client/restaurants/RestaurantDetailView.vue";
import CheckoutView from "../views/client/checkout/CheckoutView.vue";

import RestaurantOrdersView from "../views/restaurant/RestaurantOrdersView.vue";
import NotificacionesView from "../views/NotificacionesView.vue";
import RestaurantProductsView from "../views/restaurant/RestaurantProductsView.vue";
import RestaurantEditView from "../views/restaurant/RestaurantEditView.vue";
import RestaurantListView from "../views/restaurant/RestaurantListView.vue";
import AdminProfileView from "../views/restaurant/AdminProfileView.vue";

import LoginView from "../views/client/auth/LoginView.vue";
import RegisterView from "../views/client/auth/RegisterView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      redirect: "/register"
    },
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },

    {
      path: "/cliente",
      component: ClientLayout,
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
      redirect: "/cliente"
    }
  ]
});

export default router;