
const currentUrl = window.location.hostname;
const visitLimit = 3;

const today = new Date().toISOString().split("T")[0];

chrome.storage.local.get([currentUrl], function (result) {
    console.log("Storage result:", result);

    let visitData = result[currentUrl] || { visitCount: 0, lastVisitDate: null };
    let visitCount = visitData.visitCount;
    const lastVisitDate = visitData.lastVisitDate;

    console.log("Last visit date:", lastVisitDate);
    console.log("Today's date:", today);

    if (!lastVisitDate || lastVisitDate !== today) {
        visitCount = 0;
    }

    visitCount++;

    chrome.storage.local.set(
        { [currentUrl]: { visitCount: visitCount, lastVisitDate: today } },
        function () {
            console.log(`Visit count for ${currentUrl}: ${visitCount}`);

            showPopup(visitCount);

            if (visitCount > visitLimit) {
                blockPage();
            }
        });
});

function showPopup(visitCount) {
    const popup = document.createElement("div");
    popup.innerHTML = `You have visited this site <strong>${visitCount}</strong> time${visitCount === 1 ? "" : "s"} today.\n
    <br> You have <strong>${visitLimit - visitCount}</strong> visit${visitLimit - visitCount === 1 ? "" : "s"} remaining.`;
    const popupStyles = {
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "18px",
        zIndex: "9999",
        boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)"
    };

    Object.assign(popup.style, popupStyles);

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 3000);
}

function blockPage() {
    document.body.innerHTML = "";
    document.body.style.backgroundColor = "black";

    const container = document.createElement("div");

    const containerStyles = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "32px",
        color: "white",
        backgroundColor: "black",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    };

    Object.assign(container.style, containerStyles);

    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("icon.png");

    const iconStyles = {
        width: "100px",
        height: "100px",
        marginBottom: "20px"
    };

    Object.assign(icon.style, iconStyles);

    const message = document.createElement("div");
    message.innerText = `This page has been blocked by BetBlock as you have exceeded your daily limit of ${visitLimit} visits.`;

    container.appendChild(icon);
    container.appendChild(message);
    document.body.appendChild(container);
}
