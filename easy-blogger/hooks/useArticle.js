import { useState, useEffect } from "react";
import { api } from "../lib/api"; // Ensure path matches your api file

export function useArticle(id) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Skip if ID is missing or invalid
    if (!id || id === "undefined" || id === "null") {
      setIsLoading(false);
      return;
    }

    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Calls GET /api/articleRead?id=cmvuzyh2w0007ny1smf17qttz
        const data = await api.getArticleById(id);
        setArticle(data);
      } catch (err) {
        setError(err.message || "Article not found");
        setArticle(null);
        console.error("Fetch article error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, isLoading, error };
}