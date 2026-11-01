import { sitemapResponse } from './sitemap.ts';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => sitemapResponse();
