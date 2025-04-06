// Ensure all scripts run after the page has loaded
window.addEventListener("load", function () {
    
    /** =========================
     *  🍪 COOKIE CONSENT SETUP
     *  ========================= */
    window.cookieconsent.initialise({
        palette: {
            popup: { background: "#2c7c2c" },
            button: { background: "#ffffff", text: "#2c7c2c" }
        },
        theme: "classic",
        position: "bottom",
        type: "opt-in", // Blocks cookies until user consents
        content: {
            message: "We use cookies to improve your experience and analyze site traffic. By clicking 'Accept', you consent to our use of cookies.",
            dismiss: "Reject",
            allow: "Accept",
            link: "Privacy Policy",
            href: "/legal/cookie-policy.html"
        },
        onInitialise: function (status) {
            if (status === cookieconsent.status.allow) {
                enableCookies();
            }
        },
        onStatusChange: function (status) {
            if (status === cookieconsent.status.allow) {
                enableCookies();
            } else {
                disableCookies();
            }
        }
    });

    /** =========================
     *  ✅ ENABLE COOKIES & LOAD GOOGLE ANALYTICS
     *  ========================= */
    function enableCookies() {
        document.cookie = "cookiesAccepted=true; path=/; max-age=31536000"; // 1-year validity
        loadAnalytics();
    }

    /** =========================
     *  ❌ DISABLE COOKIES & REMOVE TRACKING
     *  ========================= */
    function disableCookies() {
        document.cookie = "cookiesAccepted=false; path=/; max-age=31536000";
        removeCookies();
    }

    /** =========================
     *  📊 LOAD GOOGLE ANALYTICS IF CONSENT GIVEN
     *  ========================= */
    function loadAnalytics() {
        if (getCookie("cookiesAccepted") === "true") {
            let script = document.createElement("script");
            script.src = "https://www.googletagmanager.com/gtag/js?id=G-PRBPH74YJ5"; // Replace with actual GA ID
            script.async = true;
            document.head.appendChild(script);

            script.onload = function () {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag("js", new Date());
                gtag("config", "G-PRBPH74YJ5"); // Replace with your actual GA ID
            };
        }
    }

    /** =========================
     *  🍪 HELPER FUNCTION TO READ COOKIES
     *  ========================= */
    function getCookie(name) {
        let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? match[2] : null;
    }

    /** =========================
     *  🗑 REMOVE UNWANTED TRACKING COOKIES
     *  ========================= */
    function removeCookies() {
        document.cookie.split(";").forEach(function (cookie) {
            document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
        });
    }

    /** =========================
     *  🔍 SEARCH FUNCTIONALITY
     *  ========================= */
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission
            const query = document.getElementById('search-input').value.toLowerCase();
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = ""; // Clear previous results

            // Sample recipes (can be replaced with dynamic fetching later)
            const recipes = [
                { name: "Moringa Smoothie", url: "/recipes/moringa-smoothie.html" },
                { name: "Moringa Soup", url: "/recipes/evergreen/basic-moringa-soup-recipe.html" },
                { name: "Moringa Pancakes", url: "/recipes/moringa-pancakes.html" }
            ];

            // Filter recipes based on search query
            const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(query));

            if (filteredRecipes.length > 0) {
                filteredRecipes.forEach(recipe => {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="${recipe.url}">${recipe.name}</a>`;
                    resultsContainer.appendChild(li);
                });
            } else {
                resultsContainer.innerHTML = "<li>No recipes found</li>";
            }
        });
    }

    // General console log for debugging
    console.log("Moringa Education Scripts Loaded");
});

// Handle YouTube video container functionality
document.addEventListener("DOMContentLoaded", function () {
    const videoContainers = document.querySelectorAll(".video-container");

    videoContainers.forEach(container => {
        const videoId = container.getAttribute("data-video-id");
        const thumbnail = container.querySelector(".video-thumbnail");

        // Set YouTube thumbnail
        thumbnail.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        container.addEventListener("click", function () {
            // Create and load the YouTube iframe dynamically
            const iframe = document.createElement("iframe");
            iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
            iframe.setAttribute("allowfullscreen", "true");
            iframe.style.width = "100%";
            iframe.style.height = "315px"; // Adjust as needed

            // Replace the thumbnail with the YouTube iframe
            container.innerHTML = "";
            container.appendChild(iframe);
        });
    });
});

(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '1410691');