import type { BlogPost } from '../../data';
import { post01 } from './01-flask-vs-fastapi';
import { post02 } from './02-network-request-to-webserver';
import { post03 } from './03-from-socket-server-to-webserver';

export const skPosts: BlogPost[] = [
  post03,
  post02,
  post01,
];
