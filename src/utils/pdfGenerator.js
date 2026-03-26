import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to get icon for skill
const getSkillIcon = (skill) => {
  const skillLower = skill.toLowerCase();
  if (skillLower.includes('design') || skillLower.includes('ui') || skillLower.includes('ux')) {
    return '🎨';
  } else if (skillLower.includes('web') || skillLower.includes('frontend') || skillLower.includes('html') || skillLower.includes('css')) {
    return '🌐';
  } else if (skillLower.includes('mobile') || skillLower.includes('app')) {
    return '📱';
  } else if (skillLower.includes('react') || skillLower.includes('javascript') || skillLower.includes('js')) {
    return '⚛️';
  } else if (skillLower.includes('node') || skillLower.includes('backend') || skillLower.includes('api')) {
    return '⚙️';
  } else if (skillLower.includes('database') || skillLower.includes('sql') || skillLower.includes('mongodb')) {
    return '💾';
  } else if (skillLower.includes('python') || skillLower.includes('java') || skillLower.includes('c++')) {
    return '💻';
  } else if (skillLower.includes('git') || skillLower.includes('github')) {
    return '🔧';
  } else if (skillLower.includes('cloud') || skillLower.includes('aws') || skillLower.includes('azure')) {
    return '☁️';
  } else if (skillLower.includes('ai') || skillLower.includes('machine learning') || skillLower.includes('ml')) {
    return '🤖';
  } else {
    return '⭐';
  }
};

export const generatePDF = async (userData, portfolioData = null, aboutData = null) => {
  // Create a temporary div to hold the CV content
  const cvContent = document.createElement('div');
  cvContent.style.cssText = `
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    background-color: #1A2B2E;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    position: absolute;
    top: -9999px;
    left: -9999px;
  `;

  // Prepare portfolio HTML - Professional Summary ke jagah
  const portfolioProjects = portfolioData?.projects || [];
  const portfolioHTML = portfolioProjects.length > 0 ? `
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 20px; color: #00CED1; margin-bottom: 20px; border-bottom: 2px solid #00CED1; padding-bottom: 5px;">Portfolio</h2>
      ${portfolioProjects.map((project, index) => `
        <div style="margin-bottom: 25px; page-break-inside: avoid; border: 1px solid #3A4B4E; border-radius: 8px; padding: 15px; background: #2A3B3E;">
          ${project.image ? `
            <div style="margin-bottom: 12px;">
              <img src="${project.image}" alt="${project.title || 'Project'}" style="width: 100%; max-width: 450px; height: auto; border-radius: 6px; display: block; margin: 0 auto; border: 1px solid #3A4B4E;" onerror="this.style.display='none'" />
            </div>
          ` : ''}
          <h3 style="font-size: 18px; color: #00CED1; margin-bottom: 10px; font-weight: 600;">${project.title || 'Project ' + (index + 1)}</h3>
          ${project.description ? `<p style="font-size: 14px; color: #B0B0B0; line-height: 1.6; margin-bottom: 0;">${project.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
  ` : `
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 20px; color: #00CED1; margin-bottom: 15px; border-bottom: 2px solid #00CED1; padding-bottom: 5px;">Portfolio</h2>
      <p style="font-size: 14px; color: #B0B0B0; line-height: 1.6;">No portfolio projects available.</p>
    </div>
  `;

  // Prepare skills HTML with icons
  const skills = aboutData?.skills || [];
  const skillsHTML = skills.length > 0 ? `
    <div style="margin-bottom: 30px; page-break-inside: avoid;">
      <h2 style="font-size: 20px; color: #00CED1; margin-bottom: 15px; border-bottom: 2px solid #00CED1; padding-bottom: 5px;">Skills & Expertise</h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        ${skills.map((skill, index) => `
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #2A3B3E; border-radius: 6px; border: 1px solid #3A4B4E;">
            <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #00CED1, #00B8BA); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">
              ${getSkillIcon(skill)}
            </div>
            <span style="font-size: 14px; color: #ffffff; font-weight: 500;">${skill}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  cvContent.innerHTML = `
    <div style="display: flex; margin-bottom: 30px;">
      <div style="flex: 1;">
        <h1 style="font-size: 36px; font-weight: 700; color: #ffffff; margin-bottom: 10px;">
          ${userData.firstName || ''} ${userData.lastName || ''}
        </h1>
        <p style="font-size: 18px; color: #00CED1; margin-bottom: 20px;">${userData.title || ''}</p>
        <p style="font-size: 14px; color: #B0B0B0; line-height: 1.6;">
          ${userData.summary || ''}
        </p>
      </div>
      ${userData.profileImage ? `
        <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin-left: 20px; border: 3px solid #00CED1;">
          <img src="${userData.profileImage}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}'; this.parentElement.style.background='linear-gradient(135deg, #00CED1, #008B8B)'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center'; this.parentElement.style.fontSize='36px'; this.parentElement.style.fontWeight='bold'; this.parentElement.style.color='white';" />
        </div>
      ` : `
        <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #00CED1, #008B8B); display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; color: white; margin-left: 20px;">
          ${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}
        </div>
      `}
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 20px; color: #00CED1; margin-bottom: 15px; border-bottom: 2px solid #00CED1; padding-bottom: 5px;">Personal Information</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A3B3E;">
          <span style="color: #B0B0B0;">First Name:</span>
          <span style="color: #ffffff; font-weight: 600;">${userData.firstName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A3B3E;">
          <span style="color: #B0B0B0;">Last Name:</span>
          <span style="color: #ffffff; font-weight: 600;">${userData.lastName}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A3B3E;">
          <span style="color: #B0B0B0;">Date of Birth:</span>
          <span style="color: #ffffff; font-weight: 600;">${userData.dateOfBirth}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A3B3E;">
          <span style="color: #B0B0B0;">Nationality:</span>
          <span style="color: #ffffff; font-weight: 600;">${userData.nationality}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A3B3E;">
          <span style="color: #B0B0B0;">Phone:</span>
          <span style="color: #ffffff; font-weight: 600;">${userData.phone}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A3B3E;">
          <span style="color: #B0B0B0;">Email:</span>
          <span style="color: #ffffff; font-weight: 600;">${userData.email}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A3B3E;">
          <span style="color: #B0B0B0;">Address:</span>
          <span style="color: #ffffff; font-weight: 600;">${userData.address}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A3B3E;">
          <span style="color: #B0B0B0;">Languages:</span>
          <span style="color: #ffffff; font-weight: 600;">${userData.languages}</span>
        </div>
      </div>
    </div>

    ${portfolioHTML}

    ${skillsHTML}

    <div style="margin-top: 40px; text-align: center; color: #B0B0B0; font-size: 12px;">
      © 2026 ${userData.firstName || ''} ${userData.lastName || ''}. All Rights Reserved.
    </div>
  `;

  document.body.appendChild(cvContent);

  // Wait for images to load
  const images = cvContent.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    return new Promise((resolve, reject) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = resolve;
        img.onerror = resolve; // Continue even if image fails
        setTimeout(resolve, 3000); // Timeout after 3 seconds
      }
    });
  });

  // Wait for all images to load or timeout
  await Promise.all(imagePromises);

  // Generate PDF
  html2canvas(cvContent, {
    backgroundColor: '#1A2B2E',
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 5000
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Clean up
    document.body.removeChild(cvContent);
    
    // Download the PDF
    pdf.save(`${userData.firstName}_${userData.lastName}_CV.pdf`);
  }).catch(error => {
    console.error('Error generating PDF:', error);
    document.body.removeChild(cvContent);
    alert('Error generating PDF. Please try again.');
  });
};

