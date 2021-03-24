import { getRoomByLeads, insertRoom } from "../../../services/room_services";
import { createSession } from '../../../helpers/opentok';

const getLeadsRoom = async (req, res) => {
    try {
        console.log("getting data");
        let dataRoom = await getRoomByLeads(req.body['leadsNumber']);
        console.log("check data..");
        await createSession();
        if (dataRoom == null) {
            console.log("insert data");
            await insertRoom(req.body['leadsNumber'], req.body['roomId']);
            console.log("get last insert data");
            dataRoom = await getRoomByLeads(req.body['leadsNumber']);
        }
        console.log("send result");
        return res.status(200).send(dataRoom);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
}

export {
    getLeadsRoom
}