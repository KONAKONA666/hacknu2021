import { FC, Fragment, useState } from 'react';
import { GetServerSideProps } from 'next';
import { Props } from './props';
import { controllerMl, notifyError } from '../../../core';
import locales from '../../../core/locales';
import { Container } from '../../atoms/Container';
import React from 'react';
import { Heading } from '../../atoms/Heading';
import { useTheme } from '@emotion/react';
import { Button } from '../../atoms/Button';
import { Card } from '../../molecules/Card';

const Tests: FC<Props> = ({ suggestions }: Props) => {
  const theme = useTheme();
  const [form, setForm] = useState(suggestions.reduce((acc, n) => ({ ...acc, [n[1]]: 0 }), {}));
  const [suggestionsSec, setSuggestionsSec] = useState<[string, number][]>();
  const [formSec, setFormSec] = useState({});
  const [isNextClicked, setIsNextClick] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const handleRange = (id) => (event) => {
    const val = Number(event.currentTarget.value);
    setForm({...form, [id]: val});
  }
  const handleRangeSec = (id) => (event) => {
    const val = Number(event.currentTarget.value);
    setFormSec({...formSec, [id]: val});
  }
  const handleNext = () => {
    setIsNextClick(true);
    const questions = suggestions.map(n => n[1]);
    const answers = suggestions.map(n => form[n[1]]);
    controllerMl.post(`/get_suggestions/`, { questions, answers })
      .then(res => {
        setSuggestionsSec(res.data.questions);
        setFormSec(res.data.questions.reduce((acc, n) => ({ ...acc, [n[1]]: 0 }), {}));
      })
      .catch(() => {
        notifyError("Network error. Check your internet connection");
      });
  }
  const handleSubmit = () => {
    setIsDone(true);
    const questionsFir = suggestions.map(n => n[1]);
    const answersFir = suggestions.map(n => form[n[1]]);
    const questionsSec = suggestionsSec.map(n => n[1]);
    const answersSec = suggestionsSec.map(n => formSec[n[1]]);
    const questions = [...questionsFir, ...questionsSec];
    const answers = [...answersFir, ...answersSec];
    controllerMl.post(`/get_recs/5`, { questions, answers })
      .then(res => {
        setRecommendations(res.data.recs);
      })
      .catch(() => {
        notifyError("Network error. Check your internet connection");
      });
  }

  return (
    <Fragment>
      <Container>
        <Heading
          as="h1"
          css={{
            display: "block",
            fontSize: 23,
            marginTop: 45,
            marginBottom: 20,
            color: theme.accentBlue
          }}
        >How much you're interested on below things</Heading>
        <div css={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(100px, 1fr))",
          gridGap: 20
        }}>
          {suggestions.map((n, i) => (
            <Card
              className="p-3 animate__animated animate__fadeInRight"
              css={{
                background: "#fff",
                textAlign: "center",
                boxShadow: theme.blockShadow
              }}
              key={i}
            >
            <span css={{
              display: "block",
              marginBottom: 15,
              textTransform: "capitalize",
              fontWeight: 700
            }}>{n[0]}</span>
              <input type="range" defaultValue={0} min={0} max={1} step={0.25} onChange={handleRange(n[1])} disabled={isNextClicked} />
            </Card>
          ))}
        </div>
        {suggestionsSec && (
          <Fragment>
            <Heading
              as="h1"
              css={{
                display: "block",
                fontSize: 23,
                marginTop: 45,
                marginBottom: 20,
                color: theme.accentBlue
              }}
            >Let's continue</Heading>
            <div css={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(100px, 1fr))",
              gridGap: 20
            }}>
              {suggestionsSec.map((n, i) => (
                <Card
                  className="p-3 animate__animated animate__fadeInRight"
                  css={{
                    background: "#fff",
                    boxShadow: theme.blockShadow,
                    textAlign: "center",
                  }}
                  key={i}
                >
                  <span css={{
                    display: "block",
                    marginBottom: 15,
                    textTransform: "capitalize",
                    fontWeight: 700
                  }}>{n[0]}</span>
                  <input type="range" defaultValue={0} min={0} max={1} step={0.25} onChange={handleRangeSec(n[1])} disabled={isDone} />
                </Card>
              ))}
            </div>
          </Fragment>
        )}


        {!isNextClicked && (
          <Button
            css={{
              padding: "10px 20px",
              textTransform: "initial",
              fontSize: 13,
              marginTop: 15
            }}
            onClick={handleNext}
          >Next</Button>
        )}
        {isNextClicked && !isDone ? (
          <Button
            css={{
              padding: "10px 20px",
              textTransform: "initial",
              fontSize: 13,
              marginTop: 15
            }}
            onClick={handleSubmit}
          >Finish</Button>
        ) : null}


        {isDone && recommendations.length ? (
          <Fragment>
            <Heading
              as="h1"
              css={{
                display: "block",
                fontSize: 23,
                marginTop: 45,
                marginBottom: 20,
                color: theme.accentBlue
              }}
            >Yay! Here's your results!</Heading>
            {recommendations.map((n, i) => (
              <Card
                className="p-3"
                css={{
                  background: "#fff",
                  boxShadow: theme.blockShadow,
                  marginBottom: 10,
                  fontSize: 15,
                  fontWeight: 700
                }}
                key={i}
              >{n}</Card>
            ))}
          </Fragment>
        ) : null}
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const language = ctx.locale || ctx.defaultLocale;
  const suggestions = await (await controllerMl.post(`/get_suggestions/`, { questions: [], answers: [] })).data.questions;
  return { props: { language: locales[language], suggestions } }
}

export default Tests;
