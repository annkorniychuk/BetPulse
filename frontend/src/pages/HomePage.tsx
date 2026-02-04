import type {FunctionComponent} from 'react';
import './HomePage.css';
import Carousel from "../components/Carousel";
//import {Button, Nav} from "react-bootstrap";

const HomePage: FunctionComponent = () => {
    return (
        <div className="container">
            <h1>Main Page</h1>
            <Carousel></Carousel>
        </div>
    );
};

export default HomePage ;

