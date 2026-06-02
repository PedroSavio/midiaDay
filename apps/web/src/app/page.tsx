"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarHeart, Clock, MapPin, PartyPopper, Shirt } from "lucide-react";

/* ============================================================
 * EDITE AQUI os dados da festa 👇
 * ============================================================ */
const FESTA = {
  aniversariante: "Mídia",
  data: "23 de Junho de 2026 (Terça-feira)",
  hora: "A partir das 18h",
  local: "Aruana",
  endereco: "Rua José Mário de Campos, 65 — Aruana, Aracaju/SE",
  traje: "Caipira pressão 🤠 ",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+Jos%C3%A9+M%C3%A1rio+de+Campos+65+Aruana+Aracaju+SE",
  foto: "/forro-midia.jpg",
};

// Tempos da brincadeira do fogo, em segundos (ajuste à vontade)
const TEMPOS_FOGO = { esquenta: 30, alarme: 75, pegaFogo: 120 };

const CORES_BANDEIRA = [
  "#c23a26",
  "#e0ab3e",
  "#2c557a",
  "#4d8253",
  "#a8501f",
  "#f3ecd9",
];

function Bandeirinhas() {
  return (
    <div className="bunting">
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="flag"
          style={{
            background: CORES_BANDEIRA[i % CORES_BANDEIRA.length],
            animationDelay: `${(i % 6) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

// Faíscas de fogueira — a fogueira vai "pegando fogo" com o tempo.
// `surge`: a partir de qual intensidade (0..1) a faísca aparece.
const FAISCAS = [
  { left: "8%", size: 3, delay: 0, duration: 13, drift: 14, surge: 0 },
  { left: "47%", size: 5, delay: 1, duration: 18, drift: 12, surge: 0 },
  { left: "82%", size: 2, delay: 4, duration: 12, drift: 10, surge: 0 },
  { left: "27%", size: 2, delay: 2, duration: 11, drift: 8, surge: 0.1 },
  { left: "64%", size: 4, delay: 3, duration: 17, drift: 16, surge: 0.1 },
  { left: "18%", size: 4, delay: 5, duration: 16, drift: -10, surge: 0.25 },
  { left: "91%", size: 4, delay: 7, duration: 16, drift: -14, surge: 0.25 },
  { left: "38%", size: 3, delay: 8, duration: 15, drift: -16, surge: 0.4 },
  { left: "73%", size: 3, delay: 9, duration: 14, drift: -12, surge: 0.4 },
  { left: "56%", size: 2, delay: 6, duration: 12, drift: -8, surge: 0.55 },
  { left: "13%", size: 5, delay: 3, duration: 15, drift: 18, surge: 0.55 },
  { left: "33%", size: 4, delay: 7, duration: 13, drift: -14, surge: 0.7 },
  { left: "52%", size: 6, delay: 2, duration: 19, drift: 10, surge: 0.7 },
  { left: "69%", size: 5, delay: 5, duration: 14, drift: -18, surge: 0.85 },
  { left: "86%", size: 6, delay: 1, duration: 17, drift: 16, surge: 0.85 },
  { left: "23%", size: 6, delay: 4, duration: 16, drift: 20, surge: 0.95 },
  { left: "60%", size: 7, delay: 6, duration: 18, drift: -20, surge: 0.95 },
];

function Faiscas({ intensidade }: { intensidade: number }) {
  return (
    <div
      className="ember-layer"
      aria-hidden="true"
      style={{ ["--fire" as string]: intensidade }}
    >
      {FAISCAS.filter((f) => intensidade >= f.surge).map((f, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

// Línguas de fogo que saem do formulário (largura em % do próprio card)
const CHAMAS_FORM = [
  { left: "-3%", w: 26, h: 72, delay: 0.0, dur: 1.7 },
  { left: "9%", w: 22, h: 95, delay: 0.45, dur: 2.1 },
  { left: "23%", w: 25, h: 80, delay: 0.2, dur: 1.9 },
  { left: "38%", w: 22, h: 104, delay: 0.6, dur: 2.4 },
  { left: "52%", w: 25, h: 84, delay: 0.1, dur: 1.8 },
  { left: "66%", w: 22, h: 98, delay: 0.5, dur: 2.2 },
  { left: "79%", w: 26, h: 76, delay: 0.3, dur: 2.0 },
];

const FAGULHAS_FORM = [
  { left: "12%", size: 4, delay: 0.0, dur: 2.4, drift: 14 },
  { left: "30%", size: 3, delay: 0.8, dur: 2.9, drift: -10 },
  { left: "48%", size: 5, delay: 0.4, dur: 2.6, drift: 8 },
  { left: "64%", size: 3, delay: 1.1, dur: 3.1, drift: -14 },
  { left: "82%", size: 4, delay: 0.6, dur: 2.7, drift: 12 },
];

function FogoNoForm() {
  return (
    <div className="form-flames" aria-hidden="true">
      <div className="form-flames-glow" />
      {CHAMAS_FORM.map((c, i) => (
        <span
          key={`t${i}`}
          className="tongue"
          style={{
            left: c.left,
            width: `${c.w}%`,
            height: `${c.h}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.dur}s`,
          }}
        />
      ))}
      {FAGULHAS_FORM.map((f, i) => (
        <span
          key={`s${i}`}
          className="form-spark"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.dur}s`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
      <div className="form-smoke" />
    </div>
  );
}

function AlarmeBar({ fase }: { fase: number }) {
  if (fase < 2) return null;
  return (
    <div className="alarm-chip" role="alert">
      <span className="alarm-dot" aria-hidden="true" />
      🔥 Tá pegando fogo!
    </div>
  );
}

export default function Home() {
  const [nome, setNome] = useState("");
  const [presenca, setPresenca] = useState<"sim" | "nao">("sim");
  const [recado, setRecado] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [totalPessoas, setTotalPessoas] = useState<number | null>(null);
  const [confirmados, setConfirmados] = useState<
    { nome: string; recado?: string | null }[]
  >([]);
  const [temFoto, setTemFoto] = useState(true);
  // A fogueira começa fraca e vai ficando mais forte com o tempo (0 -> 1)
  const [intensidade, setIntensidade] = useState(0.15);
  // Brincadeira do incêndio: 0 = normal, 1 = esquentando, 2 = alarme, 3 = pegou fogo
  const [fase, setFase] = useState(0);
  const [rodada, setRodada] = useState(0);

  function apagarFogo() {
    setFase(0);
    setIntensidade(0.15);
    setRodada((r) => r + 1);
    toast.success("🧯 Fogo apagado! Ufa... mas cuidado que reacende! 😏");
  }

  async function carregarContagem() {
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTotalPessoas(data.totalPessoas);
        setConfirmados(data.confirmados ?? []);
      }
    } catch {
      /* silencioso */
    }
  }

  useEffect(() => {
    carregarContagem();
  }, []);

  // Vai alimentando a fogueira: sobe até o máximo ao longo de ~90s
  useEffect(() => {
    const id = setInterval(() => {
      setIntensidade((atual) => Math.min(1, atual + 0.02));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // Brincadeira do incêndio (reinicia a cada "rodada", ex.: ao apagar o fogo)
  useEffect(() => {
    setFase(0);
    const timers = [
      setTimeout(() => {
        setFase(1);
        toast.warning("🔥 Eita... tá esquentando demais aqui no forró!", {
          duration: 4000,
        });
      }, TEMPOS_FOGO.esquenta * 1000),
      setTimeout(() => {
        setFase(2);
        toast.error("🚨 ALERTA DE INCÊNDIO! O forró começou a pegar fogo!", {
          duration: 5000,
        });
      }, TEMPOS_FOGO.alarme * 1000),
      setTimeout(() => {
        setFase(3);
        toast.error("🔥🔥 O FORMULÁRIO PEGOU FOGO! Chama os bombeiros! 🔥🔥", {
          duration: 6000,
        });
      }, TEMPOS_FOGO.pegaFogo * 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [rodada]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (nome.trim().length < 2) {
      toast.error("Diz aí o seu nome, parça! 🙂");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          presenca,
          recado: recado.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Não foi possível enviar.");
      }

      setEnviado(true);
      toast.success(
        presenca === "sim"
          ? "Presença confirmada! Bora arrastar o pé! 🎶"
          : "Que pena! Sua resposta foi registrada. 💛",
      );
      carregarContagem();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="festa-bg">
      <AlarmeBar fase={fase} />
      <Faiscas intensidade={intensidade} />

      <div>
        {/* Bandeirinhas no topo */}
        <div className="relative z-10 px-2 pt-2">
          <Bandeirinhas />
        </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-4 pb-16 text-center sm:px-6">
        {/* HERO */}
        <p className="font-display mt-8 text-[clamp(1rem,4.5vw,1.5rem)] tracking-wide text-[var(--junina-cream)] uppercase drop-shadow-md sm:mt-10">
          Você foi convocado para o
        </p>

        <h1 className="font-display title-stroke mt-3 text-[clamp(2.75rem,13vw,7rem)] leading-[0.95] uppercase break-words">
          Forró do
          <br />
          {FESTA.aniversariante}
        </h1>

        <div className="ribbon mt-6 inline-block rounded-md px-4 py-2 text-sm font-bold uppercase sm:px-6 sm:text-lg">
          🔥 Comparecimento obrigatório! 🔥
        </div>

        {/* FOTO DA GALERA */}
        {temFoto && (
          <div className="foto-frame mt-8 aspect-video w-full max-w-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FESTA.foto}
              alt="Galera no forró do Mídia"
              onError={() => setTemFoto(false)}
            />
          </div>
        )}

        <div className="gold-badge mt-8 flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-3 text-xs uppercase sm:px-6 sm:text-base">
          <CalendarHeart className="size-5 shrink-0" />
          <span className="text-center">
            {FESTA.data} • {FESTA.hora}
          </span>
        </div>

        {totalPessoas !== null && totalPessoas > 0 && (
          <p className="mt-5 flex items-center gap-2 text-sm text-[var(--junina-cream)]/90">
            <PartyPopper className="size-4" />
            {totalPessoas}{" "}
            {totalPessoas === 1 ? "convocado já confirmou" : "convocados já confirmaram"}!
          </p>
        )}

        {/* DETALHES */}
        <div className="junina-card mt-10 grid w-full gap-5 p-5 text-left sm:grid-cols-2 sm:p-6">
          <Detalhe icon={<CalendarHeart className="size-5" />} titulo="Data" texto={FESTA.data} />
          <Detalhe icon={<Clock className="size-5" />} titulo="Horário" texto={FESTA.hora} />
          <Detalhe
            icon={<MapPin className="size-5" />}
            titulo="Local"
            texto={FESTA.endereco}
            link={FESTA.mapsUrl}
          />
          <Detalhe icon={<Shirt className="size-5" />} titulo="Traje" texto={FESTA.traje} />
        </div>

        {/* FORMULÁRIO DE CONFIRMAÇÃO */}
        <div className="form-fogo-wrap relative mt-10 w-full">
          <div
            className={`junina-card w-full p-5 text-left sm:p-8${
              fase >= 3 ? " pegando-fogo" : fase >= 2 ? " aquecendo" : ""
            }`}
          >
          <h3 className="font-display text-center text-2xl text-[var(--junina-gold)] uppercase sm:text-4xl">
            Confirme sua presença
          </h3>
          <p className="mt-2 text-center text-sm text-[var(--junina-cream)]/80">
            Bora garantir seu lugar! 🌽🔥
          </p>

          {enviado ? (
            <div className="mt-6 rounded-2xl border-2 border-dashed border-[var(--junina-green)] bg-[var(--junina-green)]/10 p-6 text-center">
              <PartyPopper className="mx-auto size-10 text-[var(--junina-green)]" />
              <p className="font-fredoka mt-3 text-xl font-semibold text-[var(--junina-cream)]">
                {presenca === "sim"
                  ? "Fechou! Te esperamos lá! 🎶"
                  : "Resposta registrada, valeu! 💛"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setEnviado(false);
                  setNome("");
                  setRecado("");
                  setPresenca("sim");
                }}
                className="junina-btn mt-5 px-5 py-2 text-sm"
              >
                Enviar outra resposta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--junina-cream)]">
                  Seu nome
                </label>
                <input
                  className="junina-input"
                  placeholder="SE IDENTIFIQUE"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  maxLength={80}
                />
              </div>

              <div>
                <span className="mb-1 block text-sm font-semibold text-[var(--junina-cream)]">
                  Você vai comparecer?
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <OpcaoPresenca
                    ativo={presenca === "sim"}
                    onClick={() => setPresenca("sim")}
                    cor="var(--junina-green)"
                    label="EU VO"
                  />
                  <OpcaoPresenca
                    ativo={presenca === "nao"}
                    onClick={() => setPresenca("nao")}
                    cor="var(--junina-red)"
                    label="Sou PAIA"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--junina-cream)]">
                  Deixe um recado
                </label>
                <textarea
                  className="junina-input min-h-24 resize-y"
                  placeholder="Vai levar o quê? Um recado pro Mídia?"
                  value={recado}
                  onChange={(e) => setRecado(e.target.value)}
                  maxLength={300}
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="junina-btn mt-2 w-full py-3 text-base"
              >
                {enviando ? "Enviando..." : "Confirmar presença 🎺"}
              </button>
            </form>
          )}
          </div>
          {fase >= 3 && <FogoNoForm />}
          {fase >= 3 && (
            <button type="button" onClick={apagarFogo} className="extintor-btn-form">
              🧯 Apagar o fogo
            </button>
          )}
        </div>

        {/* LISTA DE CONFIRMADOS */}
        <div className="junina-card mt-10 w-full p-5 text-left sm:p-8">
          <h3 className="font-display text-center text-2xl text-[var(--junina-gold)] uppercase sm:text-4xl">
            Quem já confirmou
          </h3>
          <p className="mt-2 text-center text-sm text-[var(--junina-cream)]/80">
            {totalPessoas ?? 0}{" "}
            {(totalPessoas ?? 0) === 1 ? "convocado na pista" : "convocados na pista"} 🤠
          </p>

          {confirmados.length === 0 ? (
            <p className="mt-5 text-center text-sm text-[var(--junina-cream)]/70">
              Ninguém confirmou ainda. Seja o primeiro a chamar VUMBORA! 🎶
            </p>
          ) : (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {confirmados.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-[var(--junina-gold-deep)]/40 bg-white/5 px-3 py-2"
                >
                  <span className="mt-0.5 shrink-0">🌽</span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--junina-cream)]">
                      {c.nome}
                    </p>
                    {c.recado ? (
                      <p className="text-xs text-[var(--junina-cream)]/70">
                        “{c.recado}”
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="mt-12 text-sm text-[var(--junina-cream)]/80">
          <p>MIDIA PRODUCTIONS</p>
          <p className="font-display mt-1 text-lg text-[var(--junina-gold)] uppercase">
            VUMBORAAAA! 🔥🌽
          </p>
        </footer>
      </div>

        <div className="relative z-10 rotate-180 px-2 pb-2">
          <Bandeirinhas />
        </div>
      </div>
    </main>
  );
}

function Detalhe({
  icon,
  titulo,
  texto,
  link,
}: {
  icon: React.ReactNode;
  titulo: string;
  texto: string;
  link?: string;
}) {
  const conteudo = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[var(--junina-gold)]">{icon}</div>
      <div>
        <p className="font-fredoka text-sm font-semibold text-[var(--junina-gold)] uppercase">
          {titulo}
        </p>
        <p className="text-sm text-[var(--junina-cream)]/90">{texto}</p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
        {conteudo}
      </a>
    );
  }
  return conteudo;
}

function OpcaoPresenca({
  ativo,
  onClick,
  cor,
  label,
}: {
  ativo: boolean;
  onClick: () => void;
  cor: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all"
      style={{
        borderColor: cor,
        background: ativo ? cor : "transparent",
        color: ativo ? "#fff" : "var(--junina-cream)",
        boxShadow: ativo ? `0 4px 0 ${cor}` : "none",
      }}
    >
      {label}
    </button>
  );
}
