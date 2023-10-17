const utf8 = require("utf8-encoder");
var navadniUporabniki = require("../../data/navadni-uporabniki.json");
const mongoose = require("mongoose");
const Navadni_uporabniki = mongoose.model("Navadni_uporabnik");
/**
 * @openapi
 *  /navadniUporabniki:
 *   get:
 *    summary: Pridobi seznam vseh navadnih uporabnikov.
 *    description: Pridobi seznam vseh navadnih uporabnikov, ki jih lahko dodaja administrator.
 *    tags: [Navadni-uporabniki]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom navadnih uporabnikov.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Navadni uporabnik'
 *        example:
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporočiloNapake'
 *        example:
 *         sporočilo: "Napaka pri poizvedbi: <opis napake>"
 */
var seznamNavadnihUporabnikov = (req, res) => {
  Navadni_uporabniki.find().exec(function (error, seznam) {
    if (error) {
      res.status(404).json({ sporočilo: "Napaka pri poizvedbi: " + error });
    } else {
      res.status(200).json(seznam);
    }
  });
};
/**
 * @openapi
 * /navadniUporabniki/{id}:
 *  get:
 *   summary: Vrni podrobnosti navadnega uporabnika.
 *   description: Vrni podrobnosti navadnega uporabnika na podlagi enoličnega identifikatorja.
 *   tags: [Navadni-uporabniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> dokumenta
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, navadni uporabnik najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Navadni uporabnik'
 *       example:
 *    '404':
 *     description: 'Ne najdem navadnega uporabnika s podanim enoličnim identifikatorjem.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        sporočilo: "Napaka pri poizvedbi: <opis napake>"
 *    '500':
 *     description: 'Nepričakovana napaka na strežniku.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        sporočilo: "Napaka na strežniku: <opis napake>"
 */
