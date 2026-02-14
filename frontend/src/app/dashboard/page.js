export default function DashboardPage() {
  const stats = [
    { label: 'Total Campaigns', value: '12', icon: '🎯', color: 'from-blue-500' },
    { label: 'Total Testimonials', value: '48', icon: '🎥', color: 'from-purple-500' },
    { label: 'Processed Videos', value: '48', icon: '✅', color: 'from-emerald-500' },
  ];

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Welcome back, Sarah!</h1>
        <p className="text-slate-400">Here's what's happening with your testimonials today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-slate-100">{stat.value}</p>
              </div>
              <div className={`text-3xl bg-gradient-to-br ${stat.color} to-transparent opacity-20 rounded-lg p-3 text-center min-w-16`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Recent Campaigns</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg hover:bg-slate-800/50 transition">
                <div>
                  <p className="text-slate-100 font-medium">
                    {['Product Launch Feedback', 'Customer Success Stories', 'Case Study Video'][item - 1]}
                  </p>
                  <p className="text-slate-500 text-sm">{item * 4} testimonials collected</p>
                </div>
                <div className="text-slate-400">
                  {['April 10, 2024', 'April 8, 2024', 'April 5, 2024'][item - 1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Activity Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Processing</span>
                <span className="text-slate-100 font-bold">8</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Completed</span>
                <span className="text-slate-100 font-bold">40</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm">Failed</span>
                <span className="text-slate-100 font-bold">0</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-rose-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mt-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-100 mb-2">Ready to Collect More Testimonials?</h3>
        <p className="text-slate-400 mb-6">Create a new campaign and start gathering video testimonials from your customers.</p>
        <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition duration-300 cursor-pointer">
          Create New Campaign
        </button>
      </div>
    </div>
  );
}
