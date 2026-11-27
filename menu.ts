const menuContainer = document.getElementById("menu-container") as HTMLDivElement;
const pagination = document.getElementById("pagination") as HTMLDivElement;
const searchInput = document.getElementById("recipe-search") as HTMLInputElement;

const categoryButtons = document.querySelectorAll<HTMLButtonElement>(".category-btn")

let allRecipes: Recipe[] = [];
let currentRecipes: Recipe[] = [];

let currentPage: number = 1;
let recipesPerPage: number = 8;

const getRecipePrice = (recipe: Recipe): number => {
    return Number((5.99 + (recipe.id % 10)).toFixed(2));
}

const addToCart = (recipe: Recipe): void => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.id === recipe.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: recipe.id,
            name: recipe.name,
            image: recipe.image,
            price: getRecipePrice(recipe),
            quantity: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    document.dispatchEvent(new Event("cartUpdated"));
    console.log(cart)

};



const recipeModal = document.getElementById("recipe-modal") as HTMLDivElement;
const closeRecipeModal = document.getElementById("close-recipe-modal") as HTMLButtonElement;

const modalRecipeImage = document.getElementById("modal-recipe-image") as HTMLImageElement;
const modalRecipeName = document.getElementById("modal-recipe-name") as HTMLElement;
const modalRecipeCuisine = document.getElementById("modal-recipe-cuisine") as HTMLElement;
const modalRecipeRating = document.getElementById("modal-recipe-rating") as HTMLElement;
const modalRecipeTime = document.getElementById("modal-recipe-time") as HTMLElement;
const modalRecipeServings = document.getElementById("modal-recipe-servings") as HTMLElement;
const modalRecipePrice = document.getElementById("modal-recipe-price") as HTMLElement;
const modalRecipeIngredients = document.getElementById("modal-recipe-ingredients") as HTMLUListElement;
const modalRecipeInstructions = document.getElementById("modal-recipe-instructions") as HTMLOListElement;

const modalQuantity = document.getElementById("modal-quantity") as HTMLElement;
const modalQuantityMinus = document.getElementById("modal-quantity-minus") as HTMLButtonElement;
const modalQuantityPlus = document.getElementById("modal-quantity-plus") as HTMLButtonElement;
const modalAddToCart = document.getElementById("modal-add-to-cart") as HTMLButtonElement;


let selectedRecipe: Recipe | null = null;
let selectedQuantity: number = 1;

const openRecipeModal = (recipe: Recipe): void => {
    selectedRecipe = recipe;
    selectedQuantity = 1;

    modalRecipeImage.src = recipe.image;
    modalRecipeImage.alt = recipe.name;

    modalRecipeName.textContent = recipe.name;
    modalRecipeCuisine.textContent = recipe.cuisine ?? "";
    modalRecipeRating.textContent = `⭐ ${recipe.rating}`;
    modalRecipeTime.textContent = `🕒 ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} min`;
    modalRecipeServings.textContent = `🍽️ ${recipe.servings} servings`;
    modalRecipePrice.textContent = `$${getRecipePrice(recipe).toFixed(2)}`;

    modalRecipeIngredients.innerHTML = "";
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        modalRecipeIngredients.appendChild(li);
    });

    modalRecipeInstructions.innerHTML = "";
    recipe.instructions.forEach(instruction => {
        const li = document.createElement("li");
        li.textContent = instruction;
        modalRecipeInstructions.appendChild(li);
    });

    modalQuantity.textContent = String(selectedQuantity);

    recipeModal.classList.remove("hidden");
    recipeModal.classList.add("flex");

    document.body.classList.add("overflow-hidden");
};

const hideRecipeModal = () => {
    recipeModal.classList.add("hidden");
    recipeModal.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");

    selectedRecipe = null;
};

closeRecipeModal.addEventListener("click", hideRecipeModal);

recipeModal.addEventListener("click", (event) => {
    if (event.target === recipeModal) {
        hideRecipeModal();
    }
});

modalQuantityMinus.addEventListener("click", () => {
    if (selectedQuantity > 1) {
        selectedQuantity--;
        modalQuantity.textContent = String(selectedQuantity);
    }
});

modalQuantityPlus.addEventListener("click", () => {
    selectedQuantity++;
    modalQuantity.textContent = String(selectedQuantity);
});

modalAddToCart.addEventListener("click", () => {
    if (!selectedRecipe) return;

    for (let i = 0; i < selectedQuantity; i++) {
        addToCart(selectedRecipe);
    }

    hideRecipeModal();
});


