
const currentUrl = window.location.hostname;
const visitLimit = 3;

chrome.storage.local.get([currentUrl], function (result) {
    let visitCount = result[currentUrl] ? result[currentUrl] : 0;
    visitCount++;

    chrome.storage.local.set({ [currentUrl]: visitCount }, function () {
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
    popup.style.position = "fixed";
    popup.style.top = "10px";
    popup.style.right = "10px";
    popup.style.background = "rgba(0, 0, 0, 0.8)";
    popup.style.color = "white";
    popup.style.padding = "15px";
    popup.style.borderRadius = "8px";
    popup.style.fontSize = "18px";
    popup.style.zIndex = "9999";
    popup.style.boxShadow = "0px 0px 10px rgba(255, 255, 255, 0.5)";

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 3000);
}

function blockPage() {
    document.body.innerHTML = "";
    document.body.style.backgroundColor = "black";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.fontSize = "32px";
    container.style.color = "white";
    container.style.backgroundColor = "black";
    container.style.padding = "20px";
    container.style.borderRadius = "10px";
    container.style.textAlign = "center";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";

    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("icon.png");
    icon.style.width = "100px";
    icon.style.height = "100px";
    icon.style.marginBottom = "20px";

    const message = document.createElement("div");
    message.innerText = `This page has been blocked by BetBlock as you have exceeded your daily limit of ${visitLimit} visits.`;

    container.appendChild(icon);
    container.appendChild(message);
    document.body.appendChild(container);
}
