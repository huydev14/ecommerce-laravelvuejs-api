import { createRouter, createWebHistory } from "vue-router";

// Import components
import Login from "@/Pages/Login.vue";
import Register from "@/Pages/Register.vue";
import TestJWT from "@/Pages/TestJWT.vue";

import Categories from "@/Pages/Categories/index.vue";
import Brands from "@/Pages/Brands/index.vue";
import Products from "@/Pages/Products/index.vue";
import MainLayout from "@/Layouts/MainLayout.vue";
import AuthLayout from "@/Layouts/AuthLayout.vue";
import HomePage from "@/Pages/HomePage.vue";

const routes = [
    {
        path: "/",
        component: MainLayout,
        children: [
            {
                path: "",
                name: "home",
                component: HomePage,
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
        ],
    },

    {
        path: "/",
        component: AuthLayout,
        children: [
            {
                path: "login",
                name: "login",
                component: Login,
                meta: { guest: true },
            },
            {
                path: "register",
                name: "register",
                component: Register,
                meta: { guest: true },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem("token");

    // Nếu route cần guest nhưng user đã login -> về Home
    if (to.meta.guest && isLoggedIn) {
        return next("/");
    }

    // Nếu route cần login nhưng chưa login -> chuyển đến login
    if (to.meta.requiresAuth && !isLoggedIn) {
        return next("/auth/login");
    }

    next();
});

export default router;
