
/* =========================
   DATE
========================= */

const dateEl = document.getElementById("currentDate");

function updateDate() {
    const now = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    dateEl.textContent = now.toLocaleDateString(undefined, options);
}

updateDate();


/* =========================
   CLOCK
========================= */

const clockEl = document.getElementById("clock");

function updateClock() {
    const now = new Date();

    clockEl.textContent = now.toLocaleTimeString();
}

updateClock();

setInterval(updateClock, 1000);


/* =========================
   CALENDAR
========================= */

const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");


// Today's date
const today = new Date();


// Month/year currently being displayed
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();


// Month names
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


/* =========================
   RENDER CALENDAR
========================= */

function renderCalendar() {

    // Clear the existing calendar
    calendarGrid.innerHTML = "";


    // Find the weekday that the month starts on
    // 0 = Sunday
    // 1 = Monday
    // ...
    // 6 = Saturday
    const firstDay = new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();


    // Find the number of days in the month
    const totalDays = new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();


    // Update the calendar title
    calendarTitle.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;


    // Create empty cells before the first day
    for (let i = 0; i < firstDay; i++) {

        const emptyCell = document.createElement("div");

        calendarGrid.appendChild(emptyCell);
    }


    // Create the numbered days
    for (let day = 1; day <= totalDays; day++) {

        const dayElement = document.createElement("div");

        dayElement.textContent = day;


        // Highlight today's date
        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {
            dayElement.classList.add("today");
        }


        // Add the day to the calendar
        calendarGrid.appendChild(dayElement);
    }
}


/* =========================
   PREVIOUS MONTH
========================= */

prevBtn.addEventListener("click", () => {

    currentMonth--;

    // If we go before January,
    // move to December of the previous year
    if (currentMonth < 0) {

        currentMonth = 11;
        currentYear--;
    }

    renderCalendar();
});


/* =========================
   NEXT MONTH
========================= */

nextBtn.addEventListener("click", () => {

    currentMonth++;

    // If we go past December,
    // move to January of the next year
    if (currentMonth > 11) {

        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
});


/* =========================
   INITIAL RENDER
========================= */

renderCalendar();

/* ============================ */

const weatherElement = document.getElementById("weather");
const weatherData = {
    temperature: 72,
    conditions: "Clear sky",
    humidity: 48,
    wind: 6
};
const API_KEY = "a935bba53deb9b06766004f6c8608378";
const CITY = "Portland";

const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?q=${CITY}` +
    `&appid=${API_KEY}` +
    `&units=imperial`;

console.log("Requesting weather...");
console.log(url);

fetch(url)
    .then(response => {

        console.log("Response status:", response.status);

        return response.json();
    })
    .then(data => {

        console.log("OpenWeather response:", data);

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        const temperature = data.main.temp;
        const conditions = data.weather[0].description;

        weatherElement.innerHTML = `
            <p>${temperature}°F</p>
            <p>${conditions}</p>
        `;
    })
    .catch(error => {

        console.error("Weather error:", error);

        weatherElement.textContent =
            `Weather error: ${error.message}`;
    });

    console.log("Weather JavaScript is running");

    /* ======== TO DO LIST ==========*/

    const todoInput = document.getElementById("todoInput");
const addTodoButton = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");

addTodoButton.addEventListener("click", () => {

    const taskText = todoInput.value.trim();

    if (taskText === "") {
        return;
    }

    const listItem = document.createElement("li");

    listItem.textContent = taskText;

listItem.addEventListener("click", () => {
    listItem.classList.toggle("completed");
});

todoList.appendChild(listItem);

    todoInput.value = "";
});



/*=========Notes==============*/

const notes = document.getElementById("notes");

notes.value = localStorage.getItem("dashboardNotes") || "";

notes.addEventListener("input", () => {
    localStorage.setItem("dashboardNotes", notes.value);
});


/*=============QUOTE================*/

const quoteElement = document.getElementById("quote");
quoteElement.textContent = "This is a test quote.";
const quotes = [
    "The future depends on what you do today.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Believe you can and you're halfway there.",
    "The best way to predict the future is to create it.",
    "Great things are done by a series of small things brought together.",
    "It always seems impossible until it's done.",
    "Start where you are. Use what you have. Do what you can.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only way to do great work is to love what you do.",
    "A little progress each day adds up to big results."
];

const randomQuote =
    quotes[Math.floor(Math.random() * quotes.length)];

quoteElement.textContent = `"${randomQuote}"`;

/* =========================
   NEWS
========================= */

const newsList = document.getElementById("newsList");

const NEWS_API_KEY = "-ks7WGDvmEr1rqZE9VTZFMad72sOJh22qTmL-Lp29WWXm6z_";

const newsURL =
    `https://api.currentsapi.services/v1/latest-news` +
    `?language=en` +
    `&page_size=5`;

fetch(newsURL, {
    headers: {
        "Authorization": NEWS_API_KEY
    }
})
    .then(response => {

        if (!response.ok) {
            throw new Error(
                `News request failed: ${response.status}`
            );
        }

        return response.json();
    })
    .then(data => {

        console.log("News data:", data);

        newsList.innerHTML = "";

        data.news.forEach(story => {

            const article = document.createElement("article");

            article.classList.add("news-item");

            article.innerHTML = `
                <h3>${story.title}</h3>

                <p>
                    ${story.description || "No description available."}
                </p>

                <span>
                    ${story.author || "News source"}
                </span>
            `;

            newsList.appendChild(article);
        });
    })
    .catch(error => {

        console.error("News error:", error);

        newsList.innerHTML = `
            <article class="news-item">
                <h3>News unavailable</h3>
                <p>Unable to load the latest news right now.</p>
            </article>
        `;
    });