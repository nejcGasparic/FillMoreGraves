const utf8 = require("utf8-encoder");
var sprozilci = require("../../data/sprozilci.json");
const mongoose = require("mongoose");
const Sprozilci = mongoose.model("Sprozilec");

/**
 * @openapi
 *  /sprozilci:
 *   get:
 *    summary: Pridobi seznam vseh sprozilcev.
 *    description: Pridobi seznam vseh sprozilcev, ki so na voljo administratorju.
 *    tags: [Sprozilci]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, s seznamom sprozilcev.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Sprožilci'
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
var seznamSprozilcev = (req, res) => {
  Sprozilci.find().exec(function (error, seznam) {
    if (error) {
      res.status(404).json({ sporočilo: "Napaka pri poizvedbi: " + error });
    } else {
      res.status(200).json(seznam);
    }
  });
};
/**
 * @openapi
 * /sprozilci/{id}:
 *  get:
 *   summary: Vrni podrobnosti sprozilca.
 *   description: Vrni podrobnosti sprozilca na podlagi enoličnega identifikatorja.
 *   tags: [Sprozilci]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> dokumenta
 *      required: true
 *   responses:
 *    '200':
 *     description: <b>OK</b>, sprožilec najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Sprožilci'
 *       example:
 *    '404':
 *     description: 'Ne najdem sprožilca s podanim enoličnim identifikatorjem.'
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
var podrobnostiSprozilca = (req, res) => {
  var idSprozilca = req.params.id;

  Sprozilci.findById(idSprozilca).exec(function (error, sprozilec) {
    if (!sprozilec) {
      res.status(404).json({
        sporočilo: "Ne najdem sprožilca s podanim enoličnim identifikatorjem",
      });
    } else if (error) {
      res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
    } else {
      res.status(200).json(sprozilec);
    }
  });
};

/**
 * @openapi
 * /sprozilci:
 *  post:
 *   summary: Doda novega sprožilca.
 *   description: Doda novega sprožilca v bazo.
 *   tags: [Sprozilci]
 *   requestBody:
 *    description: Sprožilec.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        _id:
 *         type: string
 *         description: <b>enolični identifikator</b> sprožilca
 *         example: 635a62f5dc5d7968e68464be
 *        id_administratorja:
 *         type: string
 *         description: kateremu administratorju pripada sprožilec
 *        ime:
 *         type: string
 *         description: <b>ime</b> sprožilca
 *        pogoji:
 *         type: object
 *         properties:
 *          tragicni_dogodki:
 *           type: object
 *           properties:
 *            izbrano:
 *             type: Boolean
 *            verifikacija:
 *             type: object
 *             properties:
 *              osmrtnice_si:
 *               type: object
 *               properties:
 *                izbrano:
 *                 type: Boolean
 *              potrditev_navadnega_uporabnika:
 *               type: object
 *               properties:
 *                izbrano:
 *                 type: Boolean
 *                casovnika:
 *                 type: object
 *                 properties:
 *                  leta:
 *                   type: number
 *                  meseci:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 12
 *                  dnevi:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 29
 *                sporocilo:
 *                 type: object
 *                 properties:
 *                  leta:
 *                   type: number
 *                  meseci:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 11
 *                  dnevi:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 29
 *                verifikatorji:
 *                 type: array
 *                 items:
 *                  type: number
 *          potek_intervala:
 *           type: object
 *           properties:
 *            izbrano:
 *             type: Boolean
 *            casovnika:
 *             type: object
 *             properties:
 *              leta:
 *               type: number
 *              meseci:
 *               type: number
 *               minimum: 0
 *               maximum: 12
 *              dnevi:
 *               type: number
 *               minimum: 0
 *               maximum: 29
 *            sporocilo:
 *             type: object
 *             properties:
 *              leta:
 *               type: number
 *              meseci:
 *               type: number
 *               minimum: 0
 *               maximum: 11
 *              dnevi:
 *               type: number
 *               minimum: 0
 *               maximum: 29
 *            verifikatorji:
 *             type: array
 *             items:
 *              type: number
 *       required:
 *        - _id
 *        - id_administratorja
 *        - ime
 *   responses:
 *    '201':
 *     description: Uspešno <b>ustvarjen</b> nov sprožilec.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Sprozilec'
 *    '400':
 *     description: Napaka, niso vnešeni vsi obvezni podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        id_administratorja je obvezen:
 *         value:
 *          message: Body parameter 'id_administratorja' je obvezen.
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */

