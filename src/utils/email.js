const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.from = `Natours.io ${process.env.EMAIL_FROM}`;
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
  }

  newTransport() {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return nodemailer.createTransport(
        sgTransport({
          auth: {
            api_key: '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'
          }
        })
      );
    }

    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
      }
    });
  }

  async send(temp, subject) {
    // 1) Render html based on a pug template
    const html = pug.renderFile(`${__dirname}/../view/email/${temp}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email option
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family!');
  }

  async sendPasswordReset() {
    await this.send('resetPassword', 'Your password reset token (valid for only 10 minutes)');
  }
};
