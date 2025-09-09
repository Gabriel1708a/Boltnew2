import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Settings, Palette, Type, Image, LogOut, TrendingUp,
  Save, Eye, RefreshCw, BarChart3, Users, Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ClientCustomizations {
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
  logo?: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  features: string[];
  testimonial: {
    text: string;
    author: string;
    position: string;
  };
}

const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [customizations, setCustomizations] = useState<ClientCustomizations>({
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    companyName: 'TradingPro Sinais',
    heroTitle: 'Sinais Profissionais de Trading',
    heroSubtitle: 'Maximize seus lucros com análises precisas e estratégias comprovadas',
    aboutText: 'Nossa plataforma oferece sinais de trading de alta qualidade, baseados em análises técnicas avançadas e inteligência artificial. Com mais de 85% de assertividade, ajudamos traders a maximizar seus resultados no mercado financeiro.',
    features: [
      'Sinais em tempo real',
      'Análise técnica avançada',
      'Suporte 24/7',
      'Taxa de acerto superior a 85%',
      'Gestão de risco profissional',
      'Comunidade VIP exclusiva'
    ],
    testimonial: {
      text: 'Os sinais da TradingPro transformaram minha forma de investir. Em 6 meses, consegui um retorno de mais de 200%.',
      author: 'Maria Silva',
      position: 'Investidora'
    }
  });

  const navigationItems = [
    { path: '/dashboard', label: 'Visão Geral', icon: TrendingUp },
    { path: '/dashboard/customize', label: 'Personalizar', icon: Palette },
    { path: '/dashboard/settings', label: 'Configurações', icon: Settings },
  ];

  const handleSave = () => {
    alert('Customizações salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center px-6 py-4 border-b">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Dashboard</span>
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
          <Route path="/" element={<ClientOverview user={user} customizations={customizations} />} />
          <Route 
            path="/customize" 
            element={
              <CustomizationPanel 
                customizations={customizations}
                setCustomizations={setCustomizations}
                onSave={handleSave}
              />
            } 
          />
          <Route path="/settings" element={<ClientSettings user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

const ClientOverview: React.FC<{ user: any; customizations: ClientCustomizations }> = ({ user, customizations }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Gerencie e personalize seu site de sinais</p>
        </div>
        <Link
          to={`/site/${user?.clientId}`}
          target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Eye className="h-4 w-4" />
          Ver Site
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visitantes Hoje</p>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
            </div>
            <Users className="h-12 w-12 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+12% vs ontem</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversões</p>
              <p className="text-3xl font-bold text-gray-900">89</p>
            </div>
            <Target className="h-12 w-12 text-blue-600" />
          </div>
          <p className="text-sm text-blue-600 mt-2">+5% vs ontem</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-gray-900">7.2%</p>
            </div>
            <BarChart3 className="h-12 w-12 text-purple-600" />
          </div>
          <p className="text-sm text-purple-600 mt-2">+2.1% vs ontem</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Configurações Atuais</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Nome da Empresa</h3>
              <p className="text-gray-600">{customizations.companyName}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cor Primária</h3>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border" 
                  style={{ backgroundColor: customizations.primaryColor }}
                ></div>
                <span className="text-gray-600">{customizations.primaryColor}</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Título Principal</h3>
              <p className="text-gray-600">{customizations.heroTitle}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cor Secundária</h3>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border" 
                  style={{ backgroundColor: customizations.secondaryColor }}
                ></div>
                <span className="text-gray-600">{customizations.secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomizationPanel: React.FC<{
  customizations: ClientCustomizations;
  setCustomizations: (customizations: ClientCustomizations) => void;
  onSave: () => void;
}> = ({ customizations, setCustomizations, onSave }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Personalizar Site</h1>
        <button
          onClick={onSave}
          className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Cores da Marca
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor Primária
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customizations.primaryColor}
                    onChange={(e) => setCustomizations({
                      ...customizations,
                      primaryColor: e.target.value
                    })}
                    className="w-12 h-12 rounded border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={customizations.primaryColor}
                    onChange={(e) => setCustomizations({
                      ...customizations,
                      primaryColor: e.target.value
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor Secundária
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customizations.secondaryColor}
                    onChange={(e) => setCustomizations({
                      ...customizations,
                      secondaryColor: e.target.value
                    })}
                    className="w-12 h-12 rounded border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={customizations.secondaryColor}
                    onChange={(e) => setCustomizations({
                      ...customizations,
                      secondaryColor: e.target.value
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Type className="h-5 w-5" />
              Conteúdo do Site
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  value={customizations.companyName}
                  onChange={(e) => setCustomizations({
                    ...customizations,
                    companyName: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Principal
                </label>
                <input
                  type="text"
                  value={customizations.heroTitle}
                  onChange={(e) => setCustomizations({
                    ...customizations,
                    heroTitle: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <textarea
                  value={customizations.heroSubtitle}
                  onChange={(e) => setCustomizations({
                    ...customizations,
                    heroSubtitle: e.target.value
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Pré-visualização
          </h2>
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div 
              className="rounded-lg p-6 text-white"
              style={{ 
                background: `linear-gradient(135deg, ${customizations.primaryColor}, ${customizations.secondaryColor})` 
              }}
            >
              <h3 className="text-2xl font-bold mb-2">{customizations.companyName}</h3>
              <h4 className="text-xl mb-2">{customizations.heroTitle}</h4>
              <p className="text-white/90">{customizations.heroSubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientSettings: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;