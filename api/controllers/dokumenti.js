const utf8 = require("utf8-encoder");
var dokumenti = require("../../data/dokumenti.json");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer();
const Dokumenti = mongoose.model("Dokument");

/**
 * @openapi
 *  /dokumenti:
 *   get:
 *    summary: Pridobi seznam vseh dokumentov.
 *    description: Pridobi seznam vseh dokumentov, ki jih lahko ureja samo administrator.
 *    tags: [Dokumenti]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom dokumentov.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Dokument'
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

var seznamDokumentov = (req, res) => {
  Dokumenti.find().exec(function (error, seznam) {
    if (error) {
      res.status(404).json({ sporočilo: "Napaka pri poizvedbi: " + error });
    } else {
      res.status(200).json(seznam);
    }
  });
};

/**
 * @openapi
 * /dokumenti/{id}:
 *  get:
 *   summary: Vrni podrobnosti dokumenta.
 *   description: Vrni podrobnosti dokumenta na podlagi enoličnega identifikatorja.
 *   tags: [Dokumenti]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> dokumenta
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, dokument najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Dokument'
 *       example:
 *    '404':
 *     description: 'Ne najdem dokumenta s podanim enoličnim identifikatorjem.'
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

var podrobnostiDokumenta = (req, res) => {
  var idDokumenta = req.params.id;
  console.log(idDokumenta)
  Dokumenti.findById(idDokumenta).exec(function (error, dokument) {
    if (!dokument) {
      res.status(404).json({
        sporočilo: "Ne najdem dokumenta s podanim enoličnim identifikatorjem",
      });
    } else if (error) {
      res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
    } else {
      res.status(200).json(dokument);
    }
  });
};
/**
 * @openapi
 * /dokumenti:
 *  post:
 *   summary: Ustvari nov dokument
 *   description: Doda nov **dokument** administratorskega uporabnika v bazo.
 *   tags: [Dokumenti]
 *   requestBody:
 *    description: Nov dokument administratorskega uporabnika.
 *    required: true
 *    content:
 *      multipart/form-data:
 *        schema:
 *          type: object
 *          properties:
 *            id_administratorja:
 *              type: string
 *              example: 639e46084136976f7c08a2d7
 *            ime:
 *              type: string
 *              example: Lov na zaklad
 *            opis:
 *              type: string
 *            zapisek:
 *              type: string
 *              example: Pot do skritega zaklada, ki se nahaja nekje na Goriškem
 *            id_tipa:
 *              type: number
 *              example: 1
 *            datoteka:
 *              type: string
 *              format: binary
 *            izbrani_sprozilci:
 *              type: array
 *              items:
 *                type: number
 *            izbrani_prejemniki:
 *              type: array
 *              items:
 *                type: string
 *          required:
 *            - id_administratorja
 *            - ime
 *            - id_tipa
 *            - datoteka
 *            - izbrani_sprozilci
 *            - izbrani_prejemniki  
 *   responses:
 *    '201':
 *     description: Uspešno <b>dodan</b> nov dokument.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Dokument'
 *    '400':
 *     description: <b>Napaka</b>,id_administratorja, ime, id_tipa, datoteka, izbrani_sprozilci, izbrani_prejemniki so vsi zahtevani podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        id_administratorja is required:
 *         value:
 *          message: Body parameter 'id_administratorja' je obvezen.
 *    '401':
 *     description: <b>Napaka</b>, ni pravice dostopa.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
var ustvariDokument = (req, res) => {
  if (
    !req.body.id_administratorja ||
    !req.body.ime ||
    !req.body.id_tipa ||
    !req.body.izbrani_sprozilci ||
    !req.body.izbrani_prejemniki ||
    !req.file
  ) {
    res
      .status(400)
      .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
    //console.log(req.body);
  } else {
    var novDokument = {
      id_administratorja: req.body.id_administratorja,
      ime: req.body.ime,
      opis: req.body.opis,
      zapisek: req.body.zapisek,
      id_tipa: req.body.id_tipa,
      datoteka: req.file,
      izbrani_sprozilci: req.body.izbrani_sprozilci,
      izbrani_prejemniki: req.body.izbrani_prejemniki,
    };
    console.log(req.body);
    console.log(req.file);
    Dokumenti.create(novDokument, function (error, dokument) {
      if (error) {
        console.log(error);
        res.status(500).json({ sporočilo: "Napaka na strežniku: " });
      } else {
        res.status(201).json(dokument);
      }
    });
  }
};
/**
 * @openapi
 * /dokumenti/{id}:
 *  put:
 *   summary: Posodobi dokument
 *   description: Posodobi **dokument** z izbranim enoličnim identifikatorjem.
 *   tags: [Dokumenti]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> dokumenta
 *      required: true
 *      example: 639f2a2bdb5a1ec6418aeed2
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *            id_administratorja:
 *              type: string
 *              example: 639e46084136976f7c08a2d7
 *            ime:
 *              type: string
 *              example: Lov na zaklad
 *            opis:
 *              type: string
 *              required: true
 *            zapisek:
 *              type: string
 *              example: Pot do skritega zaklada, ki se nahaja nekje na Goriškem
 *            id_tipa:
 *              type: number
 *              example: 1
 *            datoteka:
 *              type: string
 *              format: binary
 *            izbrani_sprozilci:
 *              type: array
 *              items:
 *                type: number
 *            izbrani_prejemniki:
 *              type: array
 *              items:
 *                type: string
 *       required:
 *        - id_administratorja
 *        - ime
 *        - id_tipa
 *        - datoteka
 *        - izbrani_sprozilci
 *        - izbrani_prejemniki        
 *   responses:
 *    '200':
 *     description: <b>OK</b>, pri posodabljanju izbranega dokumenta
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Dokument'
 *    '400':
 *     description: <b>Napaka</b>,id_administratorja, ime, id_tipa, datoteka, izbrani_sprozilci, izbrani_prejemniki so vsi zahtevani podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        id_administratorja je obvezen:
 *         value:
 *          message: Spremenljivka 'id' mora biti obvezno podana.
 *    '404':
 *     description: Dokument s tem <b>ID-jem</b> ne obstaja, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        Dokument ni najden:
 *         value:
 *          message: Dokument z id '735a62f5dc5d7968e6846914' ni bil najden.
 *    '500':
 *     description: <b>Napaka na strežniku</b>, z sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo
 */
