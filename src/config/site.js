// Real links used across the site. Leave a field empty ('') to hide its sticker.
export const socials = {
  email: 'haucoderfullstack05@gmail.com',
  facebook: 'https://www.facebook.com/huynh.hau.360484',
  instagram: 'https://www.instagram.com/codeser_dev',
  x: 'https://x.com', // TODO: replace with the real profile URL
  github: 'https://github.com/HauCoder2005',
  linkedin: 'https://www.linkedin.com/in/huynhhau',
};

// Same order as `projects.items` in the locale files
export const projectMeta = [
  {
    techs: ['Next.js', 'NestJS', 'Docker', 'Redis', 'MinIO'],
    github: '',
    demo: '',
  },
  {
    techs: ['Java 21', 'Spring Boot', 'Next.js', 'MySQL'],
    github: 'https://github.com/HauCoder2005/cinema-booking-projects',
    demo: 'https://frontend-cinema-booking-five.vercel.app',
  },
  {
    techs: ['React.js', 'Node.js', 'Media Pipeline', 'Logistics'],
    github: '',
    demo: '',
  },
];

// Languages on the rotary dial (text lives in `languages.items` in the locale files, keyed by id).
// Colour is the official brand colour, used for the active icon only.
export const languages = [
  { id: 'javascript', name: 'JavaScript', color: '#f7df1e' },
  { id: 'typescript', name: 'TypeScript', color: '#3178c6' },
  { id: 'java', name: 'Java', color: '#f89820' },
  { id: 'python', name: 'Python', color: '#3776ab' },
  { id: 'csharp', name: 'C#', color: '#9b4f96' },
  { id: 'cpp', name: 'C++', color: '#00599c' },
];
