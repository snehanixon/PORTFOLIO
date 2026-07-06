import { useEffect } from 'react';
import snehaPhoto from '../assets/sneha-photo.jpg';
import activity1 from '../assets/activity1.jpg';
import activity2 from '../assets/activity2.jpg';
import activity3 from '../assets/activity3.jpg';
import activity4 from '../assets/activity4.jpg';
import activity5 from '../assets/activity5.jpg';
import activity6 from '../assets/activity6.jpg';
import activity7 from '../assets/activity7.jpg';
import { Mail, Phone, MapPin, ArrowRight, Code2, Smartphone, Brain, Cpu } from 'lucide-react';

export default function Home({ setActiveTab, scrollToProjects, scrollToActivities }) {
  useEffect(() => {
    if (scrollToProjects) {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [scrollToProjects]);

  useEffect(() => {
    if (scrollToActivities) {
      const el = document.getElementById('activities');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [scrollToActivities]);

  const projects = [
    {
      title: "To-Do List App",
      description: "Built a cross-platform task management app with Material Design UI for Android and iOS using Flutter and Dart. Integrated Firebase Authentication for secure login and Firebase Firestore for real-time cloud data sync across devices. Implemented full CRUD with task prioritisation, completion tracking, and state management via Provider and setState.",
      tech: ["Flutter", "Dart", "Firebase Firestore", "Firebase Auth", "Android/iOS"],
      type: "Mobile App",
      color: "#F5A623"
    },
    {
      title: "PicCheck — AI Image Detector",
      description: "Developed an AI-powered browser extension identifying AI-generated vs authentic images in real time. Fine-tuned MobileNetV2 on the CiFAKE dataset via transfer learning; implemented a lightweight browser-optimised inference pipeline. Integrated ML predictions into a user-friendly browser interface providing instant visual feedback.",
      tech: ["Python", "MobileNetV2", "TensorFlow/Keras", "CiFAKE", "Browser Extension"],
      type: "AI/ML",
      color: "#1A1A1A"
    },
    {
      title: "Civic Reporting Management System",
      description: "Built a web-based civic grievance platform enabling citizens to report and track public infrastructure issues. Designed Flask backend with RESTful APIs and MySQL storage; created separate dashboards for citizens and authorities. Implemented full complaint lifecycle: submission, status updates, verification, and closure.",
      tech: ["HTML/CSS", "JavaScript", "Python Flask", "MySQL", "RESTful APIs"],
      type: "Web App",
      color: "#F5A623"
    },
    {
      title: "Arduino Car Parking System",
      description: "Designed a smart parking system with ultrasonic sensors for real-time vehicle detection and slot occupancy monitoring. Developed a live display showing available parking slots to drivers; enhanced skills in sensor interfacing and embedded logic.",
      tech: ["Arduino Uno", "Ultrasonic Sensors", "Embedded C"],
      type: "Embedded System",
      color: "#1A1A1A"
    },
    {
      title: "Automated Waste Segregation System",
      description: "Built an automated classifier distinguishing wet/dry waste using ultrasonic and soil moisture sensors with servo-motor sorting.",
      tech: ["Arduino Uno", "Ultrasonic Sensor", "Soil Moisture Sensor", "Servo Motor", "Embedded C"],
      type: "Embedded System",
      color: "#F5A623"
    }
  ];

  const stats = [
    { value: "9.0", label: "CGPA" },
    { value: "5", label: "Projects" },
    { value: "7", label: "Certifications" },
    { value: "3+", label: "Awards" },
  ];

  const skills = [
    { icon: <Code2 size={20} />, label: "Web Dev", detail: "Flask · HTML · CSS · JS" },
    { icon: <Smartphone size={20} />, label: "Mobile", detail: "Flutter · Dart · Firebase" },
    { icon: <Brain size={20} />, label: "AI / ML", detail: "TensorFlow · MobileNet" },
    { icon: <Cpu size={20} />, label: "IoT", detail: "Arduino · Sensors · Actuators" },
  ];

  const activities = [
    { img: activity1, label: "Rajagiri Conclave Confluence 2.0 (Hackathon Participation)" },
    { img: activity2, label: "3rd Prize Winner at Christ College of Engineering Expo" },
    { img: activity3, label: "Collaborative Coding Workshop & Project Sprint Sessions" },
    { img: activity4, label: "IoT / VR Development Training Session at Christ College" },
    { img: activity5, label: "CSE Undergraduate Cohort Class Photo" },
    { img: activity6, label: "Coding Hackathon Team Collaborative Workshop" },
    { img: activity7, label: "Team Presentation & Civic Platform Demo Showcase" }
  ];

  return (
    <div className="home-page">

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-layout">

            {/* Left: Text Content */}
            <div className="hero-text animate-fade-in-up">
              <div className="hero-badge-row">
                <span className="chip">CSE Undergraduate · CGPA 9.0</span>
              </div>

              <h1 className="hero-heading">
                Hi, I'm<br />
                <span className="hero-name-highlight">Sneha Nixon</span>
              </h1>

              <p className="hero-tagline">
                <span className="tagline-role">Software Developer</span>
                <span className="tagline-divider">|</span>
                <span className="tagline-role">IoT Intern</span>
              </p>

              <p className="hero-bio">
                Motivated final-year B.Tech CSE student at Christ College of Engineering (Autonomous), Irinjalakuda — CGPA 9.0. 
                Proficient in Python, C, Java, Dart, HTML, CSS, JavaScript, and MySQL with hands-on experience in AI/ML, 
                embedded systems, full-stack web, and cross-platform mobile development. Currently interning as an IoT Intern at IIIT Kottayam 
                and Flutter Intern at GJ Infotech. Passionate about building impactful, technology-driven solutions.
              </p>

              <div className="hero-contacts">
                <a href="mailto:snehanixon10@gmail.com" className="contact-pill">
                  <Mail size={14} />
                  snehanixon10@gmail.com
                </a>
                <a href="tel:+917736298768" className="contact-pill">
                  <Phone size={14} />
                  +91 7736298768
                </a>
                <span className="contact-pill loc">
                  <MapPin size={14} />
                  Thrissur, Kerala
                </span>
              </div>

              <div className="hero-actions">
                <button className="btn" onClick={() => setActiveTab('experience')}>
                  View Experience <ArrowRight size={16} />
                </button>
                <a href="https://linkedin.com/in/sneha-nixon1" target="_blank" rel="noopener noreferrer" className="btn-social" title="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="https://github.com/snehanixon" target="_blank" rel="noopener noreferrer" className="btn-social" title="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                </a>
              </div>

              {/* Stats row */}
              <div className="stats-row">
                {stats.map((s, i) => (
                  <div className="stat-item" key={i}>
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Casual Yellow Splash Photo */}
            <div className="hero-visual">
              {/* Yellow paint blobs */}
              <div className="yellow-blob blob-1" />
              <div className="yellow-blob blob-2" />
              <div className="yellow-blob blob-3" />
              <div className="yellow-blob blob-4" />

              {/* Floating dots */}
              <div className="floating-dot dot-1" />
              <div className="floating-dot dot-2" />

              {/* Center Photo — casual, no name card */}
              <div className="photo-frame">
                <img src={snehaPhoto} alt="Sneha Nixon" className="hero-photo" />
              </div>

              {/* Circular text badge */}
              <div className="explore-badge" style={{ bottom: '30px', right: '20px' }}>
                <span className="explore-text">PORTFOLIO · SNEHA ·</span>
                <div className="explore-play">▶</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SKILLS ROW ===== */}
      <section className="skills-strip-section">
        <div className="container">
          <div className="skills-strip">
            {skills.map((s, i) => (
              <div className="skill-strip-item" key={i}>
                <div className="skill-icon-wrap">{s.icon}</div>
                <div>
                  <div className="skill-strip-label">{s.label}</div>
                  <div className="skill-strip-detail">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section id="projects" className="projects-section section">
        <div className="container">
          <span className="chip" style={{ display: 'block', textAlign: 'center', marginBottom: '12px' }}>Portfolio</span>
          <h2 className="section-title">Featured <span>Projects</span></h2>
          <p className="section-subtitle">
            A showcase of real-world applications built across IoT, AI/ML, mobile, and web domains.
          </p>

          <div className="projects-grid">
            {projects.map((proj, idx) => (
              <div className="project-card" key={idx}>
                <div className="project-card-top" style={{ background: proj.color }}>
                  <span className="proj-type">{proj.type}</span>
                </div>
                <div className="project-card-body">
                  <h3 className="project-title">{proj.title}</h3>
                  <p className="project-desc">{proj.description}</p>
                  <div className="project-tech-row">
                    {proj.tech.map((t, ti) => (
                      <span className="tech-chip" key={ti}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACTIVITIES SLIDING ANIMATION ===== */}
      <section id="activities" className="activities-ticker-section section">
        <div className="container">
          <span className="chip" style={{ display: 'block', textAlign: 'center', marginBottom: '12px' }}>Event Participation</span>
          <h2 className="section-title">Activities & <span>Highlights</span></h2>
          <p className="section-subtitle">
            Snapshots of collaborative hackathons, project expositions, and tech bootcamps.
          </p>
        </div>

        {/* Endless running ticker row */}
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {/* Slide group 1 */}
            {activities.map((act, i) => (
              <div className="ticker-item" key={`slide1-${i}`}>
                <div className="ticker-img-frame">
                  <img src={act.img} alt={act.label} />
                  <div className="ticker-overlay">
                    <span>{act.label}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Slide group 2 (duplicate for seamless loop) */}
            {activities.map((act, i) => (
              <div className="ticker-item" key={`slide2-${i}`}>
                <div className="ticker-img-frame">
                  <img src={act.img} alt={act.label} />
                  <div className="ticker-overlay">
                    <span>{act.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <style>{`
        .home-page { width: 100%; }

        /* ===== HERO ===== */
        .hero-section {
          padding: 80px 0 60px;
          overflow: hidden;
        }

        .hero-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 560px;
        }

        @media (max-width: 900px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-visual { min-height: 380px; }
        }

        .hero-badge-row { margin-bottom: 20px; }

        .hero-heading {
          font-family: 'Playfair Display', serif;
          font-size: 3.2rem;
          font-weight: 900;
          line-height: 1.1;
          color: var(--text);
          margin-bottom: 16px;
        }

        .hero-name-highlight {
          color: var(--primary);
          display: block;
        }

        .hero-tagline {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .tagline-divider { color: var(--card-border); font-weight: 300; }

        .tagline-role { color: var(--text); }

        .hero-bio {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.75;
          max-width: 520px;
          margin-bottom: 28px;
        }

        .hero-contacts {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }

        .contact-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1.5px solid var(--card-border);
          color: var(--text-muted);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          transition: var(--transition);
          text-decoration: none;
        }

        .contact-pill:hover {
          border-color: var(--primary);
          color: var(--primary-dark);
        }

        .contact-pill.loc { cursor: default; }
        .contact-pill.loc:hover { border-color: var(--card-border); color: var(--text-muted); }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
        }

        .btn-social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid var(--card-border);
          color: var(--text-muted);
          background: #fff;
          transition: var(--transition);
        }

        .btn-social:hover {
          border-color: var(--primary);
          color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(245,166,35,0.2);
        }

        /* Stats */
        .stats-row {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
          padding-top: 20px;
          border-top: 1.5px solid var(--card-border);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ===== HERO VISUAL (YELLOW SPLASH) ===== */
        .hero-visual {
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Yellow paint blobs */
        .yellow-blob {
          position: absolute;
          border-radius: 50%;
          background: #F5C518;
          opacity: 0.85;
          z-index: 1;
          filter: blur(0px);
        }
        .blob-1 { width: 160px; height: 160px; top: -10px; left: -10px; border-radius: 60% 40% 55% 45%; background: #F5C518; }
        .blob-2 { width: 110px; height: 110px; top: 10px; right: 10px; border-radius: 45% 55% 40% 60%; background: #F5A623; }
        .blob-3 { width: 130px; height: 130px; bottom: 10px; left: 10px; border-radius: 55% 45% 60% 40%; background: #F5A623; opacity:0.7; }
        .blob-4 { width: 90px; height: 90px; bottom: 0px; right: 20px; border-radius: 40% 60% 45% 55%; background: #F5C518; opacity:0.8; }

        /* Center Photo */
        .photo-frame {
          position: relative;
          width: 280px;
          height: 360px;
          border-radius: 28px;
          overflow: hidden;
          z-index: 10;
          box-shadow: 0 20px 60px rgba(245,166,35,0.35), 0 6px 24px rgba(0,0,0,0.12);
          border: 5px solid #fff;
          transform: rotate(-2deg);
        }

        .hero-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        /* Floating dots */
        .floating-dot {
          position: absolute;
          border-radius: 50%;
          z-index: 2;
          animation: float 4s ease-in-out infinite;
        }

        .dot-1 {
          width: 18px;
          height: 18px;
          background: var(--primary);
          top: 100px;
          right: 0;
          animation-delay: 0s;
        }

        .dot-2 {
          width: 12px;
          height: 12px;
          background: var(--dark);
          bottom: 80px;
          left: 30px;
          animation-delay: 1s;
        }

        /* Circular badge */
        .explore-badge {
          position: absolute;
          width: 78px;
          height: 78px;
          background: var(--dark);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          animation: float 5s ease-in-out infinite;
        }

        .explore-text {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.42rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.2em;
          animation: spin 12s linear infinite;
          top: 0;
          left: 0;
          text-align: center;
          padding-top: 10px;
        }

        .explore-play {
          color: var(--primary);
          font-size: 1rem;
          z-index: 2;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ===== SKILLS STRIP ===== */
        .skills-strip-section {
          padding: 20px 0;
        }

        .skills-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          background: #fff;
          border: 1.5px solid var(--card-border);
          border-radius: 20px;
          padding: 24px 32px;
        }

        @media (max-width: 700px) {
          .skills-strip { grid-template-columns: repeat(2, 1fr); }
        }

        .skill-strip-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 0;
        }

        .skill-icon-wrap {
          width: 44px;
          height: 44px;
          background: var(--primary-light);
          color: var(--primary-dark);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .skill-strip-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text);
        }

        .skill-strip-detail {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 1px;
        }

        /* ===== PROJECTS ===== */
        .projects-section { background: var(--bg-card-alt); }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 900px) {
          .projects-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 580px) {
          .projects-grid { grid-template-columns: 1fr; }
        }

        .project-card {
          background: #fff;
          border: 1.5px solid var(--card-border);
          border-radius: 20px;
          overflow: hidden;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
        }

        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .project-card-top {
          height: 60px;
          display: flex;
          align-items: flex-end;
          padding: 14px 20px;
        }

        .proj-type {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
          color: #fff;
          padding: 3px 10px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .project-card-body { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }

        .project-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .project-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 16px;
          flex-grow: 1;
        }

        .project-tech-row { display: flex; flex-wrap: wrap; gap: 6px; }

        .tech-chip {
          background: var(--bg-card-alt);
          border: 1px solid var(--card-border);
          color: var(--text-muted);
          padding: 3px 10px;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        /* ===== ACTIVITIES TICKER ===== */
        .activities-ticker-section {
          background: #fff;
          padding-bottom: 100px;
          overflow: hidden;
        }

        .ticker-wrapper {
          width: 100%;
          overflow: hidden;
          padding: 20px 0;
          position: relative;
        }

        .ticker-wrapper::before, .ticker-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100px;
          z-index: 2;
          pointer-events: none;
        }

        .ticker-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #fff, transparent);
        }

        .ticker-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #fff, transparent);
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        .ticker-item {
          padding: 0 15px;
          width: 380px;
          flex-shrink: 0;
        }

        .ticker-img-frame {
          position: relative;
          width: 100%;
          height: 250px;
          border-radius: 20px;
          overflow: hidden;
          border: 1.5px solid var(--card-border);
          box-shadow: var(--shadow-sm);
        }

        .ticker-img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .ticker-img-frame:hover img {
          transform: scale(1.05);
        }

        .ticker-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(26,26,26,0.9), transparent);
          padding: 20px;
          display: flex;
          align-items: flex-end;
        }

        .ticker-overlay span {
          color: #fff;
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.4;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
