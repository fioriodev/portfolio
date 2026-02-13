import { useState, useEffect } from 'react';
import { Github, Linkedin, ExternalLink, Mail } from 'lucide-react';
// Se a imagem estiver em public/medium-logo.png, o Vite entende o caminho abaixo:
import etanolGasolina from '/etanol-gasolina.png';
import frasesMotivacionais from '/frases-motivacionais.png'
import criptoApp from '/criptoapp.png'
import listaTarefas from '/lista-tarefas.png'

const ReactIcon = () => (
  <svg width="24" height="24" viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#61DAFB] animate-[spin_10s_linear_infinite]">
    <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const TSIcon = () => (
  <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-sm overflow-hidden">
    <path d="M0 0H100V100H0V0Z" fill="#3178C6"/>
    <path d="M36.1 72H41.5V31.4H23V36.6H36.1V72ZM72.4 49.3C69.3 47.7 65.8 46.8 62.1 46.8C55.6 46.8 51.1 50.1 51.1 55.7C51.1 60.5 54.4 63.4 60.3 65.7C65.5 67.7 67.3 69.1 67.3 71.8C67.3 74.8 64.7 76.8 60 76.8C55 76.8 50.2 74.9 46.5 71.9L43 76.8C47.7 80.9 54 83 60.1 83C67.8 83 73.1 78.6 73.1 71.5C73.1 66.2 69.6 63.3 63.3 60.9C58.4 59.1 56.9 57.8 56.9 55.5C56.9 53 59.2 51.4 63 51.4C66.8 51.4 69.8 52.4 72.8 54.1L75.5 49L72.4 49.3Z" fill="white"/>
  </svg>
);

const Portfolio = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ 
        x: event.clientX, 
        // Soma a posição do mouse com a distância percorrida no scroll
        y: event.clientY + window.scrollY 
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const projetos = [
    {
      title: "Lista de Tarefas",
      description: "Gerenciador de atividades completo com persistência de dados, filtros de status e edição dinâmica de tarefas.",
      tech: ["React", "TypeScript", "Local Storage", "Lucide Icons"],
      linkGithub: "https://github.com/fioriolab/react-labs-hub/tree/main/apps/lista-tarefas", // Verifique se o caminho da pasta está correto
      linkDemo: "https://react-labs-hub-lista-tarefas.vercel.app/", // Substitua pela sua URL da Vercel
      image: listaTarefas
    },
    {
      title: "Etanol ou Gasolina",
      description: "Calculadora inteligente que utiliza a regra dos 70% para definir o melhor custo-benefício entre combustíveis.",
      tech: ["React", "TypeScript", "Hooks"],
      linkGithub: "https://github.com/fioriolab/react-labs-hub/tree/main/apps/etanol-ou-gasolina",
      linkDemo: "https://react-labs-hub-etanol-ou-gasolina.vercel.app/",
      image: etanolGasolina
    },
    {
      title: "Frases Motivacionais",
      description: "Um gerador de mensagens inspiradoras que utiliza estados do React para alternar conteúdos de forma dinâmica e aleatória.",
      tech: ["React", "TypeScript", "State Management"],
      linkGithub: "https://github.com/fioriolab/react-labs-hub/tree/main/apps/projeto-frases",
      linkDemo: "https://react-labs-hub-projeto-frases.vercel.app/",
      image: frasesMotivacionais
    },
    {
      title: "Cripto App",
      description: "Consumo de API em tempo real (CoinCap) com paginação infinita (Load More). O projeto foca em tipagem estrita com TypeScript, formatação de dados monetários complexos com a API Intl e uma interface de tabela dinâmica com carregamento sob demanda (pagination).",
      tech: ["React", "TypeScript", "React Router", "Rest API"],
      linkGithub: "https://github.com/fioriolab/react-labs-hub/tree/main/apps/criptoapp",
      linkDemo: "https://criptoapp.vercel.app/",
      image: criptoApp
    }
  ];

  return (

    <div className="relative bg-[#0d1117] text-slate-300 min-h-screen w-full font-sans selection:bg-[#61DAFB] selection:text-[#0d1117]">
      {/* Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(97, 218, 251, 0.15), transparent 80%)`
        }}
      />

      {/* Todo o resto do seu código (main, header, etc) vem abaixo aqui */}
      <main className="max-w-screen-xl mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-white to-[#61DAFB] bg-clip-text text-transparent">
                  React Labs Hub
                </h1>
                {/* Ícones ao lado do título principal */}
                <div className="flex gap-2 opacity-80">
                  <ReactIcon />
                  <TSIcon />
                </div>
              </div>

              <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
                Projeto de <span className="text-[#61DAFB]">Guilherme Henrique Fiorio Martins</span>
                <br />
                <span className="text-sm font-normal text-slate-400 tracking-widest uppercase italic">
                  Especialista Front-End • React & TypeScript
                </span>
              </h2>
              <p className="mt-4 max-w-xs leading-normal text-slate-400">
                Explorando o ecossistema React através de projetos práticos, focados em código limpo e interfaces performáticas.
              </p>

              {/* O Menu agora está colado na descrição (mt-16 controla a distância) */}
              <nav className="hidden lg:block mt-16">
                <ul className="flex flex-col gap-4 uppercase text-xs font-bold tracking-widest text-slate-500">
                  <li>
                    <a href="#sobre" className="group flex items-center py-3">
                      <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-[#61DAFB] group-focus-visible:w-16 group-focus-visible:bg-slate-200"></span>
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                        01. Sobre
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="#projetos" className="group flex items-center py-3">
                      <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-[#61DAFB] group-focus-visible:w-16 group-focus-visible:bg-slate-200"></span>
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                        02. Projetos
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Div inferior: Apenas Redes Sociais no pé da página */}
            <div className="flex items-center gap-5 mt-8 lg:mt-0">
              <a href="https://github.com/fioriolab" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">
                <Github />
              </a>
              <a href="https://www.linkedin.com/in/guilhermehenriquefju/" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">
                <Linkedin />
              </a>
              <a href="mailto:guilherme.fiorio.dev@outlook.com" className="hover:text-slate-200 transition-colors">
                <Mail />
              </a>
            </div>
          </header>

          {/* DIREITA */}
          <div className="pt-24 lg:w-1/2 lg:py-24 flex flex-col gap-24">
            
            <section id="sobre" className="scroll-mt-24">
              <div className="text-slate-400 text-lg leading-relaxed flex flex-col gap-4">
                <p>
                  Este site funciona como um <span className="text-[#61DAFB] font-medium">Hub Central de Projetos</span> pessoal, 
                  desenvolvido para consolidar meus estudos e práticas em <span className="text-slate-200">React e TypeScript</span>. 
                  Aqui, cada aplicação é um laboratório onde exploro conceitos como hooks customizados, performance, 
                  manipulação de estados complexos e integração de APIs.
                </p>

                <p>
                  Utilizo uma estrutura de <span className="text-slate-200">Monorepo com Turborepo</span> para gerenciar múltiplos 
                  aplicativos de forma profissional, garantindo escalabilidade e organização no meu fluxo de aprendizado 
                  Front-End.
                </p>

                {/* Você pode manter seus parágrafos sobre e-commerce abaixo se desejar, ou focar apenas no técnico */}
              </div>
            </section>

            <section id="projetos">
              <h3 className="text-slate-200 font-bold mb-8 uppercase tracking-widest text-sm">Projetos em Destaque</h3>
              
              <div className="flex flex-col gap-12">
                {projetos.map((proj, index) => (
                  <div key={index} className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 md:gap-8 lg:hover:!opacity-100 border border-transparent hover:border-slate-800 p-4 rounded-lg hover:bg-slate-600/50">
                    
                    {/* MINIATURA */}
                    <div className="sm:col-span-2">
                      <img 
                        src={proj.image} 
                        alt={proj.title}
                        className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 object-cover w-full h-auto"
                      />
                    </div>

                    {/* TEXTO */}
                    <div className="sm:col-span-6">
                      <h4 className="font-medium leading-tight text-slate-200 group-hover:text-slate-300 transition-colors">
                        <a href={proj.linkDemo} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                          {proj.title} <ExternalLink size={16} />
                        </a>
                      </h4>
                      <p className="mt-2 text-sm leading-normal text-slate-400">{proj.description}</p>
                      
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {proj.tech.map((t, i) => (
                          <li key={i} className="rounded-full bg-[#61DAFB]/10 px-3 py-1 text-xs font-medium text-[#61DAFB]">
                            {t}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex gap-4">
                        <a href={proj.linkGithub} target="_blank" rel="noreferrer" className="text-xs hover:text-slate-300 flex items-center gap-1">
                          <Github size={14} /> Código
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;