import { useState, useEffect } from "react";
import styled from "styled-components";
import { showCarpoolState, showTaxiState } from "../atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import "intersection-observer";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CarpoolUpdateState, TaxiUpdateState, pidState, CarpoolWritingState, TaxiWritingState } from "../atoms";

// problem : 스크롤 바를 체크하는 target1, target이 서로 연동됨
const ListComponent = () => {
    const [carpoolItems, setCarpoolItems] = useState([]);
    const [taxiItems, setTaxiItems] = useState([]);
    const [target, setTarget] = useState(null);
    const [target1, setTarget1] = useState(null);
    const isCarpoolshow = useRecoilValue(showCarpoolState);
    const [tempId, setTempId] = useState(0);
    const [tempId1, setTempId1] = useState(0);
    const setCarpoolUpdateState = useSetRecoilState(CarpoolUpdateState);
    const setTaxiUpdateState = useSetRecoilState(TaxiUpdateState);
    const setpidState = useSetRecoilState(pidState);
    const setCarpoolWriting = useSetRecoilState(CarpoolWritingState);
    const setTaxiWriting = useSetRecoilState(TaxiWritingState);
    
    let carpoolId = -1;
    if (tempId !== 0) carpoolId = tempId;
    let taxiId = -1;
    if (tempId1 !== 0) taxiId = tempId1;

    const handleCarpoolUpdate = (pid) => {
        setCarpoolUpdateState(true);
        setTaxiUpdateState(false);
        setCarpoolWriting(false);
        setTaxiWriting(false);
        setpidState(pid);
    };

    const handleTaxiUpdate = (pid) => {
        setTaxiUpdateState(true);
        setCarpoolUpdateState(false);
        setCarpoolWriting(false);
        setTaxiWriting(false);
        setpidState(pid);
    };

    //useEffect에 의해 observer와 묶여서 매번 호출되는 문제 개선 필요
    const getInitialData = async () => {
        const responseC = await axios.get(`http://localhost:8080/parties`, {
            params: {
                amount: 1,
                type: "카풀",
            },
        });

        const responseT = await axios.get(`http://localhost:8080/parties`, {
            params: {
                amount: 1,
                type: "택시",
            },
        });

        console.log(responseC);

        if (carpoolId === -1) carpoolId = responseC.data[0].pid + 1;
        // carpoolId = responseC.data[0].pid;
        // taxiId = responseT.data[0].pid;
        if (taxiId === -1) taxiId = responseT.data[0].pid + 1;
    };

    // Function to delete a party
  const deleteParty = async (partyId) => {
    try {
      await axios.delete(`http://localhost:8080/parties/${partyId}`);
      showPopupMessage();
      // Handle successful deletion (e.g., remove the deleted party from the state)
    } catch (error) {
      // Handle error (e.g., show an error message)
    }
  };

  const showPopupMessage = () => {
    toast.success('삭제 되었습니다');
  };

    const carpoolFetchData = async () => {
        const response = await axios.get(`http://localhost:8080/parties`, {
            params: {
                lastId: carpoolId,
                amount: 2,
                type: "카풀",
                keyword: "",
            },
        });

        const data = await response.data;
        console.log(data);

        setCarpoolItems((prev) => prev.concat(data));
        if (data.length > 0) {
        carpoolId = data[data.length - 1].pid;
        }
        // console.log(carpoolId, "카풀");
    };

    const taxiFetchData = async () => {
        const response = await axios.get(`http://localhost:8080/parties`, {
            params: {
                lastId: taxiId,
                amount: 2,
                type: "택시",
                keyword: "",
            },
        });

        const data = await response.data;
        console.log(data[data.length - 1]);

        setTaxiItems((prev) => prev.concat(data));
        taxiId = data[data.length - 1].pid;
        console.log(taxiId, "택시");
    };

    useEffect(() => {
        let observer;

        // if (tempId === 0) {
        //     carpoolId = getInitialData();
        // }

        if (target && isCarpoolshow) {
            const onIntersect = async ([entry], observer) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    // carpoolId < 23
                    if (carpoolId < 2 && carpoolId !== -1) {
                        return () => observer && observer.disconnect();
                    }
                    await getInitialData();
                    await carpoolFetchData();
                    observer.observe(entry.target);
                    setTempId(carpoolId);
                }
            };
            observer = new IntersectionObserver(onIntersect, { threshold: 0.7 });
            observer.observe(target);
        }
        return () => observer && observer.disconnect();
    }, [target, isCarpoolshow]);

    useEffect(() => {
        let observer1;

        // if (tempId1 === 0) {
        //     getInitialData();
        // }

        if (target1 && !isCarpoolshow) {
            const onIntersect = async ([entry], observer) => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    if (taxiId < 2 && taxiId !== -1) {
                        // setTempId1(taxiId);
                        return () => observer && observer.disconnect();
                    }

                    await getInitialData();
                    await taxiFetchData();
                    observer.observe(entry.target);
                    setTempId1(taxiId);
                }
            };
            observer1 = new IntersectionObserver(onIntersect, { threshold: 0.7 });
            observer1.observe(target1);
        }
        return () => observer1 && observer1.disconnect();
    }, [target1, isCarpoolshow]);

    return (
        // 각 listItem의 id는 코드 동작을 확인하기 위해 임시로 넣은 것이다.
        <Main>
            {isCarpoolshow ? (
                <div>
                    {carpoolItems.map((item, id) => {
                        return (
                            <ListCarItem key={id}>
                                <ListCarID>{item.pid}</ListCarID>
                                <ItemInfo>
                                    <div>출발지 : {item.startPoint}</div>
                                    <div>목적지 : {item.endPoint}</div>
                                    <div>
                                        출발 시간 : {item.startDate} {item.startTime}
                                    </div>
                                </ItemInfo>
                                <CurrentMember>
                                    {item.currentHeadcnt}/{item.totalHeadcnt} 명
                                </CurrentMember>
                                <CparpoolJoinButton onClick={() => handleCarpoolUpdate(item.pid)}>수정</CparpoolJoinButton>
                                <CparpoolJoinButton onClick={() => deleteParty(item.pid)}>삭제</CparpoolJoinButton>
                            </ListCarItem>
                        );
                    })}
                    <div ref={setTarget}>.</div>
                </div>
            ) : (
                <div>
                    {taxiItems.map((item, id) => {
                        return (
                            <ListTaxiItem key={id}>
                                <ListTaxiID>{item.pid}</ListTaxiID>
                                <ItemInfo>
                                    <div>출발지 : {item.startPoint}</div>
                                    <div>목적지 : {item.endPoint}</div>
                                    <div>
                                        출발 시간 : {item.startDate} {item.startTime}
                                    </div>
                                </ItemInfo>
                                <CurrentMember>
                                    {item.currentHeadcnt}/{item.totalHeadcnt} 명
                                </CurrentMember>
                                <JoinButton onClick={() => handleTaxiUpdate(item.pid)}>수정</JoinButton>
                                <JoinButton onClick={() => deleteParty(item.pid)}>삭제</JoinButton>
                            </ListTaxiItem>
                        );
                    })}
                    <div ref={setTarget1}>----</div>
                </div>
            )}
            {/* <div ref={setTarget}>this is the target</div> */}
        </Main>
    );
};

