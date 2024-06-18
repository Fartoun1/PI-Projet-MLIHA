
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export function sendPersonalizedSms(to, body) {
    client.messages.create({
        body: body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
}

export function sendConfirmationSms(to, body) {
    client.messages.create({
        body: body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
}
