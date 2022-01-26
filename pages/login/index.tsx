import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import router from 'next/router';
import { Button, CenterContainer, HeadText, InputBox, LoginForm } from '../../components';

const Login: NextPage = () => {
    const [account, setAccount] = useState('');
    const [pwd, setPwd] = useState('');
    
    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
    const result = await axios.get('http://localhost/auth', {
      withCredentials: true
    }).catch((err) => {
    });
        
    if (result) {
        if (result.status === 200) {
        router.push('/');
      }
    }
  }

    const login = async (account:string , pwd:string) => {
        const result = await axios.post('http://localhost/auth/signweb', {
            account,
            pwd
        },
            {withCredentials: true}
        )

        if (result) {
            if (result.status === 200) {
                router.push('/');
            }
        }
    }
    

    return (<CenterContainer>
        <HeadText>로그인을 해봅시다</HeadText>
        <LoginForm>
            <InputBox onChange={(e) => {
                setAccount(e.target.value);
            }} />
            <InputBox onChange={(e) => {
                setPwd(e.target.value);
            }} />
            <Button onClick={(e) => {
                login(account, pwd);
            }}>로그인</Button>
        </LoginForm>
  </CenterContainer> );
};

export default Login;