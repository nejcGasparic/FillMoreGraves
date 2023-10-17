const utf8 = require("utf8-encoder");
var administratorji = require("../../data/administratorji.json");
const mongoose = require("mongoose");
const Administratorji = mongoose.model("Administrator");

/**
 * @openapi
 *  /administratorji:
 *   get:
 *    summary: Pridobi seznam vseh administratorjev.
 *    description: Pridobi seznam vseh administratorjev, ki imajo pravice objavljati dokumente itd..
 *    tags: [Administratorji]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom administratorjev.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Administrator'
 *        example:
 *         - _id: 639dfc61a3045f83fb004e09
 *           ime: Rajko
 *           priimek: Toplak
 *           elektronski_naslov: rajko.toplak@siol.net
 *           zgosceno_geslo: IRUGSO8R74WFRGSDIPV7E5GFILCGHR7FSUHRFVUIT7GR
 *           zadnjic_aktiven: 2021-10-25T23:17:59
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporočiloNapake'
 *        example:
 *         sporočilo: "Napaka pri poizvedbi: <opis napake>"
 */
var seznamAdministratorjev = (req, res) => {
  Administratorji.find().exec(function (error, seznam) {
    if (error) {
      res.status(404).json({ sporočilo: "Napaka pri poizvedbi: " + error });
    } else {
      res.status(200).json(seznam);
    }
  });
};
/**
 * @openapi
 * /administratorji/{id}:
 *  get:
 *   summary: Vrni podrobnosti administratorja.
 *   description: Vrni podrobnosti administratorja na podlagi enoličnega identifikatorja.
 *   tags: [Administratorji]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> dokumenta
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, administrator najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Administrator'
 *       example:
 *        - _id: 639dfc61a3045f83fb004e09
 *          ime: Rajko
 *          priimek: Toplak
 *          elektronski_naslov: rajko.toplak@siol.net
 *          zgosceno_geslo: IRUGSO8R74WFRGSDIPV7E5GFILCGHR7FSUHRFVUIT7GR
 *          zadnjic_aktiven: 2021-10-25T23:17:59
 *    '404':
 *     description: 'Ne najdem administratorja s podanim enoličnim identifikatorjem.'
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
var podrobnostiAdministratorja = (req, res) => {
  var idAdministratorja = req.params.id;

  Administratorji.findById(idAdministratorja).exec(function (
    error,
    administrator
  ) {
    if (!administrator) {
      res.status(404).json({
        sporočilo:
          "Ne najdem administratorja s podanim enoličnim identifikatorjem",
      });
    } else if (error) {
      res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
    } else {
      res.status(200).json(administrator);
    }
  });
};
/**
 * @openapi
 * /administratorji:
 *  post:
 *   summary: Doda novega administratorja v bazo.
 *   description: Doda novega **administratorksega** uporabnika z pravicami dodajanja novih dokumentov in izbiro dedičev.
 *   tags: [Administratorji]
 *   requestBody:
 *    description: Administratorski uporabnik.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          required: true
 *          example: John
 *        priimek:
 *          required: true
 *          example: Doe
 *        elektronski_naslov:
 *          required: true
 *          example: john.doe@gmail.com
 *        zgosceno_geslo:
 *          required: true
 *          example: IRUGSO8R74WFRGSDIPV7E5GFILCGHR7FSUHRFVUIT7GR
 *        zadnjic_aktiven:
 *          example: 2021-10-25T23:17:59.
 *       required:
 *        - ime
 *        - priimek
 *        - elektronski_naslov
 *        - zgosceno_geslo
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjen</b> nov administrator.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Administrator'
 *    '400':
 *     description: <b>Napaka</b>,ime, priimek,elektronski_naslov in zgosceno geslo so vsi zahtevani podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        elektronski_naslov is required:
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
var ustvariAdministratorja = (req, res) => {
  if (
    !req.body.ime ||
    !req.body.priimek ||
    !req.body.elektronski_naslov ||
    !req.body.zgosceno_geslo ||
    !req.body.zadnjic_aktiven
  ) {
    res
      .status(400)
      .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
  } else {
    var novAdministrator = {
      ime: req.body.ime,
      priimek: req.body.priimek,
      elektronski_naslov: req.body.elektronski_naslov,
      zgosceno_geslo: req.body.zgosceno_geslo,
      zadnjic_aktiven: req.body.zadnjic_aktiven,
    };

    Administratorji.create(novAdministrator, function (error, administrator) {
      if (error) {
        res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
      } else {
        res.status(201).json(administrator);
      }
    });
  }
};

/**
 * @openapi
 * /administratorji/{id}:
 *  put:
 *   summary: Posodobi administratorja.
 *   description: Posodobi administratorja z izbranim enoličnim identifikatorjem.
 *   tags: [Administratorji]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> administratorja
 *      required: true
 *      example: 635a62f5dc5d7968e68464be
 *   requestBody:
 *    description: Administrator
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        ime:
 *          example: Janez
 *        priimek:
 *          example: Novak
 *        elektronski_naslov:
 *          example: janez7@gmail.com
 *        zgosceno_geslo:
 *          example: IRUGSO8R74WFRGSDIPV7E5GFILCGHR7FSUHRFVUIT7GR
 *        zadnjic_aktiven:
 *          example: 2021-10-25T23:17:59.
 *       required:
 *        - ime
 *        - priimek
 *        - elektronski_naslov
 *        - zgosceno_geslo
 *        - zadnjic_aktiven
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju administratorja
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Administrator'
 *    '400':
 *     description: <b>Napaka</b>, ime, priimek, elektronski_naslov, zgosceno geslo in zadnjic_aktiven so vsi zahtevani podatki
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        elektronski naslov je obvezen:
 *         value:
 *          message: Spremenljivka 'elektronski_naslov' mora biti obvezno podana.
 *    '404':
 *     description: Administrator s tem <b>ID-jem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        administrator ni najden:
 *         value:
 *          message: Ne najdem administratorja s podanim enoličnim identifikatorjem
 *    '500':
 *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */

