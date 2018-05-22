/**
 * Mirai server functions
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.authAL = functions.https.onRequest((req, res) => {
    const ALsecret = req.query.secret;
    return res.redirect(`/alsync?code=${ALsecret}`);
});
exports.authMAL = functions.https.onRequest((req, res) => {
    const MALsecret = req.query.secret;
    return res.redirect(`/malsync?code=${MALsecret}`);
});
//# sourceMappingURL=index.js.map