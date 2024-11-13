import { ActionFunctionArgs, json } from "@remix-run/node";
import { DbConnection } from "./connection";
import { notifications } from "~/db";
import { eq } from "drizzle-orm";

export async function action({ request }: ActionFunctionArgs) {
    console.log("notifcation bro")
    const formData = await request.formData();
    const action = formData.get("action") as string | null
    const subscription = formData.get("subscription") as string | null;

    const idSUb = formData.get("id") as string | null
    const db = await DbConnection()



    if (action === "subscribe" && subscription) {

        const id = await db.insert(notifications).values({
            payload: JSON.parse(subscription),
        }).$returningId()
        return json({
            notification_id: id[0].notification_id
        })
    }

    if (action === "unsubscribe" && idSUb) {
        await db.delete(notifications).where(eq(notifications.notification_id, parseInt(idSUb)))
        return json({
            notification_id: null
        })
    }
    return json({
        notification_id: null
    })
}