// src/Testimonials.jsx
import React from "react";
import "./Testimonials.css";

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
    <div className="testimonialsSection">
      <h2 className="sectionTitle">What Our Clients Say</h2>
      <div className="testimonialsContainer">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonialCard">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="testimonialImage"
            />
            <p className="testimonialText">{testimonial.testimonial}</p>
            <h3 className="testimonialName">{testimonial.name}</h3>
            <p className="testimonialTitle">{testimonial.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
