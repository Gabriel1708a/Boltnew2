import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pgGames, ppGames, GameType, Game } from '../data/gamesData';
import { getPublicClientCustomizations, checkForUpdates } from '../contexts/CustomizationContext';

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
  carouselImages: Array<{
    type: 'url' | 'file';
    value: string;
    name?: string;
  }>;
  platformLinks: Array<{
    name: string;
    url: string;
  }>;
  whatsappLink: string;
  instagramLink: string;
}

const ClientSite: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  
  // Estado para as customizações do cliente
  const [clientCustomizations, setClientCustomizations] = useState<ClientCustomizations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());

  console.log('🌐 SITE PÚBLICO - ClientSite carregando para cliente:', clientId);

  // Carregar customizações iniciais
  useEffect(() => {
    if (clientId) {
      console.log('📥 SITE PÚBLICO - Carregando customizações para:', clientId);
      setIsLoading(true);
      
      try {
        const customizations = getPublicClientCustomizations(clientId);
        console.log('✅ SITE PÚBLICO - Customizações carregadas:', customizations);
        setClientCustomizations(customizations);
        setLastCheckTime(Date.now());
      } catch (error) {
        console.error('❌ SITE PÚBLICO - Erro ao carregar:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [clientId]);

  // Verificar atualizações a cada 2 segundos
  useEffect(() => {
    if (!clientId || !clientCustomizations) return;

    const checkUpdates = () => {
      try {
        const { hasUpdates, customizations } = checkForUpdates(clientId, lastCheckTime);
        
        if (hasUpdates) {
          console.log('🔄 SITE PÚBLICO - Atualizações detectadas, recarregando...');
          setClientCustomizations(customizations);
          setLastCheckTime(Date.now());
        }
      } catch (error) {
        console.error('❌ SITE PÚBLICO - Erro ao verificar atualizações:', error);
      }
    };

    const interval = setInterval(checkUpdates, 2000); // Verifica a cada 2 segundos
    return () => clearInterval(interval);
  }, [clientId, clientCustomizations, lastCheckTime]);

  // Estados do site
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bitcoinStatus, setBitcoinStatus] = useState('Carregando...');
  const [bitcoinPrice, setBitcoinPrice] = useState('Carregando...');
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [timer, setTimer] = useState('10:00');
  const [progressBars, setProgressBars] = useState<{[key: string]: number}>({});
  const [currentGameType, setCurrentGameType] = useState<GameType>('PG');
  const [currentGames, setCurrentGames] = useState<Game[]>(pgGames.slice(0, 20));
  const [allGamesLoaded, setAllGamesLoaded] = useState(false);

  // Tela de carregamento
  if (isLoading || !clientCustomizations) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0e0e 30%, #d8006c 100%)',
        color: 'white',
        fontFamily: 'Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid rgba(255,255,255,0.3)',
            borderTop: '6px solid #ff007f',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
            Carregando site personalizado...
          </p>
          <p style={{ fontSize: '16px', opacity: 0.8 }}>
            Cliente: {clientId?.toUpperCase()}
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Usar imagens personalizadas do cliente
  const carouselImages = clientCustomizations.carouselImages && clientCustomizations.carouselImages.length > 0 
    ? clientCustomizations.carouselImages.map(img => img.value).filter(value => value && value.trim() !== '')
    : [
        "https://laysinais.netlify.app/img/IMAGENS%20SITE/1.jpeg",
        "https://laysinais.netlify.app/img/IMAGENS%20SITE/2.jpeg", 
        "https://laysinais.netlify.app/img/IMAGENS%20SITE/3.jpeg",
        "https://laysinais.netlify.app/img/IMAGENS%20SITE/4.jpeg"
      ];

  console.log('🖼️ SITE PÚBLICO - Usando imagens:', carouselImages);
  console.log('🎨 SITE PÚBLICO - Background:', clientCustomizations.backgroundColor);
  console.log('🔗 SITE PÚBLICO - Plataformas:', clientCustomizations.platformLinks);

  // Funções auxiliares
  const getRandomPercentage = () => Math.floor(Math.random() * (97 - 30 + 1)) + 30;
  const getColor = (percentage: number) => {
    if (percentage <= 35) return "red";
    if (percentage <= 45) return "orange";
    if (percentage <= 55) return "#d1b30b";
    if (percentage <= 60) return "#aaa810";
    if (percentage <= 80) return "#5ba000";
    return "green";
  };
  const getRandomNumbers = () => {
    const numbers = new Set<number>();
    while (numbers.size < 3) {
      numbers.add(Math.floor(Math.random() * 10));
    }
    return [...numbers].sort((a, b) => a - b).join(", ");
  };

  // Carrossel automático
  useEffect(() => {
    if (carouselImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [carouselImages.length]);

  // Bitcoin
  useEffect(() => {
    const fetchBitcoinStatus = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&ids=bitcoin");
        const data = await response.json();
        const bitcoin = data[0];
        const priceChange = bitcoin.price_change_percentage_24h;
        const currentPrice = bitcoin.current_price;

        if (priceChange >= 0) {
          setBitcoinStatus("Bitcoin em alta!");
          setBitcoinPrice(currentPrice.toFixed(2).replace(".", ","));
        } else {
          setBitcoinStatus("Bitcoin em queda!");
          setBitcoinPrice(currentPrice.toFixed(2).replace(".", ","));
        }
      } catch (error) {
        console.error("Erro ao buscar dados do Bitcoin:", error);
      }
    };

    fetchBitcoinStatus();
    const interval = setInterval(fetchBitcoinStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const proximoMultiplo = new Date(now);
      const minutos = now.getMinutes();
      let proximoMinutoMultiplo = minutos - (minutos % 10) + 10;
      if (proximoMinutoMultiplo === 60) {
        proximoMultiplo.setHours(proximoMultiplo.getHours() + 1);
        proximoMinutoMultiplo = 0;
      }
      proximoMultiplo.setMinutes(proximoMinutoMultiplo);
      proximoMultiplo.setSeconds(0);
      proximoMultiplo.setMilliseconds(0);

      const diffMs = proximoMultiplo.getTime() - now.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffSec = Math.floor((diffMs % 60000) / 1000);
      setTimer(`${String(diffMin).padStart(2, "0")}:${String(diffSec).padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Progress bars
  useEffect(() => {
    const newProgressBars: {[key: string]: number} = {};
    pgGames.forEach(jogo => {
      newProgressBars[`bar${jogo.id}`] = getRandomPercentage();
      newProgressBars[`bar${jogo.id}_2`] = getRandomPercentage();
      newProgressBars[`bar${jogo.id}_3`] = getRandomPercentage();
    });
    setProgressBars(newProgressBars);
  }, []);

  // Modal de termos
  useEffect(() => {
    const naoMostrar = localStorage.getItem("naoMostrarTermos");
    if (!naoMostrar) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    if (dontShowAgain) {
      localStorage.setItem("naoMostrarTermos", "true");
    }
    setShowModal(false);
  };

  const scrollToComoJogar = () => {
    const element = document.getElementById("como-jogar");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleGameType = () => {
    const newGameType: GameType = currentGameType === 'PG' ? 'PP' : 'PG';
    setCurrentGameType(newGameType);
    
    const allGames = newGameType === 'PG' ? pgGames : ppGames;
    setCurrentGames(allGames);
    setAllGamesLoaded(true);
    
    const newProgressBars: {[key: string]: number} = {};
    allGames.forEach(jogo => {
      newProgressBars[`bar${jogo.id}`] = getRandomPercentage();
      newProgressBars[`bar${jogo.id}_2`] = getRandomPercentage();
      newProgressBars[`bar${jogo.id}_3`] = getRandomPercentage();
    });
    setProgressBars(newProgressBars);
  };

  const loadMoreGames = () => {
    if (!allGamesLoaded && currentGameType === 'PG') {
      setCurrentGames(pgGames);
      setAllGamesLoaded(true);
      
      const newProgressBars: {[key: string]: number} = {};
      pgGames.forEach(jogo => {
        newProgressBars[`bar${jogo.id}`] = getRandomPercentage();
        newProgressBars[`bar${jogo.id}_2`] = getRandomPercentage();
        newProgressBars[`bar${jogo.id}_3`] = getRandomPercentage();
      });
      setProgressBars(newProgressBars);
    }
  };

  return (
    <div style={{ 
      background: clientCustomizations.backgroundColor,
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      fontFamily: 'Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* Círculos de fundo */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1
      }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.11)',
              width: `${100 + i * 20}px`,
              height: `${100 + i * 20}px`,
              top: `${5 + i * 8}%`,
              left: `${10 + i * 7}%`
            }}
          />
        ))}
      </div>
            
      {/* Modal de Termos */}
      {showModal && (
        <div 
          style={{
            display: 'block',
            position: 'fixed',
            zIndex: 1000,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div style={{
            backgroundColor: '#fff',
            margin: '5% auto',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            overflow: 'auto'
          }}>
            <span 
              onClick={handleCloseModal}
              style={{
                float: 'right',
                fontSize: '24px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#666'
              }}
            >
              &times;
            </span>
            <h2 style={{ marginTop: 0, color: '#333' }}>Termos de Uso</h2>
            <div style={{
              width: '100%',
              height: '400px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              overflow: 'auto',
              padding: '15px',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <p><strong>Aviso Legal:</strong> Este site tem caráter meramente informativo e não realiza, promove ou incentiva apostas ou jogos de azar.</p>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <label>Não mostrar novamente</label>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* Carrossel */}
        <header style={{
          paddingTop: '5px',
          display: 'block',
          maxWidth: '360px',
          position: 'relative',
          height: '20vh',
          margin: '0 auto'
        }}>
          {carouselImages.length > 0 ? (
            carouselImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Imagem ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'opacity 0.5s ease-out',
                  boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.349)',
                  borderRadius: '5px'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ))
          ) : (
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f3f4f6',
              borderRadius: '5px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              Nenhuma imagem configurada
            </div>
          )}
        </header>

        {/* Plataformas */}
        <div style={{
          display: 'block',
          margin: '20px auto',
          maxWidth: '360px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(255, 0, 128, 0.15), rgba(15, 14, 14, 0.85))',
          borderRadius: '16px',
          color: '#ffffff',
          boxShadow: '0 6px 18px rgba(255, 0, 128, 0.25)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            textAlign: 'center',
            fontSize: '1.6rem',
            fontWeight: '500',
            marginBottom: '16px'
          }}>
            PLATAFORMA:
          </p>
          
          {clientCustomizations.platformLinks && clientCustomizations.platformLinks.length > 0 ? (
            clientCustomizations.platformLinks.map((platform, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #ff007f, #2d0d1f)',
                padding: '4px',
                marginTop: '8px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(255, 0, 128, 0.25)',
                gap: '1px',
                color: '#ffffff'
              }}>
                <p style={{ margin: 0, fontSize: '15px' }}>{platform.name}</p>
                <a 
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px',
                    color: '#f1f1f1',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  {platform.url}
                </a>
              </div>
            ))
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #ff007f, #2d0d1f)',
              padding: '4px',
              marginTop: '8px',
              borderRadius: '12px'
            }}>
              <p style={{ margin: 0 }}>Nenhuma plataforma configurada</p>
            </div>
          )}
        </div>

        {/* Redes Sociais */}
        <div style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          margin: '20px 0'
        }}>
          <a 
            href={clientCustomizations.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: '#fff',
              backgroundImage: 'linear-gradient(rgb(8, 180, 74), rgb(38, 90, 38))',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            WhatsApp
          </a>
          
          <a 
            href={clientCustomizations.instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              color: '#fff',
              backgroundImage: 'repeating-linear-gradient(rgb(150, 11, 230), rgb(211, 81, 21), rgb(158, 143, 9))',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            Instagram
          </a>

          <button 
            onClick={scrollToComoJogar}
            style={{
              padding: '10px',
              fontSize: '11px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Como Jogar
          </button>
        </div>

        {/* Bitcoin */}
        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          fontSize: '16px',
          color: '#ffffff'
        }}>
          <h1>Bitcoin</h1>
          Analise atual: <span style={{ 
            color: bitcoinStatus.includes('alta') ? 'rgb(13, 255, 13)' : 'rgb(255, 6, 6)' 
          }}>{bitcoinStatus}</span><br />
          Preço atual: R$<span style={{ 
            color: bitcoinStatus.includes('alta') ? 'rgb(13, 255, 13)' : 'rgb(255, 6, 6)' 
          }}>{bitcoinPrice}</span><br />
        </div>

        {/* Info scroll */}
        <div style={{ color: '#ffffff', margin: 'auto', maxWidth: '400px' }}>
          <div style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            animation: 'scroll-left 20s linear infinite'
          }}>
            Ao abrir o site pela primeira vez, deixe aberto por 30 min <strong>SEM ATUALIZAR O SITE</strong> para uma analise mais precisa!
          </div>
        </div>

        {/* Timer */}
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff',
          padding: '5px',
          margin: '10px auto',
          borderRadius: '8px',
          width: 'fit-content'
        }}>
          <span>Próxima atualização em </span>
          <span>{timer}</span>
        </div>

        {/* Botão jogos */}
        <div style={{
          display: 'flex',
          margin: '10px auto',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #d6026c, #8e0057)',
          color: '#ffffff',
          fontWeight: '500',
          fontSize: '0.95rem',
          maxWidth: '225px',
          height: '36px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          <button 
            onClick={toggleGameType}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontWeight: 'bold'
            }}
          >
            {currentGameType === 'PG' ? 'MUDAR PARA PP SLOTs' : 'MUDAR PARA PG SLOTs'}
          </button>
        </div>

        {/* Jogos */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '480px',
          margin: 'auto'
        }}>
          {currentGames.map((jogo) => (
            <div key={jogo.id} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '4px',
              margin: '5px',
              width: '100px',
              borderRadius: '5px',
              backgroundColor: '#0f0e0e5e'
            }}>
              <img 
                src={jogo.imagem} 
                alt={`Jogo ${jogo.id}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
              
              <div style={{ textAlign: 'center', width: '100%' }}>
                <p style={{ fontSize: '0.6em', color: '#ffffff', margin: '5px 0' }}>Aposta Padrão</p>
                <div style={{
                  backgroundColor: getColor(progressBars[`bar${jogo.id}`] || 50),
                  borderRadius: '5px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  width: `${progressBars[`bar${jogo.id}`] || 50}%`,
                  color: 'white',
                  textAlign: 'center'
                }}>
                  {progressBars[`bar${jogo.id}`] || 50}%
                </div>
              </div>

              <div style={{ textAlign: 'center', width: '100%' }}>
                <p style={{ fontSize: '0.6em', color: '#ffffff', margin: '5px 0' }}>Aposta Mínima</p>
                <div style={{
                  backgroundColor: getColor(progressBars[`bar${jogo.id}_2`] || 50),
                  borderRadius: '5px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  width: `${progressBars[`bar${jogo.id}_2`] || 50}%`,
                  color: 'white',
                  textAlign: 'center'
                }}>
                  {progressBars[`bar${jogo.id}_2`] || 50}%
                </div>
              </div>
              
              <div style={{ textAlign: 'center', width: '100%' }}>
                <p style={{ fontSize: '0.6em', color: '#ffffff', margin: '5px 0' }}>Aposta Máxima</p>
                <div style={{
                  backgroundColor: getColor(progressBars[`bar${jogo.id}_3`] || 50),
                  borderRadius: '5px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  width: `${progressBars[`bar${jogo.id}_3`] || 50}%`,
                  color: 'white',
                  textAlign: 'center'
                }}>
                  {progressBars[`bar${jogo.id}_3`] || 50}%
                </div>
              </div>
              
              <div style={{
                color: 'white',
                fontSize: '9px',
                fontWeight: 'bolder',
                marginTop: '5px',
                textAlign: 'center'
              }}>
                Min Pagantes: {getRandomNumbers()}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ width: '100%' }}>
          <footer 
            id="como-jogar"
            style={{
              margin: '10px auto',
              maxWidth: '400px',
              backgroundColor: 'rgba(0, 0, 0, 0.459)',
              textAlign: 'center',
              border: '2px solid rgb(30, 255, 0)',
              padding: '10px'
            }}
          >
            <h1 style={{ marginBottom: '20px', color: 'white' }}>Como jogar</h1>
            <p style={{ color: 'white', fontWeight: 'bold' }}>
              Aposta Padrão = bet de R$1,00 a R$1,80
            </p>
            <p style={{ color: 'white', fontWeight: 'bold' }}>
              Aposta Mínima = bet de R$0,40 a R$0,80
            </p>
            <p style={{ color: 'white', fontWeight: 'bold' }}>
              Aposta Máxima = bet de R$2,00 ou mais
            </p>
            <br />
            <p style={{ color: 'white', fontWeight: 'bold' }}>
              Min pagantes: é o ultimo número do seu relógio, você deve jogar quando ele aparecer.
            </p>
            <h3 style={{ color: 'red', marginTop: '10px' }}>
              🔞Aviso Legal: Este site tem caráter meramente informativo e não realiza, promove ou incentiva apostas ou jogos de azar.
            </h3>
          </footer>
        </div>
      </main>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default ClientSite;