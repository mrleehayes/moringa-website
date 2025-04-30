// Ensure all scripts run after the page has loaded
// NOTE: Consider moving logic dependent only on DOM structure (like Cookie Consent, Video Player, Search, MailerLite Observer)
// into the DOMContentLoaded listener below for potentially faster initialization.
// Keeping Cookie Consent here for now as per original structure.
window.addEventListener("load", function () {

    /** =========================
     *  🍪 COOKIE CONSENT SETUP
     *  ========================= */
    // Check if cookieconsent object exists (it might be loaded deferred)
    if (window.cookieconsent) {
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
                href: "/legal/cookie-policy.html" // Ensure this path is correct
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
        // Optionally, try initializing later or handle the error
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

            // Sample recipes (replace with dynamic fetching later if needed)
            const recipes = [
                { name: "Moringa Smoothie", url: "/recipes/moringa-smoothie.html" }, // Ensure paths are correct
                { name: "Moringa Soup", url: "/recipes/evergreen/basic-moringa-soup-recipe.html" }, // Ensure paths are correct
                { name: "Moringa Pancakes", url: "/recipes/moringa-pancakes.html" } // Ensure paths are correct
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
    console.log("Moringa Education window.load Scripts Finished");
});


// =========================================================================
// == FUNCTIONS (Define outside listeners so they are globally accessible) ==
// =========================================================================

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
        // Check if GA script already added to prevent duplicates
        if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
            console.log('Loading Google Analytics...');
            let script = document.createElement("script");
            script.src = "https://www.googletagmanager.com/gtag/js?id=G-PRBPH74YJ5"; // Replace with actual GA ID
            script.async = true;
            document.head.appendChild(script);

            script.onload = function () {
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag("js", new Date());
                gtag("config", "G-PRBPH74YJ5"); // Replace with your actual GA ID
                console.log('Google Analytics Configured.');
            };
            script.onerror = function() {
                console.error('Failed to load Google Analytics script.');
            };
        } else {
             console.log('Google Analytics script already present.');
             // Ensure config runs if script loaded but config didn't (edge case)
             window.dataLayer = window.dataLayer || [];
             function gtag() { dataLayer.push(arguments); }
             gtag("js", new Date());
             gtag("config", "G-PRBPH74YJ5");
        }
    } else {
        console.log('Google Analytics not loaded due to lack of consent.');
    }
}

/** =========================
 *  🍪 HELPER FUNCTION TO READ COOKIES
 *  ========================= */
function getCookie(name) {
    let match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]+)")); // Improved regex
    return match ? decodeURIComponent(match[2]) : null; // Decode cookie value
}

/** =========================
 *  🗑 REMOVE UNWANTED TRACKING COOKIES (Improved)
 *  ========================= */
function removeCookies() {
    console.log('Attempting to remove analytics cookies...');
    const cookies = document.cookie.split(";");
    const domain = window.location.hostname;
    const path = "/";

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        // Target common analytics cookies more specifically if needed,
        // otherwise, be cautious about removing non-tracking cookies.
        // Example targeting GA cookies:
        if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
             // Setting expiry date to the past, path to /, and trying both base domain and subdomain if applicable
             document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + ";";
             document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + "; domain=" + domain + ";";
             // Try removing domain attribute too for some cases
             document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + "; domain=." + domain + ";"; // With leading dot
             console.log('Removed cookie:', name);
        }
    }
     // Clear GA object if it exists
     if (window.ga && typeof window.ga.remove === 'function') {
        window.ga.remove();
     }
     // Reset dataLayer if needed (use with caution)
     // window.dataLayer = [];
}


