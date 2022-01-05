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
      res.data.map((info, index) => {
        console.log(Email.value);

        if (Email.value === info.eMail) {
          if (true) {
            localStorage.setItem("mail", Email.value);
            window.location.href = "./screens/user/dashboard.html";
          }
        } else {
        }
      });
    });
  });
});
