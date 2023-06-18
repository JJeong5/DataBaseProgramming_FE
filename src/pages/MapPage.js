import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { Container as MapDiv } from "react-naver-maps";
import { carpoolDataState, taxiDataState, showCarpoolState, showTaxiState } from "../atoms";
import { useRecoilValue } from "recoil";
import ListComponent from "../components/ListComponent";
import styled from "styled-components";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MapPage = () => {
    const carpoolMarkerData = useRecoilValue(carpoolDataState);
    const taxiMarkerData = useRecoilValue(taxiDataState);

    return (
        <MainDiv>
            <MapBox>
                <MapComponent CarpoolMarkerData={carpoolMarkerData} TaxiMarkerData={taxiMarkerData} />;
            </MapBox>
            <ListComponent />
            <ToastContainer /> {/* Add this line */}
        </MainDiv>
    );
};

const MainDiv = styled.div`
    display: flex;
    align-items: center;
    background-color: #F4F8FE;
`;

const MapBox = styled(MapDiv)`
    width: 67%;
    height: calc(100vh - 87.6px);
    position: relative;
`;

export default MapPage;
