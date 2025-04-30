import React from "react";
import styles from "./Testimonials.module.css";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    title: "Head of Department",
    image: "/background.jpg", // Temporary placeholder icon
    testimonial:
      "Gradyze has revolutionized our academic evaluation process. It's user-friendly and efficient.",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "Teacher",
    image: "/background.jpg", // Temporary placeholder icon
    testimonial:
      "Gradyze has made managing student evaluations a breeze. Highly recommended!",
  },
  {
    id: 3,
    name: "Emily Johnson",
    title: "Admin",
    image: "/background.jpg", // Temporary placeholder icon
    testimonial:
      "Gradyze's administrative tools are top-notch. It has significantly improved our workflow.",
  },
];

const Testimonials = () => {
  return (
    <div className={styles.testimonialsSection}>
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
        <div className={styles.titleUnderline}></div>
      </div>
      <div className={styles.testimonialsContainer}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className={styles.testimonialCard}>
            <div className={styles.imageContainer}>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className={styles.testimonialImage}
              />
            </div>
            <div className={styles.quoteIcon}>
              <FaQuoteLeft />
            </div>
            <p className={styles.testimonialText}>{testimonial.testimonial}</p>
            <div className={styles.testimonialInfo}>
              <h3 className={styles.testimonialName}>{testimonial.name}</h3>
              <p className={styles.testimonialTitle}>{testimonial.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
