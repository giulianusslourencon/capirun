import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
  image?: { src: string; alt: string };
};

const loreItems: FaqItem[] = [
  {
    question: "Quem é a CapiVisio?",
    answer:
      "A CapiVisio é você. Do RH, organizada e paciente — mas cada vez mais preocupada com o prazo. No puzzle, é a personagem que você guia pelo caminho até o Lorenzzo Lopez, coletando os dígitos ao longo do trajeto para formar a senha de cada fase.",
  },
  {
    question: "O que é o Lorenzzo Lopez?",
    answer:
      "O Lorenzzo Lopez é o tênis desaparecido. Um objeto inanimado, mas com presença forte na cultura da empresa — vindo direto de Bertioga para ser o prêmio do sorteio do All Hands. Dentro do jogo, é o destino final da CapiVisio em cada puzzle.",
  },
  {
    question: "O que é o All Hands?",
    answer:
      "O All Hands é o evento de sexta-feira da semana presencial onde o Lorenzzo Lopez seria sorteado como prêmio especial. Foi MauMau quem pediu para que o tênis fosse entregue diretamente de Bertioga — mas algo de estranho aconteceu antes que chegasse ao evento…",
  },
];

const sudokuItems: FaqItem[] = [
  {
    question: "Solução única",
    answer:
      "Cada puzzle do desafio possui exatamente uma solução correta para o Sudoku e exatamente um caminho correto para a CapiVisio. Não há ambiguidade — se mais de uma opção parece funcionar, alguma das regras ainda está sendo violada.",
  },
  {
    question: "O que é um Sudoku 4×4?",
    answer:
      "Um Sudoku 4×4 é uma grade com 4 linhas e 4 colunas, dividida em quatro regiões de 2×2 células. O objetivo é preencher cada célula com um número de 1 a 4 seguindo três regras simples.",
    image: {
      src: "/faq/sudoku-blank.svg",
      alt: "Grade vazia de Sudoku 4×4 com as quatro regiões 2×2 demarcadas",
    },
  },
  {
    question: "Regra das linhas",
    answer:
      "Cada linha deve conter exatamente os números 1, 2, 3 e 4 — sem repetição. Nenhum número pode aparecer duas vezes na mesma linha.",
    image: {
      src: "/faq/sudoku-rows.svg",
      alt: "Linha destacada em amarelo mostrando os números 1, 2, 3 e 4 preenchidos",
    },
  },
  {
    question: "Regra das colunas",
    answer:
      "Cada coluna também deve conter os números 1, 2, 3 e 4 sem repetição. Vale a mesma restrição das linhas, mas na vertical.",
    image: {
      src: "/faq/sudoku-cols.svg",
      alt: "Coluna destacada em azul mostrando os números 1, 3, 2 e 4 preenchidos",
    },
  },
  {
    question: "Regra das regiões",
    answer:
      "Cada uma das quatro regiões de 2×2 células deve conter os números 1, 2, 3 e 4 sem repetição. As três regras devem ser satisfeitas ao mesmo tempo.",
    image: {
      src: "/faq/sudoku-regions.svg",
      alt: "Região 2×2 destacada em verde mostrando os números 3, 4, 1 e 2 preenchidos",
    },
  },
  {
    question: "Como fica um Sudoku 4×4 resolvido?",
    answer:
      "Com as três regras aplicadas simultaneamente, cada linha, coluna e região 2×2 terá exatamente 1, 2, 3 e 4. Cada puzzle possui exatamente uma solução válida — se mais de uma parece funcionar, alguma regra ainda está sendo violada.",
    image: {
      src: "/faq/sudoku-complete.svg",
      alt: "Sudoku 4×4 completamente resolvido com todos os números preenchidos",
    },
  },
];

