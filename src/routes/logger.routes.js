import { Router } from "express";

const Logger = Router();

Logger.get("/info", (req, res) => {
  req.logger.info(
    '<span style="color:blue">Texto informativo de Info</span><br/>'
  );
  res.send("Hola!");
});

Logger.get("/warning", (req, res) => {
  req.logger.warning('<span style="color:cyan">Texto Warning</span><br/>');
  res.send("Hola!");
});

Logger.get("/error", (req, res) => {
  req.logger.error('<span style="color:yellow">Texto Error</span><br/>');
  res.send("Hola!");
});

Logger.get("/fatal", (req, res) => {
  req.logger.fatal(
    '<span style="color:red">Texto informativo de Info</span><br/>'
  );
  res.send("Hola!");
});

Logger.get("/testArtillery", (req, res) => {
  res.send("Hola desde Artillery");
});
