import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, Settings, BarChart3, Plus, Edit, Trash2, 
  TrendingUp, LogOut, Search, Filter, Eye 
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
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
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
      <div className="ml-64 p-8">
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{activeClients.length}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
              <p className="text-3xl font-bold text-gray-900">R$ {totalRevenue.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plano Premium</p>
              <p className="text-3xl font-bold text-gray-900">
                {clients.filter(c => c.plan === 'premium').length}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
              <p className="text-3xl font-bold text-gray-900">85%</p>
            </div>
            <BarChart3 className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Clientes Recentes</h2>
        </div>
        <div className="divide-y">
          {clients.slice(0, 5).map(client => (
            <div key={client.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 capitalize">{client.plan}</p>
                <p className="text-sm text-gray-500">{client.createdAt}</p>
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Clientes</h1>
        <button
          onClick={() => setShowAddClient(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Adicionar Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
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
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Plataforma
            </label>
            <input
              type="text"
              defaultValue="LaysSinais"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Suporte
            </label>
            <input
              type="email"
              defaultValue="suporte@laysinais.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Adicionar Novo Cliente</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plano</label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value as Client['plan'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="básico">Básico</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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