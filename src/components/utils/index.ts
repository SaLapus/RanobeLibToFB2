import { styled } from "@linaria/react";

const Checkbox = styled.div<{ checked: boolean }>`
  width: 16px;
  height: 16px;
  border: 2px solid
    ${(props) =>
      props.checked ? "var(--color-normal)" : "var(--font-primary)"};
  border-radius: 3px;
  background-color: ${(props) =>
    props.checked ? "var(--color-normal)" : "transparent"};
  position: static;

  &::after {
    content: "";
    display: ${(props) => (props.checked ? "block" : "none")};
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    position: relative;
    top: 0;
    left: 5px;
  }
`;

// interface DropDownProps {
//   children: ds
// }

// const DropDown = function DropDown({children}: DropDownProps) {
//   const [status, toggle] = useState<boolean>(false);
// }

export {
  Checkbox
};

