'use strict';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const productsModule = require('./products');
const ordersModule = require('./orders');
admin.initializeApp();
/**
 * Hier werden lediglich die einzelnen functions definiert. Die Funktionalitäten werden in den TS-Dateien der functions
 * selber definiert.
 * Hier werden auch die namen und regionen (in welchen sie deployed wird) der functions definiert.
 */

export const products: functions.HttpsFunction = functions
  .region('europe-west2')
  .https.onRequest(
    (request: functions.https.Request, response: functions.Response) => {
      productsModule.handler(request, response);
    }
  );

export const orders: functions.HttpsFunction = functions
  .region('europe-west2')
  .https.onRequest(
    (request: functions.https.Request, response: functions.Response) => {
      ordersModule.handler(request, response);
    }
  );
