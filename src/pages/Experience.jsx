import { Briefcase, GraduationCap, CheckCircle, Languages, Heart } from 'lucide-react';

export default function Experience() {
  const experience = [
    {
      role: "IoT Intern",
      organization: "IIIT-Kottayam (PM VIKAS Program)",
      period: "Jun 2026 – Present",
      location: "Offline",
      bullets: [
        "Working on IoT solutions under the PM VIKAS project, gaining exposure to embedded hardware, sensor integration, and IoT communication protocols.",
        "Contributing to development and testing of IoT-based prototypes targeting real-world applications."
      ]
    },
    {
      role: "Flutter Intern (Training)",
      organization: "GJ Infotech",
      period: "Jun 2026 – Present",
      location: "Hybrid",
      bullets: [
        "Developing cross-platform mobile applications using Flutter and the Dart programming language.",
        "Participating in the full software development lifecycle — requirements gathering, UI design, testing, and deployment.",
        "Building reusable widget components and integrating REST APIs and Firebase backends into production-grade apps."
      ]
    }
  ];

  const education = [
    {
      degree: "B.Tech – Computer Science & Engineering",
      institution: "Christ College of Engineering (Autonomous), Irinjalakuda",
      period: "2023 – 2027",
      score: "CGPA 9.0 / 10.0"
    },
    {
      degree: "Higher Secondary Education (Class XII)",
      institution: "GMGHSS, Irinjalakuda",
      period: "2021 – 2023",
      score: "98%"
    },
    {
      degree: "Primary Education (Class X)",
      institution: "Little Flower Convent, Irinjalakuda",
      period: "2020 – 2021",
      score: "90%"
    }
  ];

  const skills = [
    { category: "Programming", list: ["Python", "C", "Java", "Dart", "JavaScript", "SQL"] },
    { category: "Web & Backend", list: ["HTML", "CSS", "JavaScript", "Python Flask", "REST APIs"] },
    { category: "Mobile", list: ["Flutter", "Dart", "Firebase"] },
    { category: "Databases & Cloud", list: ["MySQL", "Firebase Firestore", "Firebase Auth"] },
    { category: "AI & Machine Learning", list: ["TensorFlow", "MobileNetV2", "Transfer Learning"] },
    { category: "Embedded Systems", list: ["Arduino Uno", "Ultrasonic Sensor", "Soil Moisture Sensor", "Servo Motors"] },
  ];

  return (
    <div className="exp-page">
      <div className="exp-page-hero">
        <div className="container">
          <span className="chip">Background</span>
          <h1 className="section-title" style={{ textAlign: 'left', marginTop: '12px' }}>Work Experience<br /><span>& Education</span></h1>
          <p className="section-subtitle" style={{ textAlign: 'left', margin: '12px 0 0' }}>
            My professional training, academic journey, and technical toolkit.
          </p>
        </div>
      </div>

      <div className="container section exp-grid">

        {/* LEFT COLUMN */}
        <div className="exp-left">

          {/* Work Experience */}
          <div className="exp-card">
            <div className="exp-card-head">
              <Briefcase size={20} className="card-icon orange" />
              <h2>Work History</h2>
            </div>
            <div className="timeline">
              {experience.map((exp, idx) => (
                <div className="tl-item" key={idx}>
                  <div className="tl-dot-col">
                    <div className="tl-dot orange" />
                    {idx < experience.length - 1 && <div className="tl-line" />}
                  </div>
                  <div className="tl-body">
                    <div className="tl-header">
                      <h3>{exp.role}</h3>
                      <span className="tl-period">{exp.period}</span>
                    </div>
                    <p className="tl-org">{exp.organization} <span className="tl-loc">· {exp.location}</span></p>
                    <ul className="tl-bullets">
                      {exp.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="exp-card">
            <div className="exp-card-head">
              <GraduationCap size={20} className="card-icon dark" />
              <h2>Academic Background</h2>
            </div>
            <div className="timeline">
              {education.map((edu, idx) => (
                <div className="tl-item" key={idx}>
                  <div className="tl-dot-col">
                    <div className="tl-dot dark" />
                    {idx < education.length - 1 && <div className="tl-line" />}
                  </div>
                  <div className="tl-body">
                    <div className="tl-header">
                      <h3>{edu.degree}</h3>
                      <span className="tl-period">{edu.period}</span>
                    </div>
                    <p className="tl-org">{edu.institution}</p>
                    <span className="score-badge">{edu.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="exp-right">

          {/* Skills */}
          <div className="exp-card skills-card">
            <div className="exp-card-head">
              <CheckCircle size={20} className="card-icon orange" />
              <h2>Technical Skills</h2>
            </div>
            <div className="skills-grid">
              {skills.map((s, i) => (
                <div className="skill-box" key={i}>
                  <h5>{s.category}</h5>
                  <div className="skill-tags">
                    {s.list.map((item, ii) => <span key={ii}>{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages & Hobbies */}
          <div className="lh-row">
            <div className="exp-card sub-card">
              <div className="exp-card-head">
                <Languages size={18} className="card-icon orange" />
                <h3>Languages</h3>
              </div>
              {[["English","Proficient"],["Malayalam","Native"],["Hindi","Intermediate"]].map(([l,lvl]) => (
                <div className="lang-row" key={l}>
                  <span className="lang-name">{l}</span>
                  <span className="lang-lvl">{lvl}</span>
                </div>
              ))}
            </div>
            <div className="exp-card sub-card">
              <div className="exp-card-head">
                <Heart size={18} className="card-icon orange" />
                <h3>Interests</h3>
              </div>
              <div className="hobby-wrap">
                {["Canva Design","UI/UX","Hackathons","Drawing","Dancing"].map(h => (
                  <span key={h} className="hobby-chip">{h}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .exp-page { width: 100%; }

        .exp-page-hero {
          background: var(--dark);
          padding: 60px 0 48px;
        }

        .exp-page-hero .section-title {
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
        }

        .exp-page-hero .section-title span { color: var(--primary); }

        .exp-page-hero .section-subtitle { color: rgba(255,255,255,0.55); }

        .exp-page-hero .chip {
          background: var(--primary);
          color: #fff;
        }

        .exp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .exp-grid { grid-template-columns: 1fr; }
        }

        .exp-left, .exp-right {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .exp-card {
          background: #fff;
          border: 1.5px solid var(--card-border);
          border-radius: 20px;
          padding: 28px;
          transition: var(--transition);
        }

        .exp-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
        }

        .exp-card-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .exp-card-head h2 {
          font-size: 1.2rem;
          font-family: 'Playfair Display', serif;
        }

        .exp-card-head h3 {
          font-size: 1.05rem;
        }

        .card-icon.orange { color: var(--primary); }
        .card-icon.dark { color: var(--dark); }

        /* Timeline */
        .tl-item {
          display: flex;
          gap: 18px;
          margin-bottom: 24px;
        }

        .tl-item:last-child { margin-bottom: 0; }

        .tl-dot-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          flex-shrink: 0;
          width: 14px;
        }

        .tl-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .tl-dot.orange { background: var(--primary); }
        .tl-dot.dark { background: var(--dark); }

        .tl-line {
          flex: 1;
          width: 2px;
          background: var(--card-border);
          margin-top: 4px;
          min-height: 24px;
        }

        .tl-body { flex: 1; }

        .tl-header {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 4px;
          align-items: flex-start;
        }

        .tl-header h3 { font-size: 1rem; font-weight: 800; }

        .tl-period {
          background: var(--primary-light);
          color: var(--primary-dark);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          white-space: nowrap;
        }

        .tl-org { font-size: 0.88rem; color: var(--text-muted); font-weight: 600; margin-bottom: 10px; }
        .tl-loc { color: var(--primary); }

        .tl-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tl-bullets li {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.55;
          padding-left: 14px;
          position: relative;
        }

        .tl-bullets li::before {
          content: "–";
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: 700;
        }

        .score-badge {
          background: var(--primary-light);
          color: var(--primary-dark);
          font-size: 0.8rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 50px;
          display: inline-block;
        }

        /* Skills grid */
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .skill-box {
          background: var(--bg-card-alt);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 14px;
        }

        .skill-box h5 {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .skill-tags span {
          background: #fff;
          border: 1px solid var(--card-border);
          color: var(--text);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 50px;
        }

        /* Lang & Hobbies */
        .lh-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .lang-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.88rem;
        }

        .lang-row:last-child { border: none; }
        .lang-name { font-weight: 700; }
        .lang-lvl { color: var(--text-muted); }

        .hobby-wrap { display: flex; flex-wrap: wrap; gap: 6px; }

        .hobby-chip {
          background: var(--bg-card-alt);
          border: 1px solid var(--card-border);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 50px;
        }
      `}</style>
    </div>
  );
}
