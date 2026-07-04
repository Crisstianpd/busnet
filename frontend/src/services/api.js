const API = "http://localhost:3000";

export async function getRoutes(){

    const response = await fetch(`${API}/routes`);

    return response.json();

}

export async function getRoute(id){

    const response = await fetch(`${API}/routes/${id}`);

    return response.json();

}