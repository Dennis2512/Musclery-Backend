import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Product } from './models/product.model';
import { ProductService } from './service/product.service';

const cors = require('cors')({ origin: true });

export function handler(
  request: functions.https.Request,
  response: functions.Response
) {
  // cors policies, allow all origins for now
  cors(request, response, async () => {
    // check the request method, only GET allowed for now
    switch (request.method) {
      case 'GET':
        await getProducts(response);
        break;
      default:
        response.status(501).send('Unexpected Request-Method.');
    }
  });
}

export async function getProducts(
  response: functions.Response<any>
): Promise<void> {
  try {
    // get all prods from database
    const data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> = await admin
      .firestore()
      .collection('products')
      .get();
    // convert data to list of products
    const products: Product[] = convertToProducts(data);
    // send products
    response.send({ products: products });
  } catch (err) {
    // send error when failed to get docs
    response.status(502).send(err);
  }
}

export function convertToProducts(
  data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
): Product[] {
  const ps = new ProductService();
  const products: Product[] = [];
  data.forEach((doc) => {
    const tmp = doc.data();
    // add the id to the product
    tmp['id'] = doc.id;
    if (ps.isCompatible(tmp)) {
      products.push(ps.toProduct(tmp));
    }
  });
  return products;
}
