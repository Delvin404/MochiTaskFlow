// Dashboard.jsx - Updated with black outline theme
import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
];

const PRIORITIES = [
  { label: 'All', value: '' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export default function Dashboard() {
  const [modal, setModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const filters = {};
  if (statusFilter) filters.status = statusFilter;
  if (priorityFilter) filters.priority = priorityFilter;

  const { data, isLoading, isError } = useTasks(filters);
  const tasks = data?.data || [];

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    high: tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length,
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterClick = (filterType, value) => {
    if (filterType === 'status') {
      setStatusFilter(value);
    } else {
      setPriorityFilter(value);
    }
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{
          x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
          width: isMobile ? 280 : 240,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={styles.sidebar}
      >
        <div style={styles.brand}>
          <div style={styles.brandMark}>TF</div>
          <span style={styles.brandName}>TaskFlow</span>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navSection}>
            <span style={styles.navLabel}>Status</span>
            {FILTERS.map((f) => (
              <motion.button
                key={f.value}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={styles.navItem(statusFilter === f.value)}
                onClick={() => handleFilterClick('status', f.value)}
              >
                {f.label}
                {statusFilter === f.value && (
                  <motion.span layoutId="activeFilter" style={styles.activeDot} />
                )}
              </motion.button>
            ))}
          </div>

          <div style={styles.navSection}>
            <span style={styles.navLabel}>Priority</span>
            {PRIORITIES.map((p) => (
              <motion.button
                key={p.value}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={styles.navItem(priorityFilter === p.value)}
                onClick={() => handleFilterClick('priority', p.value)}
              >
                {p.label}
              </motion.button>
            ))}
          </div>
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Total</span>
            <motion.span key={stats.total} initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={styles.statValue}>
              {stats.total}
            </motion.span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Done</span>
            <motion.span key={stats.done} initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={styles.statValue}>
              {stats.done}
            </motion.span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Active</span>
            <motion.span key={stats.inProgress} initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={styles.statValue}>
              {stats.inProgress}
            </motion.span>
          </div>
          {stats.high > 0 && (
            <div style={{ ...styles.statRow, marginTop: 8 }}>
              <span style={{ ...styles.statLabel, color: '#ef4444' }}>High Priority</span>
              <motion.span
                style={{ ...styles.statValue, color: '#ef4444' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stats.high}
              </motion.span>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div style={{
        ...styles.mainWrap,
        marginLeft: isMobile ? 0 : 240,
        width: isMobile ? '100%' : 'calc(100% - 240px)',
      }}>
        <main style={styles.main}>
          {/* Header */}
          <div style={styles.header}>
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.menuBtn}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <motion.span animate={{ rotate: sidebarOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </motion.span>
              </motion.button>
            )}
            <div style={{ flex: 1 }}>
              <motion.h1
                key={statusFilter}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={styles.heading}
              >
                {statusFilter
                  ? FILTERS.find((f) => f.value === statusFilter)?.label
                  : 'All Tasks'}
              </motion.h1>
              <p style={styles.subheading}>
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                {priorityFilter && ` · ${priorityFilter} priority`}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={styles.newBtn}
              onClick={() => setModal('new')}
            >
              <span style={{ fontSize: 18, marginRight: 6, lineHeight: 1 }}>+</span>
              New Task
            </motion.button>
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div style={styles.progressWrap}>
              <div style={styles.progressTrack}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.done / stats.total) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={styles.progressFill}
                />
              </div>
              <span style={styles.progressLabel}>
                {Math.round((stats.done / stats.total) * 100)}%
              </span>
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.state}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={styles.spinner}
                />
                <span style={styles.stateText}>Loading tasks...</span>
              </motion.div>
            )}

            {isError && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.state}
              >
                <span style={styles.errorIcon}>!</span>
                <span style={styles.stateText}>Could not connect to server</span>
              </motion.div>
            )}

            {!isLoading && !isError && tasks.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={styles.empty}
              >
                <div style={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <p style={styles.emptyTitle}>Nothing here yet</p>
                <p style={styles.emptyDesc}>Create your first task to get started</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={styles.emptyBtn}
                  onClick={() => setModal('new')}
                >
                  + Add task
                </motion.button>
              </motion.div>
            )}

            {!isLoading && tasks.length > 0 && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={styles.grid}
              >
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={(t) => setModal(t)}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <TaskModal
            task={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#fafafa',
    position: 'relative',
    width: '100%',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 998,
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    background: '#ffffff',
    borderRight: '2px solid #0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    zIndex: 999,
    overflowY: 'auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 20px 24px',
    borderBottom: '2px solid #0a0a0a',
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: 16,
    color: '#0a0a0a',
  },
  nav: {
    flex: 1,
    padding: '20px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  navSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6b7280',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0 8px',
    marginBottom: 8,
  },
  navItem: (active) => ({
    padding: '10px 12px',
    borderRadius: 8,
    background: active ? '#0a0a0a' : 'transparent',
    color: active ? '#fff' : '#0a0a0a',
    fontWeight: active ? 600 : 400,
    fontSize: 13,
    textAlign: 'left',
    border: active ? 'none' : '2px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.15s ease',
    width: '100%',
  }),
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: '#fff',
  },
  sidebarBottom: {
    padding: '20px',
    borderTop: '2px solid #0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 500,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0a0a0a',
  },
  mainWrap: {
    flex: 1,
    minHeight: '100vh',
    transition: 'margin-left 0.3s ease, width 0.3s ease',
  },
  main: {
    padding: 'clamp(24px, 4vw, 40px)',
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
    flexWrap: 'wrap',
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: '#0a0a0a',
    color: '#fff',
    border: '2px solid #0a0a0a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heading: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(24px, 5vw, 32px)',
    fontWeight: 700,
    color: '#0a0a0a',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  subheading: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  newBtn: {
    padding: '12px 20px',
    borderRadius: 10,
    background: '#0a0a0a',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    border: '2px solid #0a0a0a',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
  },
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    background: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    border: '2px solid #0a0a0a',
  },
  progressFill: {
    height: '100%',
    background: '#0a0a0a',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 13,
    color: '#0a0a0a',
    fontWeight: 600,
    flexShrink: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
    gap: 16,
  },
  state: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: 'clamp(60px, 10vw, 100px) 0',
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '3px solid #e5e7eb',
    borderTopColor: '#0a0a0a',
  },
  stateText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 500,
  },
  errorIcon: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#fef2f2',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 700,
    border: '2px solid #ef4444',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: 'clamp(60px, 10vw, 100px) 0',
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#0a0a0a',
    margin: 0,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#6b7280',
    margin: 0,
  },
  emptyBtn: {
    marginTop: 12,
    padding: '12px 24px',
    borderRadius: 10,
    background: '#0a0a0a',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    border: '2px solid #0a0a0a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
};