var posodobiDokument = (req, res) => {
  var idDokumenta = req.params.id;
  console.log(idDokumenta);
  if (
    !req.body.id_administratorja &&
    !req.body.ime &&
    !req.body.opis &&
    !req.body.zapisek &&
    !req.body.id_tipa &&
    !req.file.datoteka &&
    !req.body.izbrani_sprozilci &&
    !req.body.izbrani_prejemniki
  ) {
    res.status(400).json({
      sporočilo: "Vsaj en parameter je obvezen!",
    });
  } else {
    Dokumenti.findById(idDokumenta).exec(function (error, dokument) {
      if (!dokument) {
        res.status(404).json({
          sporočilo:
            "Ne najdem dokumenta s podanim enoličnim identifikatorjem",
        });
      } else {
        if (req.body.id_administratorja) {
            dokument.id_administratorja = req.body.id_administratorja;
        }
        if (req.body.ime) {
            dokument.ime = req.body.ime;
        }
        if (req.body.opis) {
            dokument.opis = req.body.opis;
        }
        if (req.body.zapisek) {
            dokument.zapisek = req.body.zapisek;
        }
        if (req.body.id_tipa) {
            dokument.id_tipa = req.body.id_tipa;
        }
        if (req.file) {
            dokument.datoteka = req.file;
        }
        if (req.body.izbrani_sprozilci) {
            dokument.izbrani_sprozilci = req.body.izbrani_sprozilci;
        }
        if (req.body.izbrani_prejemniki) {
            dokument.izbrani_prejemniki = req.body.izbrani_prejemniki;
        }

        dokument.save(function (error, dokument) {
          if (error) {
            res
              .status(500)
              .json({ sporočilo: "Napaka na strežniku: " + error });
          } else {
            res.status(200).json(dokument);
          }
        });
      }
    });
  }
};
/**
 * @openapi
 * /dokumenti/{id}:
 *  delete:
 *   summary: Izbriši dokument
 *   description: Izbriši **dokument** s podanim enoličnim identifikatorjem
 *   tags: [Dokumenti]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>enolični identifikator</b> dokumenta
 *      required: true
 *      example: 639f2a2bdb5a1ec6418aeed2
 *   responses:
 *    '204':
 *     description: Uspešno izbrisan dokument.
 *    '400':
 *     description: <b>Slab zahtevek</b>, s sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Spremenljivka 'id', ki se nahaja v poti je obvezna!
 *    '404':
 *     description: <b>Napaka</b>, dokument s tem id-jem ne obstaja.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        user not found:
 *         value:
 *          message: Dokument z id-jem '735a62f5dc5d7968e6846914' ni bil najden.
 *    '500':
 *     description: <b>Napaka na strežniku</b>, z sporočilom napake.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
var izbrisiDokument = (req, res) => {
  var idDokumenta = req.params.id;
  if (!idDokumenta) {
    res
      .status(400)
      .json({ sporočilo: "ID dokumenta je obvezen podatek!" });
  } else {
    Dokumenti.findByIdAndRemove(idDokumenta, function (error, rezultat) {
      if (!rezultat) {
        res.status(404).json({
          sporočilo:
            "Ne najdem dokumenta s podanim enoličnim identifikatorjem",
        });
      } else if (error) {
        res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
      } else {
        res.status(204).send();
      }
    });
  }
};

module.exports = {
  seznamDokumentov,
  podrobnostiDokumenta,
  ustvariDokument,
  posodobiDokument,
  izbrisiDokument,
};