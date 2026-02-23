document.addEventListener("DOMContentLoaded", function() {

    const path = window.location.pathname.includes("/categories/")
        ? "../partials/"
        : "partials/";

    fetch(path + "header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;

            // 🔥 IMPORTANT: setup menus AFTER header loads
            setupMenus();
        });

    fetch(path + "footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });

});

// Recipe data - will be overridden by window.recipeData if present
let baseServings = 4;
let currentServings = 4;
let currentUnits = 'imperial'; // 'imperial' or 'metric'

// Default ingredients for Veg Pulao (fallback if window.recipeData is not defined)
let ingredients = [
    { name: "basmati rice", amount: 2, unit: "cups", metric: 400, metricUnit: "g" },
    { name: "water", amount: 3.25, unit: "cups", metric: 780, metricUnit: "ml" },
    { name: "mixed vegetables (carrots, beans, peas, cauliflower - finely chopped)", amount: 2, unit: "cups", metric: 300, metricUnit: "g" },
    { name: "onion (thinly sliced)", amount: 1, unit: "piece", metric: 1, metricUnit: "piece" },
    { name: "tomato (finely chopped)", amount: 1, unit: "piece", metric: 1, metricUnit: "piece" },
    { name: "ghee or oil", amount: 3, unit: "tbsp", metric: 45, metricUnit: "ml" },
    { name: "cumin seeds", amount: 1, unit: "tsp", metric: 5, metricUnit: "g" },
    { name: "bay leaf", amount: 1, unit: "piece", metric: 1, metricUnit: "piece" },
    { name: "cinnamon stick (1 inch)", amount: 1, unit: "piece", metric: 1, metricUnit: "piece" },
    { name: "cloves", amount: 3, unit: "pieces", metric: 3, metricUnit: "pieces" },
    { name: "green cardamom", amount: 2, unit: "pieces", metric: 2, metricUnit: "pieces" },
    { name: "ginger-garlic paste", amount: 1, unit: "tbsp", metric: 15, metricUnit: "g" },
    { name: "green chili (slit)", amount: 2, unit: "pieces", metric: 2, metricUnit: "pieces" },
    { name: "salt", amount: 1.5, unit: "tsp", metric: 7.5, metricUnit: "g" },
    { name: "turmeric powder", amount: 0.25, unit: "tsp", metric: 1, metricUnit: "g" },
    { name: "red chili powder", amount: 0.5, unit: "tsp", metric: 2.5, metricUnit: "g" },
    { name: "garam masala", amount: 0.5, unit: "tsp", metric: 2.5, metricUnit: "g" },
    { name: "coriander leaves (chopped)", amount: 2, unit: "tbsp", metric: 10, metricUnit: "g" },
    { name: "mint leaves (chopped, optional)", amount: 1, unit: "tbsp", metric: 5, metricUnit: "g" }
];

let recipeTitle = "One-Pot Pressure Cooker Veg Pulao";

// Function to increase servings
function increaseServings() {
    if (currentServings < 20) {
        currentServings++;
        updateIngredients();
    }
}

// Function to decrease servings
function decreaseServings() {
    if (currentServings > 1) {
        currentServings--;
        updateIngredients();
    }
}

// Function to change units between imperial and metric
function changeUnits() {
    currentUnits = currentUnits === 'imperial' ? 'metric' : 'imperial';
    updateIngredients();
}

// Function to update ingredients display
function updateIngredients() {
    const multiplier = currentServings / baseServings;
    const ingredientsList = document.getElementById('ingredients');
    
    if (!ingredientsList) return; // Exit if ingredients list doesn't exist
    
    ingredientsList.innerHTML = '';
    
    ingredients.forEach(ingredient => {
        let displayAmount, displayUnit;
        
        if (currentUnits === 'imperial') {
            const scaledAmount = (ingredient.amount * multiplier).toFixed(2);
            displayAmount = parseFloat(scaledAmount) % 1 === 0 ? 
                parseInt(scaledAmount) : scaledAmount;
            displayUnit = ingredient.unit;
        } else {
            const scaledAmount = (ingredient.metric * multiplier).toFixed(1);
            displayAmount = parseFloat(scaledAmount) % 1 === 0 ? 
                parseInt(scaledAmount) : scaledAmount;
            displayUnit = ingredient.metricUnit;
        }
        
        const li = document.createElement('li');
        li.className = 'ingredient-item';
        li.innerHTML = `
            <span>${ingredient.name}</span>
            <span class="ingredient-amount">${displayAmount} ${displayUnit}</span>
        `;
        ingredientsList.appendChild(li);
    });
    
    const servingsDisplay = document.getElementById('servings-display');
    if (servingsDisplay) {
        servingsDisplay.textContent = currentServings;
    }
}

// Function to print recipe
function printRecipe() {
    window.print();
}

