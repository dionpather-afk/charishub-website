import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

interface FeedbackFormData {
  name: string;
  email: string;
  feedbackType: string;
  message: string;
}

interface Feedback {
  _id: string;
  name?: string;
  email?: string;
  feedbackType?: string;
  message?: string;
  submissionDate?: Date | string;
}

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FeedbackFormData>();

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const feedbackData: Feedback = {
        _id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        feedbackType: data.feedbackType,
        message: data.message,
        submissionDate: new Date(),
      };

      await BaseCrudService.create('feedback', feedbackData);
      
      setSubmitSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-royal-blue to-royal-blue/90 text-off-white py-16 md:py-24">
          <div className="max-w-[100rem] mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-5xl md:text-6xl mb-6">Share Your Feedback</h1>
              <p className="font-paragraph text-lg md:text-xl text-off-white/90 max-w-2xl">
                We value your thoughts, prayer requests, and suggestions. Share what's on your heart with our church community.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-slate-gray/10 p-8 md:p-12"
            >
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="font-paragraph text-green-800">
                    Thank you for your feedback! We appreciate you taking the time to share with us.
                  </p>
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="font-paragraph text-red-800">{submitError}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block font-paragraph font-semibold text-dark-slate mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 border border-slate-gray/20 rounded-lg font-paragraph text-dark-slate focus:outline-none focus:border-muted-gold focus:ring-1 focus:ring-muted-gold/30"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive font-paragraph">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block font-paragraph font-semibold text-dark-slate mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full px-4 py-3 border border-slate-gray/20 rounded-lg font-paragraph text-dark-slate focus:outline-none focus:border-muted-gold focus:ring-1 focus:ring-muted-gold/30"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive font-paragraph">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Feedback Type Field */}
                <div>
                  <label className="block font-paragraph font-semibold text-dark-slate mb-2">
                    Feedback Type *
                  </label>
                  <select
                    {...register('feedbackType', { required: 'Please select a feedback type' })}
                    className="w-full px-4 py-3 border border-slate-gray/20 rounded-lg font-paragraph text-dark-slate focus:outline-none focus:border-muted-gold focus:ring-1 focus:ring-muted-gold/30"
                  >
                    <option value="">Select a type...</option>
                    <option value="Prayer Request">Prayer Request</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="General Feedback">General Feedback</option>
                    <option value="Praise Report">Praise Report</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.feedbackType && (
                    <p className="mt-1 text-sm text-destructive font-paragraph">
                      {errors.feedbackType.message}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block font-paragraph font-semibold text-dark-slate mb-2">
                    Your Message *
                  </label>
                  <textarea
                    placeholder="Share your thoughts, prayer requests, or suggestions..."
                    rows={6}
                    {...register('message', { required: 'Message is required' })}
                    className="w-full px-4 py-3 border border-slate-gray/20 rounded-lg font-paragraph text-dark-slate focus:outline-none focus:border-muted-gold focus:ring-1 focus:ring-muted-gold/30 resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-destructive font-paragraph">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-royal-blue hover:bg-royal-blue/90 text-off-white font-paragraph font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoadingSpinner />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>

                <p className="text-sm text-slate-gray font-paragraph text-center">
                  * Required fields
                </p>
              </form>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-muted-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-muted-gold">✓</span>
                </div>
                <h3 className="font-heading text-lg text-royal-blue mb-2">Confidential</h3>
                <p className="font-paragraph text-slate-gray">
                  Your feedback is treated with care and confidentiality.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-muted-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-muted-gold">💬</span>
                </div>
                <h3 className="font-heading text-lg text-royal-blue mb-2">Valued</h3>
                <p className="font-paragraph text-slate-gray">
                  We genuinely value your input and suggestions for our church.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-muted-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-muted-gold">🙏</span>
                </div>
                <h3 className="font-heading text-lg text-royal-blue mb-2">Prayed For</h3>
                <p className="font-paragraph text-slate-gray">
                  Prayer requests are lifted up in our pastoral prayers.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