var ustvariSprozilca = (req, res) => {
  //če manjkata osnovna podatka
  if (!req.body.id_administratorja || !req.body.ime) {
    res
      .status(400)
      .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
  }
  //če ni izbrana nobena izmed dveh tipov shem
  if (
    !(req.body.pogoji.tragicni_dogodki.izbrano == true) ||
    !(req.body.pogoji.potek_intervala.izbrano == true)
  ) {
    res
      .status(400)
      .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
  }
  //če je izbrana shema potek intervala in so njeni podatki prazni
  if (req.body.pogoji.potek_intervala.izbrano == true) {
    if (
      req.body.pogoji.potek_intervala.casovnika.leta == undefined ||
      req.body.pogoji.potek_intervala.casovnika.meseci == undefined ||
      req.body.pogoji.potek_intervala.casovnika.dnevi == undefined ||
      req.body.pogoji.potek_intervala.sporocilo.leta == undefined ||
      req.body.pogoji.potek_intervala.sporocilo.meseci == undefined ||
      req.body.pogoji.potek_intervala.sporocilo.dnevi == undefined ||
      !req.body.pogoji.potek_intervala.verifikatorji
    ) {
      res
        .status(400)
        .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
    }
  } else {
    //če je izbrana shema tragični dogodek in ni izbrana nobena izbmed podshem
    if (
      !(
        req.body.pogoji.tragicni_dogodki.verifikacija.osmrtnice_si.izbrano ==
        true
      ) &&
      !(
        req.body.pogoji.tragicni_dogodki.verifikacija
          .potrditev_navadnega_uporabnika.izbrano == true
      )
    ) {
      res
        .status(400)
        .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
    }
    //če je izbrana podshema potrditev_nav_upor. mora vsebovati vse podatke
    if (
      !(
        req.body.pogoji.tragicni_dogodki.verifikacija.osmrtnice_si.izbrano ==
        true
      )
    ) {
      if (
        req.body.pogoji.tragicni_dogodki.verifikacija
          .potrditev_navadnega_uporabnika.casovnika.leta == undefined ||
        req.body.pogoji.tragicni_dogodki.verifikacija
          .potrditev_navadnega_uporabnika.casovnika.meseci == undefined ||
        req.body.pogoji.tragicni_dogodki.verifikacija
          .potrditev_navadnega_uporabnika.casovnika.dnevi == undefined ||
        req.body.pogoji.tragicni_dogodki.verifikacija
          .potrditev_navadnega_uporabnika.sporocilo.leta == undefined ||
        req.body.pogoji.tragicni_dogodki.verifikacija
          .potrditev_navadnega_uporabnika.sporocilo.meseci == undefined ||
        req.body.pogoji.tragicni_dogodki.verifikacija
          .potrditev_navadnega_uporabnika.sporocilo.dnevi == undefined ||
        !req.body.pogoji.tragicni_dogodki.verifikacija
          .potrditev_navadnega_uporabnika.verifikatorji
      ) {
        res
          .status(400)
          .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
      }
    }
  }

  var novSprozilec = {
    id_administratorja: req.body.id_administratorja,
    ime: req.body.ime,
    pogoji: {
      tragicni_dogodki: {
        izbrano: req.body.pogoji.tragicni_dogodki.izbrano,
        verifikacija: {
          osmrtnice_si: {
            izbrano:
              req.body.pogoji.tragicni_dogodki.verifikacija.osmrtnice_si
                .izbrano,
          },
          potrditev_navadnega_uporabnika: {
            izbrano:
              req.body.pogoji.tragicni_dogodki.verifikacija
                .potrditev_navadnega_uporabnika.izbrano,
            casovnika: {
              leta: req.body.pogoji.tragicni_dogodki.verifikacija
                .potrditev_navadnega_uporabnika.casovnika.leta,
              meseci:
                req.body.pogoji.tragicni_dogodki.verifikacija
                  .potrditev_navadnega_uporabnika.casovnika.meseci,
              dnevi:
                req.body.pogoji.tragicni_dogodki.verifikacija
                  .potrditev_navadnega_uporabnika.casovnika.dnevi,
            },
            sporocilo: {
              leta: req.body.pogoji.tragicni_dogodki.verifikacija
                .potrditev_navadnega_uporabnika.sporocilo.leta,
              leta: req.body.pogoji.tragicni_dogodki.verifikacija
                .potrditev_navadnega_uporabnika.sporocilo.meseci,
              leta: req.body.pogoji.tragicni_dogodki.verifikacija
                .potrditev_navadnega_uporabnika.sporocilo.dnevi,
            },
            verifikatorji:
              req.body.pogoji.tragicni_dogodki.verifikacija
                .potrditev_navadnega_uporabnika.verifikatorji,
          },
        },
      },
      potek_intervala: {
        izbrano: req.body.pogoji.potek_intervala.izbrano,
        casovnika: {
          leta: req.body.pogoji.potek_intervala.casovnika.leta,
          meseci: req.body.pogoji.potek_intervala.casovnika.meseci,
          dnevi: req.body.pogoji.potek_intervala.casovnika.dnevi,
        },
        sporocilo: {
          leta: req.body.pogoji.potek_intervala.sporocilo.leta,
          meseci: req.body.pogoji.potek_intervala.sporocilo.meseci,
          dnevi: req.body.pogoji.potek_intervala.sporocilo.dnevi,
        },
        verifikatorji: req.body.pogoji.potek_intervala.verifikatorji,
      },
    },
  };

  Sprozilci.create(novSprozilec, function (error, sprozilec) {
    if (error) {
      res.status(500).json({ sporočilo: "Napaka na strežniku: " + error });
    } else {
      res.status(201).json(sprozilec);
    }
  });
};

