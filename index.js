document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login");
  const createAccountForm = document.querySelector("#createAccount");

  document
    .querySelector("#linkCreateAccount")
    .addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.add("form--hidden");
      createAccountForm.classList.remove("form--hidden");
    });

  document.querySelector("#linkLogin").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("form--hidden");
    createAccountForm.classList.add("form--hidden");
  });

  var firstName = document.getElementById("firstname");
  var lastName = document.getElementById("lastname");
  var eMail = document.getElementById("email");
  var password = document.getElementById("password");
  var Password = document.getElementById("l_password");
  var Email = document.getElementById("l_email");

  document.querySelector("#register_button").addEventListener("click", (e) => {
    e.preventDefault();

    var data = {
      firstName: firstName.value,
      lastName: lastName.value,
      eMail: eMail.value,
      password: password.value,
    };
    axios.post("http://localhost:8000/user/register", data).then((res) => {
      console.log("success");
    });
  });

  document.querySelector("#login_button").addEventListener("click", (e) => {
    e.preventDefault();
    axios.get("http://localhost:8000/user/register").then((res) => {
      var data = res.data;

      for (var i = 0; i < data.length; i++) {
        if (
          Email.value === data[i].eMail &&
          Password.value === data[i].password
        ) {
          localStorage.setItem("mail", Email.value);
          document.getElementById("l_email").value = "";
          document.getElementById("l_password").value = "";
          document.getElementById("l_email").style.border = "1px solid green";
          document.getElementById("l_password").style.border =
            "1px solid green";
          window.location.href = "./dashboard/dashboard.html";
        }
      }
    });
  });
});
