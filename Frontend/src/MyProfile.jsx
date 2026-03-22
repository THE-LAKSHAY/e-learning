import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./MyProfile.css";
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaSignOutAlt, FaHome, FaCar } from "react-icons/fa";

const MyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [bookedCars, setBookedCars] = useState([]);   // test drives
  const [carbooking, setCarBooking] = useState([]);   // car bookings

  // Fetch test drives
  useEffect(() => {
    if (!user?.email) return;

    async function fetchTestDrives() {
      try {
        const res = await fetch(`http://localhost:5000/testdrives/${user.email}`);
        const data = await res.json();
        if (res.ok) setBookedCars(data);
      } catch (err) {
        console.error("Error fetching test drives:", err);
      }
    }

    fetchTestDrives();
  }, [user]);

  // Fetch car bookings
  useEffect(() => {
    if (!user?.email) return;

    async function fetchBookings() {
      try {
        const res = await fetch(`http://localhost:5000/fetchbooking/${user.email}`);
        const data = await res.json();
        if (res.ok) setCarBooking(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    }

    fetchBookings();
  }, [user]);

  // Load user from localStorage
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) {
      navigate("/auth");
    } else {
      setUser(loggedUser);
    }
  }, [navigate]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/auth"); 
  };

  const handleBackHome = () => navigate("/");

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Back to Home */}
        <div className="back-home-section">
          <button className="back-home-btn" onClick={handleBackHome}>
            <FaHome /> Back to Home
          </button>
        </div>

        {/* Title */}
        <h1 className="profile-title">My Profile</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "testdrives" ? "active" : ""}`}
            onClick={() => setActiveTab("testdrives")}
          >
            Test Drives
          </button>
          <button
            className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Car Bookings
          </button>
        </div>

        {/* Profile Section */}
        {activeTab === "profile" && (
          <div className="profile-details">
            <div className="detail-card">
              <FaUser className="icon" />
              <div className="info">
                <span className="label">Full Name</span>
                <span className="value">{user.fullName}</span>
              </div>
            </div>
            <div className="detail-card">
              <FaPhone className="icon" />
              <div className="info">
                <span className="label">Phone</span>
                <span className="value">{user.phone}</span>
              </div>
            </div>
            <div className="detail-card">
              <FaEnvelope className="icon" />
              <div className="info">
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Test Drives Section */}
        {activeTab === "testdrives" && (
          <div className="updates-container">
            {bookedCars.length === 0 ? (
              <p className="no-updates">You haven't booked any test drives yet.</p>
            ) : (
              bookedCars.map((car, idx) => (
                <div className="update-card" key={idx}>
                  <FaCalendarAlt className="icon" />
                  <div className="update-info">
                    <p><strong>Date:</strong> {car.date}</p>
                    <p><strong>Car Model:</strong> {car.model}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Car Bookings Section */}
        {activeTab === "bookings" && (
          <div className="updates-container">
            {carbooking.length === 0 ? (
              <p className="no-updates">You haven't booked any cars yet.</p>
            ) : (
              carbooking.map((booking, idx) => (
                <div className="update-card" key={idx}>
                  <FaCar className="icon" />
                  <div className="update-info">
                    <p><strong>Car:</strong> {booking.car?.title}</p>
                    <p><strong>Booking Period:</strong> Within {booking.bookingPeriod} Days</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Logout */}
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
