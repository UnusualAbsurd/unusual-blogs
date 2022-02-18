import { Dispatch, SetStateAction } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import clsx from "clsx";

interface Props {
  setSearch: Dispatch<SetStateAction<string>>;
  placeholder: string;
  boxSize: "large" | "medium" | "small";
}

export default function SearchBox({ setSearch, placeholder, boxSize }: Props) {
  return (
    <div
      className={clsx(
        "flex items-center text-black space-x-1 bg-white rounded-md",
        boxSize == "large"
          ? "px-5 py-3"
          : boxSize == "medium"
          ? "px-4 py-2"
          : boxSize == "small"
          ? "px-3 py-1"
          : null
      )}
    >
      <AiOutlineSearch />
      <input
        onChange={(e) => setSearch(e.target.value)}
        className="outline-none appearance-none bg-transparent text-black placeholder-gray-600"
        placeholder={placeholder}
      />
    </div>
  );
}
