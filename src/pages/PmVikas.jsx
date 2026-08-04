import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Cpu, Settings, Cloud, Plus, Trash2, Edit, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, X, BookOpen, ImageIcon, Camera, MapPin, Users } from 'lucide-react';
import { loadActivities, saveActivities } from '../firebase';
import img1 from '../assets/activity4.jpg';
import img2 from '../assets/activity5.jpg';
import img3 from '../assets/activity6.jpg';







// Sub-component so each card can have its own expand state (hooks can't be called inside .map)
function DayCard({ ev, idx, isAdmin, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const evDate = new Date(ev.date + 'T00:00:00');
  const dayShort = evDate.toLocaleDateString('en-US', { weekday:'short' });
  const monthDay = evDate.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const cat = ev.category || 'internship';
  return (
    <div className={`day-card glass-card day-cat-${cat}`}>
      <div className="day-card-num-strip">
        <span className="day-card-num">Day {String(idx + 1).padStart(2,'0')}</span>
        <span className={`ev-badge ${cat}`}>{cat.toUpperCase()}</span>
      </div>
      <div className="day-card-date">
        <span className="day-card-weekday">{dayShort}</span>
        <span className="day-card-monthday">{monthDay}</span>
      </div>
      <h4 className="day-card-title">{ev.title}</h4>
      <p className={`day-card-desc ${expanded ? 'expanded' : ''}`}>{ev.description}</p>
      {ev.description && ev.description.length > 100 && (
        <button className="day-card-expand-btn" onClick={() => setExpanded(e => !e)}>
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </button>
      )}
      {isAdmin && (
        <div className="day-card-actions">
          <button className="btn-sm btn-outline" onClick={() => onEdit(ev.date)}>Edit</button>
          <button className="btn-sm btn-danger-outline" onClick={() => onDelete(ev.date)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default function PmVikas({ isAdmin }) {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 19));
  const [selectedDateStr, setSelectedDateStr] = useState('2026-06-19');

  // Tracker modal state
  const [showTrackerModal, setShowTrackerModal] = useState(false);

  // Form State (used inside tracker modal)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('internship');
  const [description, setDescription] = useState('');
  const [editingEventDate, setEditingEventDate] = useState(null); // null = adding new

  // Sync Status
  const [syncStatus, setSyncStatus] = useState('synced');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch events
  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    // 1. Load from localStorage instantly (fast initial render)
    const localData = localStorage.getItem('pm_vikas_events');
    if (localData) {
      try { setEvents(JSON.parse(localData)); } catch (e) { /* ignore */ }
    }

    // 2. Fetch from Firestore (source of truth)
    const data = await loadActivities();
    if (data !== null) {
      setEvents(data);
      localStorage.setItem('pm_vikas_events', JSON.stringify(data));
    }
  };

  // Calendar helpers
  const formatDateStr = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const getEventForDate = (dateStr) => events.find(ev => ev.date === dateStr);
  const selectedEvent = getEventForDate(selectedDateStr);


  // Open tracker modal for adding/editing
  const openAddModal = (dateStr = selectedDateStr) => {
    const ev = getEventForDate(dateStr);
    setEditingEventDate(dateStr);
    setTitle(ev ? ev.title : '');
    setCategory(ev ? (ev.category || 'internship') : 'internship');
    setDescription(ev ? ev.description : '');
    setShowTrackerModal(true);
  };

  const closeTrackerModal = () => {
    setShowTrackerModal(false);
    setEditingEventDate(null);
    setTitle(''); setCategory('internship'); setDescription('');
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSyncStatus('saving');

    const newEvent = {
      id: selectedEvent?.date === editingEventDate ? selectedEvent.id : Date.now().toString(),
      date: editingEventDate,
      title, category, description
    };

    const existsAlready = events.find(ev => ev.date === editingEventDate);
    const updatedEvents = existsAlready
      ? events.map(ev => ev.date === editingEventDate ? newEvent : ev)
      : [...events, newEvent];

    // Save locally immediately so UI updates instantly
    setEvents(updatedEvents);
    localStorage.setItem('pm_vikas_events', JSON.stringify(updatedEvents));
    closeTrackerModal();

    // Sync to Firestore
    const ok = await saveActivities(updatedEvents);
    if (ok) {
      setSyncStatus('success-confirm');
      setTimeout(() => setSyncStatus('synced'), 3000);
    } else {
      setSyncStatus('error');
    }
  };

  const handleDeleteEvent = async (dateStr) => {
    if (!window.confirm('Delete this activity log?')) return;
    setSyncStatus('saving');
    const updatedEvents = events.filter(ev => ev.date !== dateStr);

    // Delete locally immediately
    setEvents(updatedEvents);
    localStorage.setItem('pm_vikas_events', JSON.stringify(updatedEvents));

    // Sync to Firestore
    const ok = await saveActivities(updatedEvents);
    if (ok) {
      setSyncStatus('success-confirm');
      setTimeout(() => setSyncStatus('synced'), 3000);
    } else {
      setSyncStatus('error');
    }
  };


  // Render calendar cells
  const renderCells = () => {
    const cells = [];
    const query = searchQuery.toLowerCase();

    const eventMatchesQuery = (ev) => {
      if (!ev) return false;
      if (!searchQuery) return true;
      return (
        (ev.title && ev.title.toLowerCase().includes(query)) ||
        (ev.description && ev.description.toLowerCase().includes(query)) ||
        (ev.category && ev.category.toLowerCase().includes(query)) ||
        (ev.date && ev.date.toLowerCase().includes(query))
      );
    };

    // Prev month fillers
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = formatDateStr(prevY, prevM, d);
      const hasEv = getEventForDate(dateStr);
      const isMatch = !searchQuery || eventMatchesQuery(hasEv);
      cells.push(
        <div key={`prev-${d}`} className={`cal-cell faded ${selectedDateStr === dateStr ? 'sel' : ''} ${hasEv && !isMatch ? 'search-no-match' : ''}`} onClick={() => setSelectedDateStr(dateStr)}>
          <span className="cal-num">{d}</span>
          {hasEv && <span className={`cal-dot ${hasEv.category || 'internship'} ${!isMatch ? 'faded-dot' : ''}`} />}
        </div>
      );
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateStr(year, month, d);
      const hasEv = getEventForDate(dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
      const isMatch = !searchQuery || eventMatchesQuery(hasEv);
      cells.push(
        <div key={`curr-${d}`} className={`cal-cell ${selectedDateStr === dateStr ? 'sel' : ''} ${isToday ? 'today' : ''} ${hasEv ? 'has-ev' : ''} ${hasEv && !isMatch ? 'search-no-match' : ''}`} onClick={() => setSelectedDateStr(dateStr)}>
          <span className="cal-num">{d}</span>
          {hasEv && <span className={`cal-dot ${hasEv.category || 'internship'} ${!isMatch ? 'faded-dot' : ''}`} />}
        </div>
      );
    }
    // Next month fillers
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = formatDateStr(nextY, nextM, d);
      const hasEv = getEventForDate(dateStr);
      const isMatch = !searchQuery || eventMatchesQuery(hasEv);
      cells.push(
        <div key={`next-${d}`} className={`cal-cell faded ${selectedDateStr === dateStr ? 'sel' : ''} ${hasEv && !isMatch ? 'search-no-match' : ''}`} onClick={() => setSelectedDateStr(dateStr)}>
          <span className="cal-num">{d}</span>
          {hasEv && <span className={`cal-dot ${hasEv.category || 'internship'} ${!isMatch ? 'faded-dot' : ''}`} />}
        </div>
      );
    }
    return cells;
  };

  const filteredEvents = events.filter(ev => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (ev.title && ev.title.toLowerCase().includes(query)) ||
      (ev.description && ev.description.toLowerCase().includes(query)) ||
      (ev.category && ev.category.toLowerCase().includes(query)) ||
      (ev.date && ev.date.toLowerCase().includes(query))
    );
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="pm-vikas-page">

      {/* ── PAGE HERO (background = intern1.jpg) ── */}
      <div className="pv-hero" style={{ backgroundImage: `url(${intern1})` }}>
        <div className="pv-hero-overlay" />
        <div className="container pv-hero-content">
          <span className="chip pv-chip">Internship · IIIT Kottayam</span>
          <h1 className="section-title" style={{ textAlign:'left', marginTop:'12px', color:'#fff', fontFamily:"'Playfair Display', serif", textShadow:'0 2px 16px rgba(0,0,0,0.4)' }}>
            PM-VIKAS<br /><span style={{ color:'var(--primary)' }}>Program &amp; Activity Tracker</span>
          </h1>
          <p className="section-subtitle" style={{ textAlign:'left', margin:'12px 0 0', color:'rgba(255,255,255,0.75)', textShadow:'0 1px 8px rgba(0,0,0,0.3)' }}>
            Daily activity log for my offline IoT internship at IIIT Kottayam under the PM-VIKAS scheme.
          </p>
          <div className="pv-hero-badges">
            <span className="pv-hero-badge"><MapPin size={13} /> IIIT Kottayam, Kerala</span>
            <span className="pv-hero-badge"><Users size={13} /> PM-VIKAS Scheme</span>
            <span className="pv-hero-badge"><Cpu size={13} /> IoT Internship</span>
          </div>
          {isAdmin && (
            <div style={{ marginTop: '16px' }}>
              <span className="admin-active-badge">🔓 Admin Mode Active — You can add &amp; edit activities</span>
            </div>
          )}
        </div>
      </div>


        {/* ── TOP NAVIGATION ── */}
        <nav className="pmv-top-nav">

          <a href="#projects">Projects</a>
          <a href="#tracker">Activity Tracker</a>
        </nav>
        {/* ── BODY ── */}
      <section className="pv-body-section">
        <div className="pv-container">

          {/* Sync banner */}
          <div className={`sync-banner ${syncStatus}`}>
            {syncStatus === 'synced' && (<><CheckCircle2 size={15} /><span>All logs synchronized</span></>)}
            {syncStatus === 'saving' && (<><div className="spinner" /><span>Saving to database…</span></>)}
            {syncStatus === 'success-confirm' && (<><CheckCircle2 size={15} style={{color:'#15803d'}} /><span style={{color:'#15803d'}}>Saved successfully!</span></>)}
            {syncStatus === 'error' && (<><AlertCircle size={15} /><span>Connection error — saved locally.</span></>)}
          </div>

          {/* ── OVERVIEW CARD ── */}
          <div className="overview-card glass-card">
            <div className="overview-grid">
              <div>
                <div className="info-header"><Cpu className="info-icon" size={22} /><h2>IoT Intern | PM-VIKAS Program</h2></div>
                <div className="info-meta">
                  <span><strong>Location:</strong> IIIT Kottayam (Offline)</span>
                  <span><strong>Duration:</strong> 1.5 Months (Jun 2026 – Present)</span>
                </div>
                <p className="info-desc">
                  The <strong>PM-VIKAS</strong> (Pradhan Mantri Virasat Ka Samvardhan) project is a capability-building initiative by the Ministry of Minority Affairs. IIIT Kottayam serves as a skill-training center covering hardware, software, and real-world system designs.
                </p>
              </div>
              <div>
                <div className="info-sub-header"><Settings className="info-icon-small" size={18} /><h3>IoT-Assistant Skill Course</h3></div>
                <ul className="skills-list">
                  <li><strong>Embedded Hardware:</strong> Arduino Uno, ESP32 microcontrollers, prototyping circuits.</li>
                  <li><strong>Sensor Integration:</strong> Ultrasonic, DHT11, Soil Moisture sensors.</li>
                  <li><strong>IoT Protocols:</strong> Serial, HTTP REST APIs, and MQTT brokers.</li>
                  <li><strong>Real-world Prototypes:</strong> Automated waste segregation and smart parking.</li>
                </ul>
              </div>
            </div>
          </div>



          {/* ── PROJECTS CARD ── */}
          <div id="projects" className="projects-card glass-card" style={{ marginBottom: '40px', padding: '24px 32px' }}>
            <div className="info-header"><Cpu className="info-icon" size={22} /><h2>PM-VIKAS Projects</h2></div>
            <p className="info-desc" style={{ marginBottom: '24px' }}>Projects I built and contributed to during the PM-VIKAS internship at IIIT Kottayam — click to view on GitHub.</p>

            {/* ⭐ Mini Project Highlight */}
            <a
              href="https://github.com/snehanixon/TINKERCARD/tree/main/Mini-Project"
              target="_blank"
              rel="noreferrer"
              className="pv-mini-project-card"
            >
              <div className="pv-mini-badge">⭐ Mini Project</div>
              <div className="pv-mini-content">
                <div className="pv-mini-icon-wrap">
                  <Cpu size={30} style={{ color: '#F5A623' }} />
                </div>
                <div>
                  <h3 className="pv-mini-title">Smart Home Automation System</h3>
                  <p className="pv-mini-desc">
                    An Arduino-based mini project developed in Tinkercad that automates basic home functions using <strong>5 sensors</strong> (LDR, LM35, PIR sensor, ultrasonic sensor, push button) and <strong>5 actuators</strong> (LED, RGB LED, buzzer, servo motor, LCD). Monitors ambient light, temperature, motion, and distance to automatically control room lighting, door operation, alerts, and display messages.
                  </p>
                  <div className="pv-mini-tags">
                    <span className="pv-mini-tag">TinkerCAD</span>
                    <span className="pv-mini-tag">Arduino</span>
                    <span className="pv-mini-tag">LDR · LM35 · PIR</span>
                    <span className="pv-mini-tag">Ultrasonic · Push Button</span>
                    <span className="pv-mini-tag">Servo · LCD · Buzzer</span>
                  </div>
                </div>
              </div>
            </a>

            <div className="pv-rich-projects-grid" style={{ marginTop: '16px' }}>
              <a href="https://github.com/snehanixon/TINKERCARD" target="_blank" rel="noreferrer" className="pv-rich-card">
                <Cpu size={24} className="pv-rich-icon" style={{ color: '#F5A623', marginBottom: '12px' }} />
                <h4 style={{ color: 'var(--text)', marginBottom: '6px' }}>TINKERCAD</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Designed and simulated IoT circuits using TinkerCAD for embedded hardware prototyping.</p>
              </a>
              <a href="https://github.com/snehanixon/GoLang-Service" target="_blank" rel="noreferrer" className="pv-rich-card">
                <Settings size={24} className="pv-rich-icon" style={{ color: '#8b5cf6', marginBottom: '12px' }} />
                <h4 style={{ color: 'var(--text)', marginBottom: '6px' }}>GoLang-Service</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Built lightweight backend REST API microservices using the Go programming language.</p>
              </a>
              <a href="https://github.com/snehanixon/Docker-Services" target="_blank" rel="noreferrer" className="pv-rich-card">
                <Cloud size={24} className="pv-rich-icon" style={{ color: '#22c55e', marginBottom: '12px' }} />
                <h4 style={{ color: 'var(--text)', marginBottom: '6px' }}>Docker-Services</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Containerized services and set up deployment pipelines using Docker.</p>
              </a>
              <a href="https://github.com/snehanixon/wokwi" target="_blank" rel="noreferrer" className="pv-rich-card">
                <Cpu size={24} className="pv-rich-icon" style={{ color: '#ef4444', marginBottom: '12px' }} />
                <h4 style={{ color: 'var(--text)', marginBottom: '6px' }}>wokwi</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Simulated and tested embedded systems and IoT projects using the Wokwi platform.</p>
              </a>
            </div>
          </div>

          {/* ── PROGRESS GAUGE ── */}
          {(() => {
            const TOTAL_DAYS = 38; // 300 hours / 8 hours per day
            
            const leaveDays = events.filter(e => e.category === 'leave').length;
            const workedDays = events.length - leaveDays;
            
            const remainingDays = Math.max(0, TOTAL_DAYS - workedDays - leaveDays);
            
            const pctLogged = Math.min(100, (workedDays / TOTAL_DAYS) * 100);
            const pctLeave = Math.min(100 - pctLogged, (leaveDays / TOTAL_DAYS) * 100);
            
            const R = 54;
            const CIRC = 2 * Math.PI * R;
            
            const dashLogged = (pctLogged / 100) * CIRC;
            const dashLeave = (pctLeave / 100) * CIRC;
            
            return (
              <div className="gauge-wrapper">
                <div className="gauge-card glass-card">
                  {/* Left: SVG Ring */}
                  <div className="gauge-ring-wrap">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      {/* Background (Remaining) */}
                      <circle cx="70" cy="70" r={R} fill="none" stroke="#f0ece4" strokeWidth="10" />
                      
                      <defs>
                        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f5a623" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                      
                      {/* Logged segment */}
                      <circle
                        cx="70" cy="70" r={R}
                        fill="none"
                        stroke="url(#gaugeGrad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${dashLogged} ${CIRC}`}
                        strokeDashoffset={CIRC * 0.25}
                        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                      />
                      
                      {/* Leave segment */}
                      <circle
                        cx="70" cy="70" r={R}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${dashLeave} ${CIRC}`}
                        strokeDashoffset={CIRC * 0.25 - dashLogged}
                        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                      />
                      
                      <text x="70" y="63" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1a1a1a" fontFamily="'Inter', sans-serif">{Math.round(pctLogged)}%</text>
                      <text x="70" y="82" textAnchor="middle" fontSize="10" fill="#888" fontFamily="'Inter', sans-serif">WORKED</text>
                    </svg>
                  </div>
                  {/* Right: Stats */}
                  <div className="gauge-stats">
                    <div className="gauge-title">Program Progress</div>
                    <div className="gauge-numbers">
                      <div className="gauge-num-block">
                        <span className="gauge-big">{workedDays}</span>
                        <span className="gauge-label">Worked</span>
                      </div>
                      <div className="gauge-divider" />
                      <div className="gauge-num-block">
                        <span className="gauge-big" style={{color:'#ef4444'}}>{leaveDays}</span>
                        <span className="gauge-label">Leave</span>
                      </div>
                      <div className="gauge-divider" />
                      <div className="gauge-num-block">
                        <span className="gauge-big" style={{color:'#8b5cf6'}}>{remainingDays}</span>
                        <span className="gauge-label">Remaining</span>
                      </div>
                    </div>
                    <div className="gauge-bar-wrap">
                      <div className="gauge-bar-track">
                        <div className="gauge-bar-fill" style={{width: `${pctLogged}%`}} />
                        <div className="gauge-bar-fill-leave" style={{width: `${pctLeave}%`, background: '#ef4444'}} />
                      </div>
                      <span className="gauge-bar-label">{workedDays} days worked, {leaveDays} days leave (Total req: {TOTAL_DAYS} days)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── TRACKER SECTION HEADER ── */}
          <div id="tracker" className="tracker-section-header">
            <CalendarIcon size={20} className="tracker-header-icon" />
            <h2>Daily Activity Tracker</h2>
            {isAdmin && (
              <button className="btn btn-sm fab-inline" onClick={() => openAddModal()}>
                <Plus size={15} /> Add Activity
              </button>
            )}
          </div>

          {/* ── CALENDAR + DETAIL GRID (side-by-side, compact) ── */}
          <div className="tracker-grid">

            {/* LEFT: Compact Calendar */}
            <div className="calendar-card glass-card">
              <div className="cal-header">
                <button className="nav-btn" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><ChevronLeft size={15} /></button>
                <span className="cal-month-label"><CalendarIcon size={14} style={{color:'var(--primary)'}} /> {MONTHS[month]} {year}</span>
                <button className="nav-btn" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><ChevronRight size={15} /></button>
              </div>
              <div className="cal-weekdays">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="cal-grid">{renderCells()}</div>
              <div className="cal-legend">
                <span><span className="leg-dot internship" />Internship</span>
                <span><span className="leg-dot project" />Project</span>
                <span><span className="leg-dot personal" />Study</span>
                <span><span className="leg-dot leave" />Leave</span>
              </div>
            </div>

            {/* RIGHT: Selected Date Detail */}
            <div className="detail-card glass-card">
              <div className="detail-header">
                <div>
                  <div className="detail-date-label">Selected Date</div>
                  <div className="detail-date-value">{selectedDateStr}</div>
                </div>
                {selectedEvent && isAdmin && (
                  <div className="detail-actions">
                    <button className="icon-btn" title="Edit" onClick={() => openAddModal(selectedDateStr)}><Edit size={15} /></button>
                    <button className="icon-btn del" title="Delete" onClick={() => handleDeleteEvent(selectedDateStr)}><Trash2 size={15} /></button>
                  </div>
                )}
              </div>

              {selectedEvent ? (
                <div className="detail-body">
                  <span className={`ev-badge ${selectedEvent.category || 'internship'}`}>
                    {(selectedEvent.category || 'internship').toUpperCase()}
                  </span>
                  <h4 className="detail-title">{selectedEvent.title}</h4>
                  <p className="detail-desc">{selectedEvent.description}</p>
                </div>
              ) : (
                <div className="detail-empty">
                  <BookOpen size={36} strokeWidth={1.2} style={{color:'var(--text-muted)', opacity:0.4}} />
                  <p>No activity logged for this date.</p>
                  {isAdmin ? (
                    <button className="btn btn-sm" onClick={() => openAddModal()}>
                      <Plus size={14} /> Log Activity
                    </button>
                  ) : (
                    <p style={{fontSize:'0.8rem', color:'var(--text-muted)', opacity:0.7}}>Login as admin from the navbar to add activities.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── ACTIVITY TIMELINE ── */}
          <div className="timeline-section">
            <div className="tracker-section-header" style={{marginTop:'50px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <Cpu size={20} className="tracker-header-icon" />
                <h2>Internship Activity Timeline</h2>
              </div>
              <div className="search-wrap">
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {sortedEvents.length === 0 ? (
              <div className="glass-card" style={{padding:'40px', textAlign:'center', color:'var(--text-muted)'}}>
                <p>{searchQuery ? 'No activities match your search query.' : 'No activity logs yet. Login as admin and use the + Add Activity button to start logging.'}</p>
              </div>
            ) : (
              <div className="day-grid">
                {sortedEvents.map((ev, idx) => (
                  <DayCard
                    key={ev.id || idx}
                    ev={ev}
                    idx={idx}
                    isAdmin={isAdmin}
                    onEdit={openAddModal}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>


      {/* ── TRACKER MODAL (Add / Edit Activity) ── */}
      {showTrackerModal && (
        <div className="modal-overlay" onClick={closeTrackerModal}>
          <div className="modal-box modal-lg" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeTrackerModal}><X size={18} /></button>
            <div className="modal-icon-wrap"><CalendarIcon size={26} /></div>
            <h3 className="modal-title">{getEventForDate(editingEventDate) ? 'Edit Activity Log' : 'Add Activity Log'}</h3>
            <p className="modal-sub" style={{marginBottom:'20px'}}>
              Logging for: <strong style={{color:'var(--primary)'}}>{editingEventDate}</strong>
            </p>
            <form onSubmit={handleSaveEvent} className="tracker-form">
              <div className="form-group">
                <label className="form-label">Activity Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Introduction to IoT Ecosystem"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="internship">Internship Training</option>
                  <option value="project">Project Work</option>
                  <option value="personal">Personal Studies</option>
                  <option value="leave">Leave / Absent</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Activity Details</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe tasks completed, topics covered, experiments conducted…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn">
                  <Cloud size={15} /> Save to Database
                </button>
                <button type="button" className="btn btn-outline" onClick={closeTrackerModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        /* ── Page base ── */
        .pm-vikas-page { width: 100%; position: relative; }

        /* Hero with background image */
        .pv-hero {
          position: relative;
          padding: 0;
          background-size: cover;
          background-position: center 40%;
          background-repeat: no-repeat;
          min-height: 420px;
          display: flex;
          align-items: flex-end;
        }
        .pv-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10,10,20,0.45) 0%,
            rgba(10,10,20,0.72) 60%,
            rgba(10,10,20,0.92) 100%
          );
          z-index: 1;
        }
        .pv-hero-content {
          position: relative;
          z-index: 2;
          padding-top: 40px;
          padding-bottom: 48px;
          width: 100%;
        }
        .pv-hero-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }
        .pv-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.22);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 50px;
          letter-spacing: 0.02em;
        }
        .pv-chip { background: var(--primary); color: #fff; }

        .pmv-top-nav {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin: 24px 0;
        }
        .pmv-top-nav a {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }
        .pmv-top-nav a:hover { text-decoration: underline; }
        html { scroll-behavior: smooth; }

        /* ── PHOTO GALLERY ── */
        .pv-gallery-section { background: #fff; border: 1.5px solid var(--card-border); max-width: 720px; margin: 0 auto; }
        .pv-gallery-section:hover { border-color: var(--primary); }
        .gallery-marquee {
          overflow: hidden;
        }

        .gallery-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }

        .gallery-item {
          flex: 0 0 auto;
          width: 200px;
          margin-right: 12px;
        }

        .gallery-item img {
          width: 100%;
          height: auto;
          object-fit: cover;
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 20px 12px 10px;
          line-height: 1.3;
        }
        .pv-gallery-featured .pv-gallery-caption { font-size: 0.88rem; padding: 28px 16px 14px; }

        .pv-body-section { padding: 40px 0 100px; }
        .pv-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        /* Admin active badge (shown in hero when logged in) */
        .admin-active-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 50px;
          background: rgba(245,166,35,0.15); border: 1.5px solid rgba(245,166,35,0.4);
          color: var(--primary); font-size: 0.8rem; font-weight: 600;
        }

        /* Sync banner */
        .sync-banner {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 8px; margin-bottom: 28px;
          font-size: 0.85rem; font-weight: 500;
        }
        .sync-banner.synced { background: rgba(0,0,0,0.03); border: 1px solid var(--card-border); color: var(--text-muted); }
        .sync-banner.saving { background: var(--primary-light); border: 1px solid var(--primary); color: var(--primary-dark); }
        .sync-banner.success-confirm { background: rgba(34,197,94,0.07); border: 1px solid #22c55e; }
        .sync-banner.error { background: rgba(239,68,68,0.07); border: 1px solid var(--danger); color: var(--danger); }
        .spinner { width: 14px; height: 14px; border: 2px solid transparent; border-top-color: currentColor; border-radius: 50%; animation: spin 1s linear infinite; }

        /* Overview */
        .overview-card { background: #fff; border: 1.5px solid var(--card-border); margin-bottom: 40px; }
        .overview-card:hover { border-color: var(--primary); }
        .overview-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
        @media(min-width:900px){ .overview-grid { grid-template-columns: 1fr 1fr; } }

        .info-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; color: var(--text); }
        .info-icon { color: var(--primary); }
        .info-icon-small { color: var(--secondary); }
        .info-meta { display: flex; gap: 16px; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px; flex-wrap: wrap; }
        .info-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; }
        .info-sub-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; color: var(--text); }
        .skills-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .skills-list li { position: relative; padding-left: 18px; color: var(--text-muted); font-size: 0.9rem; }
        .skills-list li::before { content:"•"; color: var(--primary); position: absolute; left: 4px; font-weight: bold; }

        /* Mini Project Highlight Card */
        .pv-mini-project-card {
          display: block; text-decoration: none; position: relative;
          border: 2px solid #F5A623;
          border-radius: 16px; padding: 20px 24px;
          margin-bottom: 4px;
          background: linear-gradient(135deg, rgba(245,166,35,0.08) 0%, rgba(139,92,246,0.05) 100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(245,166,35,0.12);
        }
        .pv-mini-project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(245,166,35,0.25);
          background: linear-gradient(135deg, rgba(245,166,35,0.14) 0%, rgba(139,92,246,0.08) 100%);
        }
        .pv-mini-badge {
          display: inline-block; background: linear-gradient(135deg, #F5A623, #f97316);
          color: #fff; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.06em;
          padding: 4px 12px; border-radius: 50px; margin-bottom: 14px;
          text-transform: uppercase;
        }
        .pv-mini-content {
          display: flex; align-items: flex-start; gap: 18px;
        }
        .pv-mini-icon-wrap {
          background: rgba(245,166,35,0.12); border-radius: 12px;
          padding: 12px; flex-shrink: 0;
        }
        .pv-mini-title {
          font-size: 1.05rem; font-weight: 800; color: var(--text);
          margin: 0 0 8px 0;
        }
        .pv-mini-desc {
          font-size: 0.87rem; color: var(--text-muted); margin: 0 0 12px 0; line-height: 1.6;
        }
        .pv-mini-desc strong { color: var(--text); }
        .pv-mini-tags {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .pv-mini-tag {
          background: rgba(245,166,35,0.12); border: 1px solid rgba(245,166,35,0.35);
          color: #b45309; font-size: 0.75rem; font-weight: 700;
          padding: 3px 10px; border-radius: 50px;
        }

        .pv-rich-projects-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;
        }
        .pv-rich-card {
          background: var(--bg-card-alt);
          border: 1.5px solid var(--card-border);
          border-radius: 12px; padding: 20px;
          display: flex; flex-direction: column;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pv-rich-card:hover {
          background: #fff; border-color: var(--primary);
          transform: translateY(-4px); box-shadow: 0 10px 25px rgba(245, 166, 35, 0.15);
        }

        /* Tracker section header */
        .tracker-section-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; border-bottom: 1.5px solid var(--card-border);
          padding-bottom: 10px; color: var(--text);
        }
        .tracker-header-icon { color: var(--primary); }

        /* ── TRACKER GRID: calendar left, detail right ── */
        .tracker-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        @media(min-width:768px){
          .tracker-grid { grid-template-columns: 300px 1fr; align-items: start; }
        }

        /* ── COMPACT CALENDAR ── */
        .calendar-card { background: #fff; border: 1.5px solid var(--card-border); padding: 16px !important; }
        .calendar-card:hover { border-color: var(--primary); }

        .cal-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .cal-month-label {
          display: flex; align-items: center; gap: 5px;
          font-weight: 700; font-size: 0.88rem; color: var(--text);
        }
        .nav-btn {
          background: var(--bg-card-alt); border: 1.5px solid var(--card-border);
          color: var(--text-muted); width: 28px; height: 28px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: var(--transition);
        }
        .nav-btn:hover { background: var(--primary-light); border-color: var(--primary); color: var(--primary-dark); }

        .cal-weekdays {
          display: grid; grid-template-columns: repeat(7, 1fr);
          text-align: center; font-size: 0.68rem; font-weight: 700;
          color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase;
        }

        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }

        .cal-cell {
          aspect-ratio: 1; background: var(--bg-card-alt);
          border: 1px solid var(--card-border); border-radius: 6px;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; cursor: pointer; position: relative;
          transition: var(--transition); gap: 2px;
        }
        .cal-cell:hover { background: var(--primary-light); border-color: var(--primary); }
        .cal-cell.sel { background: var(--primary-light); border-color: var(--primary); box-shadow: 0 0 0 2px rgba(245,166,35,0.2); }
        .cal-cell.sel .cal-num { color: var(--primary-dark); font-weight: 800; }
        .cal-cell.today { border-color: var(--dark); }
        .cal-cell.today .cal-num { color: var(--dark); font-weight: 800; }
        .cal-cell.faded { opacity: 0.35; }
        .cal-num { font-size: 0.75rem; font-weight: 500; line-height: 1; }

        .cal-dot { width: 5px; height: 5px; border-radius: 50%; display: block; }
        .cal-dot.internship { background: var(--primary); }
        .cal-dot.project { background: #8b5cf6; }
        .cal-dot.personal { background: #22c55e; }
        .cal-dot.leave, .cal-dot.Leave { background: #ef4444 !important; }

        .cal-legend { display: flex; justify-content: center; gap: 12px; margin-top: 12px; font-size: 0.75rem; color: var(--text-muted); }
        .cal-legend span { display: flex; align-items: center; gap: 5px; }
        .leg-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
        .leg-dot.internship { background: var(--primary); }
        .leg-dot.project { background: #8b5cf6; }
        .leg-dot.personal { background: #22c55e; }
        .leg-dot.leave { background: #ef4444; }

        /* ── DETAIL CARD ── */
        .detail-card { background: #fff; border: 1.5px solid var(--card-border); }
        .detail-card:hover { border-color: var(--primary); }

        .detail-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1.5px solid var(--card-border);
        }
        .detail-date-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 4px; }
        .detail-date-value { font-size: 1rem; font-weight: 800; color: var(--text); font-family: 'Playfair Display', serif; }

        .detail-actions { display: flex; gap: 6px; }
        .icon-btn { background: transparent; border: 1.5px solid var(--card-border); color: var(--text-muted); width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
        .icon-btn:hover { color: var(--primary-dark); border-color: var(--primary); background: var(--primary-light); }
        .icon-btn.del:hover { color: var(--danger); border-color: var(--danger); background: rgba(239,68,68,0.06); }

        .detail-body { display: flex; flex-direction: column; gap: 10px; }
        .detail-title { font-size: 1.1rem; font-weight: 800; color: var(--text); line-height: 1.3; }
        .detail-desc { font-size: 0.92rem; color: var(--text-muted); line-height: 1.65; white-space: pre-wrap; }

        .detail-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 30px 20px; color: var(--text-muted); text-align: center; font-size: 0.9rem; }

        /* Event badge */
        .ev-badge { align-self: flex-start; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.05em; padding: 3px 8px; border-radius: 4px; }
        .ev-badge.internship { background: var(--primary-light); color: var(--primary-dark); border: 1px solid rgba(245,166,35,0.3); }
        .ev-badge.project { background: rgba(139,92,246,0.08); color: #7c3aed; border: 1px solid rgba(139,92,246,0.2); }
        .ev-badge.personal { background: rgba(34,197,94,0.08); color: #15803d; border: 1px solid rgba(34,197,94,0.2); }
        .ev-badge.leave { background: rgba(239,68,68,0.1); color: #dc2626; border: 1px solid rgba(239,68,68,0.3); }

        /* Tracker section header inline btn */
        .fab-inline { margin-left: auto; }

        /* ── DAY CARD GRID (replaces old timeline) ── */
        .day-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }
        .day-card {
          background: #fff !important;
          border: 1.5px solid var(--card-border) !important;
          border-radius: 14px !important;
          padding: 18px 18px 14px !important;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, border-color 0.3s !important;
          position: relative;
          overflow: hidden;
        }
        .day-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 4px; height: 100%;
          border-radius: 14px 0 0 14px;
        }
        .day-cat-internship::before { background: var(--primary); }
        .day-cat-project::before { background: #8b5cf6; }
        .day-cat-personal::before { background: #22c55e; }
        .day-cat-leave::before { background: #ef4444; }
        .day-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 32px rgba(0,0,0,0.10) !important;
          border-color: var(--primary) !important;
        }
        .day-card-num-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .day-card-num {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .day-card-date {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 2px;
        }
        .day-card-weekday {
          font-size: 0.72rem;
          font-weight: 700;
          color: #8b5cf6;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .day-card-monthday {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text);
          font-family: 'Playfair Display', serif;
        }
        .day-card-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1.35;
          margin: 0;
        }
        .day-card-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .day-card-desc.expanded {
          display: block;
          -webkit-line-clamp: unset;
          overflow: visible;
        }
        .day-card-expand-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          margin-top: -4px;
          text-align: left;
          letter-spacing: 0.02em;
        }
        .day-card-expand-btn:hover { text-decoration: underline; }
        .day-card-actions {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          padding-top: 8px;
          border-top: 1px solid var(--card-border);
        }

        /* Search styling */
        .search-wrap {
          position: relative;
        }
        .search-input {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid var(--card-border);
          outline: none;
          background: #fff;
          color: var(--text);
          font-size: 0.88rem;
          min-width: 220px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(245,166,35,0.15);
        }

        /* Pulsing today or selected cell with glow and glassmorphism */
        .cal-cell.sel {
          background: rgba(245, 166, 35, 0.12) !important;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-color: var(--primary) !important;
          box-shadow: 0 0 12px 2px rgba(245, 166, 35, 0.35) !important;
          animation: pulseGlow 2.5s infinite ease-in-out;
        }
        .cal-cell.today {
          border-color: var(--dark) !important;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        }
        .cal-cell.search-no-match {
          opacity: 0.25;
          pointer-events: none;
        }
        .faded-dot {
          opacity: 0.15;
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 12px 2px rgba(245, 166, 35, 0.3); }
          50% { box-shadow: 0 0 18px 4px rgba(245, 166, 35, 0.5); }
        }

        /* Detail Card Transitions */
        .detail-body {
          display: flex; flex-direction: column; gap: 10px;
          animation: fadeSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .detail-empty {
          display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 30px 20px; color: var(--text-muted); text-align: center; font-size: 0.9rem;
          animation: fadeSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Small buttons */
        .btn-sm { padding: 6px 14px; font-size: 0.78rem; }
        .btn-danger-outline { background: transparent; border: 1.5px solid var(--danger); color: var(--danger); border-radius: 8px; padding: 6px 14px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: var(--transition); }
        .btn-danger-outline:hover { background: rgba(239,68,68,0.07); }

        /* ── FLOATING ACTION BUTTON ── */
        .fab-tracker {
          position: fixed; bottom: 32px; right: 32px;
          display: flex; align-items: center; gap: 8px;
          background: var(--primary); color: #fff;
          border: none; border-radius: 50px; padding: 14px 22px;
          font-size: 0.9rem; font-weight: 700; cursor: pointer;
          box-shadow: 0 8px 24px rgba(245,166,35,0.45);
          transition: all 0.25s ease; z-index: 100;
        }
        .fab-tracker:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(245,166,35,0.55); }
        .fab-tracker:active { transform: translateY(0); }

        /* ── MODALS ── */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); z-index: 500;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-box {
          background: #fff; border-radius: 20px; padding: 36px 32px;
          width: 100%; max-width: 420px; position: relative;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .modal-lg { max-width: 520px; }
        @keyframes modalIn { from { opacity:0; transform:translateY(30px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }

        .modal-close { position: absolute; top: 16px; right: 16px; background: transparent; border: 1.5px solid var(--card-border); color: var(--text-muted); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
        .modal-close:hover { background: rgba(0,0,0,0.06); color: var(--text); }

        .modal-icon-wrap { width: 52px; height: 52px; background: var(--primary-light); border: 2px solid rgba(245,166,35,0.3); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--primary-dark); margin-bottom: 16px; }

        .modal-title { font-size: 1.3rem; font-weight: 800; color: var(--text); font-family: 'Playfair Display', serif; margin-bottom: 4px; }
        .modal-sub { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 20px; }

        .pwd-input-wrap { position: relative; }
        .pwd-input-wrap .form-input { padding-right: 42px; }
        .pwd-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; cursor: pointer; color: var(--text-muted); display: flex; align-items: center; }
        .pwd-eye:hover { color: var(--text); }

        .login-error { color: var(--danger); font-size: 0.82rem; display: flex; align-items: center; gap: 5px; margin-top: 8px; }

        /* Tracker form */
        .tracker-form { display: flex; flex-direction: column; gap: 14px; }
        .form-buttons { display: flex; gap: 10px; margin-top: 4px; flex-wrap: wrap; }

        /* ── PROGRESS GAUGE ── */
        .gauge-wrapper { margin: 28px 0; }
        .gauge-card {
          display: flex;
          align-items: center;
          gap: 36px;
          padding: 28px 36px !important;
          background: linear-gradient(135deg, rgba(245,166,35,0.04) 0%, rgba(139,92,246,0.04) 100%) !important;
          border: 1.5px solid rgba(245,166,35,0.2) !important;
          border-radius: 20px;
        }
        .gauge-ring-wrap {
          flex-shrink: 0;
          filter: drop-shadow(0 4px 16px rgba(245,166,35,0.25));
        }
        .gauge-stats {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .gauge-title {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .gauge-numbers {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .gauge-num-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .gauge-big {
          font-size: 2rem;
          font-weight: 900;
          color: var(--primary-dark);
          font-family: 'Playfair Display', serif;
          line-height: 1;
        }
        .gauge-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .gauge-divider {
          width: 1px;
          height: 40px;
          background: var(--card-border);
          flex-shrink: 0;
        }
        .gauge-bar-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .gauge-bar-track {
          height: 8px;
          background: #f0ece4;
          border-radius: 99px;
          overflow: hidden;
          display: flex;
        }
        .gauge-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f5a623, #8b5cf6);
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gauge-bar-fill-leave {
          height: 100%;
          transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gauge-bar-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        @media (max-width: 540px) {
          .gauge-card { flex-direction: column; padding: 24px 20px !important; gap: 20px; }
          .gauge-ring-wrap svg { width: 120px; height: 120px; }
          .gauge-numbers { gap: 14px; }
          .gauge-big { font-size: 1.6rem; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
