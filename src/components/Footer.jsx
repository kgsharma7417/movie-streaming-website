import React from 'react'
import styles from './Footer.module.css'

const FOOTER_LINKS = [
  ['Audio Description', 'Help Center', 'Gift Cards', 'Media Center'],
  ['Investor Relations', 'Jobs', 'Terms of Use', 'Privacy'],
  ['Legal Notices', 'Cookie Preferences', 'Corporate Info', 'Contact Us'],
  ['Ad Choices', 'Accessibility', 'Press', 'Speed Test'],
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Social icons */}
        <div className={styles.social}>
          <a href="#" className={styles.socialIcon} aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="#" className={styles.socialIcon} aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="#" className={styles.socialIcon} aria-label="Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
          </a>
          <a href="#" className={styles.socialIcon} aria-label="YouTube">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#141414"/></svg>
          </a>
        </div>

        {/* Link columns */}
        <div className={styles.linkGrid}>
          {FOOTER_LINKS.map((col, i) => (
            <div key={i} className={styles.linkCol}>
              {col.map(link => (
                <a key={link} href="#" className={styles.link}>{link}</a>
              ))}
            </div>
          ))}
        </div>

        {/* Language selector */}
        <div className={styles.langRow}>
          <select className={styles.langSelect}>
            <option>English</option>
            <option>हिन्दी</option>
          </select>
        </div>

        {/* Copyright */}
        <p className={styles.copyright}>© {new Date().getFullYear()} KGVIEW. Built with TMDB.</p>
      </div>
    </footer>
  )
}
