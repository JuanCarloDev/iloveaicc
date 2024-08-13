"use client";

import { useState } from "react";
import { fetchSubcategories } from "./agents/AgentSubCategorieslc";
import { Circle, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { fetchTopics2 } from "./agents/AgentTopicslc2";

export default function Home() {
  const [segmentSelected, setSegment] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topicsSelected, setTopicsSelected] = useState([]);
  const [subcategoriesSelected, setSubcategoriesSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermSubcategory, setSearchTermSubcategory] = useState("");
  const [searchTermTopic, setSearchTermTopic] = useState("");

  // STEP 1 SEGMENT -> SUBCATEGORIES
  const handleSegmentClick = async (segment) => {
    /*  setSegment(segment); */
    setLoading(true);
    setSubcategories([]);

    try {
      const subcategoriesList = await fetchSubcategories(segmentSelected.name);
      setSubcategories(subcategoriesList);
      setStep(2);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 SUBCATEGORIES -> TOPICS

  const handleSubcategoryClick = (subcategory) => {
    setSubcategoriesSelected((prevSelected) => {
      if (prevSelected.includes(subcategory)) {
        // Remove a subcategoria se já estiver selecionada
        return prevSelected.filter((item) => item !== subcategory);
      } else {
        // Verifica se o número máximo de 3 subcategorias já foi alcançado
        if (prevSelected.length >= 3) {
          // Exibe uma mensagem de aviso ou simplesmente retorna o array existente
          /* alert("Você só pode selecionar até 3 subcategorias."); */
          return prevSelected;
        } else {
          // Adiciona a nova subcategoria se o limite não foi alcançado
          return [...prevSelected, subcategory];
        }
      }
    });
  };

  const handleSubcategoriesSubmit = async () => {
    setLoading(true);

    try {
      const topicsArray = await fetchTopics2(subcategoriesSelected);
      setTopics(topicsArray);
      setStep(3);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  // SET STEP 3 TOPICS -> ROTEIRO

  const handleTopicClick = (topic) => {
    setTopicsSelected((prevSelected) => {
      if (prevSelected.includes(topic)) {
        // Remove a subcategoria se já estiver selecionada
        return prevSelected.filter((item) => item !== topic);
      } else {
        // Verifica se o número máximo de 3 subcategorias já foi alcançado
        if (prevSelected.length >= 3) {
          // Exibe uma mensagem de aviso ou simplesmente retorna o array existente
          /* alert("Você só pode selecionar até 3 subcategorias."); */
          return prevSelected;
        } else {
          // Adiciona a nova subcategoria se o limite não foi alcançado
          return [...prevSelected, topic];
        }
      }
    });
  };

  // Função de filtro para segmentos
  const filteredSegments = segments.segments.filter((segment) =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função de filtro para subcategorias
  const filteredSubcategories = subcategories.filter((subcategory) =>
    subcategory.toLowerCase().includes(searchTermSubcategory.toLowerCase())
  );

  const filteredTopics = topics.filter((topic) =>
    topic.toLowerCase().includes(searchTermTopic.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-6 pb-20">
      <div className={`flex w-full max-w-5xl py-10`}>
        <a href="/">
          <img src="/wowmi.svg" className={`w-30`} />
        </a>
      </div>

      {/* STEP 1 - segments */}
      {step === 1 && (
        <>
          <div className={`flex w-full h-full max-w-5xl py-2`}>
            <h1 className={`text-black/80 font-semibold text-2xl`}>
              Select Your Industry
            </h1>
          </div>
          <div className={`flex w-full h-full max-w-5xl py-2 gap-5 mt-4`}>
            <div className="flex items-center border px-4 py-2 rounded-md w-full text-black/80 outline-[#725df5]">
              <MagnifyingGlass className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search segments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 w-full text-black/80 outline-none"
              />
            </div>
          </div>
          <div
            className={`grid grid-cols-4 w-full h-full max-w-5xl py-2 gap-5 mt-4`}
          >
            {filteredSegments.map((segment) => (
              <div
                onClick={() => setSegment(segment)}
                key={segment.id}
                className={`flex w-full h-full max-w-5xl col-span-4 lg:col-span-1 px-4 border py-4 rounded-md hover:border-[#725df560] hover:scale-[101%] transition-all duration-300 cursor-pointer ${
                  segmentSelected.name === segment.name
                    ? "bg-[#725df5] text-white"
                    : "border-zinc-200 text-zinc-700"
                }`}
              >
                <h1 className={` font-semibold`}>{segment.name}</h1>
              </div>
            ))}
          </div>
          <div
            onClick={() => {
              if (segmentSelected !== "") {
                handleSegmentClick();
              }
            }}
            className={`flex justify-end w-full max-w-5xl`}
          >
            <div
              className={`cursor-pointer ${
                segmentSelected !== "" ? "bg-[#725df5]" : "bg-zinc-300"
              }  text-white flex justify-center items-center py-2 px-8 rounded-lg min-w-[120px]`}
            >
              {loading ? (
                <>
                  <CircleNotch
                    className={`animate-spin h-6 opacity-20 w-6 text-white`}
                  />
                </>
              ) : (
                <>
                  <p>next</p>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* STEP 2 - subcategories */}
      {step === 2 && (
        <>
          <div
            className={`flex w-full h-full max-w-5xl py-2 justify-between items-center`}
          >
            <h1 className={`text-black/80 font-semibold text-2xl`}>
              Select Subcategories
            </h1>
            <p
              className={`text-black/50 font-semibold text-md ${
                subcategoriesSelected.length < 3
                  ? "text-black/50"
                  : "text-green-800"
              }`}
            >
              {subcategoriesSelected.length}/3
            </p>
          </div>
          <div className={`flex w-full h-full max-w-5xl py-2 gap-5 mt-4`}>
            <div className="flex items-center border px-4 py-2 rounded-md w-full text-black/80 outline-[#725df5]">
              <MagnifyingGlass className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search subcategories..."
                value={searchTermSubcategory}
                onChange={(e) => setSearchTermSubcategory(e.target.value)}
                className="border-0 w-full text-black/80 outline-none"
              />
            </div>
          </div>
          <div
            className={`grid grid-cols-4 w-full h-full max-w-5xl py-2 gap-5 mt-4`}
          >
            {filteredSubcategories.map((subcategory) => (
              <div
                onClick={() => handleSubcategoryClick(subcategory)}
                key={subcategory.id}
                className={`flex w-full h-full max-w-5xl px-4 border col-span-4 lg:col-span-1 py-4 rounded-md hover:border-[#725df560] hover:scale-[101%] transition-all duration-300 cursor-pointer ${
                  subcategoriesSelected.includes(subcategory)
                    ? "bg-[#725df5] text-white"
                    : "border-zinc-200 text-zinc-700"
                }`}
              >
                <h1 className={` font-semibold`}>{subcategory}</h1>
              </div>
            ))}
          </div>
          <div
            onClick={() => {
              if (subcategoriesSelected.length > 0) {
                handleSubcategoriesSubmit();
              }
            }}
            className={`flex justify-end w-full max-w-5xl mt-4`}
          >
            <div
              className={`cursor-pointer ${
                subcategoriesSelected.length > 0
                  ? "bg-[#725df5]"
                  : "bg-zinc-300"
              }  text-white flex justify-center items-center py-2 px-8 rounded-lg min-w-[120px]`}
            >
              {loading ? (
                <>
                  <CircleNotch
                    className={`animate-spin h-6 opacity-20 w-6 text-white`}
                  />
                </>
              ) : (
                <>
                  <p>next</p>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* STEP 3 - topics */}
      {step === 3 && (
        <>
          <div
            className={`flex w-full h-full max-w-5xl py-2 justify-between items-center`}
          >
            <h1 className={`text-black/80 font-semibold text-2xl`}>
              Select Topics
            </h1>
            <p
              className={`text-black/50 font-semibold text-md ${
                topicsSelected.length < 3 ? "text-black/50" : "text-green-800"
              }`}
            >
              {topicsSelected.length}/3
            </p>
          </div>
          <div className={`flex w-full h-full max-w-5xl py-2 gap-5 mt-4`}>
            <div className="flex items-center border px-4 py-2 rounded-md w-full text-black/80 outline-[#725df5]">
              <MagnifyingGlass className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTermTopic}
                onChange={(e) => setSearchTermTopic(e.target.value)}
                className="border-0 w-full text-black/80 outline-none"
              />
            </div>
          </div>
          <div
            className={`grid grid-cols-4 w-full h-full max-w-5xl py-2 gap-5 mt-4`}
          >
            {filteredTopics.map((topic) => (
              <div
                onClick={() => handleTopicClick(topic)}
                key={topic.id}
                className={`flex w-full h-full max-w-5xl px-4 border col-span-4 lg:col-span-1 py-4 rounded-md hover:border-[#725df560] hover:scale-[101%] transition-all duration-300 cursor-pointer ${
                  topicsSelected.includes(topic)
                    ? "bg-[#725df5] text-white"
                    : "border-zinc-200 text-zinc-700"
                }`}
              >
                <h1 className={` font-semibold`}>{topic}</h1>
              </div>
            ))}
          </div>
          <div
            onClick={() => {
              if (topicsSelected.length > 0) {
                handleTopicsSubmit();
              }
            }}
            className={`flex justify-end w-full max-w-5xl mt-4`}
          >
            <div
              className={`cursor-pointer ${
                topicsSelected.length > 0 ? "bg-[#725df5]" : "bg-zinc-300"
              }  text-white flex justify-center items-center py-2 px-8 rounded-lg min-w-[120px]`}
            >
              {loading ? (
                <>
                  <CircleNotch
                    className={`animate-spin h-6 opacity-20 w-6 text-white`}
                  />
                </>
              ) : (
                <>
                  <p>next</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

const segments = {
  segments: [
    {
      id: 1,
      name: "Mortgage",
      description:
        "Segment focused on technology advancements and innovations.",
    },
    {
      id: 1,
      name: "Technology",
      description:
        "Segment focused on technology advancements and innovations.",
    },
    {
      id: 2,
      name: "Health & Wellness",
      description:
        "Segment centered around health, fitness, and overall well-being.",
    },
    {
      id: 3,
      name: "Finance",
      description:
        "Segment dedicated to financial management, investments, and economic trends.",
    },
    {
      id: 4,
      name: "Education",
      description:
        "Segment focused on learning, teaching methods, and educational tools.",
    },
    {
      id: 5,
      name: "Entertainment",
      description:
        "Segment focused on movies, music, games, and other forms of entertainment.",
    },
    {
      id: 6,
      name: "Travel & Tourism",
      description:
        "Segment dedicated to travel destinations, tips, and tourism trends.",
    },
    {
      id: 7,
      name: "Lifestyle",
      description:
        "Segment centered around fashion, culture, and everyday living.",
    },
    {
      id: 8,
      name: "Food & Beverage",
      description:
        "Segment focused on culinary arts, dining experiences, and beverage trends.",
    },
    {
      id: 9,
      name: "Real Estate",
      description:
        "Segment dedicated to property management, real estate markets, and housing trends.",
    },
  ],
};
