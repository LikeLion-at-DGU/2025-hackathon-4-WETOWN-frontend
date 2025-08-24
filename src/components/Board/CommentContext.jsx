// src/contexts/CommentContext.jsx
import { createContext, useContext, useState } from "react";

const CommentContext = createContext();

export function CommentProvider({ children }) {
    const [showCommentInput, setShowCommentInput] = useState(false);

    return (
        <CommentContext.Provider value={{ showCommentInput, setShowCommentInput }}>
            {children}
        </CommentContext.Provider>
    );
}

export function useCommentContext() {
    return useContext(CommentContext);
}
