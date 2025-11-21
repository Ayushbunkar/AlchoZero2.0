import React from 'react';
import Section from '../components/common/Section';
import MotionInView from '../components/common/MotionInView';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { 
  Car, 
  Activity, 
  ShieldAlert, 
  ScanFace,    // For Face Auth
  EyeOff,      // For Drowsiness
  Smartphone,  // For Distraction
  Mic,         // For Audio Analysis
  Gauge,       // For Rash Driving
  TrendingUp,  // For Behavior Analysis
  Zap,         // For Real-time processing
  Database,    // For Data storage
  Bell,        // For Alerts
  Cloud,       // For Cloud integration
  Users,       // For Multi-user
  Settings,    // For Configuration
} from 'lucide-react';
import feat4 from '../assets/images/audio.png';
import feat3 from '../assets/images/distractionsmoking.png';
import feat6 from '../assets/images/rash.png';
import feat5 from '../assets/images/driveranallysis.png';
import feat1 from '../assets/images/facedetection.png';
import feat2 from '../assets/images/drowsiness.png';
import homeHero from '../assets/images/homeimage.png';

const PricingCard = ({ title, price, features = [], cta }) => (
  <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-5 hover:border-(--primary-blue)/30 transition-colors duration-300">
    <div className="text-sm font-semibold text-(--primary-blue) mb-2">{title}</div>
    <div className="text-3xl font-bold text-white mb-3">{price}</div>
    <ul className="text-xs text-gray-300 space-y-1 mb-4 list-disc pl-4">
      {features.map((f) => (<li key={f}>{f}</li>))}
    </ul>
    <button className="px-4 py-2 rounded-lg bg-(--success-green) text-white text-sm w-full font-medium hover:bg-(--success-green)/90 transition-colors">{cta}</button>
  </div>
);

const Services = () => {

  const aiFeatures = [
    {
      title: "Driver Face Authentication",
      desc: "Biometric verification to ensure only authorized personnel operate the vehicle.",
      icon: ScanFace,
      image: feat1,
    },
    {
      title: "Drowsiness Detection",
      desc: "Real-time PERCLOS analysis to detect fatigue and trigger wake-up alarms.",
      icon: EyeOff,
      image: feat2,
    },
    {
      title: "Distraction Detection",
      desc: "Identifies phone usage, smoking, or looking away from the road via cabin cam.",
      icon: Smartphone,
      image: feat3,
    },
    {
      title: "Audio Alcohol Analysis",
      desc: "Voice-based spectral analysis to detect slurring and potential impairment.",
      icon: Mic,
      image: feat4,
    },
    {
      title: "Rash Driving Detection",
      desc: "Accelerometer data fusion to identify harsh braking, drifting, and over-speeding.",
      icon: Gauge,
      image: feat5,
    },
    {
      title: "Driver Behaviour Analysis",
      desc: "Long-term scoring of driving patterns to improve fleet safety and reduce insurance.",
      icon: TrendingUp,
      image: feat6,
    },
  ];

  return (
    <div>
   

     

      {/* --- NEW SECTION: AI Safety Modules --- */}
      <Section title="AI Safety Modules" subtitle="Next-generation sensor fusion and computer vision capabilities." className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiFeatures.map((feature, index) => (
            <MotionInView key={index} delay={index * 0.1}>
              <div className="rounded-2xl border border-white/8 bg-bg-subtle overflow-hidden shadow-md transition-transform hover:scale-[1.01]">
                {feature.image && (
                  <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </MotionInView>
          ))}
        </div>
      </Section>
      {/* -------------------------------------- */}

      <Section title="Dashboard Utilities" subtitle="Capabilities included in the prototype interface." className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { title: 'Live Camera', icon: Car, desc: 'Simulated camera feed preview with responsive UI.' },
            { title: 'Risk Meter', icon: Activity, desc: 'Animated risk visualization for detection confidence.' },
            { title: 'Event Logging', icon: ShieldAlert, desc: 'Server-side events with filters and CSV export.' },
          ].map((item, index) => (
            <MotionInView key={index} delay={index * 0.1}>
              <div className="p-4 rounded-xl bg-bg-subtle border border-white/10 shadow-soft transition-transform h-full flex flex-col min-h-[100px]">
                <div className="flex items-center gap-2 mb-1">
                  <item.icon size={18} className="text-(--primary-blue)" />
                  <h3 className="text-(--primary-blue) font-medium text-sm">{item.title}</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed grow">{item.desc}</p>
              </div>
            </MotionInView>
          ))}
        </div>
      </Section>

      <Section title="System Capabilities" subtitle="Advanced features powered by AI and IoT technology." className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Real-time Processing', icon: Zap, desc: 'Lightning-fast AI analysis with sub-second response times.' },
            { title: 'Cloud Integration', icon: Cloud, desc: 'Seamless data synchronization across all devices and platforms.' },
            { title: 'Advanced Analytics', icon: Activity, desc: 'Comprehensive reporting and insights for fleet management.' },
            { title: 'Multi-user Support', icon: Users, desc: 'Role-based access control for administrators and drivers.' },
            { title: 'Instant Alerts', icon: Bell, desc: 'Real-time notifications via email, SMS, and dashboard.' },
            { title: 'Secure Connectivity', icon: ShieldAlert, desc: 'Encrypted communication with end-to-end security.' },
            { title: 'Data Storage', icon: Database, desc: 'Scalable cloud storage with automatic backups.' },
            { title: 'System Configuration', icon: Settings, desc: 'Flexible settings for customization and fine-tuning.' },
          ].map((item, index) => (
            <MotionInView key={index} delay={index * 0.1}>
              <div className="p-6 rounded-xl bg-bg-subtle border border-white/10 shadow-soft transition-all hover:scale-[1.02] hover:border-(--primary-blue)/30 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-(--primary-blue)/10 border border-(--primary-blue)/20">
                    <item.icon size={24} className="text-(--primary-blue)" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed grow">{item.desc}</p>
              </div>
            </MotionInView>
          ))}
        </div>
      </Section>

      <Section className="py-4 md:py-6">
        <MotionInView>
          <img
            src={feat1}
            alt="Illustration of device connectivity and event flow"
            className="w-full h-auto rounded-xl border border-white/10 shadow-soft object-cover"
            loading="lazy"
          />
        </MotionInView>
      </Section>

      <Section title="Plans" subtitle="Illustrative pricing for demo purposes only." className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PricingCard
            title="Starter"
            price="Free"
            features={[ 'Dashboard', 'Devices & Events', 'Basic Alerts' ]}
            cta="Get Started"
          />
          <PricingCard
            title="Pro"
            price="₹500/mo"
            features={[ 'Everything in Starter', 'Email Alerts', 'Advanced Filters' ]}
            cta="Upgrade"
          />
          <PricingCard
            title="Enterprise"
            price="Contact Us"
            features={[ 'SLA', 'Custom Integrations', 'Priority Support' ]}
            cta="Contact Sales"
          />
        </div>
      </Section>
    </div>
  );
};

export default Services;