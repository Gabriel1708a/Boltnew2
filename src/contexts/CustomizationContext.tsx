import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CarouselImageData {
  type: 'url' | 'file';
  value: string; // URL ou base64
  name?: string; // Nome do arquivo (para uploads)
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

// Prefixo global para armazenamento - acessível por qualquer pessoa
const GLOBAL_STORAGE_PREFIX = 'site-customizations-';

// Função para salvar customizações de forma global
const saveGlobalClientCustomizations = (clientId: string, customizations: ClientCustomizations): void => {
  try {
    const globalKey = `${GLOBAL_STORAGE_PREFIX}${clientId}`;
    const data = JSON.stringify(customizations);
    localStorage.setItem(globalKey, data);
    
    // Também salva com timestamp para controle de versão
    const timestampKey = `${GLOBAL_STORAGE_PREFIX}${clientId}-timestamp`;
    localStorage.setItem(timestampKey, Date.now().toString());
    
    console.log(`✅ Customizações salvas globalmente para ${clientId}:`, customizations);
  } catch (error) {
    console.error(`❌ Erro ao salvar customizações para ${clientId}:`, error);
  }
};

// Função para carregar customizações globais
const loadGlobalClientCustomizations = (clientId: string): ClientCustomizations => {
  try {
    const globalKey = `${GLOBAL_STORAGE_PREFIX}${clientId}`;
    const stored = localStorage.getItem(globalKey);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log(`✅ Customizações globais carregadas para ${clientId}:`, parsed);
      
      // Migração de dados se necessário
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
    }
  } catch (error) {
    console.error(`❌ Erro ao carregar customizações para ${clientId}:`, error);
  }
  
  // Retorna dados padrão com informações do cliente
  const clientDefaults = {
    ...defaultCustomizations,
    companyName: `${clientId.toUpperCase()} - TradingPro`,
    heroTitle: `Sinais Profissionais - ${clientId.toUpperCase()}`,
  };
  
  console.log(`📝 Usando dados padrão para ${clientId}:`, clientDefaults);
  
  // Salva os dados padrão para futuras consultas
  saveGlobalClientCustomizations(clientId, clientDefaults);
  
  return clientDefaults;
};

// Função para obter timestamp da última atualização
const getLastUpdateTimestamp = (clientId: string): number => {
  const timestampKey = `${GLOBAL_STORAGE_PREFIX}${clientId}-timestamp`;
  const timestamp = localStorage.getItem(timestampKey);
  return timestamp ? parseInt(timestamp, 10) : 0;
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [customizations, setCustomizations] = useState<ClientCustomizations>(defaultCustomizations);

  console.log('🔄 CustomizationProvider iniciado, usuário:', user);

  // Carregar customizações do cliente logado
  useEffect(() => {
    if (user?.clientId) {
      console.log(`🔍 Carregando customizações para cliente logado: ${user.clientId}`);
      const clientCustomizations = loadGlobalClientCustomizations(user.clientId);
      setCustomizations(clientCustomizations);
    }
  }, [user?.clientId]);

  const saveCustomizationsGlobally = async (newCustomizations: ClientCustomizations) => {
    if (user?.clientId) {
      console.log(`💾 Salvando customizações globalmente para: ${user.clientId}`);
      
      // Atualiza o estado local
      setCustomizations(newCustomizations);
      
      // Salva globalmente para que qualquer pessoa possa acessar
      saveGlobalClientCustomizations(user.clientId, newCustomizations);
    }
  };

  const updateCarouselImages = (images: CarouselImageData[]) => {
    if (user?.clientId) {
      console.log(`🖼️ Atualizando imagens do carrossel para: ${user.clientId}`);
      const updatedCustomizations = {
        ...customizations,
        carouselImages: images
      };
      
      setCustomizations(updatedCustomizations);
      saveGlobalClientCustomizations(user.clientId, updatedCustomizations);
    }
  };

  const updatePlatformLinks = (links: PlatformLink[]) => {
    if (user?.clientId) {
      console.log(`🔗 Atualizando links de plataformas para: ${user.clientId}`, links);
      const updatedCustomizations = {
        ...customizations,
        platformLinks: links
      };
      
      setCustomizations(updatedCustomizations);
      saveGlobalClientCustomizations(user.clientId, updatedCustomizations);
    }
  };

  // Função pública para carregar customizações de qualquer cliente
  const getClientCustomizations = (clientId: string): ClientCustomizations => {
    console.log(`🔍 Buscando customizações públicas para: ${clientId}`);
    return loadGlobalClientCustomizations(clientId);
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

// Função para carregar customizações sem contexto (para uso direto no ClientSite)
export const getPublicClientCustomizations = (clientId: string): ClientCustomizations => {
  return loadGlobalClientCustomizations(clientId);
};

// Função para verificar se há atualizações
export const checkForUpdates = (clientId: string, lastCheck: number): { hasUpdates: boolean; customizations: ClientCustomizations } => {
  const lastUpdate = getLastUpdateTimestamp(clientId);
  const hasUpdates = lastUpdate > lastCheck;
  const customizations = loadGlobalClientCustomizations(clientId);
  
  return { hasUpdates, customizations };
};