const capirunItems: FaqItem[] = [
  // — non-diagonal rules —
  {
    question: "Como funciona o caminho da CapiVisio?",
    answer:
      "A CapiVisio precisa traçar um caminho contínuo até o Lorenzzo Lopez. O caminho passa pelo centro de cada célula visitada. O movimento padrão é feito pelas laterais das células — para cima, para baixo, para a esquerda ou para a direita.",
    image: {
      src: "/faq/capirun-path.svg",
      alt: "Grade 4×4 com um caminho verde contínuo partindo do canto superior esquerdo e chegando ao canto inferior direito",
    },
  },
  {
    question: "O caminho não pode revisitar células",
    answer:
      "Uma vez que o caminho passa por uma célula, ele não pode voltar a ela. No exemplo abaixo, o segmento vermelho mostra uma tentativa inválida de retornar a uma célula já visitada.",
    image: {
      src: "/faq/capirun-revisit.svg",
      alt: "Caminho que tenta retornar a uma célula já visitada, com o segmento inválido em vermelho",
    },
  },
  {
    question: "O que são os bloqueios roxos?",
    answer:
      "Bloqueios roxos são barreiras que aparecem nas bordas entre células ou nos vértices onde células se encontram — funcionam como paredes num labirinto. O caminho não pode cruzar uma borda com bloqueio. No exemplo abaixo, o segmento vermelho mostra uma tentativa inválida de cruzar um bloqueio de borda.",
    image: {
      src: "/faq/capirun-blocker-wall.svg",
      alt: "Grade com bloqueio roxo numa borda; segmento vermelho mostra tentativa inválida de cruzar a barreira",
    },
  },
  // — diagonal rules —
  {
    question: "Quando é possível se mover na diagonal?",
    answer:
      "A CapiVisio pode se mover na diagonal quando existe um espaço 2×2 completamente livre — ou seja, as quatro células que formam esse quadrado não podem ter nenhum bloqueio roxo. O movimento diagonal nunca pode tocar o canto ou a borda de um bloqueio roxo.",
    image: {
      src: "/faq/capirun-diagonal.svg",
      alt: "Caminho com um segmento diagonal em amarelo tracejado cruzando um espaço 2×2 livre destacado",
    },
  },
  {
    question: "O caminho não pode se cruzar",
    answer:
      "O caminho não pode cruzar a si mesmo. Com movimentos diagonais isso pode acontecer mesmo sem revisitar células — dois diagonais em sentidos opostos dentro do mesmo espaço 2×2 se cruzam no meio. O segmento vermelho abaixo mostra uma diagonal que cruzaria o caminho já traçado.",
    image: {
      src: "/faq/capirun-cross.svg",
      alt: "Caminho com uma diagonal que tentaria cruzar um segmento anterior, com o trecho inválido em vermelho",
    },
  },
  {
    question: "Bloqueios roxos e o movimento diagonal",
    answer:
      "Ao se mover na diagonal, o caminho não pode tocar nenhum bloqueio roxo — nem de borda nem de vértice. O espaço 2×2 atravessado deve estar completamente livre de bloqueios. O segmento vermelho abaixo mostra uma diagonal inválida que encosta num bloqueio de vértice.",
    image: {
      src: "/faq/capirun-blocker-corner.svg",
      alt: "Grade com bloqueio roxo num vértice; segmento vermelho mostra diagonal inválida que toca o bloqueio",
    },
  },
];

function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <Accordion type="multiple" className="w-full rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-200">
        {items.map((item) => (
          <AccordionItem key={item.question} value={item.question} className="px-5 not-last:border-b-0">
            <AccordionTrigger className="font-semibold text-gray-900 py-4 text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
              {item.image && (
                <div className="flex justify-center mt-3">
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    role="img"
                    width={240}
                    height={240}
                    className="rounded-lg border border-gray-100"
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <PageWrapper title="FAQ">
        <div className="flex flex-col gap-8">
          <FaqSection title="A História" items={loreItems} />
          <hr className="border-gray-200" />
          <FaqSection title="Sudoku 4×4" items={sudokuItems} />
          <hr className="border-gray-200" />
          <FaqSection title="Regras do CapiRun" items={capirunItems} />
        </div>
      </PageWrapper>
    </>
  );
}
