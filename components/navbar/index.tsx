import type { FC } from 'react';
import {
  Book,
  Briefcase,
  Home,
  Layers,
  MessageCircle,
  Star,
  User,
  Zap,
} from 'lucide-react';
import NavbarLink from './navbarLink';
import ContextualMenu from './contextualMenu';

const pages = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'About', icon: User, href: '/about' },
  { name: 'Work', icon: Briefcase, href: '/work' },
  { name: 'Projects', icon: Zap, href: '/projects' },
  { name: 'Blog', icon: Book, href: '/blog' },
  { name: 'Stack', icon: Layers, href: '/stack' },
  { name: 'Press', icon: Star, href: '/press' },
  { name: 'Contact', icon: MessageCircle, href: '/contact' },
];

const Navbar: FC = () => (
  <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
    <div className="flex items-center rounded-full border border-gray-100 bg-white px-3 shadow-lg shadow-gray-800/5">
      <div className="flex items-center px-1">
        {pages.map((link) => (
          <NavbarLink key={link.name} {...link} />
        ))}
      </div>
      <ContextualMenu />
    </div>
  </div>
);

export default Navbar;
