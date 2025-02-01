// Placeholder for any custom JavaScript you want to add
console.log("Moringa Education Scripts Loaded");

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const query = document.getElementById('search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ""; // Clear previous results

    // Array of sample recipes (replace with dynamic fetching later)
    const recipes = [
        { name: "Moringa Smoothie", url: "/recipes/moringa-smoothie.html" },
        { name: "Moringa Soup", url: "/recipes/moringa-soup.html" },
        { name: "Moringa Pancakes", url: "/recipes/moringa-pancakes.html" }
    ];

    // Filter recipes
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
