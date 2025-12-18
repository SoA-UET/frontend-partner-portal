import React, { useState, useEffect } from 'react';
import metricsService from '@/services/metricsService';
import {
  ConversationMetricsResponse,
  SatisfactionMetricsResponse,
  OffloadMetricsResponse,
  DateRange,
} from '@/types/metrics.types';
import MetricsCard from '@/components/Metrics/MetricsCard';
import {
  Users,
  MessageSquare,
  Phone,
  Star,
  TrendingUp,
  BarChart3,
  Download,
} from 'lucide-react';

const Metrics: React.FC = () => {
  const [conversationMetrics, setConversationMetrics] =
    useState<ConversationMetricsResponse | null>(null);
  const [satisfactionMetrics, setSatisfactionMetrics] =
    useState<SatisfactionMetricsResponse | null>(null);
  const [offloadMetrics, setOffloadMetrics] = useState<OffloadMetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from_date: '',
    to_date: '',
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async (params?: DateRange) => {
    try {
      setIsLoading(true);
      const data = await metricsService.getAllMetrics(params);
      setConversationMetrics(data.conversations);
      setSatisfactionMetrics(data.satisfaction);
      setOffloadMetrics(data.offload);
    } catch (error) {
      console.error('Error loading metrics:', error);
      alert('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    if (dateRange.from_date && dateRange.to_date) {
      loadMetrics(dateRange);
    } else {
      loadMetrics();
    }
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    // TODO: Implement export functionality
    alert(`Export ${format.toUpperCase()} sẽ được triển khai sau.`);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('vi-VN');
  };

  const formatPercentage = (num: number): string => {
    if (isNaN(num)) return '0.00%';
    if (isFinite(num) === false) return '0.00%';
    return num.toFixed(2) + '%';
  };

  const formatPercentageAuto = (numerator: number, denominator: number): string => {
    if (denominator === 0) return '0.00%';
    const percentage = (numerator / denominator) * 100;
    return formatPercentage(percentage);
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải thống kê...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê Partner</h1>
          <p className="mt-1 text-sm text-gray-500">
            TP-20: Xem các chỉ số hoạt động và hiệu suất của Partner
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <Download size={16} />
            Export Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              name="from_date"
              value={dateRange.from_date}
              onChange={handleDateRangeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              name="to_date"
              value={dateRange.to_date}
              onChange={handleDateRangeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleApplyFilter}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Xem
          </button>
        </div>
        {conversationMetrics && (
          <p className="mt-2 text-xs text-gray-500">
            Dữ liệu từ {formatDate(conversationMetrics.from_date)} đến{' '}
            {formatDate(conversationMetrics.to_date)}
          </p>
        )}
      </div>

      {/* Conversation Metrics */}
      {conversationMetrics && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thống kê cuộc hội thoại
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricsCard
              title="Tổng số cuộc hội thoại"
              value={formatNumber(conversationMetrics.total_conversations)}
              icon={Users}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <MetricsCard
              title="Cuộc hội thoại text"
              value={formatNumber(conversationMetrics.texting_conversations)}
              subtitle={`${formatPercentageAuto(conversationMetrics.texting_conversations, conversationMetrics.total_conversations)} tổng số`}
              icon={MessageSquare}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <MetricsCard
              title="Cuộc hội thoại audio"
              value={formatNumber(conversationMetrics.calling_conversations)}
              subtitle={`${formatPercentageAuto(conversationMetrics.calling_conversations, conversationMetrics.total_conversations)} tổng số`}
              icon={Phone}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
          </div>
        </div>
      )}

      {/* Satisfaction Metrics */}
      {satisfactionMetrics && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tỷ lệ hài lòng của khách hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricsCard
              title="Đánh giá trung bình"
              value={satisfactionMetrics.average_rating.toFixed(2)}
              subtitle={`${formatNumber(satisfactionMetrics.total_conversations)} đánh giá`}
              icon={Star}
              iconColor="text-yellow-600"
              iconBgColor="bg-yellow-100"
            />
            <MetricsCard
              title="Tỷ lệ hài lòng"
              value={
                formatPercentageAuto(
                  (
                    satisfactionMetrics.satisfaction_distribution.satisfaction_3 +
                    satisfactionMetrics.satisfaction_distribution.satisfaction_4 +
                    satisfactionMetrics.satisfaction_distribution.satisfaction_5
                  ),
                  satisfactionMetrics.total_conversations
                )
              }
              subtitle="≥ 3 sao"
              icon={TrendingUp}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
          </div>

          {/* Satisfaction Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Phân bổ đánh giá
            </h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count =
                  satisfactionMetrics.satisfaction_distribution[
                    `satisfaction_${star}` as keyof typeof satisfactionMetrics.satisfaction_distribution
                  ];

                  const percentage = formatPercentageAuto(count, satisfactionMetrics.total_conversations);
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="w-20 flex items-center gap-1 text-sm font-medium text-gray-700">
                      {star} <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-24 text-sm text-gray-600 text-right">
                      {formatNumber(count)} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Offload Metrics */}
      {offloadMetrics && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tỷ lệ giảm tải
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricsCard
              title="Tổng số cuộc hội thoại"
              value={formatNumber(offloadMetrics.total_conversations)}
              icon={BarChart3}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-100"
            />
            <MetricsCard
              title="AI xử lý thành công"
              value={formatNumber(offloadMetrics.offloaded_conversations)}
              subtitle={`Giảm tải ${formatPercentage(offloadMetrics.offload_rate_percentage)}`}
              icon={TrendingUp}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <MetricsCard
              title="Chuyển đến Partner"
              value={formatNumber(offloadMetrics.ai_failed_conversation)}
              subtitle={`${formatPercentageAuto(offloadMetrics.ai_failed_conversation, offloadMetrics.total_conversations)} tổng số`}
              icon={Users}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
          </div>

          {/* Offload Rate Visual */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Tỷ lệ giảm tải AI
            </h3>
            <div className="relative pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">AI xử lý</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercentage(offloadMetrics.offload_rate_percentage)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-full flex items-center justify-center text-white text-sm font-medium transition-all duration-500"
                  style={{ width: `${offloadMetrics.offload_rate_percentage}%` }}
                >
                  {offloadMetrics.offload_rate_percentage > 10 &&
                    `${offloadMetrics.offload_rate_percentage.toFixed(1)}%`}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {formatNumber(offloadMetrics.offloaded_conversations)} cuộc hội thoại
                </span>
                <span className="text-xs text-gray-500">
                  {formatNumber(offloadMetrics.ai_failed_conversation)} chuyển Partner
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
