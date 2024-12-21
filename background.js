chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      const url = new URL(details.url);
  
      // checks domain legitemacy/looks out for suspecious website domains.
      if (isSuspiciousDomain(url.hostname)) {
        notifyUser("Warning: Suspicious domain detected!", details.url);
  
        // Optionally checks URL reputation (uses TotalVirus API)
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
    const suspiciousKeywords = ["free", "offer", "login", "secure"]; // keywords (can be edited, add more to the list)
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
    const encodedUrl = encodeURIComponent(url); 
    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
      method: "GET",
      headers: {
        "x-apikey": "YOUR_API_KEY", // Replace that with your unique VirusTotal API key.
      },
    });
    const result = await response.json();
    return result.data.attributes.last_analysis_stats;
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setIcon({ path: "icon.png" });
  });
  
  // Checks status of the site and sets an according icon (red for danger, green for safe)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.status === "Suspicious") {
      chrome.action.setIcon({ path: "icon_red.png" }); // suspecious
    } else {
      chrome.action.setIcon({ path: "icon_green.png" }); // safe
    }
  });
  
