import { firebase
} from "@firebase/app";
import "@firebase/firestore";
import "@firebase/storage";
import "@firebase/auth";


firebase.initializeApp({
    apiKey: "AIzaSyD8Kfl2mOaDh7pO6ZfO7OEqnRdSJiWTLG0",
    authDomain: "awavideo-f4683.firebaseapp.com",
    databaseURL: "https://awavideo-f4683.firebaseio.com",
    projectId: "awavideo-f4683",
    storageBucket: "awavideo-f4683.appspot.com",
    messagingSenderId: "361724446811"
});

export const db = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();