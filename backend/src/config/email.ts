import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import 'dotenv/config';

// `family: 4` forces IPv4 DNS resolution – prevents silent hangs on Linux
// where the resolver may prefer IPv6 for smtp.ethereal.email.
// It's a valid net.Socket option passed through nodemailer but not yet
// reflected in @types/nodemailer, so we spread it via a cast.
const smtpOptions: SMTPTransport.Options = {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    ...({ family: 4 } as object),
};

export const transporter = nodemailer.createTransport(smtpOptions);