var posodobiAdministratorja = (req, res) => {
  var idAdministratorja = req.params.id;

  if (
    !req.body.ime &&
    !req.body.priimek &&
    !req.body.elektronski_naslov &&
    !req.body.zgosceno_geslo &&
    !req.body.zadnjic_aktiven
  ) {
    res.status(400).json({
      sporočilo: "Napaka, ime, priimek,elektronski_naslov in zgosceno geslo so vsi zahtevani podatki",
    });
  } else {
    Administratorji.findById(idAdministratorja).exec(function (
      error,
      administrator
    ) {
      if (!administrator) {
        res.status(404).json({
          sporočilo:
            "Ne najdem administratorja s podanim enoličnim identifikatorjem",
        });
      } else {
        if (req.body.ime) {
          administrator.ime = req.body.ime;
        }
        if (req.body.priimek) {
          administrator.priimek = req.body.priimek;
        }
        if (req.body.elektronski_naslov) {
          administrator.elektronski_naslov = req.body.elektronski_naslov;
        }
        if (req.body.zgosceno_geslo) {
          administrator.zgosceno_geslo = req.body.zgosceno_geslo;
        }
        if (req.body.zadnjic_aktiven) {
          administrator.zadnjic_aktiven = req.body.zadnjic_aktiven;
        }

        administrator.save(function (error, administrator) {
          if (error) {
            res
              .status(500)
              .json({ sporočilo: "Napaka na strežniku: " + error });
          } else {
            res.status(200).json(administrator);
          }
        });
      }
    });
  }
};

/**
 * @openapi
 * /administratorji/{id}:
 *  delete:
 *   summary: Izbriše administratorja.
 *   description: Izbriše administratorja s podanim enoličnim identifikatorjem.
 *   tags: [Administratorji]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> administratorja
 *      required: true
 *      example: 635a62f5dc5d7968e68464be
 *   responses:
 *    '204':
 *     description: Administrator je izbrisan.
 *    '400':
 *     description: <b>Napaka</b>, id administratorja je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: 'ID administratorja je obvezen podatek!'
 *    '404':
 *     description: Administrator ni najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        Administrator ni najden:
 *         value:
 *          message: Ne najdem administratorja s podanim enoličnim identifikatorjem.
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
var izbrisiAdministratorja = (req, res) => {
  var idAdministratorja = req.params.id;
  if (!idAdministratorja) {
    res
      .status(400)
      .json({ sporočilo: "ID administratorja je obvezen podatek!" });
  } else {
    Administratorji.findByIdAndRemove(
      idAdministratorja,
      function (error, rezultat) {
        if (!rezultat) {
          res.status(404).json({
            sporočilo:
              "Ne najdem administratorja s podanim enoličnim identifikatorjem",
          });
        } else if (error) {
          res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
        } else {
          res.status(204).send();
        }
      }
    );
  }
};

module.exports = {
  seznamAdministratorjev,
  podrobnostiAdministratorja,
  ustvariAdministratorja,
  posodobiAdministratorja,
  izbrisiAdministratorja,
};
