import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, Settings, BarChart3, Plus, Edit, Trash2, 
  TrendingUp, LogOut, Search, Filter, Eye, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  email: string;
  plan: 'básico' | 'pro' | 'premium';
  status: 'ativo' | 'inativo';
  createdAt: string;
  customizations: {
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
    logo?: string;
    heroTitle: string;
    heroSubtitle: string;
  };
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([
    {
      id: 'client-1',
      name: 'Cliente 1',
      email: 'cliente1@email.com',
      plan: 'pro',
      status: 'ativo',
      createdAt: '2024-01-15',
      customizations: {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        companyName: 'TradingPro Sinais',
        heroTitle: 'Sinais Profissionais de Trading',
        heroSubtitle: 'Maximize seus lucros com análises precisas'
      }
    },
    {
      id: 'client-2',
      name: 'Cliente 2',
      email: 'cliente2@email.com',
      plan: 'básico',
      status: 'ativo',
      createdAt: '2024-02-01',
      customizations: {
        primaryColor: '#7C3AED',
        secondaryColor: '#EF4444',
        companyName: 'InvestMax',
        heroTitle: 'Sinais de Investimento Inteligente',
        heroSubtitle: 'Sua jornada rumo ao sucesso financeiro'
      }
    }
  ]);

  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClient = (clientData: Partial<Client>) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: clientData.name!,
      email: clientData.email!,
      plan: clientData.plan!,
      status: 'ativo',
      createdAt: new Date().toISOString().split('T')[0],
      customizations: {
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        companyName: clientData.name!,
        heroTitle: 'Sinais de Trading Profissionais',
        heroSubtitle: 'Transforme seus investimentos com nossa expertise'
      }
    };
    setClients([...clients, newClient]);
    setShowAddClient(false);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigationItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/clients', label: 'Clientes', icon: Users },
    { path: '/admin/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-lg font-bold text-gray-900">Admin Panel</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="mt-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${
                      location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 w-full border-t p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:bg-white lg:shadow-lg">
        <div className="flex items-center px-6 py-4 border-b">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
        </div>
        
        <nav className="mt-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${
                  location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview clients={clients} />} />
            <Route 
              path="/clients" 
              element={
                <ClientsManagement 
                  clients={filteredClients}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  showAddClient={showAddClient}
                  setShowAddClient={setShowAddClient}
                  editingClient={editingClient}
                  setEditingClient={setEditingClient}
                  handleAddClient={handleAddClient}
                  handleDeleteClient={handleDeleteClient}
                />
              } 
            />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>

      {/* Modals */}
      {showAddClient && (
        <AddClientModal 
          onClose={() => setShowAddClient(false)}
          onSave={handleAddClient}
        />
      )}
    </div>
  );
};

const DashboardOverview: React.FC<{ clients: Client[] }> = ({ clients }) => {
  const activeClients = clients.filter(c => c.status === 'ativo');
  const totalRevenue = clients.reduce((sum, client) => {
    const prices = { básico: 97, pro: 197, premium: 397 };
    return sum + prices[client.plan];
  }, 0);

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{activeClients.length}</p>
            </div>
            <Users className="h-8 w-8 lg:h-12 lg:w-12 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Receita Mensal</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">R$ {totalRevenue.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 lg:h-12 lg:w-12 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Plano Premium</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                {clients.filter(c => c.plan === 'premium').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 lg:h-12 lg:w-12 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Taxa Conversão</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">85%</p>
            </div>
            <BarChart3 className="h-8 w-8 lg:h-12 lg:w-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 lg:px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Clientes Recentes</h2>
        </div>
        <div className="divide-y">
          {clients.slice(0, 5).map(client => (
            <div key={client.id} className="px-4 lg:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900 text-sm lg:text-base">{client.name}</p>
                <p className="text-xs lg:text-sm text-gray-500">{client.email}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs lg:text-sm font-medium text-gray-900 capitalize">{client.plan}</p>
                <p className="text-xs lg:text-sm text-gray-500">{client.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ClientsManagementProps {
  clients: Client[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showAddClient: boolean;
  setShowAddClient: (show: boolean) => void;
  editingClient: Client | null;
  setEditingClient: (client: Client | null) => void;
  handleAddClient: (client: Partial<Client>) => void;
  handleDeleteClient: (id: string) => void;
}

const ClientsManagement: React.FC<ClientsManagementProps> = ({
  clients,
  searchTerm,
  setSearchTerm,
  showAddClient,
  setShowAddClient,
  handleDeleteClient
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gerenciar Clientes</h1>
        <button
          onClick={() => setShowAddClient(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
          <Plus className="h-4 w-4" />
          Adicionar Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 lg:px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm lg:text-base">
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado em</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                      client.plan === 'pro' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {client.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/site/${client.id}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button className="text-gray-600 hover:text-gray-800 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {clients.map(client => (
            <div key={client.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm lg:text-base">{client.name}</p>
                  <p className="text-xs lg:text-sm text-gray-500">{client.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/site/${client.id}`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button className="text-gray-600 hover:text-gray-800 transition-colors p-1">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClient(client.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  client.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                  client.plan === 'pro' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {client.plan}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  client.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {client.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Configurações</h1>
      
      <div className="bg-white rounded-lg shadow p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Plataforma
            </label>
            <input
              type="text"
              defaultValue="LaysSinais"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Suporte
            </label>
            <input
              type="email"
              defaultValue="suporte@laysinais.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

const AddClientModal: React.FC<{
  onClose: () => void;
  onSave: (client: Partial<Client>) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: 'básico' as Client['plan']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Adicionar Novo Cliente</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plano</label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value as Client['plan'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            >
              <option value="básico">Básico</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;