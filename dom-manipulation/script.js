// Simulate fetching quotes from the server
function fetchQuotesFromServer() {
    // Using fetch to simulate getting data from the server
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(quotes => {
            // Update localStorage with the fetched quotes
            localStorage.setItem('quotes', JSON.stringify(quotes));
            // Display the quotes on the page
            displayQuotes();
        })
        .catch(error => console.error('Error fetching quotes:', error));
}

// Function to simulate posting a new quote to the server
function postNewQuote(quote) {
    const newQuote = {
        title: quote
    };

    // Simulate sending data to the server
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(newQuote),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Update localStorage with the newly posted quote
            const storedQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
            storedQuotes.push(data);
            localStorage.setItem('quotes', JSON.stringify(storedQuotes));
            // Display the updated quotes
            displayQuotes();
        })
        .catch(error => console.error('Error posting quote:', error));
}

// Function to display the quotes from localStorage
function displayQuotes() {
    const quotesContainer = document.getElementById('quotesContainer');
    quotesContainer.innerHTML = ''; // Clear any existing quotes

    // Get quotes from localStorage
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    quotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.innerText = quote.title;
        quotesContainer.appendChild(quoteElement);
    });
}

// Function to handle syncing quotes and resolving conflicts
function syncQuotes() {
    // Fetch new quotes from the server and update localStorage
    fetchQuotesFromServer();

    // Compare and resolve conflicts (server data takes precedence)
    const serverQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const localQuotes = JSON.parse(localStorage.getItem('localQuotes')) || [];

    // Conflict resolution: if server data is newer, update localStorage
    if (serverQuotes.length > localQuotes.length) {
        localStorage.setItem('localQuotes', JSON.stringify(serverQuotes));
        alert('Data synced from server, conflicts resolved.');
    } else {
        alert('No conflicts, data is up to date.');
    }

    displayQuotes();
}

// Button listeners for triggering actions
document.getElementById('syncQuotesButton').addEventListener('click', function() {
    syncQuotes();
});

document.getElementById('postQuoteButton').addEventListener('click', function() {
    const quote = prompt('Enter a new quote:');
    if (quote) {
        postNewQuote(quote);
    }
});

// Initialize the app by displaying existing quotes
function initialize() {
    displayQuotes();
}

// Call the initialize function when the page loads
initialize();

