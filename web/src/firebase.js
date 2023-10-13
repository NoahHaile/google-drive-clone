import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDztUaKGJj-rskOQd_SeW6l-PZdVPW9Cuk",
    authDomain: "auth-dev-93d51.firebaseapp.com",
    projectId: "auth-dev-93d51",
    storageBucket: "auth-dev-93d51.appspot.com",
    messagingSenderId: "16002571480",
    appId: "1:16002571480:web:fc8b414d156a01e92c8bad"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword };
export default app;