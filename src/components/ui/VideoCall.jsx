import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = '2328e20f409b406da03122249af2fb94';
const CHANNEL = '1234';

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    background-color: #111;
    min-height: 100vh;
`;

const VideoBox = styled.div`
    width: 45%;
    height: 300px;
    background-color: #000;
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    & > div {
        width: 100% !important;
        height: 100% !important;
        position: absolute !important;
        top: 0;
        left: 0;
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export default function VideoCall() {
    const localVideoRef = useRef(null);
    const [remoteVideoUsers, setRemoteVideoUsers] = useState([]);

    const clientRef = useRef(null);
    const localAudioTrackRef = useRef(null);
    const localVideoTrackRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function start() {
            const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            clientRef.current = client;

            client.on('user-published', async (user, mediaType) => {
                await client.subscribe(user, mediaType);

                if (mediaType === 'video') {
                    if (isMounted) {
                        const uid = user.uid;
                        const videoTrack = user.videoTrack;
                        setRemoteVideoUsers((prev) => {
                            if (prev.find((u) => u.uid === uid)) return prev;
                            return [...prev, { uid, videoTrack }];
                        });
                    }
                }

                if (mediaType === 'audio') {
                    user.audioTrack.play();
                }
            });

            client.on('user-unpublished', (user, mediaType) => {
                if (isMounted && mediaType === 'video') {
                    setRemoteVideoUsers((prev) => prev.filter((u) => u.uid !== user.uid));
                }
            });

            await client.join(APP_ID, CHANNEL, null, null);

            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            const videoTrack = await AgoraRTC.createCameraVideoTrack();
            localAudioTrackRef.current = audioTrack;
            localVideoTrackRef.current = videoTrack;

            await client.publish([audioTrack, videoTrack]);

            // 5. Play local video — the ref is always attached by the time
            //    this async code runs (useEffect fires after mount)
            if (localVideoRef.current) {
                videoTrack.play(localVideoRef.current);
            }
        }

        start().catch((err) => {
            console.error('Failed to start video call:', err);
        });

        // Cleanup on unmount
        return () => {
            isMounted = false;

            if (localAudioTrackRef.current) {
                localAudioTrackRef.current.close();
                localAudioTrackRef.current = null;
            }
            if (localVideoTrackRef.current) {
                localVideoTrackRef.current.close();
                localVideoTrackRef.current = null;
            }
            if (clientRef.current) {
                clientRef.current.leave().catch(() => {});
                clientRef.current = null;
            }
        };
    }, []);

    // Play remote tracks into their containers AFTER React has rendered the VideoBoxes
    useEffect(() => {
        remoteVideoUsers.forEach(({ uid, videoTrack }) => {
            if (!videoTrack) return;
            const container = document.getElementById(`remoteVideo${uid}`);
            // Only call play() if Agora hasn't already injected a video element
            if (container && container.childElementCount === 0) {
                videoTrack.play(container);
            }
        });
    }, [remoteVideoUsers]);

    return (
        <Wrapper>
            {/* Local video */}
            <VideoBox ref={localVideoRef} />

            {/* Remote users */}
            {remoteVideoUsers.map((user) => (
                <VideoBox
                    key={user.uid}
                    id={`remoteVideo${user.uid}`}
                />
            ))}
        </Wrapper>
    );
}