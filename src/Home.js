// import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Spellcheck } from "@mui/icons-material";
import { Stack } from "@mui/system";
import { findAllColumns } from "./services/columns";
import { findAllWords } from "./services/words";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import LanguageIcon from "@mui/icons-material/Language";

import Working from "./Working";
import messages_ru from "./translations/ru.json";
import messages_en from "./translations/en.json";
import messages_fr from "./translations/fr.json";
import { IntlProvider, FormattedMessage } from "react-intl";
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";

const messages = {
  ru: messages_ru,
  en: messages_en,
  fr: messages_fr,
};

const theme = createTheme();

const Album = () => {
  const [loadingCols, setLoadingCols] = useState(false);
  const [columnNames, setColumns] = useState([]);

  const [loadingWords, setLoadingWords] = useState(false);
  const [words, setWords] = useState([]);

  const [result, setResult] = useState({});
  const [answer, setAnswer] = useState(null);

  const [locale, setLocale] = useState("en");
  const setEngligh = () => {
    setLocale("en");
  };
  const setRussian = () => {
    setLocale("ru");
  };
  const setFrench = () => {
    setLocale("fr");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const wrapperSetResultState = useCallback(
    (val) => {
      setResult(val);
    },
    [setResult]
  );

  const fetchColsData = async () => {
    setLoadingCols(true);
    const res = await findAllColumns();
    setColumns([...res]);
    setLoadingCols(false);
  };

  const fetchWordsData = async () => {
    setLoadingWords(true);
    const res = await findAllWords();
    setWords([...res]);
    setLoadingWords(false);
  };

  const refetch = () => {
    fetchColsData();
    fetchWordsData();
    setResult({});
    setAnswer(null);
  };

  const checkResult = async () => {
    if (result.words.items.length !== 0) {
      if (locale === "ru") {
        alert("Вы не распредили все слова!");
      } else if (locale === "en") {
        alert("You didn't divide all the words!");
      } else {
        alert("Vous n'avez pas divisé tous les mots!");
      }
    } else {
      let wrongLeftAnswers = [];
      let wrongRightAnswers = [];
      if (result.left.items.length !== 0) {
        wrongLeftAnswers = result.left.items.filter(
          (result) => result.column === "right"
        );
      }

      if (result.right.items.length !== 0) {
        wrongRightAnswers = result.right.items.filter(
          (result) => result.column === "left"
        );
      }
      let wrongAnswers = [];
      if (wrongLeftAnswers.length > 0) {
        wrongAnswers = wrongLeftAnswers.concat(wrongRightAnswers);
      } else {
        wrongAnswers = wrongRightAnswers;
      }
      await setAnswer(wrongAnswers);
    }
  };

  useEffect(() => {
    fetchColsData();
    fetchWordsData();
    setResult({});
    setAnswer(null);
  }, []);

  console.log(locale);

  return (
    <ThemeProvider theme={theme}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <CssBaseline />

        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Spellcheck />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <FormattedMessage
                id="title"
                defaultMessage="Сортировка слов"
                description="title"
              />
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <LanguageIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={setEngligh}>English</MenuItem>
                <MenuItem onClick={setFrench}>Français</MenuItem>
                <MenuItem onClick={setRussian}>Русский</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        {loadingCols && loadingWords ? (
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
              >
                <FormattedMessage
                  id="loading"
                  defaultMessage="Загрузка..."
                  description="loading"
                />
              </Typography>
            </Container>
          </Box>
        ) : (
          <main>
            {/* Hero unit */}
            <Box
              sx={{
                bgcolor: "background.paper",
                pt: 8,
                pb: 6,
              }}
            >
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h3"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  <FormattedMessage
                    id="title"
                    defaultMessage="Сортировка слов"
                    description="title"
                  />
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  paragraph
                >
                  <FormattedMessage
                    id="instructions"
                    defaultMessage="Разделите слова в 2 корзины"
                    description="instructions"
                  />
                </Typography>
              </Container>
            </Box>
            {/* End hero unit */}

            {words.length > 0 && columnNames.length > 0 && (
              <Working
                words={words}
                columnNames={columnNames}
                result={result}
                resultStateSetter={wrapperSetResultState}
                locale={locale}
              />
            )}

            {/* Answer */}
            <Box
              sx={{
                bgcolor: "background.paper",
                pt: 8,
                pb: 6,
              }}
            >
              <Container maxWidth="sm">
                {answer?.length > 0 ? (
                  <Typography
                    component="p"
                    variant="h5"
                    align="center"
                    color="#ff1744"
                    gutterBottom
                  >
                    <FormattedMessage
                      id="Incorrect Answers"
                      defaultMessage="Неправильные ответы:"
                      description="Incorrect Answers"
                    />

                    <br />
                    {answer.map((object, i) => {
                      if (i !== answer.length - 1) {
                        return object.word + ", ";
                      } else {
                        return object.word;
                      }
                    })}
                  </Typography>
                ) : null}

                {answer !== null && answer?.length === 0 ? (
                  <Typography
                    component="p"
                    variant="h5"
                    align="center"
                    color="#c5e1a5"
                    gutterBottom
                  >
                    <FormattedMessage
                      id="Correct"
                      defaultMessage="Все верно"
                      description="Correct"
                    />
                  </Typography>
                ) : null}
              </Container>
            </Box>
            {/* Answer end */}

            {/* Buttons */}
            <Container sx={{ py: 8 }} maxWidth="md">
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button variant="contained" onClick={checkResult}>
                  <FormattedMessage
                    id="Check answers"
                    defaultMessage="Проверить результаты!"
                    description="Check answers"
                  />
                </Button>
                <Button variant="outlined" onClick={refetch}>
                  <FormattedMessage
                    id="New start"
                    defaultMessage="Начать заново"
                    description="New start"
                  />
                </Button>
              </Stack>
            </Container>
            {/* Buttons end */}
          </main>
        )}
      </IntlProvider>
    </ThemeProvider>
  );
};

export default Album;
