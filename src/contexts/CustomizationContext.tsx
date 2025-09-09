import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { customizationService } from '../services/customizationService';

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
  platformLinks: [],
  whatsappLink: 'https://chat.whatsapp.com/JzoNzkKYIYl1sWjS0Gdgic?mode=ems_copy_c',
  instagramLink: 'https://www.instagram.com/layaneslots9217?igsh=MXJ3dDZnaThxeGx6NA=='
};

// Função para carregar customizações globalmente (com fallback para localStorage)
const loadClientCustomizations = async (clientId: string): Promise<ClientCustomizations | null> => {
  try {
    console.log('Tentando carregar customizações globais para:', clientId);
    
    // Primeiro, tenta carregar do serviço global
    const globalCustomizations = await customizationService.loadClientCustomizations(clientId);
    
    if (globalCustomizations) {
      console.log('Customizações carregadas do serviço global:', globalCustomizations);
      return globalCustomizations;
    }
    
    // Fallback para localStorage (para compatibilidade com dados existentes)
    const key = `client-customizations-${clientId}`;
    console.log('Tentando fallback no localStorage:', key);
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Dados encontrados no localStorage:', parsed);
      
      // Migrar dados antigos - garantir que todas as propriedades existam
      const migrated = {
        ...defaultCustomizations,
        ...parsed,
        // Migrar carouselImages se for array de strings
        carouselImages: Array.isArray(parsed.carouselImages) 
          ? parsed.carouselImages.map((img: any) => 
              typeof img === 'string' 
                ? { type: 'url', value: img } 
                : img
            )
          : defaultCustomizations.carouselImages,
        // Garantir que platformLinks existe
        platformLinks: parsed.platformLinks || defaultCustomizations.platformLinks,
        // Garantir que os links de redes sociais existem
        whatsappLink: parsed.whatsappLink || defaultCustomizations.whatsappLink,
        instagramLink: parsed.instagramLink || defaultCustomizations.instagramLink,
        // Garantir que backgroundColor existe
        backgroundColor: parsed.backgroundColor || defaultCustomizations.backgroundColor
      };
      
      console.log('Dados migrados do localStorage:', migrated);
      
      // Salvar no serviço global para sincronização
      await customizationService.saveClientCustomizations(clientId, migrated);
      
      return migrated;
    }
  } catch (error) {
    console.error('Erro ao carregar customizações:', error);
  }
  
  console.log('Nenhum dado encontrado, retornando null');
  return null;
};

// Função para salvar customizações globalmente
const saveClientCustomizations = async (clientId: string, customizations: ClientCustomizations): Promise<boolean> => {
  try {
    console.log('Salvando customizações globalmente para:', clientId);
    
    // Salva no serviço global
    const success = await customizationService.saveClientCustomizations(clientId, customizations);
    
    if (success) {
      console.log('Customizações salvas com sucesso no serviço global');
      return true;
    } else {
      console.error('Falha ao salvar no serviço global');
      return false;
    }
  } catch (error) {
    console.error('Erro ao salvar customizações globalmente:', error);
    return false;
  }
};


