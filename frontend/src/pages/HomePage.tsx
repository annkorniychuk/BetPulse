import type {FunctionComponent} from 'react';
import './HomePage.css';
import Carousel from "../components/Carousel";

const HomePage: FunctionComponent = () => {
    return (
        <div>
            <div className="container-fluid p-0">
                <h1></h1>
                <Carousel />
            </div>

            <div className="container mt-4">

            </div>
        </div>
    );
};

export default HomePage;