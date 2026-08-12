// TaskModal.jsx - Updated with black outline theme
import React, { useState, useEffect } from 'react';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { motion } from 'framer-motion';

const PRIORITY_COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

export default function TaskModal({ task, onClose }) {
  const isEdit = Boolean(task?._id);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    }
  }, [task]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, dueDate: form.dueDate || null };
    if (isEdit) {
      await updateTask.mutateAsync({ id: task._id, data: payload });
    } else {
      await createTask.mutateAsync(payload);
    }
    onClose();
  };

  const loading = createTask.isPending || updateTask.isPending;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.overlay}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <span style={styles.headerTitle}>
            {isEdit ? 'Edit task' : 'New task'}
          </span>
          <motion.button
            whileHover={{ scale: 1.05, background: '#f3f4f6' }}
            whileTap={{ scale: 0.95 }}
            style={styles.closeBtn}
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <motion.input
              whileFocus={{ borderColor: '#0a0a0a' }}
              style={styles.input}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <motion.textarea
              whileFocus={{ borderColor: '#0a0a0a' }}
              style={{ ...styles.input, height: 88, resize: 'vertical' }}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Add details (optional)"
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Status</label>
              <motion.select
                whileFocus={{ borderColor: '#0a0a0a' }}
                style={styles.select}
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </motion.select>
            </div>

            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <motion.select
                whileFocus={{ borderColor: '#0a0a0a' }}
                style={styles.select}
                value={form.priority}
                onChange={(e) => set('priority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </motion.select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Due Date</label>
            <motion.input
              whileFocus={{ borderColor: '#0a0a0a' }}
              type="date"
              style={styles.input}
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </div>

          <div style={styles.actions}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              style={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create task'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    background: '#fff',
    border: '2px solid #0a0a0a',
    borderRadius: 16,
    width: '100%',
    maxWidth: 480,
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 24px 0 24px',
  },
  headerTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: 18,
    color: '#0a0a0a',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: '#f9fafb',
    border: '1.5px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  row: {
    display: 'flex',
    gap: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#0a0a0a',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  input: {
    padding: '12px 16px',
    fontSize: 14,
    border: '2px solid #0a0a0a',
    borderRadius: 10,
    background: '#fff',
    color: '#0a0a0a',
    width: '100%',
    transition: 'border-color 0.2s ease',
    fontFamily: "'Inter', sans-serif",
  },
  select: {
    padding: '12px 16px',
    fontSize: 14,
    border: '2px solid #0a0a0a',
    borderRadius: 10,
    background: '#fff',
    color: '#0a0a0a',
    width: '100%',
    transition: 'border-color 0.2s ease',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    border: '2px solid #0a0a0a',
    background: '#fff',
    color: '#0a0a0a',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  submitBtn: {
    padding: '10px 24px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    background: '#0a0a0a',
    color: '#fff',
    cursor: 'pointer',
    border: '2px solid #0a0a0a',
    transition: 'all 0.15s ease',
  },
};