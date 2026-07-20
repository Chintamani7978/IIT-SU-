import { Department, Subject, Resource } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'common',
    name: 'Common 1st Year (All Branches)',
    branches: [
      { id: 'common', name: 'All Branches' }
    ]
  },
  {
    id: 'cse',
    name: 'Department of Computer Science & Engineering',
    branches: [
      { id: 'cse-core', name: 'CSE (Core)' },
      { id: 'cse-aiml', name: 'CSE - AI/ML' },
      { id: 'cse-ics', name: 'CSE - ICS' }
    ]
  },
  {
    id: 'ece',
    name: 'Department of Electronics & Communication Engineering',
    branches: [
      { id: 'ece', name: 'ECE' }
    ]
  },
  {
    id: 'eee',
    name: 'Department of Electrical & Electronics Engineering',
    branches: [
      { id: 'eee', name: 'EEE' }
    ]
  }
];

export const SUBJECTS: Subject[] = [
  { id: 'eng-phy', name: 'Engineering Physics', code: 'PHY101', branchId: 'common', year: 1, semester: 1 },
  { id: 'eng-math-1', name: 'Engineering Mathematics I', code: 'MAT101', branchId: 'common', year: 1, semester: 1 },
  { id: 'dsa', name: 'Data Structures and Algorithms', code: 'CS201', branchId: 'cse-core', year: 2, semester: 3 },
  { id: 'dbms', name: 'Database Management Systems', code: 'CS202', branchId: 'cse-core', year: 2, semester: 4 },
  { id: 'ml', name: 'Machine Learning Foundations', code: 'AIML301', branchId: 'cse-aiml', year: 3, semester: 5 },
  { id: 'network-sec', name: 'Network Security', code: 'ICS302', branchId: 'cse-ics', year: 3, semester: 5 },
  { id: 'analog-cir', name: 'Analog Circuits', code: 'EC201', branchId: 'ece', year: 2, semester: 3 },
  { id: 'power-sys', name: 'Power Systems', code: 'EE301', branchId: 'eee', year: 3, semester: 5 },
];

// In-memory array to simulate a database for the current session.
// When Next.js hot-reloads, this might reset depending on how it's imported, 
// but it suffices for local mock testing.
export let RESOURCES: Resource[] = [
  {
    id: 'res-1',
    type: 'note',
    subjectId: 'eng-phy',
    title: 'Unit 1: Quantum Mechanics Complete Notes',
    authorName: 'Rahul Sharma',
    batch: '2024',
    unit: 'Unit 1',
    upvotes: 45,
    isVerified: true,
    status: 'approved',
    createdAt: new Date().toISOString(),
    pdfUrl: '#',
    badges: ['Faculty Verified', 'Topper Note']
  },
  {
    id: 'res-2',
    type: 'pyq',
    subjectId: 'dsa',
    title: 'Mid-Sem 2023 Original Paper',
    authorName: 'Admin',
    batch: '2023',
    upvotes: 120,
    isVerified: true,
    status: 'approved',
    createdAt: new Date().toISOString(),
    examType: 'mid-sem',
    year: '2023',
    pdfUrl: '#'
  },
  {
    id: 'res-3',
    type: 'video',
    subjectId: 'dbms',
    title: 'Normalization (1NF to BCNF)',
    authorName: 'Gate Smashers',
    unit: 'Unit 3',
    upvotes: 210,
    isVerified: true,
    status: 'approved',
    createdAt: new Date().toISOString(),
    videoUrl: 'https://www.youtube.com/embed/placeholder'
  }
];

export const getSubjectsByBranchAndYear = (branchId: string, year: number) => {
  return SUBJECTS.filter(s => s.branchId === branchId && s.year === year);
};

export const getSubjectById = (subjectId: string) => {
  return SUBJECTS.find(s => s.id === subjectId);
};

export const getResourcesBySubjectId = (subjectId: string) => {
  return RESOURCES.filter(r => r.subjectId === subjectId && r.status === 'approved');
};

export const getPendingResources = () => {
  return RESOURCES.filter(r => r.status === 'pending');
};

export const addResource = (resource: Resource) => {
  RESOURCES.push(resource);
};

export const upvoteResource = (resourceId: string) => {
  const resource = RESOURCES.find(r => r.id === resourceId);
  if (resource) {
    resource.upvotes += 1;
  }
};

export const approveResource = (resourceId: string) => {
  const resource = RESOURCES.find(r => r.id === resourceId);
  if (resource) {
    resource.status = 'approved';
    resource.isVerified = true;
  }
};
