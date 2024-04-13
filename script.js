let promptsData = []; // Global variable to store all prompts data

// Function to truncate text after a certain number of characters
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
// Function to create prompt cards
function createPromptCards() {
    const promptCardsContainer = document.getElementById('promptCards');
    promptCardsContainer.innerHTML = ''; // Clear existing cards
    promptsData.forEach((prompt, index) => {
        const truncatedDescription = truncateText(prompt.Teaser, 500);
        const card = document.createElement('div');
        card.classList.add('col');
        card.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${prompt.Title}</h5>
                    <p class="card-text"><span class="category">Category:</span> ${prompt.Category}</p>
                    <p class="card-text">Models:</p>
                    ${prompt.ModelS.map(model => `<span class="badge bg-success models-badge">${model}</span>`).join(' ')}
                    <p class="card-text">${truncatedDescription}</p>
                    <button class="btn btn-primary copy-btn" data-index="${index}">Copy Prompt</button>
                </div>
            </div>
        `;
        promptCardsContainer.appendChild(card);
    });
}
// Function to copy prompt to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px'; // Move the textarea offscreen
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Prompt copied to clipboard!');
}
// Event listener for copy buttons
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('copy-btn')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        const prompt = promptsData[index].Prompt;
        copyToClipboard(prompt);
    }
});
// Function to filter prompts based on search input
function filterPrompts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const modelSelect = document.getElementById('modelSelect');
    const categorySelect = document.getElementById('categorySelect');
    let selectedModel = modelSelect.options[modelSelect.selectedIndex].value;
    let selectedCategory = categorySelect.options[categorySelect.selectedIndex].value;
    // Check if "All Models" is selected
    if (selectedModel === 'all') {
        selectedModel = '';
    }
    // Check if "All Categories" is selected
    if (selectedCategory === 'all') {
        selectedCategory = '';
    }
    const promptCardsContainer = document.getElementById('promptCards');
    promptCardsContainer.innerHTML = ''; // Clear existing cards
    promptsData.forEach((prompt, index) => {
        const title = prompt.Title.toLowerCase();
        const category = prompt.Category.toLowerCase();
        const description = prompt.Teaser.toLowerCase();
        const models = prompt.ModelS.map(model => model.toLowerCase()).join(' ');
        const isModelMatch = selectedModel === '' || models.includes(selectedModel);
        const isCategoryMatch = selectedCategory === '' || category === selectedCategory;
        if (isModelMatch && isCategoryMatch && (title.includes(searchInput) || category.includes(searchInput) || description.includes(searchInput) || models.includes(searchInput))) {
            createPromptCard(prompt, index);
        }
    });
}
// Function to create a single prompt card
function createPromptCard(prompt, index) {
    const promptCardsContainer = document.getElementById('promptCards');
    const truncatedDescription = truncateText(prompt.Teaser, 500);
    const card = document.createElement('div');
    card.classList.add('col');
    card.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${prompt.Title}</h5>
                <p class="card-text"><span class="category">Category:</span> ${prompt.Category}</p>
                <p class="card-text">Models:</p>
                ${prompt.ModelS.map(model => `<span class="badge bg-success models-badge">${model}</span>`).join(' ')}
                <p class="card-text">${truncatedDescription}</p>
                <button class="btn btn-primary copy-btn" data-index="${index}">Copy Prompt</button>
            </div>
        </div>
    `;
    promptCardsContainer.appendChild(card);
}
// Function to fetch prompts data
function fetchData() {
    fetch('prompts.json')
        .then(response => response.json())
        .then(data => {
            promptsData = data;
            createPromptCards();
            populateModelsSelect();
            populateCategoriesSelect();
        })
        .catch(error => console.error('Error fetching prompts:', error));
}
// Call fetchData function to load prompts data
fetchData();
// Function to populate models select
function populateModelsSelect() {
    const modelSelect = document.getElementById('modelSelect');
    const models = [];
    promptsData.forEach(prompt => {
        prompt.ModelS.forEach(model => {
            if (!models.includes(model)) {
                models.push(model);
            }
        });
    });
    models.forEach(model => {
        const option = document.createElement('option');
        option.text = model;
        modelSelect.add(option);
    });
    // Add "All Models" option if it doesn't exist
    if (!models.includes('All Models')) {
        const allModelsOption = document.createElement('option');
        allModelsOption.text = 'All Models';
        allModelsOption.value = 'all';
        modelSelect.add(allModelsOption);
    }
}
// Function to filter prompts by model
function filterByModel() {
    filterPrompts();
}
// Function to populate categories select
function populateCategoriesSelect() {
    const categorySelect = document.getElementById('categorySelect');
    const categories = [];
    promptsData.forEach(prompt => {
        if (!categories.includes(prompt.Category)) {
            categories.push(prompt.Category);
        }
    });
    categories.forEach(category => {
        const option = document.createElement('option');
        option.text = category;
        categorySelect.add(option);
    });
    // Add "All Categories" option if it doesn't exist
    if (!categories.includes('All Categories')) {
        const allCategoriesOption = document.createElement('option');
        allCategoriesOption.text = 'All Categories';
        allCategoriesOption.value = 'all';
        categorySelect.add(allCategoriesOption);
    }
}
// Function to filter prompts by category
function filterByCategory() {
    filterPrompts();
}
// Event listeners for model and category select
document.getElementById('modelSelect').addEventListener('change', filterByModel);
document.getElementById('categorySelect').addEventListener('change', filterByCategory);
// Event listener for search input
document.getElementById('searchInput').addEventListener('input', filterPrompts);