document.getElementById("vulnerability").addEventListener("change", function () {
    const vulnerability = this.value;
    console.log("trenutno: ", vulnerability);
    localStorage.setItem("vulnerability", vulnerability);
  });
  
  document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const vulnerability = localStorage.getItem("vulnerability") || "none";
  
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-demo-vulnerability": vulnerability
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {
      if (response.status === 401) {
        return response.text().then(errorText => {
          alert(errorText); 
          throw new Error(errorText);
        });
      } else if (!response.ok) {
        return response.text().then(errorText => {
          if (errorText.includes("Invalid CSRF token")) {
            alert("Invalid CSRF token");
          } else {
            alert("Greška: " + errorText);
          }
          throw new Error(errorText);
        });
      }
      if (response.redirected) {
        window.location.href = response.url;
      }
    })
    .catch(error => {
      console.error("Greška prilikom prijave:", error);
    });
  });
  
  window.addEventListener("load", () => {
    localStorage.clear();
  });
  