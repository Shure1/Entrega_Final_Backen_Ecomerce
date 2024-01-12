import nodemailer from "nodemailer";

/* config de nodemailer */
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "rodriguezelias485@gmail.com",
    /* pass que nos entrega google para el permiso de enviar correo */
    pass: process.env.PASSWORD_EMAIL,
    authMethod: "LOGIN",
  },
});

//?FUNCION QUE ENVIA EMAILS
export const sendRecoveryMail = (email, recoveryLink) => {
  const mailOptions = {
    /* desde que mail enviamos el correo*/
    from: "rodriguezelias485@gmail.com",
    /* hacia que mail enviamos el correo */
    to: email,
    subject: "Link para restablecer su contraseña",
    text: `Haga click en el siguiente enlace para restablecer su contraseña: ${recoveryLink}`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email enviado correctamente");
  });
};
