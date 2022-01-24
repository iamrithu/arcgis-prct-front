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

  document
    .querySelector("#register_button")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      var data = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: eMail.value,
        password: password.value,
      };
      try {
        const { data: res } = await axios.post(
          "https://map-arcgis.herokuapp.com/api/newUser",
          data
        );
        localStorage.setItem("token", res.data);
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
        Email.value = eMail.value;
        Password.value = password.value;
        console.log(res.message);
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          alert(error.response.data.message);
          document.getElementById("message2").innerText =
            error.response.data.message;
          setInterval(() => {
            document.getElementById("message2").innerText = "";
          }, 2000);
          console.log(error.response.data.message);
        }
      }
    });

  var value = false;
  document
    .querySelector("#login_button")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      localStorage.setItem("user-mail", Email.value);

      var data = {
        email: Email.value,
        password: Password.value,
      };
      try {
        const { data: res } = await axios.post(
          "https://map-arcgis.herokuapp.com/api/auth",
          data
        );
        console.log(res.data.token);
        value = true;
        window.location.href = "./dashboard/dashboard.html";
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          alert(error.response.data.message);
          document.getElementById("message").innerText =
            error.response.data.message;
          setInterval(() => {
            document.getElementById("message").innerText = "";
          }, 2000);
          console.log(error.response.data.message);
        }
      }
      if (value === true) {
        localStorage.setItem("mail", Email.value);
        console.log(localStorage.getItem("mail"));
      } else {
      }
    });
});
