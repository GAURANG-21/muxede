"use client";

import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  intent?: "primary" | "secondary" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>; // ✅ Correctly types `rest` props

const Button = ({ children, intent = "primary", ...rest }: Props) => {
  return (
    <button
      className={clsx(
        "px-4 py-3 rounded my-4 inline-block w-fit",
        intent === "primary" && "bg-slate-700 hover:bg-slate-800 text-white",
        intent === "secondary" && "text-slate-700 border border-slate-700",
        intent === "danger" && "bg-red-600 hover:bg-red-700 text-white"
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
