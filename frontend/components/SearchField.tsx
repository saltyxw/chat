interface SearchProps {
    searchValue: string;
    onChange: ((value: string) => void);
    placeholder?: string;
    children?: React.ReactNode;
}

export default function Search({
    searchValue,
    onChange,
    placeholder,
    children,
}: SearchProps) {
    return (
        <div className="relative max-w-xs mt-4">
            <input
                className="p-2 bg-neutral-700 text-white w-full rounded-2xl"
                type="search"
                value={searchValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {children && (
                <div className="absolute w-full bg-neutral-700 mt-1 rounded shadow">
                    {children}
                </div>
            )}
        </div>
    );
}

