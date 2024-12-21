document.getElementById("check-now").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      if (isSuspiciousDomain(url.hostname)) {
        document.getElementById("status").textContent = "Status: Suspicious";
        document.getElementById("status").style.color = "red";
      } else {
        document.getElementById("status").textContent = "Status: All Clear";
        document.getElementById("status").style.color = "green";
      }

      // Get suspicious links from the page
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: findSuspiciousLinks
        },
        (results) => {
          const suspiciousLinks = results[0].result;
          displayLinks(suspiciousLinks);
        }
      );
    });
});

// Check if the domain is suspicious
function isSuspiciousDomain(domain) {
  const suspiciousKeywords = ["free", "offer", "login", "secure"];
  return suspiciousKeywords.some((keyword) => domain.includes(keyword));
}

// Find suspicious links on the page
function findSuspiciousLinks() {
  const suspiciousLinks = [];
  const allLinks = document.getElementsByTagName('a');
  
  for (let link of allLinks) {
    const url = link.href;
    if (isSuspiciousUrl(url)) {
      suspiciousLinks.push(url);
    }
  }
  return suspiciousLinks;
}

// Check if a URL is suspicious
function isSuspiciousUrl(url) {
  const suspiciousKeywords = ["login", "phishing", "offer", "free"];
  return suspiciousKeywords.some((keyword) => url.includes(keyword));
}

// Function to display suspicious links in the popup
function displayLinks(links) {
  const linkList = document.getElementById('link-list');
  linkList.innerHTML = '';  // Clear previous list
  
  if (links.length === 0) {
    linkList.innerHTML = '<li>No suspicious links found.</li>';
  } else {
    links.forEach(url => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
      linkList.appendChild(li);
    });
  }
}