export default ListComponent;

// observer가 인식하는 뷰포트의 최대 크기는 100vh이다 그러나 화면에 맞추기 위해서는 threshold 값을 조정해야 한다.
const Main = styled.div`
    width: 33%;
    height: calc(100vh - 87.6px);
    overflow-y: scroll;
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 100;
`;

const ListCarItem = styled.div`
    margin: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // background-color: #eff3ff;
    background-color: #fff;
    border-top: 1px solid #eee;
    // border: 2px solid #0583f2;
    // border-radius: 10px;
`;

const ListTaxiItem = styled.div`
    margin: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-top: 1px solid #eee;
    //background-color: #f8f5bf;
    //border: 1px solid black;
    //border-radius: 10px;
`;

const ListCarID = styled.div`
    font-weight: bold;
    // background-color: #b8d7fb;
    border: 2px solid #0583f2;
    border-radius: 10px;
    font-size: 20px;
    padding: 20px 20px;
    width: 25px;
    text-align: center;
`;

const ListTaxiID = styled.div`
    font-weight: bold;
    //background-color: yellow;
    border: 2px solid #E3D700;
    border-radius: 10px;
    font-size: 20px;
    padding: 20px 20px;
    width: 25px;
    text-align: center;
`;

const ItemInfo = styled.div`
    margin: 10px;
    width: 240px;
    font-weight: bold;

    @media (max-width: 1150px) {
        //브라우저 크기 조절시 사라짐
        display: none;
    }
`;

const CurrentMember = styled.div`
    margin-right: 10px;
    font-weight: bold;

    @media (max-width: 600px) {
        //브라우저 크기 조절시 사라짐
        display: none;
    }
`;

const JoinButton = styled.button`
    background-color: white;
    border-radius: 10px;
    padding: 10px 10px;
    text-align: center;
    margin-right: 1px;
    font-weight: bold;
    cursor: pointer; //마우스 포인터 변화

    transition: background-color 0.3s;

    &:hover {
        //버튼 클릭 효과
        background-color: #35a0ff;
    }

    &:active {
        //버튼 클릭 효과
        background-color: #5c5c5c;
    }

    @media (max-width: 780px) {
        //브라우저 크기 조절시 사라짐
        display: none;
    }
`;

const CparpoolJoinButton = styled.button`
    background-color: white;
    border-radius: 10px;
    padding: 10px 10px;
    text-align: center;
    margin-right: 1px;
    font-weight: bold;
    cursor: pointer; //마우스 포인터 변화

    transition: background-color 0.3s;

    &:hover {
        //버튼 클릭 효과
        background-color: #35a0ff;
    }

    &:active {
        //버튼 클릭 효과
        background-color: #5c5c5c;
    }

    @media (max-width: 780px) {
        //브라우저 크기 조절시 사라짐
        display: none;
    }
`;