/**
 * @openapi
 * /sprozilci:
 *  put:
 *   summary: Posodobi sprožilca.
 *   description: Posodobi sprožilca s podanim enoloičnim identifikatorjem.
 *   tags: [Sprozilci]
 *   requestBody:
 *    description: Sprožilec.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        _id:
 *         type: string
 *         description: <b>enolični identifikator</b> sprožilca
 *         example: 635a62f5dc5d7968e68464be
 *        id_administratorja:
 *         type: string
 *         description: kateremu administratorju pripada sprožilec
 *        ime:
 *         type: string
 *         description: <b>ime</b> sprožilca
 *        pogoji:
 *         type: object
 *         properties:
 *          tragicni_dogodki:
 *           type: object
 *           properties:
 *            izbrano:
 *             type: Boolean
 *            verifikacija:
 *             type: object
 *             properties:
 *              osmrtnice_si:
 *               type: object
 *               properties:
 *                izbrano:
 *                 type: Boolean
 *              potrditev_navadnega_uporabnika:
 *               type: object
 *               properties:
 *                izbrano:
 *                 type: Boolean
 *                casovnika:
 *                 type: object
 *                 properties:
 *                  leta:
 *                   type: number
 *                  meseci:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 12
 *                  dnevi:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 29
 *                sporocilo:
 *                 type: object
 *                 properties:
 *                  leta:
 *                   type: number
 *                  meseci:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 11
 *                  dnevi:
 *                   type: number
 *                   minimum: 0
 *                   maximum: 29
 *                verifikatorji:
 *                 type: array
 *                 items:
 *                  type: number
 *          potek_intervala:
 *           type: object
 *           properties:
 *            izbrano:
 *             type: Boolean
 *            casovnika:
 *             type: object
 *             properties:
 *              leta:
 *               type: number
 *              meseci:
 *               type: number
 *               minimum: 0
 *               maximum: 12
 *              dnevi:
 *               type: number
 *               minimum: 0
 *               maximum: 29
 *            sporocilo:
 *             type: object
 *             properties:
 *              leta:
 *               type: number
 *              meseci:
 *               type: number
 *               minimum: 0
 *               maximum: 11
 *              dnevi:
 *               type: number
 *               minimum: 0
 *               maximum: 29
 *            verifikatorji:
 *             type: array
 *             items:
 *              type: number
 *       required:
 *        - _id
 *        - id_administratorja
 *        - ime
 *   responses:
 *    '200':
 *     description: Uspešno <b>posodobljen</b> sprožilec.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Sprozilec'
 *    '400':
 *     description: Napaka, niso vnešeni vsi obvezni podatki.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        id_administratorja je obvezen:
 *         value:
 *          message: Body parameter 'id_administratorja' je obvezen.
 *    '404':
 *     description: Sprozilec ni najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        Sprozilec ni najden:
 *         value:
 *          message: Ne najdem sprožilca s podanim enoličnim identifikatorjem.
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */

