export type Category = "Romance" | "Drama" | "Ação" | "Mistério" | "Fantasia";

export interface Series {
  slug: string;
  title: string;
  category: Category;
  kind: "Série" | "Novela";
  description: string;
  longSynopsis: string;
  cover: string;
  backdrop: string;
  rating: number;
  year: number;
  episodesCount: number;
  durationLabel: string;
  tags: string[];
  cast: string[];
  trending?: boolean;
  isNew?: boolean;
  top10?: number;
  videoPool: string[];
  matchScore: number;
}

const VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
];

const HERO_BG =
  "https://images.pexels.com/photos/36806859/pexels-photo-36806859.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export const HERO_SERIES_SLUG = "amor-proibido";

export const SERIES: Series[] = [
  {
    slug: "amor-proibido",
    title: "Amor Proibido",
    category: "Drama",
    kind: "Novela",
    description: "Ela se casou por vingança. Ele se apaixonou por engano. Agora nenhum dos dois pode voltar atrás.",
    longSynopsis:
      "Helena aceita se casar com o herdeiro da família que destruiu a sua para descobrir a verdade. Mas entre segredos, traições e noites de confissão, ela se vê dividida entre a vingança que planejou por 10 anos e o amor que nunca deveria ter nascido. Cada episódio termina em um cliffhanger devastador.",
    cover:
      "https://images.pexels.com/photos/11140118/pexels-photo-11140118.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop: HERO_BG,
    rating: 4.9,
    year: 2026,
    episodesCount: 60,
    durationLabel: "1-2 min/ep",
    tags: ["Vingança", "Triângulo amoroso", "Segredos de família"],
    cast: ["Marina Costa", "Rafael Duarte", "Camila Queiroz"],
    trending: true,
    top10: 1,
    videoPool: VIDEOS,
    matchScore: 98,
  },
  {
    slug: "contrato-de-paixao",
    title: "Contrato de Paixão",
    category: "Romance",
    kind: "Série",
    description: "Um contrato de 30 dias. Uma regra: não se apaixonar. Eles quebraram no dia 3.",
    longSynopsis:
      "Para salvar a empresa da família, Alice assina um contrato de noivado falso com o bilionário arrogante Theo Montenegro. O que era para ser apenas negócios vira desejo, ciúme e um segredo que pode custar tudo. A série de romance mais maratonada da Aurora.",
    cover:
      "https://images.pexels.com/photos/7719565/pexels-photo-7719565.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/15960437/pexels-photo-15960437.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.8,
    year: 2026,
    episodesCount: 80,
    durationLabel: "1-2 min/ep",
    tags: ["Bilionário", "Fake dating", "Hot"],
    cast: ["Alice Ferraz", "Theo Sales", "Duda Reis"],
    trending: true,
    top10: 2,
    videoPool: VIDEOS.slice().reverse(),
    matchScore: 97,
  },
  {
    slug: "o-herdeiro-perdido",
    title: "O Herdeiro Perdido",
    category: "Mistério",
    kind: "Série",
    description: "Ele voltou dos mortos para reclamar o império — e descobrir quem tentou matá-lo.",
    longSynopsis:
      "Dado como morto há 7 anos, Daniel Vasques retorna com outra identidade para se infiltrar na própria família. Cada episódio revela uma nova pista, uma nova traição e um novo suspeito. Quem apertou o gatilho naquela noite?",
    cover:
      "https://images.pexels.com/photos/10508233/pexels-photo-10508233.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/12686205/pexels-photo-12686205.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.9,
    year: 2025,
    episodesCount: 50,
    durationLabel: "1-3 min/ep",
    tags: ["Suspense", "Identidade secreta", "Reviravolta"],
    cast: ["Daniel Vasques", "Laura Prado", "Enzo Mota"],
    trending: true,
    top10: 3,
    videoPool: VIDEOS,
    matchScore: 96,
  },
  {
    slug: "lua-de-lobos",
    title: "Lua de Lobos",
    category: "Fantasia",
    kind: "Série",
    description: "Ela é a última loba branca. Ele é o alfa que jurou matá-la. O destino riu dos dois.",
    longSynopsis:
      "Em um mundo onde alfas controlam territórios, Maya descobre ser a loba da profecia na noite em que deveria ser executada. Kael, o alfa mais temido, precisa decidir entre a lei do bando e o vínculo que o consome. Fantasia, desejo e batalhas épicas.",
    cover:
      "https://images.pexels.com/photos/35049220/pexels-photo-35049220.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/9527447/pexels-photo-9527447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.7,
    year: 2026,
    episodesCount: 65,
    durationLabel: "1-2 min/ep",
    tags: ["Lobisomem", "Destino", "Alfa"],
    cast: ["Maya Lins", "Kael Braga", "Ivy Santos"],
    trending: true,
    isNew: true,
    top10: 4,
    videoPool: VIDEOS,
    matchScore: 95,
  },
  {
    slug: "segredo-bilionario",
    title: "Segredo Bilionário",
    category: "Drama",
    kind: "Novela",
    description: "Faxineira de dia, herdeira à noite. Ninguém pode saber quem ela realmente é.",
    longSynopsis:
      "Beatriz se disfarça de faxineira no próprio conglomerado para desmascarar quem roubou sua herança. Lá ela conhece o CEO frio que a humilha sem saber que ela é dona de tudo. Drama, poder e um romance improvável.",
    cover:
      "https://images.pexels.com/photos/14738813/pexels-photo-14738813.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/16077169/pexels-photo-16077169.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.8,
    year: 2025,
    episodesCount: 70,
    durationLabel: "1-2 min/ep",
    tags: ["Herdeira secreta", "CEO", "Vingança"],
    cast: ["Beatriz Moura", "Gustavo Leal", "Vivi Ann"],
    trending: true,
    top10: 5,
    videoPool: VIDEOS,
    matchScore: 94,
  },
  {
    slug: "casamento-por-vinganca",
    title: "Casamento por Vingança",
    category: "Romance",
    kind: "Novela",
    description: "Ela se casou com o inimigo para destruí-lo. Ele se casou por amor. Só um vai vencer.",
    longSynopsis:
      "No altar, Sofia sorri. Ninguém imagina que aquele casamento é o primeiro passo de um plano de destruição meticuloso contra a família Almeida. Mas o noivo, Lucas, guarda ele mesmo um segredo capaz de virar o jogo.",
    cover:
      "https://images.pexels.com/photos/15396566/pexels-photo-15396566.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/4483347/pexels-photo-4483347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.6,
    year: 2026,
    episodesCount: 75,
    durationLabel: "1-2 min/ep",
    tags: ["Casamento", "Segredos", "Enemies to lovers"],
    cast: ["Sofia Prado", "Lucas Gil", "Nanda Costa"],
    trending: false,
    isNew: true,
    top10: 6,
    videoPool: VIDEOS,
    matchScore: 93,
  },
  {
    slug: "imperio-de-sombras",
    title: "Império de Sombras",
    category: "Ação",
    kind: "Série",
    description: "Ex-agente. Nova identidade. Uma última missão que ele não pode recusar.",
    longSynopsis:
      "Depois de forjar a própria morte, o agente Victor Cruz vive escondido até que sua filha é sequestrada pelo cartel que ele ajudou a derrubar. Agora ele tem 48 horas, 12 inimigos e zero misericórdia. Ação frenética em episódios viciantes.",
    cover:
      "https://images.pexels.com/photos/33290985/pexels-photo-33290985.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/32260696/pexels-photo-32260696.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.7,
    year: 2025,
    episodesCount: 55,
    durationLabel: "1-2 min/ep",
    tags: ["Ação", "Máfia", "Resgate"],
    cast: ["Victor Cruz", "Nina Salles", "Ruan Pablo"],
    trending: true,
    top10: 7,
    videoPool: VIDEOS,
    matchScore: 92,
  },
  {
    slug: "a-feiticeira",
    title: "A Feiticeira de Salem",
    category: "Fantasia",
    kind: "Série",
    description: "Queimaram sua mãe como bruxa. Agora a magia despertou nela — e ela veio cobrar.",
    longSynopsis:
      "Na véspera do seu casamento arranjado, Elena descobre grimórios, visões e um poder ancestral que corre no sangue. Caçada pela inquisição moderna, ela precisa dominar a magia antes da lua cheia ou perder tudo.",
    cover:
      "https://images.pexels.com/photos/39235527/pexels-photo-39235527.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/12069547/pexels-photo-12069547.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.6,
    year: 2026,
    episodesCount: 62,
    durationLabel: "1-2 min/ep",
    tags: ["Bruxas", "Magia", "Profecia"],
    cast: ["Elena Vidal", "Rowan Grey", "Morgana Lys"],
    isNew: true,
    top10: 8,
    videoPool: VIDEOS,
    matchScore: 91,
  },
  {
    slug: "coracao-em-chamas",
    title: "Coração em Chamas",
    category: "Drama",
    kind: "Novela",
    description: "Bombeiro e médica. O fogo os uniu. O passado pode separá-los para sempre.",
    longSynopsis:
      "Após perder o irmão em um incêndio criminoso, o bombeiro Gabriel jura vingança. A médica Lívia, que esconde ligação com o incendiário, se apaixona por ele. Entre sirenes, plantões e segredos, o amor arde mais que o fogo.",
    cover:
      "https://images.pexels.com/photos/30167036/pexels-photo-30167036.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop: HERO_BG,
    rating: 4.5,
    year: 2024,
    episodesCount: 58,
    durationLabel: "1-2 min/ep",
    tags: ["Bombeiros", "Romance proibido", "Superação"],
    cast: ["Gabriel Fênix", "Lívia Brandão", "Caio Nobre"],
    top10: 9,
    videoPool: VIDEOS,
    matchScore: 90,
  },
  {
    slug: "rainha-do-crime",
    title: "Rainha do Crime",
    category: "Ação",
    kind: "Série",
    description: "Traída pelo próprio cartel, ela construiu um império maior. Agora eles imploram piedade.",
    longSynopsis:
      "Valentina era a contadora do cartel até ser entregue à polícia pelo próprio marido. Na prisão, ela fez alianças, aprendeu o jogo e saiu para tomar tudo. Poder, luxo, perigo e uma protagonista que você vai amar temer.",
    cover:
      "https://images.pexels.com/photos/7322154/pexels-photo-7322154.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/12686205/pexels-photo-12686205.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.8,
    year: 2025,
    episodesCount: 68,
    durationLabel: "1-2 min/ep",
    tags: ["Máfia", "Protagonista forte", "Poder"],
    cast: ["Valentina Rojo", "Diego Fuentes", "La Niña"],
    trending: true,
    top10: 10,
    videoPool: VIDEOS,
    matchScore: 89,
  },
  {
    slug: "destino-cruzado",
    title: "Destino Cruzado",
    category: "Mistério",
    kind: "Novela",
    description: "Duas gêmeas separadas no berço. Uma morta. A outra precisa assumir sua vida para sobreviver.",
    longSynopsis:
      "Quando sua irmã gêmea é assassinada, Júlia assume a identidade dela para descobrir o assassino — e mergulha numa teia de mentiras na mansão dos Vasconcellos, onde todos têm motivo e ninguém é inocente.",
    cover:
      "https://images.pexels.com/photos/30505963/pexels-photo-30505963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/15960437/pexels-photo-15960437.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.7,
    year: 2026,
    episodesCount: 72,
    durationLabel: "1-2 min/ep",
    tags: ["Gêmeas", "Troca de identidade", "Thriller"],
    cast: ["Júlia / Helena Prado", "Otto Vasconcellos", "Mara Vilela"],
    isNew: true,
    videoPool: VIDEOS,
    matchScore: 88,
  },
  {
    slug: "noiva-do-bilionario",
    title: "A Noiva do Bilionário",
    category: "Romance",
    kind: "Novela",
    description: "Grávida, abandonada e sem nada — até o bilionário que ela odiava lhe fazer uma proposta.",
    longSynopsis:
      "Demitida e grávida, Clara é despejada na chuva. O único que estende a mão é Adrian Costa, o CEO arrogante que ela humilhou em público. Proposta: case-se comigo por 1 ano e eu protejo seu bebê. O que pode dar errado?",
    cover:
      "https://images.pexels.com/photos/7719558/pexels-photo-7719558.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    backdrop:
      "https://images.pexels.com/photos/9527447/pexels-photo-9527447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    rating: 4.9,
    year: 2026,
    episodesCount: 85,
    durationLabel: "1-2 min/ep",
    tags: ["Gravidez secreta", "Bilionário", "Casamento falso"],
    cast: ["Clara Antunes", "Adrian Costa", "Paula Mesquita"],
    trending: true,
    isNew: true,
    videoPool: VIDEOS,
    matchScore: 99,
  },
];

