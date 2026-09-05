const analyzeButton = document.getElementById("analyzeButton");
const clearButton = document.getElementById("clearButton");

const logInput = document.getElementById("logInput");

const totalRequests = document.getElementById("totalRequests");
const failedRequests = document.getElementById("failedRequests");
const suspiciousIPs = document.getElementById("suspiciousIPs");
const serverErrors = document.getElementById("serverErrors");

const trafficDisplay = document.getElementById("trafficDisplay");
const suspiciousActivity = document.getElementById("suspiciousActivity");

const logTableBody = document.getElementById("logTableBody");


/* --------------------------------
   SAMPLE LOG DATA
-------------------------------- */

const sampleLogs = `
192.168.1.10 - - [24/Aug/2026:10:15:32] "GET /index.html HTTP/1.1" 200 4521
192.168.1.15 - - [24/Aug/2026:10:16:02] "GET /login HTTP/1.1" 401 842
192.168.1.15 - - [24/Aug/2026:10:16:05] "GET /login HTTP/1.1" 401 842
192.168.1.15 - - [24/Aug/2026:10:16:08] "GET /login HTTP/1.1" 401 842
192.168.1.20 - - [24/Aug/2026:10:17:21] "GET /dashboard HTTP/1.1" 200 5210
192.168.1.25 - - [24/Aug/2026:10:18:44] "GET /admin HTTP/1.1" 403 1024
192.168.1.30 - - [24/Aug/2026:10:19:12] "POST /login HTTP/1.1" 200 1234
192.168.1.40 - - [24/Aug/2026:10:20:31] "GET /missing-page HTTP/1.1" 404 721
192.168.1.50 - - [24/Aug/2026:10:21:45] "GET /api/users HTTP/1.1" 500 512
`;


/* --------------------------------
   PARSE ONE LOG LINE
-------------------------------- */

function parseLogLine(line) {

    const pattern =
        /^(\S+)\s+-\s+-\s+\[([^\]]+)\]\s+"(\S+)\s+(\S+)\s+([^"]+)"\s+(\d+)\s+(\d+)$/;

    const match = line.match(pattern);

    if (!match) {
        return null;
    }

    return {
        ip: match[1],
        time: match[2],
        method: match[3],
        path: match[4],
        protocol: match[5],
        status: Number(match[6]),
        size: Number(match[7])
    };
}


/* --------------------------------
   PARSE ALL LOGS
-------------------------------- */

function parseLogs(logText) {

    const lines = logText
        .trim()
        .split("\n");

    const logs = [];

    lines.forEach(function(line) {

        const parsedLog = parseLogLine(line.trim());

        if (parsedLog) {
            logs.push(parsedLog);
        }

    });

    return logs;
}


/* --------------------------------
   ANALYZE LOGS
-------------------------------- */

function analyzeLogs(logs) {

    const failed = logs.filter(function(log) {
        return log.status >= 400 && log.status < 500;
    });

    const serverErrorsFound = logs.filter(function(log) {
        return log.status >= 500;
    });


    /* Count requests by IP */

    const ipStats = {};

    logs.forEach(function(log) {

        if (!ipStats[log.ip]) {

            ipStats[log.ip] = {
                total: 0,
                failures: 0
            };

        }

        ipStats[log.ip].total++;

        if (log.status >= 400) {
            ipStats[log.ip].failures++;
        }

    });


    /* Find suspicious IPs */

    const suspicious = [];

    Object.keys(ipStats).forEach(function(ip) {

        const stats = ipStats[ip];

        if (stats.failures >= 3) {

            suspicious.push({
                ip: ip,
                failures: stats.failures,
                total: stats.total
            });

        }

    });


    return {
        total: logs.length,
        failed: failed.length,
        serverErrors: serverErrorsFound.length,
        suspiciousIPs: suspicious
    };
}


/* --------------------------------
   DISPLAY LOGS
-------------------------------- */

function displayLogs(logs) {

    logTableBody.innerHTML = "";

    logs.forEach(function(log) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${log.ip}</td>
            <td>${log.method}</td>
            <td>${log.path}</td>
            <td>${log.status}</td>
            <td>${log.time}</td>
        `;

        logTableBody.appendChild(row);

    });
}


/* --------------------------------
   DISPLAY SUSPICIOUS ACTIVITY
-------------------------------- */

function displaySuspiciousActivity(suspicious) {

    if (suspicious.length === 0) {

        suspiciousActivity.innerHTML =
            "<p>No suspicious activity detected.</p>";

        return;
    }


    suspiciousActivity.innerHTML = "";


    suspicious.forEach(function(item) {

        const alertBox = document.createElement("div");

        alertBox.className = "alert";

        alertBox.innerHTML = `
            <strong>Potential suspicious activity</strong>
            <p>IP Address: ${item.ip}</p>
            <p>Failed Requests: ${item.failures}</p>
            <p>Total Requests: ${item.total}</p>
        `;

        suspiciousActivity.appendChild(alertBox);

    });

}


/* --------------------------------
   ANALYZE BUTTON
-------------------------------- */

analyzeButton.addEventListener("click", function() {

    const input = logInput.value.trim();

    const dataToAnalyze = input || sampleLogs;

    const logs = parseLogs(dataToAnalyze);

    const results = analyzeLogs(logs);


    /* Update summary cards */

    totalRequests.textContent = results.total;

    failedRequests.textContent = results.failed;

    serverErrors.textContent = results.serverErrors;

    suspiciousIPs.textContent =
        results.suspiciousIPs.length;


    /* Update table */

    displayLogs(logs);


    /* Update suspicious activity */

    displaySuspiciousActivity(
        results.suspiciousIPs
    );


    /* Update traffic section */

    trafficDisplay.innerHTML = `
        <p><strong>Requests analyzed:</strong> ${results.total}</p>
        <p><strong>Failed requests:</strong> ${results.failed}</p>
        <p><strong>Server errors:</strong> ${results.serverErrors}</p>
    `;

});


/* --------------------------------
   LOAD SAMPLE DATA
-------------------------------- */

logInput.value = sampleLogs.trim();


/* --------------------------------
   CLEAR BUTTON
-------------------------------- */

clearButton.addEventListener("click", function() {

    logInput.value = "";

    totalRequests.textContent = "0";

    failedRequests.textContent = "0";

    suspiciousIPs.textContent = "0";

    serverErrors.textContent = "0";


    trafficDisplay.innerHTML =
        "<p>No log data analyzed yet.</p>";


    suspiciousActivity.innerHTML =
        "<p>No suspicious activity detected.</p>";


    logTableBody.innerHTML = "";

});