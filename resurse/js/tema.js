window.onload = function () {
  document.getElementById("btn_tema").onclick = function () {
    var tema = localStorage.getItem("tema");
    if (tema) {
      localStorage.removeItem("tema");
    } else {
      localStorage.setItem("tema", "dark");
    }
    document.getElementById("btn_tema_span").classList.toggle("fa-sun");
    document.getElementById("btn_tema_span").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");
  };
  if (document.getElementById("btn_tema_span")) {
    var tema = localStorage.getItem("tema");
    if (tema) {
      document.getElementById("btn_tema_span").classList.add("fa-sun");
      document.getElementById("btn_tema_span").classList.remove("fa-moon");
    } else {
      document.getElementById("btn_tema_span").classList.remove("fa-sun");
      document.getElementById("btn_tema_span").classList.add("fa-moon");
    }
  }
};
