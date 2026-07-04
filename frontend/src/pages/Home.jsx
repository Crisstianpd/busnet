import { useEffect, useState } from "react";
import MapView from "../components/Map/MapView";

export default function Home() {

    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState("");
    const [geojson, setGeojson] = useState(null);

    useEffect(() => {

        fetch("http://localhost:3000/routes")
            .then(res => res.json())
            .then(setRoutes);

    }, []);

    async function handleRouteChange(e) {

        const route = e.target.value;

        setSelectedRoute(route);

        if (!route) {
            setGeojson(null);
            return;
        }

        const response = await fetch(`http://localhost:3000/routes/${route}`);

        const data = await response.json();

        setGeojson(data);

    }

    return (

        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative"
            }}
        >

            <select

                value={selectedRoute}

                onChange={handleRouteChange}

                style={{
                    position: "absolute",
                    top: 15,
                    left: 15,
                    zIndex: 999,
                    padding: 10
                }}

            >

                <option value="">
                    Seleccione una ruta
                </option>

                {

                    routes.map(route => (

                        <option

                            key={route.route}

                            value={route.route}

                        >

                            {route.name}

                        </option>

                    ))

                }

            </select>

            <MapView geojson={geojson} />

        </div>

    );

}