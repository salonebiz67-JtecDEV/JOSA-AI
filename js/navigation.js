/* =========================================
   JOSA AI — NAVIGATION CONTROLLER
========================================= */

"use strict";


/* =========================================
   SELECT NAVIGATION ITEMS
========================================= */

const navigationItems = document.querySelectorAll(
    ".nav-item"
);


/* =========================================
   DETECT CURRENT PAGE
========================================= */

function getCurrentPage() {
    const path = window.location.pathname;

    if (path.includes("chat.html")) {
        return "chat";
    }

    if (path.includes("live.html")) {
        return "live";
    }

    if (path.includes("profile.html")) {
        return "profile";
    }

    if (path.includes("about.html")) {
        return "about";
    }

    return "home";
}


/* =========================================
   UPDATE ACTIVE NAVIGATION
========================================= */

function updateActiveNavigation() {
    const currentPage = getCurrentPage();

    navigationItems.forEach((item) => {
        const page = item.dataset.page;

        item.classList.toggle(
            "active",
            page === currentPage
        );

        if (page === currentPage) {
            item.setAttribute(
                "aria-current",
                "page"
            );
        } else {
            item.removeAttribute("aria-current");
        }
    });
}


/* =========================================
   NAVIGATION CLICK EFFECT
========================================= */

navigationItems.forEach((item) => {
    item.addEventListener("click", () => {
        navigationItems.forEach((nav) => {
            nav.classList.remove("active");
            nav.removeAttribute("aria-current");
        });

        item.classList.add("active");
        item.setAttribute("aria-current", "page");
    });
});


/* =========================================
   PAGE TRANSITION
========================================= */

function navigateToPage(url) {
    if (!url) {
        return;
    }

    document.body.classList.add("page-exiting");

    setTimeout(() => {
        window.location.href = url;
    }, 150);
}


/* =========================================
   ACCESSIBLE KEYBOARD SUPPORT
========================================= */

navigationItems.forEach((item) => {
    item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            item.click();
        }
    });
});


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    updateActiveNavigation();

    console.log(
        "JOSA AI navigation initialized."
    );
});
