import React , { useEffect , useRef , useState } from 'react'
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
    const clientRef = useRef(null);
  const initialized = useRef(false);
    const [remoteVideoUsers, setRemoteVideoUsers] = useState([])
    useEffect(()=>{
        async function init() {
            if (initialized.current) return;
            initialized.current = true;

            ////////////////////////////////
            const client = createClient({ mode: "rtc", codec: "vp8" })
            clientRef.current = client;
            await client.join(App_id , "1234" , null , null)
            const [micTrack , camTrack] = await createMicrophoneAndCameraTracks()
            await client.publish([micTrack , camTrack])
            camTrack.play(localVideo.current);
            client.on("user-published" , async(user , mediaType) =>{
                await client.subscribe(user , mediaType)
                if (mediaType === "video") {
                    
                    setRemoteVideoUsers(prev => {
                        const exist = prev.find(u => u.uid === user.uid)
                        if (exist) return prev
                        else return [...prev, user]
                    })
                    setTimeout(()=>{
                        user.videoTrack?.play("remoteVideo" + user.uid)
                    },100)
                }
                if(mediaType === "audio"){
                    user.audioTrack?.play()
                }
            })
            client.on("user-unpublished" , async(user , mediaType) =>{
                if(mediaType === "video"){
                    setRemoteVideoUsers(prev => prev.filter(u => u.uid !== user.uid))
                }
            })
        }
        init()
        return () => {
        if (clientRef.current) {
          clientRef.current.removeAllListeners();
          clientRef.current.leave();
        }
      };
    
    },[])


 
    return(
        <div>
            <Video ref={localVideo} /> 
            {remoteVideoUsers.map((user) => (
                <Video key={user.uid} 
                id={`remoteVideo${user.uid}`}/>
            ))}
        </div>
    )
}