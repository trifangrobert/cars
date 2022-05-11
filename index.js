const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const { Client } = require("pg");
const ejs = require("ejs");
const sass = require("sass");
const formidable = require("formidable");
const crypto = require("crypto");
const session = require("express-session");
const nodemailer = require("nodemailer");
const path = require("path");
const res = require("express/lib/response");
// const { Client } = require("pg/lib");

const obGlobal = {
  obImagini: null,
  obErori: null,
  emailServer: "robert.trifan@lervs.ro",
  port: 8080,
  sirAlphaNum: "",
  protocol: null,
  numeDomeniu: null,
};

if (process.env.SITE_ONLINE) {
  obGlobal.protocol = "https://";
  obGlobal.numeDomeniu = "mighty-forest-44090.herokuapp.com";
  var client = new Client({
    host: "ec2-34-197-84-74.compute-1.amazonaws.com",
    database: "d989gttf1p9fhd",
    user: "fyvkjtwtyjemoz",
    port: 5432,
    password:
      "5b1b328739cc32128ec291f5f3ef636f2c606bc14ff75f71822f6965bb60f969",
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  obGlobal.protocol = "http://";
  obGlobal.numeDomeniu = "localhost:8080";
  var client = new Client({
    database: "bd_lamborghini",
    user: "king",
    password: "1248",
    host: "localhost",
    port: 5432,
  });
}

client.connect();

foldere = ["temp", "poze_uploadate"];
for (let folder of foldere) {
  let caleFolder = path.join(__dirname, folder);
  if (!fs.existsSync(caleFolder)) {
    fs.mkdirSync(caleFolder);
  }
}

async function trimiteMail(
  email,
  subiect,
  mesajText,
  mesajHtml,
  atasamente = []
) {
  // console.log(obGlobal.emailServer);
  var transp = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      //date login
      user: obGlobal.emailServer,
      pass: "mnxyhdtzwoqafjkk",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  //genereaza html
  await transp.sendMail({
    from: obGlobal.emailServer,
    to: email,
    subject: subiect, //"Te-ai inregistrat cu succes",
    text: mesajText, //"Username-ul tau este "+username
    html: mesajHtml, // `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
    attachments: atasamente,
  });
  console.log("trimis mail");
}

v_intervale = [
  [48, 57],
  [65, 90],
  [97, 122],
];
for (let interval of v_intervale) {
  for (let i = interval[0]; i <= interval[1]; ++i) {
    obGlobal.sirAlphaNum += String.fromCharCode(i);
  }
}

// console.log(obGlobal.sirAlphaNum);

function genereazaToken(n) {
  let token = "";
  for (let i = 0; i < n; ++i) {
    token +=
      obGlobal.sirAlphaNum[
        Math.floor(Math.random() * obGlobal.sirAlphaNum.length)
      ];
  }
  return token;
}

app = express();

app.use(
  session({
    //aici se creeaza proprietatea session a requestului (pot folosi req.session)

    secret: "abcdefg", //folosit de express session pentru criptarea id-ului de sesiune

    resave: true,

    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));
app.use("/poze_uploadate", express.static(__dirname + "/poze_uploadate"));

function getIp(req) {
  //pentru Heroku
  var ip = req.headers["x-forwarded-for"]; //ip-ul userului pentru care este forwardat mesajul
  if (ip) {
    let vect = ip.split(",");
    return vect[vect.length - 1];
  } else if (req.ip) {
    return req.ip;
  } else {
    return req.connection.remoteAddress;
  }
}

app.get("/*", function (req, res, next) {
  let id_utiliz = req.session.utilizator ? req.session.utilizator.id : null;
  let queryInsert = `insert into accesari(ip, user_id, pagina) values('${getIp(
    req
  )}', '${id_utiliz}', '${req.url}')`;
  client.query(queryInsert, function (err, rezQuery) {
    console.log(err);
  });
  next();
});

function stergeAccesariVechi() {
  var queryDelete =
    "delete from accesari where now() - data_accesare >= interval '5 minutes'";
  client.query(queryDelete, function (err, rezQuery) {
    console.log(err);
  });
}

stergeAccesariVechi();
setInterval(stergeAccesariVechi, 600000);

app.use("/*", function (req, res, next) {
  res.locals.propGenerala = "sunt peste tot";
  res.locals.optiuni = obGlobal.optiuni;
  res.locals.modele = obGlobal.modele;
  res.locals.utilizator = req.session.utilizator;
  res.locals.mesajLogin = req.session.mesajLogin;
  req.session.mesajLogin = null;
  next();
});

client.query(
  "select * from unnest(enum_range(null::categ_modele))",
  function (err, rezCateg) {
    obGlobal.optiuni = rezCateg.rows;
  }
);

client.query(
  "select * from unnest(enum_range(null::tipuri_produse))",
  function (err, rezCateg) {
    obGlobal.modele = rezCateg.rows;
  }
);

app.get(["/", "/index", "/home"], function (req, res) {
  client.query("select * from cars", function (err, rezQuery) {
    // console.log(rezQuery);
    // console.log(obImagini);
    // console.log("am intrat aici");

    // res.render("pagini/index", {
    //   ip: req.ip,
    //   imagini: obImagini.imagini,
    //   produse: rezQuery.rows,
    // });
    querySelect = `select username, nume from utilizatori where id in (select distinct user_id from accesari where now() - data_accesare <= interval '5 minutes')`;
    client.query(querySelect, function (err, rezQuery) {
      useriOnline = [];
      if (err) console.log(err);
      else useriOnline = rezQuery.rows;
      res.render("pagini/index", {
        ip: getIp(req),
        imagini: obImagini.imagini,
        useriOnline: useriOnline,
      });
    });
  });

  // console.log(__dirname);
  // res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini, produse: rezQuery.rows});
  // console.log(obImagini);
  // res.render("pagini/index", {a:req.a});
});

app.get("/produse", function (req, res) {
  // console.log("req query");
  // console.log(req.query.tip);
  client.query(
    "select * from unnest(enum_range(null::categ_modele))",
    function (err, rezCateg) {
      var cond_where = req.query.tip ? ` tip_produs='${req.query.tip}'` : "1=1";
      // console.log("show rezCateg");
      // console.log(rezCateg);
      client.query(
        "select * from cars where " + cond_where,
        function (err, rezQuery) {
          // console.log(err);
          // console.log(rezQuery);
          res.render("pagini/produse", {
            produse: rezQuery.rows,
            optiuni: obGlobal.optiuni,
            modele: obGlobal.modele,
          });
        }
      );
    }
  );
});
app.get("/produs/:id", function (req, res) {
  client.query(
    `select * from cars where id=${req.params.id}`,
    function (err, rezQuery) {
      res.render("pagini/produs", { prod: rezQuery.rows[0] });
    }
  );
});

app.get("/produse/:categ", function (req, res) {
  client.query(
    "select * from unnest(enum_range(null::categ_modele))",
    function (err, rezCateg) {
      client.query(
        `select * from cars where categorie='${req.params.categ}'`,
        function (err, rezQuery) {
          if (err) {
            randeazaEroare(res, 2);
          } else {
            // console.log(err);
            // console.log("rezQuery", rezQuery);
            // console.log("rezCateg", rezCateg);
            // console.log("categ", req.params.categ);
            res.render("pagini/produse", {
              produse: rezQuery.rows,
              optiuni: obGlobal.optiuni,
              modele: obGlobal.modele,
            });
          }
        }
      );
    }
  );
});

app.get("/galerie-statica", function (req, res) {
  res.render("fragmente/galerie-statica", { imagini: obImagini.imagini });
});

app.get("/logout", function (req, res) {
  req.session.destroy();
  res.locals.utilizator = null;
  res.render("pagini/logout");
});

app.get("/*.ejs", function (req, res) {
  // res.status(403).render("pagini/403");
  randeazaEroare(res, 403);
});

app.get("/ceva", function (req, res, next) {
  res.write("Salut");
  next();
});

app.get("/ceva", function (req, res, next) {
  res.write("Pa");
  next();
});

function creeazaImagini() {
  var buf = fs
    .readFileSync(__dirname + "/resurse/json/galerie.json")
    .toString("utf8");
  obImagini = JSON.parse(buf); //global
  // console.log(obImagini);
  for (let imag of obImagini.imagini) {
    let nume_imag, extensie;
    [nume_imag, extensie] = imag.cale_fisier.split("."); // "abc.de".split(".") ---> ["abc","de"]
    // console.log( nume_imag, extensie);
    let dim_mediu = 300;

    imag.mediu = `${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.png`; //nume-150.webp // "a10" b=10 "a"+b `a${b}`
    //console.log(imag.mic);
    imag.mare = `${obImagini.cale_galerie}/${imag.cale_fisier}`;
    if (!fs.existsSync(imag.mediu))
      sharp(__dirname + "/" + imag.mare)
        .resize(dim_mediu)
        .toFile(__dirname + "/" + imag.mediu);

    let dim_mic = 150;

    imag.mic = `${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.png`; //nume-150.webp // "a10" b=10 "a"+b `a${b}`
    //console.log(imag.mic);
    imag.mare = `${obImagini.cale_galerie}/${imag.cale_fisier}`;
    if (!fs.existsSync(imag.mic))
      sharp(__dirname + "/" + imag.mare)
        .resize(dim_mediu)
        .toFile(__dirname + "/" + imag.mic);
  }
}

app.get("*/galerie_animata.css", function (req, res) {
  // console.log("am intrat in galerie animata");
  var sirScss = fs
    .readFileSync(__dirname + "/resurse/scss/galerie_animata.scss")
    .toString("utf8");
  // console.log(sirScss);
  var culori = ["navy", "black", "purple", "grey"];
  var indiceAleator = Math.floor(Math.random() * culori.length);
  var culoareAleatoare = culori[indiceAleator];
  rezScss = ejs.render(sirScss, { culoare: culoareAleatoare });
  var caleScss = __dirname + "/temp/galerie_animata.scss";
  // console.log(rezScss);
  fs.writeFileSync(caleScss, rezScss);
  try {
    rezCompilare = sass.compile(caleScss, { sourceMap: true });
    var caleCss = __dirname + "/temp/galerie_animata.css";
    fs.writeFileSync(caleCss, rezCompilare.css);
    res.setHeader("Content-Type", "text/css");
    res.sendFile(caleCss);
  } catch (err) {
    // console.log(err);
    res.send("Eroare");
  }
});

parolaServer = "tehniciweb";
app.post("/inreg", function (req, res) {
  var username;
  // console.log("ceva");
  var formular = new formidable.IncomingForm();
  formular.parse(req, function (err, campuriText, campuriFisier) {
    // console.log(campuriText);

    var eroare = "";
    if (campuriText.username == "") {
      eroare += "Username necompletat. ";
    }
    if (!campuriText.username.match(new RegExp("^[A-Za-z0-9]+$"))) {
      eroare += "Username nu corespunde patternului. ";
    }
    if (!eroare) {
      queryUtiliz = `select username from utilizatori where username='${campuriText.username}'`;
      client.query(queryUtiliz, function (err, rezUtiliz) {
        if (rezUtiliz.rows.length != 0) {
          eroare += "Username-ul mai exista. ";
          res.render("pagini/inregistrare", { err: "Eroare: " + eroare });
        } else {
          var parolaCriptata = crypto
            .scryptSync(campuriText.parola, parolaServer, 64)
            .toString("hex");
          let token = genereazaToken(100);
          var comandaInserare = `insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod) values ('${campuriText.username}','${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}' ,'${token}') `;
          client.query(comandaInserare, function (err, rezInserare) {
            if (err) {
              console.log(err);
              res.render("pagini/inregistrare", { err: "Eroare baza de date" });
            } else {
              res.render("pagini/inregistrare", {
                raspuns: "Datele au fost introduse",
              });
              let linkConfirmare =
                obGlobal.protocol + obGlobal.numeDomeniu + "/cod/" + token;
              trimiteMail(
                campuriText.email,
                "Te-ai inregistrat",
                "text",
                `<h1>Salut!</h1>
                <p style='color:blue'>Username-ul tau este ${campuriText.username}.</p>
                <a href='${linkConfirmare}'>Confirma contul</a>`
              );
            }
          });
        }
      });
    } else {
      res.render("pagini/inregistrare", { err: "Eroare: " + eroare });
    }
  });

  formular.on("field", function (nume, val) {
    // 1
    if (nume == "username") {
      username = val;
    }
  });
  formular.on("fileBegin", function (nume, fisier) {
    //2
    caleUtiliz = path.join(__dirname, "poze_uploadate", username);
    if (!fs.existsSync(caleUtiliz)) {
      fs.mkdirSync(caleUtiliz);
    }
    fisier.filepath = path.join(caleUtiliz, fisier.originalFilename);
  });
  formular.on("file", function (nume, fisier) {
    //3
  });
});

app.get("/cod/:token", function (req, res) {
  console.log("cod/:token");
  let comandaUpdate = `update utilizatori set confirmat_mail=true where cod='${req.params.token}'`;
  client.query(comandaUpdate, function (err, rezUpdate) {
    if (err) {
      console.log(err);
      randeazaEroare(res, 2);
    } else {
      if (rezUpdate.rowCount > 0) {
        res.render("pagini/confirmare");
      } else {
        randeazaEroare(res, -1, "Email neconfirmat", "Incercati iar", null);
      }
    }
  });
});

app.get("/useri", function (req, res) {
  console.log("am accesat pagina useri");
  if (req.session.utilizator && req.session.utilizator.rol == "admin") {
    client.query("select * from utilizatori", function (err, rezQuery) {
      console.log(rezQuery);
      res.render("pagini/useri", { useri: rezQuery.rows });
    });
  } else {
    randeazaEroare(res, 403);
  }
});

app.post("/sterge_utiliz", function (req, res) {
  var formular = new formidable.IncomingForm();
  formular.parse(req, function (err, campuriText, campuriFisier) {
    var queryDelete = `delete from utilizatori where id='${campuriText.id_utiliz}'`;
    client.query(queryDelete, function (err, rezQuery) {
      console.log(err);
      res.redirect("/useri");
    });
  });
});

app.post("/login", function (req, res) {
  // console.log("sunt in login");
  var formular = new formidable.IncomingForm();
  formular.parse(req, function (err, campuriText, campuriFisier) {
    // console.log(campuriText);
    var parolaCriptata = crypto
      .scryptSync(campuriText.parola, parolaServer, 64)
      .toString("hex");
    //var querySelect = `select * from utilizatori where username='${campuriText.username}' and parola='${parolaCriptata}' and confirmat_mail=true`;
    var querySelect = `select * from utilizatori where username= $1::text and parola= $2::text and confirmat_mail=true`;
    client.query(
      querySelect,
      [campuriText.username, parolaCriptata],
      function (err, rezSelect) {
        if (err) {
          console.log(err);
          // console.log("sunt in login, la query");
          randeazaEroare(res, 2);
        } else {
          if (rezSelect.rows.length == 1) {
            //daca am utilizatorul si a dat credentiale corecte
            req.session.utilizator = {
              nume: rezSelect.rows[0].nume,
              id: rezSelect.rows[0].id,
              prenume: rezSelect.rows[0].prenume,
              username: rezSelect.rows[0].username,
              email: rezSelect.rows[0].email,
              culoare_char: rezSelect.rows[0].culoare_chat,
              rol: rezSelect.rows[0].rol,
            };
            console.log("te ai logat cu succes");
            res.redirect("/index");
          } else {
            // randeazaEroare(
            //   res,
            //   -1,
            //   "Login esuat",
            //   "User sau parola gresita/Nu a fost confirmat mail-ul"
            // );
            req.session.mesajLogin = "Login esuat!";
            res.redirect("/index");
          }
        }
      }
    );
  });
});

// ---------------- Update profil -----------------------------

app.post("/profil", function (req, res) {
  console.log("profil");
  if (!req.session.utilizator) {
    res.render("pagini/eroare_generala", { text: "Nu sunteti logat." });
    return;
  }
  var formular = new formidable.IncomingForm();

  formular.parse(req, function (err, campuriText, campuriFile) {
    var criptareParola = crypto
      .scryptSync(campuriText.parola, parolaServer, 64)
      .toString("hex");

    //TO DO query
    var queryUpdate = `update utilizatori set nume='${campuriText.nume}', prenume='${campuriText.prenume}', email='${campuriText.email}', culoare_chat='${campuriText.culoare_chat}' when parola='${criptareParola}'`;
    // console.log(queryUpdate);

    client.query(queryUpdate, function (err, rez) {
      if (err) {
        console.log(err);
        res.render("pagini/eroare_generala", {
          text: "Eroare baza date. Incercati mai tarziu.",
        });
        return;
      }
      // console.log(rez.rowCount);
      if (rez.rowCount == 0) {
        res.render("pagini/profil", {
          mesaj: "Update-ul nu s-a realizat. Verificati parola introdusa.",
        });
        return;
      } else {
        req.session.utilizator.nume = campuriText.nume;
        req.session.utilizator.prenume = campuriText.prenume;
        req.session.utilizator.email = campuriText.email;
        req.session.utilizator.culoare_chat = campuriText.culoare_chat;
      }

      //TO DO actualizare sesiune

      res.render("pagini/profil", {
        mesaj: "Update-ul s-a realizat cu succes.",
      });
    });
  });
});

// app.post("/login",function(req, res){
//   console.log("ceva");
//   var formular= new formidable.IncomingForm()
//   formular.parse(req, function(err, campuriText, campuriFisier ){
//       console.log(campuriText);
//       var parolaCriptata=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex');
//       var querySelect=`select * from utilizatori where username='${campuriText.username}' and parola='${parolaCriptata}'`;
//       console.log(querySelect);
//       client.query(querySelect,function(err, rezSelect){
//           if(err)
//               console.log(err);
//           else{
//               console.log(rezSelect.rows.length);
//               if(rezSelect.rows.length==1){ //daca am utilizatorul si a dat credentiale corecte
//                   req.session.utilizator={
//                       nume:rezSelect.rows[0].nume,
//                       prenume:rezSelect.rows[0].prenume,
//                       username:rezSelect.rows[0].username,
//                       email:rezSelect.rows[0].email,
//                       culoare_chat:rezSelect.rows[0].culoare_chat,
//                       rol:rezSelect.rows[0].rol
//                   }
//                   res.redirect("/index");
//               }
//           }
//       } )
//   })
// });

// app.get("/logout", function(req, res){
//   req.session.destroy();
//   res.locals.utilizator=null;
//   res.render("pagini/logout");
// });

app.get("/eroare", function (req, res) {
  randeazaEroare(res, 1, "Titlu schimbat");
});

app.get("/*", function (req, res) {
  res.render("pagini" + req.url, function (err, rezRender) {
    if (err) {
      if (err.message.includes("Failed to lookup view")) {
        console.log("Eroare");
        // res.status(404).render("pagini/404");
        randeazaEroare(res, 404);
      } else {
        res.render("pagini/eroare_generala");
      }
    } else {
      console.log("A mers bine");
      res.send(rezRender);
    }
  });
  // console.log("generala:", req.url);
});

creeazaImagini();

function creeazaErori() {
  var buf = fs
    .readFileSync(__dirname + "/resurse/json/erori.json")
    .toString("utf8");
  obErori = JSON.parse(buf); //global
}

creeazaErori();

// randeazaEroare(res, 403);
function randeazaEroare(res, identificator, titlu, text, imagine) {
  var eroare = obErori.erori.find(function (elem) {
    return elem.identificator == identificator;
  });
  titlu = titlu || (eroare && eroare.titlu) || "Titlu eroare custom";
  text = text || (eroare && eroare.text) || "Text eroare custom";
  imagine =
    imagine ||
    (eroare && obErori.cale_baza + "/" + eroare.imagine) ||
    "Imagine eroare custom";
  if (eroare && eroare.status) {
    res.status(eroare.identificator);
  }
  res.render("pagini/eroare_generala", {
    optiuni: obGlobal.optiuni,
    titlu: titlu,
    text: text,
    imagine: imagine,
  });
}

// var s_port = process.env.PORT || 8080;
// app.listen(s_port);

app.listen(8080);
console.log("They see me coding...");
