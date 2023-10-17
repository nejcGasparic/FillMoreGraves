const header = document.createElement('header');
header.innerHTML = 
`
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <a class="navbar-brand" href="/">Fillmore Graves</a>
      <button class="navbar-toggler" data-toggle="collapse" data-target="#collapse_target">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapse_target">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="dokumenti.html">Dokumenti</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="navadni-uporabniki.html">Navadni uporabniki</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="sprozilci.html">Sprožilci</a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-toggle="dropdown" data-target="dropdown_target">
              <i class="fa-solid fa-gear"></i>
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdown_target">
              <a class="dropdown-item" href="racun.html">Nastavitve</a>
              <a class="dropdown-item" href="prijava.html">Odjava</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="racun.html">Testni uporabnik</a>
          </li>
        </ul>
      </div>
    </nav>
`

const footer = document.createElement('footer');
footer.innerHTML =
`
<footer id="footer" class="bg-dark text-light">
    <div id="footer-text" class="text-center p-3"">
      © 2022 Copyright Fillmore Graves
    </div>
  </footer>
`


let headerElement = document.getElementById("header");
headerElement.innerHTML = header.innerHTML;
let footerElement = document.getElementById("footer");
footerElement.innerHTML = footer.innerHTML;


let dodaj_dokument_forma = document.getElementById("dodaj_dokument_forma");
if (dodaj_dokument_forma) {
    let btn = dodaj_dokument_forma.getElementsByTagName('button')[0];
    btn.addEventListener('click', function() {
        let naziv = document.getElementById('dokument-naziv').value;
        let povzetek = document.getElementById('dokument-povzetek').value;
        let opis = document.getElementById('dokument-opis').value;
        let vloge = document.getElementById('dokument-vloge').value;
        let datoteka = document.getElementById('dokument-datoteka').value;
        
        console.log(naziv);
        console.log(povzetek);
        console.log(opis);
        console.log(vloge);
        console.log(datoteka);
    })
}
