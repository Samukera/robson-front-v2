type Props = {
  title: string;
  onCompleted: (value: string) => void;
};

import { useState } from "react";

export default function Modal({ title, onCompleted }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim().length > 0) {
      onCompleted(value);
      setValue("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="border rounded px-4 py-2 w-72"
          placeholder="Seu nome"
          maxLength={25}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
