import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { sendChatMessage } from "../../apis/posts";
import { FiSend } from "react-icons/fi";
import splashLogo from "../../components/assets/splash.svg";

// Noto Sans KR 임포트 (ChatbotPage 전용)
const FontImport = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
`;

// 전체 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 130px); 
  background: #fbfafa;
  overflow: hidden;
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
`;

// 타이틀
const Title = styled.h3`
  color: #757575;
  font-size: 20px;
  font-weight: 700;
  margin: 16px 0;
`;

// 채팅 영역
const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

// 메시지 버블
const Bubble = styled.div`
  display: inline-block;
  padding: 10px 14px;
  margin: 6px 0;
  border-radius: 12px;
  max-width: 80%;
  line-height: 1.5;
  white-space: pre-line;
  background: ${(props) => (props.sender === "user" ? "#d1d5d1" : "rgba(5, 189, 149, 0.5)")};
  align-self: ${(props) => (props.sender === "user" ? "flex-end" : "flex-start")};
`;

// 입력창
const InputBar = styled.div`
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  background: white;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
`;

const SendButton = styled.button`
  margin-left: 8px;
  background: #2aa574;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

// 시작 화면
const StartScreen = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 20px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
`;

const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        if (!isStarted) setIsStarted(true);

        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        const userInput = input;
        setInput("");
        setLoading(true);

        try {
            const res = await sendChatMessage(userInput);
            const botReply = res.reply || "답변을 불러오지 못했습니다.";
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ 서버 오류 발생" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <FontImport />
            {!isStarted ? (
                <StartScreen>
                    <Logo>
                        <img src={splashLogo} alt="chatbot logo" style={{ width: "120px" }} />
                    </Logo>
                    <Title>무엇을 도와드릴까요?</Title>

                    <InputBar>
                        <Input
                            placeholder="궁금한 점을 입력하세요."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <SendButton onClick={handleSend}>
                            <FiSend />
                        </SendButton>
                    </InputBar>
                </StartScreen>
            ) : (
                <>
                    <ChatArea>
                        {messages.map((msg, i) => (
                            <Bubble key={i} sender={msg.sender}>
                                {msg.text}
                            </Bubble>
                        ))}
                        {loading && <p>⏳ 답변 생성 중...</p>}
                    </ChatArea>

                    <InputBar>
                        <Input
                            placeholder="궁금한 점을 입력하세요."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <SendButton onClick={handleSend}>
                            <FiSend />
                        </SendButton>
                    </InputBar>
                </>
            )}
        </Container>
    );
};

export default ChatbotPage;
