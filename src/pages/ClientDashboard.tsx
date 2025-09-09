import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Settings, Palette, Image, LogOut, TrendingUp,
  Save, Eye, BarChart3, Users, Target, Menu, X, Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCustomization, CarouselImageData, PlatformLink } from '../contexts/CustomizationContext';

interface ClientCustomizations {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
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
  carouselImages: CarouselImageData[];
  platformLinks: PlatformLink[];
  whatsappLink: string;
  instagramLink: string;
}







const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const customizationContext = useCustomization();
  const { customizations, setCustomizations } = customizationContext;
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  console.log('ClientDashboard renderizado, user:', user, 'customizations:', customizations);
  console.log('PlatformLinks no dashboard:', customizations.platformLinks);
  console.log('backgroundColor no dashboard:', customizations.backgroundColor);
  console.log('whatsappLink no dashboard:', customizations.whatsappLink);
  console.log('instagramLink no dashboard:', customizations.instagramLink);










  // Monitorar mudanças no estado
  useEffect(() => {
    console.log('useEffect ClientDashboard - customizations mudaram:', customizations);
    console.log('useEffect ClientDashboard - platformLinks mudaram:', customizations.platformLinks);
    console.log('useEffect ClientDashboard - backgroundColor mudou:', customizations.backgroundColor);
    console.log('useEffect ClientDashboard - whatsappLink mudou:', customizations.whatsappLink);
    console.log('useEffect ClientDashboard - instagramLink mudou:', customizations.instagramLink);
  }, [customizations]);

  const navigationItems = [
    { path: '/dashboard', label: 'Visão Geral', icon: TrendingUp },
    { path: '/dashboard/customize', label: 'Personalizar', icon: Palette },
    { path: '/dashboard/settings', label: 'Configurações', icon: Settings },
  ];

  const handleSave = async () => {
    console.log('Botão Salvar clicado, customizações atuais:', customizations);
    
    if (user?.clientId) {
      try {
        // Salvar através do contexto (que agora usa o serviço global)
        await setCustomizations(customizations);
        console.log('Customizações salvas globalmente via contexto');
        
        alert('Customizações salvas com sucesso! As alterações estão visíveis para todos os usuários.');
      } catch (error) {
        console.error('Erro ao salvar customizações:', error);
        alert('Erro ao salvar customizações. Tente novamente.');
      }
    } else {
      alert('Erro: Usuário não identificado');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">Dashboard</span>
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
                <span className="ml-2 text-lg font-bold text-gray-900">Dashboard</span>
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
      <div className="lg:ml-64">
        <div className="p-4 lg:p-8">
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
    </div>
  );
};

