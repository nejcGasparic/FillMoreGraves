const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();

// require("../models/schemas")

const ctrlDokumenti = require('../controllers/dokumenti');
const ctrlSprozilci =  require('../controllers/sprozilci');
const ctrlNavadniUporabniki = require('../controllers/navadniUporabniki');
const ctrlAdministratorji = require('../controllers/administratorji');
const ctrlTipiDokumentov = require('../controllers/dokumenti-tipi');


/* Dokumenti storitve */
router.get('/dokumenti', ctrlDokumenti.seznamDokumentov);
router.get('/dokumenti/:id', ctrlDokumenti.podrobnostiDokumenta);
router.delete('/dokumenti/:id', ctrlDokumenti.izbrisiDokument);
router.post('/dokumenti', upload.single('datoteka'),ctrlDokumenti.ustvariDokument);
router.put('/dokumenti/:id', upload.single('datoteka'),ctrlDokumenti.posodobiDokument);

/* Sprozilci storitve */
router.get('/sprozilci', ctrlSprozilci.seznamSprozilcev);
router.get('/sprozilci/:id', ctrlSprozilci.podrobnostiSprozilca);
router.delete('/sprozilci/:id', ctrlSprozilci.izbrisiSprozilca);
router.post('/sprozilci/', ctrlSprozilci.ustvariSprozilca);
router.put('/sprozilci/:id', ctrlSprozilci.posodobiSprozilca);

/* NavadniUporobniki storitve */
router.get('/navadniUporabniki', ctrlNavadniUporabniki.seznamNavadnihUporabnikov);
router.get('/navadniUporabniki/:id', ctrlNavadniUporabniki.podrobnostiNavadnegaUporabnika);
router.get('/navadniUporabniki/vloga/:id', ctrlNavadniUporabniki.vrniVlogoNavadnegaUporabnika); //TO-DO
router.delete('/navadniUporabniki/:id', ctrlNavadniUporabniki.izbrisiNavadnegaUporabnika);
router.post('/navadniUporabniki/', ctrlNavadniUporabniki.ustvariNavadnegaUporabnika);
router.put('/navadniUporabniki/:id', ctrlNavadniUporabniki.posodobiNavadnegaUporabnika);

/* Administratorji storitve */
router.get('/administratorji', ctrlAdministratorji.seznamAdministratorjev);
router.get('/administratorji/:id', ctrlAdministratorji.podrobnostiAdministratorja);
router.delete('/administratorji/:id', ctrlAdministratorji.izbrisiAdministratorja);
router.post('/administratorji/', ctrlAdministratorji.ustvariAdministratorja);
router.put('/administratorji/:id', ctrlAdministratorji.posodobiAdministratorja);

/* Tipi dokumentov storitve */
router.get('/dokumentiTipi', ctrlTipiDokumentov.seznamTipov);
router.get('/dokumentiTipi/:id', ctrlTipiDokumentov.podrobnostiTipa);
router.delete('/dokumentiTipi/:id', ctrlTipiDokumentov.izbrisiTip);
router.post('/dokumentiTipi/', ctrlTipiDokumentov.ustvariTip);
router.put('/dokumentiTipi/:id', ctrlTipiDokumentov.posodobiTip);


module.exports = router;