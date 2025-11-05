import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useInView } from 'react-intersection-observer';
import { Users, Building, Briefcase, Mail, Phone, GraduationCap, BriefcaseBusiness, UserCog } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import guistImage from '../assets/images/guist.jpg';

// Import the new image for the overview section
import itDeptImage from '../assets/images/IT-Dept.jpg';

import wiproLogo from '../assets/images/wipro.jpg';
import adpLogo from '../assets/images/adp.png';
import amazonLogo from '../assets/images/amazon logo.png';
import capgeminiLogo from '../assets/images/Capgemini-Logo.png';
import codeyoungLogo from '../assets/images/codeyoung logo.png';
import cognizantLogo from '../assets/images/cognizant logo.jpeg';
import federalBankLogo from '../assets/images/Federal Bank Logo.png';
import hikeEduLogo from '../assets/images/hike-edu-logo.png';
import infosysLogo from '../assets/images/infosyslogo.png';
import itcInfotechLogo from '../assets/images/itc-infotech-vector-logo-small.png';
import ltiMindtreeLogo from '../assets/images/LTIMindtree.png';
import mindlanceLogo from '../assets/images/Mindlance Logo.png';
import swiggyLogo from '../assets/images/swiggy logo.jpg';
import tcsLogo from '../assets/images/TCS.NS_BIG.png';
import zaloniLogo from '../assets/images/zaloni-logo.png';


const PlaceholderCompanyLogo = ({ src, alt }) => (
  <img
    src={src || `https://placehold.co/150x80?text=${alt}`}
    alt={alt}
    className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
  />
);

const HomePage = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [overviewRef, overviewInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [whyRecruitRef, whyRecruitInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [pastRecruitersRef, pastRecruitersInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [contactUsRef, contactUsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Handle hash navigation when component mounts or hash changes
  React.useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handleRoleButtonClick = (role) => {
    if (authState.isAuthenticated && authState.user.role === role) {
      // User is already logged in with this role, redirect to dashboard
      switch (role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard');
          break;
        case 'coordinator':
          navigate('/coordinator/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      // User is not logged in or has different role, go to registration
      navigate(`/register?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen">

      <section ref={heroRef} className={`relative transition-opacity duration-1000 ease-out ${heroInView ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero Image with Overlay */}
        <div className="relative w-full">
          <img
            src={guistImage}
            alt="GUIST College"
            className="w-full h-auto object-cover"
          />
          
          {/* Overlay with gradient for better button visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Buttons overlaid on image */}
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto px-4 text-center">
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-blue-700/90 backdrop-blur-sm text-white hover:bg-blue-800/90 font-bold px-6 py-4 rounded-full shadow-xl border border-white/20 w-full sm:w-auto flex items-center justify-center transition-all duration-300 hover:scale-105"
                  onClick={() => handleRoleButtonClick('student')}
                >
                  <GraduationCap className="mr-2 h-5 w-5" /> 
                  {authState.isAuthenticated && authState.user.role === 'student' ? 'Dashboard' : 'Student'}
                </Button>
                <Button 
                  size="lg" 
                  className="bg-blue-700/90 backdrop-blur-sm text-white hover:bg-blue-800/90 font-bold px-6 py-4 rounded-full shadow-xl border border-white/20 w-full sm:w-auto flex items-center justify-center transition-all duration-300 hover:scale-105"
                  onClick={() => handleRoleButtonClick('recruiter')}
                >
                  <BriefcaseBusiness className="mr-2 h-5 w-5" /> 
                  {authState.isAuthenticated && authState.user.role === 'recruiter' ? 'Dashboard' : 'Recruiter'}
                </Button>
                <Button 
                  size="lg" 
                  className="bg-blue-700/90 backdrop-blur-sm text-white hover:bg-blue-800/90 font-bold px-6 py-4 rounded-full shadow-xl border border-white/20 w-full sm:w-auto flex items-center justify-center transition-all duration-300 hover:scale-105"
                  onClick={() => handleRoleButtonClick('coordinator')}
                >
                  <UserCog className="mr-2 h-5 w-5" /> 
                  {authState.isAuthenticated && authState.user.role === 'coordinator' ? 'Dashboard' : 'Coordinator'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


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
              <p className="mb-4">
                From coordinating interviews to managing offers, we handle every aspect with professionalism and precision, making the hiring experience smooth and rewarding for all stakeholders.
              </p>
              {/* Added new paragraphs for better alignment */}
              <p className="mb-4">
                Our advanced search and filtering tools allow recruiters to quickly identify candidates based on skills, academic performance, and preferences. For students, the portal offers resume building tools, interview preparation resources, and a personalized dashboard to track their application status.
              </p>
              <p>
                We also regularly host virtual job fairs and information sessions, providing direct interaction opportunities between students and potential employers. Our goal is to empower every student to achieve their career dreams and every company to build a strong, skilled workforce.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <img
                src={itDeptImage}
                alt="IT Department"
                className="rounded-lg shadow-xl max-w-full h-auto transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>


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

            {/* Updated PlaceholderCompanyLogo components with actual imported images */}
            <PlaceholderCompanyLogo src={wiproLogo} alt="Wipro" />
            <PlaceholderCompanyLogo src={adpLogo} alt="ADP" />
            <PlaceholderCompanyLogo src={amazonLogo} alt="Amazon" />
            <PlaceholderCompanyLogo src={capgeminiLogo} alt="Capgemini" />
            <PlaceholderCompanyLogo src={codeyoungLogo} alt="Codeyoung" />
            <PlaceholderCompanyLogo src={cognizantLogo} alt="Cognizant" />
            <PlaceholderCompanyLogo src={federalBankLogo} alt="Federal Bank" />
            <PlaceholderCompanyLogo src={hikeEduLogo} alt="Hike Education" />
            <PlaceholderCompanyLogo src={infosysLogo} alt="Infosys" />
            <PlaceholderCompanyLogo src={itcInfotechLogo} alt="ITC Infotech" />
            <PlaceholderCompanyLogo src={ltiMindtreeLogo} alt="LTI Mindtree" />
            <PlaceholderCompanyLogo src={mindlanceLogo} alt="Mindlance" />
            <PlaceholderCompanyLogo src={swiggyLogo} alt="Swiggy" />
            <PlaceholderCompanyLogo src={tcsLogo} alt="TCS" />
            <PlaceholderCompanyLogo src={zaloniLogo} alt="Zaloni" />

          </div>
        </div>
      </section>


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
                t&pcellgu@gmail.com
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