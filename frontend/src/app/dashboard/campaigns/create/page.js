'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import campaignService from '@/lib/campaignService';
import { generateAIQuestions } from '@/lib/mockApi';
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
      const result = await generateAIQuestions({
        companyName: formData.companyName,
        productName: formData.productName || formData.campaignName,
        feedbackType: formData.feedbackType,
        campaignName: formData.campaignName,
        productDescription: formData.productDescription,
        questionCount: 10,
      });
      setGeneratedQuestions(result.questions || []);
      setQuestionSetId(result.id || null);
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
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
      <div className="p-6 md:p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Campaign Created Successfully! 🎉</h1>
          <p className="text-white/60">Your campaign is ready to collect testimonials</p>
        </div>

        {/* Success Card */}
        <div className="max-w-4xl space-y-8">
          {/* Campaign Active Alert */}
          <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-6">
            <p className="text-emerald-400 font-semibold mb-2">✅ Campaign Active</p>
            <p className="text-white/70 text-sm">Your campaign is now live and ready to collect testimonials.</p>
          </div>

          {/* Campaign Details */}
          <div className="glass p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></span>
              Campaign Details
            </h2>

            <div>
              <p className="text-white/50 text-sm mb-2">Campaign Name</p>
              <p className="text-white font-bold text-lg">{createdCampaign.name}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-2">Campaign ID</p>
              <p className="text-white/80 font-mono text-sm bg-white/5 px-4 py-2 rounded border border-white/10">{createdCampaign._id}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-2">Public Recording Link</p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/record/${createdCampaign._id}`}
                  className="flex-1 px-4 py-2 bg-white/5 text-white/80 rounded-lg text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white rounded-lg font-bold transition cursor-pointer hover:scale-105"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-2">Generated Questions ({createdCampaign.questions.length})</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {createdCampaign.questions.map((q, idx) => (
                  <p key={idx} className="text-white/70 text-sm flex items-start gap-3 p-2 bg-white/5 rounded border border-white/10">
                    <span className="text-blue-400 font-bold flex-shrink-0">{idx + 1}.</span>
                    <span>{q}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Email Distribution Section */}
          <div className="glass p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></span>
              📧 Distribute via Email
            </h2>
            <p className="text-white/60">Send the campaign link directly to participants via email</p>

            {/* Email Success Alert */}
            {emailSuccess && (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-lg">
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendEmails}
              disabled={emailLoading || !emails.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition cursor-pointer hover:scale-105"
            >
              {emailLoading ? '📧 Sending Emails...' : '📧 Send Links via Email'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/campaigns" className="cursor-pointer">
              <button className="w-full px-6 py-3 glass text-white rounded-lg font-bold transition cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
                ← Back to Campaigns
              </button>
            </Link>
            <button
              onClick={() => window.open(`/record/${createdCampaign._id}`, '_blank')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white rounded-lg font-bold transition cursor-pointer hover:scale-105"
            >
              🎥 Test Recording Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header with Gradient Text */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">Create Campaign</h1>
          <p className="text-white/60">Set up a new testimonial collection campaign</p>
        </div>
        <Link href="/dashboard/campaigns" className="cursor-pointer">
          <button className="px-6 py-3 glass text-white rounded-lg font-medium transition cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
            ← Back
          </button>
        </Link>
      </div>

      {/* Create Form Card */}
      <div className="max-w-2xl">
        <div className="glass p-8 space-y-8">
          {/* Campaign Info Section */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></span>
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
                {formData.companyLogo && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={formData.companyLogo}
                      alt="Company Logo Preview"
                      className="w-full h-full object-contain bg-white/5"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              >
                <option value="General Feedback">General Feedback</option>
                <option value="Product Review">Product Review</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Customer Story">Customer Story</option>
                <option value="Case Study">Case Study</option>
                <option value="User Experience">User Experience</option>
                <option value="Implementation Feedback">Implementation Feedback</option>
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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
                rows="5"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
              ></textarea>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Questions Section */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></span>
              AI Questions
            </h2>

            {/* Generate Questions Button */}
            <button
              onClick={handleGenerateQuestions}
              disabled={generatingQuestions || !formData.productDescription.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition cursor-pointer hover:scale-105"
            >
              {generatingQuestions ? (
                <>
                  <span className="animate-spin inline-block">⚡</span>
                  {' '}Generating Questions...
                </>
              ) : (
                <>
                  <span>✨</span>
                  {' '}Generate AI Questions
                </>
              )}
            </button>

            {/* Generated Questions Preview */}
            {generatedQuestions.length > 0 && (
              <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-blue-300 font-semibold mb-4 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  Generated Questions ({generatedQuestions.length})
                </p>
                <div className="space-y-3">
                  {generatedQuestions.map((question, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition border border-white/10">
                      <span className="text-blue-400 font-bold text-sm flex-shrink-0 mt-0.5">{idx + 1}.</span>
                      <span className="text-white/80 text-sm">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>

          {/* Manual Questions Section */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></span>
              Manual Questions
            </h2>
            <p className="text-white/60 text-sm mb-4">
              Add your own questions. If you add any manual questions, they will be used instead of AI questions.
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
          <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>

          {/* Create Campaign Button */}
          <button
            onClick={handleCreateCampaign}
            disabled={loading || !formData.campaignName.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition cursor-pointer text-lg hover:scale-105"
          >
            {loading ? '⏳ Creating Campaign...' : '🚀 Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}
