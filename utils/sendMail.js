const sgMail = require("@sendgrid/mail");

// const { setApiKey, send } = sgMail;
const sendGridMail = async(email, link, customMessage) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: email, // Change to your recipient
            from: "gmkumaran87@gmail.com", // Change to your verified sender
            subject: "Sending with SendGrid for activate Account",
            text: link,
            html: `<strong>Kindly click the link for,</strong>
            <a href=${link}><button>${customMessage}</button></a>`,
        };

        const info = await sgMail.send(msg);

        // console.log("Email sent", info);
        return info;
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendGridMail;