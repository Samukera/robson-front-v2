import { useState } from 'react';

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  onCompleted: () => void;
  placeholder?: string;
  maxLength?: number;
};

export default function Input({
  value,
  onChange,
  onCompleted,
  placeholder = '',
  maxLength = 100,
}: InputProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleCompleted = () => {
    if (inputValue.length > 0) {
      onCompleted();
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCompleted();
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        id="selectNameInput"
        value={inputValue}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        maxLength={maxLength}
        minLength={1}
        placeholder={placeholder}
        className="w-[295px] h-[45px] border-none outline-none text-[20px] rounded-l-[10px] px-2 text-black"
      />
      <button
        type="submit"
        aria-label="Use name"
        onClick={handleCompleted}
        className="w-[50px] h-[45px] bg-white border-none rounded-r-[10px] cursor-pointer"
      >
        ➤
      </button>
    </div>
  );
}
