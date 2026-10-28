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
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 10) {
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
    padding: 13mm 15mm;
    background-color: #ffffff;
    color: #1f2937;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    position: absolute;
    top: -9999px;
    left: -9999px;
    box-sizing: border-box;
    line-height: 1.4;
  `;

  const profileImg = userData?.profileImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKPwwOjpZTjQJnrH6G-XvW5FYdvkH5KOcVwBWQDEcmyemj8oD74QAOhVZURXU9i1kdCtmW_IIRLO_5tXRccZkSeIfzpwL6DkcOvb8yHhCwhSaXF3WS8OsR7rEcxranN1glfEEYJXOGFzDGVSkfv6TavN-8i_NRROPPviWm2WgGgJSrtJnZw6LvIyHBlhz-4PI7d_6_Hs_NmezPrYQ1lKAg3kfrB_2xtFPBe7YNNXmhTNFcT8iKweLI1BkD2AXVZdzRYKIdVen3Cw';

  const createSectionHeader = (title) => `
    <div style="margin-top: 10px; margin-bottom: 5px;">
      <div style="font-size: 12px; font-weight: 800; color: #111827; letter-spacing: 0.6px; text-transform: uppercase;">
        ${title}
      </div>
      <div style="width: 100%; height: 2px; background: #6366f1; margin-top: 3px; margin-bottom: 5px;"></div>
    </div>
  `;

  cvContent.innerHTML = `
    <!-- Header Box -->
    <header style="background: #1b232c; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 11px;">
      <div style="flex: 1; padding-right: 14px;">
        <h1 style="font-size: 23px; font-weight: 800; color: #ffffff; margin: 0 0 4px; letter-spacing: -0.2px;">
          Muhammad Abdullah
        </h1>
        <div style="font-size: 12px; font-weight: 700; color: #8b5cf6; margin-bottom: 5px;">
          Mobile &amp; Web Developer | AI &amp; LLMs Specialist | SEO Specialist
        </div>
        <div style="font-size: 10.5px; color: #f3f4f6; margin-bottom: 3px; font-weight: 500;">
          COMSATS University Islamabad (Vehari Campus) | Teaching since 2013
        </div>
        <div style="font-size: 10px; color: #d1d5db; margin-bottom: 2px;">
          Aljannat Colony, Vehari, Punjab, Pakistan | 0304 6983794
        </div>
        <div style="font-size: 10px; color: #d1d5db;">
          muhammadabdullah@cuivehari.edu.pk | muhammadabdullahwali.vercel.app
        </div>
      </div>
      <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 2.5px solid #8b5cf6; flex-shrink: 0; background: #2d3748; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
        <img src="${escapeHTML(profileImg)}" alt="Muhammad Abdullah" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" crossorigin="anonymous" />
      </div>
    </header>

    <!-- PROFILE Section -->
    <section style="margin-bottom: 9px;">
      ${createSectionHeader('PROFILE')}
      <p style="margin: 0; font-size: 10px; line-height: 1.48; color: #374151; text-align: justify;">
        Computer Science educator and versatile IT professional with over 12 years at COMSATS University Islamabad (Vehari Campus). Combines university teaching with real industry delivery across four areas: mobile app development (Flutter), web development, AI &amp; LLM-based solutions and SEO &amp; digital marketing. Has built and shipped client applications to the Google Play Store, delivered measurable SEO results for local and international clients, and conducted hands-on training programs for young learners during summer vacations.
      </p>
    </section>

    <!-- PROFESSIONAL EXPERIENCE Section -->
    <section style="margin-bottom: 9px;">
      ${createSectionHeader('PROFESSIONAL EXPERIENCE')}
      
      <!-- Role 1 -->
      <div style="margin-bottom: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <span style="font-size: 10.5px; font-weight: 800; color: #111827;">
            Lecturer — COMSATS University Islamabad, Vehari Campus
          </span>
          <span style="font-size: 10.5px; font-weight: 700; color: #6366f1;">
            2013 – Present
          </span>
        </div>
        <ul style="margin: 0; padding-left: 15px; font-size: 9.5px; line-height: 1.42; color: #374151;">
          <li style="margin-bottom: 1.5px;">Teaching Computer Science subjects including Mobile Application Development (Flutter), with a practical, project-based approach.</li>
          <li style="margin-bottom: 1.5px;">Integrated modern industry topics — AI and LLMs, web technologies, SEO and digital marketing — into student learning.</li>
          <li style="margin-bottom: 1.5px;">Guiding students in practical AI and LLM applications — prompt engineering, building chatbots and AI-powered apps using LLM APIs.</li>
          <li style="margin-bottom: 1.5px;">Supervising and mentoring student projects from idea to working, deployable products.</li>
        </ul>
      </div>

      <!-- Role 2 -->
      <div style="margin-bottom: 6px;">
        <div style="margin-bottom: 2px;">
          <span style="font-size: 10.5px; font-weight: 800; color: #111827;">
            SEO Specialist — WeConnect Software House
          </span>
        </div>
        <ul style="margin: 0; padding-left: 15px; font-size: 9.5px; line-height: 1.42; color: #374151;">
          <li>Managed and optimized multiple client websites: doubled organic traffic for one client in three months, achieved +40% traffic and +30% search visibility gains for others, and handled local SEO (Google Business Profile) for several businesses.</li>
        </ul>
      </div>

      <!-- Role 3 -->
      <div style="margin-bottom: 2px;">
        <div style="margin-bottom: 2px;">
          <span style="font-size: 10.5px; font-weight: 800; color: #111827;">
            Freelance Mobile &amp; Web Developer
          </span>
        </div>
        <ul style="margin: 0; padding-left: 15px; font-size: 9.5px; line-height: 1.42; color: #374151;">
          <li>Developed and delivered numerous applications for clients — including a complete inDrive-style ride-hailing app published on the Google Play Store — handling the full cycle from requirements to release.</li>
        </ul>
      </div>
    </section>

    <!-- KEY SKILLS Section -->
    <section style="margin-bottom: 9px;">
      ${createSectionHeader('KEY SKILLS')}
      <ul style="margin: 0; padding-left: 15px; font-size: 9.5px; line-height: 1.44; color: #374151;">
        <li style="margin-bottom: 2px;"><strong style="color: #111827;">Mobile Development:</strong> Flutter, Dart, Firebase, Google Maps, state management, Play Store publishing</li>
        <li style="margin-bottom: 2px;"><strong style="color: #111827;">Web Development:</strong> HTML, CSS, JavaScript, React, Node.js, WordPress, Git &amp; GitHub, deployment</li>
        <li style="margin-bottom: 2px;"><strong style="color: #111827;">AI &amp; LLMs:</strong> Prompt engineering, LLM APIs (OpenAI, Claude, Gemini), RAG, AI agents, chatbot development, AI-assisted coding, integrating AI into web &amp; mobile apps</li>
        <li style="margin-bottom: 2px;"><strong style="color: #111827;">SEO &amp; Digital Marketing:</strong> Technical &amp; local SEO, Google Business Profile, social media optimization, lead generation</li>
        <li style="margin-bottom: 1.5px;"><strong style="color: #111827;">Teaching &amp; Management:</strong> Curriculum design, mentoring, training programs for all age groups, managing multiple projects</li>
      </ul>
    </section>

    <!-- EDUCATION Section -->
    <section style="margin-bottom: 9px;">
      ${createSectionHeader('EDUCATION')}
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
        <span style="font-size: 10.5px; font-weight: 800; color: #111827;">
          MSCS — Virtual University of Pakistan
        </span>
        <span style="font-size: 10.5px; font-weight: 700; color: #6366f1;">
          2018
        </span>
      </div>
      <div style="font-size: 9.5px; color: #374151;">
        Master of Science in Computer Science, 1st Division.
      </div>
    </section>

    <!-- HIGHLIGHTS Section -->
    <section style="margin-bottom: 9px;">
      ${createSectionHeader('HIGHLIGHTS')}
      <ul style="margin: 0; padding-left: 15px; font-size: 9.5px; line-height: 1.42; color: #374151;">
        <li style="margin-bottom: 1.5px;">12+ years of university teaching experience.</li>
        <li style="margin-bottom: 1.5px;">Client apps live on the Google Play Store, including a full ride-hailing platform.</li>
        <li style="margin-bottom: 1.5px;">Proven SEO results: organic traffic doubled in 3 months for one client; +40% and +30% improvements for others.</li>
        <li style="margin-bottom: 1.5px;">Conducted AI and web development summer programs for young learners, with students requesting follow-up sessions.</li>
      </ul>
    </section>

    <!-- LANGUAGES Section -->
    <section style="margin-bottom: 2px;">
      ${createSectionHeader('LANGUAGES')}
      <div style="font-size: 10px; color: #374151; font-weight: 500;">
        Urdu, English
      </div>
    </section>
  `;

  try {
    await saveElementAsPDF(
      cvContent,
      'Muhammad_Abdullah_Resume.pdf',
      '#ffffff'
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