export const CATEGORIES: Category[] = ["Romance", "Drama", "Ação", "Mistério", "Fantasia"];

export function getSeries(slug: string) {
  return SERIES.find((s) => s.slug === slug);
}

export interface Episode {
  number: number;
  title: string;
  synopsis: string;
  durationSec: number;
  thumbnail: string;
  videoUrl: string;
}

const EP_TITLE_FRAGMENTS = [
  "O Encontro",
  "Segredos Revelados",
  "A Traição",
  "Noite Decisiva",
  "Confissão",
  "O Plano",
  "Sem Volta",
  "Corações em Jogo",
  "A Descoberta",
  "Beijo Proibido",
  "A Emboscada",
  "Verdades Ocultas",
  "Ponto de Ruptura",
  "Reencontro",
  "O Preço do Amor",
];

export function getEpisodes(series: Series, count?: number): Episode[] {
  const total = count ?? series.episodesCount;
  const eps: Episode[] = [];
  for (let i = 1; i <= total; i++) {
    const frag = EP_TITLE_FRAGMENTS[(i - 1) % EP_TITLE_FRAGMENTS.length];
    eps.push({
      number: i,
      title: `${frag} — Parte ${i}`,
      synopsis: `No episódio ${i} de ${series.title}, uma revelação muda tudo: ${frag.toLowerCase()} coloca ${series.cast[0]} diante de uma escolha impossível.`,
      durationSec: 75 + ((i * 37) % 60),
      thumbnail: series.cover,
      videoUrl: series.videoPool[(i - 1) % series.videoPool.length],
    });
  }
  return eps;
}

export function isEpisodeLocked(epNumber: number, plan: "free" | "premium" | undefined) {
  if (plan === "premium") return false;
  return epNumber > 5;
}

export function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