// Function to copy recipe to clipboard
function copyRecipe() {
    let recipeText = recipeTitle + "\n\n";
    recipeText += "Servings: " + currentServings + "\n\n";
    recipeText += "INGREDIENTS:\n";
    
    ingredients.forEach(ingredient => {
        const multiplier = currentServings / baseServings;
        let displayAmount, displayUnit;
        
        if (currentUnits === 'imperial') {
            const scaledAmount = (ingredient.amount * multiplier).toFixed(2);
            displayAmount = parseFloat(scaledAmount) % 1 === 0 ? 
                parseInt(scaledAmount) : scaledAmount;
            displayUnit = ingredient.unit;
        } else {
            const scaledAmount = (ingredient.metric * multiplier).toFixed(1);
            displayAmount = parseFloat(scaledAmount) % 1 === 0 ? 
                parseInt(scaledAmount) : scaledAmount;
            displayUnit = ingredient.metricUnit;
        }
        
        recipeText += `${displayAmount} ${displayUnit} ${ingredient.name}\n`;
    });
    
    recipeText += "\nINSTRUCTIONS:\n\n";
    
    // Extract instructions from the HTML
    const instructionSteps = document.querySelectorAll('.instruction-step');
    instructionSteps.forEach((step, index) => {
        const title = step.querySelector('.step-title')?.textContent || '';
        const text = step.querySelector('p')?.textContent || '';
        recipeText += `${index + 1}. ${title}: ${text}\n\n`;
    });
    
    navigator.clipboard.writeText(recipeText).then(() => {
        alert('Recipe copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy recipe. Please try again.');
    });
}

// Function to start cooking mode (scroll to instructions)
function startCooking() {
    const instructionsSection = document.querySelector('.instructions-section');
    if (instructionsSection) {
        instructionsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Menu dropdown functionality
function setupMenus() {
    // Get all menu items with dropdowns
    const dropdownToggles = document.querySelectorAll('.has-dropdown');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentLi = this.parentElement;
            const isOpen = parentLi.classList.contains('open');
            
            // Close all other menus at the same level
            const siblings = Array.from(parentLi.parentElement.children);
            siblings.forEach(sibling => {
                if (sibling !== parentLi) {
                    sibling.classList.remove('open');
                    // Close all nested menus
                    sibling.querySelectorAll('li.open').forEach(nested => {
                        nested.classList.remove('open');
                    });
                }
            });
            
            // Toggle current menu
            if (isOpen) {
                parentLi.classList.remove('open');
                // Close all nested menus
                parentLi.querySelectorAll('li.open').forEach(nested => {
                    nested.classList.remove('open');
                });
            } else {
                parentLi.classList.add('open');
            }
        });
    });
    
    // Close menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav')) {
            document.querySelectorAll('nav li.open').forEach(item => {
                item.classList.remove('open');
            });
        }
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    
    // Check if window.recipeData exists and load it
    if (window.recipeData) {
        // Override with recipe-specific data
        if (window.recipeData.ingredients) {
            ingredients = window.recipeData.ingredients;
        }
        if (window.recipeData.baseServings) {
            baseServings = window.recipeData.baseServings;
            currentServings = window.recipeData.baseServings;
        }
        if (window.recipeData.title) {
            recipeTitle = window.recipeData.title;
        }
    }

    // Only run ingredient logic if recipe page exists
    if (document.getElementById('ingredients')) {
        updateIngredients();
    }

    // Setup dropdown menus on ALL pages
    setupMenus();

    // Only attach nav-link page switching if .page exists
    if (document.querySelector('.page')) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                if (pageId) {
                    navigateToPage(pageId);
                }
            });
        });
    }
const riceContainer = document.querySelector('.horizontal-scroll');
if (riceContainer) {
    riceContainer.addEventListener('scroll', updateArrows);
    updateArrows(); // Run once on load
}

});

let currentIndex = 0;

function scrollRice(direction) {
    const container = document.querySelector('.horizontal-scroll');
    if (!container) return;

    const card = container.querySelector('.feature-card');
    if (!card) return;

    const cardWidth = card.offsetWidth + 32; // 32px gap

    container.scrollBy({
        left: direction * cardWidth * (window.innerWidth <= 768 ? 1 : 3),
        behavior: 'smooth'
    });
}

function updateArrows() {
    const container = document.querySelector('.horizontal-scroll');
    const leftArrow = document.getElementById('rice-left');
    const rightArrow = document.getElementById('rice-right');

    if (!container || !leftArrow || !rightArrow) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    // Hide left arrow at beginning
    if (container.scrollLeft <= 10) {
        leftArrow.style.opacity = "0";
        leftArrow.style.pointerEvents = "none";
    } else {
        leftArrow.style.opacity = "1";
        leftArrow.style.pointerEvents = "auto";
    }

    // Hide right arrow at end
    if (container.scrollLeft >= maxScrollLeft - 10) {
        rightArrow.style.opacity = "0";
        rightArrow.style.pointerEvents = "none";
    } else {
        rightArrow.style.opacity = "1";
        rightArrow.style.pointerEvents = "auto";
    }
}