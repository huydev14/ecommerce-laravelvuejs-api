import { createRouter, createWebHistory } from "vue-router";

// Import components
import Login from "@/Pages/Login.vue";
import Register from "@/Pages/Register.vue";
import TestJWT from "@/Pages/TestJWT.vue";

import Categories from "@/Components/Categories/index.vue";
import Brands from "@/Components/Brands/index.vue";
import Products from "@/Components/Products/index.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: Products,
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
    {
        path: "/test-jwt",
        name: "test-jwt",
        component: TestJWT,
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
