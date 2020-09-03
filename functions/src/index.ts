'use strict';
import * as functions from 'firebase-functions';
import * as trainingModule from './training';
import * as caloriesModule from './calories';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const calories: functions.HttpsFunction = caloriesModule.calories;

export const training: functions.HttpsFunction = trainingModule.training;
