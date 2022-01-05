//
var id = localStorage.getItem("id");

axios.get("http://localhost:8000/user/project/" + id).then((res) => {
  res.data.map((info) => {
    console.log(info._id);
  });
});
