export default function CampaignsPage() {
  const campaigns = [
    {
      id: 1,
      title: 'Product Launch Feedback',
      questions: 5,
      testimonials: 12,
      createdDate: 'April 10, 2024',
      status: 'active',
    },
    {
      id: 2,
      title: 'Customer Success Stories',
      questions: 4,
      testimonials: 18,
      createdDate: 'April 8, 2024',
      status: 'active',
    },
    {
      id: 3,
      title: 'Case Study Video',
      questions: 6,
      testimonials: 8,
      createdDate: 'April 5, 2024',
      status: 'draft',
    },
    {
      id: 4,
      title: 'Feature Testimonials',
      questions: 3,
      testimonials: 10,
      createdDate: 'April 1, 2024',
      status: 'active',
    },
  ];

  return (
    <div className="p-6 md:p-10">
      {/* Header with Create Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Campaigns</h1>
          <p className="text-slate-400">Manage and create testimonial campaigns</p>
        </div>
        <button className="mt-4 md:mt-0 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition duration-300 cursor-pointer">
          + Create Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition duration-300 flex flex-col"
          >
            {/* Campaign Title */}
            <h3 className="text-lg font-bold text-slate-100 mb-2">{campaign.title}</h3>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                }`}
              >
                {campaign.status === 'active' ? '● Active' : 'Draft'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
              <div className="bg-slate-950 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Questions</p>
                <p className="text-2xl font-bold text-slate-100">{campaign.questions}</p>
              </div>
              <div className="bg-slate-950 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">Testimonials</p>
                <p className="text-2xl font-bold text-slate-100">{campaign.testimonials}</p>
              </div>
            </div>

            {/* Date */}
            <p className="text-slate-500 text-sm mb-6">Created: {campaign.createdDate}</p>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium transition duration-300 cursor-pointer">
                Copy Link
              </button>
              <button className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-medium transition duration-300 cursor-pointer">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Alternative */}
      {campaigns.length === 0 && (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">📭</p>
          <h3 className="text-2xl font-bold text-slate-100 mb-2">No campaigns yet</h3>
          <p className="text-slate-400 mb-6">Create your first campaign to start collecting testimonials</p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition duration-300 cursor-pointer">
            Create Campaign
          </button>
        </div>
      )}
    </div>
  );
}
