const form = document.getElementById("serviceForm");
const statusText = document.getElementById("formStatus");
document.getElementById("year").textContent = new Date().getFullYear();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusText.textContent = "Submitting request...";

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name"),
    mobile: formData.get("mobile"),
    email: formData.get("email"),
    service: formData.get("service"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch("/api/agent-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      statusText.textContent = result.message || "Unable to submit request.";
      statusText.style.color = "#b00020";
      return;
    }

    statusText.textContent = "Request submitted successfully. Our team will contact you soon.";
    statusText.style.color = "#0d7f34";
    form.reset();
  } catch (error) {
    statusText.textContent = "Network error. Please try again.";
    statusText.style.color = "#b00020";
  }
});
