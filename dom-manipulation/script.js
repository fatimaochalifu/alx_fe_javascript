let localQuotes = [];  // In-memory storage for quotes (instead of localStorage)
const apiUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to simulate fetching quotes from the server
function fetchQuotesFromServer() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Quotes: ", data);
            localQuotes = data; // Store fetched quotes in the localQuotes array
            updateQuoteDisplay(); // Update the display after fetching quotes
        })
        .catch(error => console.error("Error fetching quotes: ", error));
}

// Function to post a new quote to the server
function postQuoteToServer(newQuote) {
    const quoteData = {
        title: newQuote,
        body: newQuote,
        userId: 1
    };

    fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(quoteData),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Posted New Quote: ", data);
        localQuotes.push(data); // Add the new quote to the localQuotes array
        updateQuoteDisplay(); // Update the display after posting
    })
    .catch(error => console.error("Error posting new quote: ", error));
}

// Function to update the display of quotes on the page
function updateQuoteDisplay() {
    const quotesContainer = document.getElementById("quotesContainer");
    quotesContainer.innerHTML = ""; // Clear previous quotes

    localQuotes.forEach(quote => {
        const quoteElement = document.createElement("div");
        quoteElement.classList.add("quote");
        quoteElement.textContent = `${quote.title}: ${quote.body}`;
        quotesContainer.appendChild(quoteElement);
    });
}

// Event listeners for the buttons
document.getElementById("syncQuotesButton").addEventListener("click", fetchQuotesFromServer);

document.getElementById("postQuoteButton").addEventListener("click", function () {
    const newQuote = prompt("Enter a new quote:");
    if (newQuote) {
        postQuoteToServer(newQuote);
    }
});

// Call fetchQuotesFromServer immediately to load initial data
fetchQuotesFromServer();
