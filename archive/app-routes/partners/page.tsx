import { redirect } from 'next/navigation';

export default function PartnersRedirect() {
  // Partners content is now embedded on /about — redirect to avoid duplicate pages
  redirect('/about#partners');
}