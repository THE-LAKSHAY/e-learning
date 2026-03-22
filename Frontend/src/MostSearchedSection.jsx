import React from 'react';
import './MostSearchedSection.css';

import car1 from './assets/car1.png';
import car2 from './assets/car2.avif';
import car3 from './assets/car3.jpg';
import car4 from './assets/car3.jpg';

const searchedCars = [
  {
    title: 'BMW X6',
    desc: 'Luxury SUV with powerful engine and sleek interior.',
    model: 'X6 M Sport',
    fuel: 'Petrol',
    year: '2023',
    image: car4,
  },
  {
    title: 'Audi Q7',
    desc: 'Spacious family SUV with comfort and tech.',
    model: 'Q7 Premium',
    fuel: 'Hybrid',
    year: '2022',
    image: car1,
  },
  {
    title: 'Mercedes GLE',
    desc: 'Elegant design with cutting-edge features.',
    model: 'GLE 450',
    fuel: 'Diesel',
    year: '2023',
    image: car2,
  },
  {
    title: 'Range Rover Evoque',
    desc: 'Off-road ready with luxury styling.',
    model: 'Evoque SE',
    fuel: 'Petrol',
    year: '2024',
    image: car3,
  },
];

const MostSearchedSection = () => {
  return (
    <section className="searched-section">
      <h2 className="searched-title">Most Searched Cars</h2>
      <div className="searched-cars">
        {searchedCars.map((car, index) => (
          <div className="searched-card" key={index}>
            <img src={car.image} alt={car.title} className="searched-image" />
            <div className="searched-info">
              <h3>{car.title}</h3>
              <p>{car.desc}</p>
              <div className="car-specs">
                <span>🛞 {car.model}</span>
                <span>⛽ {car.fuel}</span>
                <span>📅 {car.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostSearchedSection;