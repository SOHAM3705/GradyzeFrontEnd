import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import axios from 'axios';

// Register fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Function to generate Division wise Result Analysis PDF
export const generateResultAnalysisPDF = async (classId, marksData, classMetaMap) => {
  try {
    // Fetch additional data from backend if needed
    const meta = classMetaMap[classId];
    if (!meta || !marksData) {
      throw new Error('No data available for PDF generation');
    }

    const { department, year, division, examType } = meta;
    
    // Fetch result analysis data from backend
    const analysisData = await fetchResultAnalysisData(meta);
    
    // Get exam type display name
    const examTypeDisplay = getExamTypeDisplay(examType);
    
    // Generate PDF document definition
    const docDefinition = createDocumentDefinition(analysisData, department, year, division, examTypeDisplay);
    
    // Generate and download PDF
    const fileName = `${department}_${year}_Division${division}_${examTypeDisplay}_ResultAnalysis.pdf`.replace(/\s+/g, '_');
    pdfMake.createPdf(docDefinition).download(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF: ' + error.message);
  }
};

// Function to fetch result analysis data from backend
const fetchResultAnalysisData = async (meta) => {
  try {
    const { data } = await axios.get('/api/admin/result-analysis', {
      params: {
        adminId: sessionStorage.getItem('adminId'),
        department: meta.department,
        year: meta.year,
        division: meta.division,
        examType: meta.examType
      }
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    // Return default structure if API fails
    return getDefaultAnalysisData(meta);
  }
};

// Function to get exam type display name
const getExamTypeDisplay = (examType) => {
  const examTypes = {
    'unitTest': 'Unit Test',
    'reunitTest': 'Re-Unit Test',
    'prelims': 'Prelims',
    'reprelims': 'Re-Prelims'
  };
  return examTypes[examType] || examType;
};

// Function to create PDF document definition
const createDocumentDefinition = (analysisData, department, year, division, examTypeDisplay) => {
  return {
    pageSize: 'A4',
    pageMargins: [0, 0, 0, 0],
    
    content: [
      // Header Section
      createHeader(),
      
      // Sub-header Section
      createSubHeader(),
      
      // Basic Information
      createBasicInfo(analysisData, department, year, division, examTypeDisplay),
      
      // Main Analysis Table
      createMainAnalysisTable(analysisData),
      
      // Authority Table
      createAuthorityTable(analysisData),
      
      // Remarks Section
      createRemarksSection(),
      
      // Final Authority Section
      createFinalAuthoritySection(analysisData)
    ],
    
    styles: {
      header: { fontSize: 10, bold: true, color: 'white', alignment: 'center' },
      subHeader: { fontSize: 12, bold: true, color: 'white', alignment: 'center' },
      tableHeader: { fontSize: 9, bold: true, color: 'white', alignment: 'center' },
      tableCell: { fontSize: 9, alignment: 'center' },
      leftAlign: { alignment: 'left' },
      boldText: { bold: true }
    }
  };
};

// Function to create header
const createHeader = () => {
  return {
    table: {
      widths: ['*'],
      heights: [35],
      body: [
        [{
          stack: [
            { text: "Pimpri Chinchwad Education Trust's", style: 'header', fontSize: 10 },
            { text: "Pimpri Chinchwad College of Engineering &", style: 'header', fontSize: 14 },
            { text: "Research Ravet, Pune", style: 'header', fontSize: 14 },
            { text: "IQAC PCCOER", style: 'header', fontSize: 12 }
          ],
          fillColor: '#333333',
          color: 'white',
          alignment: 'center',
          margin: [0, 5, 0, 5]
        }]
      ]
    },
    layout: 'noBorders'
  };
};

// Function to create sub-header
const createSubHeader = () => {
  return {
    table: {
      widths: ['*'],
      heights: [22],
      body: [
        [{
          columns: [
            {
              stack: [
                { text: 'Academic Year:', style: 'boldText', fontSize: 10, color: 'white' },
                { text: '2023 – 24', fontSize: 10, color: 'white' },
                { text: 'Term: II', style: 'boldText', fontSize: 10, color: 'white' }
              ],
              width: 'auto'
            },
            {
              text: 'Division wise Result Analysis – Internal Exam',
              style: 'subHeader',
              alignment: 'center',
              width: '*'
            },
            {
              stack: [
                { text: 'Record No.:', style: 'boldText', fontSize: 10, color: 'white' },
                { text: 'ACAD/R/012-C', fontSize: 10, color: 'white' }
              ],
              width: 'auto',
              alignment: 'right'
            }
          ],
          fillColor: '#555555',
          margin: [10, 3, 10, 3]
        }]
      ]
    },
    layout: 'noBorders'
  };
};

// Function to create basic information section
const createBasicInfo = (analysisData, department, year, division, examTypeDisplay) => {
  return {
    margin: [15, 10, 15, 10],
    columns: [
      {
        width: '50%',
        stack: [
          { text: `Department: ${department}`, fontSize: 10, margin: [0, 2] },
          { text: `Examination: ${examTypeDisplay} Exam`, fontSize: 10, margin: [0, 2] }
        ]
      },
      {
        width: '50%',
        stack: [
          { text: `Class: ${year}`, fontSize: 10, margin: [0, 2] },
          { text: `Div.: ${division}`, fontSize: 10, margin: [0, 2] },
          { text: `Date of Exam: ${analysisData.examDate || 'N/A'}`, fontSize: 10, margin: [0, 2] },
          { text: `Max Marks: ${analysisData.maxMarks || 'N/A'}`, fontSize: 10, margin: [0, 2] }
        ]
      }
    ]
  };
};

// Function to create main analysis table
const createMainAnalysisTable = (analysisData) => {
  const subjects = analysisData.subjects || ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4'];
  const tableData = analysisData.tableData || getDefaultTableData();
  
  const headers = ['Subjects', ...subjects];
  const body = [headers];
  
  // Add data rows
  tableData.forEach(row => {
    body.push([row.label, ...row.values]);
  });
  
  return {
    margin: [8, 5, 8, 10],
    table: {
      headerRows: 1,
      widths: [140, '*', '*', '*', '*'],
      body: body
    },
    layout: {
      fillColor: function(rowIndex) {
        return rowIndex === 0 ? '#16A085' : null;
      },
      hLineWidth: function() { return 0.2; },
      vLineWidth: function() { return 0.2; },
      hLineColor: function() { return '#000000'; },
      vLineColor: function() { return '#000000'; }
    }
  };
};

// Function to create authority table
const createAuthorityTable = (analysisData) => {
  const authorities = analysisData.authorities || {
    examIncharge: 'N/A',
    classTeacher: 'N/A',
    headOfDepartment: 'N/A'
  };
  
  return {
    margin: [8, 0, 8, 10],
    table: {
      headerRows: 1,
      widths: ['*', '*', '*'],
      body: [
        [
          { text: 'Internal Exam Incharge', style: 'tableHeader' },
          { text: 'Class Teacher', style: 'tableHeader' },
          { text: 'Head of Department', style: 'tableHeader' }
        ],
        [
          { text: authorities.examIncharge, style: 'tableCell' },
          { text: authorities.classTeacher, style: 'tableCell' },
          { text: authorities.headOfDepartment, style: 'tableCell' }
        ]
      ]
    },
    layout: {
      fillColor: function(rowIndex) {
        return rowIndex === 0 ? '#4682B4' : null;
      },
      hLineWidth: function() { return 0.2; },
      vLineWidth: function() { return 0.2; },
      hLineColor: function() { return '#000000'; },
      vLineColor: function() { return '#000000'; }
    }
  };
};

// Function to create remarks section
const createRemarksSection = () => {
  return {
    margin: [8, 5, 8, 10],
    stack: [
      { text: 'Remark: (Root Cause Analysis & corrective action):', style: 'boldText', fontSize: 10, margin: [0, 0, 0, 5] },
      {
        table: {
          headerRows: 1,
          widths: [40, 140, 140],
          body: [
            [
              { text: 'Sr. No.', style: 'tableHeader' },
              { text: 'Root Cause', style: 'tableHeader' },
              { text: 'Corrective Action', style: 'tableHeader' }
            ],
            [
              { text: '', style: 'tableCell', margin: [0, 10] },
              { text: '', style: 'tableCell', margin: [0, 10] },
              { text: '', style: 'tableCell', margin: [0, 10] }
            ],
            [
              { text: '', style: 'tableCell', margin: [0, 10] },
              { text: '', style: 'tableCell', margin: [0, 10] },
              { text: '', style: 'tableCell', margin: [0, 10] }
            ]
          ]
        },
        layout: {
          fillColor: function(rowIndex) {
            return rowIndex === 0 ? '#4682B4' : null;
          },
          hLineWidth: function() { return 0.2; },
          vLineWidth: function() { return 0.2; },
          hLineColor: function() { return '#000000'; },
          vLineColor: function() { return '#000000'; }
        }
      }
    ]
  };
};

// Function to create final authority section
const createFinalAuthoritySection = (analysisData) => {
  const finalAuthorities = analysisData.finalAuthorities || {
    classTeacher: 'N/A',
    academicCoordinator: 'N/A',
    headOfDepartment: 'N/A'
  };
  
  return {
    margin: [8, 0, 8, 10],
    table: {
      headerRows: 1,
      widths: ['*', '*', '*'],
      body: [
        [
          { text: 'Class Teacher', style: 'tableHeader' },
          { text: 'Department Academic Coordinator', style: 'tableHeader' },
          { text: 'Head of Department', style: 'tableHeader' }
        ],
        [
          { text: finalAuthorities.classTeacher, style: 'tableCell' },
          { text: finalAuthorities.academicCoordinator, style: 'tableCell' },
          { text: finalAuthorities.headOfDepartment, style: 'tableCell' }
        ]
      ]
    },
    layout: {
      fillColor: function(rowIndex) {
        return rowIndex === 0 ? '#4682B4' : null;
      },
      hLineWidth: function() { return 0.2; },
      vLineWidth: function() { return 0.2; },
      hLineColor: function() { return '#000000'; },
      vLineColor: function() { return '#000000'; }
    }
  };
};

// Function to get default analysis data structure
const getDefaultAnalysisData = (meta) => {
  return {
    examDate: '20th Feb 2024',
    maxMarks: '30',
    subjects: ['DSBDA', 'WT', 'AI', 'CC'],
    tableData: [
      { label: 'Total Strength of Class', values: ['78', '78', '78', '78'] },
      { label: 'No. of students Present', values: ['66', '62', '67', '68'] },
      { label: 'No. of students Absent', values: ['12', '16', '11', '10'] },
      { label: 'No. of students having marks from 0 to 11', values: ['2', '4', '3', '3'] },
      { label: 'No. of students having marks from 12 to 20', values: ['20', '45', '32', '57'] },
      { label: 'No. of students having marks from 21 to 28', values: ['41', '13', '30', '8'] },
      { label: 'No. of students having marks 28 above', values: ['3', '0', '2', '0'] },
      { label: '% Pass Result (Without absent students)', values: ['95.52%', '92.06%', '94.12%', '94.20%'] },
      { label: '% Fail Students (Without absent students)', values: ['2.99%', '6.35%', '4.41%', '4.35%'] },
      { label: '% Pass Result (With absent students)', values: ['81.01%', '73.42%', '81.01%', '82.28%'] },
      { label: 'Total No. of students appearing for Retest (Fail + Absent)', values: ['14 (2+12)', '20 (16+4)', '14 (3+11)', '13 (10+3)'] },
      { label: 'Average Attendance of students', values: ['84.62%', '79.49%', '85.90%', '87.18%'] },
      { label: 'Course (Subject) Faculty', values: ['VAK', 'DPM', 'AK', 'VPL'] }
    ],
    authorities: {
      examIncharge: 'Mrs. Madhavi M.Kapre',
      classTeacher: 'Mrs. Deepa Mahajan',
      headOfDepartment: 'Dr. A. A. Chaugule'
    },
    finalAuthorities: {
      classTeacher: 'Mrs. Deepa Mahajan',
      academicCoordinator: 'Dr. G. R. Suryavanshi',
      headOfDepartment: 'Dr. A. A. Chaugule'
    }
  };
};

// Function to get default table data
const getDefaultTableData = () => {
  return [
    { label: 'Total Strength of Class', values: ['78', '78', '78', '78'] },
    { label: 'No. of students Present', values: ['66', '62', '67', '68'] },
    { label: 'No. of students Absent', values: ['12', '16', '11', '10'] },
    { label: 'No. of students having marks from 0 to 11', values: ['2', '4', '3', '3'] },
    { label: 'No. of students having marks from 12 to 20', values: ['20', '45', '32', '57'] },
    { label: 'No. of students having marks from 21 to 28', values: ['41', '13', '30', '8'] },
    { label: 'No. of students having marks 28 above', values: ['3', '0', '2', '0'] },
    { label: '% Pass Result (Without absent students)', values: ['95.52%', '92.06%', '94.12%', '94.20%'] },
    { label: '% Fail Students (Without absent students)', values: ['2.99%', '6.35%', '4.41%', '4.35%'] },
    { label: '% Pass Result (With absent students)', values: ['81.01%', '73.42%', '81.01%', '82.28%'] },
    { label: 'Total No. of students appearing for Retest (Fail + Absent)', values: ['14 (2+12)', '20 (16+4)', '14 (3+11)', '13 (10+3)'] },
    { label: 'Average Attendance of students', values: ['84.62%', '79.49%', '85.90%', '87.18%'] },
    { label: 'Course (Subject) Faculty', values: ['VAK', 'DPM', 'AK', 'VPL'] }
  ];
};

export default generateResultAnalysisPDF;