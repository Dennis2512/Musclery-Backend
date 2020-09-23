'use strict';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
import * as trainingModule from './training';
import * as caloriesModule from './calories';
import * as exerciseModule from './exercises';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const calories: functions.HttpsFunction = caloriesModule.calories;

export const training: functions.HttpsFunction = trainingModule.training;

export const exercises: functions.HttpsFunction = exerciseModule.exercises;
