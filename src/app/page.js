"use client";
import { useState } from "react";
import { fetchSubcategories } from "./agents/AgentSubCategorieslc";
import { CircleNotch, MagnifyingGlass } from "@phosphor-icons/react";
import SegmentCard from "./components/SegmentCard";
import SubcategoryCard from "./components/SubcategoryCard";
import TopicCard from "./components/TopicCard";
import SearchBar from "./components/SearchBar";
import { fetchTopics } from "./agents/AgentTopicslc";
import { useAppContext } from "./AppContext";

export default function Home() {
  const {
    state: {
      segmentSelected,
      subcategories,
      topics,
      topicsSelected,
      subcategoriesSelected,
      loading,
      step,
      searchTerm,
      searchTermSubcategory,
      searchTermTopic,
    },
    handleSegmentClick,
    handleSelection,
    handleSubcategoriesSubmit,
    filteredItems,
  } = useAppContext();

  console.log(filteredItems(subcategories, searchTermSubcategory));
  console.log(subcategories);

  console.log(filteredItems(topics, searchTermTopic));
  console.log(topics);

  console.log(segmentSelected);

  const animationDelay = 150;

  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-6 pb-20">
      <div className="flex w-full max-w-5xl py-10">
        <a href="/">
          <img
            data-aos="fade"
            data-aos-delay={0 * animationDelay}
            data-aos-offset={0}
            src="/iloveai.png"
            className="w-[10rem] h-auto"
          />
        </a>
      </div>

      {step === 1 && (
        <>
          <div className="flex flex-col gap-2 w-full h-full max-w-5xl py-2">
            <h1
              data-aos="fade"
              data-aos-delay={1 * animationDelay}
              data-aos-offset={0}
              className="text-black/80 font-semibold text-2xl"
            >
              業界を選択してください
            </h1>
            <SearchBar
              data-aos="fade"
              data-aos-delay={2 * animationDelay}
              data-aos-offset={0}
              searchTerm={searchTerm}
              setSearchTerm={(term) => setState({ ...state, searchTerm: term })}
            />
            <div className="grid grid-cols-4 w-full h-full max-w-5xl py-2 gap-5 mt-4">
              {filteredItems(segments.segments, searchTerm, "name").map(
                (segment, index) => (
                  <SegmentCard
                    data-aos="fade"
                    data-aos-delay={index * 150}
                    data-aos-offset={0}
                    key={segment.id}
                    segment={segment}
                    onClick={() => handleSelection(segment, "segmentSelected")}
                    isSelected={
                      segmentSelected && segmentSelected.id === segment.id
                    }
                  />
                )
              )}
            </div>
            <div
              data-aos="fade"
              data-aos-delay={5 * animationDelay}
              data-aos-offset={0}
              className={`w-full flex justify-end max-w-5xl`}
            >
              <button
                disabled={!segmentSelected}
                onClick={() => {
                  segmentSelected && handleSegmentClick(segmentSelected);
                }}
                className={`flex justify-end w-fit max-w-5xl ${
                  loading || !segmentSelected ? "bg-zinc-300" : "bg-[#ff4b21]"
                } text-white flex justify-center items-center py-2 px-8 rounded-lg min-w-[120px] transition-all duration-500`}
              >
                {loading ? (
                  <CircleNotch className="animate-spin h-6 opacity-20 w-6 text-white" />
                ) : (
                  <p>次</p>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex flex-col gap-2 w-full h-full max-w-5xl py-2">
            <div className={`flex  justify-between items-center`}>
              <h1
                data-aos="fade"
                data-aos-delay={1 * animationDelay}
                data-aos-offset={0}
                className="text-black/80 font-semibold text-2xl"
              >
                サブカテゴリの選択
              </h1>
              <div
                data-aos="fade"
                data-aos-delay={2 * animationDelay}
                data-aos-offset={0}
                className={``}
              >
                <p
                  className={`text-black/50 font-semibold text-md ${
                    subcategoriesSelected.length >= 3 ? "text-green-800" : ""
                  }`}
                >
                  {subcategoriesSelected.length}/3
                </p>
              </div>
            </div>
            <SearchBar
              data-aos="fade"
              data-aos-delay={3 * animationDelay}
              data-aos-offset={0}
              searchTerm={searchTermSubcategory}
              setSearchTerm={(term) =>
                setState({ ...state, searchTermSubcategory: term })
              }
            />
            <div className="grid grid-cols-4 w-full h-full max-w-5xl py-2 gap-5 mt-4">
              {filteredItems(subcategories, searchTermSubcategory).map(
                (subcategory, index) => (
                  <SubcategoryCard
                    data-aos="fade"
                    data-aos-delay={index * 150}
                    data-aos-offset={0}
                    key={subcategory.id}
                    subcategory={subcategory}
                    onClick={() =>
                      handleSelection(subcategory, "subcategoriesSelected")
                    }
                    isSelected={subcategoriesSelected.includes(subcategory)}
                  />
                )
              )}
            </div>
            <div className={`w-full flex justify-end max-w-5xl`}>
              <button
                disabled={subcategoriesSelected.length === 0}
                onClick={() => {
                  handleSubcategoriesSubmit();
                }}
                className={`flex justify-end w-fit max-w-5xl mt-4 ${
                  subcategoriesSelected.length > 0
                    ? "bg-[#ff4b21]"
                    : "bg-zinc-300"
                } text-white flex justify-center items-center py-2 px-8 rounded-lg min-w-[120px]`}
              >
                {loading ? (
                  <CircleNotch className="animate-spin h-6 opacity-20 w-6 text-white" />
                ) : (
                  <p>次</p>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex w-full h-full max-w-5xl py-2 flex-col">
            <h1 className="text-black/80 font-semibold text-2xl">
              トピックの選択
            </h1>
            {/* <p
              className={`text-black/50 font-semibold text-md ${
                topicsSelected.length >= 3 ? "text-green-800" : ""
              }`}
            >
              {topicsSelected.length}/3
            </p> */}
            <SearchBar
              searchTerm={searchTermTopic}
              setSearchTerm={(term) =>
                setState({ ...state, searchTermTopic: term })
              }
            />
            <div className="grid grid-cols-4 w-full h-full max-w-5xl py-2 gap-5 mt-4">
              {filteredItems(topics, searchTermTopic, "subtopic").map(
                (topic, index) => (
                  <TopicCard
                    data-aos="fade"
                    data-aos-delay={index * 150}
                    data-aos-offset={0}
                    key={topic.id}
                    topic={topic}
                    onClick={() => handleSelection(topic, "topicsSelected")}
                    isSelected={topicsSelected.includes(topic)}
                  />
                )
              )}
            </div>
            <div
              data-aos="fade"
              data-aos-delay={150}
              data-aos-offset={0}
              className={`w-full flex justify-end max-w-5xl`}
            >
              <button
                disabled={topicsSelected?.length === 0}
                onClick={handleSubcategoriesSubmit}
                className={`flex justify-end w-fit max-w-5xl mt-4 ${
                  topicsSelected?.length > 0 ? "bg-[#ff4b21]" : "bg-zinc-300"
                } text-white flex justify-center items-center py-2 px-8 rounded-lg min-w-[120px]`}
              >
                {loading ? (
                  <CircleNotch className="animate-spin h-6 opacity-20 w-6 text-white" />
                ) : (
                  <p>Submit</p>
                )}
              </button>
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
      id: 0,
      name: "住宅ローン",
      description: "技術の進歩とイノベーションに焦点を当てたセグメント。",
    },
    {
      id: 1,
      name: "テクノロジー",
      description: "技術の進歩とイノベーションに焦点を当てたセグメント。",
    },
    {
      id: 2,
      name: "健康＆ウェルネス",
      description: "健康、フィットネス、全体的な幸福に焦点を当てたセグメント。",
    },
    {
      id: 3,
      name: "金融",
      description: "財務管理、投資、経済動向に専念したセグメント。",
    },
    {
      id: 4,
      name: "教育",
      description: "学習、教育方法、教育ツールに焦点を当てたセグメント。",
    },
    {
      id: 5,
      name: "エンターテイメント",
      description:
        "映画、音楽、ゲーム、その他のエンターテイメントに焦点を当てたセグメント。",
    },
    {
      id: 6,
      name: "旅行＆観光",
      description: "旅行先、旅行のヒント、観光動向に専念したセグメント。",
    },
    {
      id: 7,
      name: "ライフスタイル",
      description: "ファッション、文化、日常生活に焦点を当てたセグメント。",
    },
    {
      id: 8,
      name: "食品＆飲料",
      description: "料理芸術、食事体験、飲料動向に焦点を当てたセグメント。",
    },
    {
      id: 9,
      name: "不動産",
      description: "不動産管理、不動産市場、住宅動向に専念したセグメント。",
    },
  ],
};
