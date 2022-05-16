import styled from '@emotion/styled';

const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-image: url('terrian.png');
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.7);
  animation-name: overlay;
  animation-duration: 2s;

  @keyframes overlay {
    from {
      box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 1);
    }
    to {
      box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.7);
    }
  }
`;

const MetamaskIcon = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);

  animation: opacityShow 5s;

  @keyframes opacityShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Button = styled.button`
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: -webkit-linear-gradient(left, #e5771b, #753d16);
  background-size: 200% 200%;
  /* border: 1px solid #dbdbdb; */
  border-radius: 4px;
  border-width: 1px;
  padding: 13px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.2em;

  animation: opacityShow 5s, slideShow 1s;

  @keyframes opacityShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideShow {
    from {
      top: 55%;
      left: 50%;
    }
    to {
      top: 50%;
      left: 50%;
    }
  }
`;

interface LoginProps {
  login: () => void;
}

const Login: React.FC<LoginProps> = ({ login }) => {
  return (
    <Wrapper>
      <MetamaskIcon>
        <img
          src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
          alt="MetaMask Fox logo"
          height="120"
          width="120"
        ></img>
      </MetamaskIcon>
      <Button onClick={login}>Connect to MetaMask to Continue</Button>
    </Wrapper>
  );
};

export default Login;
