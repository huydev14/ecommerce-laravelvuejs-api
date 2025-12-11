import { createRouter, createWebHistory } from "vue-router";

// Import components
import Welcome from "@/Pages/Welcome.vue";
import Dashboard from "@/Pages/Dashboard.vue";
import Login from "@/Pages/Auth/Login.vue";
import Register from "@/Pages/Auth/Register.vue";
import Profile from "@/Pages/Profile/Edit.vue";

import Categories from "@/Components/Categories/index.vue";
import Brands from "@/Components/Brands/index.vue";
import Products from "@/Components/Products/index.vue";

const routes = [
    {
        path: "/",
        name: "welcome",
        component: Welcome,
    },
    {
        path: "/login",
        name: "login",
        component: Login,
        meta: { guest: true },
    },
    {
        path: "/register",
        name: "register",
        component: Register,
        meta: { guest: true },
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: { requiresAuth: true },
    },
    {
        path: "/profile",
        name: "profile.edit",
        component: Profile,
        meta: { requiresAuth: true },
    },

    {
        path: "/categories",
        component: Categories,
    },

    {
        path: "/brands",
        component: Brands,
    },

    {
        path: "/products",
        component: Products,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard cho authentication
// router.beforeEach((to, from, next) => {
//     const isAuthenticated = !!localStorage.getItem("auth_token"); // Hoặc check từ store

//     if (to.meta.requiresAuth && !isAuthenticated) {
//         next({ name: "login" });
//     } else if (to.meta.guest && isAuthenticated) {
//         next({ name: "dashboard" });
//     } else {
//         next();
//     }
// });

export default router;
