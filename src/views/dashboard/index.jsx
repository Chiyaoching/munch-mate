import { useCallback, useEffect, useRef, useState } from "react";
// material-ui
import {
  Grid,
  InputAdornment,
  OutlinedInput,
  Skeleton,
  useTheme,
} from "@mui/material";
// assets
import { BsFillSendFill } from "react-icons/bs";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  sendPrompt,
  getUserConversation,
} from "store/prompt/actions";

import { AssistantBox, AssistantLoadingBox } from "./chatbot/AssistantBox";
import UserBox from "./chatbot/UserBox";
import debounce from "hooks/debounce.js";
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const { conversationId } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.prompt.messages);
  const isAssistantLoading = useSelector((state) => state.prompt.isLoading);
  const isPageInit = useSelector((state) => state.prompt.isInit);
  const [chatboxHeight, setChatboxHeight] = useState(
    window.innerHeight -
      parseInt(theme.typography.mainContent.marginTop, 10) -
      51 -
      40,
  );
  const [prompt, setPrompt] = useState("");
  const scrollRef = useRef(null);

  const handleResize = useCallback(() => {
    setChatboxHeight(
      window.innerHeight -
        parseInt(theme.typography.mainContent.marginTop, 10) -
        51 -
        40,
    );
  }, []);

  const fetchMessages = useCallback(async (conversationId) => {
    await dispatch(getUserConversation(conversationId));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (conversationId) {
      setPrompt("");
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAssistantLoading]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current._container.scrollTop =
        scrollRef.current._container.scrollHeight;
    }
  };

  const submitPrompt = async () => {
    if (prompt) {
      await dispatch(sendPrompt(prompt, conversationId));
      setPrompt("");
    }
  };
  const handleSubmitPrompt = useCallback(debounce(submitPrompt, 500), [
    prompt,
    conversationId,
  ]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmitPrompt();
    }
  };

  const renderMessage = (messages) => {
    const filteredMesssages = messages.filter((item) => item.role !== "system");
    return filteredMesssages.map((item, index) => {
      switch (item.role) {
        case "assistant":
          return (
            <AssistantBox
              key={`assistant${index}`}
              content={item.content}
              isFunctionCall={item.isFunctionCall}
            />
          );
        case "user":
          return <UserBox key={`user${index}`} content={item.content} />;
        default:
          return null;
      }
    });
  };

  return (
    <Grid
      container
      sx={{ height: "100%", flexDirection: "column", flexWrap: "nowrap" }}
    >
      <PerfectScrollbar ref={scrollRef}>
        <Grid
          item
          container
          sx={{
            display: "flex",
            flexWrap: "wrap",
            height: chatboxHeight - 10 + "px",
            alignContent: "flex-start",
          }}
        >
          {isPageInit ? (
            <Skeleton
              variant="rounded"
              sx={{ my: 2 }}
              height={chatboxHeight - 10}
              width="100%"
            />
          ) : (
            renderMessage(messages)
          )}
          <AssistantLoadingBox
            isAssistantLoading={isAssistantLoading}
          />
        </Grid>
      </PerfectScrollbar>
      <Grid item sx={{ width: "70%", marginLeft: "auto", marginRight: "auto" }}>
        <OutlinedInput
          sx={{ width: "100%" }}
          id="input-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Set prompt here..."
          disabled={isAssistantLoading || isPageInit}
          onKeyDown={handleKeyDown}
          endAdornment={
            <InputAdornment position="end" sx={{ cursor: "pointer" }}>
              <BsFillSendFill onClick={handleSubmitPrompt} />
            </InputAdornment>
          }
          aria-describedby="prompt-input-text"
          inputProps={{
            "aria-label": "prompt",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