const displayRecipes = (recipes: Recipe[]): void => {
    menuContainer.innerHTML = "";
    if (recipes.length === 0) {
        menuContainer.textContent = "No recipes found.";
        pagination.innerHTML = "";
        return;
    }

    const start = (currentPage - 1) * recipesPerPage;
    const end = start + recipesPerPage;
    const pageRecipes = recipes.slice(start, end);

    pageRecipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "dishes";
        card.classList.add("cursor-pointer");

        card.addEventListener("click", () => {
            openRecipeModal(recipe);
        });

        const img = document.createElement("img");
        img.src = recipe.image;
        img.alt = recipe.name;

        const h3 = document.createElement("h3");
        h3.innerHTML = recipe.name;

        const p1 = document.createElement("p");
        p1.innerHTML = "⭐" + recipe.rating;

        const p2 = document.createElement("p");
        p2.innerHTML = recipe.cuisine ?? "";

        const price_add = document.createElement("div")
        price_add.className = "flex justify-between item-center"

        const recipePrice = document.createElement("p")
        recipePrice.innerHTML = "$" + getRecipePrice(recipe);

        const button = document.createElement("button");
        button.innerHTML = "Add";
        button.className = "bg-[#FF6B21] text-white px-4 py-2 rounded-full cursor-pointer";
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            addToCart(recipe)
        })

        price_add.appendChild(recipePrice);
        price_add.appendChild(button)

        card.appendChild(img)
        card.appendChild(h3)
        card.appendChild(p1)
        card.appendChild(p2)
        card.appendChild(price_add)

        menuContainer.appendChild(card);


    })
    createPagination(recipes)
}

const createPagination = (recipes: Recipe[]): void => {
    pagination.innerHTML = "";

    const totalPage = Math.ceil(recipes.length / recipesPerPage);

    const previousButton = document.createElement("button")
    previousButton.innerHTML = "<";
    previousButton.classList.add("previousButton")

    previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayRecipes(recipes);
        }
    })

    pagination.appendChild(previousButton)

    for (let i = 1; i <= totalPage; i++) {
        const pageButton = document.createElement("button")

        pageButton.innerHTML = String(i);
        pageButton.classList.add("pageButton")

        if (i === currentPage) {
            pageButton.classList.add("bg-black", "text-white")
        } else {
            pageButton.classList.add("bg-white", "text-black")
        }
        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayRecipes(recipes);
        })
        pagination.appendChild(pageButton)


    }

    const nextButton = document.createElement("button")
    nextButton.innerHTML = ">";
    nextButton.classList.add("previousButton")

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPage) {
            currentPage++;
            displayRecipes(recipes)
        }
    })
    pagination.appendChild(nextButton)


}

const loadRecipes = async () => {
    allRecipes = await getAllRecipes();

    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("recipeId");
    const selectedCategory = params.get("category");

    if (recipeId) {
        const selectedRecipe = allRecipes.find(
            recipe => recipe.id === Number(recipeId)
        );

        if (selectedRecipe) {
            currentRecipes = allRecipes;
            currentPage = 1;
            displayRecipes(currentRecipes);

            openRecipeModal(selectedRecipe);
            return;
        }
    }

    if (selectedCategory) {
        const categoryButton = [...categoryButtons].find(button =>
            button.dataset.category === selectedCategory
        );
        if (categoryButton) {
            categoryButton.click();
            return;
        }
    }

    currentRecipes = allRecipes;
    currentPage = 1;
    displayRecipes(currentRecipes);
}
loadRecipes();

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("bg-black", "text-white");
            btn.classList.add("bg-white", "text-black");
        });

        button.classList.remove("bg-white", "text-black");
        button.classList.add("bg-black", "text-white");

        const category = button.dataset.category;
        if (category == "all") {
            currentRecipes = allRecipes;
            currentPage = 1;
            displayRecipes(allRecipes);
            return;
        } else {
            currentRecipes = allRecipes.filter(recipe => {
                return getCategory(recipe) === category;
            });
            currentPage = 1;
            displayRecipes(currentRecipes)
        }


    });
});

const getCategory = (recipe: Recipe): string => {

    if (recipe.mealType?.includes("Breakfast")) {
        return "breakfast";
    }

    if (recipe.mealType?.includes("Lunch")) {
        return "lunch";
    }

    if (recipe.mealType?.includes("Dinner")) {
        return "dinner";
    }

    if (recipe.mealType?.includes("Snack")) {
        return "snack";
    }

    return "Other";
};

searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase().trim();

    currentRecipes = allRecipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchText) ||
            (recipe.cuisine ?? "").toLowerCase().includes(searchText) ||
            recipe.ingredients.some(ingredient =>
                ingredient.toLowerCase().includes(searchText)
            );

        const selectedCategory = document.querySelector<HTMLButtonElement>(".category-btn.bg-black");
        const category = selectedCategory?.dataset.category || "all";

        const matchesCategory = category === "all" || getCategory(recipe) === category;

        return matchesSearch && matchesCategory;
    });
    currentPage = 1;
    displayRecipes(currentRecipes);
});