// Simulação de banco de dados de customizações por cliente (fallback)
const clientCustomizationsDB: { [clientId: string]: ClientCustomizations } = {
  'client-1': {
    ...defaultCustomizations,
    companyName: 'Cliente 1 - TradingPro',
    heroTitle: 'Sinais Profissionais - Cliente 1',
    carouselImages: [
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/1.jpeg" },
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/2.jpeg" },
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/3.jpeg" },
      { type: 'url', value: "https://laysinais.netlify.app/img/IMAGENS%20SITE/4.jpeg" }
    ],
    platformLinks: [],
    whatsappLink: 'https://chat.whatsapp.com/JzoNzkKYIYl1sWjS0Gdgic?mode=ems_copy_c',
    instagramLink: 'https://www.instagram.com/layaneslots9217?igsh=MXJ3dDZnaThxeGx6NA==',
    backgroundColor: 'linear-gradient(135deg, #0f0e0e 30%, #d8006c 100%)'
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
    platformLinks: [],
    whatsappLink: 'https://chat.whatsapp.com/JzoNzkKYIYl1sWjS0Gdgic?mode=ems_copy_c',
    instagramLink: 'https://www.instagram.com/layaneslots9217?igsh=MXJ3dDZnaThxeGx6NA==',
    backgroundColor: 'linear-gradient(135deg, #0f0e0e 30%, #d8006c 100%)'
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
    platformLinks: [],
    whatsappLink: 'https://chat.whatsapp.com/JzoNzkKYIYl1sWjS0Gdgic?mode=ems_copy_c',
    instagramLink: 'https://www.instagram.com/layaneslots9217?igsh=MXJ3dDZnaThxeGx6NA==',
    backgroundColor: 'linear-gradient(135deg, #0f0e0e 30%, #d8006c 100%)'
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
    platformLinks: [],
    whatsappLink: 'https://chat.whatsapp.com/JzoNzkKYIYl1sWjS0Gdgic?mode=ems_copy_c',
    instagramLink: 'https://www.instagram.com/layaneslots9217?igsh=MXJ3dDZnaThxeGx6NA==',
    backgroundColor: 'linear-gradient(135deg, #0f0e0e 30%, #d8006c 100%)'
  }
};

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export const CustomizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [customizations, setCustomizations] = useState<ClientCustomizations>(defaultCustomizations);

  console.log('CustomizationProvider renderizado, user:', user);
  console.log('Estado atual das customizações:', customizations);


  // Carregar customizações do cliente logado
  useEffect(() => {
    console.log('useEffect executado, user?.clientId:', user?.clientId);
    if (user?.clientId) {
      console.log('Carregando customizações para cliente:', user.clientId);
      
      const loadCustomizations = async () => {
        try {
          // Primeiro, tenta carregar do serviço global (dados compartilhados)
          const globalCustomizations = await loadClientCustomizations(user.clientId);
          
          if (globalCustomizations) {
            console.log('Customizações carregadas do serviço global no useEffect:', globalCustomizations);
            setCustomizations(globalCustomizations);
            
            // Atualiza o localStorage com os dados globais
            const localKey = `client-customizations-${user.clientId}`;
            localStorage.setItem(localKey, JSON.stringify(globalCustomizations));
            return;
          }
          
          // Se não há dados globais, verifica localStorage como fallback
          const localKey = `client-customizations-${user.clientId}`;
          const localData = localStorage.getItem(localKey);
          
          if (localData) {
            const parsed = JSON.parse(localData);
            console.log('Dados encontrados no localStorage como fallback:', parsed);
            
            // Garantir que todos os campos existem
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
              platformLinks: parsed.platformLinks || defaultCustomizations.platformLinks,
              whatsappLink: parsed.whatsappLink || defaultCustomizations.whatsappLink,
              instagramLink: parsed.instagramLink || defaultCustomizations.instagramLink,
              backgroundColor: parsed.backgroundColor || defaultCustomizations.backgroundColor
            };
            
            console.log('Definindo customizações do localStorage no useEffect:', migrated);
            setCustomizations(migrated);
            
            // Tenta sincronizar com o armazenamento global
            await saveClientCustomizations(user.clientId, migrated);
            return;
          }
          
          // Último recurso: banco simulado
          const fallbackCustomizations = clientCustomizationsDB[user.clientId] || defaultCustomizations;
          console.log('Usando customizações de fallback no useEffect:', fallbackCustomizations);
          setCustomizations(fallbackCustomizations);
          
          // Salva no armazenamento global e localStorage
          await saveClientCustomizations(user.clientId, fallbackCustomizations);
        } catch (error) {
          console.error('Erro ao carregar customizações no useEffect:', error);
          // Em caso de erro, usa o fallback
          const fallbackCustomizations = clientCustomizationsDB[user.clientId] || defaultCustomizations;
          setCustomizations(fallbackCustomizations);
        }
      };
      
      loadCustomizations();
    }
  }, [user?.clientId]);

  // Monitorar mudanças no estado das customizações
  useEffect(() => {
    console.log('Estado das customizações foi atualizado:', customizations);
  }, [customizations]);

  const updateCarouselImages = async (images: CarouselImageData[]) => {
    if (user?.clientId) {
      const updatedCustomizations = {
        ...customizations,
        carouselImages: images
      };
      setCustomizations(updatedCustomizations);
      
      // Salva imediatamente no localStorage
      const localKey = `client-customizations-${user.clientId}`;
      localStorage.setItem(localKey, JSON.stringify(updatedCustomizations));
      
      try {
        // Salvar globalmente
        await saveClientCustomizations(user.clientId, updatedCustomizations);
        // Também salvar no "banco de dados" simulado como fallback
        clientCustomizationsDB[user.clientId] = updatedCustomizations;
      } catch (error) {
        console.error('Erro ao salvar imagens do carrossel:', error);
      }
    }
  };

  const updatePlatformLinks = async (links: PlatformLink[]) => {
    if (user?.clientId) {
      console.log('updatePlatformLinks chamado com:', links);
      const updatedCustomizations = {
        ...customizations,
        platformLinks: links
      };
      console.log('Customizações atualizadas:', updatedCustomizations);
      setCustomizations(updatedCustomizations);
      
      // Salva imediatamente no localStorage
      const localKey = `client-customizations-${user.clientId}`;
      localStorage.setItem(localKey, JSON.stringify(updatedCustomizations));
      console.log('Dados salvos imediatamente no localStorage');
      
      try {
        // Salvar globalmente
        console.log('Salvando globalmente para cliente:', user.clientId);
        await saveClientCustomizations(user.clientId, updatedCustomizations);
        // Também salvar no "banco de dados" simulado como fallback
        clientCustomizationsDB[user.clientId] = updatedCustomizations;
        console.log('Dados salvos globalmente e no banco simulado');
      } catch (error) {
        console.error('Erro ao salvar links de plataformas:', error);
      }
    }
  };

  const setCustomizationsForClient = async (newCustomizations: ClientCustomizations) => {
    if (user?.clientId) {
      console.log('setCustomizationsForClient chamado para:', user.clientId, newCustomizations);
      
      // Atualiza o estado imediatamente
      setCustomizations(newCustomizations);
      
      // Salva imediatamente no localStorage para garantir persistência
      const localKey = `client-customizations-${user.clientId}`;
      localStorage.setItem(localKey, JSON.stringify(newCustomizations));
      console.log('Dados salvos imediatamente no localStorage:', localKey);
      
      try {
        // Salvar globalmente (assíncrono)
        await saveClientCustomizations(user.clientId, newCustomizations);
        console.log('Dados salvos globalmente com sucesso');
        
        // Também salvar no "banco de dados" simulado como fallback
        clientCustomizationsDB[user.clientId] = newCustomizations;
        console.log('Dados salvos no banco simulado');
      } catch (error) {
        console.error('Erro ao salvar customizações globalmente:', error);
        // Mesmo com erro global, os dados estão no localStorage
      }
    }
  };

  const getClientCustomizations = (clientId: string): ClientCustomizations => {
    console.log('getClientCustomizations chamado para:', clientId);
    
    // Tenta carregar assincronamente do serviço global em background
    loadClientCustomizations(clientId).then(globalCustomizations => {
      if (globalCustomizations) {
        console.log('Dados globais carregados em background para', clientId, ':', globalCustomizations);
        // Salva no localStorage para próxima vez
        const localKey = `client-customizations-${clientId}`;
        localStorage.setItem(localKey, JSON.stringify(globalCustomizations));
        
        // Se for o cliente atual, atualiza o estado
        if (user?.clientId === clientId) {
          setCustomizations(globalCustomizations);
        }
      }
    }).catch(error => {
      console.error('Erro ao carregar customizações globais em background:', error);
    });
    
    // Enquanto isso, retorna dados do localStorage ou fallback
    try {
      const localKey = `client-customizations-${clientId}`;
      const localData = localStorage.getItem(localKey);
      
      if (localData) {
        const parsed = JSON.parse(localData);
        console.log('Dados encontrados no localStorage para', clientId, ':', parsed);
        
        // Garantir que todos os campos existem
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
          platformLinks: parsed.platformLinks || defaultCustomizations.platformLinks,
          whatsappLink: parsed.whatsappLink || defaultCustomizations.whatsappLink,
          instagramLink: parsed.instagramLink || defaultCustomizations.instagramLink,
          backgroundColor: parsed.backgroundColor || defaultCustomizations.backgroundColor
        };
        
        console.log('Retornando dados migrados do localStorage:', migrated);
        return migrated;
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
    
    // Último recurso: banco simulado
    const fallbackCustomizations = clientCustomizationsDB[clientId] || defaultCustomizations;
    console.log('Retornando fallback para', clientId, ':', fallbackCustomizations);
    
    return fallbackCustomizations;
  };

  return (
    <CustomizationContext.Provider value={{
      customizations,
      setCustomizations: setCustomizationsForClient,
      updateCarouselImages,
      updatePlatformLinks,
      getClientCustomizations
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
