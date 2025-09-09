import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Target, Users, Shield, Star, ArrowRight, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-white">LaysSinais</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#sobre" className="text-white/80 hover:text-white transition-colors">Sobre</a>
            <a href="#sinais" className="text-white/80 hover:text-white transition-colors">Sinais</a>
            <a href="#planos" className="text-white/80 hover:text-white transition-colors">Planos</a>
            <a href="#contato" className="text-white/80 hover:text-white transition-colors">Contato</a>
          </div>
          <Link 
            to="/login"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Sinais de <span className="text-green-400">Trading</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Profissionais
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Transforme suas operações com sinais precisos e análises profundas. 
              Nossa equipe de experts trabalha 24h para maximizar seus resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl">
                Começar Agora
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
                Ver Demonstração
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </section>

      {/* Features Section */}
      <section id="sobre" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher nossos sinais?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Tecnologia avançada combinada com expertise humana para resultados excepcionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all transform hover:scale-105">
              <Target className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Precisão Extrema</h3>
              <p className="text-white/80">
                Taxa de assertividade superior a 85% com análises técnicas avançadas e IA proprietária.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all transform hover:scale-105">
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Suporte 24/7</h3>
              <p className="text-white/80">
                Equipe especializada disponível todos os dias para tirar suas dúvidas e orientar.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all transform hover:scale-105">
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Gestão de Risco</h3>
              <p className="text-white/80">
                Estratégias profissionais de risk management para proteger seu capital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Resultados Comprovados</h2>
              <p className="text-white/80 text-lg">Nossos números falam por si só</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">87%</div>
                <div className="text-white/80">Taxa de Acerto</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
                <div className="text-white/80">Clientes Ativos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">250%</div>
                <div className="text-white/80">ROI Médio Mensal</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
                <div className="text-white/80">Monitoramento</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Planos e Preços</h2>
            <p className="text-white/80 text-lg">Escolha o plano ideal para seu perfil de investimento</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Básico */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Básico</h3>
                <div className="text-4xl font-bold text-green-400 mb-2">R$ 97</div>
                <div className="text-white/80">por mês</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  5 sinais por dia
                </li>
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Análises técnicas
                </li>
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Suporte por email
                </li>
              </ul>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full transition-colors">
                Escolher Plano
              </button>
            </div>

            {/* Plano Pro */}
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm border-2 border-green-400 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                  MAIS POPULAR
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
                <div className="text-4xl font-bold text-green-400 mb-2">R$ 197</div>
                <div className="text-white/80">por mês</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  15 sinais por dia
                </li>
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Análises técnicas avançadas
                </li>
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Suporte prioritário
                </li>
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Grupo VIP Telegram
                </li>
              </ul>
              <button className="w-full bg-green-400 hover:bg-green-500 text-black py-3 rounded-full transition-colors font-semibold">
                Escolher Plano
              </button>
            </div>

            {/* Plano Premium */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
                <div className="text-4xl font-bold text-green-400 mb-2">R$ 397</div>
                <div className="text-white/80">por mês</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Sinais ilimitados
                </li>
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Consultoria 1:1
                </li>
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Suporte WhatsApp
                </li>
                <li className="flex items-center text-white/80">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  Copy trading automático
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-full transition-colors">
                Escolher Plano
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-white">LaysSinais</span>
          </div>
          <p className="text-white/60 mb-4">
            © 2024 LaysSinais. Todos os direitos reservados.
          </p>
          <div className="flex justify-center space-x-6 text-white/60">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;