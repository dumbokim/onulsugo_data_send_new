import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import styled from "styled-components";
import {
  Button,
  CenterContainer,
  HeadText,
  SendButton,
  SendButtonDis,
  SmButton,
  TextArea,
} from "../components";
import { route } from "next/dist/server/router";

const Home: NextPage = () => {
  const [frontText, setFrontText] = useState("전송 대기중");
  const [btnState, setBtnState] = useState(false);
  const [textData, setTextData] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const result = await axios
      .get("http://localhost/auth", {
        withCredentials: true,
      })
      .catch((err) => {
        router.push("/login");
      });

    if (result) {
      if (result.status === 200) {
        setIsLoaded(true);
      }
    }
  };

  const getTime = async () => {
    let today = new Date();
    const curTime = today.getHours();
    if (curTime <= 18) {
      today = new Date(today.setDate(today.getDate() - 1));
    }
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    let todayDate = year + "-" + month + "-" + day;
    return todayDate;
  };

  useEffect(() => {}, [frontText]);

  const csvToJson = async (csv_string: string) => {
    setFrontText("전송중 입니다.");

    setBtnState(true);

    const rows = csv_string.split("\n");

    let jsonArr = [];

    const header = rows[0].split(",");

    const headers = header[0].split("\t");

    if (headers[0] !== "날짜" || headers[12] !== "수거 할당") {
      setFrontText(`데이터좀 똑바로 넣으시지!!  날짜부터 수거할당이라고~`);

      return;
    }

    const headers2 = [
      "date",
      "service",
      "customer",
      "item",
      "region",
      "building",
      "lotadrs",
      "roadadrs",
      "detailadrs",
      "password",
      "feature",
      "district",
      "assignee",
    ];

    for (let i = 1; i < rows.length; i++) {
      let obj: {
        [name: string]: string;
      } = {};

      const row = rows[i].split(",");
      console.log(row);

      const value = row[0].split("\t");
      console.log(value);

      for (let j = 0; j < headers.length; j++) {
        obj[headers2[j]] = value[j].toString();
      }

      jsonArr.push(obj);
    }

    return jsonArr;
  };

  const jsonFileSend = async (jsonFile: any) => {
    const todayDate = await getTime();

    console.log(todayDate);

    const dbTable = `onulsugoList${todayDate}`;

    const option = {
      method: "post",
      url: "http://localhost/collection/assign",
    };

    for (let i = 0; i < jsonFile.length; i++) {
      try {
        await axios.post("http://localhost/collection/assign", {
          ...jsonFile[i],
          // checked: false,
          // index: i + 1,
        });
      } catch (e) {
        console.error(e);
        console.log(i + 1, "번째에서 에러 발생");

        setFrontText(`${i + 1}번째 데이터에서 에러 발생!`);
      }
    }

    // for (let i = 0; i < jsonFile.length; i++) {
    //   try {
    //     await addDoc(collection(db, dbTable), {
    //       ...jsonFile[i],
    //       checked: false,
    //       index: i+1,
    //     });
    //     console.log('dbTable : ',dbTable);
    //   } catch (e) {
    //     console.error(e);
    //     console.log(i+1 ,'번째에서 에러 발생');

    //     setFrontText(`${i+1}번째 데이터에서 에러 발생!`);
    //   }
    // }

    setBtnState(false);
    setFrontText("전송 완료");
  };

  const addData = async (e: any) => {
    e.preventDefault;
    e.stopPropagation;

    const jsonFile = await csvToJson(textData);

    if (jsonFile === undefined) {
      setBtnState(false);

      return;
    }

    await jsonFileSend(jsonFile);

    // const jsonData = await JSON.parse(jsonFile);
  };

  const logout = async () => {
    const result = await axios
      .get("http://localhost/auth/logout", {
        withCredentials: true,
      })
      .catch((e) => {
        console.log(e);
      });

    if (result) {
      if (result.status === 200) {
        router.push("/login");
      }
    }
  };

  return (
    <CenterContainer>
      <Head>
        <title>오늘수거 데이터 보내기 v3</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isLoaded ? (
        <div></div>
      ) : (
        <>
          <SmButton onClick={logout}>로그아웃</SmButton>
          <HeadText>오늘수거 데이터 보내기 v3</HeadText>
          <TextArea
            onChange={(e) => {
              setTextData(e.target.value);
            }}
          />
          <CenterContainer>
            {btnState === true ? (
              <SendButtonDis>데이터 전송</SendButtonDis>
            ) : (
              <SendButton onClick={addData}>데이터 전송</SendButton>
            )}
            <div style={{ textAlign: "center", color: "blue", margin: "15px" }}>
              {frontText}
            </div>
          </CenterContainer>
        </>
      )}
    </CenterContainer>
  );
};

export default Home;
