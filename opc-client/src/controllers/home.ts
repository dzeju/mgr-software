import { Request, Response } from 'express';
import { sensorsData } from '../data/sensorsData';

export const home = (request: Request, response: Response) => {
  console.log("request at /")
  response.type("application/json")
  if (sensorsData)
    response.status(200).send(JSON.stringify(sensorsData))
  else
    response.status(503).send("resource not available")
};
