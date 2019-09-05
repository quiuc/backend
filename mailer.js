'use strict';

const middy = require('middy');
const {
  cors
} = require('middy/middlewares');
require('dotenv').config();

const nodemailer = require('nodemailer');

const handler = async (event) => {
  try {
    
    const user = JSON.parse(event.body);

    if (!(user.name || user.email || user.message)) {
      return {
        statusCode: 400,
        body: 'Invalid schema.'
      }
    }

    const message = `Name: ${user.name}\nEmail: ${user.email}\n\nMessage: ${user.message}`;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAIL_PASSWORD 
      }
    });
  
    await transporter.sendMail({
      from: '"QUIUC Website Mailer" <quiucgeneral@gmail.com>',
      to: 'info@quiuc.org',
      subject: `New Message from '${user.email}'`,
      text: message, 
    });

    return {
      statusCode: 200
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }

};

module.exports.handler = middy(handler)
  .use(cors());
