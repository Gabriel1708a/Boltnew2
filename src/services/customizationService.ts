import { CarouselImageData, PlatformLink } from '../contexts/CustomizationContext';

export interface ClientCustomizations {
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

class CustomizationService {
  private baseUrl = '/data';
  private jsonBinUrl = 'https://api.jsonbin.io/v3/b';
  // Bin ID público para demonstração - em produção, cada cliente teria seu próprio bin
  private binId = '676003b5e41b4d34e4530c04';
  
  // Carregar customizações de um cliente específico
  async loadClientCustomizations(clientId: string): Promise<ClientCustomizations | null> {
    try {
      console.log(`Carregando customizações para cliente: ${clientId}`);
      
      // API externa temporariamente desabilitada devido a problemas de CORS
      console.log('API externa desabilitada, usando apenas armazenamento local');
      
      // Tenta carregar do localStorage primeiro
      try {
        const localKey = `client-customizations-${clientId}`;
        const localData = localStorage.getItem(localKey);
        
        if (localData) {
          const parsed = JSON.parse(localData);
          console.log(`Customizações carregadas do localStorage para ${clientId}:`, parsed);
          return parsed;
        }
      } catch (localError) {
        console.log('Erro ao carregar do localStorage:', localError);
      }
      
      // Fallback: tenta carregar do arquivo local
      let response = await fetch(`${this.baseUrl}/${clientId}-customizations.json`);
      
      // Se não encontrar, tenta criar um novo baseado no template padrão
      if (!response.ok) {
        console.log(`Arquivo não encontrado para ${clientId}, usando template padrão`);
        const defaultResponse = await fetch(`${this.baseUrl}/default-customizations.json`);
        
        if (defaultResponse.ok) {
          const defaultData = await defaultResponse.json();
          // Personaliza os dados padrão para o novo cliente
          const newClientData = {
            ...defaultData,
            companyName: `${clientId} - TradingPro`,
            heroTitle: `Sinais Profissionais - ${clientId}`
          };
          
          // Tenta salvar as customizações para o novo cliente
          await this.saveClientCustomizations(clientId, newClientData);
          return newClientData;
        }
        
        return null;
      }

      const data = await response.json();
      console.log(`Customizações carregadas do arquivo local para ${clientId}:`, data);
      return data;
    } catch (error) {
      console.error(`Erro ao carregar customizações para ${clientId}:`, error);
      return null;
    }
  }

  // Salvar customizações de um cliente específico
  async saveClientCustomizations(clientId: string, customizations: ClientCustomizations): Promise<boolean> {
    try {
      console.log(`Salvando customizações para cliente: ${clientId}`, customizations);
      
      // Salva no localStorage (principal método por enquanto)
      const localStorageKey = `client-customizations-${clientId}`;
      localStorage.setItem(localStorageKey, JSON.stringify(customizations));
      console.log('Customizações salvas no localStorage');
      
      // API externa desabilitada temporariamente
      console.log('API externa desabilitada - usando apenas localStorage');
      
      return true;
    } catch (error) {
      console.error(`Erro ao salvar customizações para ${clientId}:`, error);
      return false;
    }
  }

  // Método para criar arquivo de customização para novo cliente
  async createNewClientCustomizations(clientId: string): Promise<ClientCustomizations> {
    try {
      // Carrega o template padrão
      const defaultResponse = await fetch(`${this.baseUrl}/default-customizations.json`);
      
      if (defaultResponse.ok) {
        const defaultData = await defaultResponse.json();
        const newClientData = {
          ...defaultData,
          companyName: `${clientId} - TradingPro`,
          heroTitle: `Sinais Profissionais - ${clientId}`
        };
        
        // Salva as customizações para o novo cliente
        await this.saveClientCustomizations(clientId, newClientData);
        return newClientData;
      }
      
      throw new Error('Não foi possível carregar o template padrão');
    } catch (error) {
      console.error(`Erro ao criar customizações para novo cliente ${clientId}:`, error);
      throw error;
    }
  }

  // Método para verificar se um cliente existe
  async clientExists(clientId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${clientId}-customizations.json`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Método para listar todos os clientes
  async listClients(): Promise<string[]> {
    try {
      // Em um ambiente real, isso viria de uma API
      // Por enquanto, retorna uma lista hardcoded dos clientes conhecidos
      const knownClients = ['client-1', 'client-2', 'client-3', 'client-4'];
      
      // Verifica quais clientes existem
      const existingClients: string[] = [];
      for (const clientId of knownClients) {
        if (await this.clientExists(clientId)) {
          existingClients.push(clientId);
        }
      }
      
      return existingClients;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      return [];
    }
  }
}

export const customizationService = new CustomizationService();
