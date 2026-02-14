export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      customerName: 'Sarah Wilson',
      campaignName: 'Product Launch Feedback',
      status: 'completed',
      duration: '2:34',
      date: 'April 12, 2024',
    },
    {
      id: 2,
      customerName: 'John Chen',
      campaignName: 'Product Launch Feedback',
      status: 'processing',
      duration: '1:58',
      date: 'April 12, 2024',
    },
    {
      id: 3,
      customerName: 'Emily Rodriguez',
      campaignName: 'Customer Success Stories',
      status: 'completed',
      duration: '3:15',
      date: 'April 11, 2024',
    },
    {
      id: 4,
      customerName: 'Michael Park',
      campaignName: 'Case Study Video',
      status: 'processing',
      duration: '2:42',
      date: 'April 11, 2024',
    },
    {
      id: 5,
      customerName: 'Jessica Taylor',
      campaignName: 'Customer Success Stories',
      status: 'completed',
      duration: '2:18',
      date: 'April 10, 2024',
    },
    {
      id: 6,
      customerName: 'David Johnson',
      campaignName: 'Feature Testimonials',
      status: 'completed',
      duration: '2:05',
      date: 'April 10, 2024',
    },
  ];

  const getStatusColor = (status) => {
    if (status === 'completed') {
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
    return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? '✓' : '⟳';
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Testimonials</h1>
        <p className="text-slate-400">View and manage all collected testimonials</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by customer name..."
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <select className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
        </select>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left Section */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {testimonial.customerName.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-slate-100 font-bold text-lg">{testimonial.customerName}</h3>
                    <p className="text-slate-400 text-sm">{testimonial.campaignName}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Status Badge */}
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(testimonial.status)}`}>
                    {getStatusIcon(testimonial.status)} {testimonial.status === 'completed' ? 'Completed' : 'Processing'}
                  </span>

                  {/* Duration */}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                    🎬 {testimonial.duration}
                  </span>

                  {/* Date */}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
                    {testimonial.date}
                  </span>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-medium transition duration-300 whitespace-nowrap cursor-pointer">
                  Preview
                </button>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-medium transition duration-300 whitespace-nowrap cursor-pointer">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg hover:bg-slate-800 transition cursor-pointer">
          ← Previous
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-blue-500 text-white rounded-lg font-bold cursor-pointer">1</button>
          <button className="w-10 h-10 bg-slate-900 text-slate-100 rounded-lg hover:bg-slate-800 transition cursor-pointer">2</button>
          <button className="w-10 h-10 bg-slate-900 text-slate-100 rounded-lg hover:bg-slate-800 transition cursor-pointer">3</button>
        </div>
        <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg hover:bg-slate-800 transition cursor-pointer">
          Next →
        </button>
      </div>
    </div>
  );
}
