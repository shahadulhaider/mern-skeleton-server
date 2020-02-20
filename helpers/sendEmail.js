const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

sgMail.setApiKey(config.snedgrid.apiKey);

const sendEmail = async options => {
  const message = {
    from: `${config.snedgrid.fromName} <${config.snedgrid.fromEmail}>`,
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  await sgMail.send(message);
};

module.exports = sendEmail;