// ============================================================================================
// == DOMContentLoaded LISTENER (For logic that needs the DOM structure but not all assets) ==
// ============================================================================================
document.addEventListener("DOMContentLoaded", function () {

    // --- Handle YouTube video container functionality ---
    const videoContainers = document.querySelectorAll(".video-container");
    videoContainers.forEach(container => {
        const videoId = container.getAttribute("data-video-id");
        if (videoId) { // Ensure videoId exists
            const thumbnail = container.querySelector(".video-thumbnail");

            // Set YouTube thumbnail
            if(thumbnail) { // Ensure thumbnail element exists
                 thumbnail.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                 thumbnail.alt = "Video thumbnail"; // Add default alt text
            }

            container.addEventListener("click", function () {
                // Create and load the YouTube iframe dynamically
                const iframe = document.createElement("iframe");
                iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
                iframe.setAttribute("frameborder", "0");
                iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"); // Added web-share
                iframe.setAttribute("allowfullscreen", "true");
                iframe.setAttribute("title", "YouTube video player"); // Add title for accessibility
                iframe.style.width = "100%";
                iframe.style.height = "315px"; // Adjust as needed or make responsive

                // Replace the container content (thumbnail, button) with the YouTube iframe
                container.innerHTML = ""; // Clear container
                container.appendChild(iframe);
            }, { once: true }); // Use {once: true} so the listener is removed after the first click
        } else {
            console.warn("Video container found without data-video-id attribute:", container);
        }
    });


    // --- Intersection Observer for MailerLite ---
    const mailerliteContainer = document.getElementById('mailerlite-form-container'); // Ensure this ID exists in your HTML
    let mailerliteLoaded = false; // Flag to ensure script loads only once

    // Function to load the MailerLite script (defined within this scope)
    function loadMailerLite() {
        if (mailerliteLoaded) return; // Exit if already loaded

        console.log('Loading MailerLite script...');
        try {
            (function(w,d,e,u,f,l,n){
                w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);};
                l=d.createElement(e);l.async=1;l.src=u;
                // Error handling for script load
                l.onerror = function() {
                    console.error("Failed to load MailerLite script from:", u);
                    mailerliteLoaded = false; // Reset flag maybe? Or handle error state
                };
                n=d.getElementsByTagName(e)[0];n.parentNode.insertBefore(l,n);
            })(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');

            // Wait a brief moment for the 'ml' function to likely be available
            setTimeout(() => {
                 if (typeof ml === 'function') {
                     ml('account', '1410691'); // Use your correct MailerLite account ID
                     mailerliteLoaded = true; // Set flag to true ONLY after successful init
                     console.log('MailerLite script loaded and initialized.');
                 } else {
                      console.error("MailerLite 'ml' function not available after loading script.");
                 }
            }, 100); // Small delay

        } catch (error) {
            console.error("Error initiating MailerLite loading:", error);
        }
    }

    // Check if the target container exists on the page
    if (mailerliteContainer) {
        // Define the callback function for the observer
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                // Check if the element is intersecting (entering the viewport)
                if (entry.isIntersecting && !mailerliteLoaded) { // Check flag here too
                    loadMailerLite(); // Load the script

                    // Optional: Stop observing once loading is initiated (or successful)
                    observer.unobserve(entry.target);
                    console.log('Stopped observing MailerLite container.');
                }
            });
        };

        // Configure the observer
        const observerOptions = {
            root: null, // Use the viewport as the root
            threshold: 0, // Trigger as soon as 1 pixel is visible (default)
            rootMargin: '200px 0px' // Optional: Trigger when element is 200px below viewport edge. Adjust as needed.
        };

        // Create and start the observer
        try {
            const observer = new IntersectionObserver(observerCallback, observerOptions);
            observer.observe(mailerliteContainer);
            console.log('Intersection Observer watching MailerLite container.');
        } catch (error) {
             console.error("Failed to create Intersection Observer (maybe browser incompatibility?):", error);
             // Fallback: Load MailerLite after a delay if Observer fails?
             // setTimeout(loadMailerLite, 5000);
        }

    } else {
        // It's okay if the container isn't on every page, just log it if needed.
        // console.log('MailerLite container (#mailerlite-form-container) not found on this page.');
    }
    // --- End Intersection Observer for MailerLite ---


    console.log("Moringa Education DOMContentLoaded Scripts Finished");
}); // End of DOMContentLoaded listener


// Original MailerLite block should remain commented out or removed below this line
/*
(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '1410691');
*/