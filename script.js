//your JS code here. If required.
document.addEventListener("DOMContentLoaded", () => {
    const fetchButton = document.getElementById("fetch-button");
    const clickCountDisplay = document.getElementById("click-count");
    const resultsDiv = document.getElementById("results");

    let clickCount = 0;
    let apiQueue = [];
    let isProcessing = false;

    function fetchData() {
        if (clickCount >= 5) {
            alert("Too many API calls. Please wait and try again.");
            return;
        }

        clickCount++;
        clickCountDisplay.textContent = clickCount;

        apiQueue.push(() => fetch("https://jsonplaceholder.typicode.com/todos/1")
            .then(response => response.json())
            .then(data => {
                const p = document.createElement("p");
                p.textContent = `Fetched: ${data.title}`;
                resultsDiv.appendChild(p);
            })
            .catch(error => console.error("Error:", error))
        );

        processQueue();
    }

    function processQueue() {
        if (isProcessing) return;
        isProcessing = true;

        let interval = setInterval(() => {
            if (apiQueue.length === 0) {
                clearInterval(interval);
                isProcessing = false;
                return;
            }

            const task = apiQueue.shift();
            task();
        }, 2000); // 2-second delay per API call (5 calls in 10 seconds)
    }

    fetchButton.addEventListener("click", fetchData);

    setInterval(() => {
        clickCount = 0;
        clickCountDisplay.textContent = clickCount;
    }, 10000); // Reset count every 10 seconds
});
