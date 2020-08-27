import * as functions from 'firebase-functions';
export function handler(
  request: functions.https.Request,
  response: functions.Response
): void {
  console.log(request);
  response.send('Hello from calories!');
}
