// Ensure all scripts run after the page has loaded
// NOTE: Consider moving logic dependent only on DOM structure (like Cookie Consent, Video Player, Search, MailerLite Observer)
// into the DOMContentLoaded listener below for potentially faster initialization.
// Keeping Cookie Consent here for now as per original structure.
window.addEventListener("load", function () {

    /** =========================
     *  🍪 COOKIE CONSENT SETUP
     *  ========================= */
    if (window.cookieconsent) {
        window.cookieconsent.initialise({
            palette: {
                popup: { background: "#2c7c2c" },
                button: { background: "#ffffff", text: "#2c7c2c" }
            },
            theme: "classic",
            position: "bottom",
            type: "opt-in",
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
    } else {
        console.warn("Cookie Consent library not loaded yet or failed to load.");
    }

    /** =========================
     *  🔍 SEARCH FUNCTIONALITY
     *  ========================= */
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const query = document.getElementById('search-input').value.toLowerCase();
            const resultsContainer = document.getElementById('search-results');
            resultsContainer.innerHTML = "";

            const recipes = [
                { name: "Moringa Smoothie", url: "/recipes/moringa-smoothie.html" },
                { name: "Moringa Soup", url: "/recipes/evergreen/basic-moringa-soup-recipe.html" },
                { name: "Moringa Pancakes", url: "/recipes/moringa-pancakes.html" }
            ];

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

    console.log("Moringa Education window.load Scripts Finished");
});

// =========================================================================
// == FUNCTIONS (Global) ==
// =========================================================================

function enableCookies() {
    document.cookie = "cookiesAccepted=true; path=/; max-age=31536000";
    loadAnalytics();
}

function disableCookies() {
    document.cookie = "cookiesAccepted=false; path=/; max-age=31536000";
    removeCookies();
}

function loadAnalytics() {
    if (getCookie("cookiesAccepted") === "true") {
        if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
            console.log('Loading Google Analytics...');
            let script = document.createElement("script");
            script.src = "https://www.googletagmanager.com/gtag/js?id=G-PRBPH74YJ5";
            script.async = true;
            document.head.appendChild(script);

            script.onload = function () {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag("js", new Date());
                gtag("config", "G-PRBPH74YJ5");
                console.log('Google Analytics Configured.');
            };

            script.onerror = function () {
                console.error('Failed to load Google Analytics script.');
            };
        } else {
            console.log('Google Analytics script already present.');
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag("js", new Date());
            gtag("config", "G-PRBPH74YJ5");
        }
    } else {
        console.log('Google Analytics not loaded due to lack of consent.');
    }
}

function getCookie(name) {
    let match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}

function removeCookies() {
    console.log('Attempting to remove analytics cookies...');
    const cookies = document.cookie.split(";");
    const domain = window.location.hostname;
    const path = "/";

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + ";";
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + "; domain=" + domain + ";";
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + "; domain=." + domain + ";";
            console.log('Removed cookie:', name);
        }
    }

    if (window.ga && typeof window.ga.remove === 'function') {
        window.ga.remove();
    }
    // Optionally reset dataLayer: window.dataLayer = [];
}

// ============================================================================================
// == DOMContentLoaded (Runs when DOM structure is ready) ==
// ============================================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- YouTube Thumbnails ---
    const videoContainers = document.querySelectorAll(".video-container");
    videoContainers.forEach(container => {
        const videoId = container.getAttribute("data-video-id");
        if (videoId) {
            const thumbnail = container.querySelector(".video-thumbnail");
            if (thumbnail) {
                thumbnail.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                thumbnail.alt = "Video thumbnail";
            }

            container.addEventListener("click", function () {
                const iframe = document.createElement("iframe");
                iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
                iframe.setAttribute("frameborder", "0");
                iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
                iframe.setAttribute("allowfullscreen", "true");
                iframe.setAttribute("title", "YouTube video player");
                iframe.style.width = "100%";
                iframe.style.height = "315px";
                container.innerHTML = "";
                container.appendChild(iframe);
            }, { once: true });
        } else {
            console.warn("Video container without data-video-id:", container);
        }
    });

    // --- MailerLite Intersection Observer ---
    const mailerliteContainer = document.getElementById('mailerlite-form-container');
    let mailerliteLoaded = false;

    function loadMailerLite() {
        if (mailerliteLoaded) return;

        console.log('Loading MailerLite script...');
        try {
            (function(w,d,e,u,f,l,n){
                w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);};
                l=d.createElement(e);l.async=1;l.src=u;
                l.onerror = function() {
                    console.error("Failed to load MailerLite script from:", u);
                    mailerliteLoaded = false;
                };
                n=d.getElementsByTagName(e)[0];n.parentNode.insertBefore(l,n);
            })(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');

            setTimeout(() => {
                if (typeof ml === 'function') {
                    ml('account', '1410691');
                    mailerliteLoaded = true;
                    console.log('MailerLite script loaded and initialized.');
                } else {
                    console.error("MailerLite 'ml' function not available after loading script.");
                }
            }, 100);
        } catch (error) {
            console.error("Error initiating MailerLite loading:", error);
        }
    }

    if (mailerliteContainer) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !mailerliteLoaded) {
                    loadMailerLite();
                    observer.unobserve(entry.target);
                    console.log('Stopped observing MailerLite container.');
                }
            });
        }, {
            root: null,
            threshold: 0.1
        });

        observer.observe(mailerliteContainer);
    }
});
