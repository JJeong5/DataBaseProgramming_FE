import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useResetRecoilState } from "recoil";
import { CarpoolWritingState } from "../atoms";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CarpoolWritingComponent = () => {
    const resetCarpoolWriting = useResetRecoilState(CarpoolWritingState);

    const [carpoolData, setCarpoolData] = useState({
        type: "카풀",
        startPoint: "",
        startLat: "37.86845655465745",
        startLng: "127.73665776796231",
        endPoint: "",
        totalHeadcnt: 0,
        startDate: "",
        startTime: "",
        carNumber: "98가7654",
        content: "",
    });

    const handleClose = () => {
        resetCarpoolWriting();
    };

    // type: "카풀",
    //             startPoint: carpoolData.startPoint,
    //             startLat: "37.86845655465745",
    //             startLng: "127.73665776796231",
    //             endPoint: carpoolData.endPoint,
    //             totalHeadcnt: carpoolData.totalHead,
    //             startDate: carpoolData.startDate,
    //             startTime: carpoolData.startTime,
    //             carNumber: "98가7654",
    //             content: "",

    const handleRegister = async () => {
        // 등록 클릭시 서버로 내용을 보내야함

        // try {
        //     const response = await fetch("http://localhost:8080/parties", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             type: "카풀",
        //             startPoint: "글로벌경영관11",
        //             startLat: "37.87120749003905",
        //             startLng: "127.7431938775162",
        //             endPoint: "남춘천역",
        //             totalHeadcnt: 4,
        //             startDate: "2023-04-19",
        //             startTime: "오후 09:10",
        //             carNumber: "98가7654",
        //             content: "카풀내용수정테스트asdfgh",
        //         }),
        //     });

        //     if (response.ok) {
        //         // Registration successful
        //     } else {
        //         // Registration failed
        //         console.log("Registration failed. Please try again.");
        //     }
        // } catch (error) {
        //     console.log("An error occurred:", error);
        // }

        try {
            const response = await axios.post("http://localhost:8080/parties", {
                type: "카풀",
                startPoint: carpoolData.startPoint,
                startLat: "37.86845655465745",
                startLng: "127.73665776796231",
                endPoint: carpoolData.endPoint,
                totalHeadcnt: carpoolData.totalHeadcnt,
                startDate: carpoolData.startDate,
                startTime: carpoolData.startTime,
                carNumber: "98가7654",
                content: "",
            });

            if (response.status >= 200 && response.status < 300) {
                // POST request was successful
                console.log("POST request was successful");
                showPopupMessage();
            } else {
                // POST request was not successful
                console.log("POST request failed");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const showPopupMessage = () => {
        toast.success('등록 되었습니다.');
      };

    useEffect(() => {
        console.log(carpoolData);
    }, [carpoolData]);

    return (
        <>
            <Container>
                <Title>카풀 글쓰기</Title> {/* Added title */}
                <InputContainer>
                    <InputLabel>출발지</InputLabel>
                    <InputField
                        type="text"
                        onChange={(e) => {
                            setCarpoolData((prevState) => ({
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
                            setCarpoolData((prevState) => ({
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
                            setCarpoolData((prevState) => ({
                                ...prevState,
                                totalHeadcnt: parseInt(e.target.value, 10),
                            }));
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>날짜</InputLabel>
                    <InputField
                        type="date"
                        onChange={(e) => {
                            setCarpoolData((prevState) => ({
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
                            setCarpoolData((prevState) => ({
                                ...prevState,
                                startTime: e.target.value,
                            }));
                        }}
                    />
                </InputContainer>
                <InputContainer>
                    <InputLabel>글 내용</InputLabel>
                    <TextareaField
                        onChange={(e) => {
                            setCarpoolData((prevState) => ({
                                ...prevState,
                                content: e.target.value,
                            }));
                        }}
                    />
                </InputContainer>
                <ButtonContainer>
                    <RegisterButton onClick={handleRegister}>등록</RegisterButton>
                    <CloseButton onClick={handleClose}>취소</CloseButton>
                </ButtonContainer>
            </Container>
        </>
    );
};

export default CarpoolWritingComponent;

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

const TextareaField = styled.textarea`
    width: 90%;
    height: 100px;
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
