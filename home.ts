const popular = document.getElementById("popular-dishes") as HTMLDivElement;

getAllRecipes().then((recipes: Recipe[]) => {

    const popularRecipes = recipes.slice(0, 4);

    popularRecipes.forEach((recipe: Recipe) => {

        const main_img: string = recipe.image;

        const recipesContainer = document.createElement("div");
        recipesContainer.className = ("dishes");

        const img = document.createElement("img");
        img.src = main_img
        img.alt = recipe.name;
        img.classList.add("image-container")

        const title = document.createElement("h2")
        title.innerHTML = recipe.name;

        recipesContainer.appendChild(img)
        recipesContainer.appendChild(title)

        recipesContainer.addEventListener("click", () => {
            window.location.href = `menu.html?recipeId=${recipe.id}`;
        });

        popular.appendChild(recipesContainer)



    });
})

