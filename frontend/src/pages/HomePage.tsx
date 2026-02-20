import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { getCompetitions } from "../api/axiosConfig";
import "./HomePage.css";

type Competition = {
    id: number;
    name: string;
    startDate: string;
    prizePool: number;
};

const HomePage = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCompetitions();
                setCompetitions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="container-fluid p-0">
                <Carousel />
            </div>

            <div className="container mt-4">
                {loading && <p>Loading...</p>}

                <div className="row">
                    {competitions.map(c => (
                        <div key={c.id} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5>{c.name}</h5>
                                    <p>Start: {c.startDate}</p>
                                    <p>Prize pool: {c.prizePool}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
