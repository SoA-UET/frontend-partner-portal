const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-main">Dashboard</h1>
        <p className="text-meta mt-1">
          Welcome back! Here's an overview of your partner portal.
        </p>
      </div>

      {/* Stats Grid - 12 Column System */}
      <div className="dashboard-grid">
        {/* Stat Card 1 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-meta">Total Consultations</p>
                <p className="text-2xl font-bold text-text-main mt-2">1,234</p>
                <p className="text-xs text-status-success mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-button flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-meta">Active Customers</p>
                <p className="text-2xl font-bold text-text-main mt-2">567</p>
                <p className="text-xs text-status-success mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-button flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-meta">Knowledge Articles</p>
                <p className="text-2xl font-bold text-text-main mt-2">89</p>
                <p className="text-xs text-status-warning mt-1">3 pending review</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-button flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-meta">Avg Response Time</p>
                <p className="text-2xl font-bold text-text-main mt-2">2.3m</p>
                <p className="text-xs text-status-success mt-1">-15% faster</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-button flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Area - Full Width */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card">
            <h3 className="font-semibold text-text-main mb-4">Consultation Trends</h3>
            <div className="h-64 bg-gray-50 rounded-button flex items-center justify-center">
              <p className="text-text-muted">Chart will be rendered here with Recharts</p>
            </div>
          </div>
        </div>

        {/* Recent Activity - Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <div className="card">
            <h3 className="font-semibold text-text-main mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-text-main">New consultation started</p>
                    <p className="text-xs text-text-muted mt-1">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
