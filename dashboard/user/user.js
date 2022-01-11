var userId = localStorage.getItem("user-id");
var projectName = document.getElementById("project_name");
var baseMap = document.getElementById("select");

axios.get("http://localhost:8080/user/project/" + userId).then((res) => {
  var data = res.data;
  document.getElementById("div1").innerHTML = data.map((info) => {
    return `  <div id="container">     <div id="project-details">       <div id="details">         <p class="p-name">Project-Name</p> <p>
      : 
     ${info.projectName}
      </p>       </div>       <div id="details">         <p class="p-name">Project-ID </p>         <p class="project-id">
      : 
    ${info._id}
      </p>       </div>       <div id="details"> <p class="p-name">Base-Map </p> <p>  
      : 
     ${info.baseMap}
      </p> </div></div><div id="functions"><div id="edit">
      <button  class ="clcbtn" value="${info._id}" onclick="edit(this.value)"> <i class="fas fa-pencil-alt"></i></button>
      <button   class="clcbtn"value="${info._id}" onclick="del(this.value)"><i class="fas fa-trash-alt"></i></button>
      </div>
      <input
      type="button"
      name="${info.baseMap}"
      onclick="Send(this.name)"
      class="btn"
      value="Open"
    /></div> </div>`;
  });
});

function Send(x) {
  localStorage.setItem("map", x);

  window.location.href = "../map/basemap.html";
}

function cross() {
  setTimeout(() => {
    document.getElementById("project").style.display = "none";
  }, 300);
  document.getElementById("carryBox").style.animationName = "myNew";
}
function edit(x) {
  localStorage.setItem("projectID", x);
  axios.get("http://localhost:8080/user/project/details/" + x).then((res) => {
    res.data.map((info) => {
      projectName.value = info.projectName;
      baseMap.value = info.baseMap;
    });
  });
  document.getElementById("project").style.display = "flex";
  document.getElementById("carryBox").style.animationName = "carry";
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
        console.log(localStorage.getItem("user-mail"));
        console.log(res.data._id);
        var data = {
          userId: res.data._id,
          projectName: projectName.value,
          baseMap: baseMap.value,
        };
        axios
          .put(
            "http://localhost:8080/user/project/" +
              localStorage.getItem("projectID"),
            data
          )
          .then((res) => {
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
function del(x) {
  axios.delete("http://localhost:8080/user/project/" + x).then((res) => {
    window.location.href = "../user/project.html";
  });
}

// <iframe id="preview" src="../map/basemap.html"> hi</iframe>
