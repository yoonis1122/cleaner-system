const axios = require('axios');
const crypto = require('crypto');

/**
 * Initiates a payment request via WaafiPay API
 * @param {string} accountNo - The customer's mobile money account number (e.g. 25261...)
 * @param {number} amount - The amount to charge
 * @param {string} description - Description of the charge
 * @returns {Promise<Object>} - The WaafiPay API response
 */
const initiateWaafiPayment = async (accountNo, amount, description = "Garbage Pickup Fee") => {
    try {
        const requestId = crypto.randomUUID();
        const referenceId = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        // Use environment variables for live credentials, fallback to test if not set
        const merchantUid = process.env.WAAFI_MERCHANT_UID || "M0910291";
        const apiUserId = process.env.WAAFI_API_USER_ID || "1000416";
        const apiKey = process.env.WAAFI_API_KEY || "API-675418888AHX";
        
        // WaafiPay expects string amount
        const stringAmount = Number(amount).toFixed(2).toString();

        const payload = {
            schemaVersion: "1.0",
            requestId: requestId,
            timestamp: timestamp,
            channelName: "WEB",
            serviceName: "API_PURCHASE",
            serviceParams: {
                merchantUid: merchantUid,
                apiUserId: apiUserId,
                apiKey: apiKey,
                paymentMethod: "MWALLET_ACCOUNT",
                payerInfo: {
                    accountNo: accountNo.toString()
                },
                transactionInfo: {
                    referenceId: referenceId,
                    invoiceId: referenceId.substring(0, 10), // Short invoice ID
                    amount: stringAmount,
                    currency: "USD",
                    description: description
                }
            }
        };

        const response = await axios.post('https://api.waafipay.com/asm', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            success: response.data.responseCode === '2001' || response.data.responseMsg === 'RCS_SUCCESS',
            data: response.data,
            referenceId: referenceId
        };
    } catch (error) {
        console.error('WaafiPay Error:', error.response ? error.response.data : error.message);
        throw new Error('Payment gateway failed. Please try again.');
    }
};

module.exports = {
    initiateWaafiPayment
};
