import React from 'react';

//importing
import Style from '../styles/index.module.css';
import { HeroSection, Service, BigNFTSilder } from '../components/ComponentsIndex';

const Home = () => {
    return (
        <div className={Style.homePage}>
            <HeroSection />
            <Service />
            <BigNFTSilder />
        </div>
    );
};

export default Home;