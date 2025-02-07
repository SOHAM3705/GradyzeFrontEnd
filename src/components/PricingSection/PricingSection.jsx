import React from "react";
import styles from "./PricingSection.module.css";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <div className={styles.bodypricingsection} id="pricingsection">
      <div className={styles.header}>
        <h1>Choose Your Plan</h1>
        <p>
          Whether you want to get organized, keep your personal life on track,
          or boost workplace productivity, Gradyze has the right plan for you.
        </p>
      </div>

      <div className={styles.pricingContainer}>
        <div
          className={`${styles.plan} ${styles.basic}`}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className={styles.planBadge}>BASIC</div>
          <h2 className={styles.planName}>Free</h2>
          <div className={styles.planPrice}>$0</div>
          <p className={styles.planDescription}>
            Capture ideas and find them quickly
          </p>
          <ul className={styles.features}>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Sync unlimited devices
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              10 GB monthly uploads
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              200 MB max. note size
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Customize Home dashboard
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Connect Google Calendar account
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Add reminders and notifications
            </li>
          </ul>
          <Link to="/adminlogin">
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              Get Started
            </button>
          </Link>
        </div>

        <div
          className={`${styles.plan} ${styles.featured}`}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className={styles.planBadge}>MOST POPULAR</div>
          <h2 className={styles.planName}>Personal</h2>
          <div className={styles.planPrice}>$11.99</div>
          <p className={styles.planDescription}>
            Tools That Work the Way You Do.
          </p>
          <ul className={styles.features}>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Sync Unlimited devices
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              10 GB monthly uploads
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              200 MB max. note size
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Customize Home dashboard
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Connect Google Calendar account
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Add reminders and notifications
            </li>
          </ul>
          <Link to="adminlogin">
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              Get Started
            </button>
          </Link>
        </div>

        <div
          className={`${styles.plan} ${styles.premium}`}
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className={styles.planBadge}>PREMIUM</div>
          <h2 className={styles.planName}>Organization</h2>
          <div className={styles.planPrice}>$49.99</div>
          <p className={styles.planDescription}>
            Empower Your Organization – Smarter, Faster, Better.
          </p>
          <ul className={styles.features}>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Sync unlimited devices
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              10 GB monthly uploads
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Everything in Personal
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Advanced team collaboration
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              Admin console & controls
            </li>
            <li className={styles.feature}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M7.629,14.566c-0.125,0.125-0.322,0.125-0.447,0l-4.389-4.389c-0.124-0.124-0.124-0.322,0-0.446l0.891-0.891c0.124-0.124,0.322-0.124,0.446,0l3.07,3.07l6.694-6.694c0.124-0.124,0.322-0.124,0.447,0l0.891,0.891c0.124,0.124,0.124,0.322,0,0.446L7.629,14.566z" />
              </svg>
              SSO & advanced security
            </li>
          </ul>
          <Link to="/adminlogin">
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
