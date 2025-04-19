let currentTemplate = 'template1';

function selectTemplate(templateId) {
  document.querySelectorAll('#resume-preview > div').forEach(div => div.classList.add('hidden'));
  document.getElementById(templateId).classList.remove('hidden');
  currentTemplate = templateId;
  updateResume();
}

function updatePhoto() {
  const file = document.getElementById('photo').files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profile-img').src = e.target.result;
      document.getElementById('profile-img-min').src = e.target.result;
      document.getElementById('profile-img-cre').src = e.target.result;
      document.getElementById('profile-img-grid').src = e.target.result;
      document.getElementById('profile-img-info').src = e.target.result;
      document.getElementById('profile-img-acad').src = e.target.result;
      document.getElementById('profile-img-bold').src = e.target.result;
      document.querySelectorAll('.profile-img').forEach(img => img.classList.remove('hidden'));
      updateResume();
    };
    reader.readAsDataURL(file);
  }
}

function updateResume() {
  const name = document.getElementById('name').value || 'John Doe';
  const email = document.getElementById('email').value || 'john.doe@example.com';
  const education = document.getElementById('education').value || 'B.S. ECE, Dr. B.C. Roy Engg. College, 2023-2027';
  const experience = document.getElementById('experience').value || 'Intern, XYZ Tech, Summer 2025';
  const projects = document.getElementById('projects').value || 'Smart Home Automation, Wearable Health Monitor';
  const certifications = document.getElementById('certifications').value || 'Python Basics, IoT Fundamentals';
  const extracurriculars = document.getElementById('extracurriculars').value || 'IEEE Member, Hackathon Participant';
  const gpa = document.getElementById('gpa').value || '7.8/10';
  const color = document.getElementById('color').value;

  if (currentTemplate === 'template1') {
    document.getElementById('resume-name').textContent = name;
    document.getElementById('resume-email').textContent = email;
    document.getElementById('resume-education').textContent = education;
    document.getElementById('resume-experience').textContent = experience;
    document.getElementById('resume-projects').textContent = projects;
    document.getElementById('resume-certifications').textContent = certifications;
    document.getElementById('resume-extracurriculars').textContent = extracurriculars;
    document.getElementById('resume-gpa').textContent = `GPA: ${gpa}`;
    document.getElementById('resume-skills').textContent = 'Python, JavaScript, SQL';
    document.getElementById('resume-header').style.borderColor = color;
    document.querySelectorAll('#template1 h2').forEach(h2 => h2.style.borderColor = color);
  } else if (currentTemplate === 'template2') {
    document.getElementById('resume-name-min').textContent = name;
    document.getElementById('resume-email-min').textContent = email;
    document.getElementById('resume-education-min').textContent = education;
    document.getElementById('resume-experience-min').textContent = experience;
    document.getElementById('resume-projects-min').textContent = projects;
    document.getElementById('resume-certifications-min').textContent = certifications;
    document.getElementById('resume-extracurriculars-min').textContent = extracurriculars;
    document.getElementById('resume-gpa-min').textContent = `GPA: ${gpa}`;
    document.getElementById('resume-skills-min').textContent = 'Python, JavaScript, SQL';
    document.querySelectorAll('#template2 h2').forEach(h2 => h2.style.borderColor = color);
  } else if (currentTemplate === 'template3') {
    document.getElementById('resume-name-cre').textContent = name;
    document.getElementById('resume-email-cre').textContent = email;
    document.getElementById('resume-education-cre').textContent = education;
    document.getElementById('resume-experience-cre').textContent = experience;
    document.getElementById('resume-projects-cre').textContent = projects;
    document.getElementById('resume-certifications-cre').textContent = certifications;
    document.getElementById('resume-extracurriculars-cre').textContent = extracurriculars;
    document.getElementById('resume-gpa-cre').textContent = `GPA: ${gpa}`;
    document.getElementById('resume-skills-cre').textContent = 'Python, JavaScript, SQL';
    document.querySelectorAll('#template3 .border-l-4').forEach(div => div.style.borderColor = color);
  } else if (currentTemplate === 'template4') {
    document.getElementById('resume-name-grid').textContent = name;
    document.getElementById('resume-email-grid').textContent = email;
    document.getElementById('resume-education-grid').textContent = education;
    document.getElementById('resume-experience-grid').textContent = experience;
    document.getElementById('resume-projects-grid').textContent = projects;
    document.getElementById('resume-certifications-grid').textContent = certifications;
    document.getElementById('resume-extracurriculars-grid').textContent = extracurriculars;
    document.getElementById('resume-gpa-grid').textContent = `GPA: ${gpa}`;
    document.getElementById('resume-skills-grid').textContent = 'Python, JavaScript, SQL';
    document.querySelectorAll('#template4 h2').forEach(h2 => h2.style.borderColor = color);
  } else if (currentTemplate === 'template5') {
    document.getElementById('resume-name-info').textContent = name;
    document.getElementById('resume-email-info').textContent = email;
    document.getElementById('resume-education-info').textContent = education;
    document.getElementById('resume-experience-info').textContent = experience;
    document.getElementById('resume-projects-info').textContent = projects;
    document.getElementById('resume-certifications-info').textContent = certifications;
    document.getElementById('resume-extracurriculars-info').textContent = extracurriculars;
    document.getElementById('resume-gpa-info').textContent = `GPA: ${gpa}`;
    document.getElementById('resume-skills-info').textContent = 'Python, JavaScript, SQL';
    document.querySelector('#template5 .border-b-4').style.borderColor = color;
    const gpaValue = parseFloat(gpa) || 7.8;
    document.getElementById('progress-gpa-info').style.width = `${(gpaValue / 10) * 100}%`;
  } else if (currentTemplate === 'template6') {
    document.getElementById('resume-name-acad').textContent = name;
    document.getElementById('resume-email-acad').textContent = email;
    document.getElementById('resume-education-acad').textContent = education;
    document.getElementById('resume-experience-acad').textContent = experience;
    document.getElementById('resume-projects-acad').textContent = projects;
    document.getElementById('resume-certifications-acad').textContent = certifications;
    document.getElementById('resume-extracurriculars-acad').textContent = extracurriculars;
    document.getElementById('resume-gpa-acad').textContent = `GPA: ${gpa}`;
    document.getElementById('resume-skills-acad').textContent = 'Python, JavaScript, SQL';
    document.querySelectorAll('#template6 .border-t-2').forEach(div => div.style.borderColor = color);
  } else if (currentTemplate === 'template7') {
    document.getElementById('resume-name-bold').textContent = name;
    document.getElementById('resume-email-bold').textContent = email;
    document.getElementById('resume-education-bold').textContent = education;
    document.getElementById('resume-experience-bold').textContent = experience;
    document.getElementById('resume-projects-bold').textContent = projects;
    document.getElementById('resume-certifications-bold').textContent = certifications;
    document.getElementById('resume-extracurriculars-bold').textContent = extracurriculars;
    document.getElementById('resume-gpa-bold').textContent = `GPA: ${gpa}`;
    document.getElementById('resume-skills-bold').textContent = 'Python, JavaScript, SQL';
    document.querySelectorAll('#template7 h2').forEach(h2 => h2.style.borderColor = color);
  }
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const resume = document.getElementById('resume-preview');
  const canvas = await html2canvas(resume, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff'
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [8.5, 11]
  });
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('resume.pdf');
}

selectTemplate('template1');

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const isDarkMode = localStorage.getItem("theme") === "dark";
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
    themeToggle.checked = true;
  } else {
    document.documentElement.classList.remove("dark");
  }
});

function toggleTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle.checked) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}