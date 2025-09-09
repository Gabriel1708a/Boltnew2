import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  TrendingUp, Target, Users, Shield, Star, ArrowRight, 
  CheckCircle, Play, Award, BarChart, Clock, Smartphone,
  MessageCircle, Zap, Globe, Lock, Trophy, ChevronRight
} from 'lucide-react';

// Simulando dados dos clientes para demonstração
const clientsData = {
  'client-1': {
    companyName: 'LaysSinais',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    heroTitle: 'Sinais de Trading Profissionais',
    heroSubtitle: 'Transforme seus investimentos com análises precisas e sinais de alta performance'
  },
  'client-2': {
    companyName: 'InvestMax Sinais',
    primaryColor: '#7C3AED',
    secondaryColor: '#EF4444',
    heroTitle: 'Sinais de Investimento Inteligente',
    heroSubtitle: 'Sua jornada rumo ao sucesso financeiro começa aqui'
  }
};

const ClientSite: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const clientData = clientsData[clientId as keyof typeof clientsData] || clientsData['client-1'];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${clientData.primaryColor}20` }}
              >
                <TrendingUp 
                  className="h-6 w-6" 
                  style={{ color: clientData.primaryColor }}
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">{clientData.companyName}</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">Início</a>
              <a href="#sobre" className="text-gray-700 hover:text-blue-600 transition-colors">Sobre</a>
              <a href="#sinais" className="text-gray-700 hover:text-blue-600 transition-colors">Sinais</a>
              <a href="#resultados" className="text-gray-700 hover:text-blue-600 transition-colors">Resultados</a>
              <a href="#planos" className="text-gray-700 hover:text-blue-600 transition-colors">Planos</a>
              <a href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors">Contato</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 transition-colors">
                Login
              </button>
              <button 
                className="px-6 py-2 rounded-full text-white font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: clientData.primaryColor }}
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="inicio" 
        className="pt-24 pb-16 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${clientData.primaryColor}, ${clientData.secondaryColor})`
        }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Star className="h-4 w-4 text-yellow-300 mr-2" />
                <span className="text-sm font-medium">Sinais com 87% de Assertividade</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {clientData.heroTitle}
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {clientData.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl"
                >
                  Acesso Gratuito por 7 Dias
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </button>
                <button className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center">
                  <Play className="h-5 w-5 mr-2" />
                  Ver Demonstração
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold">87%</div>
                  <div className="text-white/80 text-sm">Taxa de Acerto</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-white/80 text-sm">Traders Ativos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-white/80 text-sm">Suporte</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <div className="inline-block p-4 bg-green-400 rounded-full mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Sinal Ao Vivo</h3>
                  <div className="inline-flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    ATIVO
                  </div>
                </div>
                
                <div className="space-y-4 text-white">
                  <div className="flex justify-between items-center">
                    <span>Par:</span>
                    <span className="font-bold">EUR/USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Direção:</span>
                    <span className="text-green-400 font-bold">⬆️ COMPRA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Entrada:</span>
                    <span className="font-bold">1.0850</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Take Profit:</span>
                    <span className="text-green-400 font-bold">1.0890</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stop Loss:</span>
                    <span className="text-red-400 font-bold">1.0820</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/20 text-center">
                  <div className="text-2xl font-bold text-green-400">+40 pips</div>
                  <div className="text-white/80 text-sm">Lucro Atual</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section id="sobre" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
              <Target className="h-4 w-4 mr-2" />
              Por que escolher nossos sinais?
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              A Tecnologia que Gera Resultados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combinamos análise técnica avançada com inteligência artificial para entregar 
              sinais precisos e rentáveis para nossos traders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div 
                className="inline-block p-4 rounded-2xl mb-6"
                style={{ backgroundColor: `${clientData.primaryColor}20` }}
              >
                <BarChart 
                  className="h-8 w-8" 
                  style={{ color: clientData.primaryColor }}
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Análise Precisa</h3>
              <p className="text-gray-600 mb-4">
                Utilizamos algoritmos avançados para analisar milhares de dados do mercado em tempo real.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div 
                className="inline-block p-4 rounded-2xl mb-6"
                style={{ backgroundColor: `${clientData.secondaryColor}20` }}
              >
                <Clock 
                  className="h-8 w-8" 
                  style={{ color: clientData.secondaryColor }}
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sinais em Tempo Real</h3>
              <p className="text-gray-600 mb-4">
                Receba notificações instantâneas dos melhores momentos para entrar no mercado.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-purple-100 rounded-2xl mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gestão de Risco</h3>
              <p className="text-gray-600 mb-4">
                Estratégias profissionais de gerenciamento de risco para proteger seu capital.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-green-100 rounded-2xl mb-6">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">App Mobile</h3>
              <p className="text-gray-600 mb-4">
                Acesse seus sinais a qualquer momento através do nosso aplicativo mobile.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-orange-100 rounded-2xl mb-6">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Suporte 24/7</h3>
              <p className="text-gray-600 mb-4">
                Nossa equipe está sempre disponível para tirar suas dúvidas e ajudar.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="inline-block p-4 bg-red-100 rounded-2xl mb-6">
                <Globe className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Múltiplos Mercados</h3>
              <p className="text-gray-600 mb-4">
                Sinais para Forex, Criptomoedas, Ações e Commodities em uma única plataforma.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="resultados" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
              <Trophy className="h-4 w-4 mr-2" />
              Resultados Comprovados
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Números que Falam por Si Só
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mais de 10.000 traders já transformaram seus resultados com nossos sinais profissionais.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div 
                className="text-5xl font-bold mb-2"
                style={{ color: clientData.primaryColor }}
              >
                87%
              </div>
              <div className="text-gray-600 font-medium">Taxa de Acerto</div>
            </div>
            <div className="text-center">
              <div 
                className="text-5xl font-bold mb-2"
                style={{ color: clientData.secondaryColor }}
              >
                10K+
              </div>
              <div className="text-gray-600 font-medium">Traders Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">250%</div>
              <div className="text-gray-600 font-medium">ROI Médio Mensal</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">R$2M+</div>
              <div className="text-gray-600 font-medium">Lucros Gerados</div>
            </div>
          </div>

          <div 
            className="rounded-3xl p-12 text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${clientData.primaryColor}, ${clientData.secondaryColor})`
            }}
          >
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4">Depoimento de Cliente</h3>
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-300 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-2xl mb-8 leading-relaxed">
                  "Em apenas 3 meses usando os sinais, consegui um retorno de 180% no meu 
                  investimento. A precisão é impressionante e o suporte é excepcional!"
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg">Carlos Silva</div>
                    <div className="text-white/80">Trader Profissional</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <Award className="h-4 w-4 mr-2" />
              Escolha seu plano
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Planos para Todos os Perfis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comece gratuitamente e evolua conforme seus resultados crescem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Básico */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-blue-200 transition-all">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">R$ 97</div>
                <div className="text-gray-600">por mês</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>5 sinais por dia</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Suporte por email</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Análises básicas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>App mobile</span>
                </li>
              </ul>
              
              <button className="w-full bg-gray-900 text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Começar Agora
              </button>
            </div>

            {/* Plano Pro */}
            <div 
              className="bg-white rounded-3xl p-8 shadow-xl border-2 relative transform scale-105"
              style={{ borderColor: clientData.primaryColor }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div 
                  className="px-6 py-2 rounded-full text-white font-semibold text-sm"
                  style={{ backgroundColor: clientData.primaryColor }}
                >
                  MAIS POPULAR
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2" style={{ color: clientData.primaryColor }}>
                  R$ 197
                </div>
                <div className="text-gray-600">por mês</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>15 sinais por dia</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Análises avançadas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Grupo VIP Telegram</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Webinars exclusivos</span>
                </li>
              </ul>
              
              <button 
                className="w-full text-white py-4 rounded-full font-semibold transition-colors"
                style={{ 
                  backgroundColor: clientData.primaryColor,
                  ':hover': { opacity: 0.9 }
                }}
              >
                Começar Agora
              </button>
            </div>

            {/* Plano Premium */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent hover:border-purple-200 transition-all">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">R$ 397</div>
                <div className="text-gray-600">por mês</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Sinais ilimitados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Consultoria 1:1</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Suporte WhatsApp</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Copy trading automático</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Acesso total à plataforma</span>
                </li>
              </ul>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors">
                Começar Agora
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">🎁 Garantia de 30 dias ou seu dinheiro de volta</p>
            <p className="text-gray-600">💳 Parcelamento em até 12x sem juros</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronto para Transformar Seus Investimentos?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Junte-se a mais de 10.000 traders que já estão lucrando com nossos sinais profissionais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                className="px-10 py-5 bg-white text-gray-900 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl"
              >
                Teste Gratuito por 7 Dias
                <Zap className="inline-block ml-2 h-5 w-5" />
              </button>
              <button 
                className="px-10 py-5 border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
              >
                Falar com Especialista
                <MessageCircle className="inline-block ml-2 h-5 w-5" />
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Garantia 30 dias</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>10K+ Clientes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${clientData.primaryColor}20` }}
                >
                  <TrendingUp 
                    className="h-6 w-6" 
                    style={{ color: clientData.primaryColor }}
                  />
                </div>
                <span className="text-2xl font-bold text-gray-900">{clientData.companyName}</span>
              </div>
              <p className="text-gray-600 mb-6">
                Transformando traders em investidores de sucesso através de sinais precisos e educação financeira.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  f
                </div>
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white">
                  @
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  t
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Produto</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Sinais de Forex</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Sinais de Crypto</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Análises Técnicas</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">App Mobile</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Suporte</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Termos de Uso</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Contato</h4>
              <ul className="space-y-3 text-gray-600">
                <li>suporte@{clientData.companyName.toLowerCase()}.com</li>
                <li>+55 (11) 99999-9999</li>
                <li>Segunda - Sexta: 9h às 18h</li>
                <li>Sábado: 9h às 14h</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
            <p>© 2024 {clientData.companyName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientSite;