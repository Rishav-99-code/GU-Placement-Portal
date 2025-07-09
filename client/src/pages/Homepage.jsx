// frontend/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useInView } from 'react-intersection-observer';
import { Users, Building, Briefcase, Mail, Phone, GraduationCap, BriefcaseBusiness, UserCog } from 'lucide-react'; // Added GraduationCap, BriefcaseBusiness, UserCog icons

// Placeholder image for past recruiters (you'll replace with actual company logos)
const PlaceholderCompanyLogo = ({ src, alt }) => (
  <img
    src={src || `https://via.placeholder.com/150x80?text=${alt}`} // Placeholder
    alt={alt}
    className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
  />
);

const HomePage = () => {
  // Use useInView for simple fade-in animations on scroll
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [overviewRef, overviewInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [whyRecruitRef, whyRecruitInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [pastRecruitersRef, pastRecruitersInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [contactUsRef, contactUsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20 md:py-32 overflow-hidden
          transition-opacity duration-1000 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto text-center px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Empowering Futures, Connecting Opportunities
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Your trusted partner in bridging the gap between exceptional talent and leading industries.
          </p>
          {/* MODIFICATION HERE: Replaced single Register button with three role-based buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register?role=student">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 font-bold px-6 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 w-full sm:w-auto flex items-center justify-center">
                <GraduationCap className="mr-2 h-5 w-5" /> Student
              </Button>
            </Link>
            <Link to="/register?role=recruiter">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 font-bold px-6 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 w-full sm:w-auto flex items-center justify-center">
                <BriefcaseBusiness className="mr-2 h-5 w-5" /> Recruiter
              </Button>
            </Link>
            <Link to="/register?role=coordinator">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 font-bold px-6 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 w-full sm:w-auto flex items-center justify-center">
                <UserCog className="mr-2 h-5 w-5" /> Coordinator
              </Button>
            </Link>
            {/* Optional: Keep "Explore Jobs" if desired, or remove it */}
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold px-6 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105 w-full sm:w-auto">
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative background elements (optional) */}
        <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots opacity-10"></div>
      </section>

      {/* Rest of the HomePage.js content remains the same */}

      {/* Overview Section */}
      <section
        id="overview"
        ref={overviewRef}
        className={`py-16 bg-white transition-opacity duration-1000 ease-out ${overviewInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-lg text-gray-700 leading-relaxed">
              <p className="mb-4">
                Welcome to the official Placement Portal. We facilitate the recruitment process for companies seeking top-tier talent and provide students with unparalleled opportunities to kickstart their careers. Our platform serves as a dynamic bridge between academia and industry.
              </p>
              <p className="mb-4">
                We are committed to nurturing a symbiotic relationship where companies find their ideal candidates, and students discover fulfilling roles that align with their skills and aspirations. Our dedicated team ensures a seamless and efficient placement cycle.
              </p>
              <p>
                From coordinating interviews to managing offers, we handle every aspect with professionalism and precision, making the hiring experience smooth and rewarding for all stakeholders.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img
                src="https://via.placeholder.com/600x400?text=Overview+Image" // Replace with a relevant image
                alt="Overview"
                className="rounded-lg shadow-xl max-w-full h-auto transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Recruit Section */}
      <section
        id="why-recruit"
        ref={whyRecruitRef}
        className={`py-16 bg-blue-50 transition-opacity duration-1000 ease-out ${whyRecruitInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-10">
            Why Recruit Through Our Portal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <CardHeader className="flex flex-col items-center pb-4">
                <Users className="h-16 w-16 text-blue-600 mb-4" />
                <CardTitle className="text-xl text-blue-700">Access to Diverse Talent</CardTitle>
                <CardDescription className="mt-2">
                  Connect with a pool of highly skilled students from various disciplines.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Our students are equipped with cutting-edge knowledge, practical skills, and a strong work ethic, ready to excel in diverse roles.
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <CardHeader className="flex flex-col items-center pb-4">
                <Building className="h-16 w-16 text-blue-600 mb-4" />
                <CardTitle className="text-xl text-blue-700">Streamlined Process</CardTitle>
                <CardDescription className="mt-2">
                  Benefit from an efficient and organized recruitment experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                Our portal provides tools for easy job posting, application tracking, and interview coordination, all managed by a dedicated admin team.
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <CardHeader className="flex flex-col items-center pb-4">
                <Briefcase className="h-16 w-16 text-blue-600 mb-4" />
                <CardTitle className="text-xl text-blue-700">Long-Term Partnerships</CardTitle>
                <CardDescription className="mt-2">
                  Forge lasting relationships for future recruitment needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                We value our corporate partners and strive to build enduring connections that support your talent acquisition goals year after year.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Past Recruiters Section */}
      <section
        id="past-recruiters"
        ref={pastRecruitersRef}
        className={`py-16 bg-white transition-opacity duration-1000 ease-out ${pastRecruitersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            Our Valued Past Recruiters
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            We are proud to have partnered with a wide range of industry leaders who trust us to find their next generation of talent.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-center">
            {/* Replace these with actual company logos from your assets */}
            <PlaceholderCompanyLogo src="" alt="Google" />
            <PlaceholderCompanyLogo src="" alt="Microsoft" />
            <PlaceholderCompanyLogo src="" alt="Amazon" />
            <PlaceholderCompanyLogo src="" alt="Meta" />
            <PlaceholderCompanyLogo src="" alt="Apple" />
            <PlaceholderCompanyLogo src="" alt="Reliance" />
            <PlaceholderCompanyLogo src="" alt="TCS" />
            <PlaceholderCompanyLogo src="" alt="Infosys" />
            <PlaceholderCompanyLogo src="" alt="Wipro" />
            <PlaceholderCompanyLogo src="" alt="HCL" />
            {/* Add more logos as needed */}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section
        id="contact-us"
        ref={contactUsRef}
        className={`py-16 bg-gray-100 transition-opacity duration-1000 ease-out ${contactUsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Have questions or need assistance? Feel free to reach out to our dedicated placement team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
              <Mail className="h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-700 mb-4">For general inquiries or support.</p>
              <a href="mailto:placements@example.com" className="text-blue-600 hover:underline font-medium">
                placements@example.com
              </a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
              <Phone className="h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-700 mb-4">Reach out to our office during business hours.</p>
              <a href="tel:+91XXXXXXXXXX" className="text-blue-600 hover:underline font-medium">
                +91-XXX-XXXXXXX
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;