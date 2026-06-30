import { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, Minus, Eye, Trash2, Filter, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Surveys = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'completed',
    agent: '',
    department: '',
    startDate: '',
    endDate: '',
    minRating: '',
    maxRating: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchSurveys();
    fetchAnalytics();
  }, [filters]);

  const fetchSurveys = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`${API_URL}/surveys?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.agent) params.append('agent', filters.agent);
      if (filters.department) params.append('department', filters.department);

      const response = await axios.get(`${API_URL}/surveys/analytics?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleViewDetails = (survey) => {
    setSelectedSurvey(survey);
    setShowDetailModal(true);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const getNPSBadge = (category) => {
    const badges = {
      promoter: 'bg-green-100 text-green-800',
      passive: 'bg-yellow-100 text-yellow-800',
      detractor: 'bg-red-100 text-red-800',
    };
    return badges[category] || 'bg-gray-100 text-gray-800';
  };

  const getNPSIcon = (category) => {
    if (category === 'promoter') return <TrendingUp size={16} />;
    if (category === 'detractor') return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Encuestas de satisfaccion del cliente</h1>
          <p className="text-gray-600 mt-1">Seguimiento y analisis de la opinion del cliente</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total de encuestas</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalSurveys}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Calificacion promedio</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">
                {analytics.averageRatings?.overall?.toFixed(1) || '0.0'}
              </p>
              {renderStars(Math.round(analytics.averageRatings?.overall || 0))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Puntaje NPS</h3>
            </div>
            <p
              className={`text-3xl font-bold ${
                (analytics.nps?.score || 0) >= 50
                  ? 'text-green-600'
                  : (analytics.nps?.score || 0) >= 0
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {analytics.nps?.score || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.nps?.promoters || 0} promotores, {analytics.nps?.detractors || 0} detractores
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Calificaciones de 5 estrellas</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{analytics.ratingDistribution?.[5] || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.totalSurveys > 0
                ? Math.round(((analytics.ratingDistribution?.[5] || 0) / analytics.totalSurveys) * 100)
                : 0}
              % del total
            </p>
          </div>
        </div>
      )}

      {}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="completed">Completado</option>
                <option value="pending">Pendiente</option>
                <option value="expired">Expirado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitud
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificacion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {surveys.map((survey) => (
                <tr key={survey._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{survey.ticket?.ticketNumber}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {survey.ticket?.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{survey.customer?.name}</div>
                    <div className="text-sm text-gray-500">{survey.customer?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{survey.agent?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">{survey.ratings.overall}</span>
                      {renderStars(survey.ratings.overall)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {survey.npsCategory ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getNPSBadge(
                          survey.npsCategory
                        )}`}
                      >
                        {getNPSIcon(survey.npsCategory)}
                        {survey.npsCategory}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {survey.completedAt
                      ? new Date(survey.completedAt).toLocaleDateString()
                      : 'Pendiente'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewDetails(survey)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {surveys.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron encuestas</p>
          </div>
        )}
      </div>

      {}
      {showDetailModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">Detalles de la encuesta</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {}
                <div>
                  <h3 className="font-semibold mb-2">Informacion de la solicitud</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Solicitud:</span> #
                      {selectedSurvey.ticket?.ticketNumber}
                    </p>
                    <p>
                      <span className="font-medium">Cliente:</span> {selectedSurvey.customer?.name}
                    </p>
                    <p>
                      <span className="font-medium">Agente:</span> {selectedSurvey.agent?.name}
                    </p>
                  </div>
                </div>

                {}
                <div>
                  <h3 className="font-semibold mb-2">Calificaciones</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">General:</span>
                      <div className="flex items-center gap-2">
                        {renderStars(selectedSurvey.ratings.overall)}
                        <span className="font-semibold">{selectedSurvey.ratings.overall}/5</span>
                      </div>
                    </div>
                    {selectedSurvey.ratings.responseTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tiempo de respuesta:</span>
                        <div className="flex items-center gap-2">
                          {renderStars(selectedSurvey.ratings.responseTime)}
                          <span className="font-semibold">
                            {selectedSurvey.ratings.responseTime}/5
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedSurvey.ratings.professionalism && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Profesionalismo:</span>
                        <div className="flex items-center gap-2">
                          {renderStars(selectedSurvey.ratings.professionalism)}
                          <span className="font-semibold">
                            {selectedSurvey.ratings.professionalism}/5
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {}
                {selectedSurvey.npsScore !== undefined && (
                  <div>         <h3 className="font-semibold mb-2">Net Promoter Score</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{selectedSurvey.npsScore}/10</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getNPSBadge(
                          selectedSurvey.npsCategory
                        )}`}
                      >
                        {selectedSurvey.npsCategory}
                      </span>
                    </div>
                  </div>
                )}

                {}
                {(selectedSurvey.feedback?.positive ||
                  selectedSurvey.feedback?.improvement ||
                  selectedSurvey.feedback?.general) && (
                  <div>
                    <h3 className="font-semibold mb-2">Comentarios</h3>
                    <div className="space-y-3">
                      {selectedSurvey.feedback.positive && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-800 mb-1">
                            Lo que hicimos bien:
                          </p>
                          <p className="text-sm text-green-700">{selectedSurvey.feedback.positive}</p>
                        </div>
                      )}
                      {selectedSurvey.feedback.improvement && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-yellow-800 mb-1">
                            Areas de mejora:
                          </p>
                          <p className="text-sm text-yellow-700">
                            {selectedSurvey.feedback.improvement}
                          </p>
                        </div>
                      )}
                      {selectedSurvey.feedback.general && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Comentarios adicionales:
                          </p>
                          <p className="text-sm text-blue-700">{selectedSurvey.feedback.general}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Surveys