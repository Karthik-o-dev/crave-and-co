"use strict";
const base_api = "https://dummyjson.com";
const get_api = (end_point) => {
    return base_api + end_point;
};
const request = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("request failed");
        }
        return await response.json();
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
const getAllRecipes = async () => {
    const api = get_api("/recipes?skip=&limit=0");
    const response = await request(api);
    if (typeof response === "object" &&
        response !== null &&
        "recipes" in response &&
        Array.isArray(response.recipes)) {
        return response.recipes;
    }
    return [];
};
