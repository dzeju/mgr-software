import express from "express";
import { home } from "../controllers/home"

export const router = express.Router().get("/", home);