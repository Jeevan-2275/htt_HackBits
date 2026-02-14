export default function DashboardPage() {
  const stats = [
    { label: 'Total Campaigns', value: '12', icon: '🎯', color: 'from-blue-500' },
    { label: 'Total Testimonials', value: '48', icon: '🎥', color: 'from-purple-500' },
    { label: 'Processed Videos', value: '48', icon: '✅', color: 'from-emerald-500' },
  ];

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-indigo-900/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-100 mb-2 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Welcome back, Sarah!
          </h1>
          <p className="text-slate-400 text-lg">Here's what's happening with your testimonials today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl transition-all duration-300"
            >
              {/* Gradient Border Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative bg-slate-900/60 backdrop-blur-md border border-white/10/50 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-slate-100">{stat.value}</p>
                  </div>
                  <div className={`text-3xl bg-gradient-to-br ${stat.color} to-transparent p-3 rounded-lg min-w-16 text-center shadow-lg shadow-purple-500/10`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Campaigns */}
          <div className="group bg-slate-900/60 backdrop-blur-md border border-white/10/50 rounded-xl p-6 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition duration-300">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Recent Campaigns</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition duration-300 border border-white/10/30 hover:border-slate-700/50">
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
        <div className="group bg-slate-900/60 backdrop-blur-md border border-white/10/50 rounded-xl p-6 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition duration-300">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Activity Overview</h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium">Processing</span>
                <span className="text-slate-100 font-bold">8</span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 h-2.5 rounded-full shadow-lg shadow-yellow-500/30" style={{ width: '33%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium">Completed</span>
                <span className="text-slate-100 font-bold">40</span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full shadow-lg shadow-emerald-500/30" style={{ width: '83%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium">Failed</span>
                <span className="text-slate-100 font-bold">0</span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-rose-600 h-2.5 rounded-full shadow-lg shadow-red-500/30" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Quick Action */}
        <div className="mt-10 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-100 mb-2">Ready to Collect More Testimonials?</h3>
          <p className="text-slate-400 mb-6">Create a new campaign and start gathering video testimonials from your customers.</p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2 mx-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
