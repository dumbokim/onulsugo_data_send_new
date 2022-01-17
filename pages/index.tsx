import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../helpers/firebase";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
  const [frontText, setFrontText] = useState("전송 대기중");
  const [btnState, setBtnState] = useState(false);
  const [textData, setTextData] = useState("");


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


  useEffect(() => {
    
  }, [frontText]);

  const csvToJson = async (csv_string:string) => {
    setFrontText('전송중 입니다.');

    setBtnState(true);

    const rows = csv_string.split("\n");

    let jsonArr = [];

    const header = rows[0].split(",");

    const headers = header[0].split("\t");    
    

    for (let i = 1; i < rows.length; i++) {
      let obj: {
        [name: string]: string;
      } = {};

      const row = rows[i].split(",");
      console.log(row);
      
      
      const value = row[0].split('\t');
      console.log(value);
      
      
      for (let j = 0; j < headers.length; j++) {

        obj[headers[j]] = value[j];
      }

      jsonArr.push(obj);
    }

    return jsonArr;
  }

  const jsonFileSend = async (jsonFile:any) => {
    const todayDate = await getTime();

    console.log(todayDate);

    const dbTable = `onulsugoList${todayDate}`;

    for (let i = 0; i < jsonFile.length; i++) {
      try {
        await addDoc(collection(db, dbTable), {
          ...jsonFile[i],
          checked: false,
          index: i+1,
        });
        console.log('dbTable : ',dbTable);
      } catch (e) {
        console.error(e);
        console.log(i+1 ,'번째에서 에러 발생');
        
        setFrontText(`${i+1}번째 데이터에서 에러 발생!`);
      }
    }

    setBtnState(false);
    setFrontText("전송 완료");
  }


  const addData = async (e: any) => {
    e.preventDefault;
    e.stopPropagation;

    let jsonFile = await csvToJson(textData);

    await jsonFileSend(jsonFile);

    // const jsonData = await JSON.parse(jsonFile);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>오늘수거 데이터 보내기 v2</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2 style={{color: "orange"}}>오늘수거 데이터 보내기 v3</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <textarea
          style={{ width: "50vw", height: "40vh" }}
          onChange={(e) => {
            setTextData(e.target.value);
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button style={{ padding: "15px", margin: "10px", backgroundColor:"orange", color:"white", border:'none', borderRadius:"1vh"  }} onClick={addData} disabled={btnState}>
          데이터 전송
        </button>

        <div style={{ textAlign: "center", color: "blue", margin: "15px" }}>
          {frontText}
        </div>
      </div>
    </div>
  );
};

export default Home;
