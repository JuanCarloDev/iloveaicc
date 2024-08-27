import { marked } from "marked";
import {
  CaretCircleDown,
  CaretDown,
  CaretUp,
  CircleNotch,
  Eye,
  Lightning,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import React, { useState } from "react";
import { useAppContext } from "../AppContext";
import { AgentScriptTikTok } from "../agents/AgentScriptTikTok";
import { AgentScriptYoutube } from "../agents/AgentScriptYoutube";
import { AgentScript } from "../agents/AgentScript";

export default function TopicCard({ topic, onClick, isSelected, ...props }) {
  const [hide, setHide] = useState(true);
  const [view, setView] = useState("");

  const { state, setState } = useAppContext();

  const handleTikTokClick = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Chama a função para buscar o script baseado no tópico selecionado
      const script = await AgentScriptTikTok(topic);
      // Atualiza o estado do contexto com o script do TikTok para o tópico selecionado
      setState((prev) => {
        const updatedTopics = prev.topics.map((t) =>
          t.subtopic === topic.subtopic
            ? { ...t, tiktok: script } // Adiciona a nova propriedade `tiktok` com o script gerado
            : t
        );
        setState((prev) => ({ ...prev, loading: false }));
        setView("tiktok");
        setHide(false);
        return {
          ...prev,
          topics: updatedTopics, // Atualiza os tópicos no estado
        };
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      console.error("Failed to generate TikTok script:", error);
    }
  };

  const handleYoutubeClick = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Chama a função para buscar o script baseado no tópico selecionado
      const script = await AgentScriptYoutube(topic);
      // Atualiza o estado do contexto com o script do TikTok para o tópico selecionado
      setState((prev) => {
        const updatedTopics = prev.topics.map((t) =>
          t.subtopic === topic.subtopic
            ? { ...t, youtube: script } // Adiciona a nova propriedade `tiktok` com o script gerado
            : t
        );
        setState((prev) => ({ ...prev, loading: false }));
        setView("youtube");
        setHide(false);
        return {
          ...prev,
          topics: updatedTopics, // Atualiza os tópicos no estado
        };
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      console.error("Failed to generate youtube script:", error);
    }
  };

  const handleScriptClick = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Chama a função para buscar o script baseado no tópico selecionado
      const script = await AgentScript(topic);
      // Atualiza o estado do contexto com o script do TikTok para o tópico selecionado
      setState((prev) => {
        const updatedTopics = prev.topics.map((t) =>
          t.subtopic === topic.subtopic
            ? { ...t, scriptDefault: script } // Adiciona a nova propriedade `tiktok` com o script gerado
            : t
        );
        setState((prev) => ({ ...prev, loading: false }));
        setView("default");
        setHide(false);
        return {
          ...prev,
          topics: updatedTopics, // Atualiza os tópicos no estado
        };
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      console.error("Failed to generate youtube script:", error);
    }
  };
  const formattedScriptTikTok = marked(topic.tiktok || "");
  const formattedScriptYoutube = marked(topic.youtube || "");
  const formattedScript = marked(topic.scriptDefault || "");
  return (
    <div className={`col-span-4`} {...props}>
      <div
        /* onClick={onClick} */
        className={`p-4 border relative rounded-lg cursor-pointer col-span-4 ${
          isSelected ? "bg-[#ff4b21] text-white" : "bg-white text-black"
        }`}
      >
        <div className={` flex gap-1 right-4 top-4 mb-2`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} weight="fill" className={`text-yellow-400`} />
          ))}
        </div>
        <h2 className="font-semibold text-lg">{topic.subtopic}</h2>
        <h4 className="text-md text-black/50">{topic.description}</h4>

        <p className={`mt-4 font-semibold text-black/80`}>
          スクリプトを生成する
        </p>
        <div className={`flex justify-between items-center mt-1`}>
          <div
            className={`flex flex-wrap md:flex-row gap-2 md:items-center mt-3`}
          >
            <button
              onClick={handleScriptClick}
              className={` w-fit max-w-5xl  bg-[#ff4b21] border border-gray-100 text-white font-semibold flex justify-center items-center py-1 px-2 rounded-lg min-w-[120px] text-sm`}
            >
              <div className={`flex justify-center items-center gap-1`}>
                デフォルト <Lightning weight="fill" className={`text-white`} />
              </div>
            </button>
            <button
              onClick={handleTikTokClick}
              className={` w-fit max-w-5xl  bg-gray-50 border border-gray-100 text-black font-semibold flex justify-center items-center py-1 px-2 rounded-lg min-w-[120px] text-sm`}
            >
              <div className={`flex justify-center items-center gap-1`}>
                TikTok{" "}
                <span className={`font-normal text-black/30`}>(short)</span>
                <img className={`w-4`} src="tiktok.png" />
              </div>
            </button>
            <button
              onClick={handleYoutubeClick}
              className={` w-fit max-w-5xl  bg-gray-50 border border-gray-100 text-black font-semibold flex justify-center items-center py-1 px-2 rounded-lg min-w-[120px] text-sm`}
            >
              <div className={`flex justify-center items-center gap-1`}>
                YouTube{" "}
                <span className={`font-normal text-black/30`}>(long)</span>
                <img className={`w-4`} src="youtube.png" />
              </div>
            </button>
            <div className={`flex justify-center items-center h-full`}>
              {state.loading && (
                <CircleNotch className="animate-spin h-6 opacity-20 w-6 text-black/70" />
              )}
            </div>
          </div>
        </div>
        {(formattedScriptTikTok !== "" ||
          formattedScriptYoutube !== "" ||
          formattedScript !== "") && (
          <div className={`bg-gray-100/80 p-6 w-full h-fit rounded-lg mt-6`}>
            <div className={`flex justify-center items-center w-fit gap-2`}>
              <div
                onClick={() => setHide(!hide)}
                className={`flex h-full w-full items-center gap-1 font-semibold text-black/80 cursor-pointer`}
              >
                {hide ? (
                  <>
                    {" "}
                    <CaretDown weight="fill" />
                  </>
                ) : (
                  <>
                    <CaretUp weight="fill" />
                  </>
                )}
                <p className={`font-semibold text-black/80`}>
                  {" "}
                  生成されたスクリプト
                </p>
              </div>
            </div>
            <div
              className={`flex flex-col gap-5 mt-4 font-mono text-black/80 ${
                hide ? "hidden" : ""
              }`}
            >
              <div
                className={`flex gap-2 border px-1 py-1 bg-gray-200/80 w-fit rounded-full transition-all duration-300`}
              >
                <div
                  className={`  border-black/10 rounded-full px-4 font-sans text-base transition-all duration-300 ${
                    formattedScript === "" && "hidden"
                  } ${
                    view === "default"
                      ? "bg-[#ff4b21] text-white border-0"
                      : "text-black/60"
                  }`}
                  onClick={() => setView("default")}
                >
                  Default
                </div>
                <div
                  className={`  border-black/10  rounded-full  px-4 font-sans text-base transition-all duration-300 ${
                    formattedScriptTikTok === "" && "hidden"
                  } ${
                    view === "tiktok"
                      ? "bg-[#ff4b21] text-white border-0"
                      : "text-black/60"
                  }`}
                  onClick={() => setView("tiktok")}
                >
                  TikTok
                </div>
                <div
                  className={` border-black/10  rounded-full  px-4 font-sans text-base transition-all duration-300 ${
                    formattedScriptYoutube === "" && "hidden"
                  } ${
                    view === "youtube"
                      ? "bg-[#ff4b21] text-white border-0"
                      : " text-black/60"
                  }`}
                  onClick={() => setView("youtube")}
                >
                  YouTube
                </div>
              </div>

              {view === "default" && topic.scriptDefault && (
                <div
                  className={`flex flex-col gap-4 text-black/70`}
                  dangerouslySetInnerHTML={{
                    __html: formattedScript,
                  }}
                />
              )}

              {view === "tiktok" && topic.tiktok && (
                <div
                  className={`flex flex-col gap-4 text-black/70`}
                  dangerouslySetInnerHTML={{
                    __html: formattedScriptTikTok,
                  }}
                />
              )}

              {view === "youtube" && topic.youtube && (
                <div
                  className={`flex flex-col gap-4 text-black/70`}
                  dangerouslySetInnerHTML={{
                    __html: formattedScriptYoutube,
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
