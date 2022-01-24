var userId = localStorage.getItem("user-id");
var projectName = document.getElementById("project_name");
var baseMap = document.getElementById("select");

function projects() {
  axios.get("http://localhost:8080/api/project/" + userId).then((res) => {
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
          localStorage.setItem("obj", JSON.stringify(info));

          return ` <tr>
    <td>${info.projectName}</td>
    <td>${info.baseMap}</td>
    <td>${info.state}</td>
    <td>
      <button value="${info._id}" onclick="del(this.value)">
        <i class="far fa-trash-alt" id="trash" title="Remove"></i>
      </button>
     <button value="${info._id}" onclick="edit(this.value)   ">
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
}

projects();
function Edit(x) {
  axios.get("http://localhost:8080/api/project/details/" + x).then((res) => {
    localStorage.setItem("obj", JSON.stringify(res.data));
    var data = JSON.parse(localStorage.getItem("obj"));
    console.log(data);
    // window.open("", "_self").close();
    window.open("./editProject.html", "_top");
  });
}

function del(x) {
  axios
    .get("http://localhost:8080/api/geolocation/project/" + x)
    .then((res) => {
      res.data.map((info) => {
        axios
          .delete(
            "http://localhost:8080/api/geolocation/delete/all/" +
              info.project_id
          )
          .then((res) => {
            console.log("deleted");
            projects();
          });
      });
    });
  axios.delete("http://localhost:8080/api/project/delete/" + x).then((res) => {
    console.log("deleted");
    projects();
  });
}
function edit(x) {
  Edit(x);
}
function Send(x) {
  axios.get("http://localhost:8080/api/project/details/" + x).then((res) => {
    console.log(res.data);
    localStorage.setItem("map", JSON.stringify(res.data));

    window.open("../../map/index.html", "_block");
  });
}
