import type { BlogPackage, BlogPost } from '../data';
import { choiPosts } from './choi';
import { commonPosts } from './common';
import { minPosts } from "./min";

export const blogPosts: BlogPost[] = [
  ...choiPosts,
  ...commonPosts,
  ...minPosts,
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
];

export function postsByPackage(pkg: BlogPackage): BlogPost[] {
  return blogPosts
    .filter((p) => p.package === pkg)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function findPost(pkg: BlogPackage, id: string): BlogPost | undefined {
  return blogPosts.find((p) => p.package === pkg && p.id === id);
}
