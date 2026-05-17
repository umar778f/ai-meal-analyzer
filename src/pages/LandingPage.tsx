import { motion, Variants } from "motion/react";
import { Link } from "react-router-dom";
import { Camera, Zap, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
  };

  return (
    <div className="flex flex-col items-center pt-16 lg:pt-32 text-center">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        className="max-w-4xl max-w-2xl mx-auto space-y-8"
      >
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
          Instantly <span className="text-gradient">analyze your meals</span> with AI.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Snap a photo of your food and instantly get calories, macros, hydration tips, and a comprehensive health score. No more manual tracking.
        </motion.p>
        
        <motion.div variants={itemVariants} className="pt-8 sm:flex sm:justify-center">
          <Link
            to="/dashboard"
            className="group flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full font-bold uppercase tracking-widest text-sm text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 w-full sm:w-auto"
          >
            <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Upload Now</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
      >
        {[
          { title: "Instant Breakdown", desc: "Get accurate calories, protein, carbs, and fats in seconds." },
          { title: "Smart Alternatives", desc: "Receive AI-powered suggestions to make your meal healthier." },
          { title: "Personalized Score", desc: "Understand your meal's balance with an easy 1-10 health score." }
        ].map((feature, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left hover:border-emerald-400/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
