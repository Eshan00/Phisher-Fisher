chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      const url = new URL(details.url);
  
      // Check if the domain is suspicious
      if (isSuspiciousDomain(url.hostname)) {
        notifyUser("Warning: Suspicious domain detected!", details.url);
  
        // Optionally check URL reputation (e.g., VirusTotal API)
        checkURLReputation(details.url).then((reputation) => {
          if (reputation.malicious > 0) {
            notifyUser(`This URL has a reputation issue!`, details.url);
          }
        });
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
  
  function isSuspiciousDomain(domain) {
    const suspiciousKeywords = ["free", "offer", "login", "secure"]; // Example keywords
    return suspiciousKeywords.some((keyword) => domain.includes(keyword));
  }
  
  function notifyUser(message, url) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Security Alert",
      message: `${message}\nURL: ${url}`,
    });
  }
  
  async function checkURLReputation(url) {
    const encodedUrl = encodeURIComponent(url); // URL must be base64 encoded for VirusTotal API
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
      method: "GET",
      headers: {
        "x-apikey": "c71109076a49f1baf335505a978d41e652af4a6ea060cb29013f833155d5a512", // Replace with your actual API key
      },
    });
    const result = await response.json();
    return result.data.attributes.last_analysis_stats;
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setIcon({ path: "icon.png" });
  });
  
  // Listen to status changes and update the icon accordingly
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.status === "Suspicious") {
      chrome.action.setIcon({ path: "icon_red.png" }); // Example red icon for suspicious
    } else {
      chrome.action.setIcon({ path: "icon_green.png" }); // Example green icon for safe
    }
  });
  