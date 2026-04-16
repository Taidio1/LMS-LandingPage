export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  content: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const MOCK_COURSE: Course = {
  id: 'odysseio-advantage',
  title: 'The Odysseio Advantage',
  description: 'Learn why our bespoke LMS approach is the future of enterprise learning.',
  lessons: [
    {
      id: 'lesson-1',
      title: 'Why Individual LMS?',
      type: 'video',
      content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '5:20'
    },
    {
      id: 'lesson-2',
      title: 'Security & Scalability',
      type: 'pdf',
      content: 'LMS_Technical_Specs.pdf',
      duration: '15 min read'
    },
    {
      id: 'lesson-3',
      title: 'Your Brand, Your Rules',
      type: 'text',
      content: 'Deep dive into white-label capabilities...',
      duration: '10 min read'
    }
  ]
};

export const fetchUserActivity = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: 1, name: 'John Doe', progress: 85, lastActive: '2h ago' },
    { id: 2, name: 'Jane Smith', progress: 45, lastActive: '5h ago' },
    { id: 3, name: 'Mike Johnson', progress: 100, lastActive: '1d ago' },
  ];
};
