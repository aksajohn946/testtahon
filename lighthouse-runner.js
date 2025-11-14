import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";
import fs from "fs";

export async function runLighthouse(page) {
    console.log(`💡 Running Lighthouse for page: ${page}`);

    let url = "";
    if (page === "login") {
        url = "https://demoapp-ashen.vercel.app/login/";
    } else if (page === "home") {
        url = "https://demoapp-ashen.vercel.app/";
    } else {
        console.log("❌ Invalid PAGE for Lighthouse");
        process.exit(1);  // Exit with failure for invalid page
    }

    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const options = {
        logLevel: "info",
        output: "json",
        onlyCategories: ["performance"],
        port: chrome.port
    };

    try {
        const runnerResult = await lighthouse(url, options);
        const reportJson = runnerResult.report;
        const lightHouseOutputPath = `lighthouse/lh-report-${page}.json`;

        if (!fs.existsSync("lighthouse")) fs.mkdirSync("lighthouse");

        fs.writeFileSync(lightHouseOutputPath, reportJson);

        console.log(`📄 Lighthouse report saved → ${lightHouseOutputPath}`);

        const reportData = JSON.parse(reportJson);

        // Example assertion: fail if performance score less than 0.9 (90%)
        const performanceScore = reportData.categories.performance.score;
        if (performanceScore < 0.9) {
            console.log(`❌ Performance score too low: ${performanceScore}`);
            process.exit(1);  // Exit failure to fail CI
        }

        return reportData;
    } catch (err) {
        console.log("❌ Lighthouse Failed:", err);
        process.exit(1);  // Exit failure on exceptions
    } finally {
        await chrome.kill();
    }
}
