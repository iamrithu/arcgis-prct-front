var projectName = document.querySelector("#projectName");
var baseMap = document.querySelector("#select");
var UserMail = localStorage.getItem("mail");

function save() {
  console.log(baseMap.value);
  axios.get("http://localhost:8000/user/register/" + UserMail).then((res) => {
    var data = {
      userId: res.data._id,
      projectName: projectName.value,
      baseMap: baseMap.value,
    };
    axios.post("http://localhost:8000/user/project", data).then((res) => {
      localStorage.setItem("id", res.data.userId);
    });
  });
}
