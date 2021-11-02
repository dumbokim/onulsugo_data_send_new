import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  addDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../helpers/firebase";
import { useState, useEffect } from "react";
// import { getTime } from "../helpers/getTime";
// import { useAlert } from "react-alert";

const Home: NextPage = () => {
  const [dataList, setDataList] = useState<any>([]);

  let todayDate = "";

  const dbTable = "onulsugoList";

  const getTime = async () => {
    let today = new Date();
    const curTime = today.getHours();
    if (curTime < 12) {
      today = new Date(today.setDate(today.getDate() - 1));
    }
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    todayDate = year + "-" + month + "-" + day;
  };

  const getData = async () => {
    await getTime();

    const querySnapshot = await getDocs(
      query(collection(db, dbTable), where("날짜", "==", todayDate))
    );

    let tempList: any = [];

    querySnapshot.docs.forEach((doc) => {
      tempList.push(doc.data());
    });

    setDataList(tempList);
  };

  useEffect(() => {
    getData();
  }, []);

  const [textData, setTextData] = useState("");

  const addData = async (e: any) => {
    e.preventDefault;
    e.stopPropagation;

    const jsonData = await JSON.parse(textData);

    for (let i = 0; i < jsonData.length; i++) {
      // console.log(jsonData[i]);
      try {
        await addDoc(collection(db, dbTable), jsonData[i]);
      } catch (e) {
        console.error(e);
      }
    }

    // window.alert("전송이 완료되었습니다!");
    // window.location.reload();
  };

  const readData = async (e: any) => {
    e.preventDefault;
    e.stopPropagation;

    const dbData = await getDocs(collection(db, dbTable));

    const dataList = dbData.docs.map((doc) => doc.data());

    console.log(dataList);

    // window.alert("전송이 완료되었습니다!");
    // window.location.reload();
  };

  // const readTime = async (e: any) => {
  //   e.preventDefault;
  //   e.stopPropagation;
  //   let today = new Date();
  //   const curTime = today.getHours();
  //   if (curTime < 12) {
  //     today = new Date(today.setDate(today.getDate() - 1));
  //   }
  //   const year = today.getFullYear();
  //   const month = ("0" + (today.getMonth() + 1)).slice(-2);
  //   const day = ("0" + today.getDate()).slice(-2);
  //   const time = year + "-" + month + "-" + day;
  //   console.log(curTime);
  // };

  return (
    <div className={styles.container}>
      <Head>
        <title>오늘수거 데이터 보내기</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>오늘수거 데이터 보내기</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* <form onSubmit={addData}> */}
        <textarea
          style={{ width: "50vw", height: "40vh" }}
          onChange={(e) => {
            setTextData(e.target.value);
            // console.log(textData);
          }}
        />
        {/* </form> */}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button style={{ padding: "15px", margin: "10px" }} onClick={addData}>
          데이터 전송
        </button>

        <button style={{ padding: "15px", margin: "10px" }} onClick={readData}>
          읽기
        </button>

        <button
          style={{ padding: "15px", margin: "10px" }}
          onClick={() => {
            // getData();

            console.log(dataList);
          }}
        >
          시간 체크
        </button>
      </div>
    </div>
  );
};

export default Home;
