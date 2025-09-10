import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CarouselImageData {
  type: 'url' | 'file';
  value: string;
  name?: string;
}

export interface PlatformLink {
  name: string;
  url: string;
}

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

interface CustomizationContextType {
  customizations: ClientCustomizations;
  setCustomizations: (customizations: ClientCustomizations) => void;
  updateCarouselImages: (images: CarouselImageData[]) => void;
  updatePlatformLinks: (links: PlatformLink[]) => void;
  getClientCustomizations: (clientId: string) => ClientCustomizations;
  saveCustomizationsGlobally: (customizations: ClientCustomizations) => Promise<void>;
}

const defaultCustomizations: ClientCustomizations = {
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  backgroundColor: 'linear-gradient(135deg, #0f0e0e 30%, #d8006c 100%)',
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
  },
  carouselImages: [
    { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/1.jpeg" },
    { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/2.jpeg" },
    { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/3.jpeg" },
    { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/4.jpeg" }
  ],
  platformLinks: [
    { name: "777 CLUBE", url: "https://777boat.net/?id=232676057" },
    { name: "GRUPO W1", url: "https://w1-shawlpg.com/?id=687313071" },
    { name: "GRUPO 999", url: "https://999sincero.bet/?id=160469960" }
  ],
  whatsappLink: 'https://chat.whatsapp.com/JzoNzkKYIYl1sWjS0Gdgic?mode=ems_copy_c',
  instagramLink: 'https://www.instagram.com/layaneslots9217?igsh=MXJ3dDZnaThxeGx6NA=='
};

// CHAVE GLOBAL - Acessível por qualquer pessoa, qualquer navegador
const GLOBAL_STORAGE_PREFIX = 'GLOBAL_SITE_DATA_';

// Função para salvar customizações GLOBALMENTE (visível para todos)
const saveGlobalCustomizations = (clientId: string, customizations: ClientCustomizations): void => {
  try {
    const globalKey = `${GLOBAL_STORAGE_PREFIX}${clientId}`;
    const timestampKey = `${GLOBAL_STORAGE_PREFIX}${clientId}_TIMESTAMP`;
    
    // Salva os dados
    localStorage.setItem(globalKey, JSON.stringify(customizations));
    localStorage.setItem(timestampKey, Date.now().toString());
    
    console.log(`✅ DADOS SALVOS GLOBALMENTE para ${clientId}:`, customizations);
    console.log(`🔑 Chave global: ${globalKey}`);
    
    // Confirmar que foi salvo
    const verificacao = localStorage.getItem(globalKey);
    console.log(`✅ Verificação - dados salvos:`, verificacao ? 'SIM' : 'NÃO');
    
  } catch (error) {
    console.error(`❌ ERRO ao salvar para ${clientId}:`, error);
  }
};

// Função para carregar customizações GLOBAIS (visível para todos)
const loadGlobalCustomizations = (clientId: string): ClientCustomizations => {
  try {
    const globalKey = `${GLOBAL_STORAGE_PREFIX}${clientId}`;
    const stored = localStorage.getItem(globalKey);
    
    console.log(`🔍 Procurando dados globais para ${clientId}:`);
    console.log(`🔑 Chave: ${globalKey}`);
    console.log(`📦 Dados encontrados:`, stored ? 'SIM' : 'NÃO');
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log(`✅ DADOS GLOBAIS CARREGADOS para ${clientId}:`, parsed);
      
      // Garantir estrutura correta
      const migrated = {
        ...defaultCustomizations,
        ...parsed,
        carouselImages: Array.isArray(parsed.carouselImages) 
          ? parsed.carouselImages.map((img: any) => 
              typeof img === 'string' 
                ? { type: 'url', value: img } 
                : img
            )
          : defaultCustomizations.carouselImages,
        platformLinks: Array.isArray(parsed.platformLinks) 
          ? parsed.platformLinks 
          : defaultCustomizations.platformLinks
      };
      
      return migrated;
    } else {
      console.log(`📝 Usando dados padrão para ${clientId}`);
    }
  } catch (error) {
    console.error(`❌ ERRO ao carregar ${clientId}:`, error);
  }
  
  // Dados padrão personalizados para o cliente
  const clientDefaults = {
    ...defaultCustomizations,
    companyName: `${clientId.toUpperCase()} - TradingPro`,
    heroTitle: `Sinais Profissionais - ${clientId.toUpperCase()}`,
  };
  
  // Salvar dados padrão para futuras consultas
  saveGlobalCustomizations(clientId, clientDefaults);
  
  return clientDefaults;
};

// Função para verificar timestamp de atualizações
const getLastUpdateTimestamp = (clientId: string): number => {
  const timestampKey = `${GLOBAL_STORAGE_PREFIX}${clientId}_TIMESTAMP`;
  const timestamp = localStorage.getItem(timestampKey);
  return timestamp ? parseInt(timestamp, 10) : 0;
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [customizations, setCustomizations] = useState<ClientCustomizations>(defaultCustomizations);

  console.log('🚀 CustomizationProvider iniciado para:', user?.clientId);

  // Carregar customizações do cliente logado
  useEffect(() => {
    if (user?.clientId) {
      console.log(`📥 Carregando customizações do dashboard para: ${user.clientId}`);
      const clientCustomizations = loadGlobalCustomizations(user.clientId);
      setCustomizations(clientCustomizations);
      console.log(`📋 Dashboard carregado com:`, clientCustomizations);
    }
  }, [user?.clientId]);

  const saveCustomizationsGlobally = async (newCustomizations: ClientCustomizations) => {
    if (user?.clientId) {
      console.log(`💾 SALVANDO GLOBALMENTE para ${user.clientId}:`, newCustomizations);
      
      // Atualizar estado local imediatamente
      setCustomizations(newCustomizations);
      
      // Salvar globalmente para que TODOS vejam
      saveGlobalCustomizations(user.clientId, newCustomizations);
      
      console.log(`✅ Customizações salvas! Agora visíveis em /site/${user.clientId}`);
    }
  };

  const updateCarouselImages = (images: CarouselImageData[]) => {
    if (user?.clientId) {
      console.log(`🖼️ Atualizando imagens para: ${user.clientId}`);
      const updatedCustomizations = {
        ...customizations,
        carouselImages: images
      };
      
      setCustomizations(updatedCustomizations);
      saveGlobalCustomizations(user.clientId, updatedCustomizations);
    }
  };

  const updatePlatformLinks = (links: PlatformLink[]) => {
    if (user?.clientId) {
      console.log(`🔗 Atualizando plataformas para: ${user.clientId}`, links);
      const updatedCustomizations = {
        ...customizations,
        platformLinks: links
      };
      
      setCustomizations(updatedCustomizations);
      saveGlobalCustomizations(user.clientId, updatedCustomizations);
    }
  };

  // Função pública para carregar customizações de qualquer cliente
  const getClientCustomizations = (clientId: string): ClientCustomizations => {
    console.log(`🌍 Carregando dados PÚBLICOS para: ${clientId}`);
    return loadGlobalCustomizations(clientId);
  };

  return (
    <CustomizationContext.Provider value={{
      customizations,
      setCustomizations: saveCustomizationsGlobally,
      updateCarouselImages,
      updatePlatformLinks,
      getClientCustomizations,
      saveCustomizationsGlobally
    }}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};

// Função para usar FORA do contexto (site público)
export const getPublicClientCustomizations = (clientId: string): ClientCustomizations => {
  console.log(`🌐 SITE PÚBLICO - Carregando dados para: ${clientId}`);
  return loadGlobalCustomizations(clientId);
};

// Função para verificar se há atualizações
export const checkForUpdates = (clientId: string, lastCheck: number): { hasUpdates: boolean; customizations: ClientCustomizations } => {
  const lastUpdate = getLastUpdateTimestamp(clientId);
  const hasUpdates = lastUpdate > lastCheck;
  const customizations = loadGlobalCustomizations(clientId);
  
  if (hasUpdates) {
    console.log(`🔄 ATUALIZAÇÕES detectadas para ${clientId}! Última: ${new Date(lastUpdate).toLocaleTimeString()}`);
  }
  
  return { hasUpdates, customizations };
};