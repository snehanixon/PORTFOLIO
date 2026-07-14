import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Cpu, Settings, Cloud, Plus, Trash2, Edit, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react';

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
    // 1. First, load from localStorage if available (fast initial render)
    const localData = localStorage.getItem('pm_vikas_events');
    if (localData) {
      try {
        setEvents(JSON.parse(localData));
      } catch (e) {
        console.error('Error parsing localStorage events:', e);
      }
    }

    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        localStorage.setItem('pm_vikas_events', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error fetching events:', err);
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

    // 2. Save locally immediately
    setEvents(updatedEvents);
    localStorage.setItem('pm_vikas_events', JSON.stringify(updatedEvents));
    closeTrackerModal();

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvents)
      });
      if (res.ok) {
        setSyncStatus('success-confirm');
        setTimeout(() => setSyncStatus('synced'), 3000);
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    }
  };

  const handleDeleteEvent = async (dateStr) => {
    if (!window.confirm('Delete this activity log?')) return;
    setSyncStatus('saving');
    const updatedEvents = events.filter(ev => ev.date !== dateStr);

    // 3. Delete locally immediately
    setEvents(updatedEvents);
    localStorage.setItem('pm_vikas_events', JSON.stringify(updatedEvents));

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvents)
      });
      if (res.ok) {
        setSyncStatus('success-confirm');
        setTimeout(() => setSyncStatus('synced'), 3000);
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
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

      {/* ── PAGE HERO ── */}
      <div className="pv-hero">
        <div className="container">
          <span className="chip pv-chip">Internship</span>
          <h1 className="section-title" style={{ textAlign:'left', marginTop:'12px', color:'#fff', fontFamily:"'Playfair Display', serif" }}>
            PM-VIKAS<br /><span style={{ color:'var(--primary)' }}>Program &amp; Activity Tracker</span>
          </h1>
          <p className="section-subtitle" style={{ textAlign:'left', margin:'12px 0 0', color:'rgba(255,255,255,0.55)' }}>
            Daily activity log for my offline IoT internship at IIIT Kottayam under the PM-VIKAS scheme.
          </p>
          {isAdmin && (
            <div style={{ marginTop: '16px' }}>
              <span className="admin-active-badge">🔓 Admin Mode Active — You can add &amp; edit activities</span>
            </div>
          )}
        </div>
      </div>

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

          {/* ── TRACKER SECTION HEADER ── */}
          <div className="tracker-section-header">
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
              <div className="v-timeline">
                <div className="v-line" />
                {sortedEvents.map((ev, idx) => {
                  const evDate = new Date(ev.date + 'T00:00:00');
                  const dayLabel = evDate.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' }).toUpperCase();
                  return (
                    <div key={ev.id || idx} className="v-node">
                      <div className="v-dot"><div className="v-dot-inner" /></div>
                      <div className="v-content">
                        <span className="v-date">{dayLabel}</span>
                        <div className="glass-card v-card">
                          <div className="v-card-top">
                            <h3>Day {String(idx + 1).padStart(2,'0')}: {ev.title}</h3>
                            <span className={`ev-badge ${ev.category || 'internship'}`}>{(ev.category||'internship').toUpperCase()}</span>
                          </div>
                          <p className="v-card-desc">{ev.description}</p>
                          {isAdmin && (
                            <div className="v-card-actions">
                              <button className="btn-sm btn-outline" onClick={() => openAddModal(ev.date)}>Edit</button>
                              <button className="btn-sm btn-danger-outline" onClick={() => handleDeleteEvent(ev.date)}>Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
        .pv-hero { background: var(--dark); padding: 56px 0 44px; }
        .pv-chip { background: var(--primary); color: #fff; }

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

        .cal-legend { display: flex; justify-content: center; gap: 12px; margin-top: 12px; font-size: 0.75rem; color: var(--text-muted); }
        .cal-legend span { display: flex; align-items: center; gap: 5px; }
        .leg-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
        .leg-dot.internship { background: var(--primary); }
        .leg-dot.project { background: #8b5cf6; }
        .leg-dot.personal { background: #22c55e; }

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

        /* Tracker section header inline btn */
        .fab-inline { margin-left: auto; }

        /* ── VERTICAL TIMELINE ── */
        .v-timeline { position: relative; padding-left: 30px; margin-top: 20px; }
        .v-line { position: absolute; left: 9px; top: 8px; bottom: 24px; width: 3px; background: linear-gradient(180deg, var(--primary), #8b5cf6); border-radius: 2px; }

        .v-node { position: relative; margin-bottom: 36px; }
        .v-node:last-child { margin-bottom: 0; }

        .v-dot { position: absolute; left: -30px; top: 4px; width: 22px; height: 22px; background: var(--bg); border: 3px solid var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1; }
        .v-dot-inner { width: 6px; height: 6px; background: #8b5cf6; border-radius: 50%; }

        .v-content { display: flex; flex-direction: column; gap: 6px; }
        .v-date { font-size: 0.78rem; font-weight: 700; color: #8b5cf6; letter-spacing: 0.04em; }

        .v-card {
          background: #fff !important;
          border: 1.5px solid var(--card-border) !important;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .v-card:hover {
          border-color: #8b5cf6 !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.15);
        }
        .v-card-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
        .v-card-top h3 { font-size: 1rem; font-weight: 800; color: var(--text); line-height: 1.3; }
        .v-card-desc { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; }
        .v-card-actions { display: flex; gap: 8px; margin-top: 10px; }

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

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
