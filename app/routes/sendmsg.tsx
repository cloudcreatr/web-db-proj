import { ActionFunctionArgs } from "@remix-run/node";
import { notifications } from "~/db";
import { DbConnection } from "./connection";
import { sendNotifications } from '@remix-pwa/push';
import { useFetcher } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
export async function action({ request }: ActionFunctionArgs) {
    console.log("notifcation bro")
    const formData = await request.formData();
    const title = formData.get("title") as string
    const body = formData.get("body") as string

    const db = await DbConnection()
    const subcribers = await db.select().from(notifications)
    subcribers.forEach(async (sub) => {
        sendNotifications({
            notification: {
                title: title,
                
                options: [{
                    body: body,

                }]


            },
            subscriptions: [sub.payload],
            vapidDetails: {
                publicKey: "BJtquP48ha3nCWpv7acvTUFn1TH6QDl6_Cs6-Ia4-EXIWYmVf4rvT0zVeU4Gqr3Q7HWAtigOXoLFY-qYHbSsF3g",
                privateKey: "x7ION_xzkz050XkVIbcu0ZpVOqXcxkU9T4ShhqWAazw"
            },

        })
    })

    return null
}


export default function SendMsg() {
    const f = useFetcher()
const issub = f.state === "submitting"
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-semibold text-xl mb-2">
                Send New Notification
            </h2>
            <f.Form method="post" className="space-y-3" >
                <Input name="title" placeholder="Title" required />
                <Input name="body" placeholder="Body" required />
                <Button type="submit">{
                    issub ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </>
                ) : "Send"
                }</Button>
            </f.Form>
        </div>
    )
}
