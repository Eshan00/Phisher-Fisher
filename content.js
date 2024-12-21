document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    if (isSuspiciousDomain(new URL(link.href).hostname)) {
      link.style.border = "2px solid red";
      link.title = "Potential phishing link.";
    }
  });
});

function isSuspiciousDomain(domain) {
  const suspiciousKeywords = ["free", "offer", "login", "secure"];
  return suspiciousKeywords.some((keyword) => domain.includes(keyword));
}