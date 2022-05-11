window.onload = function () {
  var tema = localStorage.getItem("tema");
  console.log(document.getElementById("btn_tema_span"));
  if (document.getElementById("btn_tema_span")) {
    console.log("sunt pe home");
    if (tema) {
      document.getElementById("btn_tema_span").classList.remove("fa-sun");
      document.getElementById("btn_tema_span").classList.add("fa-moon");
    }
  }
};
