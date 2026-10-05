import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import { api } from '../lib/api.ts';
import { SEOHead } from '../components/SEOHead.tsx';

export function ContactPage({ setCurrentTab }: { setCurrentTab: (tab: string, param?: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [subject, setSubject] = useState('Product Fitment Enquiry');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.submitContact({
        name,
        email,
        phone,
        vehicleReg,
        subject,
        message
      });
      setSubmittedRef(res.referenceId);
      setName('');
      setEmail('');
      setPhone('');
      setVehicleReg('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEOHead
        title="Contact Our UK Automotive Specialists | Custom Car Mats"
        description="Speak with our UK car mat team in Coventry. Freephone 0800 488 0244, email support@customcarmats.co.uk, or send an enquiry regarding vehicle templates and fixings."
        canonicalPath="/contact"
      />
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
          We&apos;re Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight">
          Contact Our UK Automotive Specialists
        </h1>
        <p className="text-sm text-gray-600">
          Have a question regarding floor fixing clips, rare classic car templates, or tracking an active order? Reach out below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#071A33]">Direct Communication</h3>

            <div className="space-y-3.5 text-xs text-gray-600">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 block text-xs">UK Freephone Telephone:</strong>
                  <a href="tel:08004880244" className="text-amber-600 hover:underline font-bold text-sm">
                    0800 488 0244
                  </a>
                  <p className="text-[11px] text-gray-500">Monday - Friday: 8:00 AM – 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 block text-xs">Customer Support Email:</strong>
                  <a href="mailto:support@customcarmats.co.uk" className="text-amber-600 hover:underline">
                    support@customcarmats.co.uk
                  </a>
                  <p className="text-[11px] text-gray-500">Average response time: Under 4 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 block text-xs">Manufacturing Workshop & Head Office:</strong>
                  <span>Unit 7, Apex Automotive Centre, Coventry, West Midlands, CV3 4GB, United Kingdom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Link */}
          <div className="bg-[#071A33] text-white p-6 rounded-2xl border border-amber-400/30 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Looking for instant answers?</h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Check our Frequently Asked Questions for clip diagrams & delivery info.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('faq')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#071A33] font-bold text-xs rounded-xl flex-shrink-0"
            >
              View FAQs
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
          {submittedRef ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#071A33]">Message Received!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you for contacting Custom Car Mats. Your enquiry reference is{' '}
                <strong className="text-amber-600 font-mono">{submittedRef}</strong>. A British automotive specialist will respond shortly.
              </p>
              <button
                onClick={() => setSubmittedRef(null)}
                className="mt-4 px-6 py-2 bg-[#071A33] text-white text-xs font-bold rounded-lg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-[#071A33]">Send Us a Message</h3>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. David Harrison"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. david@example.co.uk"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 07700 900123"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Registration (Optional)</label>
                  <input
                    type="text"
                    value={vehicleReg}
                    onChange={e => setVehicleReg(e.target.value.toUpperCase())}
                    placeholder="e.g. WP21 XKL"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="Product Fitment Enquiry">Product Fitment & Compatibility</option>
                  <option value="Existing Order Tracking">Existing Order Tracking / Dispatch</option>
                  <option value="Custom Embroidery Request">Bespoke Embroidery / Corporate Fleet</option>
                  <option value="Returns or Guarantee">Returns & Guarantee Claim</option>
                  <option value="General Question">General Customer Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can our UK team help you today?"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-[#071A33] hover:bg-amber-400 hover:text-[#071A33] text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Send Message to UK Support'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
