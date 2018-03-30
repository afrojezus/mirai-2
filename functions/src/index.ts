/**
 * Mirai server functions
 */

"use strict";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

export const authAL = functions.https.onRequest((req, res) => {
  const ALsecret = req.query.secret;

  return res.redirect(`/alsync?code=${ALsecret}`);
});

export const authMAL = functions.https.onRequest((req, res) => {
  const MALsecret = req.query.secret;
  return res.redirect(`/malsync?code=${MALsecret}`);
});
