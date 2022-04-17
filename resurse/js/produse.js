function stringContainsNumber(_string) {
  return /\d/.test(_string);
}

window.onload = function () {
  document.getElementById("inp-pret").onchange = function () {
    document.getElementById("infoRange").innerHTML =
      "(" + this.value * 1000 + ")";
  };

  document.getElementById("filtrare").onclick = function () {
    var valNume = document.getElementById("inp-nume").value.toLowerCase();
    if (stringContainsNumber(valNume)) {
      console.log("non bueno");
      alert("bad input");
    }
    
    var butoaneRadio = document.getElementsByName("gr_rad");
    for (let rad of butoaneRadio) {
      if (rad.checked) {
        var valCalorii = rad.value;
        break;
      }
    }
    if (valCalorii != "toate") {
      var minCalorii, maxCalorii;
      [minCalorii, maxCalorii] = valCalorii.split(":");
      minCalorii = parseInt(minCalorii);
      maxCalorii = parseInt(maxCalorii);
    } else {
      minCalorii = 0;
      maxCalorii = 100000000;
    }

    var valPret = parseInt(document.getElementById("inp-pret").value) * 1000;
    var valCategorie = document.getElementById("inp-categorie").value;
    var keywords = document.getElementById("input_keywords").value.split(" ");
    for (let k of keywords) {
      console.log(k);
      if (stringContainsNumber(k)) {
        console.log("non bueno");
        alert("bad input");
        break;
      }
    }
    var newsChecked = document.getElementById("input-news").checked;
    var valModels = document.getElementById("input_models").value;
    var optionsMultipleSelect = document.getElementById(
      "inp-categorie-multiplu"
    );
    var valMultipleSelect = [];
    for (let i = 0; i < optionsMultipleSelect.length; ++i) {
      if (optionsMultipleSelect[i].selected) {
        valMultipleSelect.push(optionsMultipleSelect[i].value);
      }
    }
    // console.log("valMultipleSelect", valMultipleSelect);
    // console.log("models", valModels);
    // console.log("valcategorie", valCategorie);
    // console.log("newschecked", newsChecked);
    //console.log(keywords);
    // console.log(valPret, valCategorie);
    var articole = document.getElementsByClassName("produs");
    // console.log(articole);
    for (let art of articole) {
      art.style.display = "none";
      let numeArt = art
        .getElementsByClassName("val-nume")[0]
        .innerHTML.toLowerCase();
      let cond1 = numeArt.startsWith(valNume);
      // console.log("wtf", numeArt, valNume, cond1);
      let caloriiArt = parseInt(
        art.getElementsByClassName("val-calorii")[0].innerHTML
      );
      // console.log(art.getElementsByClassName("val-calorii")[0].innerHTML);
      // console.log(cond1, caloriiArt);
      let cond2 = minCalorii <= caloriiArt && caloriiArt < maxCalorii;
      // console.log(cond2);
      // console.log(art.getElementsByClassName("val-pret")[0].innerHTML);
      let pretart = parseInt(
        art.getElementsByClassName("val-pret")[0].innerHTML
      );
      let cond3 = valPret <= pretart;
      let categorieArt =
        art.getElementsByClassName("val-categorie")[0].innerHTML;

      let cond4 = valCategorie == "toate" || categorieArt == valCategorie;

      let description = art
        .getElementsByClassName("val-descriere")[0]
        .innerHTML.split(" ");
      // console.log(description);

      let condKeywords = false;
      for (let i = 0; i < keywords.length; ++i) {
        if (description.includes(keywords[i])) {
          condKeywords = true;
          break;
        }
      }
      if (description.length == 1 || keywords.length == 1) {
        condKeywords = true;
      }

      // console.log("condKeywords", condKeywords);
      let valDate = new Date(
        art.getElementsByClassName("val-date")[0].innerHTML
      );

      const newsDate = new Date("April 16, 2022 23:15:30");
      // console.log("cand doctore?", valDate, newsDate);

      let condNews = false;
      if (newsChecked == false) {
        condNews = true;
      } else {
        if (newsDate.getTime() <= valDate.getTime()) {
          condNews = true;
        }
      }

      let artModel = art.getElementsByClassName("val-tipprodus")[0].innerHTML;
      // console.log("valModels", valModels);
      // console.log("artModel", artModel);
      let condModels = false;
      if (valModels == "" || artModel == valModels) {
        condModels = true;
      }
      let condMultipleSelect = false;
      for (let i = 0; i < valMultipleSelect.length; ++i) {
        if (valMultipleSelect[i] == categorieArt) {
          condMultipleSelect = true;
        }
        if (valMultipleSelect[i] == "oricare") {
          condMultipleSelect = true;
        }
      }

      let conditieFinala =
        cond1 &&
        cond2 &&
        cond3 &&
        cond4 &&
        condKeywords &&
        condNews &&
        condModels &&
        condMultipleSelect;

      if (conditieFinala) {
        art.style.display = "block";
      }
    }
  };
  document.getElementById("resetare").onclick = function () {
    var articole = document.getElementsByClassName("produs");
    for (let art of articole) {
      art.style.display = "block";
      document.getElementById("inp-nume").value = "";
      document.getElementById("i_rad4").checked = true;
      document.getElementById("inp-pret").value = 0;
      document.getElementById("infoRange").innerHTML = "(0)";
      document.getElementById("sel-toate").selected = true;
    }
  };

  function sorteaza(semn) {
    var articole = document.getElementsByClassName("produs");
    var v_articole = Array.from(articole);
    v_articole.sort(function (a, b) {
      var pret_a = parseFloat(
        a.getElementsByClassName("val-pret")[0].innerHTML
      );
      var pret_b = parseFloat(
        b.getElementsByClassName("val-pret")[0].innerHTML
      );
      if (pret_a !== pret_b) {
        return semn * (pret_a - pret_b);
      } else {
        var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
        var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
        return semn * nume_a.localeCompare(nume_b);
      }
    });
    for (let art of v_articole) {
      art.parentElement.appendChild(art);
    }
  }

  document.getElementById("sortCrescNume").onclick = function () {
    sorteaza(1);
  };
  document.getElementById("sortDescrescNume").onclick = function () {
    sorteaza(-1);
  };

  document.getElementById("button-sum").onclick = function () {
    var p_vechi = document.getElementById("suma");
    if (!p_vechi) {
      suma = 0;
      var articole = document.getElementsByClassName("produs");
      for (let art of articole) {
        if (art.style.display != "none") {
          suma += parseFloat(
            art.getElementsByClassName("val-pret")[0].innerHTML
          );
        }
      }
      var pgf = document.createElement("div");
      pgf.innerHTML = `<b>Suma: </b> ${suma}`;
      pgf.id = "suma";
      pgf.style.position = "fixed";
      var sectiune = document.getElementById("produse");
      sectiune.parentNode.insertBefore(pgf, sectiune);
      setTimeout(function () {
        var p_vechi = document.getElementById("suma");
        if (p_vechi) {
          p_vechi.remove();
        }
      }, 2000);
    }
  };

  // window.onkeydown = function (e) {
  //   // console.log(e);
  //   if (e.key == "c" && e.altKey) {
  //     var p_vechi = document.getElementById("suma");
  //     if (!p_vechi) {
  //       suma = 0;
  //       var articole = document.getElementsByClassName("produs");
  //       for (let art of articole) {
  //         if (art.style.display != "none") {
  //           suma += parseFloat(
  //             art.getElementsByClassName("val-pret")[0].innerHTML
  //           );
  //         }
  //       }
  //       var pgf = document.createElement("p");
  //       pgf.innerHTML = `<b>Suma: </b> ${suma}`;
  //       pgf.id = "suma";
  //       var sectiune = document.getElementById("produse");
  //       sectiune.parentNode.insertBefore(pgf, sectiune);
  //       setTimeout(function(){
  //         var p_vechi = document.getElementById("suma");
  //         if (p_vechi) {
  //           p_vechi.remove();
  //         }
  //       }, 2000);
  //     }
  //   }
  // };
};
