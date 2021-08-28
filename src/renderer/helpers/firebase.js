import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

var config = {
    apiKey: "AIzaSyBhAK7lteBJ1_0ynbyC3C0KnZq7EHzbQpU",
    authDomain: "cadence-8edfc.firebaseapp.com",
    databaseURL: "https://cadence-8edfc.firebaseio.com",
    storageBucket: "cadence-8edfc.appspot.com"
}

export default Firebase.initializeApp(config);

        