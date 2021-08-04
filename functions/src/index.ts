import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

export const onCreate = functions.auth.user().onCreate(async (userRecord) => {
  const userCount = db.collection('counts').doc('users');
  const getUserCount = await userCount.get();
  userCount.update({ create: admin.firestore.FieldValue.increment(1) });

  db.collection('users')
    .doc(userRecord.uid)
    .set({
      name: userRecord.displayName,
      avatar: userRecord.photoURL,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      introduction: '',
      activityDay: '',
      activityTime: '',
      adress: '',
      age: '',
      comment: '',
      favorite: '',
      header: '',
      sex: '',
      playTitle: [],
      order: getUserCount.data()?.create + 1,
    });
});
