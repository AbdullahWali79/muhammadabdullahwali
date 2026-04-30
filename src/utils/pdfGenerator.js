import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const toList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value).split(',').map(item => item.trim()).filter(Boolean);
};

const getOrigin = () => {
  if (typeof window === 'undefined') return '';
  return window.location.origin || '';
};

const getCleanPhone = (phone = '') => String(phone).replace(/\D/g, '');

const getSummaryBullets = (userData, aboutData) => {
  const rawSummary = userData.summary || aboutData?.description || '';
  const customBullets = rawSummary
    .split(/\n|\. /)
    .map(item => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 3);

  if (customBullets.length >= 2) return customBullets;

  return [
    `${userData.title || 'Software Developer'} focused on automation systems, dashboards, and custom web applications.`,
    'Builds practical tools with clean interfaces, database-backed workflows, and deployment-ready architecture.',
    'Strong fit for clients who need reliable business software, admin panels, reporting tools, and workflow automation.'
  ];
};

const skillGroups = {
  Frontend: ['react', 'javascript', 'html', 'css', 'tailwind', 'frontend', 'ui', 'ux', 'figma'],
  Backend: ['node', 'express', 'api', 'backend', 'server', 'database', 'sql', 'supabase', 'mongodb', 'postgres'],
  Automation: ['automation', 'ai', 'workflow', 'bot', 'scraping', 'integrations', 'crm'],
  Tools: ['git', 'github', 'vercel', 'electron', 'desktop', 'deployment', 'cloud']
};

const groupSkills = (skills) => {
  const grouped = Object.keys(skillGroups).reduce((acc, group) => ({ ...acc, [group]: [] }), {});
  grouped.Other = [];

  skills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    const group = Object.keys(skillGroups).find(groupName =>
      skillGroups[groupName].some(keyword => lowerSkill.includes(keyword))
    );

    grouped[group || 'Other'].push(skill);
  });

  return Object.entries(grouped).filter(([, values]) => values.length > 0);
};

const getProjectUrl = (project) => {
  const directUrl = project.liveUrl || project.githubUrl || project.link;
  if (directUrl && directUrl !== '#') return directUrl;
  return project.id ? `${getOrigin()}/#/portfolio/${project.id}` : '';
};

const getPortfolioUrl = () => `${getOrigin()}/#/portfolio`;

const createSectionTitle = (title) => `
  <h2 style="font-size: 17px; color: #00CED1; margin: 0 0 12px; border-bottom: 2px solid #00CED1; padding-bottom: 6px; letter-spacing: 0.3px;">
    ${title}
  </h2>
`;

