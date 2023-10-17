const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

/**
 * @openapi
 * components:
 *  schemas:
 *   Administrator:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>enolični identifikator</b> administratorja
 *      example: 635a62f5dc5d7968e68464be
 *     ime:
 *      type: string
 *      description: <b>ime</b> administratorja
 *     priimek:
 *      type: string
 *      description: <b>priimek</b> administratorja
 *     elektronski_naslov:
 *      type: string
 *      description: <b>elektronski naslov</b> administratorja
 *     zgosceno_geslo:
 *      type: string
 *      description: <b>geslo</b> administratorja
 *     zadnjic_aktiven:
 *      type: string
 *      description: <b>datum zadnje aktivnosti</b> administratorja
 *      format: date-time
 *    required:
 *     - _id
 *     - ime
 *     - priimek
 *     - elektronski_naslov
 *     - zgosceno_geslo
 *     - zadnjic_aktiven
 */

const administratorji_shema = new mongoose.Schema({
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    priimek: { type: String, required: [true, "Priimek je zahtevano polje"] },
    elektronski_naslov: { type: String, required: [true, "Elektronski naslov je zahtevano polje"] },
    zgosceno_geslo: { type: String, required: [true, "Zgoščeno geslo je zahtevano polje"] },
    zadnjic_aktiven: { type: String, required: [true, "Čas zadnje aktivnosti je zahtevano polje"] } // String je Datetime
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Navadni uporabnik:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>enolični identifikator</b> navadnega uporabnika
 *      example: 635a62f5dc5d7968e68464be
 *     id_administratorja:
 *      type: string
 *      description: kateremu administratorju pripada navadni uporabnik
 *     ime:
 *      type: string
 *      description: <b>ime</b> navadnega uporabnika
 *     priimek:
 *      type: string
 *      description: <b>priimek</b> navadnega uporabnika
 *     elektronski_naslov:
 *      type: string
 *      description: <b>elektronski naslov</b> navadnega uporabnika
 *     zgosceno_geslo:
 *      type: string
 *      description: <b>geslo</b> navadnega uporabnika
 *    required:
 *     - _id
 *     - id_administratorja
 *     - ime
 *     - priimek
 *     - elektronski_naslov
 *     - zgosceno_geslo
 */
const navadni_uporabniki_shema = new mongoose.Schema({
    id_administratorja: { type: String, required: [true, "id_administratorja je zahtevano polje"] }, // pove, kateremu administratorju pripadajajo (tistemu, ki jih je tudi ustvaril
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    priimek: { type: String, required: [true, "Ime je zahtevano polje"] },
    elektronski_naslov: { type: String, required: [true, "Elektronski naslov je zahtevano polje"] },
    zgosceno_geslo: { type: String, required: [true, "Zgoščeno geslo je zahtevano polje"] },
    // vloge se pridobijo dinamično iz ostalih podatkov
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Dokument:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>enolični identifikator</b> dokumenta
 *      example: 635a62f5dc5d7968e68464be
 *     id_administratorja:
 *      type: string
 *      description: kateremu administratorju pripada dokument
 *     ime:
 *      type: string
 *      description: <b>ime</b> dokumenta
 *     opis:
 *      type: string
 *      description: <b>opis</b> dokumenta
 *     zapisek:
 *      type: string
 *      description: <b>zapisek</b> dokumenta
 *     id_tipa:
 *      type: number
 *      description: <b>tip</b> dokumenta
 *     datoteka:
 *      type: string
 *      format: binary
 *     izbrani_sprozilci:
 *      type: array
 *      items:
 *       type: number
 *     izbrani_prejemniki:
 *      type: array
 *      items:
 *       type: string
 *    required:
 *     - _id
 *     - id_administratorja
 *     - ime
 *     - id_tipa
 *     - datoteka
 *     - izbrani_sprozilci
 *     - izbrani_prejemniki
 */
const dokumenti_shema = new mongoose.Schema({
    id_administratorja: { type: String, required: [true, "id_administratorja je zahtevano polje"] },
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    opis: { type: String },
    zapisek: { type: String },
    id_tipa: { type: Number, required: [true, "Tip dokumenta je zahtevano polje"] }, // glej tipi_dokumentov_shema
    datoteka: { type: Object, required: [true, "Datoteka je zahtevano polje"]  },
        // EXTRA
        // poverilnice_za_prijavo: {
        //     uporabnisko_ime: { type: string },
        //     geslo: { type: string }
        // },
        // bancni_racun: {
        //     TRR: { type: string },
        // },
        // zavarovalna_polica: {
        //     st_zavarovalne_police: { type: string}
        // },
        // sef: {
        //     kombinacija: { type: Number },
        //     lokacija: {
        //         latitude: { type: Number },
        //         longitude: { type: Number }
        //     }
        // },
        // predmet: {
        //     lokacija: {
        //         latitude: { type: Number },
        //         longitude: { type: Number }
        //     }
        // }
    izbrani_sprozilci: { type: [Number], required: [true, "Izbran mora biti vsaj en sprožilec"] },
    izbrani_prejemniki: { type: [String], required: [true, "Izbran mora biti vsaj en prejemnik"] }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Sprožilci:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>enolični identifikator</b> sprožilca
 *      example: 635a62f5dc5d7968e68464be
 *     id_administratorja:
 *      type: string
 *      description: kateremu administratorju pripada sprožilec
 *     ime:
 *      type: string
 *      description: <b>ime</b> sprožilca
 *     pogoji:
 *      type: object
 *      properties:
 *       tragicni_dogodki:
 *        type: object
 *        properties:
 *         izbrano:
 *          type: Boolean
 *         verifikacija:
 *          type: object
 *          properties:
 *           osmrtnice_si:
 *            type: object
 *            properties:
 *             izbrano:
 *              type: Boolean
 *           potrditev_navadnega_uporabnika:
 *            type: object
 *            properties:
 *             izbrano:
 *              type: Boolean
 *             casovnika:
 *              type: object
 *              properties:
 *               leta:
 *                type: number
 *               meseci:
 *                type: number
 *                minimum: 0
 *                maximum: 12
 *               dnevi:
 *                type: number
 *                minimum: 0
 *                maximum: 29
 *             sporocilo:
 *              type: object
 *              properties:
 *               leta:
 *                type: number
 *               meseci:
 *                type: number
 *                minimum: 0
 *                maximum: 11
 *               dnevi:
 *                type: number
 *                minimum: 0
 *                maximum: 29
 *             verifikatorji:
 *              type: array
 *              items:
 *               type: number
 *       potek_intervala:
 *        type: object
 *        properties:
 *         izbrano:
 *          type: Boolean
 *         casovnika:
 *          type: object
 *          properties:
 *           leta:
 *            type: number
 *           meseci:
 *            type: number
 *            minimum: 0
 *            maximum: 12
 *           dnevi:
 *            type: number
 *            minimum: 0
 *            maximum: 29
 *         sporocilo:
 *          type: object
 *          properties:
 *           leta:
 *            type: number
 *           meseci:
 *            type: number
 *            minimum: 0
 *            maximum: 11
 *           dnevi:
 *            type: number
 *            minimum: 0
 *            maximum: 29
 *         verifikatorji:
 *          type: array
 *          items:
 *           type: number
 *    required:
 *     - _id
 *     - id_administratorja
 *     - ime
 */
const sprozilci_shema = new mongoose.Schema({
    id_administratorja: { type: String, required: [true, "id_administratorja je zahtevano polje"] },
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    pogoji: {
        tragicni_dogodki: {
            izbrano: { type: Boolean },
            verifikacija: {
                osmrtnice_si: {
                    izbrano: { type: Boolean }
                },
                potrditev_navadnega_uporabnika: {
                    izbrano: { type: Boolean },
                    casovnika: {
                        leta: { type: Number },
                        meseci: { type: Number, min: 0, max: 12 },
                        dnevi: { type: Number, min: 0, max: 29 }
                    },
                    sporocilo: {
                        leta: { type: Number },
                        meseci: { type: Number, min: 0, max: 11 },
                        dnevi: { type: Number, min: 0, max: 29 }
                    },
                    verifikatorji: { type: [Number] }
                }
            }
        },
        potek_intervala: {
            izbrano: { type: Boolean },
            casovnika: {
                leta: { type: Number },
                meseci: { type: Number, min: 0, max: 12 },
                dnevi: { type: Number, min: 0, max: 29 }
            },
            sporocilo: {
                leta: { type: Number },
                meseci: { type: Number, min: 0, max: 11 },
                dnevi: { type: Number, min: 0, max: 29 }
            },
            verifikatorji: { type: [Number] }
        }
    }
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Tip dokumenta:
 *    type: object
 *    description:
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>enolični identifikator</b> tipa dokumenta
 *      example: 635a62f5dc5d7968e68464be
 *     id:
 *      type: number
 *      description: enolični identifikator tipa dokumenta
 *     ime:
 *      type: string
 *      description: ime tipa dokumenta
 *     opis:
 *      type: string
 *      description: opis tipa dokumenta
 *    required:
 *     - _id
 *     - id
 *     - ime
 *     - opis
 */
const tipi_dokumentov_shema = new mongoose.Schema({
    id: { type: Number, required: [true, "Identifikator je zahtevano polje"] },
    ime: { type: String, required: [true, "Ime je zahtevano polje"] },
    opis: { type: String, required: [true, "Opis je zahtevano polje"] }
});

mongoose.model("Administrator", administratorji_shema, "Administratorji");
mongoose.model("Navadni_uporabnik", navadni_uporabniki_shema, "Navadni_uporabniki");
mongoose.model("Dokument", dokumenti_shema, "Dokumenti");
mongoose.model("Sprozilec", sprozilci_shema, "Sprozilci");
mongoose.model("Tip_dokumenta", tipi_dokumentov_shema, "Tipi_dokumentov");
