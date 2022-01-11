var userId = localStorage.getItem("user-id");
var projectName = document.getElementById("project_name");
var baseMap = document.getElementById("select");

axios.get("http://localhost:8080/user/project/" + userId).then((res) => {
  var data = res.data;
  document.getElementById("table").innerHTML =
    `<tr>
  <th style="width: 25%">Title</th>
  <th style="width: 25%">Base map</th>
  <th style="width: 25%">Location</th>
  <th style="width: 25%">Action</th>
</tr>` +
    data
      .map((info) => {
        return ` <tr>
    <td>${info.projectName}</td>
    <td>${info.baseMap}</td>
    <td>${info.state}</td>
    <td>
      <button value="${info._id}" onclick="del(this.value)">
        <i class="far fa-trash-alt" id="trash" title="Remove"></i>
      </button>
      <button value="${info._id}" onclick="edit(this.value)  ">
        <i class="far fa-edit" id="edit" title="Edit"></i>
      </button>
      <button value="${info._id}" onclick="Send(this.value) ">
        <i class="fas fa-external-link-alt" id="move"  title="GO"></i>
      </button>
    </td>
    </tr>`;
      })
      .join(" ");
});

function Send(x) {
  localStorage.setItem("project_id", x);

  window.location.href = "../map/map.html";
}

function cross() {
  setTimeout(() => {
    document.getElementById("project").style.display = "none";
  }, 300);
  document.getElementById("carryBox").style.animationName = "myNew";
}
function edit(x) {
  alert(x);
  // localStorage.setItem("projectID", x);
  // axios.get("http://localhost:8080/user/project/details/" + x).then((res) => {
  //   res.data.map((info) => {
  //     projectName.value = info.projectName;
  //     baseMap.value = info.baseMap;
  //   });
  // });
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

// // <iframe id="preview" src="../map/basemap.html"> hi</iframe>
