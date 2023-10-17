// const npm = require("npm");

let btnImport = document.getElementById("btnImport");
btnImport.addEventListener("click", () => {
  //importaj administratorje
  let url = "/api/administratorji";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      ime: "Rajko",
      priimek: "Toplak",
      elektronski_naslov: "rajko.toplak@siol.net",
      zgosceno_geslo: "IRUGSO8R74WFRGSDIPV7E5GFILCGHR7FSUHRFVUIT7GR",
      zadnjic_aktiven: "2021-10-25T23:17:59",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      ime: "Janez",
      priimek: "Horvat",
      elektronski_naslov: "janez.horvat@outlook.com",
      zgosceno_geslo: "IURG9SF84W59DSI8RGVDIGY4958GYDH8IRGE98RTEY89Y",
      zadnjic_aktiven: "2022-08-14T15:14:00",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  //importaj navadneUporabnike
  url = "/api/navadniUporabniki";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      ime: "Liv",
      priimek: "Moore",
      elektronski_naslov: "liv.moore@gmail.com",
      zgosceno_geslo: "AILNEOKL945THOEHG94539S32FISPFHWDSSADFASDFUYK98FHDPVQ",
      id_administratorja: "639e59d156343bf974971be9",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      ime: "Marinka",
      priimek: "Levstik",
      elektronski_naslov: "marinka.levstik@yahoo.com",
      zgosceno_geslo: "IOOI5JE0PI34FISOV8Y9342LKFHGSD9F8WEFLJEBUIVHXIOFUHVVIO",
      id_administratorja: "639e59d156343bf974971be9",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      ime: "Drago",
      priimek: "Perčič",
      elektronski_naslov: "drago@percic.si",
      zgosceno_geslo: "KISBDFEO83432LFRVG38ESLDSIAERFULQYW4EFEARA9FCIWUIHCSDL",
      id_administratorja: "639e59d156343bf974971be9",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  //importaj tipe dokumentov
  url = "/api/dokumentiTipi";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: 1,
      ime: "Datoteka",
      opis: "npr. oporoka, izpis zemljiške knjige, slike, itd.",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: 2,
      ime: "Poverilnice za prijavo (login credentials)",
      opis: "lokacija (npr. URL), uporabniško ime in geslo",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: 4,
      ime: "Bančni račun",
      opis: "številka TRR",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: 5,
      ime: "Sef",
      opis: "kombinacija in lokacija sefa",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: 6,
      ime: "Predmet",
      opis: "lokacija predmeta na zemljevidu: npr. nahajališče dragocenega predmeta, denarja, itd.",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      id: 3,
      ime: "Zavarovalna polica",
      opis: "številka zavarovalne police",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
});
