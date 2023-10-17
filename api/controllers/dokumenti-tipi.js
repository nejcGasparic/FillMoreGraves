const utf8 = require("utf8-encoder");
var tipi = require("../../data/dokumenti-tipi.json");
const mongoose = require("mongoose");
const Tipi_dokumentov = mongoose.model("Tip_dokumenta");

/**
 * @openapi
 *  /dokumentiTipi:
 *   get:
 *    summary: Pridobi seznam vseh tipov dokumentov.
 *    description: Pridobi seznam vseh tipov dokumentov, ki jih administrator lahko objavi.
 *    tags: [Dokumenti-tipi]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom tipov dokumentov.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Tip dokumenta'
 *        example:
 *         - _id: 639dfdb3e94ea25cc806dc8f
 *           ime: Datoteka
 *           opis: npr. oporoka, izpis zemljiške knjige, slike, itd
 *     '404':
 *      description: <b>Napaka pri poizvedbi</b>, s sporočilom napake.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SporočiloNapake'
 *        example:
 *         sporočilo: "Napaka pri poizvedbi: <opis napake>"
 */

var seznamTipov = (req, res) => {
  Tipi_dokumentov.find().exec(function (error, seznam) {
    if (error) {
      res.status(404).json({ sporočilo: "Napaka pri poizvedbi: " + error });
    } else {
      res.status(200).json(seznam);
    }
  });
};
/**
 * @openapi
 * /dokumentiTipi/{id}:
 *  get:
 *   summary: Vrni podrobnosti tipa dokumenta.
 *   description: Vrni podrobnosti tipa dokumenta na podlagi enoličnega identifikatorja.
 *   tags: [Dokumenti-tipi]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> dokumenta
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>,tip  dokumenta najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Tip dokumenta'
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
var podrobnostiTipa = (req, res) => {
  var idTipaDokumenta = req.params.id;

  Tipi_dokumentov.findById(idTipaDokumenta).exec(function (
    error,
    tip_dokumenta
  ) {
    if (!tip_dokumenta) {
      res.status(404).json({
        sporočilo:
          "Ne najdem tipa dokumenta s podanim enoličnim identifikatorjem",
      });
    } else if (error) {
      res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
    } else {
      res.status(200).json(tip_dokumenta);
    }
  });
};

/**
 * @openapi
 * /dokumentiTipi:
 *  post:
 *   summary: Doda nov tip dokumenta v bazo.
 *   description: Doda nov **tip** dokumenta.
 *   tags: [Dokumenti-tipi]
 *   requestBody:
 *    description: Tip_dokumentov.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *          required: 2
 *          example: John
 *        ime:
 *          required: true
 *          example: Shema1
 *        opis:
 *          required: true
 *          example: Opis sheme1
 *       required:
 *        - id
 *        - ime
 *        - opis
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjen</b> nov tip.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Tip dokumenta'
 *    '400':
 *     description: <b>Napaka</b>, id, ime, opis so vsi zahtevani podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        ime is required:
 *         value:
 *          message: Body parameter 'ime' je obvezen.
 *    '401':
 *     description: <b>Napaka</b>, ni pravice dostopa.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
var ustvariTip = (req, res) => {
  if (!req.body.id || !req.body.ime || !req.body.opis) {
    res
      .status(400)
      .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
  } else {
    var novTip = {
      id: req.body.id,
      ime: req.body.ime,
      opis: req.body.opis,
    };

    Tipi_dokumentov.create(novTip, function (error, tip) {
      if (error) {
        res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
      } else {
        res.status(201).json(tip);
      }
    });
  }
};

// /**
//  * @openapi
//  * /dokumentiTipi/{id}:
//  *  put:
//  *   summary: Posodobi tip dokumentov.
//  *   description: Posodobi tip dokumentov z izbranim enoličnim identifikatorjem.
//  *   tags: [Dokumenti-tipi]
//  *   parameters:
//  *    - name: id
//  *      in: path
//  *      schema:
//  *       type: string
//  *       pattern: '^[a-fA-F\d]{24}$'
//  *      description: <b>enolični identifikator</b> tipa dokumentov
//  *      required: true
//  *      example: 635a62f5dc5d7968e68464be
//  *   requestBody:
//  *    description: Tip dokumentov
//  *    required: true
//  *    content:
//  *     application/x-www-form-urlencoded:
//  *      schema:
//  *       type: object
//  *       properties:
//  *        id:
//  *          type: string
//  *          example: 52525fhl2
//  *        ime:
//  *          type: string
//  *          example: Listina
//  *        opis:
//  *          type: string
//  *          example: Opis listinge
//  *       required:
//  *        - id
//  *        - ime
//  *        - opis
//  *   responses:
//  *    '200':
//  *     description: <b>OK</b>, pri posodabljanju tipa
//  *     content:
//  *      application/json:
//  *       schema:
//  *        $ref: '#/components/schemas/Tip dokumenta'
//  *    '400':
//  *     description: <b>Napaka</b>, id, ime, opis so vsi zahtevani podatki
//  *     content:
//  *      application/json:
//  *       schema:
//  *        $ref: '#/components/schemas/SporočiloNapake'
//  *       examples:
//  *        id je obvezen:
//  *         value:
//  *          message: Spremenljivka 'id' mora biti obvezno podana.
//  *    '404':
//  *     description: Tip dokumenta s tem <b>ID-jem</b> ne obstaja, s sporočilom napake.
//  *     content:
//  *      application/json:
//  *       schema:
//  *        $ref: '#/components/schemas/SporočiloNapake'
//  *       examples:
//  *        Tip dokumenta ni najden:
//  *         value:
//  *          message: Ne najdem tipa dokumenta s podanim enoličnim identifikatorjem
//  *    '500':
//  *     description: <b>Napaka na strežniku</b>, s sporočilom napake.
//  *     content:
//  *      application/json:
//  *       schema:
//  *        $ref: '#/components/schemas/SporočiloNapake'
//  *       example:
//  *        message: Podatkovna baza ni na voljo
//  */
var posodobiTip = (req, res) => {
  var idTipa = req.params.id;

  if (!req.body.ime && !req.body.id && !req.body.opis) {
    res.status(400).json({
      sporočilo: "Napaka, id, ime, opis so vsi zahtevani podatki",
    });
  } else {
    Tipi_dokumentov.findById(idTipa).exec(function (error, tip) {
      if (!tip) {
        res.status(404).json({
          sporočilo: "Ne najdem tipa s podanim enoličnim identifikatorjem",
        });
      } else {
        if (req.body.id) {
          administrator.id = req.body.id;
        }
        if (req.body.ime) {
          administrator.ime = req.body.ime;
        }
        if (req.body.opis) {
          administrator.opis = req.body.opis;
        }

        tip.save(function (error, tip) {
          if (error) {
            res
              .status(500)
              .json({ sporočilo: "Napaka na strežniku: " + error });
          } else {
            res.status(200).json(tip);
          }
        });
      }
    });
  }
};

