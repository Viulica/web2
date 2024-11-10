async function fetchCsrfToken() {
  const response = await fetch('/user/get-csrf-token');
  const data = await response.json();
  return data.csrfToken;
}

document.getElementById("change-email-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("new-email").value; 
  const csrfToken = await fetchCsrfToken(); 

  if (!csrfToken) {
    alert("CSRF token nije pronađen. Molimo osvježite stranicu.");
    return;
  }

  fetch("/user/change-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "csrf-token": csrfToken 
    },
    body: JSON.stringify({ email })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Greška prilikom promjene e-mail adrese.");
      }
      return response.json();
    })
    .then(data => {
      const resultDiv = document.getElementById("result");
      resultDiv.style.display = "block";
      resultDiv.innerHTML = `
        <p>${data.message}</p>
        <p>Stara e-mail adresa: ${data.oldEmail}</p>
        <p>Nova e-mail adresa: ${data.newEmail}</p>
      `;
    })
    .catch(error => {
      console.error("Greška prilikom promjene e-mail adrese:", error);
      alert("Došlo je do greške prilikom promjene e-mail adrese.");
    });
});
