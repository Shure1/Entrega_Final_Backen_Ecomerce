import { Router } from "express";

const LoggerRouter = Router();

LoggerRouter.get("/info", (req, res) => {
  req.logger.info(
    '<span style="color:blue">Texto informativo de Info</span><br/>'
  );
  res.send("Hola!");
});

LoggerRouter.get("/warning", (req, res) => {
  req.logger.warning('<span style="color:cyan">Texto Warning</span><br/>');
  res.send("Hola!");
});

LoggerRouter.get("/error", (req, res) => {
  req.logger.error('<span style="color:yellow">Texto Error</span><br/>');
  res.send("Hola!");
});

LoggerRouter.get("/fatal", (req, res) => {
  req.logger.fatal(
    '<span style="color:red">Texto informativo de Info</span><br/>'
  );
  res.send("Hola!");
});

LoggerRouter.get("/testArtillery", (req, res) => {
  res.send("Hola desde Artillery");
});

export default LoggerRouter;
