import React from 'react';
import { Platform } from '../../types';

interface PlatformIconProps {
  platform: Platform;
  className?: string;
}

export const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3 7.4-1.2 4.4-5.2 7.1-9.9 7.4-4 .2-7.8-1.5-10.4-4.4 2.8.2 5.5-1.1 7.2-3.1-2.1-.1-3.8-.8-4.8-2.5 .8.1 1.5.2 2.2-.2-2.1-.4-3.8-1.8-4.2-4.1 .6.3 1.3.5 2.1.5-2.1-1.4-2.8-4.3-1.6-6.4 2.3 2.8 5.8 4.6 9.8 4.8-.1-1.1.3-3.3 2.1-4.6 1.8-1.3 4.4-1.1 6.1.6Z" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, className }) => {
  switch (platform) {
    case Platform.LinkedIn:
      return <LinkedInIcon className={className} />;
    case Platform.Twitter:
      return <TwitterIcon className={className} />;
    case Platform.Instagram:
      return <InstagramIcon className={className} />;
    case Platform.Facebook:
        return <FacebookIcon className={className} />;
    default:
      return null;
  }
};