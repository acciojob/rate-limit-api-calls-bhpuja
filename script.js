//your JS code here. If required.


document.addEventListener("DOMContentLoaded", () => {
    const fetchButton = document.getElementById("fetch-button");
    const clickCountDisplay = document.getElementById("click-count");
    const resultsDiv = document.getElementById("results");

    let clickCount = 0;
    let apiCallCount = 0;
    let queue = [];
    let lastResetTime = Date.now();

    function fetchData() {
        const currentTime = Date.now();

        // Reset counters every 10 seconds
        if (currentTime - lastResetTime >= 10000) {
            apiCallCount = 0;
            clickCount = 0;
            lastResetTime = currentTime;
            clickCountDisplay.textContent = clickCount;
        }

        // Block additional requests if 5 calls already made
        if (apiCallCount >= 5) {
            alert("Too many API calls. Please wait and try again.");
            return;
        }

        clickCount++;
        clickCountDisplay.textContent = clickCount;

        queue.push(() => fetch("https://jsonplaceholder.typicode.com/todos/1")
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
        if (queue.length === 0 || apiCallCount >= 5) return;

        apiCallCount++;
        const task = queue.shift();
        task();

        setTimeout(() => {
            processQueue();
        }, 2000); // 2-second delay per API call (5 calls in 10 seconds)
    }

    fetchButton.addEventListener("click", fetchData);

    setInterval(() => {
        clickCount = 0;
        apiCallCount = 0;
        lastResetTime = Date.now();
        clickCountDisplay.textContent = clickCount;
    }, 10000); // Reset count every 10 seconds
});
