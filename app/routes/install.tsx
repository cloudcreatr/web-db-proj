import { Switch } from "~/components/ui/switch"
import { usePWAManager } from "@remix-pwa/client"
import { Button } from "~/components/ui/button"
import { usePush } from '@remix-pwa/push/client'
import { useState, useEffect } from "react"
import { useFetcher } from "@remix-run/react"
import { action } from "./notification"

export default function Install() {
    const { promptInstall } = usePWAManager()
    const { unsubscribeFromPush, subscribeToPush } = usePush()
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)
    const f = useFetcher<typeof action>()
    const isSub = f.state === "submitting";

    useEffect(() => {
        const subid = localStorage.getItem("notification_id")
        setIsNotificationEnabled(!!subid)
    }, [])

    useEffect(() => {
        const notificationId = f.data?.notification_id
        if (notificationId) {
            localStorage.setItem("notification_id", notificationId.toString())
            setIsNotificationEnabled(true)
        }
    }, [f.data])

    const handleNotificationToggle = (enabled: boolean) => {
        if (enabled) {
            console.log("Subscribed")
            subscribeToPush("BJtquP48ha3nCWpv7acvTUFn1TH6QDl6_Cs6-Ia4-EXIWYmVf4rvT0zVeU4Gqr3Q7HWAtigOXoLFY-qYHbSsF3g", (subscription) => {
                f.submit({
                    action: "subscribe",
                    subscription: JSON.stringify(subscription.toJSON())
                }, {
                    method: "POST",
                    action: "/notification"
                })
            }, (error) => {
                console.log("Error", error)
                setIsNotificationEnabled(false)
            })
        } else {
            console.log("Unsubscribed")
            const id = localStorage.getItem("notification_id")
            unsubscribeFromPush(() => {
                console.log("Unsubscribed")
                f.submit({
                    action: "unsubscribe",
                    id: id
                }, {
                    method: "POST",
                    action: "/notification"
                })
                localStorage.removeItem("notification_id")
                setIsNotificationEnabled(false)
            })
        }
    }

    return (
        <div>
            <div className="bg-white rounded-xl p-6 shadow-md shadow-blue-200">
                <h1 className="font-bold text-2xl mb-4">
                    Install the app
                </h1>
                <p className="text-gray-600">
                    You can install the app by clicking the install button below
                </p>

                <Button className="mt-2" variant="outline" onClick={() => promptInstall()}>Install Now</Button>

                <div className="flex gap-2 justify-between items-center p-4 border-2 rounded-2xl mt-4 shadow-md">
                    <p className="font-medium">
                        Get Push Notifications For New Posts and Updates
                    </p>

                    <Switch
                        disabled={isSub}
                        checked={isNotificationEnabled}
                        onCheckedChange={handleNotificationToggle}
                    />
                </div>
            </div>
        </div>
    )
}