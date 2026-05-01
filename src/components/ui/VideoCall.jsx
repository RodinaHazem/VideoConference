import React , { useEffect , useRef} from 'react'
import styled from 'styled-components'
import { createClient , createMicrophoneAndCameraTracks } from 'agora-rtc-sdk-ng'
const Video = styled.video`
    width: 50%;
    height: 50%;
    background-color: black;
`;

export default function VideoCall() {
    const App_id = "2328e20f409b406da03122249af2fb94";
    const localVideo = useRef(null);
    useEffect(()=>{
        async function init(){
            const client = createClient({mode : "rtc", codec : "vp8"})
            await client.join(App_id , "1234" , null , null)
            const [micTrack , camTrack] = await createMicrophoneAndCameraTracks()
            await client.publish([micTrack , camTrack])
            camTrack.play(localVideo.current);
        }
        init()
    },[])
    
 
    return(
        <div>
            <Video ref={localVideo} /> 
       
        </div>
    )
}