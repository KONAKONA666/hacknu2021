import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Props } from './props';
import React, { FC, useContext } from 'react';
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
import { Profile as ProfileType, Specialization } from '../../../core/mock';
import { Divider } from '../../atoms/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faIdCard, faPen, faRedo } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../contexts';
import { University as UniversityType } from '../../types/University';

const University: FC<Props> = ({ language, specialty }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const currentUser = useContext(UserContext);

  return (
    <Container className="pt-5">
      <Head>
        <title>{specialty.name}</title>
      </Head>
      <div className="d-flex align-items-start">
        <Card
          className="p-3 animate__animated animate__fadeInDown col-4"
          disableBorder
          css={{
            boxShadow: theme.blockShadowWide
          }}
        >

          <Card disableBorder css={{ flex: 1, fontSize: 18, marginTop: 10, padding: 30, boxShadow: theme.blockShadowWide, background: "#fff", }}>
            <Heading
              as="h1"
              css={{
                marginTop: 0,
                marginBottom: 5,
                fontSize: 25,
                color: theme.accentBlue
              }}
            >
              {specialty.name}
            </Heading>
            <Divider color={theme.greyBorder} className="mb-4 mt-2" />
            <div className="align-items-center my-2 mb-3">
              <div css={{ flex: "0 0 20%", fontWeight: 600, fontSize: 14 }}>Description:</div>
              <div css={{ flex: 1, fontSize: 15, fontWeight: 500, lineHeight: 1.25 }}>{specialty.description}</div>
            </div>
            <div className="align-items-center my-2">
              <div css={{ flex: "0 0 20%", fontWeight: 600, fontSize: 14 }}>Rating:</div>
              <div css={{ flex: 1 }}>{specialty.rating}/5.0</div>
            </div>
          </Card>
        </Card>
        <div className="col px-0 ml-md-5">
          <div className="text-center">
            <Heading
              as="h1"
              css={{
                marginTop: 50,
                marginBottom: 5,
                fontSize: 25,
                color: theme.accentBlue
              }}
            >
              Disciplines
            </Heading>
            <div
              className="animate__animated animate__bounceIn"
              css={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
                gridGap: 40,
                marginTop: 30
              }}
            >
              {specialty.universities.map((n, i) => (
                <Card
                  css={{
                    background: "#fff",
                    padding: 20,
                    boxShadow: theme.blockShadow
                  }}
                  key={i}
                >
                  <span css={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginTop: 20,
                    display: "block",
                    marginBottom: 10,
                    textAlign: "left"
                  }}>{n.name}</span>
                  <Paragraph css={{
                    marginTop: 5,
                    lineHeight: 1.25,
                    fontSize: 14,
                    color: theme.greyText,
                    textAlign: "left"
                  }}>{n.description}</Paragraph>
                  <span css={{
                    fontWeight: 600,
                    fontSize: 12,
                    display: "block",
                    textAlign: "left"
                  }}>{n.weight}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>

      </div>

    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const language = ctx.locale || ctx.defaultLocale;
  const id = ctx.query.id;
  const res = await (await controller.get(`/api/specialists/${id}`)).data.result;
  const resUniver = await (await controller.get(`/api/get_speciality_modules/${id}`)).data.result.map(n => ({
    name: n.name,
    description: n.desc,
    weight: n.weight
  }));
  const specialty: Specialization = {
    ...res,
    universities: resUniver
  }
  return { props: { language: locales[language], specialty } }
}

export default University;
