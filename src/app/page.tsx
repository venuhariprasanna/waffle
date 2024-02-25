"use client";

import { useState, useEffect, useRef } from "react";

import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import ChatBox from "./components/ChatBox";
import Slider from "./components/Slider";
import { UsernameInput } from "./components/UsernameInput";
import ContentEditable from "./ContentEditableComponent";
import { Box, Container, CssBaseline, Paper, TextareaAutosize, ThemeProvider, Typography, createTheme } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { get } from "https";

function getOrCreateUniqueId() {
  try {
    let uid = localStorage.getItem('uid') || '';
    if (!uid) {
      uid = uuidv4(); // Generate a new UUID
      localStorage.setItem('uid', uid);
    }
    return uid;
  } catch (e) {
    // console.warn(e);
    return uuidv4();
  }
}

function tryGetUsernameFromLocalStorage() {
  try {
    return localStorage.getItem('username') || '';
  } catch (e) {
    return '';
  }
}

export default function Home() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [userInput, setUserInput] = useState("");
  const [fontScaleFactor, setFontScaleFactor] = useState(20);
  const header = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleHeaderResize = () => {
    const headerHeight = header.current?.clientHeight || 0;
    const sliderHeight = slider.current?.clientHeight || 0;
    setHeaderHeight(headerHeight + sliderHeight);
  }

  const postMessage = useAction(api.messages.writeMessage);

  useEffect(() => {
    if (!userId) {
      setUserId(getOrCreateUniqueId());
      if (!username) {
        setUsername(tryGetUsernameFromLocalStorage());
      }
    }
  }, [userId]);

  useEffect(() => {
    if (username) {
      try {
        localStorage.setItem('username', username);
      } catch (e) {
        console.warn(e);
      }
    }
  }, [username]);

  useEffect(() => {
    if (header.current && slider.current) {
      setHeaderHeight(header.current.clientHeight + slider.current.clientHeight);
    }

    window.addEventListener('resize', handleHeaderResize);
    return () => {
      window.removeEventListener('resize', handleHeaderResize);
    }
  }, []);

  return (
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        px: { xs: 0, sm: 2, md: 4 }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          ref={header}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              component="h1"
              variant="h1"
              sx={{
                color: 'rgb(250,180,69)',
                textShadow: '2px 2px 3px rgba(0, 0, 0, .5)'
              }}
              fontSize={{ xs: '3rem', sm: '2.75rem', md: '5rem' }}
            >
              Waffle
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "white", marginTop: -2 }}
              fontSize={{ xs: '0.7rem', sm: '1.5rem', md: '2rem' }}
            >Chat with relevant messages instantly!</Typography>
          </Box>

          <Box
            sx={{
              height: { xs: 60, sm: 100, md: 130 }, // Adjust height for xs, sm, and md upwards
              width: { xs: 60, sm: 100, md: 130 } // Adjust width for xs, sm, and md upwards
            }}>
            <img
              src="/waffle.webp" height={"100%"} width={"100%"} alt="Waffle logo"
            />
          </Box>
        </Box>
        <Paper elevation={2} sx={{ borderRadius: 2, height: '100%', padding: 4 }}>
          <Box sx={{ display: "flex", flexDirection: 'row', alignItems: 'end', justifyContent: 'space-between' }}

          >
            <UsernameInput username={username} setUsername={setUsername} />
            <div className="flex flex-row gap-2 items-center">
              <Box
                display={{ xs: 'none', md: 'block' }}
              >Similarity Scale</Box>
              <Slider min={0} max={40} value={fontScaleFactor} setValue={setFontScaleFactor} />
            </div>
          </Box>
          <ChatBox
            userId={userId}
            addMessage={message => postMessage({ message, author: userId, name: username })}
            userInput={userInput}
            setUserInput={setUserInput}
            allowInput={!!username && !!userId}
            fontScaleFactor={fontScaleFactor}
            headerHeight={header.current?.clientHeight || 0}
          />
        </Paper>
      </Container>
    </ThemeProvider >
  );
}
