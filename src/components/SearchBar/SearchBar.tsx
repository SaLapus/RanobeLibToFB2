import { seachInput } from "./SearchBar.module.css";

interface SearchProps {
  onValue: (slug: string) => void;
  // setActive: (_: boolean) => void;
}

// let timer: number | undefined;
export default function SearchBar({ onValue }: SearchProps) {
  return (
    <div>
      <input
        className={seachInput}
        type="search"
        name="novelSearch"
        id="q"
        placeholder="Искать вашу любимую новеллу"
        // onFocus={() => setActive(true)}
        // onBlur={() => (timer = setTimeout(() => setActive(false), 100))}
      />
      <button
        onClick={() => {
          const q = document.querySelector<HTMLInputElement>("input#q");
          if (q) {
            onValue(q.value);
            // q.focus();
          }

          // clearTimeout(timer);
        }}
      >
        Найти
      </button>
    </div>
  );
}
