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
            src="/wowmi.svg"
            className="w-30"
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
              Select Your Industry
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
                  loading || !segmentSelected ? "bg-zinc-300" : "bg-[#725df5]"
                } text-white flex justify-center items-center py-2 px-8 rounded-lg min-w-[120px] transition-all duration-500`}
              >
                {loading ? (
                  <CircleNotch className="animate-spin h-6 opacity-20 w-6 text-white" />
                ) : (
                  <p>next</p>
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
                Select Subcategories
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
                    ? "bg-[#725df5]"
                    : "bg-zinc-300"
                } text-white flex justify-center items-center py-2 px-8 rounded-lg min-w-[120px]`}
              >
                {loading ? (
                  <CircleNotch className="animate-spin h-6 opacity-20 w-6 text-white" />
                ) : (
                  <p>next</p>
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
              Select Topics
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
                  topicsSelected?.length > 0 ? "bg-[#725df5]" : "bg-zinc-300"
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
      name: "Mortgage",
      description:
        "Segment focused on technology advancements and innovations.",
    },
    {
      id: 1,
      name: "Technology",
      description:
        "Segment focused on technology advancements and innovations22.",
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
