import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/css';

const Wrapper = styled.div<{ sideLabel?: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: ${({ sideLabel }) => (sideLabel ? 'row' : 'column')};
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  width: ${({ sideLabel }) => (sideLabel ? '250px' : '125px')};

  img {
    margin: auto;
    ${({ sideLabel }) =>
      sideLabel
        ? `
            width: 75%;
            height: 75%;
          `
        : `
            width: 50%;
            height: 50%;
          `}

    &.icon-hover {
      display: none;
    }
  }
  .label {
    margin: ${({ sideLabel }) => (sideLabel ? '0' : 'auto')};
  }
  &:hover {
    img {
      &.icon {
        display: none;
      }
      &.icon-hover {
        display: block;
      }
    }
  }
`;

interface CityIconProps {
  label: string;
  icon: string;
  hoverIcon: string;
  onClick: () => void;
  sideLabel?: boolean;
}

const CityIcon = forwardRef<HTMLDivElement, CityIconProps>(
  ({ label, icon, hoverIcon, onClick, sideLabel }, ref) => {
    return (
      <Wrapper ref={ref} sideLabel={sideLabel} onClick={onClick}>
        <div
          className={css`
            display: flex;
            justify-content: center;
            ${sideLabel &&
            css`
              width: 75px;
            `}
          `}
        >
          <img className="icon" src={icon} alt={label} />
          <img className="icon-hover" src={hoverIcon} alt={label + 'Hover'} />
        </div>
        <div
          className={css`
            display: flex;
            justify-content: ${sideLabel ? 'left' : 'center'};
            ${sideLabel &&
            css`
              width: 175px;
            `};
          `}
        >
          <div className="label">
            {label.replace('-z', ' & z').replace('-i', ' i').toUpperCase()}
          </div>
        </div>
      </Wrapper>
    );
  }
);

export default CityIcon;
