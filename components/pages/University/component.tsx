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
import { Profile as ProfileType } from '../../../core/mock';
import { Divider } from '../../atoms/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faIdCard, faPen, faRedo } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../contexts';
import { University as UniversityType } from '../../types/University';

const University: FC<Props> = ({ language, university }: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const currentUser = useContext(UserContext);

  return (
    <Container className="pt-5">
      <Head>
        <title>University {university.name}</title>
      </Head>
      <div className="d-flex align-items-start">
        <Card
          className="p-3 animate__animated animate__fadeInDown col-4"
          disableBorder
          css={{
            boxShadow: theme.blockShadowWide
          }}
        >
          <div css={{ borderRadius: 10, overflow: "hidden" }}>
            <img className="d-block w-100" src={getAvatar(university.image)} alt={university.name}/>
          </div>
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
              {university.name}
            </Heading>
            <Divider color={theme.greyBorder} className="mb-4 mt-2" />
            <div className="align-items-center my-2 mb-3">
              <div css={{ flex: "0 0 20%", fontWeight: 600, fontSize: 14 }}>Description:</div>
              <div css={{ flex: 1, fontSize: 15, fontWeight: 500, lineHeight: 1.25 }}>{university.description}</div>
            </div>
            <div className="align-items-center my-2">
              <div css={{ flex: "0 0 20%", fontWeight: 600, fontSize: 14 }}>Rating:</div>
              <div css={{ flex: 1 }}>{university.rating}/5.0</div>
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
              Specialties
            </Heading>
            <div
              className="animate__animated animate__bounceIn"
              css={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
                gridGap: 40,
                marginTop: 30
              }}
            >
              {university.specialties.map((n, i) => (
                <div key={i}>
                  <div
                    className="w-100"
                    css={{
                      backgroundImage: `url(${getAvatar(n.image)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 10,
                      height: 150
                    }}
                  />
                  <span css={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginTop: 20,
                    display: "block",
                    marginBottom: 0
                  }}>{n.name}</span>
                  <Paragraph css={{
                    marginTop: 5,
                    lineHeight: 1.25,
                    fontSize: 14,
                    color: theme.greyText
                  }}>{n.description}</Paragraph>
                </div>
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
  const res = await (await controller.get(`/api/universities/${id}`)).data.result;
  const resSpecialties = await (await controller.get(`/api/get_uni_info/${id}`)).data.result.map(n => ({ id: n[1], name: n[0] }));
  const university: UniversityType = {
    ...res,
    specialties: resSpecialties
  }
  return { props: { language: locales[language], university } }
}

export default University;
