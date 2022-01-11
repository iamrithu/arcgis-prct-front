var width = true;
var ifram = document.getElementById("ifm");
var img = document.getElementById("image");
var logo = document.getElementById("logo");
var nav = document.getElementById("nav");
var slidbar = document.getElementById("slidbar");
var nav_list = document.querySelectorAll(".nav-list");
var container = document.getElementById("container");
var nav_name = document.querySelectorAll(".nav-name");
var nav_icon = document.querySelectorAll(".nav-icon");
var projectName = document.querySelector("#project_name");
var baseMap = document.querySelector("#select");

var useName = document.getElementById("userName");

axios
  .get(
    "http://localhost:8080/user/register/" + localStorage.getItem("user-mail")
  )
  .then((res) => {
    var data = {
      firstName: res.data.firstName,
      lastName: res.data.lastName,
      userId: res.data._id,
    };
    console.log(data);

    localStorage.setItem("user-id", data.userId);

    useName.innerText = data.firstName;
  });

for (const button of nav_list) {
  button.addEventListener("click", function (e) {
    let overlay = document.createElement("span");
    let left = e.clientX - button.getBoundingClientRect().left;
    let top = e.clientY - button.getBoundingClientRect().top;
    overlay.style.cssText = `
    position: absolute;
    height: 100px;
    width: 100px;
    top:${top}px;
    left:${left}px;
    transform: translate(-50%,-50%);
    background-color: rgba(90, 191, 238,0.4);
    z-index:-1;
    border-radius:50% ;
    opacity: 1;
    animation:button_animation 0.4s ease;
    `;

    overlay.addEventListener("animationend", (e) => {
      e.target.remove();
    });
    button.appendChild(overlay);
  });
}
for (var i = 0; i < nav_list.length; i++) {
  nav_list[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

function save() {
  if (width === true) {
    width = false;
    // logo.style.transition = "0.3s";

    logo.style.width = "5.1%";
    slidbar.style.width = "5%";
    img.setAttribute("src", "../assets/download (1).png");
    img.style.width = "70%";
    img.style.height = "70%";
    for (var i = 0; i < nav_name.length; i++) {
      nav_name[i].style.display = "none";
      nav_icon[i].style.width = "100%";
    }
  } else {
    width = true;
    logo.style.width = "14.1%";
    slidbar.style.width = "14%";
    img.style.width = "80%";
    img.style.height = "80%";
    img.setAttribute("src", "../assets/download.png");

    for (var i = 0; i < nav_name.length; i++) {
      nav_name[i].style.display = "flex";

      nav_icon[i].style.width = "32%";
    }
  }
}
document.getElementById("Menu").addEventListener("click", (e) => {
  let overlay = document.createElement("span");
  let left =
    e.clientX - document.getElementById("Menu").getBoundingClientRect().left;
  let top =
    e.clientY - document.getElementById("Menu").getBoundingClientRect().top;
  overlay.style.cssText = `
    position: absolute;
    height: 50px;
    width: 50px;
    top:${top}px;
    left:${left}px;
    transform: translate(-50%,-50%);
    background-color: rgba(90, 191, 238,0.7);
    z-index:-1;
    border-radius:50% ;
    opacity: 1;
    animation:button_animation 0.5s ease;
    `;

  overlay.addEventListener("animationend", (e) => {
    e.target.remove();
  });
  document.getElementById("Menu").appendChild(overlay);
});
function project() {
  document.getElementById("project").style.display = "flex";
  document.getElementById("carryBox").style.animationName = "carry";
}
function cross() {
  setTimeout(() => {
    document.getElementById("project").style.display = "none";
  }, 300);
  document.getElementById("carryBox").style.animationName = "myNew";
}
//

function send() {
  if (projectName.value != "" && baseMap.value != "") {
    axios
      .get(
        "http://localhost:8080/user/register/" +
          localStorage.getItem("user-mail")
      )
      .then((res) => {
        var data = {
          userId: res.data._id,
          projectName: projectName.value,
          baseMap: baseMap.value,
        };
        axios.post("http://localhost:8080/user/project", data).then((res) => {
          localStorage.setItem("id", res.data.userId);
          projectName.value = "";
          baseMap.value = "";

          setTimeout(() => {
            document.getElementById("project").style.display = "none";
          }, 250);
        });
      });
    document.getElementById("carryBox").style.animationName = "myNew";
  } else {
    alert("fill the values");
  }
}
var value = true;
var card = document.getElementById("card");
function flip() {
  if (value === true) {
    document.querySelector("#user-details").style.zIndex = "1";
    card.style.transform = "rotateY(180deg)";
    card.style.transition = "0.4s";

    value = false;
  } else {
    card.style.transform = "rotateY(0deg)";
    setTimeout(hello, 200);
    value = true;
  }
}

function hello() {
  document.querySelector("#user-details").style.zIndex = "-1";
}
//dashboard
document.querySelector(".dashboard").addEventListener("click", () => {
  ifram.setAttribute("src", "../dashboard/map/map.html");
});

//project
document.querySelector(".project").addEventListener("click", () => {
  ifram.setAttribute("src", "./user/project.html");
});
