var express = require("express");
var router = express.Router();
require('dotenv').config()

var camera = require("../cameraData");


const stripe = require('stripe')(process.env.SK_STRIPE);

/* GET home page. */
router.get("/", function (req, res, next) {
	if (req.session.cameraCard == undefined) {
		req.session.cameraCard = [];
	}
	console.log(process.env.SK_STRIPE)

	res.render("home", { camera, cameraCard: req.session.cameraCard });
});

router.get("/basket", async function (req, res, next) {
	var exist = false;

	for (var i = 0; i < req.session.cameraCard.length; i++) {
		if (req.session.cameraCard[i].produit == req.query.produitFront) {
			req.session.cameraCard[i].quantité = Number(req.session.cameraCard[i].quantité) + 1;
			exist = true;
		}
	}

	if (exist == false) {
		req.session.cameraCard.push({
			produit: req.query.produitFront,
			prix: req.query.prixFront,
			quantité: 1
		});
	}

	var stripeCard = [];

	for(var i = 0; i< req.session.cameraCard.length; i++){
		stripeCard.push({
			name: req.session.cameraCard[i].produit,
			amount: req.session.cameraCard[i].prix * 100,
			currency: 'eur',
			quantity: req.session.cameraCard[i].quantité
		})
	}

	console.log(stripeCard)

	var sessionStripeID;

	if(stripeCard.length > 0){
		var session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: stripeCard,
			mode: 'payment',
			success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: 'http://localhost:3000/cancel',
		});

		sessionStripeID = session.id
	}

	

	res.render("basket", { cameraCard: req.session.cameraCard, sessionStripeID });
});

router.get("/delete", async function (req, res, next) {
	req.session.cameraCard.splice(req.query.position, 1);

	var stripeCard = [];

	for(var i = 0; i< req.session.cameraCard.length; i++){
		stripeCard.push({
			name: req.session.cameraCard[i].produit,
			amount: req.session.cameraCard[i].prix * 100,
			currency: 'eur',
			quantity: req.session.cameraCard[i].quantité
		})
	}

	console.log(stripeCard)

	var sessionStripeID;

	if(stripeCard.length > 0){
		var session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: stripeCard,
			mode: 'payment',
			success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: 'http://localhost:3000/cancel',
		});

		sessionStripeID = session.id
	}
	res.render("basket", { cameraCard: req.session.cameraCard, sessionStripeID });
});

router.post("/update", async function (req, res, next) {
	var position = req.body.position;
	var newQuantité = req.body.quantité;

	req.session.cameraCard[position].quantité = newQuantité;

	var stripeCard = [];

	for(var i = 0; i< req.session.cameraCard.length; i++){
		stripeCard.push({
			name: req.session.cameraCard[i].produit,
			amount: req.session.cameraCard[i].prix * 100,
			currency: 'eur',
			quantity: req.session.cameraCard[i].quantité
		})
	}

	console.log(stripeCard)

	var sessionStripeID;

	if(stripeCard.length > 0){
		var session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: stripeCard,
			mode: 'payment',
			success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: 'http://localhost:3000/cancel',
		});

		sessionStripeID = session.id
	}

	res.render("basket", { cameraCard: req.session.cameraCard, sessionStripeID });
});


router.get("/success", function (req, res, next) {

	res.render("confirm");
});

	module.exports = router;
