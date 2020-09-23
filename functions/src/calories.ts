import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { food } from './models/food';
export const calories: functions.HttpsFunction = functions
  .region('europe-west2')
  .https.onRequest(
    async (
      request: functions.https.Request,
      response: functions.Response
    ): Promise<void> => {
      switch (request.method) {
        case 'GETALL':
          await getEveryFood(response);
          break;
        case 'GET':
          await getFood(request, response);
          break;
        default:
          response.status(405).send('Method not allowed.');
      }
    }
  );

  //functions

  async function getEveryFood(response: functions.Response): Promise<void>{
    try {
      const docs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await admin
      .firestore()
      .collection('Food-DB')
      .get();
      const foodL: food[] = [];
      docs.forEach((doc) => {
        foodL.push(
          new food(
            doc.id,
            doc.get('name'),
            doc.get('carbsPMG'),
            doc.get('category'),
            doc.get('hint'),
            doc.get('nutriScore'),
            doc.get('proteinsPMG'),
            doc.get('barcode'),
            doc.get('calPMG'),
            doc.get('fatPMG')
          )
        )
      });
      response.status(200).send({ data: foodL });
    } catch (e) {
      response.status(400).send('damn');
    }
  }

  async function getFood(request: functions.Request, response: functions.Response): Promise<void>{

  }