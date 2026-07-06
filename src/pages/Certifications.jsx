import { Award, Star } from 'lucide-react';

export default function Certifications() {
  const certifications = [
    { name: "Machine Learning with Python", issuer: "IBM (Coursera)", year: "2025" },
    { name: "Introduction to Machine Learning", issuer: "NPTEL – IIT Kharagpur", year: "2025" },
    { name: "Foundations: Data, Data, Everywhere", issuer: "Google (Coursera)", year: "2025" },
    { name: "What is Generative AI?", issuer: "LinkedIn Learning", year: "2024" },
    { name: "MATLAB Onramp (Fundamentals)", issuer: "MathWorks", year: "2024" },
    { name: "MS Excel — Data Analysis Fundamentals", issuer: "Microsoft", year: "2024" },
    { name: "Machine Learning Bootcamp (3-Day)", issuer: "ICFOSS", year: "2024" }
  ];

  const awards = [
    "3rd Prize – Gesture Controlled Robotics Competition, Christ College of Engineering (1st Year B.Tech).",
    "3rd Prize – Drishti Project Expo for the Automated Waste Segregation System, Christ College of Engineering.",
    "Shortlisted to the Final Round of a Hackathon at Rajagiri College of Social Sciences (2025).",
    "Participated in a Hackathon at Universal Engineering College (2025).",
    "Attended a Cybersecurity Workshop at Christ College of Engineering (Autonomous), Irinjalakuda.",
    "Completed a 3-Day Machine Learning Bootcamp by ICFOSS with hands-on model development."
  ];

  return (
    <div className="cert-page">
      {/* Dark header banner */}
      <div className="cert-hero">
        <div className="container">
          <span className="chip cert-chip">Achievements</span>
          <h1 className="section-title" style={{ textAlign: 'left', marginTop: '12px' }}>
            Certifications<br /><span>& Awards</span>
          </h1>
          <p className="section-subtitle" style={{ textAlign: 'left', margin: '12px 0 0' }}>
            Professional credentials and recognition earned during my academic journey.
          </p>
        </div>
      </div>

      <div className="container section cert-layout">
        {/* CERTIFICATIONS */}
        <div className="cert-col">
          <div className="cert-col-head">
            <Award size={22} style={{ color: 'var(--primary)' }} />
            <h2>Certifications</h2>
          </div>
          <div className="cert-list">
            {certifications.map((c, idx) => (
              <div className="cert-tile" key={idx}>
                <div className="cert-num">{String(idx + 1).padStart(2, '0')}</div>
                <div className="cert-info">
                  <h5>{c.name}</h5>
                  <span>{c.issuer}</span>
                </div>
                <div className="cert-year-badge">{c.year}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AWARDS */}
        <div className="award-col">
          <div className="cert-col-head">
            <Star size={22} style={{ color: 'var(--primary)' }} />
            <h2>Honors & Awards</h2>
          </div>
          <div className="awards-list">
            {awards.map((a, i) => (
              <div className="award-tile" key={i}>
                <div className="award-star">★</div>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .cert-page { width: 100%; }

        .cert-hero {
          background: var(--dark);
          padding: 60px 0 48px;
        }

        .cert-hero .section-title {
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
        }

        .cert-hero .section-title span { color: var(--primary); }
        .cert-hero .section-subtitle { color: rgba(255,255,255,0.55); }

        .cert-chip { background: var(--primary); color: #fff; }

        .cert-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: start;
        }

        @media (max-width: 860px) {
          .cert-layout { grid-template-columns: 1fr; }
        }

        .cert-col-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .cert-col-head h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
        }

        .cert-list { display: flex; flex-direction: column; gap: 12px; }

        .cert-tile {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #fff;
          border: 1.5px solid var(--card-border);
          border-radius: 16px;
          padding: 18px 20px;
          transition: var(--transition);
        }

        .cert-tile:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
          transform: translateX(4px);
        }

        .cert-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--primary);
          opacity: 0.4;
          min-width: 32px;
          line-height: 1;
        }

        .cert-info { flex: 1; }

        .cert-info h5 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 3px;
        }

        .cert-info span {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .cert-year-badge {
          background: var(--primary-light);
          color: var(--primary-dark);
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 50px;
          flex-shrink: 0;
        }

        /* Awards */
        .awards-list { display: flex; flex-direction: column; gap: 14px; }

        .award-tile {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          background: #fff;
          border: 1.5px solid var(--card-border);
          border-radius: 16px;
          padding: 18px 20px;
          transition: var(--transition);
        }

        .award-tile:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .award-star {
          color: var(--primary);
          font-size: 1.1rem;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .award-tile p {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.55;
        }
      `}</style>
    </div>
  );
}
