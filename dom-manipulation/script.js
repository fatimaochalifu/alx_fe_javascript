// Simulate a mock server URL (JSONPlaceholder is used for demonstration purposes)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Retrieve quotes from local storage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
];

// Function to sync quotes between local storage and server
async function syncQuotes() {
    try {
        // Fetch the latest quotes from the server
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();

        // Convert server quotes to match local quote format
        const serverQuotesFormatted = serverQuotes.map(item => ({
            text: item.title, // Simulate sending quote text as "title"
            category: "Server Category" // Simulate a generic category for simplicity
        }));

        // Merge local quotes with server quotes, prioritizing server data
        const mergedQuotes = mergeQuotes(quotes, serverQuotesFormatted);

        // Update local storage with the merged quotes
        localStorage.setItem("quotes", JSON.stringify(mergedQuotes));

        // Optionally, notify the user that the sync is complete
        notifyUser("Quotes synced successfully!");

        // Update the UI with the latest quotes
        displayQuotes(mergedQuotes);
    } catch (error) {
        console.error("Error syncing quotes:", error);
        notifyUser("Error syncing quotes with the server.");
    }
}

// Function to merge local and server quotes (server data takes precedence)
function mergeQuotes(localQuotes, serverQuotes) {
    const mergedQuotes = [...localQuotes];

    // Add server quotes that don't already exist locally
    serverQuotes.forEach(serverQuote => {
        if (!localQuotes.some(localQuote => localQuote.text === serverQuote.text)) {
            mergedQuotes.push(serverQuote);
        }
    });

    return mergedQuotes;
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
    
    // Post new quote to the server
    postQuoteToServer(newQuoteText, newQuoteCategory);

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Post the new quote to the server
async function postQuoteToServer(quoteText, quoteCategory) {
    try {
        const response = await fetch(SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: quoteText, // Simulate sending quote text as "title"
                category: quoteCategory
            })
        });

        const result = await response.json();
        console.log("Posted quote:", result);
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}

// Create and append the add quote form
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

// Add a sync button to sync data with the server
const syncButton = document.createElement("button");
syncButton.innerText = "Sync Quotes with Server";
syncButton.onclick = syncQuotes;
document.body.appendChild(syncButton);
