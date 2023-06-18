import React, { useState } from "react";
import styled from "styled-components";
import { useResetRecoilState, useRecoilState } from "recoil";
import { TaxiUpdateState, pidState } from "../atoms";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaxiUpdate = () => {
    const resetTaxiUpdate = useResetRecoilState(TaxiUpdateState);
    const [pid, setpid] = useRecoilState(pidState);

    const [taxiData, setTaxiData] = useState({
        type: "택시",
        startPoint: "",
        startLat: "37.86845655465745",
        startLng: "127.73665776796231",
        endPoint: "",
        totalHeadcnt: 0,
        startDate: "",
        startTime: "",
    });

    const handleClose = () => {
        resetTaxiUpdate();
    };

    const handleRegister = async (pid) => {
        // 등록 클릭시 서버로 내용을 보내야함
        try {
            const response = await axios.put(`http://localhost:8080/parties/${pid}`, {
                type: "택시",
                startPoint: taxiData.startPoint,
                startLat: "37.86845655465745",
                startLng: "127.73665776796231",
                endPoint: taxiData.endPoint,
                totalHeadcnt: taxiData.totalHeadcnt,
                startDate: taxiData.startDate,
                startTime: taxiData.startTime,
            });

            if (response.status >= 200 && response.status < 300) {
                // POST request was successful
                console.log("PUT request was successful");
                showPopupMessage();
            } else {
                // POST request was not successful
                console.log("PUT request failed");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const showPopupMessage = () => {
        toast.success('수정 되었습니다.');
      };

    return (
        <>
            <Container>
                <Title>택시 수정하기</Title> {/* Added title */}
                <InputContainer>
                    <InputLabel>출발지</InputLabel>
                    <InputField
                        type="text"
                        onChange={(e) => {
                            setTaxiData((prevState) => ({
                                ...prevState,
                                startPoint: e.target.value,
                            }));
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>도착지</InputLabel>
                    <InputField
                        type="text"
                        onChange={(e) => {
                            setTaxiData((prevState) => ({
                                ...prevState,
                                endPoint: e.target.value,
                            }));
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>최대인원</InputLabel>
                    <InputField
                        type="number"
                        onChange={(e) => {
                            setTaxiData((prevState) => ({
                                ...prevState,
                                totalHeadcnt: e.target.value,
                            }));
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>날짜</InputLabel>
                    <InputField
                        type="date"
                        onChange={(e) => {
                            setTaxiData((prevState) => ({
                                ...prevState,
                                startDate: e.target.value,
                            }));
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>출발 시간</InputLabel>
                    <InputField
                        type="time"
                        onChange={(e) => {
                            setTaxiData((prevState) => ({
                                ...prevState,
                                startTime: e.target.value,
                            }));
                        }}
                    />
                </InputContainer>
                <ButtonContainer>
                    <RegisterButton onClick={() => handleRegister(pid)}>등록</RegisterButton>
                    <CloseButton onClick={handleClose}>취소</CloseButton>
                </ButtonContainer>
            </Container>
        </>
    );
};

export default TaxiUpdate;

const Container = styled.div`
    width: 50vw;
    min-width: 300px;
    max-width: 600px;
    height: 65vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 10px;
    border: 1px solid black;
    overflow: auto;
`;

const Title = styled.h1`
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 10px;
    margin-top: 10px;
`;

const InputContainer = styled.div`
    margin-bottom: 15px;
    margin-left: 30px;
`;

const InputLabel = styled.label`
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
`;

const InputField = styled.input`
    width: 90%;
    height: 25px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding: 5px;
`;

const ButtonContainer = styled.div`
    position: absolute;
    top: 30px;
    right: 0px;
    transform: translate(-15%, -50%);
`;

const RegisterButton = styled.button`
    width: 60px;
    height: 30px;
    margin-right: 10px;
    border-radius: 5px;
    font-weight: bold;
    color: #0583f2;
    background-color: #a7d1f7;
    border: none;
    cursor: pointer; //마우스 포인터 변화
`;

const CloseButton = styled.button`
    width: 40px;
    height: 30px;
    border-radius: 5px;
    font-weight: bold;
    border: none;
    cursor: pointer; //마우스 포인터 변화
`;
