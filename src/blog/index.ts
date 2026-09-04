import type { BlogPackage, BlogPost, BlogProject } from '../data';
import { choiPosts } from './choi';
import { commonPosts } from './common';
import { minPosts } from "./min";
import { skPosts } from './sk';

export const blogPosts: BlogPost[] = [
  ...choiPosts,
  ...commonPosts,
  ...minPosts,
  ...skPosts,
];

export const PACKAGES: { id: BlogPackage; label: string; description: string }[] = [
  {
    id: 'choi',
    label: 'Mr.Choi',
    description: '백엔드 깊은 곳에서, 한 번에 하나씩.',
  },
  {
    id: 'common',
    label: 'Common',
    description: '팀이 함께 모은 프론트엔드·디자인·프로덕트 기록.',
  },
  {
    id: 'min',
    label: 'min',
    description: 'idea와 ideal 사이를 기록하다.',
  },
  {
    id: 'sk',
    label: 'sk',
    description: 'AI 서비스 개발의 기록과 인사이트.',
  },
];

export const PROJECTS: { id: BlogProject; label: string; description: string }[] = [
  {
    id: 'i-poten',
    label: 'I-Poten',
    description: 'AI 모의면접 서비스를 만들며 남긴 기록.',
  },
  {
    id: 'i-fence',
    label: 'I-Fence',
    description: 'I-Fence를 만들며 남긴 기록.',
  },
  {
    id: 'joyword',
    label: 'Joyword',
    description: 'Joyword를 만들며 남긴 기록.',
  },
];

export function postsByProject(project: BlogProject): BlogPost[] {
  return blogPosts
    .filter((p) => p.project === project)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function postsByPackage(pkg: BlogPackage): BlogPost[] {
  return blogPosts
    .filter((p) => p.package === pkg)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function findPost(pkg: BlogPackage, id: string): BlogPost | undefined {
  return blogPosts.find((p) => p.package === pkg && p.id === id);
}
