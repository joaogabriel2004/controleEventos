type buttonInicialProps = {
    texto: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function ButtonInicial({
  texto,
  onClick
}: buttonInicialProps) {
  return (
    <button className="bg-[#0c0c10] text-white px-4 py-2 rounded-md mt-4 hover:bg-[#1a1a1a] transition-colors w-full h-60" onClick={onClick}>
        {texto}
    </button>
  );
}