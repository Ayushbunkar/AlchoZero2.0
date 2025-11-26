import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '../components/common/Section';
import MotionInView from '../components/common/MotionInView';
import GradientGlow from '../components/common/GradientGlow';
import Hero from '../marketing/Hero';
import StatsStrip from '../marketing/StatsStrip';
import TestimonialCarousel from '../marketing/TestimonialCarousel';
import { useAuth } from '../contexts/AuthContext';
import { Car, ShieldAlert, Activity } from 'lucide-react';
import homeHero from '../assets/images/homeimage.png';
import Services from './Services';
import DriverAnimation from "../truckcaranimation/DriverAnimation";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const goToDashboard = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // Dashboard handles login internally
    }
  };

  return (
    <div>
      <Section>
        <div className="relative pt-16  md:pt-0 md:mt-10">
          <GradientGlow />
          <Hero
            title="Smart Safety with"
            highlight="AlcoZero"
            subtitle="Prevent drunk driving before it happens — detect impairment and disable ignition."
            primaryAction="Go to Dashboard"
            secondaryAction="Learn More"
            onPrimary={goToDashboard}
            onSecondary={() => navigate('/about')}
            imageSrc={homeHero}
            imageAlt="Illustration for AlcoZero home hero"
          />
          <MotionInView>
            <StatsStrip
              stats={[
                { label: 'Simulated Devices', value: '12' },
                { label: 'Events Logged', value: '1,248' },
                { label: 'Average Risk', value: '23%' },
                { label: 'Uptime', value: '99.9%' },
              ]}
            />
          </MotionInView>
        </div>
      </Section>

      <>
        <DriverAnimation />
      </>

      {/* Services Section */}
      <Services />

      {/* How It Works Section */}
      <section className="py-12 px-4 bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Simple, automated, and effective in 3 steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Detect',
                description: 'MQ-3 sensor detects alcohol vapor when driver enters the vehicle',
                icon: Activity,
              },
              {
                step: '02',
                title: 'Lock',
                description: 'If BAC exceeds safe limit, engine is automatically locked via relay',
                icon: ShieldAlert,
              },
              {
                step: '03',
                title: 'Alert',
                description: 'Firebase triggers instant alerts to admin dashboard and email',
                icon: Car,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="glass-card p-8">
                  <div className="flex items-center mb-4">
                    <item.icon className="w-8 h-8 text-neon-blue mr-3" />
                    <div className="text-4xl font-bold text-neon-blue/20">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="text-neon-blue text-3xl">→</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Section title="Trusted by teams" subtitle="Here's what early users say about our prototype.">
        <TestimonialCarousel
          items={[
            { quote: 'A clear, intuitive dashboard. Loved the responsiveness on mobile.', author: 'Riya', role: 'AI Engineer' },
            { quote: 'Easy to integrate API and straightforward event logs.', author: 'Arjun', role: 'DevOps' },
            { quote: 'The risk visualization is simple and effective.', author: 'Priya', role: 'QA Lead' },
          ]}
        />
        <div className="text-center mt-4">
          <Link to="/contact" className="text-sm text-accent-yellow hover:underline">Have feedback? Contact us →</Link>
        </div>
      </Section>
    </div>
  );

};


export default Home;