const ClientOverview: React.FC<{ user: any; customizations: ClientCustomizations }> = ({ user, customizations }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Bem-vindo, {user?.name}!</h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">Gerencie e personalize seu site de sinais</p>
        </div>
        <Link
          to={`/site/${user?.clientId}`}
          target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
          <Eye className="h-4 w-4" />
          Ver Site
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Visitantes Hoje</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">1,234</p>
            </div>
            <Users className="h-8 w-8 lg:h-12 lg:w-12 text-green-600" />
          </div>
          <p className="text-xs lg:text-sm text-green-600 mt-2">+12% vs ontem</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Conversões</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">89</p>
            </div>
            <Target className="h-8 w-8 lg:h-12 lg:w-12 text-blue-600" />
          </div>
          <p className="text-xs lg:text-sm text-blue-600 mt-2">+5% vs ontem</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">7.2%</p>
            </div>
            <BarChart3 className="h-8 w-8 lg:h-12 lg:w-12 text-purple-600" />
          </div>
          <p className="text-xs lg:text-sm text-purple-600 mt-2">+2.1% vs ontem</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 lg:px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Status do Site</h2>
        </div>
        <div className="p-4 lg:p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2 text-sm lg:text-base">Imagens do Carrossel</h3>
              <p className="text-gray-600 text-sm lg:text-base">{customizations.carouselImages.length} imagem(ns) configurada(s)</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2 text-sm lg:text-base">Plataformas</h3>
              <p className="text-gray-600 text-sm lg:text-base">{customizations.platformLinks.length} plataforma(s) configurada(s)</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Personalizar Site</h1>
        <button
          onClick={onSave}
          className="bg-green-600 text-white px-4 lg:px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-sm lg:text-base"
        >
          <Save className="h-4 w-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-4 lg:space-y-6">

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Cores do Site
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Personalize as cores do seu site para criar uma identidade visual única.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor de Fundo
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customizations.backgroundColor.includes('#') ? customizations.backgroundColor : '#0f0e0e'}
                      onChange={(e) => setCustomizations({
                        ...customizations,
                        backgroundColor: e.target.value
                      })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customizations.backgroundColor}
                      onChange={(e) => setCustomizations({
                        ...customizations,
                        backgroundColor: e.target.value
                      })}
                      placeholder="linear-gradient(135deg, #0f0e0e 30%, #d8006c 100%)"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use uma cor sólida (ex: #ff0000) ou um gradiente CSS (ex: linear-gradient(135deg, #0f0e0e 30%, #d8006c 100%))
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Primária
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customizations.primaryColor}
                      onChange={(e) => setCustomizations({
                        ...customizations,
                        primaryColor: e.target.value
                      })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customizations.primaryColor}
                      onChange={(e) => setCustomizations({
                        ...customizations,
                        primaryColor: e.target.value
                      })}
                      placeholder="#3B82F6"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Secundária
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customizations.secondaryColor}
                      onChange={(e) => setCustomizations({
                        ...customizations,
                        secondaryColor: e.target.value
                      })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customizations.secondaryColor}
                      onChange={(e) => setCustomizations({
                        ...customizations,
                        secondaryColor: e.target.value
                      })}
                      placeholder="#10B981"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs lg:text-sm text-purple-800">
                  <strong>Dica:</strong> Para gradientes, use a sintaxe CSS: linear-gradient(direção, cor1 posição%, cor2 posição%)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Image className="h-5 w-5" />
              Imagens do Carrossel
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Gerencie as imagens que aparecem no carrossel do seu site. Você pode adicionar até 4 imagens.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customizations.carouselImages.map((image, index) => (
                  <CarouselImageEditor
                    key={index}
                    image={image}
                    index={index}
                    onUpdate={(updatedImage) => {
                      const newImages = [...customizations.carouselImages];
                      newImages[index] = updatedImage;
                      setCustomizations({
                        ...customizations,
                        carouselImages: newImages
                      });
                    }}
                    onRemove={() => {
                      const newImages = customizations.carouselImages.filter((_, i) => i !== index);
                      setCustomizations({
                        ...customizations,
                        carouselImages: newImages
                      });
                    }}
                  />
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {customizations.carouselImages.length < 4 && (
                  <button
                    onClick={() => {
                      const newImages = [...customizations.carouselImages, { type: 'url' as const, value: '' }];
                      setCustomizations({
                        ...customizations,
                        carouselImages: newImages
                      });
                    }}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    <Image className="h-4 w-4" />
                    Adicionar Nova Imagem
                  </button>
                )}
                
                {customizations.carouselImages.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja remover todas as imagens do carrossel?')) {
                        setCustomizations({
                          ...customizations,
                          carouselImages: []
                        });
                      }
                    }}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover Todas
                  </button>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs lg:text-sm text-blue-800">
                  <strong>Dica:</strong> Para melhores resultados, use imagens com proporção 16:9 e tamanho mínimo de 800x450px.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Plataformas
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Gerencie os links de plataformas que aparecem no seu site. Você pode adicionar até 5 links.
              </p>
              
              <div className="space-y-3">
                {customizations.platformLinks.map((link, index) => (
                  <PlatformLinkEditor
                    key={index}
                    link={link}
                    index={index}
                    onUpdate={(updatedLink) => {
                      console.log('Plataforma atualizada no dashboard:', updatedLink);
                      const newLinks = [...customizations.platformLinks];
                      newLinks[index] = updatedLink;
                      console.log('Nova lista de plataformas:', newLinks);
                      
                      // Atualizar estado local
                      setCustomizations({
                        ...customizations,
                        platformLinks: newLinks
                      });
                    }}
                    onRemove={() => {
                      const newLinks = customizations.platformLinks.filter((_, i) => i !== index);
                      console.log('Plataforma removida, nova lista:', newLinks);
                      
                      // Atualizar estado local
                      setCustomizations({
                        ...customizations,
                        platformLinks: newLinks
                      });
                    }}
                  />
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {customizations.platformLinks.length < 5 && (
                  <button
                    onClick={() => {
                      const newLinks = [...customizations.platformLinks, { name: '', url: '' }];
                      console.log('Nova plataforma adicionada, lista:', newLinks);
                      
                      // Atualizar estado local
                      setCustomizations({
                        ...customizations,
                        platformLinks: newLinks
                      });
                    }}
                    className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    <Target className="h-4 w-4" />
                    Adicionar Nova Plataforma
                  </button>
                )}
                
                {customizations.platformLinks.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        console.log('Botão Salvar Plataformas clicado');
                        console.log('Plataformas a serem salvas:', customizations.platformLinks);
                        
                        // Usar a função onSave que já existe
                        onSave();
                        alert('Plataformas salvas com sucesso!');
                      }}
                      className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
                    >
                      <Save className="h-4 w-4" />
                      Salvar Plataformas
                    </button>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja remover todas as plataformas?')) {
                          console.log('Removendo todas as plataformas');
                          
                          // Atualizar estado local
                          setCustomizations({
                            ...customizations,
                            platformLinks: []
                          });
                        }
                      }}
                      className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remover Todas
                    </button>
                  </>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs lg:text-sm text-green-800">
                  <strong>Dica:</strong> Os links aparecerão como botões clicáveis na seção de plataformas do seu site.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Redes Sociais
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Configure os links do WhatsApp e Instagram que aparecem no seu site.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link do WhatsApp
                  </label>
                  <input
                    type="url"
                    value={customizations.whatsappLink}
                    onChange={(e) => setCustomizations({
                      ...customizations,
                      whatsappLink: e.target.value
                    })}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cole aqui o link do seu grupo ou chat do WhatsApp
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link do Instagram
                  </label>
                  <input
                    type="url"
                    value={customizations.instagramLink}
                    onChange={(e) => setCustomizations({
                      ...customizations,
                      instagramLink: e.target.value
                    })}
                    placeholder="https://www.instagram.com/..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cole aqui o link do seu perfil do Instagram
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs lg:text-sm text-blue-800">
                  <strong>Dica:</strong> Os links aparecerão como botões clicáveis na seção de redes sociais do seu site.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Pré-visualização
          </h2>
          <div className="border-2 border-gray-200 rounded-lg p-3 lg:p-4 bg-gray-50">
            {/* Pré-visualização da Cor de Fundo */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cor de Fundo</h3>
              <div 
                className="h-16 rounded-lg border border-gray-300"
                style={{ background: customizations.backgroundColor }}
              >
                <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                  {customizations.backgroundColor.includes('gradient') ? 'Gradiente' : 'Cor Sólida'}
                </div>
              </div>
            </div>
            {/* Pré-visualização do Carrossel */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Carrossel de Imagens</h3>
              <div className="relative h-24 lg:h-32 bg-gray-200 rounded-lg overflow-hidden">
                {customizations.carouselImages.length > 0 && customizations.carouselImages[0]?.value ? (
                  <img 
                    src={customizations.carouselImages[0].value} 
                    alt="Preview carrossel"
                    className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center text-gray-500 text-xs lg:text-sm"
                  style={{ display: (customizations.carouselImages.length > 0 && customizations.carouselImages[0]?.value) ? 'none' : 'flex' }}
                >
                  {customizations.carouselImages.length === 0 ? 'Nenhuma imagem adicionada' : 'Primeira imagem inválida'}
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {customizations.carouselImages.length} imagem(ns)
                </div>
              </div>
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
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Configurações</h1>
      
      <div className="bg-white rounded-lg shadow p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
          <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para editar imagens do carrossel
const CarouselImageEditor: React.FC<{
  image: CarouselImageData;
  index: number;
  onUpdate: (image: CarouselImageData) => void;
  onRemove: () => void;
}> = ({ image, index, onUpdate, onRemove }) => {
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const [urlValue, setUrlValue] = useState(image.type === 'url' ? image.value : '');
  const [fileName, setFileName] = useState(image.type === 'file' ? image.name || 'Arquivo carregado' : '');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, etc.)');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpdate({
          type: 'file',
          value: result,
          name: file.name
        });
        setFileName(file.name);
        setInputType('file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlValue(url);
    onUpdate({
      type: 'url',
      value: url
    });
  };

  const switchToUrl = () => {
    setInputType('url');
    setUrlValue('');
    onUpdate({ type: 'url', value: '' });
  };

  const switchToFile = () => {
    setInputType('file');
    setFileName('');
    onUpdate({ type: 'file', value: '', name: '' });
  };

  return (
    <div className="relative">
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
        {image.value ? (
          <img 
            src={image.value} 
            alt={`Carrossel ${index + 1}`}
            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
          />
        ) : null}
        <div 
          className="w-full h-full flex items-center justify-center text-gray-500 text-sm"
          style={{ display: image.value ? 'none' : 'flex' }}
        >
          {inputType === 'url' ? 'URL não configurada' : 'Arquivo não selecionado'}
        </div>
      </div>

      <div className="mt-2 space-y-2">
        {/* Botões para escolher tipo de entrada */}
        <div className="flex gap-2">
          <button
            onClick={switchToUrl}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              inputType === 'url' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            URL
          </button>
          <button
            onClick={switchToFile}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              inputType === 'file' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Arquivo
          </button>
        </div>

        {/* Input baseado no tipo selecionado */}
        {inputType === 'url' ? (
          <input
            type="url"
            value={urlValue}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-xs"
            />
            {fileName && (
              <p className="text-xs text-gray-600 truncate">
                📁 {fileName}
              </p>
            )}
          </div>
        )}

        {/* Botão remover */}
        <button
          onClick={onRemove}
          className="w-full px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Remover
        </button>
      </div>
    </div>
  );
};

// Componente para editar links de plataformas
const PlatformLinkEditor: React.FC<{
  link: PlatformLink;
  index: number;
  onUpdate: (link: PlatformLink) => void;
  onRemove: () => void;
}> = ({ link, index, onUpdate, onRemove }) => {
  const [name, setName] = useState(link.name);
  const [url, setUrl] = useState(link.url);

  const handleNameChange = (newName: string) => {
    setName(newName);
    const updatedLink = { name: newName, url };
    console.log('Nome da plataforma alterado:', updatedLink);
    onUpdate(updatedLink);
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    const updatedLink = { name, url: newUrl };
    console.log('URL da plataforma alterada:', updatedLink);
    onUpdate(updatedLink);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Plataforma {index + 1}</span>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Nome da plataforma (ex: 777 CLUBE)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="URL da plataforma (ex: https://exemplo.com)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        />
        
        {name && url && (
          <div className="mt-2 p-2 bg-white border border-gray-200 rounded text-xs">
            <p className="text-gray-600">
              <strong>Preview:</strong> <span className="text-blue-600">{name}</span>
            </p>
            <p className="text-gray-500 truncate">{url}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;