const saveElementAsPDF = async (element, fileName, backgroundColor) => {
  document.body.appendChild(element);

  const images = element.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => new Promise(resolve => {
    if (img.complete) {
      resolve();
    } else {
      img.onload = resolve;
      img.onerror = resolve;
      setTimeout(resolve, 3000);
    }
  }));

  await Promise.all(imagePromises);

  try {
    const canvas = await html2canvas(element, {
      backgroundColor,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 5000
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } finally {
    document.body.removeChild(element);
  }
};

export const generatePDF = async (userData, portfolioData = null, aboutData = null) => {
  const cvContent = document.createElement('div');
  cvContent.style.cssText = `
    width: 210mm;
    min-height: 297mm;
    padding: 14mm;
    background-color: #102024;
    color: #ffffff;
    font-family: Arial, sans-serif;
    position: absolute;
    top: -9999px;
    left: -9999px;
    box-sizing: border-box;
  `;

  const skills = toList(aboutData?.skills);
  const groupedSkills = groupSkills(skills);
  const projects = [...(portfolioData?.projects || [])]
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    .slice(0, 4);
  const whatsappUrl = getCleanPhone(userData.phone) ? `https://wa.me/${getCleanPhone(userData.phone)}` : '';
  const portfolioUrl = getPortfolioUrl();
  const contactItems = [
    userData.email ? `Email: ${escapeHTML(userData.email)}` : '',
    userData.phone ? `Phone: ${escapeHTML(userData.phone)}` : '',
    whatsappUrl ? `WhatsApp: ${escapeHTML(whatsappUrl)}` : '',
    portfolioUrl ? `Portfolio: ${escapeHTML(portfolioUrl)}` : '',
    userData.address ? `Location: ${escapeHTML(userData.address)}` : ''
  ].filter(Boolean);

  const summaryHTML = `
    <section style="margin-bottom: 22px;">
      ${createSectionTitle('Professional Summary')}
      <ul style="margin: 0; padding-left: 18px; color: #DDE7EA; font-size: 13px; line-height: 1.55;">
        ${getSummaryBullets(userData, aboutData).map(item => `<li style="margin-bottom: 5px;">${escapeHTML(item)}</li>`).join('')}
      </ul>
    </section>
  `;

  const skillsHTML = groupedSkills.length > 0 ? `
    <section style="margin-bottom: 22px; page-break-inside: avoid;">
      ${createSectionTitle('Skills by Category')}
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        ${groupedSkills.map(([groupName, groupSkills]) => `
          <div style="background: #1A2B2E; border: 1px solid #2E474D; border-radius: 8px; padding: 12px;">
            <h3 style="font-size: 13px; color: #00CED1; margin: 0 0 8px; text-transform: uppercase;">${escapeHTML(groupName)}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${groupSkills.map(skill => `
                <span style="font-size: 11px; color: #DDE7EA; background: rgba(0, 206, 209, 0.12); border: 1px solid rgba(0, 206, 209, 0.35); border-radius: 999px; padding: 5px 8px;">
                  ${escapeHTML(skill)}
                </span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';

  const projectsHTML = projects.length > 0 ? `
    <section style="margin-bottom: 22px;">
      ${createSectionTitle('Selected Projects')}
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        ${projects.map(project => {
          const projectUrl = getProjectUrl(project);
          const technologies = toList(project.technologies).slice(0, 6);

          return `
            <div style="page-break-inside: avoid; background: #1A2B2E; border: 1px solid #2E474D; border-radius: 8px; overflow: hidden;">
              ${project.image ? `
                <div style="height: 105px; background: #ffffff; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                  <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title || 'Project')}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none'" />
                </div>
              ` : ''}
              <div style="padding: 12px;">
                <div style="font-size: 10px; color: #00CED1; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px;">${escapeHTML(project.category || 'Project')}</div>
                <h3 style="font-size: 14px; color: #ffffff; margin: 0 0 7px; line-height: 1.25;">${escapeHTML(project.title || 'Selected Project')}</h3>
                ${project.description ? `<p style="font-size: 11px; color: #B9C9CD; line-height: 1.45; margin: 0 0 8px;">${escapeHTML(project.description)}</p>` : ''}
                ${technologies.length > 0 ? `
                  <div style="font-size: 10px; color: #DDE7EA; margin-bottom: 8px;">
                    <strong style="color: #ffffff;">Tech:</strong> ${technologies.map(escapeHTML).join(', ')}
                  </div>
                ` : ''}
                ${projectUrl ? `<div style="font-size: 10px; color: #80F4F6; word-break: break-all;">${escapeHTML(projectUrl)}</div>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  ` : '';

  cvContent.innerHTML = `
    <header style="display: grid; grid-template-columns: 1fr 112px; gap: 18px; margin-bottom: 18px; align-items: center;">
      <div>
        <h1 style="font-size: 31px; font-weight: 700; color: #ffffff; margin: 0 0 6px;">
          ${escapeHTML(userData.firstName || '')} ${escapeHTML(userData.lastName || '')}
        </h1>
        <div style="font-size: 16px; color: #00CED1; font-weight: 600; margin-bottom: 12px;">${escapeHTML(userData.title || '')}</div>
        <div style="display: flex; flex-wrap: wrap; gap: 7px;">
          ${contactItems.map(item => `
            <span style="font-size: 10.5px; color: #DDE7EA; background: #1A2B2E; border: 1px solid #2E474D; border-radius: 999px; padding: 6px 9px;">
              ${item}
            </span>
          `).join('')}
        </div>
      </div>
      ${userData.profileImage ? `
        <div style="width: 112px; height: 112px; border-radius: 50%; overflow: hidden; border: 3px solid #00CED1; background: #1A2B2E;">
          <img src="${escapeHTML(userData.profileImage)}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
        </div>
      ` : `
        <div style="width: 112px; height: 112px; border-radius: 50%; background: linear-gradient(135deg, #00CED1, #008B8B); display: flex; align-items: center; justify-content: center; font-size: 34px; font-weight: bold; color: white;">
          ${escapeHTML(userData.firstName?.charAt(0) || '')}${escapeHTML(userData.lastName?.charAt(0) || '')}
        </div>
      `}
    </header>

    ${summaryHTML}
    ${skillsHTML}
    ${projectsHTML}

    <section style="margin-bottom: 18px; page-break-inside: avoid;">
      ${createSectionTitle('Additional Details')}
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 14px; font-size: 11.5px; color: #DDE7EA;">
        ${userData.languages ? `<div><strong style="color: #ffffff;">Languages:</strong> ${escapeHTML(userData.languages)}</div>` : ''}
        ${userData.nationality ? `<div><strong style="color: #ffffff;">Nationality:</strong> ${escapeHTML(userData.nationality)}</div>` : ''}
        ${aboutData?.experience ? `<div><strong style="color: #ffffff;">Experience:</strong> ${escapeHTML(aboutData.experience)}</div>` : ''}
        ${portfolioUrl ? `<div><strong style="color: #ffffff;">Full Portfolio:</strong> ${escapeHTML(portfolioUrl)}</div>` : ''}
      </div>
    </section>

    <footer style="margin-top: 24px; text-align: center; color: #7F969C; font-size: 10px;">
      ${escapeHTML(userData.firstName || '')} ${escapeHTML(userData.lastName || '')} - CV generated from portfolio website
    </footer>
  `;

  try {
    await saveElementAsPDF(
      cvContent,
      `${userData.firstName || 'Portfolio'}_${userData.lastName || 'CV'}_CV.pdf`,
      '#102024'
    );
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

export const generateTablePDF = async (userData, portfolioData = null, aboutData = null) => {
  const cvContent = document.createElement('div');
  cvContent.style.cssText = `
    width: 210mm;
    min-height: 297mm;
    padding: 14mm;
    background-color: #ffffff;
    color: #1f2933;
    font-family: Arial, sans-serif;
    position: absolute;
    top: -9999px;
    left: -9999px;
    box-sizing: border-box;
  `;

  const skills = toList(aboutData?.skills);
  const groupedSkills = groupSkills(skills);
  const projects = [...(portfolioData?.projects || [])]
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  const whatsappUrl = getCleanPhone(userData.phone) ? `https://wa.me/${getCleanPhone(userData.phone)}` : '';
  const portfolioUrl = getPortfolioUrl();
  const summaryBullets = getSummaryBullets(userData, aboutData);

  cvContent.innerHTML = `
    <header style="border-bottom: 3px solid #111827; padding-bottom: 14px; margin-bottom: 18px;">
      <h1 style="font-size: 30px; color: #111827; margin: 0 0 5px;">${escapeHTML(userData.firstName || '')} ${escapeHTML(userData.lastName || '')}</h1>
      <div style="font-size: 15px; color: #0F766E; font-weight: 700; margin-bottom: 10px;">${escapeHTML(userData.title || '')}</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
        <tbody>
          <tr>
            <td style="padding: 5px 7px; border: 1px solid #D7DEE5;"><strong>Email</strong><br>${escapeHTML(userData.email || '-')}</td>
            <td style="padding: 5px 7px; border: 1px solid #D7DEE5;"><strong>Phone</strong><br>${escapeHTML(userData.phone || '-')}</td>
            <td style="padding: 5px 7px; border: 1px solid #D7DEE5;"><strong>WhatsApp</strong><br>${escapeHTML(whatsappUrl || '-')}</td>
          </tr>
          <tr>
            <td style="padding: 5px 7px; border: 1px solid #D7DEE5;"><strong>Portfolio</strong><br>${escapeHTML(portfolioUrl)}</td>
            <td style="padding: 5px 7px; border: 1px solid #D7DEE5;"><strong>Location</strong><br>${escapeHTML(userData.address || '-')}</td>
            <td style="padding: 5px 7px; border: 1px solid #D7DEE5;"><strong>Languages</strong><br>${escapeHTML(userData.languages || '-')}</td>
          </tr>
        </tbody>
      </table>
    </header>

    <section style="margin-bottom: 18px;">
      <h2 style="font-size: 15px; color: #111827; margin: 0 0 8px; text-transform: uppercase; border-bottom: 1px solid #111827; padding-bottom: 5px;">Professional Summary</h2>
      <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.55;">
        ${summaryBullets.map(item => `<li style="margin-bottom: 4px;">${escapeHTML(item)}</li>`).join('')}
      </ul>
    </section>

    ${groupedSkills.length > 0 ? `
      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 15px; color: #111827; margin: 0 0 8px; text-transform: uppercase; border-bottom: 1px solid #111827; padding-bottom: 5px;">Skills Table</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tbody>
            ${groupedSkills.map(([groupName, groupSkills]) => `
              <tr>
                <th style="width: 28%; text-align: left; vertical-align: top; padding: 8px; border: 1px solid #CBD5E1; background: #F1F5F9; color: #111827;">${escapeHTML(groupName)}</th>
                <td style="padding: 8px; border: 1px solid #CBD5E1;">${groupSkills.map(escapeHTML).join(', ')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    ` : ''}

    <section style="margin-bottom: 18px;">
      <h2 style="font-size: 15px; color: #111827; margin: 0 0 8px; text-transform: uppercase; border-bottom: 1px solid #111827; padding-bottom: 5px;">Selected Projects Table</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 10.5px;">
        <thead>
          <tr style="background: #111827; color: #ffffff;">
            <th style="text-align: left; padding: 8px; border: 1px solid #111827; width: 8%;">#</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #111827; width: 40%;">Project Title</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #111827; width: 22%;">Category</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #111827; width: 30%;">Link</th>
          </tr>
        </thead>
        <tbody>
          ${projects.length > 0 ? projects.map((project, index) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #CBD5E1;">${index + 1}</td>
              <td style="padding: 8px; border: 1px solid #CBD5E1; font-weight: 700; color: #111827;">${escapeHTML(project.title || `Project ${index + 1}`)}</td>
              <td style="padding: 8px; border: 1px solid #CBD5E1;">${escapeHTML(project.category || '-')}</td>
              <td style="padding: 8px; border: 1px solid #CBD5E1; word-break: break-all; color: #0F766E;">${escapeHTML(getProjectUrl(project) || '-')}</td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="4" style="padding: 10px; border: 1px solid #CBD5E1; text-align: center;">No projects available</td>
            </tr>
          `}
        </tbody>
      </table>
    </section>

    <section>
      <h2 style="font-size: 15px; color: #111827; margin: 0 0 8px; text-transform: uppercase; border-bottom: 1px solid #111827; padding-bottom: 5px;">Additional Details</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <tbody>
          <tr>
            <th style="text-align: left; width: 28%; padding: 8px; border: 1px solid #CBD5E1; background: #F1F5F9;">Experience</th>
            <td style="padding: 8px; border: 1px solid #CBD5E1;">${escapeHTML(aboutData?.experience || '-')}</td>
          </tr>
          <tr>
            <th style="text-align: left; width: 28%; padding: 8px; border: 1px solid #CBD5E1; background: #F1F5F9;">Nationality</th>
            <td style="padding: 8px; border: 1px solid #CBD5E1;">${escapeHTML(userData.nationality || '-')}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `;

  try {
    await saveElementAsPDF(
      cvContent,
      `${userData.firstName || 'Portfolio'}_${userData.lastName || 'CV'}_Table_CV.pdf`,
      '#ffffff'
    );
  } catch (error) {
    console.error('Error generating table PDF:', error);
    alert('Error generating table PDF. Please try again.');
  }
};
