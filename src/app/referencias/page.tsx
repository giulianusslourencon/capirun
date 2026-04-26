import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMood } from "@/lib/capiVisioMood";

type Reference = {
  title: string;
  author?: string;
  description: string;
  url: string;
  domain: string;
  image?: { src: string; alt: string };
};

const references: Reference[] = [
  {
    title: "Cracking the Cryptic",
    author: "Simon Anthony & Mark Goodliffe",
    description:
      "O canal que mostrou pra mim que sudoku pode ser arte, além de um maravilhoso hobbie. Caso tenham gostado de resolver esses puzzles, aqui vão encontrar pelo menos dois por dia.",
    url: "https://www.youtube.com/@CrackingTheCryptic",
    domain: "youtube.com",
    image: {
      src: "/referencias/cracking-the-cryptic.jpg",
      alt: "Logo do canal Cracking the Cryptic",
    },
  },
  {
    title: "Rat Run",
    author: "Marty Sears",
    description:
      "A mecânica principal desse desafio foi baseada nessa série de puzzles.",
    url: "https://www.youtube.com/playlist?list=PLK-l8O0YikOmTo_9JS-8mhPe0ikw4IDms",
    domain: "youtube.com",
    image: {
      src: "/referencias/rat-run.png",
      alt: "Imagem de dois ratos (Finkz e Phinxs) comendo seus cupcakes",
    },
  },
  {
    title: "Jane Street Puzzles",
    description:
      "Foi aqui que veio a ideia: a Jane Street usa puzzles pra mostrar como a empresa pensa e resolve problemas. O CapiRun é a minha tentativa de fazer algo parecido pra Visio.",
    url: "https://www.janestreet.com/puzzles/",
    domain: "janestreet.com",
    image: {
      src: "/referencias/jane-street.png",
      alt: "Imagem de capa dos puzzles da Jane Street",
    },
  },
  {
    title: "Eight Dimensions of Wellness",
    author: "UC Davis",
    description:
      "Modelo das oito dimensões do bem-estar. O CapiRun é minha aposta na dimensão intelectual: estimular curiosidade e raciocínio é uma forma legítima de cuidar da equipe.",
    url: "https://shcs.ucdavis.edu/health-and-wellness/eight-dimensions-wellness",
    domain: "shcs.ucdavis.edu",
    image: {
      src: "/referencias/eight-dimensions.png",
      alt: "Roda das oito dimensões do bem-estar (emocional, ocupacional, intelectual, ambiental, financeira, social, física e espiritual)",
    },
  },
];

export default async function ReferenciasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const mood = await getCurrentMood(supabase, user?.id);

  return (
    <>
      <Navbar mood={mood} />
      <PageWrapper title="Referências">
        <section className="flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            Se você curtiu o CapiRun, vai amar conhecer quem inspirou cada peça
            dele.
          </p>
          <div className="flex flex-col gap-3">
            {references.map((r) => (
              <Card
                key={r.title}
                className="p-0 overflow-hidden transition-shadow hover:shadow-md"
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 p-4"
                >
                  {r.image ? (
                    <img
                      src={r.image.src}
                      alt={r.image.alt}
                      width={96}
                      height={96}
                      className="h-24 w-24 flex-shrink-0 rounded-lg object-cover bg-gray-50"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="h-24 w-24 flex-shrink-0 rounded-lg bg-gray-100"
                    />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-base font-semibold text-gray-900">
                      {r.title}
                      {r.author && (
                        <span className="text-sm font-normal text-gray-500">
                          {" "}
                          — {r.author}
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-gray-600">
                      {r.description}
                    </span>
                    {r.domain && (
                      <span className="mt-auto text-xs text-gray-400">
                        {r.domain}
                      </span>
                    )}
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </section>
      </PageWrapper>
    </>
  );
}
