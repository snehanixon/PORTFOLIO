import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

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

async function addLeaves() {
  try {
    const ref = doc(db, 'pm_vikas', 'activities');
    const snap = await getDoc(ref);
    let events = snap.exists() ? snap.data().events || [] : [];
    
    const leaveEvents = [
      {
        id: "leave-1",
        date: "2026-07-01",
        title: "Leave",
        category: "leave",
        description: "Took the day off."
      },
      {
        id: "leave-2",
        date: "2026-07-02",
        title: "Leave",
        category: "leave",
        description: "Took the day off."
      },
      {
        id: "leave-3",
        date: "2026-07-15",
        title: "Leave",
        category: "leave",
        description: "Took the day off."
      }
    ];

    // Merge leaves avoiding duplicates by date
    leaveEvents.forEach(leave => {
      const existingIdx = events.findIndex(e => e.date === leave.date);
      if (existingIdx !== -1) {
        events[existingIdx] = leave; // overwrite
      } else {
        events.push(leave);
      }
    });

    await setDoc(ref, { events });
    console.log(`✅ Successfully added leaves for July 1, 2, 15`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding leaves:', err);
    process.exit(1);
  }
}

addLeaves();