var podrobnostiNavadnegaUporabnika = (req, res) => {
  var idNavadnegaUporabnika = req.params.id;

  Navadni_uporabniki.findById(idNavadnegaUporabnika).exec(function (
    error,
    navadenUporabnik
  ) {
    if (!navadenUporabnik) {
      res.status(404).json({
        sporočilo:
          "Ne najdem navadnega uporabnika s podanim enoličnim identifikatorjem",
      });
    } else if (error) {
      res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
    } else {
      res.status(200).json(navadenUporabnik);
    }
  });
};
/**
 * @openapi
 * /navadniUporabniki:
 *  post:
 *   summary: Doda novega navadnega uporabnika v bazo.
 *   description: Doda novega **navadnega** uporabnika, ki je pod okriljem administratorskega uporabnika
 *   tags: [Navadni-uporabniki]
 *   requestBody:
 *    description: Navadni uporabnik.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        id_administratorja:
 *          type: ObjectId
 *          required: true
 *          example: 1
 *        ime:
 *          example: Ana
 *        priimek:
 *          example: Banana
 *        elektronski_naslov:
 *          example: banana123@gmail.com
 *        zgosceno_geslo:
 *          example: IRUGSO8R74WFRGSDIPV7E5GFILCGHR7FSUHRFVUIT7GR
 *        zadnjic_aktiven:
 *          example: 2021-10-25T23:17:59.
 *       required:
 *        - id_administratorja
 *        - ime
 *        - priimek
 *        - elektronski_naslov
 *        - zgosceno_geslo
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjen</b> nov navaden uporabnik.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Navadni uporabnik'
 *    '400':
 *     description: <b>Napaka</b>,id_administratorja, ime, priimek,elektronski_naslov in zgosceno geslo so vsi zahtevani podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        elektronski_naslov je obvezen:
 *         value:
 *          message: Body parameter 'elektronski_naslov' je obvezen.
 *    '401':
 *     description: <b>Napaka</b>, ni pravice dostopa.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
var ustvariNavadnegaUporabnika = (req, res) => {
  if (
    !req.body.id_administratorja ||
    !req.body.ime ||
    !req.body.priimek ||
    !req.body.elektronski_naslov ||
    !req.body.zgosceno_geslo
  ) {
    res
      .status(400)
      .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
  } else {
    var novNavadenUporabnik = {
      id_administratorja: req.body.id_administratorja,
      ime: req.body.ime,
      priimek: req.body.priimek,
      elektronski_naslov: req.body.elektronski_naslov,
      zgosceno_geslo: req.body.zgosceno_geslo,
    };

    Navadni_uporabniki.create(
      novNavadenUporabnik,
      function (error, navadenUporabnik) {
        if (error) {
          res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
        } else {
          res.status(201).json(navadenUporabnik);
        }
      }
    );
  }
};
/**
 * @openapi
 * /navadniUporabniki/{id}:
 *  put:
 *   summary: Posodobi navadnega uporabnika
 *   description: Posodobi **navadnega uporabnika** z izbranim enoličnim identifikatorjem.
 *   tags: [Navadni-uporabniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> navadnega uporabnika
 *      required: true
 *      example: 639f2a2bdb5a1ec6418aeed2
 *   requestBody:
 *    description: Navadni uporabnik
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        id_administratorja:
 *          type: ObjectId
 *          required: true
 *          example: 1639e59d156343bf974971be9
 *        ime:
 *          example: Ana
 *        priimek:
 *          example: Banana
 *        elektronski_naslov:
 *          example: banana123@gmail.com
 *        zgosceno_geslo:
 *          example: IRUGSO8R74WFRGSDIPV7E5GFILCGHR7FSUHRFVUIT7GR
 *        zadnjic_aktiven:
 *          example: 2021-10-25T23:17:59.
 *       required:
 *        - id_administratorja
 *        - ime
 *        - priimek
 *        - elektronski_naslov
 *        - zgosceno_geslo
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju navadnega uporabnika
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Navadni uporabnik'
 *    '400':
 *     description: <b>Napaka</b>,id_administratorja, ime, priimek,elektronski_naslov in zgosceno geslo so vsi zahtevani podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        id_administratorja je obvezen:
 *         value:
 *          message: Spremenljivka 'id' mora biti obvezno podana.
 *    '404':
 *     description: Uporabnik s tem <b>ID-jem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        uporabnik ni najden:
 *         value:
 *          message: Uporabnik z id '735a62f5dc5d7968e6846914' ni bil najden.
 *    '500':
 *     description: <b>Napaka na strežniku</b>, z sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
var posodobiNavadnegaUporabnika = (req, res) => {
  var idNavadnegaUporabnika = req.params.id;

  if (
    !req.body.id_administratorja &&
    !req.body.ime &&
    !req.body.priimek &&
    !req.body.elektronski_naslov &&
    !req.body.zgosceno_geslo
  ) {
    res.status(400).json({
      sporočilo: "Vsaj en parameter je obvezen!",
    });
  } else {
    Navadni_uporabniki.findById(idNavadnegaUporabnika).exec(function (
      error,
      navadenUporabnik
    ) {
      if (!navadenUporabnik) {
        res.status(404).json({
          sporočilo:
            "Ne najdem navadnega uporabnika s podanim enoličnim identifikatorjem",
        });
      } else {
        if (req.body.id_administratorja) {
          navadenUporabnik.id_administratorja = req.body.id_administratorja;
        }
        if (req.body.ime) {
          navadenUporabnik.ime = req.body.ime;
        }
        if (req.body.priimek) {
          navadenUporabnik.priimek = req.body.priimek;
        }
        if (req.body.elektronski_naslov) {
          navadenUporabnik.elektronski_naslov = req.body.elektronski_naslov;
        }
        if (req.body.zgosceno_geslo) {
          navadenUporabnik.zgosceno_geslo = req.body.zgosceno_geslo;
        }

        navadenUporabnik.save(function (error, navadenUporabnik) {
          if (error) {
            res
              .status(500)
              .json({ sporočilo: "Napaka na strežniku: " + error });
          } else {
            res.status(200).json(navadenUporabnik);
          }
        });
      }
    });
  }
};
/**
 * @openapi
 * /navadniUporabniki/{id}:
 *  delete:
 *   summary: Izbriši navadnega uporabnika
 *   description: Izbriši **navadnega uporabnika** s podanim enoličnim identifikatorjem
 *   tags: [Navadni-uporabniki]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> navadnega uporabnika
 *      required: true
 *      example: 639f2a2bdb5a1ec6418aeed2
 *   responses:
 *    '204':
 *     description: Uspešno izbrisan uporabnik.
 *    '400':
 *     description: <b>Slab zahtevek</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Spremenljivka 'id', ki se nahaja v poti je obvezna!
 *    '404':
 *     description: <b>Napaka</b>, uporabnik s tem id-jem ne obstaja.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        user not found:
 *         value:
 *          message: Navaden uporabnik z id-jem '735a62f5dc5d7968e6846914' ni bil najden.
 *    '500':
 *     description: <b>Napaka na strežniku</b>, z sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
var izbrisiNavadnegaUporabnika = (req, res) => {
  var idNavadnegaUporabnika = req.params.id;
  if (!idNavadnegaUporabnika) {
    res
      .status(400)
      .json({ sporočilo: "ID navadnega uporabnika je obvezen podatek!" });
  } else {
    Navadni_uporabniki.findByIdAndRemove(idNavadnegaUporabnika, function (error, rezultat) {
      if (!rezultat) {
        res.status(404).json({
          sporočilo:
            "Ne najdem navadnega uporabnika s podanim enoličnim identifikatorjem",
        });
      } else if (error) {
        res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
      } else {
        res.status(204).send();
      }
    });
  }
};

var vrniVlogoNavadnegaUporabnika = (req, res) => {
  //TO-DO
};

module.exports = {
  seznamNavadnihUporabnikov,
  podrobnostiNavadnegaUporabnika,
  ustvariNavadnegaUporabnika,
  posodobiNavadnegaUporabnika,
  izbrisiNavadnegaUporabnika,
  vrniVlogoNavadnegaUporabnika //TO-DO
};
