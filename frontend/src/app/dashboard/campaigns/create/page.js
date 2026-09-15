'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import campaignService from '@/lib/campaignService';
import DynamicListInput from '@/components/DynamicListInput';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    campaignName: '',
    productDescription: '',
    companyName: '',
    productName: '',
    feedbackType: 'General Feedback',
    companyLogo: null,
  });
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [manualQuestions, setManualQuestions] = useState([]);
  const [questionSetId, setQuestionSetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);
  const [error, setError] = useState('');
  const [emails, setEmails] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, companyLogo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!formData.productDescription.trim()) {
      setError('Please enter a product description first');
      return;
    }

    setGeneratingQuestions(true);
    setError('');

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/campaigns/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName || 'Our Company',
          productName: formData.productName || formData.campaignName || 'Our Product',
          feedbackType: formData.feedbackType || 'General Feedback',
          campaignName: formData.campaignName || 'Customer Feedback',
          productDescription: formData.productDescription,
          questionCount: 5,
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.questions) {
          setGeneratedQuestions(data.data.questions);
          setQuestionSetId(data.data.id || null);
          return;
        }
      }

      // Safe fallback questions
      const defaultQuestions = [
        "What specific challenge made you search for our solution?",
        "How has our product changed your daily workflow?",
        "What quantifiable results or time savings have you achieved?",
        "What would you tell someone who is considering this solution?",
        "Would you recommend this product to a colleague? Why?"
      ];
      setGeneratedQuestions(defaultQuestions);
    } catch (err) {
      console.warn('Backend question generation warning, using fallback:', err.message);
      const defaultQuestions = [
        "What specific challenge made you search for our solution?",
        "How has our product changed your daily workflow?",
        "What quantifiable results or time savings have you achieved?",
        "What would you tell someone who is considering this solution?",
        "Would you recommend this product to a colleague? Why?"
      ];
      setGeneratedQuestions(defaultQuestions);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!formData.campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    if (!generatedQuestions || generatedQuestions.length === 0) {
      setError('Please generate or add questions for this campaign');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const campaignPayload = {
        name: formData.campaignName,
        description: formData.productDescription,
        questions: manualQuestions.length > 0 ? manualQuestions : generatedQuestions,
        productName: formData.productName || formData.campaignName,
        feedbackType: formData.feedbackType,
        companyName: formData.companyName,
        companyLogo: formData.companyLogo,
      };

      console.log('📤 Creating campaign with payload:', campaignPayload);
      const campaign = await campaignService.createCampaign(campaignPayload);
      console.log('✅ Campaign created:', campaign);
      console.log('📌 Campaign ID:', campaign._id);
      setCreatedCampaign(campaign);
    } catch (err) {
      setError(err.message || 'Failed to create campaign. Please try again.');
      console.error('Campaign creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!createdCampaign || !createdCampaign._id) {
      console.error('❌ Missing campaign ID:', createdCampaign);
      setError('Campaign data missing. Please try creating again.');
      return;
    }
    const publicLink = `${window.location.origin}/record/${createdCampaign._id}`;
    console.log('🔗 Recording link:', publicLink);
    navigator.clipboard.writeText(publicLink);
    alert('Public link copied to clipboard!');
  };

  const handleSendEmails = async () => {
    if (!emails.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    setEmailLoading(true);
    setError('');

    try {
      const emailList = emails
        .split(/[,\n]+/)
        .map(e => e.trim())
        .filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

      if (emailList.length === 0) {
        setError('Please enter valid email addresses');
        setEmailLoading(false);
        return;
      }

      const publicLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/record/${createdCampaign._id}`;

      // Call the email API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: emailList,
          campaignName: createdCampaign.name,
          campaignLink: publicLink,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send emails');
      }

      const data = await response.json();

      setEmailSuccess(true);
      setEmails('');
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to send emails. Please try again.');
      console.error('Email error:', err);
    } finally {
      setEmailLoading(false);
    }
  };

  if (createdCampaign) {
    return (
      <div className="p-6 md:p-10 relative">
        {/* Ambient Glow Refraction Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <div className="mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-emerald-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Ready for Video Ingestion
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 font-heading tracking-tight">Campaign Created Successfully! 🎉</h1>
          <p className="text-white/60">Your campaign is ready to collect testimonials</p>
        </div>

        {/* Success Card */}
        <div className="max-w-4xl space-y-8 relative z-10">
          {/* Campaign Active Alert */}
          <div className="glass-morphism border-emerald-500/30 rounded-2xl p-6 bg-emerald-500/10 shadow-lg shadow-emerald-500/5">
            <p className="text-emerald-400 font-semibold mb-1 flex items-center gap-2">
              <span className="text-lg">✅</span> Campaign Active & Ready
            </p>
            <p className="text-white/70 text-sm">Your campaign is live. Customers can record testimonials immediately.</p>
          </div>

          {/* Campaign Details */}
          <div className="glass-morphism p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full animate-glow-pulse"></span>
              Campaign Details
            </h2>

            <div>
              <p className="text-white/50 text-sm mb-2">Campaign Name</p>
              <p className="text-white font-bold text-lg">{createdCampaign.name}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-2">Campaign ID</p>
              <p className="text-cyan-300 font-mono text-sm glass-input px-4 py-2 rounded-xl inline-block border border-white/10">{createdCampaign._id}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-2">Public Recording Link</p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/record/${createdCampaign._id}`}
                  className="flex-1 px-4 py-2.5 glass-input text-white/90 rounded-xl text-sm border border-white/15 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-2.5 glass-btn-primary text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-2">Generated Questions ({createdCampaign.questions.length})</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {createdCampaign.questions.map((q, idx) => (
                  <p key={idx} className="text-white/80 text-sm flex items-start gap-3 p-3 glass-pill rounded-xl">
                    <span className="text-cyan-400 font-bold flex-shrink-0">{idx + 1}.</span>
                    <span>{q}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Email Distribution Section */}
          <div className="glass-morphism p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></span>
              📧 Distribute via Email
            </h2>
            <p className="text-white/60 text-sm">Send the campaign link directly to participants via email</p>

            {/* Email Success Alert */}
            {emailSuccess && (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
                <p className="text-emerald-400 text-sm font-semibold">✅ Emails sent successfully!</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-3">
                Email Addresses (comma or line separated)
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="john@example.com, sarah@example.com&#10;or paste multiple emails (one per line)"
                rows="4"
                className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-white/30 focus:outline-none transition resize-none"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendEmails}
              disabled={emailLoading || !emails.trim()}
              className="w-full px-6 py-3.5 glass-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition cursor-pointer"
            >
              {emailLoading ? '📧 Sending Emails...' : '📧 Send Links via Email'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/campaigns" className="cursor-pointer">
              <button className="w-full px-6 py-3.5 glass-btn text-white rounded-xl font-bold transition cursor-pointer">
                ← Back to Campaigns
              </button>
            </Link>
            <button
              onClick={() => window.open(`/record/${createdCampaign._id}`, '_blank')}
              className="w-full px-6 py-3.5 glass-btn-primary text-white rounded-xl font-bold transition cursor-pointer"
            >
              🎥 Test Recording Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 relative">
      {/* Ambient Glow Refraction Orbs */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Header with Gradient Text */}
      <div className="mb-10 flex items-center justify-between relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-cyan-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Campaign Architect
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 font-heading tracking-tight">
            Create Campaign
          </h1>
          <p className="text-white/60">Set up a high-converting testimonial collection campaign</p>
        </div>
        <Link href="/dashboard/campaigns" className="cursor-pointer">
          <button className="px-5 py-2.5 glass-btn text-white rounded-xl font-medium transition cursor-pointer">
            ← Back
          </button>
        </Link>
      </div>

      {/* Create Form Card */}
      <div className="max-w-3xl relative z-10">
        <div className="glass-morphism p-8 md:p-10 rounded-2xl space-y-8 shadow-2xl">
          {/* Campaign Info Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full animate-glow-pulse"></span>
              Campaign Information
            </h2>

            {/* Company Logo */}
            <div className="mb-6">
              <label htmlFor="companyLogo" className="block text-sm font-semibold text-white/80 mb-3">
                Company Logo (Optional)
              </label>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <input
                    id="companyLogo"
                    name="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-white/30 focus:outline-none transition cursor-pointer"
                  />
                </div>
                {formData.companyLogo && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 glass-morphism p-1">
                    <img
                      src={formData.companyLogo}
                      alt="Company Logo Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>
              <p className="text-white/40 text-xs mt-2">Upload a PNG, JPG or GIF (max 2MB)</p>
            </div>

            {/* Company Name */}
            <div className="mb-6">
              <label htmlFor="companyName" className="block text-sm font-semibold text-white/80 mb-3">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g., Apple Inc"
                className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-white/30 focus:outline-none transition"
              />
            </div>

            {/* Product Name */}
            <div className="mb-6">
              <label htmlFor="productName" className="block text-sm font-semibold text-white/80 mb-3">
                Product Name
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="e.g., iPhone 15 Pro"
                className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-white/30 focus:outline-none transition"
              />
            </div>

            {/* Feedback Type */}
            <div className="mb-6">
              <label htmlFor="feedbackType" className="block text-sm font-semibold text-white/80 mb-3">
                Feedback Type / Category
              </label>
              <select
                id="feedbackType"
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 glass-input rounded-xl text-white focus:outline-none transition cursor-pointer"
              >
                <option value="General Feedback" className="bg-slate-900 text-white">General Feedback</option>
                <option value="Product Review" className="bg-slate-900 text-white">Product Review</option>
                <option value="Feature Request" className="bg-slate-900 text-white">Feature Request</option>
                <option value="Customer Story" className="bg-slate-900 text-white">Customer Story</option>
                <option value="Case Study" className="bg-slate-900 text-white">Case Study</option>
                <option value="User Experience" className="bg-slate-900 text-white">User Experience</option>
                <option value="Implementation Feedback" className="bg-slate-900 text-white">Implementation Feedback</option>
              </select>
            </div>

            {/* Campaign Name */}
            <div className="mb-6">
              <label htmlFor="campaignName" className="block text-sm font-semibold text-white/80 mb-3">
                Campaign Name *
              </label>
              <input
                id="campaignName"
                name="campaignName"
                type="text"
                value={formData.campaignName}
                onChange={handleInputChange}
                placeholder="e.g., Product Launch Feedback"
                className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-white/30 focus:outline-none transition"
              />
            </div>

            {/* Product Description */}
            <div>
              <label htmlFor="productDescription" className="block text-sm font-semibold text-white/80 mb-3">
                Product Description *
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleInputChange}
                placeholder="Describe your product in detail so we can generate relevant questions..."
                rows="4"
                className="w-full px-4 py-3 glass-input rounded-xl text-white placeholder-white/30 focus:outline-none transition resize-none"
              ></textarea>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

          {/* Error Message */}
          {error && (
            <div className="p-4 glass-morphism border-red-500/40 bg-red-500/10 rounded-xl">
              <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Questions Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></span>
              AI Questions Generator
            </h2>
            <p className="text-white/60 text-sm mb-4">
              Instantly craft targeted interview prompts calibrated for 30s-60s video reels.
            </p>

            {/* Generate Questions Button */}
            <button
              onClick={handleGenerateQuestions}
              disabled={generatingQuestions || !formData.productDescription.trim()}
              className="w-full px-6 py-3.5 glass-btn text-white rounded-xl font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400/50"
            >
              {generatingQuestions ? (
                <span className="inline-flex items-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Generating AI Prompts...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <span>✨</span>
                  Generate 5 AI Questions
                </span>
              )}
            </button>

            {/* Generated Questions Preview */}
            {generatedQuestions.length > 0 && (
              <div className="mt-6 p-6 glass-morphism rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                <p className="text-cyan-300 font-semibold mb-4 flex items-center gap-2 text-sm">
                  <span>📋</span>
                  Generated AI Questions ({generatedQuestions.length})
                </p>
                <div className="space-y-2.5">
                  {generatedQuestions.map((question, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 glass-pill rounded-xl">
                      <span className="text-cyan-400 font-bold text-xs flex-shrink-0 mt-0.5">{idx + 1}.</span>
                      <span className="text-white/80 text-sm">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

          {/* Manual Questions Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></span>
              Custom Questions
            </h2>
            <p className="text-white/60 text-sm mb-4">
              Add your own custom questions if you want full manual control over the prompts.
            </p>
            <DynamicListInput
              label="Custom Questions"
              items={manualQuestions}
              onItemsChange={setManualQuestions}
              placeholder="Type a question and press Enter"
              maxItems={12}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

          {/* Create Campaign Button */}
          <button
            onClick={handleCreateCampaign}
            disabled={loading || !formData.campaignName.trim()}
            className="w-full px-6 py-4 glass-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition cursor-pointer text-lg tracking-wide"
          >
            {loading ? '⏳ Creating Campaign...' : '🚀 Launch Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}
