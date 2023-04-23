import Menu from "@components/Menu"
import Spinner from "@components/Spinner"
import { parseISO } from "date-fns"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { now } from "~/constants/config"
import { api } from "~/utils/api"

interface menuProps {}

const menu: FC<menuProps> =({}) => {
    const router = useRouter()

    const [selectedTime, setSelectedTime] = useState<string | null>(null)  // as ISO string
    const { isFetchedAfterMount } = api.menu.checkMenuStatus.useQuery(undefined, {
        onError: () => {
            // Check for validity of selectedTime failed 
            // Handle error accordingly (e.g. redirect to home page)
        }
    })

    useEffect(() => {
        const selectedTime = localStorage.getItem('selectedTime')
        if (!selectedTime) router.push('/')
        else {
            const date = parseISO(selectedTime)
            if (date < now) router.push('/')

            // Date is valid
            setSelectedTime(selectedTime)
        }
    }, [])

    return (
        <>
            {isFetchedAfterMount && selectedTime ? (
                <>
                    <button
                        onClick={() => router.push('/')}
                    >
                        Back to time selection
                    </button>
                    <Menu selectedTime={selectedTime} />
                </>
            ) : (
                <Spinner />
            )}
        </>
    )
}

export default menu