document.getElementById("logOut").addEventListener("click", function () {
    localStorage.removeItem("session");
    // Optionally redirect to login or home page
    window.location.href = "/pages/home_page.html";
  });

  document.getElementById("logOut-sm").addEventListener("click", function () {
    localStorage.removeItem("session");
    // Optionally redirect to login or home page
    window.location.href = "/pages/home_page.html";
  });