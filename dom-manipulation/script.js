document.addEventListener('DOMContentLoaded', function () {

    // Sample data from the server (simulated)
    const serverQuotes = [
        { id: 1, text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { id: 2, text: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "William Butler Yeats" },
        { id: 3, text: "Everything you can imagine is real.", author: "Pablo Picasso" }
    ];

    // Simulating a fetch from server after a delay
    function fetchQuotesFromServer() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(serverQuotes);
            }, 2000);  // Simulating server delay
        });
    }

    // Function to display quotes on the page
    function displayQuotes(quotes) {
        const quotesList = document.getElementById('quotesList');
        quotesList.innerHTML = '';  // Clear the existing quotes
        quotes.forEach(quote => {
            const quoteDiv = document.createElement('div');
            quoteDiv.classList.add('quote');
            quoteDiv.innerHTML = `<p>"${quote.text}"</p><span>- ${quote.author}</span>`;
            quotesList.appendChild(quoteDiv);
        });
    }

    // Fetch quotes and display them
    function syncQuotes() {
        fetchQuotesFromServer()
            .then(quotes => {
                displayQuotes(quotes);
                alert("Quotes have been synced successfully!");
            })
            .catch(err => {
                console.error("Error fetching quotes:", err);
            });
    }

    // Attach the event listener to the button
    const syncButton = document.getElementById('syncButton');
    if (syncButton) {
        syncButton.addEventListener('click', syncQuotes);
    }
});
