import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

/* ─── Global font import ─── */
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
  0%   { transform: translateY(0px) scale(1);   opacity: 0.6; }
  50%  { transform: translateY(-30px) scale(1.05); opacity: 0.4; }
  100% { transform: translateY(0px) scale(1);   opacity: 0.6; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseRing = keyframes`
  0%   { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5); }
  70%  { transform: scale(1);   box-shadow: 0 0 0 14px rgba(99, 102, 241, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
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
  background: linear-gradient(
    135deg,
    #0a0a14 0%,
    #0f0e1e 20%,
    #12102a 40%,
    #0e1225 60%,
    #0a0f1e 80%,
    #0a0a14 100%
  );
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

const Blob3 = styled(Blob)`
  width: 300px; height: 300px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
`;

const Card = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  margin: 24px;
  padding: 48px 44px 44px;
  background: rgba(15, 14, 30, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.12),
    0 32px 64px -12px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  animation: ${fadeInUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const LogoBadge = styled.div`
  width: 60px; height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 28px;
  font-size: 26px;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
  animation: ${pulseRing} 3s ease-out infinite;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #f1f0fe;
  text-align: center;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  margin-top: 24px;
`;

const FieldWrapper = styled.div`
  position: relative;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: rgba(161, 161, 188, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 14px 14px 44px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #f1f0fe;
  font-size: 14.5px;
  font-family: inherit;
  font-weight: 400;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: rgba(161, 161, 188, 0.35);
  }

  &:focus {
    border-color: rgba(99, 102, 241, 0.6);
    background: rgba(99, 102, 241, 0.06);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.14), inset 0 1px 0 rgba(255,255,255,0.04);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 30px;
  top: 50%;
  translate: 50%;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: rgba(161, 161, 188, 0.5);
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s;
  line-height: 1;

  &:hover { color: rgba(161, 161, 188, 0.9); }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  background-size: 200% auto;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.2px;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
  display: flex; align-items: center; justify-content: center; gap: 8px;

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
    box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);

    &::before { opacity: 1; }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Spinner = styled.div`
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #fca5a5;
  line-height: 1.4;
  animation: ${fadeInUp} 0.3s ease both;
`;

const SuccessBox = styled(ErrorBox)`
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.25);
  color: #86efac;
`;

const LoginPrompt = styled.p`
  text-align: center;
  margin: 28px 0 0;
  font-size: 13.5px;
  color: rgba(161, 161, 188, 0.65);

  a {
    color: #818cf8;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
    &:hover { color: #a5b4fc; }
  }
`;

const GridDots = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
`;

/* ─── Component ─── */
export default function SignUp() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const getFriendlyError = (code) => {
    const map = {
      'auth/email-already-in-use': 'This email is already in use.',
      'auth/invalid-email':        'Please enter a valid email address.',
      'auth/weak-password':        'Password should be at least 6 characters.',
      'auth/too-many-requests':    'Too many attempts. Please wait and try again.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(`Account created for ${credential.user.email}! Redirecting...`);
    } catch (err) {
      setError(getFriendlyError(err.code));
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
        <Blob3 dur="7s" delay="4s" />

        <Card>
          <LogoBadge>✨</LogoBadge>

          <Title>Create an account</Title>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <ErrorBox>
                <span>⚠️</span>
                <span>{error}</span>
              </ErrorBox>
            )}
            {success && (
              <SuccessBox>
                <span>✅</span>
                <span>{success}</span>
              </SuccessBox>
            )}

            <FieldGroup>
              <FieldWrapper>
                <FieldLabel htmlFor="signup-email">Email address</FieldLabel>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                <Input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁️'}
                </PasswordToggle>
              </FieldWrapper>
            </FieldGroup>

            <SubmitBtn type="submit" id="signup-submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  Creating account...
                </>
              ) : (
                <>
                Sign Up
                </>
              )}
            </SubmitBtn>
          </form>

          <LoginPrompt>
            <div>
              Already have an account?
            </div>
            <Link to={'/'}>Sign in here</Link>
          </LoginPrompt>
        </Card>
      </Page>
    </>
  );
}
