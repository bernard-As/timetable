import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "./components/AxiosInstance"
import { setGroup, setTitles } from "./store"
import RequestHandler from "./components/RequestHandler"

const StoreChecker: React.FC = () => {
    const dispatch = useDispatch()
    const userGroup = useSelector((state: any)=> state.user.group)
    const [requestStatus, setRequestStatus] = useState(0)
    useEffect(() => {
        let isMounted = true
        const fetchData = async () => {
            if (userGroup === null) 
            try {
                const response = await axiosInstance.post('http://localhost:8000/api/renewStore/')
                if (isMounted) {
                    dispatch(setGroup(response?.data?.group))
                    dispatch(setTitles(response?.data?.titles))
                }
            } catch (error:any) {
                try{
                    if(error.response.status)
                        setRequestStatus(error.response.status)
                }catch(error){
                    console.log(requestStatus)
                    setRequestStatus(1)
                }
            }
        }

        if (userGroup === null){
            fetchData()
        }

        return () => {
            isMounted = false
        }
    }, [])
    useEffect(()=>{
        setTimeout(()=>{
            setRequestStatus(0)
        },500)
    })
    return (
            <>
                {requestStatus!==0 && (<RequestHandler status={requestStatus} />)}
            </>
        )
}

export default StoreChecker;