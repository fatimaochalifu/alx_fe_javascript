// Simulating a server request with async/await

async function fetchQuotesFromServer() {
    try {
        // Fetching data from the mock server (JSONPlaceholder)
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();

        // Simulating a delay like fetching data from a real server
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 1000); // 1 second delay for simulation
        });
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// Function to sync data
async function syncQuotes() {
    const quotes = await fetchQuotesFromServer();
    displayQuotes(quotes);
}

// Function to display quotes on the page
function displayQuotes(quotes) {
    const quotesContainer = document.getElementById('quotesContainer');

    if (quotes && quotes.length > 0) {
        quotesContainer.innerHTML = ''; // Clear existing content
        quotes.forEach(quote => {
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote');
            quoteElement.innerHTML = `<p>${quote.title}</p><p>${quote.body}</p>`;
            quotesContainer.appendChild(quoteElement);
        });
    } else {
        quotesContainer.innerHTML = 'No quotes available.';
    }
}

// Event listener for Sync Quotes button
document.getElementById('syncQuotesButton').addEventListener('click', syncQuotes);
