import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Bestellung } from './models/bestellung.model';
import { BestellungService } from './service/bestellung.service';

const cors = require('cors')({ origin: true });

export function handler(
  request: functions.https.Request,
  response: functions.Response
): void {
  cors(request, response, async () => {
    try {
      // als erstes wird der requestsender verifiziert
      const user: admin.auth.DecodedIdToken = await verify(request);
      // es wird nach requestmethod unterschieden
      switch (request.method) {
        case 'GET':
          await getOrders(user, response);
          break;
        case 'POST':
          await createOrder(user, request, response);
          break;
        default:
          // unbekannte requestmethod
          response.status(502).send('Unexpected method.');
      }
    } catch (err) {
      response.status(501).send(err);
    }
  });
}

// hier wird der token aus den headers geholt, der den requestsender verifiziert
export function token(request: functions.https.Request): string {
  if (request.headers.authorization?.startsWith('Bearer ')) {
    return request.headers.authorization.split('Bearer ')[1];
  } else {
    return '';
  }
}

export function verify(
  request: functions.https.Request
): Promise<admin.auth.DecodedIdToken> {
  return admin.auth().verifyIdToken(token(request));
}

export async function getOrders(
  user: admin.auth.DecodedIdToken,
  response: functions.Response
): Promise<void> {
  try {
    // alle bestellungen des requestsenders holen und schicken
    const orders = await admin
      .firestore()
      .doc('user/' + user.uid)
      .collection('bestellungen')
      .orderBy('zeitpunkt', 'asc')
      .get();
    // die rohen daten auf konsistenz prüfen, indem sie hier einmal zu instanzen der klasse bestellung gemacht werden
    const bestellungen: Bestellung[] = toBestellung(orders);
    response.send({ bestellungen: bestellungen });
  } catch (err) {
    response.status(504).send(err);
  }
}

export function toBestellung(
  orders: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
): Bestellung[] {
  const bs: BestellungService = new BestellungService();
  const bestellungen: Bestellung[] = [];
  if (orders !== null) {
    orders.forEach((doc) => {
      const data = doc.data();
      if (bs.isCompatible(data)) {
        bestellungen.push(bs.toBestellung(data));
      }
    });
  }
  return bestellungen;
}

export async function createOrder(
  user: admin.auth.DecodedIdToken,
  request: functions.https.Request,
  response: functions.Response
): Promise<void> {
  try {
    // eine neue bestellung soll aufgegeben werden

    if (request.body) {
      const bestellung = request.body.bestellung;
      // die bestellung wird unverändert in der datenbank gespeichert
      const res = await admin
        .firestore()
        .collection('user/' + user.uid + '/bestellungen')
        .add(bestellung);
      response.send({ created: res.id });
    } else {
      response.status(503).send('Bestellung nicht gefunden.');
    }
  } catch (err) {
    response.status(505).send(err);
  }
}
