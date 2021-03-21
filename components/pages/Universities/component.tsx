import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Props } from './props';
import React, { FC, useContext, useState } from 'react';
import locales from '../../../core/locales';
import { useRouter } from 'next/router';
import { useTheme } from '@emotion/react';
import moment from 'moment';
import { Container } from '../../atoms/Container';
import { controller, getAvatar } from '../../../core';
import { Heading } from '../../atoms/Heading';
import { Paragraph } from '../../atoms/Paragraph';
import { Button } from '../../atoms/Button';
import { Feed } from '../../organisms/Feed';
import { Card } from '../../molecules/Card';
import { Profile as ProfileType } from '../../../core/mock';
import { Divider } from '../../atoms/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faIdCard, faPen, faRedo } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../contexts';
import { University as UniversityType } from '../../types/University';
import { Input } from '../../atoms/Input';

const Universities: FC<Props> = ({ language, universities }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const currentUser = useContext(UserContext);
  const [univers, setUnivers] = useState(universities);

  const handleSearch = (event) => {
    setUnivers(universities.filter(n => n.name.indexOf(event.currentTarget.value) !== -1));
  }

  return (
    <Container className="pt-5">
      <Head>
        <title>Universities</title>
      </Head>
      <Heading
        as="span"
        css={{
          display: "block",
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 20
        }}
      >Universities</Heading>
      <Input placeholder="Поиск..." onChange={handleSearch} className="mb-5" />
      <div css={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
        gridGap: 20
      }}>
        {univers.map((n, i) => (
          <Card
            className="p-3 animate__animated animate__fadeInDown mb-2"
            disableBorder
            css={{
              boxShadow: theme.blockShadowWide
            }}
          >
            <div css={{ borderRadius: 10, overflow: "hidden" }}>
              <img className="d-block w-100" src={getAvatar(n.image)} alt={n.name}/>
            </div>
            <Card disableBorder css={{ flex: 1, fontSize: 18, marginTop: 10, padding: 30, boxShadow: theme.blockShadowWide, background: "#fff", }}>
              <Heading
                as="h1"
                css={{
                  marginTop: 0,
                  marginBottom: 5,
                  fontSize: 18,
                  color: theme.accentBlue
                }}
              >
                {n.name}
              </Heading>
              <div className="align-items-center my-2 mb-3">
                <div css={{ flex: "0 0 20%", fontWeight: 600, fontSize: 14 }}>Description:</div>
                <div css={{ flex: 1, fontSize: 15, fontWeight: 500, lineHeight: 1.25 }}>{n.description}</div>
              </div>

              <Button
                css={{
                  padding: "10px 20px",
                  marginTop: 20,
                  textTransform: "initial"
                }}
                onClick={() => router.push(`/university/${n.id}`)}
              >More</Button>
            </Card>
          </Card>
        ))}
      </div>

    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const language = ctx.locale || ctx.defaultLocale;
  const id = ctx.query.id;
  const universities = await (await controller.get(`/api/universities`)).data.result;
  return { props: { language: locales[language], universities } }
}

export default Universities;