var posodobiSprozilca = (req, res) => {
  var idSprozilca = req.params.id;

  //preverimo, če je sploh kater parameter podan
  if (
    !req.body.id_administratorja &&
    !req.body.ime &&
    !req.body.pogoji.tragicni_dogodki.izbrano &&
    !req.body.pogoji.tragicni_dogodki.verifikacija.osmrtnice_si.izbrano &&
    !req.body.pogoji.tragicni_dogodki.verifikacija
      .potrditev_navadnega_uporabnika.izbrano &&
    req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika
      .casovnika.leta == undefined &&
    req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika
      .casovnika.meseci == undefined &&
    req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika
      .casovnika.dnevi == undefined &&
    req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika
      .sporocilo.leta == undefined &&
    req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika
      .sporocilo.meseci == undefined &&
    req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika
      .sporocilo.dnevi == undefined &&
    !req.body.pogoji.tragicni_dogodki.verifikacija
      .potrditev_navadnega_uporabnika.verifikatorji &&
    !req.body.pogoji.potek_intervala.izbrano &&
    req.body.pogoji.potek_intervala.casovnika.leta == undefined &&
    req.body.pogoji.potek_intervala.casovnika.meseci == undefined &&
    req.body.pogoji.potek_intervala.casovnika.dnevi == undefined &&
    req.body.pogoji.potek_intervala.sporocilo.leta == undefined &&
    req.body.pogoji.potek_intervala.sporocilo.meseci == undefined &&
    req.body.pogoji.potek_intervala.sporocilo.dnevi == undefined &&
    !req.body.pogoji.potek_intervala.verifikatorji
  ) {
    res.status(400).json({
      sporočilo: "Vsaj en parameter je obvezen!",
    });
  } else {
    Sprozilci.findById(idSprozilca).exec(function (error, sprozilec) {
      if (!sprozilec) {
        res.status(404).json({
          sporočilo: "Ne najdem sprožilca s podanim enoličnim identifikatorjem",
        });
      } else {
        //zamenjamo vse spremenjene parametre
        if (req.body.id_administratorja) {
          sprozilec.id_administratorja = req.body.id_administratorja;
        }
        if (req.body.ime) {
          sprozilec.ime = req.body.ime;
        }
        // if (req.body.pogoji.tragicni_dogodki.izbrano) {
        sprozilec.pogoji.tragicni_dogodki.izbrano =
          req.body.pogoji.tragicni_dogodki.izbrano;
        // }
        // if (
        //   req.body.pogoji.tragicni_dogodki.verifikacija.osmrtnice_si.izbrano
        // ) {
        sprozilec.pogoji.tragicni_dogodki.verifikacija.osmrtnice_si.izbrano =
          req.body.pogoji.tragicni_dogodki.verifikacija.osmrtnice_si.izbrano;
        // }
        // if (
        //   req.body.pogoji.tragicni_dogodki.verifikacija
        //     .potrditev_navadnega_uporabnika.izbrano
        // ) {
        sprozilec.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.izbrano =
          req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.izbrano;
        // }
        if (
          req.body.pogoji.tragicni_dogodki.verifikacija
            .potrditev_navadnega_uporabnika.casovnika.leta != undefined
        ) {
          sprozilec.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.casovnika.leta =
            req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.casovnika.leta;
        }
        if (
          req.body.pogoji.tragicni_dogodki.verifikacija
            .potrditev_navadnega_uporabnika.casovnika.meseci != undefined
        ) {
          sprozilec.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.casovnika.meseci =
            req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.casovnika.meseci;
        }
        if (
          req.body.pogoji.tragicni_dogodki.verifikacija
            .potrditev_navadnega_uporabnika.casovnika.dnevi != undefined
        ) {
          sprozilec.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.casovnika.dnevi =
            req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.casovnika.dnevi;
        }
        if (
          req.body.pogoji.tragicni_dogodki.verifikacija
            .potrditev_navadnega_uporabnika.sporocilo.leta != undefined
        ) {
          sprozilec.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.sporocilo.leta =
            req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.sporocilo.leta;
        }
        if (
          req.body.pogoji.tragicni_dogodki.verifikacija
            .potrditev_navadnega_uporabnika.sporocilo.meseci != undefined
        ) {
          sprozilec.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.sporocilo.meseci =
            req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.sporocilo.meseci;
        }
        if (
          req.body.pogoji.tragicni_dogodki.verifikacija
            .potrditev_navadnega_uporabnika.sporocilo.dnevi != undefined
        ) {
          sprozilec.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.sporocilo.dnevi =
            req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.sporocilo.dnevi;
        }
        if (
          req.body.pogoji.tragicni_dogodki.verifikacija
            .potrditev_navadnega_uporabnika.verifikatorji
        ) {
          sprozilec.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.verifikatorji =
            req.body.pogoji.tragicni_dogodki.verifikacija.potrditev_navadnega_uporabnika.verifikatorji;
        }
        // if (req.body.pogoji.potek_intervala.izbrano) {
        sprozilec.pogoji.potek_intervala.izbrano =
          req.body.pogoji.potek_intervala.izbrano;
        // }
        if (req.body.pogoji.potek_intervala.casovnika.leta != undefined) {
          sprozilec.pogoji.potek_intervala.casovnika.leta =
            req.body.pogoji.potek_intervala.casovnika.leta;
        }
        if (req.body.pogoji.potek_intervala.casovnika.meseci != undefined) {
          sprozilec.pogoji.potek_intervala.casovnika.meseci =
            req.body.pogoji.potek_intervala.casovnika.meseci;
        }
        if (req.body.pogoji.potek_intervala.casovnika.dnevi != undefined) {
          sprozilec.pogoji.potek_intervala.casovnika.dnevi =
            req.body.pogoji.potek_intervala.casovnika.dnevi;
        }
        if (req.body.pogoji.potek_intervala.sporocilo.leta != undefined) {
          sprozilec.pogoji.potek_intervala.sporocilo.leta =
            req.body.pogoji.potek_intervala.sporocilo.leta;
        }
        if (req.body.pogoji.potek_intervala.sporocilo.meseci != undefined) {
          sprozilec.pogoji.potek_intervala.sporocilo.meseci =
            req.body.pogoji.potek_intervala.sporocilo.meseci;
        }
        if (req.body.pogoji.potek_intervala.sporocilo.dnevi != undefined) {
          sprozilec.pogoji.potek_intervala.sporocilo.dnevi =
            req.body.pogoji.potek_intervala.sporocilo.dnevi;
        }
        if (req.body.pogoji.potek_intervala.verifikatorji) {
          sprozilec.pogoji.potek_intervala.verifikatorji =
            req.body.pogoji.potek_intervala.verifikatorji;
        }

        //preveri če parametri shem označenih z true obstajajo

        //če je izbrana shema s traginčnimi dogodki in podshemi nista izbrani
        if (sprozilec.pogoji.tragicni_dogodki.izbrano == true) {
          if (
            sprozilec.pogoji.tragicni_dogodki.verifikacija.osmrtnice_si
              .izbrano == false &&
            sprozilec.pogoji.tragicni_dogodki.verifikacija
              .potrditev_navadnega_uporabnika.izbrano == false
          ) {
            res
              .status(400)
              .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
          }
        }

        //če je izbrana shema časovnik in ni podanih vseh parametrov
        if (sprozilec.pogoji.potek_intervala.izbrano) {
          if (
            sprozilec.pogoji.potek_intervala.casovnika.leta == undefined ||
            sprozilec.pogoji.potek_intervala.casovnika.meseci == undefined ||
            sprozilec.pogoji.potek_intervala.casovnika.dnevi == undefined ||
            sprozilec.pogoji.potek_intervala.sporocilo.leta == undefined ||
            sprozilec.pogoji.potek_intervala.sporocilo.meseci == undefined ||
            sprozilec.pogoji.potek_intervala.sporocilo.dnevi == undefined ||
            !sprozilec.pogoji.potek_intervala.verifikatorji
          ) {
            res
              .status(400)
              .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
          }
        }

        //če je izbrana shema tragični dogodki - potrditev uporabnikov in ni podanih vseh parametrov
        if (
          sprozilec.pogoji.tragicni_dogodki.verifikacija
            .potrditev_navadnega_uporabnika.izbrano
        ) {
          if (
            sprozilec.pogoji.tragicni_dogodki.verifikacija
              .potrditev_navadnega_uporabnika.casovnika.leta == undefined ||
            sprozilec.pogoji.tragicni_dogodki.verifikacija
              .potrditev_navadnega_uporabnika.casovnika.meseci == undefined ||
            sprozilec.pogoji.tragicni_dogodki.verifikacija
              .potrditev_navadnega_uporabnika.casovnika.dnevi == undefined ||
            sprozilec.pogoji.tragicni_dogodki.verifikacija
              .potrditev_navadnega_uporabnika.sporocilo.leta == undefined ||
            sprozilec.pogoji.tragicni_dogodki.verifikacija
              .potrditev_navadnega_uporabnika.sporocilo.meseci == undefined ||
            sprozilec.pogoji.tragicni_dogodki.verifikacija
              .potrditev_navadnega_uporabnika.sporocilo.dnevi == undefined ||
            !sprozilec.pogoji.tragicni_dogodki.verifikacija
              .potrditev_navadnega_uporabnika.verifikatorji
          ) {
            res
              .status(400)
              .json({ sporočilo: "Potrebno je vnesti vse obvezne podatke!" });
          }
        }

        sprozilec.save(function (error, sprozilec) {
          if (error) {
            res
              .status(500)
              .json({ sporočilo: "Napaka na strežniku: " + error });
          } else {
            res.status(200).json(sprozilec);
          }
        });
      }
    });
  }
};
/**
 * @openapi
 * /sprozilci/{id}:
 *  delete:
 *   summary: Izbriše sprožilca.
 *   description: Izbriše sprožilca s podanim enoličnim identifikatorjem.
 *   tags: [Sprozilci]
 *   parameters:
 *    - name: id
 *      in: path
 *      schema:
 *       type: string
 *      description: <b>enolični identifikator</b> sprožilca
 *      required: true
 *      example: 635a62f5dc5d7968e68464be
 *   responses:
 *    '204':
 *     description: Sprožilec je izbrisan.
 *    '400':
 *     description: <b>Napaka</b>, ID sprožilca je obvezen podatek!
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: 'ID sprožilca je obvezen podatek!'
 *    '404':
 *     description: Sprožilec ni najden.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       examples:
 *        Sprožilec ni najden:
 *         value:
 *          message: Ne najdem sprožilca s podanim enoličnim identifikatorjem
 *    '500':
 *     description: '<b>Napaka na strežniku</b>, s sporočilom napake.'
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/SporočiloNapake'
 *       example:
 *        message: Podatkovna baza ni na voljo.
 */

var izbrisiSprozilca = (req, res) => {
  var idSprozilca = req.params.id;
  if (!idSprozilca) {
    res.status(400).json({ sporočilo: "ID sprožilca je obvezen podatek!" });
  } else {
    Sprozilci.findByIdAndRemove(idSprozilca, function (error, rezultat) {
      if (!rezultat) {
        res.status(404).json({
          sporočilo: "Ne najdem sprožilca s podanim enoličnim identifikatorjem",
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
  seznamSprozilcev,
  podrobnostiSprozilca,
  ustvariSprozilca,
  posodobiSprozilca,
  izbrisiSprozilca,
};
