// Simulate a mock server URL (JSONPlaceholder is used for demonstration purposes)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Retrieve quotes from local storage or use default
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
];

// Fetch quotes from the server and sync with local quotes
function fetchQuotesFromServer() {
    // Simulating fetching updated data from the server (mock response)
    fetch(SERVER_URL)
        .then(response => response.json())
        .then(data => {
            // Assuming the mock server returns an array of posts
            // Simulate that server data is being updated by the mock server
            const serverQuotes = data.map(item => ({
                text: item.title,
                category: "Server Category" // Simulate a generic category for simplicity
            }));

            resolveDataSync(serverQuotes);
        })
        .catch(err => console.error('Error fetching from server:', err));
}

// Periodically check for new data from the server (every 10 seconds)
setInterval(fetchQuotesFromServer, 10000); // Set to 10 seconds for testing purposes

// Function to resolve data sync and handle conflicts
function resolveDataSync(serverQuotes) {
    const localQuotesSet = new Set(quotes.map(quote => quote.text));
    const newServerQuotes = serverQuotes.filter(quote => !localQuotesSet.has(quote.text));
    
    if (newServerQuotes.length > 0) {
        // Handle the conflict resolution, prefer server data
        quotes.push(...newServerQuotes);
        saveQuotes();

        // Notify user of the update
        notifyUser("New quotes have been added from the server.");
    } else {
        console.log('No new quotes from the server.');
    }
}

// Notify user about the sync/update process
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerText = message;
    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Populate the categories in the dropdown dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing options in the dropdown (except "All Categories")
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add unique categories to the dropdown
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Show random quote based on selected category
function showRandomQuote() {
    const category = document.getElementById("categoryFilter").value;
    const filteredQuotes = category === "all" ? quotes : quotes.filter(quote => quote.category === category);
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>"${quote.text}" - <strong>${quote.category}</strong></p>`;
    
    // Store the last viewed quote in session storage
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    
    // Display filtered quotes
    displayQuotes(filteredQuotes);
    
    // Save the last selected category in localStorage
    localStorage.setItem("selectedCategory", selectedCategory);
}

// Display quotes based on selected category
function displayQuotes(filteredQuotes) {
    const quotesContainer = document.getElementById("quotesContainer");
    quotesContainer.innerHTML = ""; // Clear existing quotes
    
    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement("div");
        quoteElement.innerHTML = `<p>"${quote.text}" - <strong>${quote.category}</strong></p>`;
        quotesContainer.appendChild(quoteElement);
    });
}

// Remember the last selected category on page load
function initialize() {
    populateCategories();
    
    // Get the last selected category from localStorage
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";
    document.getElementById("categoryFilter").value = selectedCategory;
    
    // Filter quotes based on last selected category
    filterQuotes();
}

// Add new quote and category
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
    
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }
    
    // Check if the quote already exists
    if (quotes.some(quote => quote.text === newQuoteText)) {
        alert("This quote already exists.");
        return;
    }

    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    
    // Update categories in the dropdown if a new category is added
    populateCategories();
    
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to create and append the add quote form
function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
        <button onclick="exportToJsonFile()">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    `;
    document.body.appendChild(formContainer);
}

// Export quotes as JSON
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            importedQuotes.forEach(quote => {
                // Check if the quote already exists
                if (!quotes.some(existingQuote => existingQuote.text === quote.text)) {
                    quotes.push(quote);
                }
            });
            saveQuotes();
            alert('Quotes imported successfully!');
        } catch (error) {
            alert('Invalid JSON format');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Call the function to add the form to the DOM
createAddQuoteForm();

// Call the initialize function when the page loads
window.onload = initialize;

// Event listener for the filter change
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
