// Fetch Quotes from Server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const quotes = await response.json();
        displayQuotes(quotes);
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

// Display Quotes in the UI
function displayQuotes(quotes) {
    const quotesContainer = document.getElementById("quotesContainer");
    quotesContainer.innerHTML = ""; // Clear existing quotes

    quotes.forEach(quote => {
        const quoteElement = document.createElement("div");
        quoteElement.textContent = quote.title; // Display title as the quote
        quotesContainer.appendChild(quoteElement);
    });
}

// Post a New Quote
async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newQuote),
        });
        const postedQuote = await response.json();
        console.log("New quote posted:", postedQuote);
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

// Handle Sync Quotes Button
document.getElementById("syncQuotesButton").addEventListener("click", function() {
    fetchQuotesFromServer();
});

// Handle Post Quote Button
document.getElementById("postQuoteButton").addEventListener("click", function() {
    const newQuote = {
        title: "This is a new quote",
        body: "Quote content",
        userId: 1,
    };
    postQuoteToServer(newQuote);
});

// Periodic Syncing with Timeout (instead of setInterval)
function periodicSync() {
    fetchQuotesFromServer();
    setTimeout(periodicSync, 60000); // Sync every 60 seconds
}

// Start periodic syncing when the page loads
window.addEventListener("load", function() {
    periodicSync();
});
