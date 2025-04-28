import * as functions from "firebase-functions";
import app from "./main";

export const api = functions.https.onRequest(app);
