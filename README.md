# Spletno programiranje 2022/2023

Lastni projekt pri predmetu **Spletno programiranje** v študijskem letu **2022/2023**.

## Kratek opis projekta

Zakaj bi čakali, da se vam ali komu od vaših bližnjih kaj zgodi? Fillmore Graves nudi rešitev, ki izbranim osebam
ob kritičnih dogodkih (npr. po smrti, izgubi spomina, hudi nesreči) omogoči dostop do določenih dokumentov, ki jih naložite
na našo spletno stran.

Aplikacija podpira dva tipa računov: administratorje in navadne uporabnike. Administratorji so osebe, ki se s to rešitvijo
želijo zaščititi in za to prek odjemalske aplikacije dodajo dokumente, izberejo prejemnike teh dokumentov, ki jih dobijo
v primeru, da se sprožijo določeni sprožilci. Prejemniki teh dokumentov so navadni uporabniki, ki jih ustvari administrator
in v tem primeru igrajo vlogo opazovalca (spectator). Lahko pa igrajo tudi vlogo verifikatorja, če jih administrator pooblasti
za preverjanje določenih dejstev (npr. da je prišlo do nesreče). Kot pogoj za sproženje sprožilca pa se v primeru verifikacije smrti
uporablja tudi baza [osmrtnice.si](https://osmrtnice.si).

Aplikacija omogoča:
- Registracijo administratorja
- Prijavo in odjava obstoječih računov, tako za administratorje kot navadne uporabnike
- Spreminjanje in vpogled podatkov o računu
- Drag & drop datotek in nalaganje teh datotek v podatkovno bazo
- Pošiljanje elektronske pošte, če:
  - administrator zahteva preverjanje dejstev,
  - ima administator nastavljen sprožilec, ki je vezan na časovnik,
  - navadnemu uporabniki postane na voljo nov dokument.
- Integracija z zunanjim virom: [osmrtnice.si](https://osmrtnice.si)

Zunanji knjižnici:
* `multer`: podpora za nalaganje datotek
* `puppeteer`: orodje za strganje osmrtnice.si

## Razlike v prikazih aplikacije v različnih brskalnikih

Za osnovo bomo vzeli prikaz naše aplikacije v brskalniku **Brave**.

**Google Chrome**
- Edina opazna razlika je malenkost drugačen kontrast barv prikazanih elementov

**Microsoft Edge**
- Kot pri Google Chrome je edina opazna razlika malenkost drugačen kontrast barv elementov prikazanih elementov

**Firefox**
- Ni zaznanih razlik

## Opis zaslonskih mask

* [`prijava.html`](./public/prijava.html): prijavni obrazec za administratorje in navadne uporabnike
* [`registracija.html`](./public/registracija.html): obrazec za registracijo administratorjev (ne pa navadnih uporabnikov)
* [`racun.html`](./public/racun.html): izpis podatkov in nastavitev računa, izbris računa, spreminjanja imena, priimka,
  elektronskega naslova, gesla; za administratorje in navadne uporabnike
* [`dokumenti.html`](./public/dokumenti.html): seznam vseh dokumentov z gumbi za ogled/urejanje in izbris dokumenta
* [`dokument-nov.html`](./public/dokument-nov.html): obrazec za ustvarjanje novega dokumenta, omogoča izbiro sprožilca in prejemnikov
* [`dokument.html`](./public/dokument.html): ogled in urejanje dokumenta
* [`navadni-uporabniki.html`](./public/navadni-uporabniki.html): seznam vseh navadnih uporabnikov z gumbi za
  ogled/urejanje in izbris navadnega uporabnika
* [`navadni-uporabnik-nov.html`](./public/navadni-uporabnik-nov.html): obrazec za ustvarjanje novega navadnega uporabnika
* [`navadni-uporabnik.html`](./public/navadni-uporabnik.html): ogled in urejanje navadnega uporabnika
* [`sprozilci.html`](./public/sprozilci.html): seznam sprožilcev z gumbi za ogled/urejanje in izbris sprožilca
* [`sprozilec-nov.html`](./public/sprozilec-nov.html): obrazec za ustvarjanje novega sprožilca
* [`sprozilec.html`](./public/sprozilec.html): ogled in urejanje sprožilca
* [`verifikacija.html`](./public/verifikacija.html): obrazec, ki ga uporabi navadni uporabnik (vloga verifikatorja),
  da potrdi, da se je zgodil nek dogodek, ko za to dobi poziv na elektronsko pošto

* [`db.html`](./public/db.html): posebna meta-stran za dodajanje podatkov v podatkovno bazo in brisanje vseh podatkov iz nje

## Verzije, okolja in ukazi

Ker je na sistemih z operacijskim sistemom Windows pri poganjanju docker ukazov včasih potreben dodatni ukaz za `winpty`,
so v `packages.json` definirani ločeni ukazi za sisteme, ki temeljijo na UNIX.

Verzija oz. izbira okolja je odvisna od okoljske spremenljivke `NODE_ENV`:
* ne obstaja: razvojna verzija
* `"test"`: testna verzija
* `"production"`: produkcijska verzija

### Lokalno okolje

Ukazi za postavitev lokalnega okolja:
* `docker-compose up` oz. `docker compose up` postavi samo Docker okolje
* `npm run start_new_docker` podre obstoječe Docker okolje in vzpostavi novega
* `npm run db_import_data` uvozi podatke iz `/data` v Docker okolje na Windows sistemih
* `npm run db_import_data_unix` uvozi podatke iz `/data` v Docker okolje na UNIX sistemih
* `npm run postavitev` izvede ukaza `npm run start_new_docker` in `npm run db_import_data`
* `npm run postavitev_unix` izvede ukaza `npm run start_new_docker` in `npm run db_import_data_unix`

Dostop do konzole MongoDB:
* `db_open_terminal` na Windows sistemih
* `db_open_terminal_unix` na UNIX sistemih

### Produkcijska verzija

UNIX ukazi za prenos podatkov na produkcijsko podatkovno bazo (MongoDB Atlas):
* `npm run db_local_dump_unix`
* `npm run db_restore_to_atlas_administratorji_unix`
* `npm run db_restore_to_atlas_dokumenti_unix`
* `npm run db_restore_to_atlas_navadni_uporabniki_unix`
* `npm run db_restore_to_atlas_sprozilci_unix`
* `npm run db_restore_to_atlas_tipi_dokumentov_unix`

Dostop do konzole MongoDB Atlas (oddalejn dostop do produkcijske podatkovne baze):
* `db_atlas_open_terminal_unix` na UNIX sistemih

Produkcijska verzija se nahaja na naslovu [`https://fillmore-graves.onrender.com`](https://fillmore-graves.onrender.com).

## Zunanje knjižnice

**Multer**

S pomočjo knjižnice Multer, ki je primarno namenjena nalaga datotek, smo omogočili prilaganje datotek v dokumente naše podatkovne baze. Brez te knjižnice ne bi morali implementirati nalaganje dokumentov administratorskih uporabnikov v bazo, kar je ena od osrednjih funkcionalnosti naše aplikacije.
Multer doda `body`, `file` in `files` objekte v `request` objekt. `body` objekt vsebuje vrednosti vnosnih polj, ki niso tipa datoteka. Objekta `file` in `files` pa vsebujeta datoteke, ki so bile naložene preko forme. 