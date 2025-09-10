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

// Sistema de armazenamento global para compartilhar customizações
const STORAGE_PREFIX = 'global-client-customizations-';

// Função para salvar customizações globalmente (acessível para qualquer pessoa)
const saveGlobalCustomizations = (clientId: string, customizations: ClientCustomizations): void => {
  try {
    const key = `${STORAGE_PREFIX}${clientId}`;
    const data = JSON.stringify(customizations);
    localStorage.setItem(key, data);
    console.log(`Customizações salvas globalmente para cliente ${clientId}:`, customizations);
  } catch (error) {
    console.error(`Erro ao salvar customizações globalmente para ${clientId}:`, error);
  }
};

// Função para carregar customizações globalmente
const loadGlobalCustomizations = (clientId: string): ClientCustomizations | null => {
  try {
    const key = `${STORAGE_PREFIX}${clientId}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log(`Customizações globais carregadas para cliente ${clientId}:`, parsed);
      
      // Migração de dados antigos se necessário
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
        platformLinks: parsed.platformLinks || defaultCustomizations.platformLinks
      };
      
      return migrated;
    }
  } catch (error) {
    console.error(`Erro ao carregar customizações globais para ${clientId}:`, error);
  }
  
  return null;
};

// Banco de dados simulado para fallback
const clientCustomizationsDB: { [clientId: string]: ClientCustomizations } = {
  'client-1': {
    ...defaultCustomizations,
    companyName: 'Cliente 1 - TradingPro',
    heroTitle: 'Sinais Profissionais - Cliente 1',
    platformLinks: [
      { name: "777 CLUBE", url: "https://777boat.net/?id=232676057" },
      { name: "GRUPO W1", url: "https://w1-shawlpg.com/?id=687313071" },
      { name: "GRUPO 999", url: "https://999sincero.bet/?id=160469960" }
    ]
  },
  'client-2': {
    ...defaultCustomizations,
    companyName: 'Cliente 2 - TradingPro',
    heroTitle: 'Sinais VIP - Cliente 2',
    primaryColor: '#8B5CF6',
    secondaryColor: '#06B6D4',
    carouselImages: [
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/1.jpeg" },
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/2.jpeg" }
    ],
    platformLinks: [
      { name: "777 CLUBE", url: "https://777boat.net/?id=232676057" },
      { name: "GRUPO W1", url: "https://w1-shawlpg.com/?id=687313071" }
    ]
  },
  'client-3': {
    ...defaultCustomizations,
    companyName: 'Cliente 3 - TradingPro',
    heroTitle: 'Sinais Premium - Cliente 3',
    primaryColor: '#EF4444',
    secondaryColor: '#F59E0B',
    carouselImages: [
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/3.jpeg" },
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/4.jpeg" }
    ],
    platformLinks: [
      { name: "GRUPO 999", url: "https://999sincero.bet/?id=160469960" }
    ]
  },
  'client-4': {
    ...defaultCustomizations,
    companyName: 'Cliente 4 - TradingPro',
    heroTitle: 'Sinais Elite - Cliente 4',
    primaryColor: '#10B981',
    secondaryColor: '#3B82F6',
    carouselImages: [
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/1.jpeg" },
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/3.jpeg" },
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/4.jpeg" }
    ],
    platformLinks: [
      { name: "777 CLUBE", url: "https://777boat.net/?id=232676057" },
      { name: "GRUPO W1", url: "https://w1-shawlpg.com/?id=687313071" },
      { name: "GRUPO 999", url: "https://999sincero.bet/?id=160469960" }
    ]
  }
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [customizations, setCustomizations] = useState<ClientCustomizations>(defaultCustomizations);

  console.log('CustomizationProvider renderizado, user:', user);

  // Carregar customizações do cliente logado
  useEffect(() => {
    console.log('useEffect executado, user?.clientId:', user?.clientId);
    if (user?.clientId) {
      console.log('Carregando customizações para cliente:', user.clientId);
      
      // Tenta carregar customizações globais primeiro
      const globalCustomizations = loadGlobalCustomizations(user.clientId);
      
      if (globalCustomizations) {
        console.log('Customizações globais encontradas:', globalCustomizations);
        setCustomizations(globalCustomizations);
        return;
      }
      
      // Fallback para banco simulado
      const fallbackCustomizations = clientCustomizationsDB[user.clientId] || defaultCustomizations;
      console.log('Usando customizações de fallback:', fallbackCustomizations);
      setCustomizations(fallbackCustomizations);
      
      // Salva no armazenamento global para próximas vezes
      saveGlobalCustomizations(user.clientId, fallbackCustomizations);
    }
  }, [user?.clientId]);

  const saveCustomizationsGlobally = async (newCustomizations: ClientCustomizations) => {
    if (user?.clientId) {
      console.log('Salvando customizações globalmente para cliente:', user.clientId);
      
      // Atualiza o estado local
      setCustomizations(newCustomizations);
      
      // Salva globalmente para que outros usuários vejam
      saveGlobalCustomizations(user.clientId, newCustomizations);
      
      // Também atualiza o banco simulado
      clientCustomizationsDB[user.clientId] = newCustomizations;
      
      console.log('Customizações salvas com sucesso globalmente!');
    }
  };

  const updateCarouselImages = (images: CarouselImageData[]) => {
    if (user?.clientId) {
      const updatedCustomizations = {
        ...customizations,
        carouselImages: images
      };
      
      setCustomizations(updatedCustomizations);
      saveGlobalCustomizations(user.clientId, updatedCustomizations);
      clientCustomizationsDB[user.clientId] = updatedCustomizations;
      
      console.log('Imagens do carrossel atualizadas globalmente');
    }
  };

  const updatePlatformLinks = (links: PlatformLink[]) => {
    if (user?.clientId) {
      console.log('updatePlatformLinks chamado com:', links);
      const updatedCustomizations = {
        ...customizations,
        platformLinks: links
      };
      
      setCustomizations(updatedCustomizations);
      saveGlobalCustomizations(user.clientId, updatedCustomizations);
      clientCustomizationsDB[user.clientId] = updatedCustomizations;
      
      console.log('Links de plataformas atualizados globalmente');
    }
  };

  const getClientCustomizations = (clientId: string): ClientCustomizations => {
    console.log('getClientCustomizations chamado para:', clientId);
    
    // Tenta carregar customizações globais primeiro
    const globalCustomizations = loadGlobalCustomizations(clientId);
    
    if (globalCustomizations) {
      console.log('Customizações globais encontradas para', clientId);
      return globalCustomizations;
    }
    
    // Fallback para banco simulado
    const fallbackCustomizations = clientCustomizationsDB[clientId] || defaultCustomizations;
    console.log('Usando fallback para', clientId);
    
    // Salva no armazenamento global se não existir
    saveGlobalCustomizations(clientId, fallbackCustomizations);
    
    return fallbackCustomizations;
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