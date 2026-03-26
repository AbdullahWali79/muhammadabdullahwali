import React, { useEffect, useState } from 'react';
import PasswordProtection from './PasswordProtection';
import { FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { getFreelancingTasks, saveFreelancingTask, updateFreelancingTask, deleteFreelancingTask } from '../services/supabaseService';
import { formatCurrency } from '../utils/currency';
import './MakePrompts.css';

const MakeFreelancingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    contact_whatsapp: '+923046983794',
    contact_email: 'abdullahwale@gmail.com'
  });

  const loadTasks = async () => {
    setLoading(true);
    const res = await getFreelancingTasks();
    if (res.success) {
      setTasks(res.data || []);
      setMessage('');
    } else {
      setMessage('Error loading tasks: ' + res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setTaskForm({
      title: '',
      description: '',
      budget: '',
      deadline: '',
      contact_whatsapp: '+923046983794',
      contact_email: 'abdullahwale@gmail.com'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskForm.title || !taskForm.description) {
      setMessage('Title and description are required');
      return;
    }

    setSaving(true);
    let response;
    const normalizedTaskForm = {
      ...taskForm,
      budget: formatCurrency(taskForm.budget, 'freelancing-tasks', '')
    };

    if (editingTaskId) {
      response = await updateFreelancingTask(editingTaskId, normalizedTaskForm);
    } else {
      response = await saveFreelancingTask(normalizedTaskForm);
    }

    if (response.success) {
      setMessage('Task saved successfully');
      resetForm();
      await loadTasks();
    } else {
      setMessage('Error saving task: ' + response.error);
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      budget: formatCurrency(task.budget, 'freelancing-tasks', ''),
      deadline: task.deadline || '',
      contact_whatsapp: task.contact_whatsapp || '+923046983794',
      contact_email: task.contact_email || 'abdullahwale@gmail.com'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const res = await deleteFreelancingTask(id);
    if (res.success) {
      setMessage('Task deleted');
      await loadTasks();
    } else {
      setMessage('Delete failed: ' + res.error);
    }
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <PasswordProtection pageName="Freelancing Tasks Manager">
      <div className="make-prompts" style={{ minHeight: '120vh' }}>
        <div className="editor-header">
          <h1>{editingTaskId ? 'Edit Freelancing Task' : 'Create Freelancing Task'}</h1>
          <div className="editor-actions">
            <button className="btn btn-primary" onClick={resetForm} disabled={saving || loading}>
              <FaPlus /> New Task
            </button>
            <button className="btn btn-secondary" onClick={handleSubmit} disabled={saving || loading}>
              <FaSave /> {saving ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </div>

        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

        <div className="editor-content">
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input name="title" value={taskForm.title} onChange={handleInputChange} className="form-input" placeholder="Task title" />
              </div>
              <div className="form-group">
                <label>Budget</label>
                <input name="budget" value={taskForm.budget} onChange={handleInputChange} className="form-input" placeholder="Budget" />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input name="deadline" value={taskForm.deadline} onChange={handleInputChange} className="form-input" placeholder="Deadline" />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={taskForm.description} onChange={handleInputChange} className="form-textarea" rows="3" placeholder="Task description" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>WhatsApp</label>
                <input name="contact_whatsapp" value={taskForm.contact_whatsapp} onChange={handleInputChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="contact_email" value={taskForm.contact_email} onChange={handleInputChange} className="form-input" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Existing Tasks</h2>
            {loading ? <div className="loading">Loading...</div> : tasks.length === 0 ? <div>No tasks</div> : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {tasks.map(task => (
                  <div key={task.id} className="prompt-item" style={{ padding: '10px' }}>
                    <div className="prompt-header">
                      <h3>{task.title}</h3>
                      <div className="prompt-controls">
                        <button className="btn btn-secondary" onClick={() => handleEdit(task)}>
                          <FaEdit />
                        </button>
                        <button className="remove-btn" onClick={() => handleDelete(task.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p>{task.description}</p>
                    <small>Budget: {formatCurrency(task.budget, 'freelancing-tasks')} | Deadline: {task.deadline || 'N/A'}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PasswordProtection>
  );
};

export default MakeFreelancingTasks;

