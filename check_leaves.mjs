import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyA3ogSmoyx1iYohI2zhwFkL3Y41inMKzJI",
  authDomain:        "sneha-portfolio-46df9.firebaseapp.com",
  projectId:         "sneha-portfolio-46df9",
  storageBucket:     "sneha-portfolio-46df9.firebasestorage.app",
  messagingSenderId: "683201300125",
  appId:             "1:683201300125:web:63aa52791a5dd96a95f674"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

async function checkLeaves() {
  const ref = doc(db, 'pm_vikas', 'activities');
  const snap = await getDoc(ref);
  const events = snap.exists() ? snap.data().events || [] : [];
  
  const leaves = events.filter(e => e.date === "2026-07-01" || e.date === "2026-07-02" || e.date === "2026-07-15" || e.category === "leave" || e.category === "Leave");
  console.log(JSON.stringify(leaves, null, 2));
  process.exit(0);
}

checkLeaves();
