import React, { useState } from 'react';
import { format } from 'date-fns';
import { useDeleteTask, useUpdateTask } from '../hooks/useTasks';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CONFIG = {
  todo: { 
    label: 'To Do', 
    color: '#6366f1', 
    bg: '#eef2ff',
  },
  'in-progress': { 
    label: 'In Progress', 
    color: '#f59e0b', 
    bg: '#fffbeb',
  },
  done: { 
    label: 'Done', 
    color: '#10b981', 
    bg: '#ecfdf5',
  },
};

const PRIORITY_CONFIG = {
  low: { 
    color: '#10b981', 
    bg: '#d1fae5',
    label: 'Low',
  },
  medium: { 
    color: '#f59e0b', 
    bg: '#fef3c7',
    label: 'Medium',
  },
  high: { 
    color: '#ef4444', 
    bg: '#fee2e2',
    label: 'High',
  },
};

export default function TaskCard({ task, onEdit, index }) {
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const [confirm, setConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];
  const isDone = task.status === 'done';
  const isOverdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date();

  const cycleStatus = () => {
    const cycle = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
    updateTask.mutate({ id: task._id, data: { status: cycle[task.status] } });
  };

  const handleDelete = () => {
    if (confirm) {
      deleteTask.mutate(task._id);
    } else {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      style={{
        ...styles.card,
        opacity: isDone ? 0.85 : 1,
        borderColor: isHovered ? status.color : '#0a0a0a',
        boxShadow: isHovered 
          ? '0 8px 30px rgba(0,0,0,0.12)' 
          : '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <motion.h3
              style={{
                ...styles.title,
                color: isDone ? '#9ca3af' : '#0a0a0a',
                textDecoration: isDone ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </motion.h3>
          </div>
          
          <div style={styles.badges}>
            <span style={{
              ...styles.statusBadge,
              background: isHovered ? status.bg : '#f9fafb',
              color: status.color,
              border: `1px solid ${isHovered ? status.color + '40' : '#e5e7eb'}`,
            }}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.description}
          >
            {task.description}
          </motion.p>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.meta}>
            {/* Priority indicator */}
            <div style={styles.priorityGroup}>
              <div style={{
                ...styles.priorityDot,
                background: priority.color,
              }} />
              <span style={styles.priorityLabel}>
                {priority.label}
              </span>
            </div>

            {/* Due date */}
            {task.dueDate && (
              <div style={{
                ...styles.dueDate,
                color: isOverdue ? '#ef4444' : '#6b7280',
                background: isOverdue ? '#fef2f2' : '#f9fafb',
                border: `1px solid ${isOverdue ? '#fecaca' : '#e5e7eb'}`,
              }}>
                <span style={styles.dueDateLabel}>
                  {isOverdue ? 'Overdue' : 'Due'}
                </span>
                <span style={styles.dueDateValue}>
                  {format(new Date(task.dueDate), 'MMM d')}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <motion.button
              whileHover={{ scale: 1.1, background: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              style={styles.actionBtn}
              onClick={cycleStatus}
              title="Change status"
            >
              <motion.div
                animate={{ rotate: isDone ? 360 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `2px solid ${status.color}`,
                  background: isDone ? status.color : 'transparent',
                }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, background: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              style={styles.actionBtn}
              onClick={() => onEdit(task)}
              title="Edit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.1, 
                background: confirm ? '#fef2f2' : '#f3f4f6' 
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                ...styles.actionBtn,
                color: confirm ? '#ef4444' : '#6b7280',
              }}
              onClick={handleDelete}
              title={confirm ? 'Click to confirm' : 'Delete'}
            >
              <motion.svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                animate={confirm ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  card: {
    display: 'flex',
    background: '#ffffff',
    borderRadius: 12,
    border: '2px solid #0a0a0a',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
  },
  content: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.4,
    margin: 0,
    transition: 'color 0.2s ease',
  },
  badges: {
    display: 'flex',
    gap: 6,
    flexShrink: 0,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 1.6,
    margin: 0,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  priorityGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  dueDate: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
  },
  dueDateLabel: {
    opacity: 0.7,
    fontSize: 10,
  },
  dueDateValue: {
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};