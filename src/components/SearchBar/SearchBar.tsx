import { Input } from "antd";

interface SearchProps {
  onValue: (slug: string) => void;
  // setActive: (_: boolean) => void;
}

// let timer: number | undefined;
export default function SearchBar({ onValue }: SearchProps) {
  return (
      <Input.Search
        allowClear={true}
        onSearch={onValue}
        placeholder="Искать вашу любимую новеллу"
        style={{
          width: "20rem",
        }}
      />
  );
}
