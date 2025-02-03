const localQuotesKey = "localQuotes";
const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock API for demonstration

// Fetch quotes from the mock server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.slice(0, 5).map(quote => ({
            id: quote.id,
            text: quote.title, // Using title as the quote
        }));
    } catch (error) {
        console.error("Error fetching data from server:", error);
        return [];
    }
}

// Get local quotes from local storage
function getLocalQuotes() {
    const quotes = localStorage.getItem(localQuotesKey);
    return quotes ? JSON.parse(quotes) : [];
}

// Save quotes to local storage
function saveLocalQuotes(quotes) {
    localStorage.setItem(localQuotesKey, JSON.stringify(quotes));
}

// Sync quotes between server and local storage
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = getLocalQuotes();

    let hasConflict = false;

    // Conflict resolution: Server data takes priority
    if (JSON.stringify(serverQuotes) !== JSON.stringify(localQuotes)) {
        hasConflict = true;
        saveLocalQuotes(serverQuotes);
    }

    // Update UI
    displayQuotes();
    
    // Show conflict notification if needed
    const conflictNotification = document.getElementById("conflict-notification");
    conflictNotification.style.display = hasConflict ? "block" : "none";

    document.getElementById("sync-status").innerText = "Sync complete.";
}

// Display quotes in the UI
function displayQuotes() {
    const quoteList = document.getElementById("quote-list");
    quoteList.innerHTML = "";
    const quotes = getLocalQuotes();

    quotes.forEach(quote => {
        const li = document.createElement("li");
        li.textContent = quote.text;
        quoteList.appendChild(li);
    });
}

// Event listener for manual sync button
document.getElementById("sync-button").addEventListener("click", syncQuotes);

// Event listener for resolving conflicts
document.getElementById("resolve-conflict").addEventListener("click", () => {
    document.getElementById("conflict-notification").style.display = "none";
});

// Initial load
displayQuotes();
setInterval(syncQuotes, 10000); // Auto-sync every 10 seconds
