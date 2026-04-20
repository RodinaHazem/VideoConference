import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";

/* ─── Global font ─── */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
`;

/* ─── Keyframes ─── */
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatUp = keyframes`
  0%   { transform: translateY(0px) scale(1);    opacity: 0.6; }
  50%  { transform: translateY(-30px) scale(1.05); opacity: 0.4; }
  100% { transform: translateY(0px) scale(1);    opacity: 0.6; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseRing = keyframes`
  0%   { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
  70%  { transform: scale(1);   box-shadow: 0 0 0 14px rgba(99,102,241,0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(99,102,241,0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ─── Styled Components ─── */
const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  background: #0a0a14;
`;

const AnimatedBg = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0a0a14 0%, #0f0e1e 20%, #12102a 40%, #0e1225 60%, #0a0f1e 80%, #0a0a14 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 14s ease infinite;
  z-index: 0;
`;

const Blob = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  animation: ${floatUp} ${({ dur }) => dur || '8s'} ease-in-out infinite;
  animation-delay: ${({ delay }) => delay || '0s'};
`;

const Blob1 = styled(Blob)`
  width: 500px; height: 500px;
  top: -120px; left: -150px;
  background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%);
`;

const Blob2 = styled(Blob)`
  width: 450px; height: 450px;
  bottom: -100px; right: -120px;
  background: radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%);
`;

const GridDots = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
`;

const Card = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  margin: 24px;
  padding: 48px 44px 44px;
  background: rgba(15, 14, 30, 0.72);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  box-shadow:
    0 0 0 1px rgba(99,102,241,0.12),
    0 32px 64px -12px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.06);
  animation: ${fadeInUp} 0.6s cubic-bezier(0.22,1,0.36,1) both;
`;

const LogoBadge = styled.div`
  width: 60px; height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 28px;
  font-size: 26px;
  box-shadow: 0 8px 24px rgba(99,102,241,0.45);
  animation: ${pulseRing} 3s ease-out infinite;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #f1f0fe;
  text-align: center;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: rgba(161,161,188,0.6);
  text-align: center;
  margin: 0 0 32px;
  line-height: 1.6;
`;

const FieldWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: rgba(161,161,188,0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #f1f0fe;
  font-size: 14.5px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;

  &::placeholder { color: rgba(161,161,188,0.35); }

  &:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.14), inset 0 1px 0 rgba(255,255,255,0.04);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.2px;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-top: 8px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    background-size: 200% auto;
    animation: ${shimmer} 2.5s linear infinite;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.5);
    &::before { opacity: 1; }
  }

  &:active:not(:disabled) { transform: translateY(0); }

  &:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
`;

const Spinner = styled.div`
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const AlertBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 1.4;
  animation: ${fadeInUp} 0.3s ease both;
  background: ${({ type }) => type === 'error' ? 'rgba(239,68,68,0.10)' : 'rgba(34,197,94,0.10)'};
  border: 1px solid ${({ type }) => type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'};
  color: ${({ type }) => type === 'error' ? '#fca5a5' : '#86efac'};
`;

const BackLink = styled.p`
  text-align: center;
  margin: 28px 0 0;
  font-size: 13.5px;
  color: rgba(161,161,188,0.65);

  a {
    color: #818cf8;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
    &:hover { color: #a5b4fc; }
  }
`;

/* ─── Component ─── */
export default function SetNewPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!oobCode) {
      setError("Invalid or expired reset link.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess("Password updated! Redirecting to sign in…");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const map = {
        "auth/expired-action-code": "This reset link has expired. Please request a new one.",
        "auth/invalid-action-code": "Invalid reset link. Please request a new one.",
        "auth/weak-password":       "Password is too weak. Use at least 6 characters.",
      };
      setError(map[err.code] || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        <AnimatedBg />
        <GridDots />
        <Blob1 dur="9s" delay="0s" />
        <Blob2 dur="11s" delay="2s" />

        <Card>
          <LogoBadge>🔒</LogoBadge>

          <Title>Set new password</Title>
          <Subtitle>Choose a strong password for your account.</Subtitle>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <AlertBox type="error">
                <span>⚠️</span><span>{error}</span>
              </AlertBox>
            )}
            {success && (
              <AlertBox type="success">
                <span>✅</span><span>{success}</span>
              </AlertBox>
            )}

            <FieldWrapper>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </FieldWrapper>

            <SubmitBtn type="submit" id="setnew-submit" disabled={loading}>
              {loading ? <><Spinner /> Updating…</> : "Update Password"}
            </SubmitBtn>
          </form>

          <BackLink>
            <Link to="/">← Back to Sign In</Link>
          </BackLink>
        </Card>
      </Page>
    </>
  );
}
