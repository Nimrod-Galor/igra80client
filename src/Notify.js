import React, {useEffect, useState} from "react";
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';


export const Notify = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("001");
        axios.get('http://localhost:21091/api/incidences')
        .then(res => {
            console.log("002: " + JSON.stringify(res.data));
            setMessages(res.data);
        })
    }, []);

    useEffect(() => {
        const connect = new HubConnectionBuilder()
        //.withUrl("http://localhost:57264/hubs/notifications")
        .withUrl("http://localhost:21091/incidenceNotifications")
        .withAutomaticReconnect()
        .build();

        setConnection(connect)
    }, []);

    useEffect(() => {
        if(connection){
            console.log("111");
            connection.start()
            .then(result => {
                console.log('Connected!');
                connection.on('refreshIncidences', (incidences) => {
                    console.log("in 2: " + JSON.stringify(incidences));
                    setMessages(incidences);
                });
            })
            .catch((error) => console.log(error));
        }
    }, [connection]);

    return(
        <div>
            <h3>Incidences</h3>
            <table>
                <thead>
                    <tr>
                        <th>CaId</th>
                        <th>Msg</th>
                    </tr>
                </thead>
                <tbody>
                {messages.map((inc, index) => (<tr key={index}>
                    <td>{inc.caId}</td>
                    <td>{inc.msg}</td>
                    </tr>))}
                </tbody>
            </table>
            
        </div>
    )
}

export default Notify;