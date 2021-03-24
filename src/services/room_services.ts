import { toSqlDate } from "../helpers/common";
import { getOne, insert } from "../helpers/queryBuilder";

const getRoomByLeads = (leadsNumber: string) => {
    return getOne("video_conference", ['*'], { leads_number: leadsNumber });
}

const insertRoom = (leadsNumber: string, roomId: string) => {
    return insert("video_conference", {
        leads_number: leadsNumber,
        room_id: roomId,
        created_at: toSqlDate(Date()),
        created_by: leadsNumber
    })
}

export {
    getRoomByLeads,
    insertRoom
}