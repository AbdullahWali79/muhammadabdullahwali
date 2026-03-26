import React, { useEffect, useState } from 'react';
import { getFreelancingTasks, saveFreelancingTask, deleteFreelancingTask } from '../services/supabaseService';
import './FreelancingTasks.css';

const defaultWhatsApp = '+923046983794';
const defaultEmail = 'abdullahwale@gmail.com';

const FreelancingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    whatsapp: defaultWhatsApp,
    email: defaultEmail
  });

  const fetchTasks = async () => {
    setLoading(true);
    const res = await getFreelancingTasks();
    if (res.success) {
      setTasks(res.data || []);
      setMessage('');
    } else {
      console.error('fetch tasks error', res.error);
      setMessage('Unable to load tasks.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getWhatsAppLink = (phone, title) => {
    const cleaned = (phone || defaultWhatsApp).replace(/\D/g, '');
    const text = encodeURIComponent(`Assalamualaikum, I am interested in "${title}". Please share details.`);
    return `https://wa.me/${cleaned}?text=${text}`;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setMessage('Please provide title and description.');
      return;
    }

    setSaving(true);
    const newTask = {
      title: form.title,
      description: form.description,
      budget: form.budget,
      deadline: form.deadline,
      contact_whatsapp: form.whatsapp,
      contact_email: form.email
    };

    const res = await saveFreelancingTask(newTask);
    if (res.success) {
      setMessage('Task added successfully');
      setForm({ title: '', description: '', budget: '', deadline: '', whatsapp: defaultWhatsApp, email: defaultEmail });
      await fetchTasks();
    } else {
      setMessage(`Error saving task: ${res.error}`);
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this task?')) return;
    const res = await deleteFreelancingTask(id);
    if (res.success) {
      setMessage('Task removed');
      fetchTasks();
    } else {
      setMessage(`Delete failed: ${res.error}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="freelancing-tasks">
      <h1>Freelancing Tasks</h1>
      <p>Click any job to contact via WhatsApp or Email.</p>

      {message && <div className="message">{message}</div>}

      <form className="task-form" onSubmit={handleSubmit}>
        <h2>Create New Task</h2>
        <div className="form-row">
          <input name="title" value={form.title} onChange={handleInput} placeholder="Task title" />
          <input name="budget" value={form.budget} onChange={handleInput} placeholder="Budget" />
          <input name="deadline" value={form.deadline} onChange={handleInput} placeholder="Deadline" />
        </div>
        <textarea name="description" value={form.description} onChange={handleInput} placeholder="Task description" rows={3} />
        <div className="form-row">
          <input name="whatsapp" value={form.whatsapp} onChange={handleInput} placeholder="WhatsApp number" />
          <input name="email" value={form.email} onChange={handleInput} placeholder="Contact email" />
        </div>
        <button disabled={saving} className="btn btn-save">{saving ? 'Saving...' : 'Add Task'}</button>
      </form>

      <div className="task-grid">
        {loading ? (
          <p className="loading">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found. Start by adding one above.</p>
        ) : (
          tasks.map((task) => (
            <article key={task.id} className="task-card">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <div className="task-meta">
                <span>Budget: {task.budget || 'N/A'}</span>
                <span>Deadline: {task.deadline || 'N/A'}</span>
              </div>
              <div className="task-actions">
                <a
                  href={getWhatsAppLink(task.contact_whatsapp || defaultWhatsApp, task.title)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:${task.contact_email || defaultEmail}?subject=${encodeURIComponent(`Interested: ${task.title}`)}&body=${encodeURIComponent('Assalamualaikum, I want to work on this job.')}`}
                  className="btn btn-email"
                >
                  Email
                </a>
                <button type="button" className="btn btn-delete" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default FreelancingTasks;