/**
 * @openapi
 * /dokumentiTipi/{id}:
 *  delete:
 *   summary: Izbriše tip dokumenta.
 *   description: Izbriše tip dokumenta s podanim enoličnim identifikatorjem.
 *   tags: [Dokumenti-tipi]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> tipa dokumenta
 *      required: true
 *      example: 635a62f5dc5d7968e68464be
 *   responses:
 *    '204':
 *     description: Tip dokumenta je izbrisan.
 *    '400':
 *     description: <b>Napaka</b>, id tipa dokumenta je zahtevan podatek.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: 'ID tipa dokumenta je obvezen podatek!'
 *    '404':
 *     description: Tip dokumenta ni najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        Tip dokumenta ni najden:
 *         value:
 *          message: Ne najdem tipa dokumenta s podanim enoličnim identifikatorjem.
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */
var izbrisiTip = (req, res) => {
  var idTipa = req.params.id;
  if (!idTipa) {
    res.status(400).json({ sporočilo: "ID tipa je obvezen podatek!" });
  } else {
    Tipi_dokumentov.findByIdAndRemove(idTipa, function (error, rezultat) {
      if (!rezultat) {
        res.status(404).json({
          sporočilo: "Ne najdem tipa s podanim enoličnim identifikatorjem",
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
  seznamTipov,
  podrobnostiTipa,
  ustvariTip,
  posodobiTip,
  izbrisiTip,
};
