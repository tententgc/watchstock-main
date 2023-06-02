import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

import ArticleCard from "../../components/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/index/posts";
import { toast } from "react-hot-toast";
import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import MainLayout from "../../components/MainLayout";

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const filteredData = data?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <section className="flex flex-col container mx-auto px-5 py-10 bg-primary-300">
        <div className="flex flex-col items-center justify-center space-y-5 mt-5">
          <h1 className="text-4xl font-bold text-center text-black">
            All Collection
          </h1>
        </div>

        <div className="flex justify-center mt-10">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-lg w-full md:w-1/2"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {isLoading ? (
            [...Array(3)].map((item, index) => (
              <ArticleCardSkeleton
                key={index}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          ) : isError ? (
            <ErrorMessage message="Couldn't fetch the posts data" />
          ) : filteredData.length === 0 ? (
            <p className="text-center text-white">No articles found.</p>
          ) : (
            filteredData.map((post) => (
              <ArticleCard
                key={post._id}
                post={post}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          )}
        </div>

        <button className="mx-auto flex items-center gap-x-2 font-bold text-primary-300 border-2 border-primary-300 px-6 py-3 rounded-lg mt-10">
          <span>More Watch</span>
          <FaArrowRight className="w-3 h-3" />
        </button>
      </section>
    </MainLayout>
  );
};

export default Articles;
