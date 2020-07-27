var stripe = Stripe('pk_test_lklrgeo8pD3XXRKbdbkbs8q100geWV6hZ3');

document.getElementById('checkout').addEventListener("click", function(){

  stripe.redirectToCheckout({
    // Make the id field from the Checkout Session creation API response
    // available to this file, so you can provide it as argument here
    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
    sessionId: sessionStripeID
  }).then(function (result) {
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `result.error.message`.
  });

})