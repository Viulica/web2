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
      if (!response.ok) {
        return response.json().then(errorData => {
          alert(errorData.error || "Greška prilikom prijave");
          throw new Error(errorData.error);
        });
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      window.location.href = data.redirectUrl;
    })
    .catch(error => {
      console.error("Greška prilikom prijave:", error);
    });
  });
  
  window.addEventListener("load", () => {
    localStorage.clear();
  });
  