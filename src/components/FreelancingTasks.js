import React, { useEffect, useState } from 'react';
import { getFreelancingTasks } from '../services/supabaseService';
import { formatCurrency } from '../utils/currency';
import './FreelancingTasks.css';

const defaultWhatsApp = '+923046983794';
const defaultEmail = 'abdullahwale@gmail.com';

const FreelancingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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

  return (
    <div className="freelancing-tasks">
      <h1>Freelancing Tasks</h1>
      <p>Click any job to contact via WhatsApp or Email.</p>

      {message && <div className="message">{message}</div>}

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
                <span>Budget: {formatCurrency(task.budget, 'freelancing-tasks')}</span>
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
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default FreelancingTasks;

