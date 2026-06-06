const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key');

const createPaymentIntent = async (amount, currency = 'usd') => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amounts in cents
            currency,
        });
        return paymentIntent;
    } catch (error) {
        console.error('Stripe API Error:', error);
        throw new Error('Failed to create payment intent with Stripe: ' + error.message);
    }
};

module.exports = { createPaymentIntent };
