import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import ContentEditable from "react-contenteditable";
import { sizeBySimilarity, getSimilarity } from "./utils";

interface Props {
  thesis: string;
  thoughts: string;
  setThoughts: (thoughts: string) => void;
}

const ContentEditableComponent: FC<Props> = ({ thesis, thoughts, setThoughts }) => {
  const sentenceSimilarityCache = useRef<Record<string, number>>({});

  useEffect(() => {
    const colorAll = async (str: string) => {
      const split = str.split(".");
      const styled = [];
      for (let i = 0; i < split.length; i++) {
        let similarity = 0;
        if (sentenceSimilarityCache.current[split[i]]) {
          similarity = sentenceSimilarityCache.current[split[i]];
        } else {
          similarity = await getSimilarity(thesis, split[i]);
          sentenceSimilarityCache.current[split[i]] = similarity;
        }
        styled.push(sizeBySimilarity(split[i], similarity));
      }
    };

    const endings = [".", " ", "\n", ";"];
    if (endings.includes(thoughts[thoughts.length - 1]) || thoughts[thoughts.length - 1]?.trim() == "") {
      // console.log("coloring");
      colorAll(thoughts);
    }
  }, [thoughts, thesis]);

  const maybeColoredThoughts = useMemo(() => {
    const split = thoughts.split(".");

    const sentences = [];
    for (let i = 0; i < split.length; i++) {
      if (sentenceSimilarityCache.current[split[i]]) {
        const similarity = sentenceSimilarityCache.current[split[i]];
        sentences.push(sizeBySimilarity(split[i], similarity));
      } else {
        sentences.push(split[i]);
      }
    }

    return sentences.join(".");
  }, [thoughts, thesis, sentenceSimilarityCache.current]);

  return (
    <ContentEditable
      html={maybeColoredThoughts}
      onChange={({ currentTarget }) => setThoughts(currentTarget.textContent ?? "")}
      style={{ borderRadius: 2, borderColor: 'lightgray', borderWidth: 1, height: 100 }}
    />
  );
};

export default ContentEditableComponent;
