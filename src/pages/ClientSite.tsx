import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pgGames, ppGames, GameType, Game } from '../data/gamesData';
import { useCustomization } from '../contexts/CustomizationContext';

const ClientSite: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { getClientCustomizations } = useCustomization();
  
  // Obter customizações específicas do cliente baseado no clientId da URL
  const clientCustomizations = getClientCustomizations(clientId || '');
  
  console.log('Client ID:', clientId); // Para evitar warning de variável não usada
  console.log('Client Customizations:', clientCustomizations);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bitcoinStatus, setBitcoinStatus] = useState('Carregando...');
  const [bitcoinPrice, setBitcoinPrice] = useState('Carregando...');
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [timer, setTimer] = useState('10:00');
  const [progressBars, setProgressBars] = useState<{[key: string]: number}>({});
  const [currentGameType, setCurrentGameType] = useState<GameType>('PG');
  const [currentGames, setCurrentGames] = useState<Game[]>(pgGames.slice(0, 20)); // Carrega apenas 20 jogos inicialmente
  const [allGamesLoaded, setAllGamesLoaded] = useState(false);


  // Usar imagens personalizadas específicas do cliente (permitir array vazio)
  const carouselImages = clientCustomizations.carouselImages.length > 0 
    ? clientCustomizations.carouselImages.map(img => img.value)
    : [
        "https://laysinais.netlify.app/img/IMAGENS%20SITE/1.jpeg",
        "https://laysinais.netlify.app/img/IMAGENS%20SITE/2.jpeg", 
        "https://laysinais.netlify.app/img/IMAGENS%20SITE/3.jpeg",
        "https://laysinais.netlify.app/img/IMAGENS%20SITE/4.jpeg"
      ];

  // Função para gerar porcentagem aleatória
  const getRandomPercentage = () => Math.floor(Math.random() * (97 - 30 + 1)) + 30;

  // Função para obter cor baseada na porcentagem
  const getColor = (percentage: number) => {
    if (percentage <= 35) return "red";
    if (percentage <= 45) return "orange";
    if (percentage <= 55) return "#d1b30b";
    if (percentage <= 60) return "#aaa810";
    if (percentage <= 80) return "#5ba000";
    return "green";
  };

  // Função para obter números aleatórios para min pagantes
  const getRandomNumbers = () => {
    const numbers = new Set<number>();
    while (numbers.size < 3) {
      numbers.add(Math.floor(Math.random() * 10));
    }
    return [...numbers].sort((a, b) => a - b).join(", ");
  };

  // Carrossel automático (só funciona se houver imagens)
  useEffect(() => {
    if (carouselImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [carouselImages.length]);

  // Buscar dados do Bitcoin
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

  // Contador regressivo
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

  // Inicializar progress bars
  useEffect(() => {
    const newProgressBars: {[key: string]: number} = {};
    pgGames.forEach(jogo => {
      newProgressBars[`bar${jogo.id}`] = getRandomPercentage();
      newProgressBars[`bar${jogo.id}_2`] = getRandomPercentage();
      newProgressBars[`bar${jogo.id}_3`] = getRandomPercentage();
    });
    setProgressBars(newProgressBars);
  }, []);

  // Verificar modal de termos
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

  // Função para alternar entre tipos de jogos
  const toggleGameType = () => {
    const newGameType: GameType = currentGameType === 'PG' ? 'PP' : 'PG';
    setCurrentGameType(newGameType);
    
    // Carrega todos os jogos do novo tipo
    const allGames = newGameType === 'PG' ? pgGames : ppGames;
    setCurrentGames(allGames);
    setAllGamesLoaded(true);
    
    // Resetar progress bars para o novo tipo de jogo
    const newProgressBars: {[key: string]: number} = {};
    allGames.forEach(jogo => {
      newProgressBars[`bar${jogo.id}`] = getRandomPercentage();
      newProgressBars[`bar${jogo.id}_2`] = getRandomPercentage();
      newProgressBars[`bar${jogo.id}_3`] = getRandomPercentage();
    });
    setProgressBars(newProgressBars);
  };

  // Função para carregar mais jogos PG
  const loadMoreGames = () => {
    if (!allGamesLoaded && currentGameType === 'PG') {
      setCurrentGames(pgGames);
      setAllGamesLoaded(true);
      
      // Atualizar progress bars para todos os jogos
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
          id="modal"
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
          <div 
            id="modal-content"
            style={{
              backgroundColor: '#fff',
              margin: '5% auto',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              overflow: 'auto'
            }}
          >
            <span 
              id="close-btn"
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
              border: 'none',
              marginTop: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              overflow: 'auto',
              padding: '15px',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              <h2 style={{ fontSize: '18px', marginTop: 0 }}>Termos de Uso e Política de Privacidade</h2>
              
              <p><strong>1. Aceitação dos Termos</strong></p>
              <p>Ao acessar e utilizar este site, o usuário declara ter lido, compreendido e concordado com os presentes Termos de Uso e Política de Privacidade. Caso não concorde com qualquer parte deste documento, recomenda-se que não utilize o site.</p>
              
              <p><strong>2. Objetivo do Site</strong></p>
              <p>Este site tem caráter meramente informativo, disponibilizando dados sobre porcentagens de jogos de slots e plataformas indicadas. Não realizamos apostas, intermediação financeira ou qualquer tipo de operação envolvendo jogos de azar.</p>
              
              <p><strong>3. Isenção de Responsabilidade</strong></p>
              <p>As informações disponibilizadas neste site são baseadas em análises próprias ou dados públicos e podem estar sujeitas a alterações sem aviso prévio.</p>
              <p><strong>Não garantimos ganhos, resultados ou qualquer tipo de benefício financeiro baseado nas informações aqui apresentadas.</strong></p>
              <p>O usuário é inteiramente responsável por suas decisões ao utilizar qualquer plataforma mencionada no site.</p>
              <p>Não nos responsabilizamos por perdas financeiras, decisões tomadas com base nos dados fornecidos, erros nas informações exibidas ou qualquer outro dano direto ou indireto decorrente do uso do site.</p>
              
              <p><strong>4. Regulamentação e Legislação</strong></p>
              <p>Cada usuário é responsável por verificar a legislação vigente em sua região antes de participar de qualquer atividade relacionada a jogos de azar. Não incentivamos, promovemos ou facilitamos apostas ilegais e recomendamos que os usuários sigam todas as normas legais aplicáveis ao seu país ou estado.</p>
              
              <p><strong>5. Privacidade e Coleta de Dados</strong></p>
              <p>Este site pode coletar informações básicas de navegação (como endereço IP e cookies) para melhorar a experiência do usuário.</p>
              <p><strong>Nenhuma informação pessoal sensível é coletada, armazenada ou compartilhada com terceiros.</strong></p>
              <p>O usuário pode desativar cookies diretamente em seu navegador caso não queira que dados básicos sejam coletados.</p>
              
              <p><strong>6. Uso de Terceiros e Links Externos</strong></p>
              <p>Nosso site pode conter links para plataformas de terceiros. Não temos controle sobre o conteúdo, segurança, políticas de privacidade ou práticas desses sites e não nos responsabilizamos por eventuais danos ou prejuízos causados pelo uso dessas plataformas. Recomendamos que o usuário revise os termos de uso e políticas de privacidade dos sites acessados.</p>
              
              <p><strong>7. Riscos Associados</strong></p>
              <p>Jogos de azar envolvem riscos financeiros significativos. O usuário deve avaliar cuidadosamente sua situação antes de se envolver nessas atividades. Não incentivamos o uso dessas informações como meio de renda ou solução financeira.</p>
              
              <p><strong>8. Uso Indevido das Informações</strong></p>
              <p>As informações fornecidas são meramente informativas e não constituem aconselhamento financeiro, jurídico ou estratégico. O uso dessas informações é de inteira responsabilidade do usuário.</p>
              
              <p><strong>9. Limitação de Responsabilidade por Erros e Falhas Técnicas</strong></p>
              <p>Nosso site pode conter erros, bugs ou falhas técnicas. Não garantimos a disponibilidade contínua do serviço e podemos suspendê-lo ou encerrá-lo a qualquer momento sem aviso prévio.</p>
              
              <p><strong>10. Idade Mínima</strong></p>
              <p>O acesso a este site é restrito a maiores de 18 anos ou conforme a legislação local. Não coletamos informações de menores de idade e recomendamos que os responsáveis monitorem o acesso.</p>
              
              <p><strong>11. Direitos Autorais e Propriedade Intelectual</strong></p>
              <p>O conteúdo deste site, incluindo textos, imagens e gráficos, é protegido por direitos autorais. A reprodução ou uso sem autorização expressa é proibida.</p>
              
              <p><strong>12. Alterações nos Termos</strong></p>
              <p>Podemos atualizar ou modificar estes termos a qualquer momento sem aviso prévio. Recomendamos que os usuários revisem esta página periodicamente para se manterem informados sobre quaisquer alterações.</p>
            </div>

            <div 
              id="nao-mostrar"
              style={{
                marginTop: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <input 
                type="checkbox" 
                id="naoMostrarCheckbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <label htmlFor="naoMostrarCheckbox" style={{ cursor: 'pointer', fontSize: '14px' }}>
                Não mostrar novamente
              </label>
            </div>
          </div>
        </div>
      )}

      <main>
        {/* Carrossel de imagens */}
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
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                src={image}
                alt={`Imagem ${index + 1}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: index === currentSlide ? 1 : 0,
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                  boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.349)',
                  borderRadius: '5px'
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
              fontSize: '14px',
              textAlign: 'center',
              padding: '20px'
            }}>
              Nenhuma imagem configurada
            </div>
          )}
        </header>

        {/* Caixa Plataforma */}
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
            fontFamily: '"Bitcount Grid Double", system-ui',
            background: 'linear-gradient(90deg, #ff007f, #ff4da6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 6px rgba(255, 0, 127, 0.3)',
            marginBottom: '16px'
          }}>
            PLATAFORMA:
          </p>
          
          {clientCustomizations.platformLinks.length > 0 ? (
            clientCustomizations.platformLinks.map((platform, index) => (
              <div key={index} style={{
                animation: 'pular 1.5s infinite',
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
                <p style={{
                  fontFamily: '"Bitcount Grid Double", system-ui',
                  fontSize: '15px',
                  color: '#ffe6f1',
                  fontWeight: '400',
                  textShadow: '0 0 4px rgb(0, 0, 0)',
                  margin: 0
                }}>{platform.name}</p>
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
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(255, 0, 128, 0.25)',
              gap: '1px',
              color: '#ffffff'
            }}>
              <p style={{
                fontFamily: '"Bitcount Grid Double", system-ui',
                fontSize: '15px',
                color: '#ffe6f1',
                fontWeight: '400',
                textShadow: '0 0 4px rgb(0, 0, 0)',
                margin: 0
              }}>Nenhuma plataforma configurada</p>
            </div>
          )}
            </div>

        {/* Botões de redes sociais */}
        <div style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          margin: '20px 0'
        }}>
          <a 
            href={clientCustomizations.whatsappLink}
            style={{
              textDecoration: 'none',
              color: '#fff',
              backgroundImage: 'linear-gradient(rgb(8, 180, 74), rgb(38, 90, 38))',
              padding: '10px',
              borderRadius: '5px',
              position: 'relative',
              fontSize: '11px',
              fontWeight: 'bold',
              animation: 'pulse 1.5s infinite',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
              marginRight: '10px',
              marginLeft: '10px'
            }}
          >
            <p style={{ margin: 0 }}>WhatsApp</p>
          </a>
          
          <a 
            href={clientCustomizations.instagramLink}
            style={{
              textDecoration: 'none',
              color: '#fff',
              backgroundImage: 'repeating-linear-gradient(rgb(150, 11, 230), rgb(211, 81, 21), rgb(158, 143, 9))',
              padding: '10px',
              borderRadius: '5px',
              position: 'relative',
              fontSize: '11px',
              fontWeight: 'bold',
              animation: 'pulse 1.5s infinite',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
              marginRight: '10px',
              marginLeft: '10px'
            }}
          >
            <p style={{ margin: 0 }}>Instagram</p>
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
              animation: 'pulse 1.5s infinite',
              fontWeight: 'bold'
            }}
          >
            Como Jogar
          </button>
            </div>

        {/* Informações do Bitcoin */}
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

        {/* Informações em movimento */}
        <div style={{
          color: '#ffffff',
          margin: 'auto',
          maxWidth: '400px'
        }}>
          <div style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            animation: 'scroll-left 20s linear infinite'
          }}>
            Ao abrir o site pela primeira vez, deixe aberto por 30 min <strong>SEM ATUALIZAR O SITE</strong> para uma analise mais precisa!. Porcentagens analisadas por IA com base no bitcoin para as <strong>PLATAFORMAS DESTE SITE.</strong>
          </div>
        </div>

        {/* Contador de próxima atualização */}
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

        {/* Botão para alternar entre tipos de jogos */}
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
          padding: '0 16px',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(255, 0, 127, 0.35)',
          cursor: 'pointer'
        }}>
          <button 
            onClick={toggleGameType}
            style={{
              textDecoration: 'none',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 'bold',
              color: 'white',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'inherit'
            }}
          >
            {currentGameType === 'PG' ? 'MUDAR PARA PP SLOTs' : 'MUDAR PARA PG SLOTs'}
          </button>
                </div>

        {/* Container de jogos */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '0px',
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
              <div style={{ width: '100%' }}>
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
              </div>
              
              <div style={{
                textAlign: 'center',
                width: '100%',
                borderRadius: '5px'
              }}>
                <p style={{
                  fontSize: '0.6em',
                  color: '#ffffff',
                  margin: '5px 0'
                }}>Aposta Padrão</p>
                <div style={{
                  paddingTop: '0px',
                  paddingBottom: '0px',
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

              <div style={{
                textAlign: 'center',
                width: '100%',
                borderRadius: '5px'
              }}>
                <p style={{
                  fontSize: '0.6em',
                  color: '#ffffff',
                  margin: '5px 0'
                }}>Aposta Mínima</p>
                <div style={{
                  paddingTop: '0px',
                  paddingBottom: '0px',
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
              
              <div style={{
                textAlign: 'center',
                width: '100%',
                borderRadius: '5px'
              }}>
                <p style={{
                  fontSize: '0.6em',
                  color: '#ffffff',
                  margin: '5px 0'
                }}>Aposta Máxima</p>
                <div style={{
                  paddingTop: '0px',
                  paddingBottom: '0px',
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
                color: 'rgb(255, 255, 255)',
                fontSize: '9px',
                width: '100px',
                fontWeight: 'bolder',
                marginTop: '5px',
                borderRadius: '5px',
                textAlign: 'center',
                padding: '2px 4px'
              }}>
                Min Pagantes: {getRandomNumbers()}
              </div>
            </div>
          ))}
          </div>

        {/* Botão para carregar mais jogos PG */}
        {!allGamesLoaded && currentGameType === 'PG' && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0'
          }}>
            <button 
              onClick={loadMoreGames}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
              }}
            >
              Carregar Mais Jogos ({pgGames.length - 20} restantes)
            </button>
          </div>
        )}

        {/* Termos */}
        <div style={{
          display: 'block',
          margin: '10px auto',
          maxWidth: '400px',
          padding: '10px',
          backgroundColor: '#8f8f8f3f',
          borderRadius: '10px',
          color: 'white'
        }}>
          <p style={{ textAlign: 'center', margin: 0 }}>
            <a 
              href="/termos"
              style={{
                backgroundColor: '#218838',
                padding: '5px 10px',
                borderRadius: '5px',
                textAlign: 'center',
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              Termos de Uso e Política de Privacidade
            </a>
          </p>
        </div>

        {/* Footer - Como Jogar */}
        <div style={{ width: '100%' }}>
          <footer 
            id="como-jogar"
            style={{
              margin: '10px auto',
              maxWidth: '400px',
              backgroundColor: 'rgba(0, 0, 0, 0.459)',
              height: 'auto',
              textAlign: 'center',
              border: '2px solid rgb(30, 255, 0)',
              padding: '10px'
            }}
          >
            <h1 style={{ marginBottom: '20px', color: 'white' }}>Como jogar</h1>
            <p style={{ color: 'rgb(255, 255, 255)', textDecoration: 'none', fontWeight: 'bold', marginTop: '5px' }}>
              Aposta Padrão = bet de R$1,00 a R$1,80
            </p>
            <p style={{ color: 'rgb(255, 255, 255)', textDecoration: 'none', fontWeight: 'bold', marginTop: '5px' }}>
              Aposta Mínima = bet de R$0,40 a R$0,80.
            </p>
            <p style={{ color: 'rgb(255, 255, 255)', textDecoration: 'none', fontWeight: 'bold', marginTop: '5px' }}>
              Aposta Máxima = bet de R$2,00 ou mais.
            </p>
            <br />

            <p style={{ color: 'rgb(255, 255, 255)', textDecoration: 'none', fontWeight: 'bold', marginTop: '5px' }}>
              Min pagantes: é o ultimo número do seu relógio , você deve jogar quando ele aparecer.
            </p>
            <p style={{ color: 'rgb(255, 255, 255)', textDecoration: 'none', fontWeight: 'bold', marginTop: '5px' }}>
              Ex: min pagantes 3 e no relogio aparece 14:0(3) &lt;-
            </p>
            <br />

            <h3 style={{ color: 'red', marginTop: '10px' }}>
              🔞Aviso Legal:
              Este site tem caráter meramente informativo e não realiza, promove ou incentiva apostas ou jogos de azar. As porcentagens exibidas são baseadas em dados públicos ou análises próprias e não garantem ganhos ou resultados. O usuário é inteiramente responsável por suas decisões ao utilizar qualquer plataforma mencionada. Verifique sempre as leis locais antes de participar de qualquer atividade relacionada a jogos de azar.
            </h3>
          </footer>
        </div>
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }

        @keyframes pular {
          100%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-3px);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgb(255, 255, 255);
          }
          30% {
            box-shadow: 0 0 2px 2px rgb(255, 255, 255);
          }
          40% {
            box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.274);
          }
          60% {
            box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.301);
          }
          80% {
            box-shadow: 0 0 2px 2px rgb(255, 255, 255);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.219);
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @media (max-width: 768px) {
          body {
            margin: 0;
            padding: 0;
            width: 100vw;
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientSite;