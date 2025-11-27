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
  Package,     // For Firmware/Software updates
} from 'lucide-react';
import feat4 from '../assets/images/audio.png';
import feat3 from '../assets/images/distractionsmoking.png';
import feat6 from '../assets/images/rash.png';
import feat5 from '../assets/images/driveranallysis.png';
import feat1 from '../assets/images/facedetection.png';
import feat2 from '../assets/images/drowsiness.png';
import homeHero from '../assets/images/homeimage.png';
import truckimage from '../assets/images/truckimage.png';

const PricingCard = ({ title, price, features = [], cta }) => (
  <div className="bg-bg-subtle rounded-xl border border-(--glass-border) shadow-soft p-5 hover:border-(--primary-blue)/30 transition-colors duration-300">
    <div className="text-sm font-semibold text-(--primary-blue) mb-2">{title}</div>
    <div className="text-3xl font-bold text-primary mb-3">{price}</div>
    <ul className="text-xs text-gray-300 space-y-1 mb-4 list-disc pl-4">
      {features.map((f) => (<li key={f}>{f}</li>))}
    </ul>
    <button className="px-4 py-2 rounded-lg bg-(--success-green) text-primary text-sm w-full font-medium hover:bg-(--success-green)/90 transition-colors">{cta}</button>
  </div>
);

const Services = () => {

  return (
    <div>

      <div className="max-w-6xl mt-20 mx-auto p-6 rounded-xl border border-white/10 shadow-soft bg-gradient-to-br from-(--primary-blue)/6 to-transparent mb-6">
        <div className="relative w-full h-56 sm:h-72 md:h-96 lg:h-[36rem] xl:h-[44rem] rounded-lg overflow-hidden bg-dark-bg">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${truckimage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
            aria-hidden="true"
          />
        </div>
      </div>



      <Section title="System Capabilities" subtitle="Advanced features powered by AI and IoT technology." className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Real-time Processing', icon: Zap, desc: 'Lightning-fast AI analysis with sub-second response times.' },
            { title: 'Cloud Integration', icon: Cloud, desc: 'Seamless data synchronization across all devices and platforms.' },
            { title: 'Advanced Analytics', icon: Activity, desc: 'Comprehensive reporting and insights for fleet management.' },
            { title: 'Multi-user Support', icon: Users, desc: 'Role-based access control for administrators and drivers.' },
            { title: 'Instant Alerts', icon: Bell, desc: 'Real-time notifications via SMS , calls and dashboard.' },
            { title: 'Secure Connectivity', icon: ShieldAlert, desc: 'Encrypted communication with end-to-end security.' },
            { title: 'Data Storage', icon: Database, desc: 'Scalable cloud storage with automatic backups.' },
            { title: 'System Configuration', icon: Settings, desc: 'Flexible settings for customization and fine-tuning.' },
            { title: 'Firmware and Software Updates', icon: Package, desc: 'Over-the-air updates for continuous improvement and security.' },
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


      <Section title="Plans" subtitle="Illustrative pricing for demo purposes only." className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PricingCard
            title="Starter"
            price="Free"
            features={['Dashboard', 'Devices & Events', 'Basic Alerts']}
            cta="Get Started"
          />
          <PricingCard
            title="Pro"
            price="₹500/mo"
            features={['Everything in Starter', 'Email Alerts', 'Advanced Filters']}
            cta="Upgrade"
          />
          <PricingCard
            title="Enterprise"
            price="Contact Us"
            features={['SLA', 'Custom Integrations', 'Priority Support']}
            cta="Contact Sales"
          />
        </div>
      </Section>
    </div>
  );
};

export default Services;